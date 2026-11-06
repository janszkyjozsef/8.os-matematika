import test from "node:test";
import assert from "node:assert/strict";
import { generateExercise } from "../src/math/generators.ts";
import { gradeAnswer } from "../src/math/engine.ts";
import { encodePartResponses } from "../src/math/engine.ts";
import { LEGACY_TOPICS, V2_TOPICS, SCHEMA_VERSION } from "../src/topics.ts";
import { emptyLearningLog, MAX_LEARNING_EVENTS } from "../src/learning/skills.ts";
import {
  emptyProfile,
  emptyAttempt,
  recordGrade,
  validateProfile,
  serializeProfile,
  parseImport,
  loadProfile,
  saveProfile,
  STORAGE_KEY,
  TOPICS,
  MAX_ATTEMPTS,
  MAX_IMPORT_BYTES,
} from "../src/progress.ts";

test("wrong answer followed by correction is helped practice, not independent evidence", () => {
  const first = recordGrade(emptyAttempt("tortek"), {
    status: "incorrect",
    correct: false,
    message: "A közös egységet keresd.",
  });
  const corrected = recordGrade(first, {
    status: "correct",
    correct: true,
    message: "Helyes.",
  });
  assert.equal(corrected.success, true);
  assert.equal(corrected.independent, false);
  assert.equal(corrected.assisted, true);
});
test("invalid syntax does not consume an independent first mathematical attempt", () => {
  const first = recordGrade(emptyAttempt("tortek"), {
    status: "invalid",
    correct: false,
    message: "Nem olvasható.",
  });
  const correct = recordGrade(first, {
    status: "correct",
    correct: true,
    message: "Helyes.",
  });
  assert.equal(correct.independent, true);
  assert.equal(correct.tries, 1);
});
test("a later explanation does not erase earlier independent evidence", () => {
  const first = recordGrade(emptyAttempt("tortek"), {
    status: "correct",
    correct: true,
    message: "Helyes.",
  });
  const later = recordGrade(
    { ...first, assisted: true, revealed: true },
    { status: "correct", correct: true, message: "Helyes." },
  );
  assert.equal(later.independent, true);
  assert.equal(later.success, true);
});

test("valid profile round-trip keeps task, scaffold and workshop state", () => {
  const p = emptyProfile();
  p.lessons.tortek.step = 4;
  p.lessons.tortek.visited = [0, 1, 4];
  p.lessons.tortek.lab = { denominator: 12, numerator: 7, shared: true };
  p.attempts["tortek-p1"] = {
    ...emptyAttempt("tortek"),
    input: "7/12",
    tries: 2,
    hintLevel: 1,
    assisted: true,
    success: true,
    independent: false,
  };
  const restored = parseImport(JSON.stringify(p));
  assert.deepEqual(restored, p);
  assert.equal(restored.attempts["tortek-p1"].independent, false);
});
test("validation copies state and never modifies the source", () => {
  const p = emptyProfile();
  p.lessons.valoszinuseg.lab = { counts: [1, 2, 3], n: 6 };
  const q = validateProfile(p);
  (q.lessons.valoszinuseg.lab.counts as number[])[0] = 99;
  assert.deepEqual(p.lessons.valoszinuseg.lab.counts, [1, 2, 3]);
});
test("unknown schema, corrupt json, missing topics and contradictory success are rejected", () => {
  assert.throws(() => parseImport("{broken"));
  assert.throws(() =>
    validateProfile({ ...emptyProfile(), schemaVersion: 99 }),
  );
  const p: any = emptyProfile();
  delete p.lessons.grafikon;
  assert.throws(() => validateProfile(p));
  const q = emptyProfile();
  q.attempts["bad"] = {
    ...emptyAttempt("tortek"),
    independent: true,
    success: false,
  };
  assert.throws(() => validateProfile(q));
});
test("untrusted imported messages are not preserved", () => {
  const p = emptyProfile();
  p.attempts["q1"] = {
    ...emptyAttempt("egyenlet"),
    result: {
      status: "correct",
      correct: true,
      message: "<script>bad()</script>",
    },
  };
  assert.equal(validateProfile(p).attempts.q1.result, undefined);
});
test("invalid state fails validation", () => {
  const p = emptyProfile();
  p.lessons.tortek.lab = { x: Infinity };
  assert.throws(() => validateProfile(p));
  const q = emptyProfile();
  q.lessons.tortek.step = 6;
  assert.throws(() => validateProfile(q));
  const r = emptyProfile();
  r.lessons.tortek.exitRound = -1;
  assert.throws(() => validateProfile(r));
});
test("load failure preserves original storage; write failures are visible", () => {
  const backing = new Map([[STORAGE_KEY, "{broken"]]);
  const loaded = loadProfile({ getItem: (key) => backing.get(key) || null });
  assert.ok(loaded.problem);
  assert.equal(backing.get(STORAGE_KEY), "{broken");
  const error = saveProfile(emptyProfile(), {
    setItem() {
      throw new Error("quota exceeded");
    },
  });
  assert.ok(error.includes("nem tudja"));
});
test("save only writes the project namespace and produces readable data", () => {
  const writes: [string, string][] = [];
  const p = emptyProfile();
  assert.equal(
    saveProfile(p, {
      setItem: (k, v) => {
        writes.push([k, v]);
      },
    }),
    "",
  );
  assert.equal(writes.length, 1);
  assert.equal(writes[0][0], STORAGE_KEY);
  assert.deepEqual(parseImport(writes[0][1]), p);
});

test("a real generated task survives saving and loading the local profile", () => {
  const exercise = generateExercise("tortek", 1, 0);
  assert.equal(exercise.answer.kind, "number");
  if (exercise.answer.kind !== "number")
    throw new Error("Expected numeric task");
  assert.ok(exercise.id.includes("seed=1:variant=0"));
  const input = exercise.answer.expected;
  const p = emptyProfile();
  p.lessons.tortek.generatedMode = true;
  p.attempts[exercise.id] = recordGrade(
    { ...emptyAttempt("tortek"), input },
    gradeAnswer(exercise, input),
  );
  const storage = new Map<string, string>();
  assert.equal(
    saveProfile(p, { setItem: (key, value) => storage.set(key, value) }),
    "",
  );
  const loaded = loadProfile({ getItem: (key) => storage.get(key) ?? null });
  assert.equal(loaded.problem, "");
  assert.equal(loaded.profile.lessons.tortek.generatedMode, true);
  assert.deepEqual(Object.keys(loaded.profile.attempts), [exercise.id]);
  assert.equal(loaded.profile.attempts[exercise.id].input, input);
  assert.equal(loaded.profile.attempts[exercise.id].success, true);
  assert.equal(loaded.profile.attempts[exercise.id].independent, true);
  assert.equal(loaded.profile.attempts[exercise.id].tries, 1);
  assert.equal(loaded.profile.attempts[exercise.id].result, undefined);
});

test("an exported profile with a real generated task can be imported again", () => {
  const exercise = generateExercise("valoszinuseg", 50_006, 0);
  const p = emptyProfile();
  p.reviewSeed = 6;
  p.attempts[exercise.id] = {
    ...emptyAttempt("valoszinuseg"),
    input: "1/2",
    hintLevel: 1,
    assisted: true,
  };
  const restored = parseImport(JSON.stringify(p, null, 2));
  assert.deepEqual(restored, p);
  assert.equal(restored.attempts[exercise.id].assisted, true);
  assert.equal(restored.attempts[exercise.id].independent, false);
});

test("5000 real generated task records survive clean serialization and import", () => {
  const p = emptyProfile();
  p.reviewSeed = 5000;
  for (let index = 0; index < 5000; index++) {
    const topic = LEGACY_TOPICS[index % LEGACY_TOPICS.length];
    const exercise = generateExercise(
      topic,
      50_001 + index,
      Math.floor(index / LEGACY_TOPICS.length) % 3,
    );
    if (exercise.answer.kind !== "number")
      throw new Error("Expected numeric task");
    const input = exercise.answer.expected;
    p.attempts[exercise.id] = recordGrade(
      { ...emptyAttempt(topic), input },
      gradeAnswer(exercise, input),
    );
  }
  assert.equal(Object.keys(p.attempts).length, 5000);
  const original = JSON.stringify(p);
  const text = serializeProfile(p);
  const restored = parseImport(text);
  assert.ok(Buffer.byteLength(text, "utf8") <= MAX_IMPORT_BYTES);
  assert.equal(text.includes("\n"), false);
  assert.equal(text.includes('"result":'), false);
  assert.equal(
    JSON.stringify(p),
    original,
    "serialization must not mutate live feedback",
  );
  const expectedAttempts = Object.fromEntries(
    Object.entries(p.attempts).map(([id, { result, ...attempt }]) => [
      id,
      attempt,
    ]),
  );
  assert.deepEqual(restored, { ...p, attempts: expectedAttempts });
  assert.ok(
    Object.values(restored.attempts).every((attempt) => attempt.independent),
  );
});

test("10001 records cannot overwrite a previous save; 10000 remain supported", () => {
  const p = emptyProfile();
  for (let index = 0; index <= MAX_ATTEMPTS; index++)
    p.attempts[`task-${index}`] = emptyAttempt("tortek");
  const previous = serializeProfile(emptyProfile());
  const backing = new Map([[STORAGE_KEY, previous]]);
  let writes = 0;
  const error = saveProfile(p, {
    setItem(key, value) {
      writes++;
      backing.set(key, value);
    },
  });
  assert.match(error, /10000 feladatrekord/);
  assert.equal(writes, 0);
  assert.equal(backing.get(STORAGE_KEY), previous);
  delete p.attempts[`task-${MAX_ATTEMPTS}`];
  assert.equal(
    Object.keys(parseImport(serializeProfile(p)).attempts).length,
    MAX_ATTEMPTS,
  );
});

test("the import boundary uses UTF-8 bytes and accepts exactly the shared limit", () => {
  const p = emptyProfile();
  const base = JSON.stringify({ ...p, padding: "" });
  const remainingBytes = MAX_IMPORT_BYTES - Buffer.byteLength(base, "utf8");
  const padding =
    "á".repeat(Math.floor(remainingBytes / 2)) +
    (remainingBytes % 2 === 1 ? "a" : "");
  const atLimit = JSON.stringify({ ...p, padding });
  assert.equal(Buffer.byteLength(atLimit, "utf8"), MAX_IMPORT_BYTES);
  assert.ok(atLimit.length < MAX_IMPORT_BYTES);
  assert.deepEqual(parseImport(atLimit), p);
  const overLimit = atLimit + " ";
  assert.ok(overLimit.length < MAX_IMPORT_BYTES);
  assert.equal(Buffer.byteLength(overLimit, "utf8"), MAX_IMPORT_BYTES + 1);
  assert.throws(() => parseImport(overLimit), /16 MB \(16000000 bájt\)/);
});

test("an oversized valid profile is rejected before it can replace saved data", () => {
  const p = emptyProfile();
  for (let index = 0; index < MAX_ATTEMPTS; index++) {
    const id = `task-${index}`.padEnd(160, "x");
    p.attempts[id] = {
      ...emptyAttempt("valoszinuseg"),
      input: "\u0000".repeat(200),
    };
  }
  for (const topic of TOPICS) {
    for (let index = 0; index < 50; index++)
      p.lessons[topic].lab[`data${index}`] = Array<number>(1000).fill(-1e12);
  }
  const validated = validateProfile(p);
  const unbounded = JSON.stringify(validated);
  assert.ok(Buffer.byteLength(unbounded, "utf8") > MAX_IMPORT_BYTES);
  assert.throws(() => parseImport(unbounded), /16 MB \(16000000 bájt\)/);
  assert.throws(() => serializeProfile(p), /16 MB \(16000000 bájt\)/);
  const previous = serializeProfile(emptyProfile());
  let stored = previous;
  let writes = 0;
  const error = saveProfile(p, {
    setItem(_key, value) {
      writes++;
      stored = value;
    },
  });
  assert.match(error, /16 MB \(16000000 bájt\)/);
  assert.equal(writes, 0);
  assert.equal(stored, previous);
});

function legacyProfile() {
  const source = emptyProfile();
  source.appVersion = "0.1.1";
  source.updatedAt = "2026-11-06T09:30:00.000Z";
  source.settings = { calm: true, largeText: true };
  source.lastTopic = "tortek";
  source.reviewSeed = 67;
  source.lessons.tortek = {
    step: 4,
    visited: [0, 1, 2, 4],
    lab: { n: 3, d: 4, shared: true },
    practiceIndex: 6,
    generatedSeed: 14,
    generatedMode: true,
    exitRound: 2,
    exampleSteps: [3, 2],
  };
  source.lessons.valoszinuseg.lab = { counts: [0, 1, 0, 3], n: 4 };
  source.attempts["tortek-p1"] = {
    ...emptyAttempt("tortek"),
    input: "7/12",
    tries: 1,
    success: true,
    independent: true,
    updatedAt: source.updatedAt,
  };
  source.attempts["exit:tortek:2:0"] = {
    ...emptyAttempt("tortek"),
    input: "2/3",
    tries: 2,
    hintLevel: 1,
    assisted: true,
    success: true,
    updatedAt: source.updatedAt,
  };
  return {
    ...source,
    schemaVersion: 1,
    lessons: Object.fromEntries(
      LEGACY_TOPICS.map((id) => [id, source.lessons[id]]),
    ),
  };
}

test("a real six-topic schema-1 shape migrates without changing existing learning data", () => {
  const legacy = legacyProfile();
  const snapshot = JSON.stringify(legacy);
  const migrated = parseImport(snapshot);
  assert.equal(migrated.schemaVersion, SCHEMA_VERSION);
  assert.equal(
    migrated.appVersion,
    "0.1.1",
    "recorded app version is separate from schema version",
  );
  assert.equal(migrated.updatedAt, legacy.updatedAt);
  assert.deepEqual(migrated.settings, legacy.settings);
  assert.deepEqual(migrated.attempts, legacy.attempts);
  assert.equal(migrated.lastTopic, legacy.lastTopic);
  assert.equal(migrated.reviewSeed, legacy.reviewSeed);
  assert.equal(migrated.legacyReviewSeed, legacy.reviewSeed);
  assert.equal(migrated.legacyReviewSchema, 1);
  assert.deepEqual(migrated.learning, emptyLearningLog());
  for (const id of LEGACY_TOPICS)
    assert.deepEqual(migrated.lessons[id], legacy.lessons[id], id);
  const blank = emptyProfile();
  for (const id of TOPICS.filter(
    (id) => !(LEGACY_TOPICS as readonly string[]).includes(id),
  )) {
    assert.deepEqual(migrated.lessons[id], blank.lessons[id], id);
  }
  assert.equal(Object.keys(migrated.lessons).length, TOPICS.length);
  assert.equal(
    JSON.stringify(legacy),
    snapshot,
    "migration must not mutate its source",
  );
  migrated.lessons.valoszinuseg.lab.counts = [99];
  assert.deepEqual(legacy.lessons.valoszinuseg.lab.counts, [0, 1, 0, 3]);
});

test("legacy local storage and an exported legacy JSON both survive migration and reload", () => {
  const exported = JSON.stringify(legacyProfile());
  const backing = new Map([[STORAGE_KEY, exported]]);
  const loaded = loadProfile({ getItem: (key) => backing.get(key) ?? null });
  assert.equal(loaded.problem, "");
  assert.equal(
    backing.get(STORAGE_KEY),
    exported,
    "read-only loading must not rewrite the old copy",
  );
  assert.deepEqual(loaded.profile, parseImport(exported));
  loaded.profile.lessons.szamfogalom.step = 1;
  loaded.profile.lessons.szamfogalom.visited = [0, 1];
  loaded.profile.appVersion = "0.3.0";
  assert.equal(
    saveProfile(loaded.profile, {
      setItem: (key, value) => backing.set(key, value),
    }),
    "",
  );
  assert.equal(JSON.parse(backing.get(STORAGE_KEY)!).schemaVersion, SCHEMA_VERSION);
  const reloaded = loadProfile({ getItem: (key) => backing.get(key) ?? null });
  assert.deepEqual(reloaded.profile, loaded.profile);
  assert.equal(reloaded.profile.attempts["tortek-p1"].independent, true);
  assert.equal(reloaded.profile.lessons.szamfogalom.step, 1);
});

test("migration never repairs a missing old topic or weakens the current schema", () => {
  const old: any = legacyProfile();
  delete old.lessons.grafikon;
  assert.throws(() => validateProfile(old), /grafikon/);
  for (const id of TOPICS) {
    const current: any = emptyProfile();
    delete current.lessons[id];
    assert.throws(() => validateProfile(current), /leckeállapot/, id);
  }
  const hybrid: any = legacyProfile();
  hybrid.lessons.szamfogalom = emptyProfile().lessons.szamfogalom;
  assert.throws(() => validateProfile(hybrid), /ismeretlen leckét/);
  const badAttempt: any = legacyProfile();
  badAttempt.attempts["new-task"] = emptyAttempt("szamfogalom");
  assert.throws(() => validateProfile(badAttempt), /feladatállapot/);
  const unknown: any = emptyProfile();
  unknown.lessons.futureTopic = unknown.lessons.tortek;
  assert.throws(() => validateProfile(unknown), /ismeretlen leckét/);
});

test("the currently open legacy mixed task survives import and reload without freezing future practice", () => {
  const old = legacyProfile();
  const current = parseImport(JSON.stringify(old));
  const replay = parseImport(serializeProfile(current));
  assert.equal(replay.legacyReviewSeed, 67);
  assert.equal(replay.legacyReviewSchema, 1);
  const oldTopic = LEGACY_TOPICS[(old.reviewSeed - 1) % LEGACY_TOPICS.length];
  const oldVariant =
    Math.floor((old.reviewSeed - 1) / LEGACY_TOPICS.length) % 3;
  const oldTask = generateExercise(
    oldTopic,
    50_000 + old.reviewSeed,
    oldVariant,
  );
  assert.equal(
    oldTask.id,
    generateExercise(oldTopic, 50_000 + replay.reviewSeed, oldVariant).id,
  );
  const { legacyReviewSeed, legacyReviewSchema, ...rest } = replay;
  const next = parseImport(
    serializeProfile({ ...rest, reviewSeed: replay.reviewSeed + 1 }),
  );
  assert.equal(next.legacyReviewSeed, undefined);
  assert.equal(next.legacyReviewSchema, undefined);
  assert.throws(
    () => validateProfile({ ...replay, legacyReviewSeed: 12 }),
    /korábbi vegyes/,
  );
  assert.throws(
    () => validateProfile({ ...replay, legacyReviewSeed: "67" }),
    /korábbi vegyes/,
  );
});

test("structured responses and opted-in own-word explanations survive save/import", () => {
  const p = emptyProfile();
  const input = encodePartResponses(
    Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [
        `part${i}`,
        "1234567890".repeat(12),
      ]),
    ),
  );
  assert.ok(input.length > 200);
  p.attempts["SZ01-G01"] = {
    ...emptyAttempt("szamfogalom"),
    input,
    reflection: "A 8/4 értéke 2, ezért természetes szám is.",
  };
  const restored = parseImport(serializeProfile(p));
  assert.deepEqual(restored.attempts, p.attempts);
  assert.equal(
    restored.attempts["SZ01-G01"].success,
    false,
    "reasoning text is not auto-graded",
  );
  const grade = recordGrade(restored.attempts["SZ01-G01"], {
    status: "correct",
    correct: true,
    message: "Helyes.",
  });
  assert.equal(grade.reflection, p.attempts["SZ01-G01"].reflection);
});

test("extended response validation admits only the new bounded format", () => {
  const invalidInputs = [
    "1".repeat(201),
    JSON.stringify({ part: "x".repeat(181), another: "y".repeat(40) }),
    JSON.stringify(
      Object.fromEntries(
        Array.from({ length: 17 }, (_, i) => [`part${i}`, "x".repeat(20)]),
      ),
    ),
    '{"constructor":"' +
      "x".repeat(170) +
      '","part":"' +
      "y".repeat(100) +
      '"}',
    JSON.stringify({ part: { nested: "x".repeat(200) } }),
  ];
  for (const input of invalidInputs) {
    const p = emptyProfile();
    p.attempts["parts"] = { ...emptyAttempt("szamfogalom"), input };
    assert.ok(input.length > 200);
    assert.throws(() => validateProfile(p), /feladatállapot/);
  }
  const legacy: any = legacyProfile();
  legacy.attempts["tortek-p1"].input = encodePartResponses({
    a: "x".repeat(180),
    b: "y".repeat(180),
  });
  assert.throws(
    () => validateProfile(legacy),
    /feladatállapot/,
    "schema 1 keeps its original input limit",
  );
  for (const reflection of [7, {}, "x".repeat(2001)]) {
    const p: any = emptyProfile();
    p.attempts["reasoning"] = { ...emptyAttempt("szamfogalom"), reflection };
    assert.throws(() => validateProfile(p), /indoklás/);
  }
});

test("a corrupt legacy save remains byte-for-byte untouched after failed migration", () => {
  const legacy: any = legacyProfile();
  legacy.lessons.tortek.generatedSeed = -1;
  const original = JSON.stringify(legacy);
  const backing = new Map([[STORAGE_KEY, original]]);
  const result = loadProfile({ getItem: (key) => backing.get(key) ?? null });
  assert.match(result.problem, /Változatlanul megőriztem/);
  assert.equal(backing.get(STORAGE_KEY), original);
});

function schema2Profile() {
  const { learning, legacyReviewSeed, legacyReviewSchema, ...source } = emptyProfile();
  source.settings = { calm: true, largeText: true };
  source.reviewSeed = 23;
  source.lastTopic = "mertekegysegek";
  source.lessons.mertekegysegek = {
    step: 4, visited: [0, 1, 2, 4], lab: { dimension: 3, enlarged: true },
    practiceIndex: 9, generatedSeed: 8, generatedMode: true, exitRound: 3, exampleSteps: [3, 2],
  };
  source.attempts["mertekegysegek-practice-10"] = {
    ...emptyAttempt("mertekegysegek"), input: encodePartResponses({ speed: "20", time: "12,5" }),
    tries: 2, assisted: true, success: true, reflection: "Mindkét egységet átváltottam.",
  };
  return {
    ...source, schemaVersion: 2, appVersion: "0.2.0",
    lessons: Object.fromEntries(V2_TOPICS.map((id) => [id, source.lessons[id]])),
  };
}

test("schema 2 preserves all ten topics and their parts/reflections, with four empty new topics and no invented evidence", () => {
  const old = schema2Profile();
  const before = JSON.stringify(old);
  const next = parseImport(before);
  assert.equal(next.schemaVersion, 3);
  assert.equal(next.appVersion, "0.2.0");
  assert.deepEqual(next.settings, old.settings);
  assert.deepEqual(next.attempts, old.attempts);
  for (const id of V2_TOPICS) assert.deepEqual(next.lessons[id], old.lessons[id]);
  for (const id of TOPICS.filter((id) => !(V2_TOPICS as readonly string[]).includes(id))) {
    assert.deepEqual(next.lessons[id], emptyProfile().lessons[id]);
  }
  assert.deepEqual(next.learning, emptyLearningLog());
  assert.equal(next.legacyReviewSeed, 23);
  assert.equal(next.legacyReviewSchema, 2);
  assert.deepEqual(parseImport(serializeProfile(next)), next);
  assert.equal(JSON.stringify(old), before);
});

test("schema 2 mixed task keeps either its ten-topic cycle or an inherited six-topic cycle", () => {
  for (const inherited of [false, true]) {
    const old = { ...schema2Profile(), ...(inherited ? { legacyReviewSeed: 23 } : {}) };
    const next = parseImport(JSON.stringify(old));
    const order = inherited ? LEGACY_TOPICS : V2_TOPICS;
    const topic = order[(old.reviewSeed - 1) % order.length];
    const variant = Math.floor((old.reviewSeed - 1) / order.length) % 3;
    const oldTask = generateExercise(topic, 50_000 + old.reviewSeed, variant);
    const restored = parseImport(serializeProfile(next));
    assert.equal(restored.legacyReviewSchema, inherited ? 1 : 2);
    assert.equal(restored.legacyReviewSeed, old.reviewSeed);
    assert.equal(generateExercise(topic, 50_000 + restored.reviewSeed, variant).id, oldTask.id);
    const { legacyReviewSeed, legacyReviewSchema, ...withoutMarker } = restored;
    const advanced = parseImport(serializeProfile({ ...withoutMarker, reviewSeed: restored.reviewSeed + 1 }));
    assert.equal(advanced.legacyReviewSeed, undefined);
    assert.equal(advanced.legacyReviewSchema, undefined);
  }
});

test("all current fields and paired legacy markers are required and bounded in schema 3", () => {
  const missing: any = emptyProfile();
  delete missing.learning;
  assert.throws(() => validateProfile(missing), /készségesemény/);
  for (const patch of [
    { legacyReviewSeed: 1 }, { legacyReviewSchema: 1 }, { legacyReviewSeed: 1, legacyReviewSchema: 3 },
    { legacyReviewSeed: 2, legacyReviewSchema: 2 }, { legacyReviewSeed: "1", legacyReviewSchema: 2 },
  ]) assert.throws(() => validateProfile({ ...emptyProfile(), ...patch }), /korábbi vegyes/);
  for (const schema of [1, 2] as const) {
    const old: any = schema === 1 ? legacyProfile() : schema2Profile();
    delete old.lessons.tortek;
    assert.throws(() => validateProfile(old), /tortek/);
  }
  const hybrid: any = schema2Profile();
  hybrid.lessons.hatvanyok = emptyProfile().lessons.hatvanyok;
  assert.throws(() => validateProfile(hybrid), /ismeretlen leckét/);
  const wrongTopic: any = schema2Profile();
  wrongTopic.attempts.newTask = emptyAttempt("hatvanyok");
  assert.throws(() => validateProfile(wrongTopic), /feladatállapot/);
});

test("strict schema-3 learning validation rejects malformed or contradictory data without replacing storage", () => {
  const event = {
    id: 1, at: "2026-11-06T13:00:00.000Z", exerciseId: "szamfogalom-practice-3",
    sourceExerciseId: "szamfogalom-practice-3", topic: "szamfogalom",
    outcomes: [{ skillId: "ellentett", partId: "oppositeMinus7", status: "correct", independent: true, assisted: false, responseKey: "0123456789abcdef" }],
  };
  const good = { version: 1, nextId: 2, droppedEvents: 0, events: [event] };
  const p = { ...emptyProfile(), learning: good } as any;
  assert.deepEqual(parseImport(serializeProfile(p)).learning, good);
  const malformed = [
    undefined, null, [], { ...good, version: 2 }, { ...good, nextId: 9 },
    { ...good, droppedEvents: -1 }, { ...good, rawAnswer: "secret" },
    { ...good, events: [{ ...event, at: "not-a-date" }] },
    { ...good, events: [{ ...event, at: "2026-02-30T13:00:00.000Z" }] },
    { ...good, events: [{ ...event, topic: "future" }] },
    { ...good, events: [{ ...event, exerciseId: "szamfogalom-prediction" }] },
    { ...good, events: [{ ...event, outcomes: [] }] },
    { ...good, events: [{ ...event, outcomes: [{ ...event.outcomes[0], skillId: "invented" }] }] },
    { ...good, events: [{ ...event, outcomes: [{ ...event.outcomes[0], status: "invalid" }] }] },
    { ...good, events: [{ ...event, outcomes: [{ ...event.outcomes[0], status: "incorrect" }] }] },
    { ...good, events: [{ ...event, outcomes: [{ ...event.outcomes[0], assisted: true }] }] },
    { ...good, events: [{ ...event, outcomes: [{ ...event.outcomes[0], partId: "__proto__" }] }] },
    { ...good, events: [{ ...event, outcomes: [{ ...event.outcomes[0], responseKey: "long raw answer" }] }] },
    { ...good, events: [{ ...event, outcomes: [{ ...event.outcomes[0], feedback: "<script>bad()</script>" }] }] },
    { ...good, events: [{ ...event, outcomes: [event.outcomes[0], event.outcomes[0]] }] },
    { version: 1, nextId: 3, droppedEvents: 0, events: [event, { ...event, id: 2 }] },
    { version: 1, nextId: MAX_LEARNING_EVENTS + 2, droppedEvents: 0, events: Array.from({ length: MAX_LEARNING_EVENTS + 1 }, (_, i) => ({ ...event, id: i + 1 })) },
  ];
  const previous = serializeProfile(emptyProfile());
  for (const learning of malformed) {
    let writes = 0;
    let backing = previous;
    const error = saveProfile({ ...emptyProfile(), learning } as any, {
      setItem(_key, value) { writes++; backing = value; },
    });
    assert.match(error, /készségesemény/);
    assert.equal(writes, 0);
    assert.equal(backing, previous);
  }
});

test("corrupt ten-topic exports remain untouched and old app data cannot fabricate new learning history", () => {
  const broken: any = schema2Profile();
  broken.lessons.aranyossag.generatedSeed = -1;
  const original = JSON.stringify(broken);
  const backing = new Map([[STORAGE_KEY, original]]);
  const loaded = loadProfile({ getItem: (key) => backing.get(key) ?? null });
  assert.ok(loaded.problem);
  assert.equal(backing.get(STORAGE_KEY), original);
  const oldWithUnrecognizedField = { ...schema2Profile(), learning: { events: [{ claimed: "mastered" }] } };
  assert.deepEqual(validateProfile(oldWithUnrecognizedField).learning, emptyLearningLog());
});

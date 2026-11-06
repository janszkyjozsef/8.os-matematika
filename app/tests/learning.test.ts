import test from "node:test";
import assert from "node:assert/strict";
import type { Exercise } from "../src/types.ts";
import { lessons, legacyLessons } from "../src/content/lessons.ts";
import { foundationLessons } from "../src/content/foundations.ts";
import { generateExercise, generatorFamilies, familiesFor } from "../src/math/generators.ts";
import { gradeAnswer, encodePartResponses } from "../src/math/engine.ts";
import { emptyAttempt, emptyProfile, recordGrade, serializeProfile, parseImport } from "../src/progress.ts";
import type { Attempt, Profile } from "../src/progress.ts";
import { TOPICS } from "../src/topics.ts";
import {
  SKILLS, FAMILY_ORDER, getSkill, getSkillTargets, getRequiredPartIds, emptyLearningLog, validateLearningLog,
  recordLearningGrade, skillSummary, canonicalExerciseId, MAX_LEARNING_EVENTS, responseFingerprint,
} from "../src/learning/skills.ts";
import type { LearningEvent, SkillId } from "../src/learning/skills.ts";
import { chooseTargetedExercise, replayTargetedExercise, practiceRecommendations } from "../src/learning/practice.ts";
import { generateTargetedExercise, TARGETED_GENERATOR_FAMILIES } from "../src/learning/repair-generators.ts";

const now = "2026-11-06T15:00:00.000Z";
const scalar = (id = "test-scalar"): Exercise => ({
  id, topic: "tortek", kind: "compute", difficulty: 1, prompt: "Számítsd ki: 1/2 + 1/4.",
  answer: { kind: "number", expected: "3/4" }, hints: ["Közös részeket keress.", "A fél két negyed."],
  solution: [{ expression: "2/4 + 1/4 = 3/4", why: "Azonos méretű részek." }],
  takeaway: "A nevező az egység méretét jelöli.", skillIds: ["tort-osszeadas"],
});
function submit(profile: Profile, exercise: Exercise, input: string, change: Partial<Attempt> = {}, at = now): Profile {
  const before = { ...(profile.attempts[exercise.id] ?? emptyAttempt(exercise.topic)), ...change, input };
  const typed = { ...profile, attempts: { ...profile.attempts, [exercise.id]: before } };
  const result = gradeAnswer(exercise, input);
  const learned = recordLearningGrade(typed, exercise, before, result, at);
  return { ...learned, attempts: { ...learned.attempts, [exercise.id]: { ...recordGrade(before, result), updatedAt: at } } };
}
function correctInput(exercise: Exercise): string {
  const input = (answer: Exercise["answer"]): string => {
    if (answer.kind === "number") return answer.expected;
    if (answer.kind === "choice") return answer.correct;
    if (answer.kind === "expression") return answer.accepted[0];
    return encodePartResponses(Object.fromEntries(answer.parts.map((part) => [part.id, input(part.answer)])));
  };
  return input(exercise.answer);
}

test("every topic has one to four authored skill descriptions and working lesson/workshop targets", () => {
  assert.equal(new Set(SKILLS.map((skill) => skill.id)).size, SKILLS.length);
  for (const topic of TOPICS) {
    const own = SKILLS.filter((skill) => skill.topic === topic);
    assert.ok(own.length >= 1 && own.length <= 4, topic);
    for (const skill of own) {
      assert.ok(skill.title && skill.explanation && skill.checkpoints.length >= 2);
      assert.equal(skill.lessonHref, "#lecke/" + topic + "?lepes=2");
      assert.equal(skill.labHref, "#lecke/" + topic + "?lepes=1");
    }
  }
});

test("all fourteen lessons and every answer part are mapped, while all predictions are excluded", () => {
  const historical = JSON.stringify([legacyLessons, foundationLessons]);
  for (const lesson of lessons) {
    assert.deepEqual(getSkillTargets(lesson.prediction), [], lesson.prediction.id);
    for (const exercise of [...lesson.practice, ...lesson.exit]) {
      const targets = getSkillTargets(exercise);
      assert.ok(targets.length, exercise.id);
      assert.ok(targets.every((target) => getSkill(target.skillId)));
      if (exercise.answer.kind === "parts") {
        for (const part of exercise.answer.parts) {
          assert.ok(targets.some((target) => target.partId === part.id), exercise.id + ":" + part.id);
          getRequiredPartIds(exercise, part.id);
        }
      } else assert.ok(targets.every((target) => target.partId === undefined));
    }
  }
  assert.equal(JSON.stringify([legacyLessons, foundationLessons]), historical, "Mapping must not modify historical lesson data");
});

test("the public generator family order and precise part mappings agree for several variants", () => {
  for (const topic of TOPICS) assert.deepEqual(familiesFor(topic).map((family) => family.id), FAMILY_ORDER[topic], topic);
  for (const family of generatorFamilies) {
    const variant = familiesFor(family.topic).findIndex((item) => item.id === family.id);
    for (const seed of [1, 2, 7, 11, 101]) {
      const exercise = generateExercise(family.topic, seed, variant);
      const targets = getSkillTargets(exercise);
      assert.ok(targets.length, exercise.id);
      if (exercise.answer.kind === "parts") for (const part of exercise.answer.parts) {
        assert.ok(targets.some((target) => target.partId === part.id), exercise.id + ":" + part.id);
        getRequiredPartIds(exercise, part.id);
      }
    }
  }
  const exercise = generateExercise("szamfogalom", 3, 0);
  assert.deepEqual(getSkillTargets(exercise).filter((target) => target.partId === "opposite"), [{ skillId: "ellentett", partId: "opposite" }]);
  assert.deepEqual(getSkillTargets(exercise).filter((target) => target.partId === "relation"), [{ skillId: "szamok-helye", partId: "relation" }]);
  const mixed = lessons.find((lesson) => lesson.id === "szamfogalom")!.practice[2];
  assert.deepEqual(getSkillTargets(mixed).filter((target) => target.partId === "absMinus7"), [{ skillId: "abszolut-tavolsag", partId: "absMinus7" }]);
});

test("rewritten exit identifiers preserve the original skills and canonical evidence identity", () => {
  for (const lesson of lessons) {
    lesson.exit.forEach((source, i) => {
      const clone = { ...source, id: "exit:" + lesson.id + ":0:" + i, learningSource: { exerciseId: source.id } };
      assert.deepEqual(getSkillTargets(clone), getSkillTargets(source));
      assert.equal(canonicalExerciseId(clone.id), source.id);
    });
    for (const i of [0, 1]) {
      const source = generateExercise(lesson.id, 10_000 + 2 * 13 + i, i);
      const clone = { ...source, id: "exit:" + lesson.id + ":2:" + i, learningSource: { exerciseId: source.id } };
      assert.deepEqual(getSkillTargets(clone), getSkillTargets(source));
      assert.equal(canonicalExerciseId(clone.id), source.id);
      if (FAMILY_ORDER[lesson.id].every((family) => !family.startsWith("algebra") && !family.startsWith("model") && !family.startsWith("power") && !family.startsWith("root"))) {
        const { learningSource, ...oldShape } = clone;
        assert.deepEqual(getSkillTargets(oldShape), getSkillTargets(source));
      }
    }
  }
});

test("typing, opening help and prediction checks never fabricate learning evidence", () => {
  const p = emptyProfile();
  p.attempts.draft = { ...emptyAttempt("tortek"), input: "1/2", hintLevel: 1, assisted: true };
  assert.deepEqual(p.learning, emptyLearningLog());
  for (const lesson of lessons) {
    const exercise = lesson.prediction;
    const graded = submit(p, exercise, correctInput(exercise));
    assert.deepEqual(graded.learning, emptyLearningLog());
  }
  const invalid = submit(p, scalar(), "nem szám");
  assert.deepEqual(invalid.learning, emptyLearningLog());
  assert.equal(invalid.attempts["test-scalar"].tries, 0);
});

test("a real first answer adds bounded structured evidence without raw answer or feedback", () => {
  const exercise = scalar();
  const p = submit(emptyProfile(), exercise, "3/4");
  assert.equal(p.learning.events.length, 1);
  const event = p.learning.events[0];
  assert.equal(event.at, now);
  assert.equal(event.sourceExerciseId, exercise.id);
  assert.deepEqual(Object.keys(event.outcomes[0]).sort(), ["assisted", "independent", "responseKey", "skillId", "status"]);
  assert.equal(event.outcomes[0].independent, true);
  assert.equal(JSON.stringify(p.learning).includes("3/4"), false);
  assert.equal(JSON.stringify(p.learning).includes("Azonos méret"), false);
  const summary = skillSummary(p).find((row) => row.skillId === "tort-osszeadas")!;
  assert.equal(summary.independentCount, 1);
  assert.equal(summary.status, "observed");
  assert.equal(summary.needsPractice, false);
  assert.equal("percentage" in summary, false);
  assert.deepEqual(parseImport(serializeProfile(p)).learning, p.learning);
});

test("unchanged wrong checks and equivalent correct spellings do not multiply evidence", () => {
  const exercise: Exercise = { ...scalar("test-expression"), topic: "betus-kifejezesek", skillIds: ["egynemu-tagok"], answer: { kind: "expression", accepted: ["3x", "3*x", "x+x+x"] } };
  let p = submit(emptyProfile(), exercise, "3x");
  p = submit(p, exercise, "3*x");
  p = submit(p, exercise, "x+x+x", { assisted: true, hintLevel: 1 });
  assert.equal(p.learning.events.length, 1);
  assert.equal(p.learning.events[0].outcomes[0].independent, true);
  p = submit(p, exercise, "2x");
  p = submit(p, exercise, "2x");
  assert.equal(p.learning.events.length, 2);
  p = submit(p, exercise, "3*x");
  assert.equal(p.learning.events.length, 3);
  assert.equal(p.learning.events[2].outcomes[0].assisted, true);
  assert.equal(p.learning.events[2].outcomes[0].independent, false);
  const summary = skillSummary(p).find((row) => row.skillId === "egynemu-tagok")!;
  assert.equal(summary.independentCount, 1);
  assert.equal(summary.checkedCount, 1);
  assert.equal(summary.needsPractice, true);
  assert.deepEqual(validateLearningLog(p.learning), p.learning);
});

test("an old successful task does not become a fabricated new helped event on recheck", () => {
  const exercise = scalar("old-success");
  const p = emptyProfile();
  p.attempts[exercise.id] = { ...emptyAttempt("tortek"), input: "3/4", tries: 1, success: true, independent: true };
  const repeated = submit(p, exercise, "6/8");
  assert.deepEqual(repeated.learning, emptyLearningLog());
  const wrong = submit(repeated, exercise, "2");
  assert.equal(wrong.learning.events.length, 1);
  const corrected = submit(wrong, exercise, "3/4");
  assert.equal(corrected.learning.events.length, 2);
  assert.equal(corrected.learning.events[1].outcomes[0].assisted, true);
  assert.equal(skillSummary(corrected).find((row) => row.skillId === "tort-osszeadas")!.independentCount, 0);
});

test("multipart checks record only actually graded parts with their exact skills", () => {
  const exercise: Exercise = {
    ...scalar("test-parts"), topic: "szamfogalom", skillIds: undefined,
    answer: { kind: "parts", parts: [
      { id: "opposite", label: "A −3 ellentettje", answer: { kind: "number", expected: "3" }, skillIds: ["ellentett"] },
      { id: "distance", label: "−3 és 5 távolsága", answer: { kind: "number", expected: "8" }, skillIds: ["abszolut-tavolsag"] },
      { id: "relation", label: "Melyik nagyobb?", answer: { kind: "choice", correct: "five", options: [{ id: "five", text: "5" }, { id: "minus3", text: "−3" }] }, skillIds: ["szamok-helye"] },
    ] },
  };
  let p = submit(emptyProfile(), exercise, encodePartResponses({ opposite: "3", distance: "-8", relation: "" }));
  assert.deepEqual(p.learning.events[0].outcomes.map((outcome) => [outcome.partId, outcome.skillId, outcome.status, outcome.independent]), [
    ["opposite", "ellentett", "correct", true], ["distance", "abszolut-tavolsag", "incorrect", false],
  ]);
  assert.equal(skillSummary(p).find((row) => row.skillId === "szamok-helye")!.status, "unseen");
  const recommendations = practiceRecommendations(p);
  assert.deepEqual(recommendations.map((item) => [item.skillId, item.partId]), [["abszolut-tavolsag", "distance"]]);
  p = submit(p, exercise, encodePartResponses({ opposite: "3", distance: "8", relation: "five" }));
  assert.equal(p.learning.events[1].outcomes.some((outcome) => outcome.partId === "opposite"), false);
  assert.equal(skillSummary(p).find((row) => row.skillId === "ellentett")!.independentCount, 1);
});

test("valid parts of an otherwise incomplete form are evidence, empty or invalid parts are not errors", () => {
  const exercise: Exercise = {
    ...scalar("incomplete-parts"), answer: { kind: "parts", parts: [
      { id: "a", label: "Első rész", answer: { kind: "number", expected: "1" }, skillIds: ["tort-osszeadas"] },
      { id: "b", label: "Második rész", answer: { kind: "number", expected: "2" }, skillIds: ["tort-osszeadas"] },
    ] },
  };
  const p = submit(emptyProfile(), exercise, encodePartResponses({ a: "1", b: "?" }));
  assert.equal(p.learning.events.length, 1);
  assert.deepEqual(p.learning.events[0].outcomes.map((outcome) => outcome.partId), ["a"]);
  assert.equal(practiceRecommendations(p).length, 0);
  assert.equal(p.attempts[exercise.id].tries, 0);
});

test("dependent answers require correct prerequisites in the same check, including the transitive chain", () => {
  const exercise: Exercise = {
    ...scalar("dependent-model"), topic: "szoveges-modellek", skillIds: undefined,
    prompt: "Négy füzet és 300 Ft szállítás összesen 3500 Ft. x egy füzet ára. Írd fel a modellt, számítsd ki az egységárat, és ellenőrizd az összeget.",
    answer: { kind: "parts", parts: [
      { id: "equation", label: "Egyenlet", answer: { kind: "expression", accepted: ["4x+300=3500"] }, skillIds: ["modellvalasztas"] },
      { id: "unrelated", label: "A füzetek darabszáma", answer: { kind: "number", expected: "4" }, skillIds: ["adatok-es-feltetelek"] },
      { id: "price", label: "Egy füzet ára", answer: { kind: "number", expected: "800" }, skillIds: ["modellvalasztas"], requiresParts: ["equation"] },
      { id: "check", label: "Visszaellenőrzött összeg", answer: { kind: "number", expected: "3500" }, skillIds: ["modell-ellenorzes"], requiresParts: ["price"] },
    ] },
  };
  assert.deepEqual(getRequiredPartIds(exercise, "check"), ["equation", "price"]);
  const checkOutcomes = (p: Profile) => p.learning.events.flatMap((event) => event.outcomes).filter((outcome) => outcome.partId === "check");
  let profile = submit(emptyProfile(), exercise, encodePartResponses({ check: "3500" }));
  assert.equal(profile.learning.events.length, 0, "Copying the stated total alone provides no skill evidence");
  profile = submit(profile, exercise, encodePartResponses({ equation: "4x=3500", price: "800", check: "3500" }));
  assert.deepEqual(profile.learning.events[0].outcomes.map((outcome) => outcome.partId), ["equation"]);
  assert.equal(checkOutcomes(profile).length, 0, "A correct direct prerequisite cannot bypass its wrong earlier prerequisite");
  profile = submit(profile, exercise, encodePartResponses({ equation: "4x+300=3500", price: "800" }));
  const priorEventCount = profile.learning.events.length;
  profile = submit(profile, exercise, encodePartResponses({ check: "3500" }));
  assert.equal(profile.learning.events.length, priorEventCount, "Earlier checks cannot substitute for the missing current prerequisites");
  profile = submit(profile, exercise, encodePartResponses({ equation: "4x+300=3500", price: "800", check: "3500" }));
  assert.equal(checkOutcomes(profile).length, 1);
  assert.equal(checkOutcomes(profile)[0].status, "correct");
  assert.equal(checkOutcomes(profile)[0].independent, false);
  assert.equal(checkOutcomes(profile)[0].assisted, true);
  assert.deepEqual(validateLearningLog(profile.learning), profile.learning);
  const firstFullCheck = submit(emptyProfile(), exercise, correctInput(exercise));
  assert.equal(checkOutcomes(firstFullCheck)[0].independent, true);
  const cyclic = structuredClone(exercise);
  if (cyclic.answer.kind !== "parts") throw new Error("Expected structured dependency fixture");
  cyclic.answer.parts[0].requiresParts = ["check"];
  assert.throws(() => getRequiredPartIds(cyclic, "check"), /Körkörös/);
  cyclic.answer.parts[0].requiresParts = ["missing"];
  assert.throws(() => getRequiredPartIds(cyclic, "check"), /Ismeretlen/);
});

test("format feedback remains distinct from mathematical error, and later fresh independent evidence clears the recommendation", () => {
  const exercise: Exercise = { ...scalar("simplify"), answer: { kind: "number", expected: "3/4", requireSimplified: true } };
  let p = submit(emptyProfile(), exercise, "6/8");
  assert.equal(p.learning.events[0].outcomes[0].status, "form");
  assert.match(practiceRecommendations(p)[0].reason, /egyszerűsített alak/);
  assert.doesNotMatch(practiceRecommendations(p)[0].reason, /egység/);
  p = submit(p, exercise, "3/4");
  assert.equal(practiceRecommendations(p)[0].kind, "helped");
  p = submit(p, scalar("fresh-independent"), "3/4");
  assert.equal(practiceRecommendations(p).length, 0);
  const summary = skillSummary(p).find((row) => row.skillId === "tort-osszeadas")!;
  assert.equal(summary.independentCount, 1);
  assert.equal(summary.assistedCount, 1);
});

test("one underlying answer cannot earn another independent success by changing its route identity", () => {
  const source = scalar("same-source");
  const first: Exercise = { ...source, id: "targeted:repair:same-source", learningSource: { exerciseId: source.id } };
  const second: Exercise = { ...source, id: "targeted:transfer:same-source", learningSource: { exerciseId: source.id } };
  let p = submit(emptyProfile(), first, "3/4");
  p = submit(p, second, "3/4");
  assert.equal(p.learning.events.length, 1);
  assert.equal(skillSummary(p).find((row) => row.skillId === "tort-osszeadas")!.independentCount, 1);
});

test("bounded retention reports dropped events and keeps a valid contiguous ledger without inflating counts", () => {
  const exercise = scalar("retention-source");
  const p = emptyProfile();
  p.attempts[exercise.id] = { ...emptyAttempt("tortek"), tries: MAX_LEARNING_EVENTS, assisted: true, input: "0" };
  p.learning = {
    version: 1, nextId: MAX_LEARNING_EVENTS + 1, droppedEvents: 0,
    events: Array.from({ length: MAX_LEARNING_EVENTS }, (_, i): LearningEvent => ({
      id: i + 1, at: now, exerciseId: exercise.id, sourceExerciseId: exercise.id, topic: "tortek",
      outcomes: [{ skillId: "tort-osszeadas", status: "incorrect", independent: false, assisted: true, responseKey: responseFingerprint("incorrect|" + (i + 10)) }],
    })),
  };
  const next = submit(p, exercise, "3/4");
  assert.equal(next.learning.events.length, MAX_LEARNING_EVENTS);
  assert.equal(next.learning.events[0].id, 2);
  assert.equal(next.learning.droppedEvents, 1);
  assert.equal(next.learning.nextId, MAX_LEARNING_EVENTS + 2);
  assert.deepEqual(validateLearningLog(next.learning), next.learning);
  const summary = skillSummary(next).find((row) => row.skillId === "tort-osszeadas")!;
  assert.equal(summary.checkedCount, 1);
  assert.equal(summary.independentCount, 0);
  assert.equal(summary.assistedCount, 1);
  assert.equal(p.learning.events[0].id, 1, "Recording may not mutate an earlier profile");
});

test("every skill can select a relevant fresh repair and another task; replay is independent of profile changes", () => {
  for (const skill of SKILLS) {
    const p = emptyProfile();
    const first = chooseTargetedExercise(p, skill.id, "repair", 0);
    assert.ok(first, skill.id + " needs at least one relevant repair source");
    assert.deepEqual(chooseTargetedExercise(p, skill.id, "repair", 0), first, skill.id);
    assert.ok(getSkillTargets(first.exercise).some((target) => target.skillId === skill.id), skill.id);
    assert.deepEqual(replayTargetedExercise(skill.id, "repair", first.locator), first);
    const answered = submit(p, first.exercise, correctInput(first.exercise));
    assert.deepEqual(replayTargetedExercise(skill.id, "repair", first.locator), first, "Open route must not change after answering");
    const next = chooseTargetedExercise(answered, skill.id, "transfer", 1);
    assert.ok(next, skill.id + " needs another application/variation");
    assert.notEqual(next.sourceExerciseId, first.sourceExerciseId);
    assert.ok(getSkillTargets(next.exercise).some((target) => target.skillId === skill.id));
  }
});

test("new selection excludes prior sources and identical generated content; narrower practice keeps part identity", () => {
  let p = emptyProfile();
  const first = chooseTargetedExercise(p, "ellentett", "repair", 0)!;
  assert.ok(first.targetPartId);
  assert.equal(first.exercise.answer.kind === "parts", false);
  assert.equal(first.exercise.learningSource?.partId, first.targetPartId);
  p = submit(p, first.exercise, correctInput(first.exercise));
  const second = chooseTargetedExercise(p, "ellentett", "repair", 0)!;
  assert.notEqual(second.sourceExerciseId, first.sourceExerciseId);
  assert.notEqual(second.exercise.prompt, first.exercise.prompt);
  assert.equal(p.learning.events[0].outcomes[0].partId, first.targetPartId);
  const old = lessons.find((lesson) => lesson.id === "szamfogalom")!.practice[2];
  const original = JSON.stringify(old);
  chooseTargetedExercise(p, "ellentett", "transfer", 1);
  assert.equal(JSON.stringify(old), original);
});

test("transfer prefers an authored application or another family and labels same-structure variation honestly", () => {
  let p = emptyProfile();
  const first = chooseTargetedExercise(p, "tort-osszeadas", "repair", 0)!;
  p = submit(p, first.exercise, correctInput(first.exercise));
  const sameStructure = chooseTargetedExercise(p, "tort-osszeadas", "transfer", 0)!;
  assert.equal(sameStructure.applicationKind, "same-structure");
  assert.match(sameStructure.reason, /új adatokkal/);
  assert.match(sameStructure.reason, /önmagában nem bizonyít/);
  const fresh = chooseTargetedExercise(emptyProfile(), "betu-helyettesites", "transfer", 0)!;
  assert.equal(fresh.applicationKind, "different");
  assert.equal(fresh.exercise.kind, "transfer");
  assert.match(fresh.reason, /Másik alkalmazási helyzetben/);
});

test("targeted model checks retain the meaningful prerequisite group in authored order and replay it exactly", () => {
  const profile = emptyProfile();
  for (const stage of ["repair", "transfer"] as const) {
    const selected = chooseTargetedExercise(profile, "modell-ellenorzes", stage, 1)!;
    assert.ok(selected);
    assert.equal(selected.targetPartId, "check");
    assert.equal(selected.exercise.answer.kind, "parts", selected.sourceExerciseId);
    if (selected.exercise.answer.kind !== "parts") throw new Error("The dependent check must retain its preceding reasoning fields");
    const source = stage === "repair"
      ? generateExercise("szoveges-modellek", 7_350_097, 0)
      : lessons.find((lesson) => lesson.id === "szoveges-modellek")!.exit[0];
    assert.equal(selected.sourceExerciseId, source.id);
    if (source.answer.kind !== "parts") throw new Error("Expected multipart source");
    const required = getRequiredPartIds(source, "check");
    assert.ok(required.length >= 2, "The model and its computed value must accompany the copied total");
    assert.deepEqual(selected.exercise.answer.parts.map((part) => part.id), source.answer.parts.filter((part) => required.includes(part.id) || part.id === "check").map((part) => part.id));
    assert.match(selected.exercise.prompt, /összefüggő részválaszokat együtt/);
    assert.match(selected.reason, /előzményeket együtt/);
    assert.deepEqual(replayTargetedExercise("modell-ellenorzes", stage, selected.locator), selected);
    const check = selected.exercise.answer.parts.find((part) => part.id === "check")!;
    if (check.answer.kind !== "number") throw new Error("Expected a numerical check");
    const copied = submit(profile, selected.exercise, encodePartResponses({ check: check.answer.expected }));
    assert.equal(copied.learning.events.length, 0);
    const completed = submit(copied, selected.exercise, correctInput(selected.exercise));
    assert.ok(completed.learning.events.some((event) => event.outcomes.some((outcome) => outcome.partId === "check" && outcome.status === "correct")));
    assert.deepEqual(replayTargetedExercise("modell-ellenorzes", stage, selected.locator), selected);
  }
});

test("choosing another unopened task excludes the current source without fabricating an attempt or event", () => {
  const profile = emptyProfile();
  const before = JSON.stringify(profile);
  const first = chooseTargetedExercise(profile, "szamok-helye", "transfer", 0)!;
  assert.equal(first.sourceKind, "authored");
  const next = chooseTargetedExercise(profile, "szamok-helye", "transfer", 1, first.sourceExerciseId)!;
  assert.ok(next);
  assert.notEqual(next.sourceExerciseId, first.sourceExerciseId);
  assert.deepEqual(replayTargetedExercise("szamok-helye", "transfer", next.locator), next);
  assert.deepEqual(chooseTargetedExercise(profile, "szamok-helye", "transfer", 1, first.sourceExerciseId), next);
  const generated = chooseTargetedExercise(profile, "ellentett", "repair", 0)!;
  const otherGenerated = chooseTargetedExercise(profile, "ellentett", "repair", 0, generated.sourceExerciseId)!;
  assert.ok(otherGenerated);
  assert.notEqual(otherGenerated.sourceExerciseId, generated.sourceExerciseId);
  assert.notEqual(otherGenerated.exercise.prompt, generated.exercise.prompt);
  assert.equal(JSON.stringify(profile), before);
  assert.equal(profile.learning.events.length, 0);
  assert.equal(Object.keys(profile.attempts).length, 0);
});

test("invalid locator and unknown skill are rejected; the exhausted old experimental pool receives genuinely new practice", () => {
  assert.equal(chooseTargetedExercise(emptyProfile(), "unknown", "repair"), null);
  assert.equal(chooseTargetedExercise(emptyProfile(), "ellentett", "repair", -1), null);
  for (const locator of ["", "https://example.org", "g|szamfogalom|NaN|0||", "g|unknown|1|0||", "g|szamfogalom|1|0|__proto__|", "a|szamfogalom-prediction||", "a|missing||", "g|szamfogalom|1|0|opposite|x".repeat(100), "t|experiment-frequency-v1|1|2||"]) {
    assert.equal(replayTargetedExercise("ellentett", "repair", locator), null, locator);
  }
  const p = emptyProfile();
  for (const lesson of lessons) for (const exercise of [...lesson.practice, ...lesson.exit]) {
    if (getSkillTargets(exercise).some((target) => target.skillId === "esely-es-kiserlet")) p.attempts[exercise.id] = emptyAttempt(exercise.topic);
  }
  const repair = chooseTargetedExercise(p, "esely-es-kiserlet", "repair", 0)!;
  assert.ok(repair);
  assert.match(repair.sourceExerciseId, /^targeted-generated:experiment-frequency-v1:/);
  assert.match(repair.locator, /^t\|experiment-frequency-v1\|/);
  assert.deepEqual(replayTargetedExercise("esely-es-kiserlet", "repair", repair.locator), repair);
  const answered = submit(p, repair.exercise, correctInput(repair.exercise));
  const transfer = chooseTargetedExercise(answered, "esely-es-kiserlet", "transfer", 1)!;
  assert.ok(transfer);
  assert.notEqual(transfer.sourceExerciseId, repair.sourceExerciseId);
  assert.match(transfer.reason, /Másik alkalmazási/);
  assert.notEqual(/:variant=(\d+)$/.exec(transfer.sourceExerciseId)?.[1], /:variant=(\d+)$/.exec(repair.sourceExerciseId)?.[1]);
  assert.deepEqual(replayTargetedExercise("esely-es-kiserlet", "transfer", transfer.locator), transfer);
});

test("200 seeds in each experimental representation agree with independent arithmetic on the visible data", () => {
  assert.equal(TARGETED_GENERATOR_FAMILIES.length, 1);
  assert.equal(generatorFamilies.some((family) => family.id === TARGETED_GENERATOR_FAMILIES[0].id), false);
  const generalBefore = generatorFamilies.map((family) => family.id);
  let zeroObserved = false, allObserved = false, exactFrequency = false;
  const readFraction = (text: string) => {
    const [n, d = "1"] = text.split("/");
    return [BigInt(n), BigInt(d)] as const;
  };
  for (const variant of [0, 1]) for (let seed = 0; seed < 200; seed++) {
    const exercise = generateTargetedExercise("experiment-frequency-v1", seed, variant);
    assert.deepEqual(generateTargetedExercise("experiment-frequency-v1", seed, variant), exercise);
    const visible = /összesen (\d+) próba volt, ebből (\d+) alkalommal/.exec(exercise.prompt)!;
    assert.ok(visible);
    const n = BigInt(visible[1]), k = BigInt(visible[2]);
    assert.ok(n > 0n && k >= 0n && k <= n);
    zeroObserved ||= k === 0n;
    allObserved ||= k === n;
    assert.equal(exercise.answer.kind, "parts");
    if (exercise.answer.kind !== "parts") throw new Error("Expected structured experimental task");
    const fields = Object.fromEntries(exercise.answer.parts.map((part) => [part.id, part]));
    assert.equal(Object.keys(fields).length, 4);
    const denominator = exercise.prompt.includes("hatoldalú kock") ? 6n : exercise.prompt.includes("pénzérmét") ? 2n : 0n;
    assert.ok(denominator > 0n);
    for (const id of ["frequency", "theoretical", "next"]) {
      const answer = fields[id].answer;
      assert.equal(answer.kind, "number");
      if (answer.kind !== "number") throw new Error("Expected numerical probability");
      const [num, den] = readFraction(answer.expected);
      assert.ok(den > 0n);
      if (id === "frequency") {
        assert.equal(num * n, k * den, exercise.id);
        exactFrequency ||= k * denominator === n;
      } else {
        assert.equal(num * denominator, den, exercise.id);
      }
    }
    assert.equal(fields.interpretation.answer.kind, "choice");
    if (fields.interpretation.answer.kind !== "choice") throw new Error("Expected interpretation choice");
    assert.equal(fields.interpretation.answer.correct, "independent");
    assert.ok(exercise.hints.length >= 2 && exercise.solution.length >= 4 && exercise.reflection);
    assert.equal(gradeAnswer(exercise, correctInput(exercise)).correct, true);
    assert.deepEqual(getSkillTargets(exercise).map((target) => target.skillId), Array(4).fill("esely-es-kiserlet"));
  }
  assert.ok(zeroObserved && allObserved && exactFrequency);
  assert.deepEqual(generatorFamilies.map((family) => family.id), generalBefore);
  assert.throws(() => generateTargetedExercise("unknown", 1));
  assert.throws(() => generateTargetedExercise("experiment-frequency-v1", -1));
  assert.throws(() => generateTargetedExercise("experiment-frequency-v1", 1, 2));
});

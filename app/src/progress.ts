import type { GradeResult, LabState, TopicId } from "./types.ts";
import { LEGACY_TOPICS, SCHEMA_VERSION, TOPICS } from "./topics.ts";
import { decodePartResponses } from "./math/engine.ts";
import { APP_VERSION } from "./version.ts";

export { TOPICS, SCHEMA_VERSION } from "./topics.ts";
// The key stays stable so existing browser saves remain discoverable.
export const STORAGE_KEY = "matek8:profile:v1";
export const VERSION = APP_VERSION;
export const MAX_ATTEMPTS = 10_000;
export const MAX_IMPORT_BYTES = 16_000_000;
export interface Attempt {
  topic: TopicId;
  input: string;
  tries: number;
  hintLevel: number;
  revealed: boolean;
  assisted: boolean;
  success: boolean;
  independent: boolean;
  result?: GradeResult;
  /** Stored only when the learner explicitly chooses to save this explanation. */
  reflection?: string;
  updatedAt: string;
}
export interface TopicProgress {
  step: number;
  visited: number[];
  lab: LabState;
  practiceIndex: number;
  generatedSeed: number;
  generatedMode: boolean;
  exitRound: number;
  exampleSteps: number[];
}
export interface Profile {
  schemaVersion: typeof SCHEMA_VERSION;
  appVersion: string;
  updatedAt: string;
  settings: { calm: boolean; largeText: boolean };
  lessons: Record<TopicId, TopicProgress>;
  attempts: Record<string, Attempt>;
  lastTopic?: TopicId;
  reviewSeed: number;
  /** Preserve the currently open schema-1 mixed task until the learner requests another. */
  legacyReviewSeed?: number;
}
export function emptyTopic(): TopicProgress {
  return {
    step: 0,
    visited: [],
    lab: {},
    practiceIndex: 0,
    generatedSeed: 1,
    generatedMode: false,
    exitRound: 0,
    exampleSteps: [1, 1],
  };
}
export function emptyProfile(): Profile {
  return {
    schemaVersion: SCHEMA_VERSION,
    appVersion: VERSION,
    updatedAt: new Date().toISOString(),
    settings: { calm: false, largeText: false },
    lessons: Object.fromEntries(
      TOPICS.map((id) => [id, emptyTopic()]),
    ) as Record<TopicId, TopicProgress>,
    attempts: {},
    reviewSeed: 1,
  };
}
export function emptyAttempt(topic: TopicId): Attempt {
  return {
    topic,
    input: "",
    tries: 0,
    hintLevel: 0,
    revealed: false,
    assisted: false,
    success: false,
    independent: false,
    updatedAt: new Date().toISOString(),
  };
}
export function recordGrade(before: Attempt, result: GradeResult): Attempt {
  const valid = result.status !== "invalid";
  const independentNow =
    result.correct &&
    before.tries === 0 &&
    !before.assisted &&
    !before.revealed;
  return {
    ...before,
    result,
    tries: before.tries + (valid ? 1 : 0),
    assisted: before.assisted || (valid && !result.correct),
    success: before.success || result.correct,
    independent: before.independent || independentNow,
  };
}
const isObject = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const integer = (v: unknown, min: number, max: number): v is number =>
  Number.isInteger(v) && Number(v) >= min && Number(v) <= max;
const bool = (v: unknown): v is boolean => typeof v === "boolean";
const date = (v: unknown): v is string =>
  typeof v === "string" && v.length < 40 && Number.isFinite(Date.parse(v));
const topic = (v: unknown, allowed: readonly TopicId[]): v is TopicId =>
  allowed.includes(v as TopicId);

function storedInput(value: unknown, schema: 1 | 2): value is string {
  if (typeof value !== "string") return false;
  // Existing single-response input bounds stay intact. The only new longer
  // format is a bounded, validated map of scalar part responses in schema 2.
  return (
    value.length <= 200 || (schema === 2 && decodePartResponses(value) !== null)
  );
}

/** Validate an imported copy before changing any existing profile. */
export function validateProfile(value: unknown): Profile {
  if (
    !isObject(value) ||
    (value.schemaVersion !== 1 && value.schemaVersion !== SCHEMA_VERSION)
  )
    throw new Error(
      "Ez nem támogatott Matek8-mentés (támogatott sémák: 1 és 2).",
    );
  const schema = value.schemaVersion;
  const expectedTopics: readonly TopicId[] =
    schema === 1 ? LEGACY_TOPICS : TOPICS;
  if (
    typeof value.appVersion !== "string" ||
    value.appVersion.length > 40 ||
    !date(value.updatedAt)
  )
    throw new Error("Hiányos verzió- vagy dátumadat.");
  if (
    !isObject(value.settings) ||
    !bool(value.settings.calm) ||
    !bool(value.settings.largeText)
  )
    throw new Error("Hibás megjelenítési beállítás.");
  if (!isObject(value.lessons) || !isObject(value.attempts))
    throw new Error("Hiányzik a tanulási állapot.");
  if (
    Object.keys(value.lessons).some(
      (id) => !expectedTopics.includes(id as TopicId),
    )
  )
    throw new Error("A mentés a megadott sémában ismeretlen leckét tartalmaz.");
  // Validate every required source topic before admitting migration. New topics
  // alone receive defaults; a missing old topic or a missing v2 topic is corrupt.
  const next = emptyProfile();
  next.appVersion = value.appVersion;
  next.updatedAt = value.updatedAt;
  next.settings = {
    calm: value.settings.calm,
    largeText: value.settings.largeText,
  };
  for (const id of expectedTopics) {
    const item = value.lessons[id];
    if (
      !isObject(item) ||
      !integer(item.step, 0, 5) ||
      !Array.isArray(item.visited) ||
      item.visited.length > 6 ||
      !item.visited.every((s) => integer(s, 0, 5))
    )
      throw new Error("Hibás leckeállapot: " + id);
    if (
      !integer(item.practiceIndex, 0, 100) ||
      !integer(item.generatedSeed, 1, 1_000_000_000) ||
      !bool(item.generatedMode) ||
      !integer(item.exitRound, 0, 1_000_000)
    )
      throw new Error("Hibás gyakorlóállapot: " + id);
    if (
      !Array.isArray(item.exampleSteps) ||
      item.exampleSteps.length > 10 ||
      !item.exampleSteps.every((n) => integer(n, 0, 100))
    )
      throw new Error("Hibás példalépések.");
    if (!isObject(item.lab) || Object.keys(item.lab).length > 50)
      throw new Error("Hibás műhelyállapot.");
    const lab: LabState = {};
    for (const [key, val] of Object.entries(item.lab)) {
      if (
        !/^[a-zA-Z][a-zA-Z0-9_]{0,40}$/.test(key) ||
        ["constructor", "prototype"].includes(key)
      )
        throw new Error("Hibás műhelymező.");
      if (
        typeof val === "number" &&
        Number.isFinite(val) &&
        Math.abs(val) <= 1e12
      )
        lab[key] = val;
      else if (typeof val === "string" && val.length <= 1000) lab[key] = val;
      else if (typeof val === "boolean") lab[key] = val;
      else if (
        Array.isArray(val) &&
        val.length <= 1000 &&
        val.every(
          (n) =>
            typeof n === "number" && Number.isFinite(n) && Math.abs(n) <= 1e12,
        )
      )
        lab[key] = [...val];
      else throw new Error("Nem támogatott műhelyérték.");
    }
    next.lessons[id] = {
      step: item.step,
      visited: [...new Set(item.visited as number[])],
      lab,
      practiceIndex: item.practiceIndex,
      generatedSeed: item.generatedSeed,
      generatedMode: item.generatedMode,
      exitRound: item.exitRound,
      exampleSteps: [...item.exampleSteps] as number[],
    };
  }
  const entries = Object.entries(value.attempts);
  if (entries.length > MAX_ATTEMPTS)
    throw new Error(
      `A mentés legfeljebb ${MAX_ATTEMPTS} feladatrekordot tartalmazhat.`,
    );
  for (const [key, item] of entries) {
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9_.:=\-]{0,159}$/.test(key) ||
      ["constructor", "prototype"].includes(key) ||
      !isObject(item)
    )
      throw new Error("Hibás feladatazonosító.");
    if (
      !topic(item.topic, expectedTopics) ||
      !storedInput(item.input, schema) ||
      !integer(item.tries, 0, 100_000) ||
      !integer(item.hintLevel, 0, 20) ||
      !date(item.updatedAt)
    )
      throw new Error("Hibás feladatállapot.");
    if (
      ![item.revealed, item.assisted, item.success, item.independent].every(
        bool,
      )
    )
      throw new Error("Hibás eredményjelzés.");
    if (item.independent && !item.success)
      throw new Error("Ellentmondó eredményjelzés.");
    if (
      schema === 2 &&
      item.reflection !== undefined &&
      (typeof item.reflection !== "string" || item.reflection.length > 2000)
    )
      throw new Error(
        "Az elmentett indoklás hibás vagy túl hosszú (legfeljebb 2000 karakter).",
      );
    const clean: Attempt = {
      topic: item.topic,
      input: item.input,
      tries: item.tries,
      hintLevel: item.hintLevel,
      updatedAt: item.updatedAt,
      revealed: item.revealed as boolean,
      assisted: item.assisted as boolean,
      success: item.success as boolean,
      independent: item.independent as boolean,
    };
    if (schema === 2 && typeof item.reflection === "string")
      clean.reflection = item.reflection;
    // Feedback is recalculated by the application; untrusted saved messages are not imported.
    next.attempts[key] = clean;
  }
  if (value.lastTopic !== undefined) {
    if (!topic(value.lastTopic, expectedTopics))
      throw new Error("Ismeretlen legutóbbi téma.");
    next.lastTopic = value.lastTopic;
  }
  if (!integer(value.reviewSeed, 1, 1_000_000_000))
    throw new Error("Hibás vegyes gyakorlási azonosító.");
  next.reviewSeed = value.reviewSeed;
  if (schema === 1) next.legacyReviewSeed = value.reviewSeed;
  else if (value.legacyReviewSeed !== undefined) {
    if (
      !integer(value.legacyReviewSeed, 1, 1_000_000_000) ||
      value.legacyReviewSeed !== value.reviewSeed
    )
      throw new Error("Hibás korábbi vegyes feladat-hivatkozás.");
    next.legacyReviewSeed = value.legacyReviewSeed;
  }
  return next;
}
const utf8 = new TextEncoder();
function checkProfileSize(text: string): void {
  if (utf8.encode(text).byteLength > MAX_IMPORT_BYTES)
    throw new Error(
      `A mentés legfeljebb ${MAX_IMPORT_BYTES / 1_000_000} MB (${MAX_IMPORT_BYTES} bájt) lehet.`,
    );
}

/** Use the same validated, compact representation for local saves and exports. */
export function serializeProfile(profile: Profile): string {
  const text = JSON.stringify(validateProfile(profile));
  checkProfileSize(text);
  return text;
}

export function parseImport(text: string): Profile {
  checkProfileSize(text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Ez a fájl nem olvasható JSON-mentés.");
  }
  return validateProfile(parsed);
}
export function loadProfile(storage?: Pick<Storage, "getItem">): {
  profile: Profile;
  problem: string;
} {
  try {
    const data = storage?.getItem(STORAGE_KEY);
    if (!data) return { profile: emptyProfile(), problem: "" };
    return { profile: parseImport(data), problem: "" };
  } catch (error) {
    return {
      profile: emptyProfile(),
      problem:
        "A korábbi helyi mentést nem tudtam megnyitni. Változatlanul megőriztem. " +
        (error instanceof Error ? error.message : ""),
    };
  }
}
export function saveProfile(
  profile: Profile,
  storage: Pick<Storage, "setItem">,
): string {
  let text: string;
  try {
    text = serializeProfile(profile);
  } catch (error) {
    return (
      "A haladást nem mentettem el; a korábbi helyi mentést nem írtam felül. " +
      (error instanceof Error
        ? error.message
        : "A mentési adatok nem érvényesek.")
    );
  }
  try {
    storage.setItem(STORAGE_KEY, text);
    return "";
  } catch {
    return "A böngésző most nem tudja tartósan menteni a haladást. A korábbi mentést nem írtam felül. A munkád itt megmarad; töltsd le a mentést a Beállításokban.";
  }
}

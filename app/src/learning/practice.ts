import type { Exercise, TopicId } from "../types.ts";
import type { Profile } from "../progress.ts";
import { lessons } from "../content/lessons.ts";
import { generateExercise, generatorFamilies, familiesFor } from "../math/generators.ts";
import {
  canonicalExerciseId, getSkill, getSkillTargets, getRequiredPartIds, responseFingerprint, SKILLS,
  skillSummary, sourceExerciseId,
} from "./skills.ts";
import type { SkillDefinition, SkillId, SkillTarget } from "./skills.ts";
import { generateTargetedExercise, TARGETED_GENERATOR_FAMILIES } from "./repair-generators.ts";
export { TARGETED_GENERATOR_FAMILIES } from "./repair-generators.ts";

export type PracticeStage = "repair" | "transfer";
export interface Recommendation {
  skillId: SkillId;
  skill: SkillDefinition;
  reason: string;
  sourceExerciseId?: string;
  partId?: string;
  priority: number;
  kind: "retry" | "helped";
}
export function practiceRecommendations(profile: Profile): Recommendation[] {
  return skillSummary(profile)
    .filter((summary) => summary.needsPractice)
    .map((summary) => ({
      skillId: summary.skillId, skill: summary.skill, reason: summary.reason,
      sourceExerciseId: summary.lastEvent?.sourceExerciseId,
      ...(summary.lastOutcome?.partId ? { partId: summary.lastOutcome.partId } : {}),
      priority: summary.lastOutcome?.status === "incorrect" ? 3 : summary.lastOutcome?.status === "form" ? 2 : 1,
      kind: summary.lastOutcome?.status === "correct" ? "helped" as const : "retry" as const,
    }))
    .sort((a, b) => b.priority - a.priority || SKILLS.findIndex((skill) => skill.id === a.skillId) - SKILLS.findIndex((skill) => skill.id === b.skillId));
}
export interface TargetedPractice {
  exercise: Exercise;
  locator: string;
  skillId: SkillId;
  stage: PracticeStage;
  sourceExerciseId: string;
  targetPartId?: string;
  reason: string;
  sourceKind: "generated" | "authored";
  applicationKind: "different" | "same-structure";
}
interface Candidate {
  source: Exercise;
  partId?: string;
  familyId?: string;
  sourceKind: "generated" | "authored";
  seed?: number;
  variant?: number;
  targeted?: boolean;
}
const authored = () => lessons.flatMap((lesson) => [...lesson.practice, ...lesson.exit]);
const familyIdOf = (id: string) => /^(?:generated|targeted-generated):([^:]+):/.exec(id)?.[1];
const validSourceId = (id: string) => id === "" || /^[A-Za-z0-9][A-Za-z0-9_.:=\-]{0,159}$/.test(id);
const validPartId = (id: string) => id === "" || (/^[A-Za-z][A-Za-z0-9_-]{0,39}$/.test(id) && !["constructor", "prototype", "__proto__"].includes(id));
const integer = (text: string) => /^\d{1,10}$/.test(text) && Number.isSafeInteger(Number(text)) && Number(text) <= 1_000_000_000;

function resolveSource(id: string): Exercise | undefined {
  const canonical = canonicalExerciseId(id);
  const fixed = authored().find((exercise) => exercise.id === canonical);
  if (fixed) return fixed;
  const targeted = /^targeted-generated:([^:]+):seed=(\d+):variant=(\d+)$/.exec(canonical);
  if (targeted) {
    const family = TARGETED_GENERATOR_FAMILIES.find((item) => item.id === targeted[1]);
    if (!family || !integer(targeted[2]) || !integer(targeted[3]) || Number(targeted[3]) >= family.variants) return undefined;
    return generateTargetedExercise(family.id, Number(targeted[2]), Number(targeted[3]));
  }
  const generated = /^generated:([^:]+):seed=(\d+):variant=(\d+)$/.exec(canonical);
  if (!generated || !integer(generated[2]) || !integer(generated[3])) return undefined;
  const family = generatorFamilies.find((item) => item.id === generated[1]);
  if (!family) return undefined;
  const exercise = generateExercise(family.topic, Number(generated[2]), Number(generated[3]));
  return exercise.id === canonical ? exercise : undefined;
}
function targetParts(exercise: Exercise, skillId: SkillId): (string | undefined)[] {
  return [...new Set(getSkillTargets(exercise).filter((target) => target.skillId === skillId).map((target) => target.partId))];
}
function contentSignature(exercise: Exercise): string {
  return responseFingerprint(JSON.stringify({ prompt: exercise.prompt, context: exercise.context ?? "", answer: exercise.answer }));
}
function isDifferentApplication(candidate: Candidate, previousSourceId: string): boolean {
  const previous = previousSourceId ? resolveSource(previousSourceId) : undefined;
  const previousFamily = previous ? familyIdOf(previous.id) : undefined;
  if (candidate.familyId && previousFamily && candidate.familyId !== previousFamily) return true;
  if (candidate.targeted && candidate.familyId === previousFamily && /:variant=(\d+)$/.exec(previous?.id ?? "")?.[1] !== String(candidate.variant)) return true;
  if (candidate.source.kind !== "transfer") return false;
  if (!previous) return true;
  if (candidate.familyId && candidate.familyId === previousFamily) return false;
  return candidate.source.id !== previous.id;
}
function locatorFor(candidate: Candidate, previousSourceId: string): string {
  if (candidate.targeted) return ["t", candidate.familyId, candidate.seed, candidate.variant, candidate.partId ?? "", previousSourceId].join("|");
  return candidate.sourceKind === "generated"
    ? ["g", candidate.source.topic, candidate.seed, candidate.variant, candidate.partId ?? "", previousSourceId].join("|")
    : ["a", candidate.source.id, candidate.partId ?? "", previousSourceId].join("|");
}
function makePractice(candidate: Candidate, skillId: SkillId, stage: PracticeStage, previousSourceId: string): TargetedPractice | null {
  const skill = getSkill(skillId);
  if (!skill || !targetParts(candidate.source, skillId).includes(candidate.partId)) return null;
  const source = candidate.source;
  const part = source.answer.kind === "parts" ? source.answer.parts.find((item) => item.id === candidate.partId) : undefined;
  if (source.answer.kind === "parts" && !part) return null;
  const requiredIds = part ? getRequiredPartIds(source, part.id) : [];
  const selectedIds = new Set([...requiredIds, ...(part ? [part.id] : [])]);
  const grouped = requiredIds.length > 0 && source.answer.kind === "parts"
    ? source.answer.parts.filter((item) => selectedIds.has(item.id))
    : undefined;
  const selectedTargets = getSkillTargets(source).filter((target) => grouped ? selectedIds.has(target.partId!) : target.partId === candidate.partId);
  const targetSkills = [...new Set(selectedTargets.map((target) => target.skillId))];
  const id = "targeted:" + stage + ":" + source.id + (candidate.partId ? ":part=" + candidate.partId : "");
  if (!validSourceId(id)) return null;
  const exercise: Exercise = {
    ...source,
    id,
    prompt: grouped
      ? source.prompt + "\nEbben a körben az összefüggő részválaszokat együtt add meg: " + grouped.map((item) => item.label).join("; ") + ". A kiválasztott rész értelmezéséhez ezek az előzmények is szükségesek."
      : part
        ? source.prompt + "\nEbben a körben csak ezt a részválaszt add meg: " + part.label + "."
      : source.prompt,
    answer: grouped ? { kind: "parts", parts: grouped.map((item) => ({ ...item, skillIds: [...new Set(selectedTargets.filter((target) => target.partId === item.id).map((target) => target.skillId))] })) } : part?.answer ?? source.answer,
    mistakes: grouped ? source.mistakes : part?.mistakes ?? source.mistakes,
    skillIds: targetSkills,
    learningSource: { exerciseId: source.id, ...(candidate.partId && !grouped ? { partId: candidate.partId } : {}) },
    ...(part ? {
      reflection: {
        prompt: "Miért jogos a lépésed ennél a részfeladatnál?",
        checkpoints: [...skill.checkpoints],
      },
    } : {}),
  };
  const applicationKind = isDifferentApplication(candidate, previousSourceId) ? "different" : "same-structure";
  const reason = (stage === "repair"
    ? "Új feladaton gyakorolhatod ezt a gondolatot: " + skill.title + (part && !grouped ? ". Most a kijelölt részválaszra figyelj." : ".")
    : applicationKind === "different"
      ? "Másik alkalmazási helyzetben vagy feladatszerkezetben próbálhatod ki ugyanezt a gondolatot. A siker erre az új feladatra vonatkozik."
      : "Ugyanennek a feladatszerkezetnek új adatokkal való gyakorlása következik. Ez önmagában nem bizonyít más helyzetre történő tudásátvitelt.") + (grouped ? " A kiválasztott részhez szükséges előzményeket együtt ellenőrizzük." : "");
  return {
    exercise, locator: locatorFor(candidate, previousSourceId), skillId, stage,
    sourceExerciseId: source.id, ...(candidate.partId ? { targetPartId: candidate.partId } : {}),
    reason, sourceKind: candidate.sourceKind, applicationKind,
  };
}

/**
 * Opaque public task locator. Replaying does not inspect progress or events,
 * so answering and reloading cannot silently replace an open question.
 */
export function replayTargetedExercise(skillId: string, stage: PracticeStage, locator: string): TargetedPractice | null {
  if (!getSkill(skillId) || !["repair", "transfer"].includes(stage) || typeof locator !== "string" || locator.length > 500) return null;
  const fields = locator.split("|");
  if (fields[0] === "t") {
    const family = TARGETED_GENERATOR_FAMILIES.find((item) => item.id === fields[1]);
    if (!family || fields.length !== 6 || !integer(fields[2]) || !integer(fields[3]) || Number(fields[3]) >= family.variants || !validPartId(fields[4]) || !validSourceId(fields[5])) return null;
    const source = generateTargetedExercise(family.id, Number(fields[2]), Number(fields[3]));
    return makePractice({
      source, sourceKind: "generated", familyId: family.id, targeted: true,
      seed: Number(fields[2]), variant: Number(fields[3]), ...(fields[4] ? { partId: fields[4] } : {}),
    }, skillId as SkillId, stage, fields[5]);
  }
  if (fields[0] === "g") {
    if (fields.length !== 6 || !integer(fields[2]) || !integer(fields[3]) || !validPartId(fields[4]) || !validSourceId(fields[5])) return null;
    const topic = fields[1] as TopicId;
    if (!familiesFor(topic).length) return null;
    const source = generateExercise(topic, Number(fields[2]), Number(fields[3]));
    return makePractice({
      source, sourceKind: "generated", familyId: familyIdOf(source.id),
      seed: Number(fields[2]), variant: Number(fields[3]), ...(fields[4] ? { partId: fields[4] } : {}),
    }, skillId as SkillId, stage, fields[5]);
  }
  if (fields[0] === "a") {
    if (fields.length !== 4 || !validSourceId(fields[1]) || !validPartId(fields[2]) || !validSourceId(fields[3])) return null;
    const source = authored().find((exercise) => exercise.id === fields[1]);
    if (!source) return null;
    return makePractice({ source, sourceKind: "authored", ...(fields[2] ? { partId: fields[2] } : {}) }, skillId as SkillId, stage, fields[3]);
  }
  return null;
}

/**
 * Select a fresh source and a genuinely relevant part, with deterministic seeds.
 * Exclude an open, unanswered source without pretending it was attempted.
 * A finite authored pool may run out: null is honest, never a recycled "new" task.
 */
export function chooseTargetedExercise(profile: Profile, requestedSkill: string, stage: PracticeStage, sequence = 0, excludeSourceId?: string): TargetedPractice | null {
  const skill = getSkill(requestedSkill);
  if (!skill || !["repair", "transfer"].includes(stage) || !Number.isSafeInteger(sequence) || sequence < 0 || sequence > 1_000_000 || (excludeSourceId !== undefined && (typeof excludeSourceId !== "string" || !validSourceId(excludeSourceId)))) return null;
  const skillId = skill.id;
  const summary = skillSummary(profile).find((row) => row.skillId === skillId)!;
  const previousSourceId = summary.lastEvent?.sourceExerciseId ?? "";
  const previousFamily = familyIdOf(previousSourceId);
  const preferredPart = summary.lastOutcome?.partId;
  const seenSources = new Set(Object.keys(profile.attempts).map(canonicalExerciseId));
  for (const event of profile.learning.events) seenSources.add(event.sourceExerciseId);
  if (excludeSourceId) seenSources.add(canonicalExerciseId(excludeSourceId));
  // Reconstruct public tasks, not saved answers, to avoid collisions where two seeds
  // happen to generate exactly the same prompt and data. This work is bounded by
  // the profile's existing attempt/event limits.
  const seenContent = new Set<string>();
  const resolved = new Map<string, Exercise | undefined>();
  const resolve = (id: string) => {
    if (!resolved.has(id)) resolved.set(id, resolveSource(id));
    return resolved.get(id);
  };
  for (const id of seenSources) {
    const source = resolve(id);
    if (source && getSkillTargets(source).some((target) => target.skillId === skillId)) seenContent.add(contentSignature(source));
  }
  const candidates: Candidate[] = [];
  const add = (source: Exercise, sourceKind: "generated" | "authored", seed?: number, variant?: number, targeted = false) => {
    if (seenSources.has(source.id) || seenContent.has(contentSignature(source))) return;
    const relevant = targetParts(source, skillId);
    if (!relevant.length) return;
    const partId = relevant.includes(preferredPart) ? preferredPart : relevant[sequence % relevant.length];
    candidates.push({ source, sourceKind, ...(partId ? { partId } : {}), ...(sourceKind === "generated" ? { familyId: familyIdOf(source.id), seed, variant, targeted } : {}) });
  };
  for (const source of authored()) add(source, "authored");
  const skillIndex = SKILLS.findIndex((item) => item.id === skillId);
  const firstSeed = 7_000_000 + (skillIndex + 1) * 10_000 + sequence * 97 + (stage === "transfer" ? 50_000_000 : 0);
  for (const family of generatorFamilies) {
    const variant = familiesFor(family.topic).findIndex((item) => item.id === family.id);
    // Several seeds are needed for families whose precise dimension/type varies.
    for (let offset = 0; offset < 12; offset++) {
      const seed = firstSeed + offset;
      const source = generateExercise(family.topic, seed, variant);
      const previousCount = candidates.length;
      add(source, "generated", seed, variant);
      if (candidates.length > previousCount) break;
    }
  }
  for (const family of TARGETED_GENERATOR_FAMILIES) {
    for (let variant = 0; variant < family.variants; variant++) {
      for (let offset = 0; offset < 12; offset++) {
        const seed = firstSeed + offset;
        const source = generateTargetedExercise(family.id, seed, variant);
        const previousCount = candidates.length;
        add(source, "generated", seed, variant, true);
        if (candidates.length > previousCount) break;
      }
    }
  }
  const rank = (candidate: Candidate): number => {
    if (stage === "repair") {
      if (candidate.sourceKind === "generated") return candidate.familyId === previousFamily ? 0 : 1;
      return 2;
    }
    if (candidate.sourceKind === "authored" && candidate.source.kind === "transfer") return 0;
    if (candidate.familyId && previousFamily && candidate.familyId !== previousFamily) return 1;
    if (candidate.targeted && isDifferentApplication(candidate, previousSourceId)) return 1;
    if (candidate.source.kind === "transfer" && isDifferentApplication(candidate, previousSourceId)) return 2;
    if (candidate.sourceKind === "authored") return 3;
    return 4;
  };
  candidates.sort((a, b) => rank(a) - rank(b) || (a.source.topic === skill.topic ? 0 : 1) - (b.source.topic === skill.topic ? 0 : 1) || (a.source.id < b.source.id ? -1 : a.source.id > b.source.id ? 1 : 0));
  for (const candidate of candidates) {
    const result = makePractice(candidate, skillId, stage, previousSourceId);
    if (result) return result;
  }
  return null;
}

import type { Lesson, TopicId } from "../types.ts";
import { lessons } from "./lessons.ts";

// These are curriculum goals with an explicit lesson and independent exercise,
// not a claim that an entire broad module is complete.
const legacyCoverage: Partial<
  Record<TopicId, { ready: string[]; partial: string[] }>
> = {
  tortek: {
    ready: ["M02.01", "M02.03", "M02.05", "M02.06", "M02.07"],
    partial: ["M02.02", "M02.04", "M02.08"],
  },
  szazalek: {
    ready: ["M06.01", "M06.02", "M06.03", "M06.04", "M06.05"],
    partial: ["M06.06"],
  },
  egyenlet: {
    ready: [
      "M10.01",
      "M10.02",
      "M10.03",
      "M10.04",
      "M10.05",
      "M10.06",
      "M10.08",
    ],
    partial: ["M10.07", "M09.04", "M12.05"],
  },
  grafikon: {
    ready: ["M13.02", "M13.03", "M13.04", "M13.06"],
    partial: ["M13.01", "M13.05", "M05.05"],
  },
  pitagorasz: {
    ready: ["M18.01", "M18.02", "M18.03", "M18.05"],
    partial: ["M18.04", "M08.01"],
  },
  valoszinuseg: {
    ready: ["M22.02", "M22.03", "M22.04", "M22.05"],
    partial: ["M22.01"],
  },
};
const foundationPartial: Partial<Record<TopicId, string[]>> = {
  szamfogalom: ["M01.01", "M01.04", "M01.05", "M03.04"],
  "muveleti-sorrend": [
    "M03.04",
    "M03.05",
    "M03.06",
    "M07.01",
    "M07.02",
    "M07.05",
  ],
  aranyossag: ["M05.07", "M13.04", "M13.07"],
  mertekegysegek: ["M20.05", "M16.05", "M19.05"],
};
const prerequisites: Partial<Record<TopicId, TopicId[]>> = {
  "muveleti-sorrend": ["szamfogalom"],
  tortek: ["szamfogalom", "muveleti-sorrend"],
  aranyossag: ["szamfogalom", "muveleti-sorrend"],
  mertekegysegek: ["szamfogalom", "aranyossag"],
  szazalek: ["tortek", "aranyossag"],
  egyenlet: ["szamfogalom", "muveleti-sorrend", "tortek"],
  grafikon: ["aranyossag"],
  pitagorasz: ["muveleti-sorrend", "mertekegysegek"],
  valoszinuseg: ["tortek", "aranyossag"],
};
export const prerequisitesFor = (lesson: Lesson): TopicId[] =>
  lesson.prerequisiteTopics ?? prerequisites[lesson.id] ?? [];

export function unitCoverage(id: string) {
  const ready = lessons.filter((lesson) =>
    (lesson.coveredUnits ?? legacyCoverage[lesson.id]?.ready ?? []).includes(
      id,
    ),
  );
  const partial = lessons.filter(
    (lesson) =>
      !ready.includes(lesson) &&
      [
        ...(legacyCoverage[lesson.id]?.partial ?? []),
        ...(foundationPartial[lesson.id] ?? []),
      ].includes(id),
  );
  return {
    id,
    status: ready.length ? "ready" : partial.length ? "partial" : "planned",
    ready,
    partial,
  };
}
export function lessonsForModule(moduleId: string): Lesson[] {
  return lessons.filter(
    (lesson) =>
      lesson.moduleId === moduleId ||
      [
        ...(lesson.coveredUnits ?? []),
        ...(legacyCoverage[lesson.id]?.ready ?? []),
        ...(legacyCoverage[lesson.id]?.partial ?? []),
        ...(foundationPartial[lesson.id] ?? []),
      ].some((unit) => unit.startsWith(`${moduleId}.`)),
  );
}

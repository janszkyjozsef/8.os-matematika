import { APP_VERSION } from "../version.ts";
import { lessons } from "./lessons.ts";
import { curriculum } from "./curriculum.ts";
import { generatorFamilies } from "../math/generators.ts";
import { contentStats } from "./stats.ts";
import { SKILLS } from "../learning/skills.ts";
import { SCHEMA_VERSION } from "../topics.ts";
import { TARGETED_GENERATOR_FAMILIES } from "../learning/repair-generators.ts";

/** The release exposes the exact objects used by the UI, not a separate copy. */
export const contentSnapshot = {
  version: APP_VERSION,
  lessons,
  curriculum,
  generatorFamilies,
  targetedGeneratorFamilies: TARGETED_GENERATOR_FAMILIES,
  skills: SKILLS,
  profileSchema: SCHEMA_VERSION,
  stats: contentStats(lessons, generatorFamilies, TARGETED_GENERATOR_FAMILIES),
};

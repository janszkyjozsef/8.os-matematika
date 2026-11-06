import { APP_VERSION } from "../version.ts";
import { lessons } from "./lessons.ts";
import { curriculum } from "./curriculum.ts";
import { generatorFamilies } from "../math/generators.ts";
import { contentStats } from "./stats.ts";

/** The release exposes the exact objects used by the UI, not a separate copy. */
export const contentSnapshot = {
  version: APP_VERSION,
  lessons,
  curriculum,
  generatorFamilies,
  stats: contentStats(lessons, generatorFamilies),
};

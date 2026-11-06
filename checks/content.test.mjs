import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runInNewContext } from "node:vm";
import { contentSnapshot } from "../app/src/content/snapshot.ts";
import { legacyLessons } from "../app/src/content/lessons.ts";
import { TOPICS } from "../app/src/topics.ts";
import {
  unitCoverage,
  lessonsForModule,
  prerequisitesFor,
} from "../app/src/content/coverage.ts";

const rootFile = (path) =>
  readFile(new URL("../" + path, import.meta.url), "utf8");
const html = await rootFile("index.html");
const manifest = JSON.parse(await rootFile("release-manifest.json"));
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
// Stable named export, rather than guessed minified variable names. No DOM,
// network, filesystem, process or require is supplied to the isolated context.
const extracted = runInNewContext(
  script + "; Matek8.contentSnapshot;",
  { TextEncoder },
  { timeout: 3000 },
);
const bundled = JSON.parse(JSON.stringify(extracted));

test("A forrás, az olvasható snapshot és a valódi HTML ugyanazt a tananyagot tartalmazza", async () => {
  assert.equal(manifest.version, contentSnapshot.version);
  assert.deepEqual(bundled, contentSnapshot);
  for (const key of ["lessons", "curriculum", "generatorFamilies"]) {
    const data = JSON.parse(
      await rootFile(`${manifest.contentDirectory}/${key}.json`),
    );
    assert.deepEqual(data, bundled[key], key);
  }
  assert.deepEqual(manifest.counts, bundled.stats);
  assert.deepEqual(manifest.lessons, [...TOPICS]);
});

test("A v0.1.0 történeti leckemásolat változatlan, és a hat eredeti lecke nem veszett el", async () => {
  assert.deepEqual(
    legacyLessons,
    JSON.parse(await rootFile("content/v0.1.0/lessons.json")),
  );
  assert.deepEqual(
    contentSnapshot.curriculum,
    JSON.parse(await rootFile("content/v0.1.0/curriculum.json")),
  );
  for (const lesson of legacyLessons)
    assert.deepEqual(
      bundled.lessons.find((item) => item.id === lesson.id),
      lesson,
    );
});

test("Minden regisztrált úthoz tartozik lecke, generátor és érvényes tantervi kapcsolat", () => {
  const { lessons, curriculum, generatorFamilies } = contentSnapshot;
  assert.equal(lessons.length, 10);
  assert.equal(
    lessons.reduce((n, l) => n + l.practice.length, 0),
    96,
  );
  assert.equal(
    lessons.reduce((n, l) => n + l.exit.length, 0),
    20,
  );
  assert.equal(
    lessons.reduce((n, l) => n + l.examples.length, 0),
    20,
  );
  const questions = lessons.flatMap((l) => [
    l.prediction,
    ...l.practice,
    ...l.exit,
  ]);
  assert.equal(new Set(questions.map((e) => e.id)).size, questions.length);
  const units = new Set(
    curriculum.flatMap((m) =>
      m.units.map((_, i) => `${m.id}.${String(i + 1).padStart(2, "0")}`),
    ),
  );
  assert.equal(curriculum.length, 24);
  assert.equal(units.size, 137);
  for (const topic of TOPICS) {
    const lesson = lessons.find((l) => l.id === topic);
    assert.ok(lesson, topic);
    assert.ok(
      generatorFamilies.some((family) => family.topic === topic),
      topic,
    );
    for (const unit of lesson.coveredUnits ?? [])
      assert.ok(units.has(unit), unit);
    for (const prior of prerequisitesFor(lesson))
      assert.ok(TOPICS.includes(prior) && prior !== topic);
  }
  assert.ok(
    lessonsForModule("M03").length >= 2,
    "Multiple lessons can contribute to a module.",
  );
  assert.equal(
    unitCoverage("M01.06").status,
    "planned",
    "A broad introduction cannot mark an unfinished unit ready.",
  );
});

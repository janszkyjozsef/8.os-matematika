/** Publish only a freshly built app/release artifact; never copy app/index.html. */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { contentSnapshot } from "../app/src/content/snapshot.ts";

const root = fileURLToPath(new URL("..", import.meta.url));
const build = JSON.parse(
  await readFile(resolve(root, "app/release/build.json"), "utf8"),
);
if (build.version !== contentSnapshot.version)
  throw new Error("A build és a forrás verziója eltér.");
const filename = `Matek8_Offline_v${contentSnapshot.version.replaceAll(".", "_")}.html`;
if (build.filename !== filename) throw new Error("Váratlan kiadási fájlnév.");
const html = await readFile(resolve(root, "app/release", filename));
if (
  !html.includes(
    Buffer.from(`name="matek8-version" content="${build.version}"`),
  )
)
  throw new Error("Hibás HTML-verzió.");
if (html.includes(Buffer.from("/src/main.tsx")))
  throw new Error("A Vite-belépő nem publikálható.");
const folder = `content/v${build.version}`;
await mkdir(resolve(root, folder), { recursive: true });
for (const key of ["lessons", "curriculum", "generatorFamilies"]) {
  await writeFile(
    resolve(root, folder, `${key}.json`),
    JSON.stringify(contentSnapshot[key], null, 2) + "\n",
  );
}
const manifest = {
  product: "Matek8 — Értsd is!",
  version: build.version,
  kind: "reproducible-standalone-release",
  entry: "index.html",
  source: "app/",
  offlineFile: filename,
  contentDirectory: folder,
  bytes: html.length,
  sha256: createHash("sha256").update(html).digest("hex"),
  lessons: contentSnapshot.lessons.map((lesson) => lesson.id),
  counts: contentSnapshot.stats,
  note: "A kiadás integritása nem helyettesíti a böngészős ellenőrzést és a tanári, tanulói kipróbálást.",
};
await writeFile(resolve(root, "index.html"), html);
await writeFile(
  resolve(root, "release-manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  `Kiadás: v${build.version}, ${html.length} bájt, SHA-256 ${manifest.sha256}`,
);

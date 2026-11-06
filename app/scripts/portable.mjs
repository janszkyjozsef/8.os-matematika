import { build } from "esbuild";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const metadata = JSON.parse(await readFile("package.json", "utf8"));
const filename = `Matek8_Offline_v${metadata.version.replaceAll(".", "_")}.html`;
const result = await build({
  entryPoints: ["src/main.tsx"],
  bundle: true,
  write: false,
  outfile: "release/matek8.js",
  format: "iife",
  globalName: "Matek8",
  minify: true,
  target: "es2022",
  jsx: "automatic",
  jsxImportSource: "preact",
  legalComments: "inline",
});
const js = result.outputFiles
  .find((file) => file.path.endsWith(".js"))
  .text.replace(/<\/script/gi, "<\\/script");
const css =
  result.outputFiles.find((file) => file.path.endsWith(".css"))?.text || "";
const preactLicense = await readFile("node_modules/preact/LICENSE", "utf8");
const notices = await readFile("../THIRD_PARTY_NOTICES.md", "utf8");
if (!notices.replaceAll("\r\n", "\n").includes(preactLicense.trim())) {
  throw new Error(
    "A Preact telepített licencét hiánytalanul meg kell őrizni a THIRD_PARTY_NOTICES.md fájlban.",
  );
}
const favicon = Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="17" fill="#203b3b"/><text x="8" y="43" fill="#c8eb85" font-family="Arial" font-size="33" font-weight="bold">m8</text></svg>',
).toString("base64");
const html = `<!doctype html>
<html lang="hu"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#203b3b"><meta name="matek8-version" content="${metadata.version}"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';"><meta name="description" content="Matek8 — Értsd is! Magyar matematikaműhely nyolcadikosoknak: interaktív tanulási utak, indoklás és magyarázott gyakorlás."><title>Matek8 — Értsd is!</title><link rel="icon" href="data:image/svg+xml;base64,${favicon}"><style>${css}</style></head><body><div id="app"></div><noscript>A műhely használatához engedélyezett JavaScript szükséges. A kód és a tananyag ebben a fájlban található.</noscript><script>${js}</script></body></html>
<!-- Third-party runtime: Preact\n${preactLicense.replace(/-->/g, "-- >")} -->\n`;
await mkdir("release", { recursive: true });
await writeFile(resolve("release", filename), html);
await writeFile(
  "release/build.json",
  JSON.stringify(
    { version: metadata.version, filename, bytes: Buffer.byteLength(html) },
    null,
    2,
  ) + "\n",
);
console.log(
  `Önálló HTML: ${resolve("release", filename)} (${Buffer.byteLength(html)} bájt)`,
);

/**
 * Browser checks of the exact generated/released standalone artifact.
 * Starts its own ephemeral loopback servers under /8.os-matematika/ and uses
 * fresh browser contexts only. No remote URL or existing session is accepted.
 * Run from any directory: node app/tests/foundations-browser.mjs
 * Optional: MATEK8_CHROMIUM_PATH=/absolute/path/to/chromium
 * The old export is created by the actual, hash-checked v0.1.1 application UI.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const root = resolve(appRoot, "..");
const require = createRequire(resolve(appRoot, "package.json"));
const { chromium } = require("playwright");
const AxeModule = require("@axe-core/playwright");
const AxeBuilder = AxeModule.default ?? AxeModule;
const out = resolve(appRoot, "test-results", "foundations");
const reportPath = resolve(out, "foundations-browser-report.json");
const prefix = "/8.os-matematika/";
const storageKey = "matek8:profile:v1";
const foundationIds = ["szamfogalom", "muveleti-sorrend", "aranyossag", "mertekegysegek"];
const legacyIds = ["tortek", "szazalek", "egyenlet", "grafikon", "pitagorasz", "valoszinuseg"];
const legacyCommit = "69d58b46a2b8162e60a8a28197ad0ed6b7fd1e82";
const legacySha256 = "2858d9533e1bdbbd4a514c78b7bfdf14e50fc6f50e0be182bf649b3f601cc97b";
const sha256 = bytes => createHash("sha256").update(bytes).digest("hex");
const normalize = text => text.replaceAll("−", "-").replaceAll("\u00a0", " ").replace(/\s+/g, " ").trim();
const report = {
  suite: "Matek8 standalone foundations, migration and reflow",
  startedAt: new Date().toISOString(),
  artifact: null,
  browser: "",
  checks: [],
  authoredExercises: [],
  generatedExercises: [],
  accessibility: [],
  layouts: [],
  screenshots: [],
  pdfs: [],
  pageErrors: [],
  consoleErrors: [],
  externalRequests: [],
  offlineHttpRequests: [],
  notes: [
    "Authored answers come from the content snapshot exposed by the tested HTML. These checks verify UI and persistence, not independent mathematical truth.",
    "Generated references are also compared with the actual rendered ID and prompt before entry; mathematical generator checks run separately.",
    "Automated accessibility/reflow checks and screenshots do not establish classroom effectiveness.",
  ],
};
await mkdir(out, { recursive: true });

let browser;
let currentServer;
let legacyServer;
let page;
let currentUrl;
let legacyUrl;
let snapshot;
let sourceGenerator;
let offlinePath;

async function serve(html) {
  const server = createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    if (url.pathname === prefix || url.pathname === `${prefix}index.html`) {
      response.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      response.end(html);
    } else if (url.pathname === "/favicon.ico") {
      response.writeHead(204);
      response.end();
    } else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not found");
    }
  });
  await new Promise((done, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", done);
  });
  return { server, url: `http://127.0.0.1:${server.address().port}${prefix}` };
}

async function closeServer(server) {
  if (server) await new Promise((done, reject) => server.close(error => error ? reject(error) : done()));
}

async function isolatedContext(label, options = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: "reduce", locale: "hu-HU", acceptDownloads: true,
    serviceWorkers: "block", ...options,
  });
  const origins = [currentUrl, legacyUrl].filter(Boolean).map(url => new URL(url).origin);
  await context.route("**/*", async route => {
    const requestUrl = route.request().url();
    if (/^https?:/.test(requestUrl) && !origins.includes(new URL(requestUrl).origin)) {
      report.externalRequests.push({ context: label, url: requestUrl });
      await route.abort();
    } else await route.continue();
  });
  context.on("page", p => {
    p.setDefaultTimeout(10_000);
    p.on("pageerror", error => report.pageErrors.push({ context: label, message: String(error) }));
    p.on("console", message => {
      if (message.type() === "error") report.consoleErrors.push({ context: label, message: message.text() });
    });
  });
  return context;
}

async function settle(p = page) {
  await p.evaluate(() => new Promise(done => requestAnimationFrame(() => requestAnimationFrame(done))));
}

async function route(path, p = page) {
  await p.evaluate(value => { location.hash = value; }, path);
  await p.waitForFunction(value => location.hash === `#${value}`, path);
  await settle(p);
}

async function lessonStep(topic, index, p = page) {
  await route(`lecke/${topic}`, p);
  await p.locator(".lesson-steps button").nth(index).click();
  await settle(p);
  assert.equal(await p.locator('.lesson-steps [aria-current="step"]').count(), 1);
}

async function saved(p = page) {
  return p.evaluate(key => JSON.parse(localStorage.getItem(key)), storageKey);
}

async function setLargeText(enabled, p = page) {
  await route("beallitasok", p);
  await p.getByRole("checkbox", { name: /Nagyobb betűk/ }).setChecked(enabled);
  await settle(p);
  assert.equal(await p.locator("html").evaluate(el => el.classList.contains("large-text")), enabled);
}

function scalarAnswer(spec) {
  if (spec.kind === "number") return spec.expected;
  if (spec.kind === "choice") return spec.correct;
  if (spec.kind === "expression") return spec.accepted[0];
  throw new Error(`Unsupported scalar answer: ${spec.kind}`);
}

async function fillScalar(scope, spec, input = scalarAnswer(spec)) {
  if (spec.kind === "choice") {
    const option = spec.options.find(option => option.id === input);
    assert.ok(option, `Unknown choice ID ${input}`);
    await scope.getByRole("radio", { name: option.text, exact: true }).check();
  } else await scope.locator('input[type="text"]').fill(input);
}

async function fillAnswers(card, exercise) {
  if (exercise.answer.kind === "parts") {
    assert.equal(await card.locator(".answer-part").count(), exercise.answer.parts.length, exercise.id);
    for (const part of exercise.answer.parts) {
      await fillScalar(card.locator(`[data-part="${part.id}"]`), part.answer);
    }
  } else await fillScalar(card, exercise.answer);
}

async function answer(card, exercise) {
  await fillAnswers(card, exercise);
  await card.getByRole("button", { name: "Ellenőrzöm", exact: true }).click();
  await card.locator(".answer-feedback.correct").waitFor();
  if (exercise.answer.kind === "parts") {
    assert.equal(await card.locator(".part-feedback.correct").count(), exercise.answer.parts.length, exercise.id);
  }
}

async function choosePractice(lesson, exercise, p = page) {
  await lessonStep(lesson.id, 4, p);
  await p.getByRole("button", { name: `Alapfeladatok · ${lesson.practice.length}`, exact: true }).click();
  const index = lesson.practice.findIndex(item => item.id === exercise.id);
  assert.ok(index >= 0);
  await p.locator(".exercise-dots button").nth(index).click();
  await settle(p);
  const card = p.locator(".exercise-card");
  assert.equal(await card.locator(".exercise-id code").textContent(), exercise.id);
  return card;
}

async function downloadProfile(p, name) {
  await route("beallitasok", p);
  const waiting = p.waitForEvent("download");
  await p.getByRole("button", { name: "Haladás letöltése", exact: true }).click();
  const download = await waiting;
  const path = resolve(out, name);
  await download.saveAs(path);
  return { path, text: await readFile(path, "utf8") };
}

async function screenshot(name, p = page) {
  const path = resolve(out, name);
  await p.evaluate(() => scrollTo(0, 0));
  await settle(p);
  await p.screenshot({ path, fullPage: true });
  report.screenshots.push(relative(root, path));
}

async function axe(label, p = page) {
  const result = await new AxeBuilder({ page: p })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  report.accessibility.push({
    label,
    violations: result.violations.map(item => ({
      id: item.id, impact: item.impact, description: item.description,
      nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary, html: node.html })),
    })),
  });
}

async function inspectLayout(label) {
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  report.layouts.push({ label, ...dimensions });
}

async function keyboardScrollRegion(selector, label) {
  const region = page.locator(selector);
  assert.equal(await region.count(), 1);
  const before = await region.evaluate(element => ({
    left: element.scrollLeft, clientWidth: element.clientWidth, scrollWidth: element.scrollWidth,
    viewport: innerWidth, pageWidth: document.documentElement.scrollWidth,
  }));
  assert.ok(before.scrollWidth > before.clientWidth, `${label}: the mobile content must actually extend beyond the local viewport`);
  assert.equal(before.left, 0, `${label}: keyboard interaction starts at the left edge`);
  await region.focus();
  assert.equal(await region.evaluate(element => element === document.activeElement), true);
  await page.keyboard.press("ArrowRight");
  await page.waitForFunction(element => element.scrollLeft > 0, await region.elementHandle());
  const after = await region.evaluate(element => ({
    left: element.scrollLeft, viewport: innerWidth, pageWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }));
  assert.ok(after.left > 0, `${label}: ArrowRight must reveal content inside the focused region`);
  assert.equal(after.viewport, before.viewport);
  assert.equal(after.pageWidth, before.pageWidth);
  assert.ok(Math.max(after.pageWidth, after.bodyWidth) <= after.viewport + 1, `${label}: local scrolling must not widen the page`);
  (report.keyboardScroll ??= []).push({ label, before, after });
}

async function check(name, action) {
  const started = Date.now();
  try {
    await action();
    report.checks.push({ name, passed: true, ms: Date.now() - started });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({ name, passed: false, error: String(error), ms: Date.now() - started });
    if (page && !page.isClosed()) await screenshot(`failure-${report.checks.length}.png`).catch(() => {});
    throw error;
  } finally {
    await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
  }
}

try {
  let html;
  let legacyHtml;
  await check("Exact current release, offline artifact and historical v0.1.1 integrity", async () => {
    const metadata = JSON.parse(await readFile(resolve(appRoot, "package.json"), "utf8"));
    const manifest = JSON.parse(await readFile(resolve(root, "release-manifest.json"), "utf8"));
    const build = JSON.parse(await readFile(resolve(appRoot, "release/build.json"), "utf8"));
    assert.equal(manifest.version, metadata.version);
    assert.equal(build.version, metadata.version);
    assert.equal(build.filename, `Matek8_Offline_v${metadata.version.replaceAll(".", "_")}.html`);
    assert.equal(manifest.offlineFile, build.filename);
    html = await readFile(resolve(root, manifest.entry));
    const portable = await readFile(resolve(appRoot, "release", build.filename));
    assert.equal(html.length, manifest.bytes);
    assert.equal(html.length, build.bytes);
    assert.equal(sha256(html), manifest.sha256);
    assert.deepEqual(html, portable, "The published root file must be the tested current portable build");
    assert.ok(html.includes(Buffer.from(`name="matek8-version" content="${metadata.version}"`)));
    assert.ok(!html.includes(Buffer.from("/src/main.tsx")));
    legacyHtml = execFileSync("git", ["show", `${legacyCommit}:index.html`], { cwd: root, maxBuffer: 2_000_000 });
    assert.equal(sha256(legacyHtml), legacySha256);
    offlinePath = resolve(out, build.filename);
    await writeFile(offlinePath, portable);
    report.artifact = {
      version: manifest.version, bytes: html.length, sha256: sha256(html),
      entry: relative(root, resolve(root, manifest.entry)), offlineFile: build.filename,
      legacy: { commit: legacyCommit, bytes: legacyHtml.length, sha256: sha256(legacyHtml) },
    };
  });

  const current = await serve(html);
  currentServer = current.server;
  currentUrl = current.url;
  const old = await serve(legacyHtml);
  legacyServer = old.server;
  legacyUrl = old.url;
  browser = await chromium.launch({
    headless: true, executablePath: process.env.MATEK8_CHROMIUM_PATH || undefined,
    args: ["--disable-dev-shm-usage"],
  });
  report.browser = browser.version();
  const context = await isolatedContext("current release");
  page = await context.newPage();
  await page.goto(currentUrl);
  await page.locator(".topic-card").first().waitFor();
  snapshot = await page.evaluate(() => globalThis.Matek8?.contentSnapshot);
  assert.ok(snapshot, "The actual released artifact must expose its own content snapshot");
  sourceGenerator = (await import(pathToFileURL(resolve(appRoot, "src/math/generators.ts")).href)).generateExercise;

  await check("Subdirectory routing and embedded registered-topic content agree with the release manifest", async () => {
    const manifest = JSON.parse(await readFile(resolve(root, "release-manifest.json"), "utf8"));
    assert.equal(snapshot.version, manifest.version);
    assert.deepEqual(snapshot.stats, manifest.counts);
    assert.deepEqual(snapshot.lessons.map(lesson => lesson.id), manifest.lessons);
    assert.equal(snapshot.lessons.length, 14);
    assert.equal(await page.locator(".topic-card").count(), snapshot.lessons.length);
    assert.deepEqual(snapshot.lessons, JSON.parse(await readFile(resolve(root, manifest.contentDirectory, "lessons.json"), "utf8")));
    assert.equal(new URL(page.url()).pathname, prefix);
  });

  await check("Actual legacy UI export migrates after preview and preserves generated replay on reload", async () => {
    const legacyContext = await isolatedContext("v0.1.1 export producer");
    const legacy = await legacyContext.newPage();
    await legacy.goto(legacyUrl);
    await legacy.locator(".topic-card").first().waitFor();
    assert.equal(await legacy.locator(".topic-card").count(), 6);
    await lessonStep("tortek", 1, legacy);
    const numbers = legacy.locator(".lab-number");
    await numbers.nth(1).fill("3");
    await numbers.nth(0).fill("2");
    await numbers.nth(3).fill("4");
    await numbers.nth(2).fill("1");
    await legacy.getByRole("button", { name: "Mutasd ugyanakkora részekben" }).click();
    assert.match(await legacy.locator(".lab-summary").innerText(), /11\/12/);
    await lessonStep("tortek", 4, legacy);
    await legacy.locator('.exercise-card input[type="text"]').fill("5/6");
    await legacy.locator(".exercise-card").getByRole("button", { name: "Ellenőrzöm", exact: true }).click();
    await legacy.locator(".answer-feedback.correct").waitFor();
    await legacy.getByRole("button", { name: "Új példák", exact: true }).click();
    for (let i = 0; i < 4; i++) await legacy.getByRole("button", { name: "Új feladatot kérek", exact: true }).click();
    await legacy.locator('.exercise-card input[type="text"]').fill("123");
    const generated = {
      id: await legacy.locator(".exercise-card .exercise-id code").textContent(),
      prompt: await legacy.locator(".exercise-card .exercise-prompt").innerText(),
      input: "123",
    };
    assert.match(generated.id, /seed=5:variant=1$/);
    await route("gyakorlas", legacy);
    for (let i = 0; i < 6; i++) await legacy.getByRole("button", { name: "Jöhet egy másik téma", exact: true }).click();
    await legacy.locator('.exercise-card input[type="text"]').fill("456");
    const mixed = {
      id: await legacy.locator(".exercise-card .exercise-id code").textContent(),
      prompt: await legacy.locator(".exercise-card .exercise-prompt").innerText(),
      input: "456",
    };
    assert.match(mixed.id, /seed=50007:variant=1$/);
    await route("beallitasok", legacy);
    await legacy.getByRole("checkbox", { name: /Nagyobb betűk/ }).check();
    await legacy.getByRole("checkbox", { name: /Nyugodt nézet/ }).check();
    const exported = await downloadProfile(legacy, "actual-legacy-v0.1.1-export.json");
    const original = JSON.parse(exported.text);
    assert.equal(original.schemaVersion, 1);
    assert.equal(Object.keys(original.lessons).length, 6);
    assert.equal(original.attempts["tortek-practice-1"].independent, true);
    assert.equal(original.lessons.tortek.generatedSeed, 5);
    assert.equal(original.attempts[generated.id].input, generated.input);

    await route("beallitasok");
    await page.getByRole("checkbox", { name: /Nyugodt nézet/ }).check();
    const before = await saved();
    await page.getByLabel("Haladásmentés megnyitása").setInputFiles(exported.path);
    await page.locator(".import-preview").waitFor();
    assert.deepEqual(await saved(), before, "Opening a preview must not replace the existing profile");
    await page.locator(".import-preview").getByRole("button", { name: "Mégsem", exact: true }).click();
    assert.deepEqual(await saved(), before, "Cancelling preview must preserve the profile");
    await page.getByLabel("Haladásmentés megnyitása").setInputFiles(exported.path);
    await page.locator(".import-preview").waitFor();
    await page.getByRole("button", { name: "Ezt a mentést használom", exact: true }).click();
    await page.reload();
    await page.getByRole("heading", { name: "A te beállításaid.", exact: true }).waitFor();
    const migrated = await saved();
    assert.equal(migrated.schemaVersion, 3);
    assert.equal(Object.keys(migrated.lessons).length, 14);
    assert.deepEqual(migrated.settings, original.settings);
    assert.deepEqual(migrated.attempts, original.attempts);
    assert.equal(migrated.lastTopic, original.lastTopic);
    assert.equal(migrated.reviewSeed, original.reviewSeed);
    assert.equal(migrated.legacyReviewSeed, original.reviewSeed);
    for (const id of legacyIds) assert.deepEqual(migrated.lessons[id], original.lessons[id], id);
    for (const id of foundationIds) assert.deepEqual(migrated.lessons[id], {
      step: 0, visited: [], lab: {}, practiceIndex: 0, generatedSeed: 1,
      generatedMode: false, exitRound: 0, exampleSteps: [1, 1],
    }, id);
    await route("gyakorlas");
    assert.equal(await page.locator(".exercise-card .exercise-id code").textContent(), mixed.id);
    assert.equal(await page.locator(".exercise-card .exercise-prompt").innerText(), mixed.prompt);
    assert.equal(await page.locator('.exercise-card input[type="text"]').inputValue(), mixed.input);
    await route("lecke/tortek");
    assert.equal(await page.locator(".exercise-card .exercise-id code").textContent(), generated.id);
    assert.equal(await page.locator(".exercise-card .exercise-prompt").innerText(), generated.prompt);
    assert.equal(await page.locator('.exercise-card input[type="text"]').inputValue(), generated.input);
    await lessonStep("tortek", 1);
    assert.match(await page.locator(".lab-summary").innerText(), /11\/12/);
    assert.deepEqual((await saved()).lessons.tortek.lab, original.lessons.tortek.lab);
    report.legacyMigration = {
      export: relative(root, exported.path), exportBytes: Buffer.byteLength(exported.text),
      exportedAppVersion: original.appVersion, generatedId: generated.id,
      mixedId: mixed.id, mixedSeed: original.reviewSeed,
      settingsPreserved: true, attemptsPreserved: true, oldLabsPreserved: true,
      newTopicsInitialized: foundationIds, reloaded: true,
    };
    await legacyContext.close();
    await setLargeText(false);
  });

  const foundations = foundationIds.map(id => {
    const lesson = snapshot.lessons.find(lesson => lesson.id === id);
    assert.ok(lesson, id);
    return lesson;
  });

  await check("Own-word explanations are optional, explicitly saved, removable and never auto-graded", async () => {
    const ownContext = await isolatedContext("reflection consent");
    const own = await ownContext.newPage();
    await own.goto(currentUrl);
    const lesson = foundations.find(lesson => lesson.practice.some(exercise => exercise.reflection));
    assert.ok(lesson, "At least one own-word practice task is required");
    const exercise = lesson.practice.find(exercise => exercise.reflection);
    let card = await choosePractice(lesson, exercise, own);
    const text = "A szám helyét és a nullától mért távolságát külön hasonlítom össze.";
    await card.locator(".own-reasoning textarea").fill(text);
    assert.equal(await card.locator('.reflection-save input[type="checkbox"]').isChecked(), false);
    assert.equal((await saved(own)).attempts[exercise.id]?.reflection, undefined);
    assert.notEqual((await saved(own)).attempts[exercise.id]?.success, true);
    await card.locator('.reflection-save input[type="checkbox"]').check();
    assert.equal((await saved(own)).attempts[exercise.id].reflection, text);
    assert.equal((await saved(own)).attempts[exercise.id].success, false);
    await own.reload();
    card = own.locator(".exercise-card");
    await card.waitFor();
    assert.equal(await card.locator(".own-reasoning textarea").inputValue(), text);
    assert.equal(await card.locator('.reflection-save input[type="checkbox"]').isChecked(), true);
    await card.locator('.reflection-save input[type="checkbox"]').uncheck();
    assert.equal((await saved(own)).attempts[exercise.id].reflection, undefined);
    await own.reload();
    await own.locator(".exercise-card").waitFor();
    assert.equal(await own.locator(".own-reasoning textarea").inputValue(), "");
    await own.locator(".own-reasoning summary").click();
    await answer(own.locator(".exercise-card"), exercise);
    assert.equal((await saved(own)).attempts[exercise.id].assisted, true);
    assert.equal((await saved(own)).attempts[exercise.id].independent, false);
    await lessonStep("szamfogalom", 1, own);
    await own.getByTestId("foundation-thought").fill(text);
    assert.equal(await own.getByTestId("foundation-thought-save").isChecked(), false);
    assert.notEqual((await saved(own)).lessons.szamfogalom.lab.thought, text);
    await own.getByTestId("foundation-thought-save").check();
    assert.equal((await saved(own)).lessons.szamfogalom.lab.thought, text);
    await own.reload();
    await own.getByTestId("foundation-thought").waitFor();
    assert.equal(await own.getByTestId("foundation-thought").inputValue(), text);
    assert.equal(await own.getByTestId("foundation-thought-save").isChecked(), true);
    await own.getByTestId("foundation-thought-save").uncheck();
    assert.equal((await saved(own)).lessons.szamfogalom.lab.thought, "");
    await own.reload();
    await own.getByTestId("foundation-thought").waitFor();
    assert.equal(await own.getByTestId("foundation-thought").inputValue(), "");
    await ownContext.close();
  });

  for (const lesson of foundations) {
    await check(`${lesson.id}: targeted wrong answer, two hints and honest assisted success`, async () => {
      let candidate;
      for (const exercise of lesson.practice) {
        if (exercise.mistakes?.length && exercise.answer.kind !== "parts") {
          candidate = { exercise, part: null, rule: exercise.mistakes[0] }; break;
        }
        if (exercise.answer.kind === "parts") {
          const part = exercise.answer.parts.find(part => part.mistakes?.length);
          if (part) { candidate = { exercise, part, rule: part.mistakes[0] }; break; }
        }
      }
      assert.ok(candidate, `${lesson.id} needs a targeted misconception test`);
      const { exercise, part, rule } = candidate;
      const card = await choosePractice(lesson, exercise);
      await fillAnswers(card, exercise);
      await fillScalar(part ? card.locator(`[data-part="${part.id}"]`) : card, part?.answer ?? exercise.answer, rule.input);
      await card.getByRole("button", { name: "Ellenőrzöm", exact: true }).click();
      await card.locator(".answer-feedback.retry").waitFor();
      assert.ok((await card.innerText()).includes(rule.feedback), `${lesson.id}: specific authored feedback is visible`);
      await card.getByRole("button", { name: "Kérek egy kapaszkodót", exact: true }).click();
      await card.getByRole("button", { name: "Következő kapaszkodó", exact: true }).click();
      assert.equal(await card.locator(".hints > div").count(), 2);
      await card.getByRole("button", { name: "Teljes magyarázat", exact: true }).click();
      assert.equal(await card.locator(".solution ol li").count(), exercise.solution.length);
      await answer(card, exercise);
      const attempt = (await saved()).attempts[exercise.id];
      assert.equal(attempt.success, true);
      assert.equal(attempt.assisted, true);
      assert.equal(attempt.independent, false);
    });

    await check(`${lesson.id}: all six stages, twelve complete authored practices and two exit tasks`, async () => {
      assert.equal(lesson.practice.length, 12);
      assert.equal(lesson.exit.length, 2);
      await lessonStep(lesson.id, 0);
      assert.equal(await page.locator(".intro-card .check-list li").count(), lesson.goals.length);
      await answer(page.locator(".exercise-card"), lesson.prediction);
      report.authoredExercises.push({ id: lesson.prediction.id, kind: lesson.prediction.answer.kind, role: "prediction" });
      await lessonStep(lesson.id, 1);
      await page.locator(".foundation-lab").waitFor();
      await lessonStep(lesson.id, 2);
      assert.equal(await page.locator(".explanation-list > section").count(), lesson.explanation.length);
      await lessonStep(lesson.id, 3);
      assert.equal(await page.locator(".worked-example").count(), 2);
      for (let i = 0; i < lesson.examples.length; i++) {
        const example = page.locator(".worked-example").nth(i);
        while (await example.getByRole("button", { name: "Mi következik?", exact: true }).count()) {
          await example.getByRole("button", { name: "Mi következik?", exact: true }).click();
        }
        assert.equal(await example.locator("ol > li").count(), lesson.examples[i].steps.length);
        assert.ok((await example.locator(".example-check").innerText()).includes(lesson.examples[i].check));
      }
      for (const exercise of lesson.practice) {
        const card = await choosePractice(lesson, exercise);
        await answer(card, exercise);
        assert.equal((await saved()).attempts[exercise.id].success, true);
        report.authoredExercises.push({ id: exercise.id, kind: exercise.answer.kind, parts: exercise.answer.kind === "parts" ? exercise.answer.parts.length : 1, role: "practice" });
      }
      await lessonStep(lesson.id, 5);
      for (let i = 0; i < lesson.exit.length; i++) {
        const exercise = { ...lesson.exit[i], id: `exit:${lesson.id}:0:${i}` };
        const card = page.locator(".exercise-card").nth(i);
        assert.equal(await card.locator(".exercise-id code").textContent(), exercise.id);
        await answer(card, exercise);
        assert.equal((await saved()).attempts[exercise.id].independent, true);
        report.authoredExercises.push({ id: lesson.exit[i].id, attemptId: exercise.id, kind: exercise.answer.kind, role: "exit" });
      }
      await page.locator(".completion-box").waitFor();
      assert.deepEqual([...(await saved()).lessons[lesson.id].visited].sort(), [0, 1, 2, 3, 4, 5]);
    });

    await check(`${lesson.id}: fresh exit round and generated-family replay`, async () => {
      await page.getByRole("button", { name: "Új önálló próba", exact: true }).click();
      assert.equal((await saved()).lessons[lesson.id].exitRound, 1);
      assert.equal(await page.locator(".completion-box").count(), 0);
      for (let i = 0; i < 2; i++) {
        const exercise = { ...sourceGenerator(lesson.id, 10_013 + i, i), id: `exit:${lesson.id}:1:${i}` };
        const card = page.locator(".exercise-card").nth(i);
        assert.equal(await card.locator(".exercise-id code").textContent(), exercise.id);
        assert.equal(await card.locator(".exercise-prompt").innerText(), exercise.prompt);
        assert.equal((await saved()).attempts[exercise.id], undefined);
        await answer(card, exercise);
        assert.equal((await saved()).attempts[exercise.id].independent, true);
        assert.equal((await saved()).attempts[`exit:${lesson.id}:0:${i}`].independent, true);
      }
      await page.locator(".completion-box").waitFor();
      await lessonStep(lesson.id, 4);
      await page.getByRole("button", { name: "Új példák", exact: true }).click();
      const families = snapshot.generatorFamilies.filter(family => family.topic === lesson.id);
      assert.ok(families.length >= 3);
      for (let i = 0; i < families.length; i++) {
        const state = (await saved()).lessons[lesson.id];
        const exercise = sourceGenerator(lesson.id, state.generatedSeed, (state.generatedSeed - 1) % families.length);
        const card = page.locator(".exercise-card");
        assert.equal(await card.locator(".exercise-id code").textContent(), exercise.id);
        assert.equal(await card.locator(".exercise-prompt").innerText(), exercise.prompt);
        await answer(card, exercise);
        const before = (await saved()).attempts[exercise.id];
        await page.reload();
        await page.locator(".exercise-card").waitFor();
        assert.equal(await page.locator(".exercise-card .exercise-id code").textContent(), exercise.id);
        assert.deepEqual((await saved()).attempts[exercise.id], before);
        await answer(page.locator(".exercise-card"), exercise);
        report.generatedExercises.push({ id: exercise.id, topic: lesson.id, reloaded: true });
        if (i < families.length - 1) await page.getByRole("button", { name: "Új feladatot kérek", exact: true }).click();
      }
    });
  }

  await check("Mixed practice rotates through every registered topic with working generators", async () => {
    await route("gyakorlas");
    assert.equal(await page.locator(".exercise-card .exercise-id code").textContent(), report.legacyMigration.mixedId);
    assert.equal((await saved()).legacyReviewSeed, report.legacyMigration.mixedSeed);
    await page.getByRole("button", { name: "Jöhet egy másik téma", exact: true }).click();
    assert.equal((await saved()).legacyReviewSeed, undefined);
    const seen = [];
    for (let i = 0; i < snapshot.lessons.length; i++) {
      const seed = (await saved()).reviewSeed;
      const lesson = snapshot.lessons[(seed - 1) % snapshot.lessons.length];
      const familyCount = snapshot.generatorFamilies.filter(family => family.topic === lesson.id).length;
      const exercise = sourceGenerator(lesson.id, 50_000 + seed, Math.floor((seed - 1) / snapshot.lessons.length) % familyCount);
      const card = page.locator(".exercise-card");
      assert.equal(await card.locator(".exercise-id code").textContent(), exercise.id);
      assert.equal(await card.locator(".exercise-prompt").innerText(), exercise.prompt);
      await answer(card, exercise);
      seen.push(lesson.id);
      await page.getByRole("button", { name: "Jöhet egy másik téma", exact: true }).click();
    }
    assert.deepEqual([...seen].sort(), snapshot.lessons.map(lesson => lesson.id).sort());
    report.mixedRotation = seen;
    await route("haladas");
    assert.equal(await page.locator(".progress-list > article").count(), snapshot.lessons.length);
    assert.match(await page.locator(".stat-grid > div").nth(2).innerText(), new RegExp("/\\s*" + snapshot.lessons.length));
  });

  // Workshop behaviour assertions are kept separate from exercise-answer fixtures.
  await check("Number line: order, opposite, distance and subtraction as movement", async () => {
    await lessonStep("szamfogalom", 1);
    await numberLineCases();
    await axe("number-line-workshop");
    await screenshot("number-line-desktop.png");
  });
  await check("Operation order: dependent chain, independent branches, powers and undefined division", async () => {
    await lessonStep("muveleti-sorrend", 1);
    await operationOrderCases();
    await axe("operation-order-workshop");
    await screenshot("operation-order-desktop.png");
  });
  await check("Proportionality: three models, three or more pairs and domain restrictions", async () => {
    await lessonStep("aranyossag", 1);
    await proportionCases();
    await axe("proportionality-workshop");
    await screenshot("proportionality-desktop.png");
  });
  await check("Units: dimension-sensitive conversions and square/cube scale model", async () => {
    await lessonStep("mertekegysegek", 1);
    await unitCases();
    await axe("units-workshop");
    await screenshot("units-desktop.png");
  });

  await check("Keyboard entry, skip link and new workshop controls", async () => {
    await page.goto(currentUrl);
    await page.locator(".topic-card").first().waitFor();
    await page.keyboard.press("Tab");
    assert.equal(await page.locator(":focus").textContent(), "Ugrás a tartalomhoz");
    await page.keyboard.press("Enter");
    assert.equal(await page.locator(":focus").getAttribute("id"), "main-content");
    const link = page.locator('.topic-card[href="#lecke/szamfogalom"]');
    await link.focus();
    await page.keyboard.press("Enter");
    await page.locator(".lesson-steps button").nth(1).focus();
    await page.keyboard.press("Enter");
    await page.getByTestId("number-a").focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("-5");
    await page.keyboard.press("Tab");
    await page.getByTestId("number-b").focus();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("-3");
    await page.keyboard.press("Tab");
    await page.getByTestId("number-operation").focus();
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    assert.equal(await page.getByTestId("number-operation").inputValue(), "subtract");
    await page.getByTestId("number-step-start").focus();
    await page.keyboard.press("Enter");
    await page.getByTestId("number-step-move").focus();
    await page.keyboard.press("Enter");
    assert.match(normalize(await page.getByTestId("number-result").innerText()), /-2/);
  });

  await check("All four printable worksheets retain fourteen tasks, every part and explained keys", async () => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await setLargeText(false);
    for (const lesson of foundations) {
      await route(`nyomtatas/${lesson.id}`);
      const exercises = [...lesson.practice, ...lesson.exit];
      assert.equal(await page.locator(".paper-exercise").count(), 14);
      await page.getByRole("checkbox", { name: "Megoldókulccsal együtt", exact: true }).uncheck();
      assert.equal(await page.locator(".paper-answers").count(), 0);
      const partCount = exercises.reduce((n, exercise) => n + (exercise.answer.kind === "parts" ? exercise.answer.parts.length : 0), 0);
      assert.equal(await page.locator(".paper-parts > li").count(), partCount);
      const reflectionCount = exercises.filter(exercise => exercise.reflection).length;
      assert.equal(await page.locator(".paper-exercise p").filter({ hasText: "Saját indoklás:" }).count(), reflectionCount);
      await page.getByRole("checkbox", { name: "Megoldókulccsal együtt", exact: true }).check();
      assert.equal(await page.locator(".paper-answers > section").count(), 14);
      assert.equal(await page.locator(".paper-answers h4").filter({ hasText: "Az indoklás önellenőrzése" }).count(), reflectionCount);
      if (lesson.id === "mertekegysegek") {
        await page.emulateMedia({ media: "print" });
        assert.equal(await page.locator(".sidebar").isVisible(), false);
        assert.equal(await page.locator(".print-controls").isVisible(), false);
        const pdf = resolve(out, `mertekegysegek-worksheet-v${snapshot.version}.pdf`);
        await page.pdf({ path: pdf, format: "A4", printBackground: true });
        const bytes = await readFile(pdf);
        assert.ok(bytes.length > 20_000);
        report.pdfs.push({ path: relative(root, pdf), bytes: bytes.length, sha256: sha256(bytes) });
        await page.emulateMedia({ media: "screen" });
      }
    }
  });

  await check("320/390px normal and large text: home, every workshop and the largest foundation multipart tasks", async () => {
    for (const width of [320, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const large of [false, true]) {
        await setLargeText(large);
        await route("felfedezes");
        await inspectLayout(`${width}px ${large ? "large" : "normal"} home`);
        if ((width === 390 && !large) || (width === 320 && large)) await screenshot(`home-${width}-${large ? "large" : "normal"}.png`);
        for (const lesson of snapshot.lessons) {
          await lessonStep(lesson.id, 1);
          await inspectLayout(`${width}px ${large ? "large" : "normal"} lab/${lesson.id}`);
          if (width === 320 && large && foundationIds.includes(lesson.id)) await screenshot(`${lesson.id}-320-large.png`);
          if (width === 320 && large && lesson.id === "aranyossag") {
            for (const message of ["Az ábra oldalra is görgethető.", "A táblázat oldalra is görgethető."]) {
              assert.equal(await page.getByTestId("foundation-scroll-hint").filter({ hasText: message }).isVisible(), true);
            }
            for (const id of ["proportion-ratio-toggle", "proportion-product-toggle"]) {
              const toggle = page.getByTestId(id);
              if (await toggle.getAttribute("aria-pressed") !== "true") await toggle.click();
            }
            await keyboardScrollRegion(".foundation-lab .lab-table-scroll", "320px large proportionality data table");
            await keyboardScrollRegion(".foundation-lab .lab-plot-scroll", "320px large proportionality graph");
          }
          if (width === 320 && large && lesson.id === "mertekegysegek") {
            await page.getByTestId("unit-enlarge").click();
            await inspectLayout("320px large lab/mertekegysegek doubled cube");
            await screenshot("units-cube-doubled-320-large.png");
            await page.getByTestId("unit-enlarge").click();
          }
        }
        for (const lesson of foundations) {
          const largest = [...lesson.practice].sort((a, b) => (b.answer.kind === "parts" ? b.answer.parts.length : 1) - (a.answer.kind === "parts" ? a.answer.parts.length : 1))[0];
          const card = await choosePractice(lesson, largest);
          await answer(card, largest);
          await inspectLayout(`${width}px ${large ? "large" : "normal"} multipart/${largest.id}`);
          if (width === 320 && large) {
            await screenshot(`${lesson.id}-multipart-320-large.png`);
            await axe(`multipart-${lesson.id}-320-large`);
          }
        }
      }
    }
    const overflow = report.layouts.filter(row => Math.max(row.documentWidth, row.bodyWidth) > row.viewport + 1);
    assert.deepEqual(overflow, [], "Horizontal page overflow; see layout rows and screenshots");
  });

  await check("Current standalone file completes a new lesson offline, reloads and exports with zero HTTP requests", async () => {
    const offlineContext = await isolatedContext("offline standalone", { offline: true, viewport: { width: 1280, height: 900 } });
    const offline = await offlineContext.newPage();
    offline.on("request", request => { if (/^https?:/.test(request.url())) report.offlineHttpRequests.push(request.url()); });
    await offline.goto(pathToFileURL(offlinePath).href);
    await offline.locator(".topic-card").first().waitFor();
    assert.equal(await offline.locator('meta[name="matek8-version"]').getAttribute("content"), report.artifact.version);
    const lesson = foundations.find(lesson => lesson.id === "muveleti-sorrend");
    await lessonStep(lesson.id, 0, offline);
    await answer(offline.locator(".exercise-card"), lesson.prediction);
    await lessonStep(lesson.id, 1, offline);
    await offline.locator(".foundation-lab").waitFor();
    await lessonStep(lesson.id, 2, offline);
    assert.equal(await offline.locator(".explanation-list > section").count(), lesson.explanation.length);
    await lessonStep(lesson.id, 3, offline);
    assert.equal(await offline.locator(".worked-example").count(), 2);
    const expression = lesson.practice.find(exercise => exercise.answer.kind === "expression" || (exercise.answer.kind === "parts" && exercise.answer.parts.some(part => part.answer.kind === "expression")));
    assert.ok(expression, "An actual typed-expression exercise is required for the offline check");
    await answer(await choosePractice(lesson, expression, offline), expression);
    await lessonStep(lesson.id, 5, offline);
    for (let i = 0; i < 2; i++) await answer(offline.locator(".exercise-card").nth(i), lesson.exit[i]);
    await offline.locator(".completion-box").waitFor();
    const before = await saved(offline);
    await offline.reload();
    await offline.locator(".completion-box").waitFor();
    const reloaded = await saved(offline);
    assert.deepEqual(reloaded.attempts, before.attempts);
    assert.deepEqual(reloaded.lessons[lesson.id], before.lessons[lesson.id]);
    const exported = await downloadProfile(offline, `actual-offline-v${snapshot.version}-export.json`);
    const profile = JSON.parse(exported.text);
    assert.equal(profile.schemaVersion, 3);
    assert.equal(profile.appVersion, report.artifact.version);
    assert.equal(profile.attempts[expression.id].independent, true);
    for (let i = 0; i < 2; i++) assert.equal(profile.attempts[`exit:${lesson.id}:0:${i}`].independent, true);
    assert.deepEqual(report.offlineHttpRequests, []);
    report.offline = { file: relative(root, offlinePath), export: relative(root, exported.path), completedLesson: lesson.id, reloaded: true, httpRequests: 0 };
    await screenshot("offline-new-lesson-export.png", offline);
    await offlineContext.close();
  });

  await check("No runtime errors, external requests, accessibility violations or stale artifact", async () => {
    assert.deepEqual(report.pageErrors, []);
    assert.deepEqual(report.consoleErrors, []);
    assert.deepEqual(report.externalRequests, []);
    const violations = report.accessibility.flatMap(scan => scan.violations.map(violation => ({ page: scan.label, ...violation })));
    assert.deepEqual(violations, [], "Accessibility findings are in foundations-browser-report.json");
    assert.equal(sha256(await readFile(resolve(root, "index.html"))), report.artifact.sha256, "The release changed during browser verification");
    assert.equal(sha256(await readFile(offlinePath)), report.artifact.sha256);
    assert.equal(report.authoredExercises.length, 60);
  });
} catch (error) {
  report.failure = String(error);
  process.exitCode = 1;
  console.error(error);
} finally {
  report.finishedAt = new Date().toISOString();
  report.passed = !report.failure && report.checks.length > 0 && report.checks.every(check => check.passed);
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
  await browser?.close();
  await closeServer(currentServer);
  await closeServer(legacyServer);
  console.log(`Browser evidence: ${reportPath}`);
}

// Filled from each workshop's public controls; no application state is patched.
async function numberLineCases() {
  const fact = async label => normalize(await page.locator(".fl-facts > div").filter({ has: page.getByText(label, { exact: true }) }).locator("dd").innerText());
  await page.getByTestId("number-a").fill("-8");
  await page.getByTestId("number-b").fill("-3");
  assert.equal(await fact("A számok sorrendje"), "-8 < -3");
  assert.equal(await fact("Az abszolút értékek sorrendje"), "|-8| > |-3|");
  await page.getByTestId("number-a").fill("2,5");
  if (await page.getByTestId("number-opposite").getAttribute("aria-pressed") !== "true") await page.getByTestId("number-opposite").click();
  assert.equal(await fact("Az a ellentettje"), "-(2,5) = -2,5");
  if (await page.getByTestId("number-absolute").getAttribute("aria-pressed") !== "true") await page.getByTestId("number-absolute").click();
  assert.match(await fact("Távolságuk a nullától"), /\|2,5\| = 2,5/);
  await page.getByTestId("number-a").fill("0");
  await page.getByTestId("number-b").fill("0");
  assert.equal(await fact("Az a ellentettje"), "-(0) = 0");
  assert.equal(await fact("Távolságuk a nullától"), "|0| = 0; |0| = 0");
  await page.getByTestId("number-a").fill("-6");
  await page.getByTestId("number-b").fill("4");
  assert.equal(await fact("A két pont távolsága"), "10 egység");
  await page.getByTestId("number-a").fill("12");
  await page.getByTestId("number-b").fill("12");
  await page.getByTestId("number-operation").selectOption("add");
  await page.getByTestId("number-step-move").click();
  assert.equal(await page.getByTestId("number-result").locator(".lab-equation strong").innerText(), "24");
  const endpoint = await page.getByTestId("number-result-point").evaluate(element => {
    const box = element.getBBox();
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  });
  const arrowEnd = await page.getByTestId("number-movement-arrow").evaluate(element => ({ x: element.x2.baseVal.value, y: element.y2.baseVal.value }));
  assert.ok(Math.abs(endpoint.x - arrowEnd.x) < 0.001, "The result on the number line and movement arrow must share the same coordinate");
  assert.equal(endpoint.y, 130);
  assert.equal(arrowEnd.y, 248);
  assert.ok(!normalize(await page.locator(".fl-numberline desc").textContent()).includes("tartomány -12 és 12"));
  await page.getByTestId("number-a").fill("-5");
  await page.getByTestId("number-b").fill("-3");
  await page.getByTestId("number-operation").selectOption("subtract");
  await page.getByTestId("number-step-start").click();
  await page.getByTestId("number-step-move").click();
  assert.equal(normalize(await page.getByTestId("number-result").locator(".lab-equation strong").innerText()), "-2");
  assert.match(normalize(await page.getByTestId("number-result").innerText()), /3 egységet lépünk jobbra/);
  assert.match(normalize(await page.getByTestId("number-result").innerText()), /a - b = a \+ \(-b\)/);
  const before = (await saved()).lessons.szamfogalom.lab;
  await page.reload();
  await page.getByTestId("number-result").waitFor();
  assert.deepEqual((await saved()).lessons.szamfogalom.lab, before);
}

async function operationOrderCases() {
  async function reduce(name, input) {
    await page.getByRole("button", { name, exact: typeof name === "string" }).click();
    await page.getByTestId("order-answer").fill(input);
    await page.getByTestId("order-submit").click();
    assert.match(await page.getByTestId("order-message").innerText(), /Helyes részszámítás/);
  }
  const final = async () => normalize(await page.getByTestId("order-final").locator("strong").innerText());
  await page.getByTestId("order-preset").selectOption("serial");
  const initial = await page.getByTestId("order-current").innerText();
  await page.getByRole("button", { name: "Másik csoportosítás?: 6 × 2", exact: true }).click();
  assert.equal(await page.getByTestId("order-current").innerText(), initial);
  assert.match(normalize(await page.getByTestId("order-message").innerText()), /azonos szint|balról jobbra/);
  assert.equal(await page.getByTestId("order-answer").count(), 0);
  await page.getByRole("button", { name: "Osztás: 24 : 6", exact: true }).click();
  await page.getByTestId("order-answer").fill("3");
  await page.getByTestId("order-submit").click();
  assert.equal(await page.getByTestId("order-current").innerText(), initial);
  await page.getByTestId("order-answer").fill("4");
  await page.getByTestId("order-submit").click();
  assert.equal(normalize(await page.getByTestId("order-current").innerText()), "4 × 2");
  await reduce("Szorzás: 4 × 2", "8");
  assert.equal(await final(), "8");
  for (const first of ["right", "left"]) {
    await page.getByTestId("order-preset").selectOption("left-independent");
    await page.getByTestId("order-reset").click();
    if (first === "right") {
      await reduce("Szorzás: 3 × 4", "12");
      assert.equal(normalize(await page.getByTestId("order-current").innerText()), "5 × 2 + 12");
      await reduce("Szorzás: 5 × 2", "10");
    } else {
      await reduce("Szorzás: 5 × 2", "10");
      assert.equal(normalize(await page.getByTestId("order-current").innerText()), "10 + 3 × 4");
      await reduce("Szorzás: 3 × 4", "12");
    }
    await reduce("Összeadás: 10 + 12", "22");
    assert.equal(await final(), "22");
  }
  await page.getByTestId("order-preset").selectOption("brackets");
  await reduce("Összeadás: 3 + 4", "7");
  await reduce(/^Szorzás: 2 × \(?7\)?$/, "14");
  assert.equal(await final(), "14");
  await page.getByTestId("order-preset").selectOption("minus-power");
  await reduce("Hatványozás: 3²", "9");
  await reduce("Ellentett képzése: −9", "-9");
  assert.equal(await final(), "-9");
  await page.getByTestId("order-preset").selectOption("negative-power");
  await reduce("Hatványozás: (−3)²", "9");
  assert.equal(await final(), "9");
  await page.getByTestId("order-preset").selectOption("zero");
  await reduce("Kivonás: 3 − 3", "0");
  assert.match(await page.getByTestId("order-final").innerText(), /nincs értelmezve/);
  assert.equal(await page.getByTestId("order-candidates").count(), 0);
  assert.doesNotMatch(await page.getByTestId("order-final").innerText(), /Infinity|NaN/);
  await page.locator(".fl-custom > summary").click();
  const stopped = await page.getByTestId("order-current").innerText();
  await page.getByLabel("Kifejezés", { exact: true }).fill("globalThis.__MATEK8_BAD__=1");
  await page.getByRole("button", { name: "Saját kifejezés indítása", exact: true }).click();
  assert.equal(await page.getByTestId("order-current").innerText(), stopped);
  assert.equal(await page.evaluate(() => Object.hasOwn(globalThis, "__MATEK8_BAD__")), false);
  await page.locator(".fl-custom > summary").click();
  await page.getByTestId("order-preset").selectOption("left-independent");
  await reduce("Szorzás: 3 × 4", "12");
  const before = (await saved()).lessons["muveleti-sorrend"].lab;
  await page.reload();
  await page.getByTestId("order-current").waitFor();
  assert.deepEqual((await saved()).lessons["muveleti-sorrend"].lab, before);
  assert.equal(normalize(await page.getByTestId("order-current").innerText()), "5 × 2 + 12");
  await page.getByRole("button", { name: "Szorzás: 5 × 2", exact: true }).click();
}

async function proportionCases() {
  const result = async (input, expected) => {
    await page.getByTestId("proportion-input").fill(input);
    await page.getByTestId("proportion-reveal").click();
    assert.equal(normalize(await page.getByTestId("proportion-result").locator("strong").innerText()), expected);
    assert.ok(await page.locator(".fl-proportion-table tbody tr").count() >= 3);
  };
  await page.getByTestId("proportion-model").selectOption("cord");
  await result("1,5", "600 Ft");
  await result("3", "1200 Ft");
  await page.getByTestId("proportion-ratio-toggle").click();
  const cordRows = await page.locator(".fl-proportion-table tbody tr").evaluateAll(rows => rows.map(row => [...row.cells].map(cell => cell.textContent)));
  for (const row of cordRows) assert.equal(row[2], row[0] === "0" ? "0-val itt nem osztunk" : "400");
  await result("0", "0 Ft");
  assert.doesNotMatch(await page.locator(".foundation-lab").innerText(), /Infinity|NaN/);
  await result("1/3", "400/3 Ft");
  const exactRow = () => page.getByTestId("proportion-data-row").and(page.locator('[data-sample-x="1/3"]'));
  const assertExactRow = async () => {
    assert.equal(await exactRow().count(), 1);
    assert.deepEqual(await exactRow().locator("th, td").allTextContents(), ["1/3", "400/3", "400"]);
  };
  await assertExactRow();
  const exactSamples = (await saved()).lessons.aranyossag.lab.exactSamples;
  assert.equal(typeof exactSamples, "string");
  assert.ok(exactSamples.length <= 1000);
  assert.ok(JSON.parse(exactSamples).includes("1/3"), "The saved sample must keep the exact rational input");
  await page.reload();
  await page.getByTestId("proportion-result").waitFor();
  await assertExactRow();
  assert.equal((await saved()).lessons.aranyossag.lab.exactSamples, exactSamples);
  await screenshot("proportionality-exact-fraction.png");
  const exported = await downloadProfile(page, `actual-exact-proportions-v${snapshot.version}-export.json`);
  const exactExport = JSON.parse(exported.text);
  assert.equal(exactExport.lessons.aranyossag.lab.exactSamples, exactSamples);
  await page.getByLabel("Haladásmentés megnyitása").setInputFiles(exported.path);
  await page.locator(".import-preview").waitFor();
  await page.getByRole("button", { name: "Ezt a mentést használom", exact: true }).click();
  await lessonStep("aranyossag", 1);
  await assertExactRow();
  assert.equal((await saved()).lessons.aranyossag.lab.exactSamples, exactSamples);
  report.exactProportions = { input: "1/3", output: "400/3", samples: JSON.parse(exactSamples), reloaded: true, imported: true, export: relative(root, exported.path) };
  await page.getByTestId("proportion-model").selectOption("work");
  const ticks = await page.getByTestId("proportion-x-tick").evaluateAll(elements => elements.map(element => ({
    value: Number(element.dataset.value), label: element.querySelector("text").textContent,
    lineX: element.querySelector("line").x1.baseVal.value,
    lineEndX: element.querySelector("line").x2.baseVal.value,
    labelX: element.querySelector("text").x.baseVal.getItem(0).value,
  })));
  assert.deepEqual(ticks.map(tick => tick.value), [0, 2, 4, 6, 8, 10, 12]);
  for (let i = 0; i < ticks.length; i++) {
    assert.equal(ticks[i].label, String(ticks[i].value));
    assert.ok(Math.abs(ticks[i].lineX - ticks[i].labelX) < 0.001, "Each tick line must be directly below its numeric label");
    assert.equal(ticks[i].lineX, ticks[i].lineEndX);
    assert.ok(Math.abs(ticks[i].lineX - (62 + ticks[i].value / 12 * 430)) < 0.001);
    if (i) assert.ok(Math.abs(ticks[i].lineX - ticks[i - 1].lineX - 430 / 6) < 0.001, "Equal increments of helper count need equally spaced ticks");
  }
  report.workModelAxis = ticks;
  assert.match(await page.locator(".lab-observation").innerText(), /azonos és állandó ütemben/);
  assert.match(await page.locator(".lab-observation").innerText(), /szabadon felosztható/);
  await result("3", "8 óra");
  await result("6", "4 óra");
  await page.getByTestId("proportion-product-toggle").click();
  const products = await page.locator(".fl-proportion-table tbody tr td:last-child").allTextContents();
  assert.ok(products.length >= 3 && products.every(product => product === "24"));
  for (const invalid of ["0", "1,5"]) {
    await page.getByTestId("proportion-input").fill(invalid);
    assert.equal(await page.getByTestId("proportion-reveal").isDisabled(), true);
    assert.equal(await page.getByTestId("proportion-result").count(), 0);
    assert.equal(await page.getByTestId("proportion-input").inputValue(), invalid);
    assert.match(await page.locator(".foundation-lab").innerText(), /pozitív egész/);
  }
  await result("5", "24/5 = 4,8 óra");
  await page.getByTestId("proportion-model").selectOption("fare");
  assert.equal(await page.locator(".fl-proportion-graph text").filter({ hasText: /^500$/ }).count(), 1, "The fixed fee must have a readable axis mark");
  await result("0", "500 Ft");
  await result("2", "900 Ft");
  await result("4", "1300 Ft");
  await page.getByTestId("proportion-ratio-toggle").click();
  await page.getByTestId("proportion-product-toggle").click();
  const fareRows = await page.locator(".fl-proportion-table tbody tr").evaluateAll(rows => rows.map(row => [...row.cells].map(cell => cell.textContent)));
  assert.ok(new Set(fareRows.filter(row => row[0] !== "0").map(row => row[2])).size > 1);
  assert.ok(new Set(fareRows.map(row => row[3])).size > 1);
  await page.getByLabel("Milyen kapcsolatot mutat a megadott modell?", { exact: true }).selectOption("neither");
  await page.getByRole("button", { name: "Kapcsolat ellenőrzése", exact: true }).click();
  assert.match(await page.locator(".foundation-lab").innerText(), /Helyes kapcsolatot választottál/);
  assert.match(await page.locator(".foundation-lab").innerText(), /adatpár önmagában még nem bizonyít/);
  assert.match(await page.locator(".fl-proportion-graph desc").textContent(), /nem egyenes arányosság/);
}

async function unitCases() {
  const geometry = async () => page.getByTestId("unit-object").evaluate(svg => [...svg.querySelectorAll("rect,line,polygon,path")].map(node => node.outerHTML));
  if (await page.getByTestId("unit-enlarge").getAttribute("aria-pressed") === "true") await page.getByTestId("unit-enlarge").click();
  await page.getByTestId("unit-dimension").selectOption("2");
  await page.getByTestId("unit-divide").click();
  assert.match(await page.getByTestId("unit-builder-result").innerText(), /1 dm² = 100 cm²/);
  const square = await geometry();
  const squareWidth = Number(await page.getByTestId("unit-physical-object").getAttribute("width"));
  const squareHeight = Number(await page.getByTestId("unit-physical-object").getAttribute("height"));
  await page.getByTestId("unit-display").selectOption("cm2");
  assert.deepEqual(await geometry(), square, "Changing the display unit must preserve the drawn object geometry");
  assert.match(await page.getByTestId("unit-object").locator("title").textContent(), /100 cm²/);
  await page.getByTestId("unit-enlarge").click();
  assert.match(await page.getByTestId("unit-builder-result").innerText(), /4 dm² = 400 cm²/);
  assert.match(await page.getByTestId("unit-builder-result").innerText(), /négyszeres terület/);
  assert.notDeepEqual(await geometry(), square);
  assert.equal(Number(await page.getByTestId("unit-physical-object").getAttribute("width")), squareWidth * 2);
  assert.equal(Number(await page.getByTestId("unit-physical-object").getAttribute("height")), squareHeight * 2);
  await page.getByTestId("unit-enlarge").click();
  await page.getByTestId("unit-dimension").selectOption("3");
  await page.getByTestId("unit-divide").click();
  assert.match(await page.getByTestId("unit-builder-result").innerText(), /1 dm³ = 1000 cm³ = 1 L/);
  const cube = await geometry();
  await page.getByTestId("unit-display").selectOption("l");
  assert.deepEqual(await geometry(), cube);
  await page.getByTestId("unit-layer").focus();
  await page.keyboard.press("End");
  assert.equal(await page.getByTestId("unit-layer").inputValue(), "10");
  await page.getByTestId("unit-enlarge").click();
  assert.match(await page.getByTestId("unit-builder-result").innerText(), /8 dm³ = 8000 cm³ = 8 L/);
  assert.match(await page.getByTestId("unit-builder-result").innerText(), /nyolcszoros térfogat/);
  await screenshot("units-cube-doubled-desktop.png");
  await page.getByTestId("unit-enlarge").click();
  for (const [amount, from, to, expected] of [
    ["2,5", "m", "cm", "2,5 m = 250 cm"],
    ["1", "dm2", "cm2", "1 dm² = 100 cm²"],
    ["0,4", "m2", "cm2", "0,4 m² = 4000 cm²"],
    ["1", "m2", "cm2", "1 m² = 10000 cm²"],
    ["1", "dm3", "l", "1 dm³ = 1 L"],
    ["750", "cm3", "l", "750 cm³ = 0,75 L"],
    ["1,25", "h", "min", "1,25 óra = 75 perc"],
    ["2,4", "kg", "g", "2,4 kg = 2400 g"],
    ["72", "kmh", "mps", "72 km/h = 20 m/s"],
    ["3/4", "l", "cm3", "0,75 L = 750 cm³"],
  ]) {
    await page.getByTestId("unit-from").selectOption(from);
    await page.getByTestId("unit-to").selectOption(to);
    await page.getByTestId("unit-amount").fill(amount);
    assert.equal(normalize(await page.getByTestId("unit-result").locator(".lab-equation strong").innerText()), expected);
  }
  await page.getByTestId("unit-from").selectOption("m2");
  assert.equal(await page.getByTestId("unit-to").locator('option[value="m"]').count(), 0);
  await page.getByRole("button", { name: "Miért nem váltunk 1 m²-t méterre?", exact: true }).click();
  assert.match(await page.locator(".fl-converter .lab-extension").innerText(), /Területet mérünk/);
  await page.getByRole("button", { name: "Miért nem váltunk 1 L-t kilogrammra?", exact: true }).click();
  assert.match(await page.locator(".fl-converter .lab-extension").innerText(), /sűrűség/);
  await page.getByTestId("unit-amount").fill("nincs szám");
  assert.match(await page.getByTestId("unit-result").innerText(), /Nemnegatív számot/);
  assert.equal(await page.getByTestId("unit-amount").inputValue(), "nincs szám");
  assert.equal(await page.getByTestId("unit-result").locator(".lab-equation").count(), 0);
  await page.getByTestId("unit-to").selectOption("cm2");
  await page.getByTestId("unit-amount").fill("0,4");
  assert.doesNotMatch(await page.getByTestId("unit-result").innerText(), /Infinity|NaN/);
}

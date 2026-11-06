/** Real UI checks of the exact portable release, isolated profiles and loopback servers only. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { resolve, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const appRoot = fileURLToPath(new URL("..", import.meta.url));
const root = resolve(appRoot, "..");
const require = createRequire(resolve(appRoot, "package.json"));
const { chromium } = require("playwright");
const AxeModule = require("@axe-core/playwright");
const AxeBuilder = AxeModule.default ?? AxeModule;
const out = resolve(appRoot, "test-results", "bridges");
const reportPath = resolve(out, "bridges-browser-report.json");
const ids = [
  "betus-kifejezesek",
  "szoveges-modellek",
  "hatvanyok",
  "negyzetgyok",
];
const storageKey = "matek8:profile:v1";
const oldCommit = "23ee76b0c6d1b1643345290b5a89e22ff45c4350";
const oldHash =
  "2d928d1c5adc23ba2888f5cbf0c3ed22479ea4b161f457927056995896aa9ed4";
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
const report = {
  suite: "Four bridge lessons, real v2 migration and targeted repair",
  startedAt: new Date().toISOString(),
  artifact: null,
  checks: [],
  accessibility: [],
  layouts: [],
  screenshots: [],
  pdfs: [],
  pageErrors: [],
  consoleErrors: [],
  externalRequests: [],
  authored: [],
  generated: [],
  notes: [
    "UI answers use the actual snapshot; independent mathematical oracles run separately in the source tests.",
    "No existing user browser or remote website is controlled.",
  ],
};
await mkdir(out, { recursive: true });
let browser,
  page,
  currentUrl,
  oldUrl,
  currentServer,
  oldServer,
  snapshot,
  offlinePath;
let generateExercise, practiceAPI, skillsAPI;
async function serve(bytes) {
  const server = createServer((req, res) => {
    const path = new URL(req.url ?? "/", "http://127.0.0.1").pathname;
    if (
      path === "/8.os-matematika/" ||
      path === "/8.os-matematika/index.html"
    ) {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      });
      res.end(bytes);
    } else if (path === "/favicon.ico") {
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404);
      res.end("Not found");
    }
  });
  await new Promise((done, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", done);
  });
  return {
    server,
    url: `http://127.0.0.1:${server.address().port}/8.os-matematika/`,
  };
}
async function closeServer(server) {
  if (server)
    await new Promise((done, reject) =>
      server.close((error) => (error ? reject(error) : done())),
    );
}
async function context(label, options = {}) {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    locale: "hu-HU",
    reducedMotion: "reduce",
    acceptDownloads: true,
    serviceWorkers: "block",
    ...options,
  });
  const allowed = [currentUrl, oldUrl]
    .filter(Boolean)
    .map((url) => new URL(url).origin);
  await c.route("**/*", async (route) => {
    const url = route.request().url();
    if (/^https?:/.test(url) && !allowed.includes(new URL(url).origin)) {
      report.externalRequests.push({ label, url });
      await route.abort();
    } else await route.continue();
  });
  c.on("page", (p) => {
    p.setDefaultTimeout(10000);
    p.on("pageerror", (error) =>
      report.pageErrors.push({ label, error: String(error) }),
    );
    p.on("console", (msg) => {
      if (msg.type() === "error")
        report.consoleErrors.push({ label, error: msg.text() });
    });
  });
  return c;
}
async function settle(p = page) {
  await p.evaluate(
    () =>
      new Promise((done) =>
        requestAnimationFrame(() => requestAnimationFrame(done)),
      ),
  );
}
async function route(hash, p = page) {
  await p.evaluate((value) => {
    location.hash = value;
  }, hash);
  await settle(p);
}
async function step(topic, index, p = page) {
  await route(`lecke/${topic}`, p);
  await p.locator(".lesson-steps button").nth(index).click();
  await settle(p);
}
async function saved(p = page) {
  return p.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
}
function scalarValue(answer) {
  return answer.kind === "number"
    ? answer.expected
    : answer.kind === "choice"
      ? answer.correct
      : answer.accepted[0];
}
async function scalar(scope, answer, value = scalarValue(answer)) {
  if (answer.kind === "choice") {
    const option = answer.options.find((o) => o.id === value);
    assert.ok(option);
    await scope.getByRole("radio", { name: option.text, exact: true }).check();
  } else await scope.locator('input[type="text"]').fill(value);
}
async function fill(card, e) {
  if (e.answer.kind === "parts") {
    assert.equal(
      await card.locator(".answer-part").count(),
      e.answer.parts.length,
    );
    for (const part of e.answer.parts)
      await scalar(card.locator(`[data-part="${part.id}"]`), part.answer);
  } else await scalar(card, e.answer);
}
async function answer(card, e) {
  await fill(card, e);
  await card.getByRole("button", { name: "Ellenőrzöm", exact: true }).click();
  await card.locator(".answer-feedback.correct").waitFor();
}
async function practice(lesson, e, p = page) {
  await step(lesson.id, 4, p);
  await p
    .getByRole("button", {
      name: `Alapfeladatok · ${lesson.practice.length}`,
      exact: true,
    })
    .click();
  await p
    .locator(".exercise-dots button")
    .nth(lesson.practice.findIndex((x) => x.id === e.id))
    .click();
  await settle(p);
  return p.locator(".exercise-card");
}
async function large(enabled, p = page) {
  await route("beallitasok", p);
  await p.getByRole("checkbox", { name: /Nagyobb betűk/ }).setChecked(enabled);
  await settle(p);
}
async function download(p, name) {
  await route("beallitasok", p);
  const pending = p.waitForEvent("download");
  await p
    .getByRole("button", { name: "Haladás letöltése", exact: true })
    .click();
  const d = await pending;
  const path = resolve(out, name);
  await d.saveAs(path);
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
  const r = await new AxeBuilder({ page: p })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  report.accessibility.push({
    label,
    violations: r.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
  });
}
async function layout(label) {
  const size = await page.evaluate(() => ({
    viewport: innerWidth,
    page: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
  }));
  report.layouts.push({ label, ...size });
  assert.ok(
    Math.max(size.page, size.body) <= size.viewport + 1,
    `${label}: page overflow ${JSON.stringify(size)}`,
  );
}
async function check(name, fn) {
  const start = Date.now();
  try {
    await fn();
    report.checks.push({ name, passed: true, ms: Date.now() - start });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({
      name,
      passed: false,
      error: String(error),
      ms: Date.now() - start,
    });
    if (page && !page.isClosed())
      await screenshot(`failure-${report.checks.length}.png`).catch(() => {});
    throw error;
  } finally {
    await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
  }
}
function visibleRepair(p = page) {
  return p.evaluate(() => ({
    hash: location.hash,
    skill: document
      .querySelector("[data-repair-skill]")
      ?.getAttribute("data-repair-skill"),
  }));
}
async function replay(p = page) {
  const state = await visibleRepair(p);
  const [path, query] = state.hash.slice(1).split("?");
  const stage = path.split("/")[2];
  const value = practiceAPI.replayTargetedExercise(
    state.skill,
    stage,
    new URLSearchParams(query).get("feladat"),
  );
  assert.ok(value, "Targeted exercise URL must replay without profile state");
  // The hash changes synchronously, but hashchange and the Preact render follow
  // later. A visible card may still be the previous task (with the same input
  // shape). Match the actual rendered identity before entering the new answer.
  await p.waitForFunction(
    ({ hash, id }) =>
      location.hash === hash &&
      document.querySelector(".exercise-card .exercise-id code")
        ?.textContent === id,
    { hash: state.hash, id: value.exercise.id },
  );
  assert.equal(
    await p.locator(".exercise-card .exercise-prompt").textContent(),
    value.exercise.prompt,
    "The displayed task and replayed URL must describe the same exercise",
  );
  return value;
}

try {
  let html, oldHtml;
  await check(
    "Release integrity and actual historical v0.2.0 artifact",
    async () => {
      const meta = JSON.parse(
        await readFile(resolve(appRoot, "package.json"), "utf8"),
      );
      const manifest = JSON.parse(
        await readFile(resolve(root, "release-manifest.json"), "utf8"),
      );
      assert.equal(manifest.version, meta.version);
      assert.equal(meta.version, JSON.parse(await readFile(resolve(appRoot, "package.json"), "utf8")).version);
      html = await readFile(resolve(root, "index.html"));
      offlinePath = resolve(appRoot, "release", manifest.offlineFile);
      assert.equal(digest(html), manifest.sha256);
      assert.equal(html.length, manifest.bytes);
      assert.deepEqual(html, await readFile(offlinePath));
      oldHtml = execFileSync("git", ["show", `${oldCommit}:index.html`], {
        cwd: root,
        maxBuffer: 2_000_000,
      });
      assert.equal(digest(oldHtml), oldHash);
      report.artifact = {
        version: meta.version,
        bytes: html.length,
        sha256: digest(html),
        previous: { commit: oldCommit, sha256: oldHash },
      };
    },
  );
  const current = await serve(html);
  currentServer = current.server;
  currentUrl = current.url;
  const old = await serve(oldHtml);
  oldServer = old.server;
  oldUrl = old.url;
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.MATEK8_CHROMIUM_PATH || undefined,
    args: ["--disable-dev-shm-usage"],
  });
  report.browser = browser.version();
  const main = await context("new lessons");
  page = await main.newPage();
  await page.goto(currentUrl);
  await page.locator(".topic-card").first().waitFor();
  snapshot = await page.evaluate(() => globalThis.Matek8.contentSnapshot);
  ({ generateExercise } = await import(
    pathToFileURL(resolve(appRoot, "src/math/generators.ts")).href
  ));
  practiceAPI = await import(
    pathToFileURL(resolve(appRoot, "src/learning/practice.ts")).href
  );
  skillsAPI = await import(
    pathToFileURL(resolve(appRoot, "src/learning/skills.ts")).href
  );
  await check(
    "Fourteen routes, four new paths and source/portable content agree",
    async () => {
      assert.equal(snapshot.lessons.length, 14);
      assert.equal(await page.locator(".topic-card").count(), 14);
      for (const id of ids)
        assert.ok(snapshot.lessons.some((l) => l.id === id));
    },
  );

  await check(
    "Actual v2 UI export imports without invented history and preserves the open mixed task",
    async () => {
      const c = await context("real old UI");
      const p = await c.newPage();
      await p.goto(oldUrl);
      await p.locator(".topic-card").first().waitFor();
      const oldSnapshot = await p.evaluate(
        () => globalThis.Matek8.contentSnapshot,
      );
      const lesson = oldSnapshot.lessons.find((l) => l.id === "szamfogalom");
      await answer(
        await practice(lesson, lesson.practice[0], p),
        lesson.practice[0],
      );
      await step("tortek", 1, p);
      await p.locator(".lab-number").first().fill("3");
      await route("gyakorlas", p);
      for (let i = 0; i < 6; i++)
        await p
          .getByRole("button", { name: "Jöhet egy másik téma", exact: true })
          .click();
      await p.locator('.exercise-card input[type="text"]').fill("123");
      const mixed = {
        id: await p.locator(".exercise-id code").textContent(),
        prompt: await p.locator(".exercise-prompt").innerText(),
      };
      await large(true, p);
      await p.getByRole("checkbox", { name: /Nyugodt nézet/ }).check();
      const exported = await download(p, "actual-v0.2.0-export.json");
      const original = JSON.parse(exported.text);
      assert.equal(original.schemaVersion, 2);
      assert.equal(Object.keys(original.lessons).length, 10);
      const migratedContext = await context("v2 import");
      const migrated = await migratedContext.newPage();
      await migrated.goto(currentUrl);
      await route("beallitasok", migrated);
      const before = await saved(migrated);
      await migrated
        .getByLabel("Haladásmentés megnyitása")
        .setInputFiles(exported.path);
      await migrated.locator(".import-preview").waitFor();
      await migrated
        .locator(".import-preview")
        .getByRole("button", { name: "Mégsem", exact: true })
        .click();
      assert.deepEqual(await saved(migrated), before);
      await migrated
        .getByLabel("Haladásmentés megnyitása")
        .setInputFiles(exported.path);
      await migrated
        .getByRole("button", { name: "Ezt a mentést használom", exact: true })
        .click();
      await migrated.reload();
      await migrated.locator(".settings-page").waitFor();
      const next = await saved(migrated);
      assert.equal(next.schemaVersion, 3);
      assert.equal(Object.keys(next.lessons).length, 14);
      assert.deepEqual(next.attempts, original.attempts);
      assert.deepEqual(next.settings, original.settings);
      assert.deepEqual(next.learning.events, []);
      for (const [id, value] of Object.entries(original.lessons))
        assert.deepEqual(next.lessons[id], value, id);
      assert.equal(next.legacyReviewSchema, 2);
      assert.equal(next.legacyReviewSeed, original.reviewSeed);
      await route("gyakorlas", migrated);
      assert.equal(
        await migrated.locator(".exercise-id code").textContent(),
        mixed.id,
      );
      assert.equal(
        await migrated.locator(".exercise-prompt").innerText(),
        mixed.prompt,
      );
      assert.equal(
        await migrated
          .locator('.exercise-card input[type="text"]')
          .inputValue(),
        "123",
      );
      await migrated
        .getByRole("button", { name: "Jöhet egy másik téma", exact: true })
        .click();
      assert.equal((await saved(migrated)).legacyReviewSchema, undefined);
      report.v2Migration = {
        export: relative(root, exported.path),
        mixedId: mixed.id,
        sourceTopicsPreserved: 10,
        newTopics: 4,
        inventedEvents: 0,
      };
      await c.close();
      await migratedContext.close();
    },
  );

  for (const id of ids) {
    const lesson = snapshot.lessons.find((l) => l.id === id);
    await check(`${id}: all stages and every authored response`, async () => {
      assert.equal(lesson.practice.length, 12);
      assert.equal(lesson.exit.length, 2);
      assert.equal(lesson.examples.length, 2);
      await step(id, 0);
      const before = (await saved())?.learning.events.length ?? 0;
      await answer(page.locator(".exercise-card"), lesson.prediction);
      assert.equal(
        (await saved()).learning.events.length,
        before,
        "Prediction must not create knowledge events",
      );
      report.authored.push(lesson.prediction.id);
      await step(id, 1);
      await page.locator(".bridge-lab").waitFor();
      await screenshot(`${id}-desktop.png`);
      await axe(`${id} lab`);
      await step(id, 2);
      assert.equal(
        await page.locator(".explanation-list > section").count(),
        lesson.explanation.length,
      );
      await step(id, 3);
      assert.equal(await page.locator(".worked-example").count(), 2);
      for (const e of lesson.practice) {
        await answer(await practice(lesson, e), e);
        assert.equal((await saved()).attempts[e.id].success, true);
        report.authored.push(e.id);
      }
      await step(id, 5);
      for (let i = 0; i < lesson.exit.length; i++) {
        await answer(page.locator(".exercise-card").nth(i), lesson.exit[i]);
        report.authored.push(lesson.exit[i].id);
      }
      const p = await saved();
      assert.deepEqual(
        p.lessons[id].visited.slice().sort(),
        [0, 1, 2, 3, 4, 5],
      );
      for (let i = 0; i < 2; i++)
        assert.equal(p.attempts[`exit:${id}:0:${i}`].independent, true);
    });
    await check(
      `${id}: generated families, targeted feedback and honest helped results`,
      async () => {
        await step(id, 4);
        await page
          .getByRole("button", { name: "Új példák", exact: true })
          .click();
        for (let variant = 0; variant < 3; variant++) {
          const seed = (await saved()).lessons[id].generatedSeed;
          const e = generateExercise(id, seed, (seed - 1) % 3);
          assert.equal(
            await page.locator(".exercise-id code").textContent(),
            e.id,
          );
          await answer(page.locator(".exercise-card"), e);
          report.generated.push(e.id);
          await page
            .getByRole("button", { name: "Új feladatot kérek", exact: true })
            .click();
        }
        let e, part, rule;
        for (const item of lesson.practice) {
          if (item.answer.kind === "parts") {
            const p = item.answer.parts.find((p) => p.mistakes?.length);
            if (p) {
              e = item;
              part = p;
              rule = p.mistakes[0];
              break;
            }
          } else if (item.mistakes?.length) {
            e = item;
            rule = item.mistakes[0];
            break;
          }
        }
        assert.ok(e && rule);
        const card = await practice(lesson, e);
        await fill(card, e);
        await scalar(
          part ? card.locator(`[data-part="${part.id}"]`) : card,
          part?.answer ?? e.answer,
          rule.input,
        );
        await card
          .getByRole("button", { name: "Ellenőrzöm", exact: true })
          .click();
        await card.locator(".answer-feedback.retry").waitFor();
        assert.ok((await card.innerText()).includes(rule.feedback));
        await card.locator(".repair-suggestion a").waitFor();
        await card
          .getByRole("button", { name: "Kérek egy kapaszkodót", exact: true })
          .click();
        await card
          .getByRole("button", { name: "Következő kapaszkodó", exact: true })
          .click();
        assert.equal(await card.locator(".hints > div").count(), 2);
        await card
          .getByRole("button", { name: "Teljes magyarázat", exact: true })
          .click();
        assert.equal(
          await card.locator(".solution ol li").count(),
          e.solution.length,
        );
        await answer(card, e);
        assert.equal((await saved()).attempts[e.id].assisted, true);
      },
    );
  }

  await check(
    "Algebra workshop connects like terms, signs and exact substitution",
    async () => {
      await step("betus-kifejezesek", 1);
      await page.getByTestId("algebra-case").selectOption("like");
      await page.getByTestId("algebra-x").fill("-2");
      await page.getByTestId("algebra-value-guess").fill("-14");
      await page.getByTestId("algebra-value-check").click();
      assert.match(
        (await page.getByTestId("algebra-value").innerText()).replaceAll(
          "−",
          "-",
        ),
        /-14/,
      );
      await page.getByTestId("algebra-x").fill("1/3");
      await page.getByTestId("algebra-value-guess").fill("-7/3");
      await page.getByTestId("algebra-value-check").click();
      assert.match(
        (await page.getByTestId("algebra-value").innerText()).replaceAll(
          "−",
          "-",
        ),
        /-7\/3/,
      );
      await page.getByTestId("algebra-case").selectOption("minus");
      await page.getByTestId("algebra-expansion").selectOption("first");
      await page.getByTestId("algebra-expansion-check").click();
      await page.getByTestId("algebra-expansion").selectOption("both");
      await page.getByTestId("algebra-expansion-check").click();
      await page.getByTestId("algebra-coefficient").fill("1");
      await page.getByTestId("algebra-simplify-check").click();
      await page.getByTestId("algebra-x").fill("-2");
      await page.getByTestId("algebra-value-guess").fill("2");
      await page.getByTestId("algebra-value-check").click();
      await screenshot("algebra-minus-checked.png");
    },
  );
  await check(
    "Story workshop requires a justified model and checks the result in the story",
    async () => {
      await step("szoveges-modellek", 1);
      await page.getByTestId("story-case").selectOption("fare");
      for (const key of ["base", "rate", "total"])
        await page.getByTestId(`story-fact-${key}`).check();
      await page.getByTestId("story-unknown").selectOption("distance");
      await page.getByTestId("story-equation").selectOption("fee");
      await page
        .getByTestId("bridge-thought")
        .fill("Az 500 Ft egyszeri díj, a 200x az út díja.");
      await page.getByTestId("story-model-check").click();
      await page.getByTestId("story-answer").fill("6");
      await page.getByTestId("story-calculate").click();
      assert.match(
        (await page.getByTestId("story-result").innerText()).replace(/\s/g, ""),
        /1700/,
      );
      assert.notEqual(
        (await saved()).lessons["szoveges-modellek"].lab.thought,
        "Az 500 Ft egyszeri díj, a 200x az út díja.",
        "Own explanation is not stored without opt-in",
      );
      await page.getByTestId("story-case").selectOption("lengths");
      for (const key of ["sum", "difference"])
        await page.getByTestId(`story-fact-${key}`).check();
      await page.getByTestId("story-unknown").selectOption("short");
      await page.getByTestId("story-equation").selectOption("sum");
      await page
        .getByTestId("bridge-thought")
        .fill("A hosszabb szakasz 6 cm-rel hosszabb, együtt 34 cm.");
      await page.getByTestId("story-model-check").click();
      await page.getByTestId("story-answer").fill("14");
      await page.getByTestId("story-calculate").click();
      const result = await page.getByTestId("story-result").innerText();
      assert.match(result, /14/);
      assert.match(result, /20/);
      assert.match(result, /34/);
      await screenshot("story-model-checked.png");
    },
  );
  await check(
    "Power workshop distinguishes unary minus, negative base, layers and negative powers of ten",
    async () => {
      await step("hatvanyok", 1);
      await page.getByTestId("power-magnitude").fill("3");
      await page.getByTestId("power-exponent").selectOption("2");
      await page.getByTestId("power-placement").selectOption("minus-outside");
      await page.getByTestId("power-guess").fill("-9");
      await page.getByTestId("power-check").click();
      assert.match(
        (await page.getByTestId("power-result").innerText()).replaceAll(
          "−",
          "-",
        ),
        /-9/,
      );
      await page.getByTestId("power-placement").selectOption("negative-base");
      await page.getByTestId("power-guess").fill("9");
      await page.getByTestId("power-check").click();
      await page.getByTestId("power-dimension").selectOption("3");
      await page.getByTestId("power-edge").focus();
      await page.keyboard.press("Home");
      await page.keyboard.press("ArrowRight");
      await page.keyboard.press("ArrowRight");
      assert.equal(await page.getByTestId("power-edge").inputValue(), "3");
      await page.getByTestId("power-build-guess").fill("27");
      await page.getByTestId("power-build-check").click();
      assert.match(
        await page.getByTestId("power-build-result").innerText(),
        /27/,
      );
      await page.getByTestId("power-ten-exponent").selectOption("-2");
      await page.getByTestId("power-ten-guess").fill("1/100");
      await page.getByTestId("power-ten-check").click();
      assert.match(
        await page.getByTestId("power-ten-result").innerText(),
        /0,01/,
      );
      await screenshot("powers-checked.png");
      await page.getByTestId("power-magnitude").fill("0");
      await page.getByTestId("power-exponent").selectOption("0");
      await page.getByTestId("power-error").waitFor();
      assert.equal(await page.getByTestId("power-result").count(), 0);
    },
  );
  await check(
    "Square-root workshop separates exact roots, bounds and equation solutions",
    async () => {
      await step("negyzetgyok", 1);
      await page.getByTestId("root-area").fill("36");
      await page.getByTestId("root-guess").fill("6");
      await page.getByTestId("root-check").click();
      assert.match(await page.getByTestId("root-exact").innerText(), /6/);
      await page.getByTestId("root-equation-count").selectOption("2");
      await page.getByTestId("root-equation-check").click();
      assert.match(
        (await page.locator(".bridge-lab").innerText()).replaceAll("−", "-"),
        /x = 6 vagy x = -\(6\)/,
      );
      await page.getByTestId("root-area").fill("2");
      await page.getByTestId("root-guess").fill("1,4");
      await page.getByTestId("root-check").click();
      await page.getByTestId("root-precision").selectOption("3");
      assert.match(await page.getByTestId("root-bounds").innerText(), /1,414/);
      assert.match(await page.getByTestId("root-bounds").innerText(), /1,415/);
      await page.getByTestId("root-original-a").fill("-1/3");
      await page.getByTestId("root-absolute-guess").fill("1/3");
      await page.getByTestId("root-absolute-check").click();
      assert.match(
        await page.getByTestId("root-absolute-result").innerText(),
        /1\/3/,
      );
      await screenshot("square-root-checked.png");
      await page.getByTestId("root-area").fill("-4");
      await page.getByTestId("root-error").waitFor();
      await page.getByTestId("root-equation-count").selectOption("0");
      await page.getByTestId("root-equation-check").click();
      assert.doesNotMatch(
        await page.locator(".bridge-lab").innerText(),
        /NaN|Infinity/,
      );
    },
  );

  await check(
    "Targeted repair is optional, replayable, part-specific and records actual checks only",
    async () => {
      const c = await context("targeted repair");
      const p = await c.newPage();
      await p.goto(currentUrl);
      const lesson = snapshot.lessons.find((l) => l.id === "betus-kifejezesek");
      const e = lesson.practice.find(
        (e) =>
          e.answer.kind === "parts" &&
          e.answer.parts.some((p) => p.mistakes?.length),
      );
      assert.ok(e);
      const part = e.answer.parts.find((p) => p.mistakes?.length);
      const card = await practice(lesson, e, p);
      await fill(card, e);
      assert.equal(
        (await saved(p)).learning.events.length,
        0,
        "Typing is not a grade",
      );
      await scalar(
        card.locator(`[data-part="${part.id}"]`),
        part.answer,
        part.mistakes[0].input,
      );
      await card
        .getByRole("button", { name: "Ellenőrzöm", exact: true })
        .click();
      const wrong = await saved(p);
      assert.ok(wrong.learning.events.length > 0);
      await card
        .getByRole("button", { name: "Ellenőrzöm", exact: true })
        .click();
      assert.equal(
        (await saved(p)).learning.events.length,
        wrong.learning.events.length,
        "Unchanged repeated check is deduplicated",
      );
      await card.locator(".repair-suggestion a").click();
      await p.locator(".repair-explanation").waitFor();
      const skill = (await visibleRepair(p)).skill;
      assert.ok(skillsAPI.SKILLS.some((s) => s.id === skill));
      await p
        .getByRole("link", { name: "Kipróbálom a műhelyben →", exact: true })
        .click();
      await p.locator(".bridge-lab").waitFor();
      assert.equal(
        await p
          .locator(".lesson-steps button")
          .nth(1)
          .getAttribute("aria-current"),
        "step",
      );
      await p
        .getByRole("link", {
          name: "← Vissza a javító gyakorláshoz",
          exact: true,
        })
        .click();
      await p
        .getByRole("button", {
          name: "Jöhet egy új javító feladat",
          exact: true,
        })
        .click();
      let task = await replay(p);
      assert.equal(task.skillId, skill);
      assert.notEqual(task.sourceExerciseId, e.id);
      const originalHash = (await visibleRepair(p)).hash;
      await fill(p.locator(".exercise-card"), task.exercise);
      const beforeCheck = (await saved(p)).learning.events.length;
      await p.reload();
      await p.locator(".exercise-card").waitFor();
      assert.equal((await visibleRepair(p)).hash, originalHash);
      assert.equal(
        await p.locator(".exercise-id code").textContent(),
        task.exercise.id,
      );
      assert.equal((await saved(p)).learning.events.length, beforeCheck);
      await p
        .locator(".exercise-card")
        .getByRole("button", { name: "Ellenőrzöm", exact: true })
        .click();
      await p.locator(".answer-feedback.correct").waitFor();
      await p
        .getByRole("button", { name: "Jöhet a következő próba", exact: true })
        .click();
      let transfer = await replay(p);
      assert.notEqual(transfer.sourceExerciseId, task.sourceExerciseId);
      const firstTransfer = transfer.sourceExerciseId;
      const beforeAnother = await saved(p);
      await p
        .getByRole("button", { name: "Másik feladatot választok", exact: true })
        .click();
      transfer = await replay(p);
      assert.notEqual(
        transfer.sourceExerciseId,
        firstTransfer,
        "Another unopened authored task must really differ",
      );
      assert.deepEqual(
        await saved(p),
        beforeAnother,
        "Choosing another task is not an attempt or learning event",
      );
      await answer(p.locator(".exercise-card"), transfer.exercise);
      await p.locator(".repair-done").waitFor();
      await axe("repair completed", p);
      await screenshot("repair-completed.png", p);
      const history = (await saved(p)).learning;
      const exported = await download(p, "actual-v0.3.0-learning-export.json");
      await p.reload();
      assert.deepEqual((await saved(p)).learning, history);
      await p
        .getByLabel("Haladásmentés megnyitása")
        .setInputFiles(exported.path);
      await p
        .getByRole("button", { name: "Ezt a mentést használom", exact: true })
        .click();
      await p.reload();
      assert.deepEqual((await saved(p)).learning, history);
      const corrupt = JSON.parse(exported.text);
      corrupt.learning.events[0].outcomes[0].skillId = "unknown-skill";
      const corruptFile = resolve(out, "invalid-learning-export.json");
      await writeFile(corruptFile, JSON.stringify(corrupt));
      const previous = await saved(p);
      await p.getByLabel("Haladásmentés megnyitása").setInputFiles(corruptFile);
      await settle(p);
      assert.equal(await p.locator(".import-preview").count(), 0);
      assert.deepEqual(
        await saved(p),
        previous,
        "Corrupt import cannot alter saved progress",
      );
      await route("haladas", p);
      await p.locator(".skill-card").first().waitFor();
      assert.ok((await p.locator(".skill-card").count()) > 14);
      await axe("skill progress", p);
      report.learningFlow = {
        skill,
        repair: task.locator,
        transfer: transfer.locator,
        events: history.events.length,
        actualExportImport: true,
      };
      await c.close();
    },
  );

  await check(
    "Dependent checking needs its model and calculated value, with honest follow-up labels",
    async () => {
      const c = await context("dependent model checking");
      const p = await c.newPage();
      await p.goto(currentUrl);
      await route("javitas/modell-ellenorzes", p);
      await p
        .getByRole("button", {
          name: "Jöhet egy új javító feladat",
          exact: true,
        })
        .click();
      const task = await replay(p);
      assert.equal(task.exercise.answer.kind, "parts");
      const parts = task.exercise.answer.parts;
      const focus = parts.find((part) => part.id === task.targetPartId);
      assert.ok(
        focus?.requiresParts?.length,
        "The checking result must retain its necessary preceding work",
      );
      const card = p.locator(".exercise-card");
      await scalar(card.locator(`[data-part="${focus.id}"]`), focus.answer);
      await card
        .getByRole("button", { name: "Ellenőrzöm", exact: true })
        .click();
      assert.equal(
        (await saved(p)).learning.events.length,
        0,
        "Copying the stated total alone is not observed model checking",
      );
      const next = p.getByRole("button", {
        name: "Jöhet a következő próba",
        exact: true,
      });
      assert.equal(await next.isDisabled(), true);
      await fill(card, task.exercise);
      const prerequisite = parts.find((part) =>
        focus.requiresParts.includes(part.id),
      );
      assert.ok(prerequisite);
      const wrongValue =
        prerequisite.answer.kind === "expression" ? "0=1" : "-999";
      await scalar(
        card.locator(`[data-part="${prerequisite.id}"]`),
        prerequisite.answer,
        wrongValue,
      );
      await card
        .getByRole("button", { name: "Ellenőrzöm", exact: true })
        .click();
      const wrong = await saved(p);
      assert.equal(
        wrong.learning.events
          .flatMap((event) => event.outcomes)
          .some(
            (outcome) =>
              outcome.skillId === "modell-ellenorzes" &&
              outcome.status === "correct",
          ),
        false,
      );
      assert.equal(await next.isDisabled(), true);
      await answer(card, task.exercise);
      assert.equal(await next.isEnabled(), true);
      const checked = (await saved(p)).learning;
      assert.ok(
        checked.events
          .flatMap((event) => event.outcomes)
          .some(
            (outcome) =>
              outcome.skillId === "modell-ellenorzes" &&
              outcome.status === "correct",
          ),
      );
      await p.reload();
      await card.waitFor();
      assert.equal(
        await next.isDisabled(),
        true,
        "After reload the current complete group must be explicitly checked",
      );
      await card
        .getByRole("button", { name: "Ellenőrzöm", exact: true })
        .click();
      assert.equal(await next.isEnabled(), true);
      assert.deepEqual(
        (await saved(p)).learning,
        checked,
        "Rechecking saved correct fields does not create new evidence",
      );
      const continued = practiceAPI.chooseTargetedExercise(
        await saved(p),
        "tort-osszeadas",
        "transfer",
        1,
      );
      assert.ok(continued);
      assert.equal(continued.applicationKind, "same-structure");
      await route(
        `javitas/tort-osszeadas/transfer?${new URLSearchParams({ feladat: continued.locator })}`,
        p,
      );
      await p.locator(".exercise-card").waitFor();
      assert.match(
        await p.locator(".repair-stages").innerText(),
        /Új adatokkal/,
      );
      assert.doesNotMatch(
        await p.locator(".repair-stages").innerText(),
        /Másik alkalmazás/,
      );
      assert.match(
        await p.locator(".exercise-card .eyebrow").first().innerText(),
        /ÚJ ADATOKKAL/,
      );
      await screenshot("dependent-model-checking.png", p);
      await axe("dependent targeted task", p);
      await c.close();
    },
  );

  await check(
    "New paths and repair views reflow at 320/390px, normal and large text",
    async () => {
      for (const width of [320, 390])
        for (const big of [false, true]) {
          await page.setViewportSize({ width, height: 900 });
          await large(big);
          await route("felfedezes");
          await layout(`home-${width}-${big}`);
          for (const id of ids) {
            await step(id, 1);
            await layout(`${id}-lab-${width}-${big}`);
            if (width === 320 && big) await screenshot(`${id}-320-large.png`);
            const lesson = snapshot.lessons.find((l) => l.id === id);
            const e = lesson.practice.reduce((a, b) =>
              (a.answer.parts?.length ?? 1) >= (b.answer.parts?.length ?? 1)
                ? a
                : b,
            );
            await practice(lesson, e);
            await layout(`${id}-exercise-${width}-${big}`);
          }
          await route("javitas");
          await layout(`repair-list-${width}-${big}`);
          await route(`javitas/${skillsAPI.SKILLS[0].id}`);
          await layout(`repair-preparation-${width}-${big}`);
          await route("haladas");
          await layout(`skill-progress-${width}-${big}`);
        }
      await page.setViewportSize({ width: 1440, height: 1000 });
      await large(false);
    },
  );
  await check(
    "Keyboard access and invalid repair URLs stay inside the application",
    async () => {
      await route("javitas");
      await page.getByLabel("Téma", { exact: true }).focus();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("Enter");
      await page.locator(".skill-card a").first().focus();
      await page.keyboard.press("Enter");
      await page.locator(".repair-explanation").waitFor();
      await page
        .getByRole("button", {
          name: "Jöhet egy új javító feladat",
          exact: true,
        })
        .focus();
      await page.keyboard.press("Enter");
      await page.locator(".exercise-card").waitFor();
      await route(
        "javitas/betu-helyettesites/repair?feladat=javascript:alert(1)",
      );
      await page
        .getByRole("heading", {
          name: "Ez a feladathivatkozás nem használható.",
          exact: true,
        })
        .waitFor();
    },
  );
  await check(
    "All four printed sheets preserve every multipart question and solution",
    async () => {
      for (const id of ids) {
        await route(`nyomtatas/${id}`);
        assert.equal(await page.locator(".paper-exercise").count(), 14);
        await page
          .getByRole("checkbox", {
            name: "Megoldókulccsal együtt",
            exact: true,
          })
          .check();
        assert.equal(
          await page.locator(".paper-answers > section").count(),
          14,
        );
        const path = resolve(out, `${id}-worksheet-v0.3.0.pdf`);
        await page.pdf({
          path,
          format: "A4",
          printBackground: true,
          preferCSSPageSize: true,
        });
        report.pdfs.push(relative(root, path));
      }
      await page.emulateMedia({ media: "screen" });
    },
  );
  await check(
    "Portable file works offline including real skill events, replay and export",
    async () => {
      const c = await context("offline", { offline: true });
      const p = await c.newPage();
      const requests = [];
      p.on("request", (request) => {
        if (/^https?:/.test(request.url())) requests.push(request.url());
      });
      await p.goto(pathToFileURL(offlinePath).href);
      await p.locator(".topic-card").first().waitFor();
      const lesson = snapshot.lessons.find((l) => l.id === "negyzetgyok");
      await answer(
        await practice(lesson, lesson.practice[0], p),
        lesson.practice[0],
      );
      assert.ok((await saved(p)).learning.events.length);
      await p.reload();
      await p.locator(".exercise-card").waitFor();
      assert.ok((await saved(p)).learning.events.length);
      await route("javitas/negyzetgyok-jelentes", p);
      await p
        .getByRole("button", {
          name: "Jöhet egy új javító feladat",
          exact: true,
        })
        .click();
      const task = await replay(p);
      await answer(p.locator(".exercise-card"), task.exercise);
      await download(p, "offline-v0.3.0-export.json");
      assert.deepEqual(requests, []);
      report.offlineHttpRequests = requests;
      await c.close();
    },
  );
  await check(
    "No browser errors, external requests or automated accessibility violations",
    async () => {
      assert.deepEqual(report.pageErrors, []);
      assert.deepEqual(report.consoleErrors, []);
      assert.deepEqual(report.externalRequests, []);
      assert.deepEqual(
        report.accessibility.flatMap((a) => a.violations),
        [],
      );
    },
  );
  report.finishedAt = new Date().toISOString();
  report.passed = true;
} catch (error) {
  report.passed = false;
  report.failure = String(error);
  console.error(error);
  process.exitCode = 1;
} finally {
  await writeFile(reportPath, JSON.stringify(report, null, 2) + "\n");
  if (browser) await browser.close();
  await closeServer(currentServer);
  await closeServer(oldServer);
}

/**
 * Isolated end-to-end checks against our own local application.
 * Run `npm run test:browser`; a temporary local Vite server starts automatically.
 * Optional: MATEK8_CHROMIUM_PATH=/absolute/path/to/chromium
 * No existing browser profile or user session is used.
 */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";
import AxeBuilder from "@axe-core/playwright";
import {
  legacyLessons as lessons,
  lessons as allLessons,
} from "../src/content/lessons.ts";

const url = process.env.MATEK8_TEST_URL || "http://127.0.0.1:4173/";
assert.ok(
  ["127.0.0.1", "localhost", "[::1]"].includes(new URL(url).hostname),
  "Only a local test server is supported.",
);
const out = resolve("test-results");
await mkdir(out, { recursive: true });
const report = {
  date: new Date().toISOString(),
  browser: "",
  checks: [],
  accessibility: [],
  pageErrors: [],
  consoleErrors: [],
};
const server = process.env.MATEK8_TEST_URL
  ? null
  : await createServer({
      server: { host: "127.0.0.1", port: 4173, strictPort: true },
    });
await server?.listen();
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.MATEK8_CHROMIUM_PATH || undefined,
  args: ["--disable-dev-shm-usage"],
});
report.browser = browser.version();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
  locale: "hu-HU",
  acceptDownloads: true,
});
const page = await context.newPage();
page.setDefaultTimeout(7000);
page.on("pageerror", (error) => report.pageErrors.push(String(error)));
page.on("console", (message) => {
  if (message.type() === "error") report.consoleErrors.push(message.text());
});

async function check(name, action) {
  if (
    process.env.MATEK8_CHECK_PATTERN &&
    !new RegExp(process.env.MATEK8_CHECK_PATTERN).test(name)
  )
    return;
  const started = Date.now();
  try {
    await action();
    report.checks.push({ name, passed: true, ms: Date.now() - started });
    console.log(`PASS ${name}`);
  } catch (error) {
    report.checks.push({
      name,
      passed: false,
      error: String(error),
      ms: Date.now() - started,
    });
    await page
      .screenshot({ path: resolve(out, "failure.png"), fullPage: true })
      .catch(() => {});
    throw error;
  }
}
async function settled() {
  await page.evaluate(
    () =>
      new Promise((done) =>
        requestAnimationFrame(() => requestAnimationFrame(done)),
      ),
  );
}
async function route(path) {
  await page.evaluate((value) => {
    location.hash = value;
  }, path);
  await page.waitForURL(`**/#${path}`);
  await settled();
}
async function lessonStep(topic, step) {
  await route(`lecke/${topic}`);
  await page.locator(".lesson-steps button").nth(step).click();
  await settled();
}
async function saved() {
  return page.evaluate(() =>
    JSON.parse(localStorage.getItem("matek8:profile:v1")),
  );
}
async function answer(card, exercise) {
  if (exercise.answer.kind === "number")
    await card.locator("input[type=text]").fill(exercise.answer.expected);
  else
    await card
      .locator(`input[type=radio][value="${exercise.answer.correct}"]`)
      .check();
  await card.getByRole("button", { name: "Ellenőrzöm", exact: true }).click();
  await card.locator(".answer-feedback.correct").waitFor();
}
async function axe(name) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  report.accessibility.push({
    name,
    violations: result.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
        html: n.html,
      })),
    })),
  });
}
async function noPageOverflow(label) {
  const dimensions = await page.evaluate(() => ({
    viewport: innerWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  assert.ok(
    dimensions.scroll <= dimensions.viewport + 1,
    `${label}: page ${dimensions.scroll}px > viewport ${dimensions.viewport}px`,
  );
}

try {
  if (process.env.MATEK8_CHECK_PATTERN) {
    await page.goto(url);
    await page.getByRole("heading", { name: /Van benne/ }).waitFor();
  }
  await check(
    "Home, real fraction slider, keyboard entry and topic search",
    async () => {
      await page.goto(url);
      await page.getByRole("heading", { name: /Van benne/ }).waitFor();
      assert.equal(
        await page.locator(".topic-card").count(),
        allLessons.length,
      );
      await page.keyboard.press("Tab");
      assert.equal(
        await page.locator(":focus").textContent(),
        "Ugrás a tartalomhoz",
      );
      await page.keyboard.press("Enter");
      assert.equal(
        await page.locator(":focus").getAttribute("id"),
        "main-content",
      );
      await page.locator("#hero-range").focus();
      await page.keyboard.press("ArrowLeft");
      assert.match(await page.locator(".hero-fraction").innerText(), /50/);
      await page
        .getByRole("textbox", { name: "Keresés a témák között" })
        .fill("szazalek");
      assert.equal(await page.locator(".topic-card").count(), 1);
      await page
        .getByRole("textbox", { name: "Keresés a témák között" })
        .fill("");
      await page.screenshot({
        path: resolve(out, "home-desktop.png"),
        fullPage: true,
      });
      await axe("home-desktop");
    },
  );
  await check(
    "Fractions: common unit, exact sum and restoration after reload",
    async () => {
      await page.getByRole("button", { name: "Kezdjük az alapokkal" }).click();
      await page.waitForURL("**/#lecke/szamfogalom");
      await route("lecke/tortek");
      await page.locator(".lesson-steps button").nth(1).click();
      const numbers = page.locator(".lab-number");
      await numbers.nth(1).fill("3");
      await numbers.nth(0).fill("2");
      await numbers.nth(3).fill("4");
      await numbers.nth(2).fill("1");
      await page
        .getByRole("button", { name: "Mutasd ugyanakkora részekben" })
        .click();
      assert.match(await page.locator(".lab-summary").innerText(), /11\/12/);
      await page.reload();
      await page.locator(".lab-summary").waitFor();
      assert.equal(await numbers.nth(1).inputValue(), "3");
      assert.equal(await numbers.nth(0).inputValue(), "2");
      assert.equal(
        await page
          .getByRole("button", { name: "Eredeti felosztások" })
          .getAttribute("aria-pressed"),
        "true",
      );
      await axe("fractions-workshop");
      await page.screenshot({
        path: resolve(out, "fractions-desktop.png"),
        fullPage: true,
      });
    },
  );
  await check(
    "Practice: targeted error, hints, complete reasoning and honest progress",
    async () => {
      await lessonStep("tortek", 4);
      const card = page.locator(".exercise-card");
      await card.locator("input[type=text]").fill("2/5");
      await card
        .getByRole("button", { name: "Ellenőrzöm", exact: true })
        .click();
      await card.locator(".answer-feedback.retry").waitFor();
      await card.getByRole("button", { name: "Kérek egy kapaszkodót" }).click();
      assert.equal(await card.locator(".hints > div").count(), 1);
      await answer(card, lessons[0].practice[0]);
      const attempt = (await saved()).attempts["tortek-practice-1"];
      assert.equal(attempt.success, true);
      assert.equal(attempt.independent, false);
      await card
        .getByRole("button", { name: "Teljes magyarázat", exact: true })
        .click();
      assert.ok((await card.locator(".solution ol li").count()) >= 2);
      await axe("practice-with-feedback-hints-solution");
      await page
        .getByRole("button", { name: "Új példák", exact: true })
        .click();
      const before = await card.locator(".exercise-id code").textContent();
      await page.getByRole("button", { name: "Új feladatot kérek" }).click();
      assert.notEqual(
        await card.locator(".exercise-id code").textContent(),
        before,
      );
      const generatedId = await card.locator(".exercise-id code").textContent();
      await card.locator("input[type=text]").fill("1");
      await page.reload();
      await page.locator(".exercise-card").waitFor();
      assert.equal(
        await page.locator(".exercise-card .exercise-id code").textContent(),
        generatedId,
      );
      assert.equal(
        await page.locator(".exercise-card input[type=text]").inputValue(),
        "1",
      );
    },
  );
  await check("Worked examples reveal reasons one step at a time", async () => {
    await lessonStep("tortek", 3);
    const example = page.locator(".worked-example").first();
    assert.equal(await example.locator("ol li").count(), 1);
    await example.getByRole("button", { name: "Mi következik?" }).click();
    assert.equal(await example.locator("ol li").count(), 2);
    if (await example.locator("details").count()) {
      await example.locator("summary").click();
      assert.equal(await example.locator("details").getAttribute("open"), "");
    }
    await axe("worked-example");
  });
  await check(
    "Independent exit round and fresh retry do not mix evidence",
    async () => {
      await lessonStep("tortek", 5);
      for (let i = 0; i < 2; i += 1)
        await answer(page.locator(".exercise-card").nth(i), lessons[0].exit[i]);
      await page.locator(".completion-box").waitFor();
      await page.getByRole("button", { name: "Új önálló próba" }).click();
      assert.equal(await page.locator(".completion-box").count(), 0);
      assert.equal((await saved()).lessons.tortek.exitRound, 1);
      await route("haladas");
      assert.match(
        await page.locator(".stat-grid > div").nth(0).innerText(),
        /^2\b/,
      );
      assert.match(
        await page.locator(".stat-grid > div").nth(1).innerText(),
        /^1\b/,
      );
      assert.match(
        await page.locator(".stat-grid > div").nth(2).innerText(),
        /^1\b/,
      );
      await axe("progress");
    },
  );
  await check(
    "Percentages: changed base, directions and zero-base explanation",
    async () => {
      await lessonStep("szazalek", 1);
      assert.match(await page.locator(".lab-summary").innerText(), /9\s*600/);
      await page.locator(".lab-number").nth(0).fill("20000");
      assert.match(await page.locator(".lab-summary").innerText(), /19\s*200/);
      assert.match(
        await page.locator(".lab-table tbody tr").nth(1).innerText(),
        /16\s*000/,
      );
      await page.getByLabel("Második változás iránya").selectOption("down");
      assert.match(await page.locator(".lab-summary").innerText(), /12\s*800/);
      await page.locator(".lab-number").nth(0).fill("0");
      assert.match(
        await page.locator(".lab-summary").innerText(),
        /nem számolható osztással/,
      );
      await page
        .getByRole("button", { name: "Vissza a −20%, majd +20% példához" })
        .click();
      await axe("percentages-workshop");
    },
  );
  await check("Equation: both reversible paths and substitution", async () => {
    await lessonStep("egyenlet", 1);
    await page
      .getByRole("button", { name: "Mindkét oldalt osztom 3-mal", exact: true })
      .click();
    assert.match(await page.locator(".lab-summary").innerText(), /x \+ 2 = 7/);
    await page
      .getByRole("button", { name: "Mindkét oldalból kivonok 2-t" })
      .click();
    assert.match(await page.locator(".lab-summary").innerText(), /x = 5/);
    await page
      .getByRole("button", { name: "Ellenőrzöm az eredeti egyenletben" })
      .click();
    assert.match(
      await page.locator(".lab-check").innerText(),
      /3 · \(5 \+ 2\) = 3 · 7 = 21/,
    );
    await page.getByRole("button", { name: "Egy lépést vissza" }).click();
    assert.match(await page.locator(".lab-summary").innerText(), /x \+ 2 = 7/);
    await page.getByLabel("Válassz megoldási utat").selectOption("expand");
    await page.getByRole("button", { name: "Felbontom a zárójelet" }).click();
    assert.match(
      await page.locator(".lab-summary").innerText(),
      /3x \+ 6 = 21/,
    );
    await page
      .getByRole("button", { name: "Miért fontos, hogy ne nullával osszunk?" })
      .click();
    await axe("equation-workshop");
  });
  await check(
    "Graph: fixed axis, table, direct proportion and constant function",
    async () => {
      await lessonStep("grafikon", 1);
      assert.match(await page.locator(".lab-equation").innerText(), /1\s*300/);
      const axisBefore = await page
        .locator("svg .lab-svg-small")
        .allTextContents();
      await page.locator(".lab-number").nth(0).fill("0");
      assert.match(await page.locator(".lab-equation").innerText(), /800/);
      assert.match(
        await page.locator(".lab-root").innerText(),
        /Most egyenes arányosságot/,
      );
      assert.deepEqual(
        await page.locator("svg .lab-svg-small").allTextContents(),
        axisBefore,
      );
      await page.locator(".lab-number").nth(1).fill("0");
      assert.match(
        await page.locator(".lab-root").innerText(),
        /minden út ára 0 Ft/,
      );
      await page.getByRole("button", { name: "Betűs alak · bővítés" }).click();
      assert.match(
        await page.locator(".lab-extension").innerText(),
        /y = 0x \+ 0/,
      );
      await axe("graph-workshop");
    },
  );
  await check(
    "Pythagoras: two exact areas, proof, highlighting and rotation",
    async () => {
      await lessonStep("pitagorasz", 1);
      assert.match(
        await page.locator(".lab-equation").innerText(),
        /3² \+ 4² = 25 = c²/,
      );
      await page.locator(".lab-number").nth(0).fill("6");
      await page.locator(".lab-number").nth(1).fill("8");
      assert.match(
        await page.locator(".lab-equation").innerText(),
        /6² \+ 8² = 100 = c²/,
      );
      await page.getByRole("button", { name: "4. Az összefüggés" }).click();
      await page.getByRole("button", { name: "2. darab kiemelése" }).click();
      assert.equal(
        await page
          .getByRole("button", { name: "2. darab kiemelése" })
          .getAttribute("aria-pressed"),
        "true",
      );
      await page.getByRole("button", { name: "Elforgatom 90°-kal" }).click();
      assert.match(
        await page.locator(".lab-svg-sample title").textContent(),
        /90 fokos/,
      );
      await axe("pythagoras-workshop");
      await page.screenshot({
        path: resolve(out, "pythagoras-desktop.png"),
        fullPage: true,
      });
    },
  );
  await check(
    "Probability: all 36 outcomes, simulations, replay and rare event",
    async () => {
      await lessonStep("valoszinuseg", 1);
      assert.equal(await page.locator(".lab-dice-cell").count(), 36);
      assert.match(
        await page.locator(".lab-equation").innerText(),
        /6\/36 = 1\/6/,
      );
      await page
        .getByRole("button", { name: "+10 dobáspár", exact: true })
        .click();
      const firstTen = [...(await saved()).lessons.valoszinuseg.lab.counts];
      assert.equal(
        firstTen.reduce((sum, n) => sum + n, 0),
        10,
      );
      await page
        .getByRole("button", { name: "+100 dobáspár", exact: true })
        .click();
      assert.match(
        await page.locator(".lab-observation").innerText(),
        /110 dobáspárból/,
      );
      await page.getByRole("button", { name: "Kísérlet újraindítása" }).click();
      await page
        .getByRole("button", { name: "+10 dobáspár", exact: true })
        .click();
      assert.deepEqual(
        (await saved()).lessons.valoszinuseg.lab.counts,
        firstTen,
      );
      await page
        .getByRole("button", {
          name: "Első kocka 6, második kocka 6; összeg 12. Ezt az összeget választom.",
          exact: true,
        })
        .click();
      assert.match(await page.locator(".lab-equation").innerText(), /1\/36/);
      await axe("probability-workshop");
    },
  );
  await check(
    "Complete planned curriculum remains visibly distinct from available lessons",
    async () => {
      await route("tematerkep");
      assert.equal(await page.locator(".curriculum-card").count(), 24);
      assert.match(await page.locator("main").innerText(), /137/);
      assert.match(await page.locator("main").innerText(), /Még készül/);
      await axe("curriculum");
    },
  );
  let exported;
  await check(
    "Settings: persistence, actual JSON export, invalid import, preview and replacement",
    async () => {
      await route("beallitasok");
      await page.getByRole("checkbox", { name: /Nagyobb betűk/ }).check();
      await page.getByRole("checkbox", { name: /Nyugodt nézet/ }).check();
      await page.reload();
      await page.getByRole("heading", { name: "A te beállításaid." }).waitFor();
      assert.equal(
        await page.getByRole("checkbox", { name: /Nagyobb betűk/ }).isChecked(),
        true,
      );
      assert.match(
        await page.locator("html").getAttribute("class"),
        /large-text/,
      );
      const downloaded = page.waitForEvent("download");
      await page.getByRole("button", { name: "Haladás letöltése" }).click();
      const file = await downloaded;
      exported = await readFile(await file.path(), "utf8");
      assert.equal(JSON.parse(exported).lessons.tortek.exitRound, 1);
      const before = await saved();
      await page.getByLabel("Haladásmentés megnyitása").setInputFiles({
        name: "hibas.json",
        mimeType: "application/json",
        buffer: Buffer.from("{bad}"),
      });
      await page.locator(".settings-message").waitFor();
      assert.equal(await page.locator(".import-preview").count(), 0);
      assert.deepEqual(await saved(), before);
      await page.getByRole("checkbox", { name: /Nagyobb betűk/ }).uncheck();
      await page.getByLabel("Haladásmentés megnyitása").setInputFiles({
        name: "mentes.json",
        mimeType: "application/json",
        buffer: Buffer.from(exported),
      });
      await page.locator(".import-preview").waitFor();
      assert.equal(
        (await saved()).settings.largeText,
        false,
        "Preview must not replace state",
      );
      await page
        .getByRole("button", { name: "Ezt a mentést használom" })
        .click();
      assert.equal((await saved()).settings.largeText, true);
      assert.equal(await page.locator(".import-preview").count(), 0);
      await page.getByRole("checkbox", { name: /Nagyobb betűk/ }).uncheck();
      await axe("settings");
    },
  );
  await check(
    "Guest session stays separate; reset cancellation keeps original progress",
    async () => {
      const original = await saved();
      await page.getByRole("button", { name: "Vendégmód indítása" }).click();
      await page.locator(".guest-banner").waitFor();
      await lessonStep("tortek", 4);
      await answer(page.locator(".exercise-card"), lessons[0].practice[0]);
      assert.deepEqual(await saved(), original);
      await page
        .locator(".guest-banner")
        .getByRole("button", { name: "Vissza a saját haladásomhoz" })
        .click();
      await route("beallitasok");
      assert.deepEqual(await saved(), original);
      await page.getByRole("button", { name: "Haladás törlése…" }).click();
      await page
        .locator(".reset-confirm")
        .getByRole("button", { name: "Mégsem" })
        .click();
      assert.deepEqual(await saved(), original);
    },
  );
  await check(
    "Printable worksheet contains ten tasks and an optional explained key",
    async () => {
      await route("nyomtatas/tortek");
      assert.equal(await page.locator(".paper-exercise").count(), 10);
      assert.equal(await page.locator(".paper-answers").count(), 0);
      await page
        .getByRole("checkbox", { name: "Megoldókulccsal együtt" })
        .check();
      assert.equal(await page.locator(".paper-answers > section").count(), 10);
      await page.emulateMedia({ media: "print" });
      assert.equal(await page.locator(".sidebar").isVisible(), false);
      assert.equal(await page.locator(".print-controls").isVisible(), false);
      await page.pdf({
        path: resolve(out, "worksheet-test.pdf"),
        format: "A4",
        printBackground: true,
      });
      await page.emulateMedia({ media: "screen" });
    },
  );
  await check(
    "390px and 320px: every workshop and core page has no page-level horizontal overflow",
    async () => {
      const overflow = [];
      async function inspect(label) {
        const size = await page.evaluate(() => ({
          viewport: innerWidth,
          scroll: document.documentElement.scrollWidth,
        }));
        if (size.scroll > size.viewport + 1) overflow.push({ label, ...size });
      }
      for (const width of [390, 320]) {
        await page.setViewportSize({ width, height: 844 });
        for (const path of [
          "felfedezes",
          "tematerkep",
          "gyakorlas",
          "haladas",
          "beallitasok",
        ]) {
          await route(path);
          await inspect(`${width}px ${path}`);
        }
        for (const lesson of allLessons) {
          await lessonStep(lesson.id, 1);
          await inspect(`${width}px ${lesson.id}`);
        }
        await route("felfedezes");
        await page.screenshot({
          path: resolve(out, `home-${width}.png`),
          fullPage: true,
        });
      }
      await lessonStep("valoszinuseg", 1);
      await page.screenshot({
        path: resolve(out, "probability-320.png"),
        fullPage: true,
      });
      await axe("probability-mobile-320");
      await route("beallitasok");
      await page.getByRole("checkbox", { name: /Nagyobb betűk/ }).check();
      await lessonStep("tortek", 4);
      await inspect("320px large text practice");
      assert.deepEqual(overflow, [], "Mobile page-level overflow");
    },
  );
  await check(
    "Corrupt stored JSON is warned about and never silently overwritten",
    async () => {
      const isolated = await browser.newContext();
      const damaged = await isolated.newPage();
      await damaged.goto(url);
      await damaged.evaluate(() =>
        localStorage.setItem("matek8:profile:v1", "{unfinished"),
      );
      await damaged.reload();
      await damaged.locator(".storage-warning").waitFor();
      await damaged
        .getByRole("button", { name: "Kezdjük az alapokkal" })
        .click();
      await damaged.locator(".lesson-steps button").nth(1).click();
      assert.equal(
        await damaged.evaluate(() => localStorage.getItem("matek8:profile:v1")),
        "{unfinished",
      );
      await isolated.close();
    },
  );
  await check(
    "Standalone file works offline without remote resource requests",
    async () => {
      const offline = await browser.newContext({
        offline: true,
        viewport: { width: 1280, height: 900 },
      });
      const standalone = await offline.newPage();
      const errors = [];
      const remote = [];
      standalone.on("pageerror", (error) => errors.push(String(error)));
      standalone.on("request", (req) => {
        if (/^https?:/.test(req.url())) remote.push(req.url());
      });
      await standalone.goto(
        pathToFileURL(
          resolve(
            "release",
            JSON.parse(await readFile("release/build.json", "utf8")).filename,
          ),
        ).href,
      );
      await standalone.getByRole("heading", { name: /Van benne/ }).waitFor();
      await standalone.locator('a.topic-card[href="#lecke/tortek"]').click();
      await standalone.locator(".lesson-steps button").nth(4).click();
      await answer(
        standalone.locator(".exercise-card"),
        lessons[0].practice[0],
      );
      await standalone.reload();
      await standalone.locator(".exercise-card").waitFor();
      assert.equal(
        await standalone
          .locator(".exercise-card input[type=text]")
          .inputValue(),
        "5/6",
      );
      await standalone
        .getByRole("link", { name: "Beállítások", exact: true })
        .click();
      const downloadPromise = standalone.waitForEvent("download");
      await standalone
        .getByRole("button", { name: "Haladás letöltése" })
        .click();
      const downloaded = await downloadPromise;
      const exported = JSON.parse(
        await readFile(await downloaded.path(), "utf8"),
      );
      assert.equal(exported.attempts["tortek-practice-1"].independent, true);
      assert.deepEqual(remote, []);
      assert.deepEqual(errors, []);
      await standalone.screenshot({
        path: resolve(out, "offline-practice.png"),
        fullPage: true,
      });
      await offline.close();
    },
  );
  await check(
    "No browser runtime errors or automated accessibility violations in checked states",
    async () => {
      assert.deepEqual(report.pageErrors, []);
      assert.deepEqual(report.consoleErrors, []);
      const violations = report.accessibility.flatMap((scan) =>
        scan.violations.map((v) => ({ page: scan.name, ...v })),
      );
      assert.deepEqual(
        violations,
        [],
        `See ${resolve(out, "browser-report.json")} for accessibility details.`,
      );
    },
  );
} finally {
  await writeFile(
    resolve(out, "browser-report.json"),
    JSON.stringify(report, null, 2),
  );
  await browser.close();
  await server?.close();
}

import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const html = await readFile('index.html');
const prefix = '/8.os-matematika/';
const server = createServer((req, res) => {
  if (new URL(req.url, 'http://localhost').pathname !== prefix) {
    res.writeHead(404);
    return res.end('Not found');
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
  res.end(html);
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const base = 'http://127.0.0.1:' + server.address().port + prefix;
const browser = await chromium.launch({ headless: true });
const completed = [];
let axeStates = 0;

async function a11y(page, label) {
  const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
  assert.deepEqual(result.violations.map(v => ({ id:v.id, impact:v.impact, nodes:v.nodes.map(n => n.target) })), [], label);
  axeStates++;
}
async function textIncludes(locator, pattern) {
  await locator.waitFor();
  const value = await locator.innerText();
  if (pattern instanceof RegExp) assert.match(value, pattern);
  else assert.ok(value.includes(pattern), 'Missing text: ' + pattern + '\nActual: ' + value);
}
async function noOverflow(page, state) {
  const sizes = await page.evaluate(() => ({ page: document.documentElement.scrollWidth, view: innerWidth }));
  assert.ok(sizes.page <= sizes.view + 1, state + ': ' + JSON.stringify(sizes));
}
async function step(page, index) {
  await page.locator('.lesson-steps button').nth(index).click();
}
async function visit(page, hash = 'felfedezes') {
  await page.goto(base + '?check=' + encodeURIComponent(hash) + '#' + hash);
  await page.locator('main h1').waitFor();
}
async function numbers(page, values) {
  for (let i=0; i<values.length; i++) {
    await page.locator('.lab-number').nth(i).fill(String(values[i]));
  }
}
async function scenario(name, run, viewport = { width:1280, height:900 }) {
  const context = await browser.newContext({ viewport, acceptDownloads:true });
  const page = await context.newPage();
  page.setDefaultTimeout(12000);
  const errors = [];
  page.on('pageerror', e => errors.push(String(e)));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  try {
    await run(page, context);
    assert.deepEqual(errors, [], name + ': browser errors');
    completed.push(name);
    console.log('PASS ' + name);
  } finally {
    await context.close();
  }
}

try {
  await scenario('Almappás belépés, keresés, billentyűzet és teljes tématérkép', async page => {
    await visit(page);
    assert.equal(await page.locator('.topic-card').count(), 6);
    await textIncludes(page.locator('main h1'), /Van benne/);
    await a11y(page, 'Kezdőlap');
    const hero = page.locator('#hero-range');
    await hero.focus();
    await page.keyboard.press('ArrowLeft');
    await textIncludes(page.locator('.hero-fraction'), /50/);
    await page.getByRole('textbox', { name:'Keresés a témák között' }).fill('szazalek');
    assert.equal(await page.locator('.topic-card').count(), 1);
    await visit(page, 'tematerkep');
    assert.equal(await page.locator('.curriculum-card').count(), 24);
    await textIncludes(page.locator('main'), /137/);
    await textIncludes(page.locator('main'), /Még készül/);
  });

  await scenario('Törtek: tévképzet, magyarázat, helyes válasz és tényleges mentés', async page => {
    await visit(page, 'lecke/tortek');
    await step(page, 4);
    const card = page.locator('.exercise-card').first();
    await card.locator('input[type=text]').fill('2/5');
    await card.getByRole('button', { name:'Ellenőrzöm', exact:true }).click();
    await card.locator('.answer-feedback.retry').waitFor();
    await card.getByRole('button', { name:'Kérek egy kapaszkodót', exact:true }).click();
    assert.ok(await card.locator('.hints > div').count() > 0);
    await card.getByRole('button', { name:'Teljes magyarázat', exact:true }).click();
    assert.ok(await card.locator('.solution ol li').count() > 0);
    await card.locator('input[type=text]').fill('5/6');
    await card.getByRole('button', { name:'Ellenőrzöm', exact:true }).click();
    await card.locator('.answer-feedback.correct').waitFor();
    await page.reload(); await step(page, 4);
    assert.equal(await page.locator('.exercise-card').first().locator('input[type=text]').inputValue(), '5/6');
    await a11y(page, 'Gyakorlás visszajelzéssel');
    await visit(page, 'beallitasok');
    const downloadPromise = page.waitForEvent('download');
    await page.getByRole('button', { name:'Haladás letöltése', exact:true }).click();
    const downloaded = await downloadPromise;
    const stream = await downloaded.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
    assert.equal(data.attempts['tortek-practice-1'].input, '5/6');
    assert.equal(data.attempts['tortek-practice-1'].success, true);
    assert.equal(data.attempts['tortek-practice-1'].independent, false, 'Hints and a wrong answer must not count as independent success');
    await page.getByRole('button', { name:'Vendégmód indítása', exact:true }).click();
    await page.locator('.guest-banner').waitFor();
    await page.locator('.guest-banner').getByRole('button', { name:'Vissza a saját haladásomhoz' }).click();
    assert.equal(await page.locator('.guest-banner').count(), 0);
  });

  await scenario('Törtsávok: eltérő osztásból közös mérték', async page => {
    await visit(page, 'lecke/tortek'); await step(page, 1);
    await numbers(page, [2,3,1,4]);
    await textIncludes(page.locator('.lab-root'), /11\s*\/\s*12/);
    await page.getByRole('button', { name:'Mutasd ugyanakkora részekben', exact:true }).click();
    assert.equal(await page.getByRole('button', { name:'Eredeti felosztások', exact:true }).getAttribute('aria-pressed'), 'true');
    await a11y(page, 'Törtsáv műhely');
  });

  await scenario('Százalék: a második változás alapja az új ár', async page => {
    await visit(page, 'lecke/szazalek'); await step(page, 1);
    await textIncludes(page.locator('.lab-summary'), /9\s*600/);
    await page.locator('.lab-number').first().fill('20000');
    await textIncludes(page.locator('.lab-summary'), /19\s*200/);
    await page.getByLabel('Második változás iránya', { exact:true }).selectOption('down');
    await textIncludes(page.locator('.lab-summary'), /12\s*800/);
    await a11y(page, 'Százalékműhely');
  });

  await scenario('Egyenlet: azonos művelet mindkét oldalon és visszaellenőrzés', async page => {
    await visit(page, 'lecke/egyenlet'); await step(page, 1);
    await page.getByRole('button', { name:'Mindkét oldalt osztom 3-mal', exact:true }).click();
    await textIncludes(page.locator('.lab-root'), /x\s*\+\s*2\s*=\s*7/);
    await page.getByRole('button', { name:'Mindkét oldalból kivonok 2-t', exact:true }).click();
    await textIncludes(page.locator('.lab-root'), /x\s*=\s*5/);
    await page.getByRole('button', { name:'Ellenőrzöm az eredeti egyenletben', exact:true }).click();
    await textIncludes(page.locator('.lab-check'), /21/);
    await a11y(page, 'Egyenletműhely');
  });

  await scenario('Grafikon: alapdíj, meredekség és közvetlen arányosság', async page => {
    await visit(page, 'lecke/grafikon'); await step(page, 1);
    await textIncludes(page.locator('.lab-equation strong'), /^1\s*300 Ft$/);
    await page.locator('.lab-number').nth(0).fill('0');
    await textIncludes(page.locator('.lab-equation strong'), /^800 Ft$/);
    await page.locator('.lab-number').nth(1).fill('0');
    await textIncludes(page.locator('.lab-equation strong'), /^0 Ft$/);
    await a11y(page, 'Grafikonműhely');
  });

  await scenario('Pitagorasz: területek, kiemelés és elforgatás', async page => {
    await visit(page, 'lecke/pitagorasz'); await step(page, 1);
    await numbers(page, [6,8]);
    await textIncludes(page.locator('.lab-equation'), /6²\s*\+\s*8²\s*=\s*100\s*=\s*c²/);
    await page.getByRole('button', { name:'4. Az összefüggés', exact:true }).click();
    await page.getByRole('button', { name:'2. darab kiemelése', exact:true }).click();
    assert.equal(await page.getByRole('button', { name:'2. darab kiemelése', exact:true }).getAttribute('aria-pressed'), 'true');
    await page.getByRole('button', { name:'Elforgatom 90°-kal', exact:true }).click();
    await a11y(page, 'Pitagorasz-műhely');
  });

  await scenario('Valószínűség: 36 rendezett kimenetel és szimuláció', async page => {
    await visit(page, 'lecke/valoszinuseg'); await step(page, 1);
    assert.equal(await page.locator('.lab-dice-cell').count(), 36);
    await textIncludes(page.locator('.lab-equation'), /6\s*\/\s*36/);
    await page.getByRole('button', { name:'+10 dobáspár', exact:true }).click();
    await page.getByRole('button', { name:'+100 dobáspár', exact:true }).click();
    await textIncludes(page.locator('.lab-observation'), /110/);
    await page.getByRole('button', { name:'Első kocka 6, második kocka 6; összeg 12. Ezt az összeget választom.', exact:true }).click();
    await textIncludes(page.locator('.lab-equation'), /1\s*\/\s*36/);
    await a11y(page, 'Valószínűség-műhely');
  });

  await scenario('Hat nyomtatható feladatsor, feladatonkénti magyarázattal', async page => {
    for (const id of ['tortek','szazalek','egyenlet','grafikon','pitagorasz','valoszinuseg']) {
      await visit(page, 'nyomtatas/' + id);
      assert.equal(await page.locator('.paper-exercise').count(), 10, id);
      await page.getByRole('checkbox', { name:'Megoldókulccsal együtt' }).check();
      assert.equal(await page.locator('.paper-answers > section').count(), 10, id);
      await page.emulateMedia({ media:'print' });
      assert.equal(await page.locator('.print-controls').isVisible(), false, id);
      await page.emulateMedia({ media:'screen' });
    }
  });

  for (const width of [390,320]) {
    await scenario('Mobil ' + width + ' px, nagy betűk és minden műhely', async page => {
      await visit(page); await noOverflow(page, 'home');
      for (const id of ['tortek','szazalek','egyenlet','grafikon','pitagorasz','valoszinuseg']) {
        await visit(page, 'lecke/' + id); await step(page, 1);
        await noOverflow(page, id);
      }
      await visit(page, 'beallitasok');
      await page.getByRole('checkbox', { name:/Nagyobb betűk/ }).check();
      await page.getByRole('checkbox', { name:/Nyugodt nézet/ }).check();
      assert.ok((await page.locator('html').getAttribute('class')).includes('large-text'));
      await noOverflow(page, 'settings-large');
      if (width === 320) await a11y(page, '320px beállítások nagy betűvel');
      await visit(page, 'lecke/valoszinuseg'); await step(page, 1);
      assert.equal(await page.locator('.lab-dice-cell').count(), 36);
      await noOverflow(page, 'dice-large');
    }, { width, height:844 });
  }

  await scenario('Letöltött HTML: hálózat nélkül is megoldható és menthető', async (page, context) => {
    const remote = [];
    page.on('request', req => { if (/^https?:/.test(req.url())) remote.push(req.url()); });
    await context.setOffline(true);
    await page.goto(pathToFileURL(resolve('index.html')).href + '#lecke/tortek');
    await step(page, 4);
    const card = page.locator('.exercise-card').first();
    await card.locator('input[type=text]').fill('5/6');
    await card.getByRole('button', { name:'Ellenőrzöm', exact:true }).click();
    await card.locator('.answer-feedback.correct').waitFor();
    await page.reload(); await step(page, 4);
    assert.equal(await page.locator('.exercise-card').first().locator('input[type=text]').inputValue(), '5/6');
    assert.deepEqual(remote, [], 'No HTTP(S) asset should be requested by the offline file');
  });
  console.log(JSON.stringify({ scenarios:completed.length, axeStates, violations:0, browser:browser.version(), tests:completed }, null, 2));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}

#!/usr/bin/env node
/**
 * Read-only GitHub Pages source check. Run with Node.js 24:
 *   node checks/pages-status.mjs
 *
 * Required environment: GITHUB_REPOSITORY and GITHUB_TOKEN (pages: read).
 * Optional runner files: GITHUB_OUTPUT and GITHUB_STEP_SUMMARY.
 * This script never creates, enables, updates, or deploys a Pages site.
 *
 * First-time setup: Settings -> Pages -> Build and deployment ->
 * Source: GitHub Actions. The regular GITHUB_TOKEN cannot enable Pages.
 * https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
 */
import { appendFile } from 'node:fs/promises';

const setupInstruction =
  'Első beállítás: Settings → Pages → Build and deployment → Source: GitHub Actions. ' +
  'A szokásos GITHUB_TOKEN nem engedélyezi először a Pages-t; ez a script csak olvas.';

class PagesCheckError extends Error {}

function annotation(level, message) {
  const escaped = message
    .replaceAll('%', '%25')
    .replaceAll('\r', '%0D')
    .replaceAll('\n', '%0A');
  console.log('::' + level + ' title=Matek8 Pages::' + escaped);
}

async function inspectPages() {
  const repository = process.env.GITHUB_REPOSITORY || '';
  if (!/^[A-Za-z0-9][A-Za-z0-9-]{0,38}\/[A-Za-z0-9._-]{1,100}$/.test(repository)) {
    throw new PagesCheckError('Hiányzó vagy hibás GITHUB_REPOSITORY; owner/repo alak szükséges.');
  }
  const [owner, name] = repository.split('/');
  if (name === '.' || name === '..') {
    throw new PagesCheckError('Hibás repónév a GITHUB_REPOSITORY értékében.');
  }

  const token = process.env.GITHUB_TOKEN || '';
  if (!token || /[\u0000-\u0020\u007f]/.test(token)) {
    throw new PagesCheckError('Hiányzó vagy hibás GITHUB_TOKEN; a lekéréshez pages: read jogosultság szükséges.');
  }

  const url = 'https://api.github.com/repos/' +
    encodeURIComponent(owner) + '/' + encodeURIComponent(name) + '/pages';

  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      redirect: 'manual',
      signal: AbortSignal.timeout(15_000),
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: 'Bearer ' + token,
        'X-GitHub-Api-Version': '2026-03-10',
        'User-Agent': 'Matek8-Pages-Status',
      },
    });
  } catch {
    throw new PagesCheckError('A GitHub Pages API nem érhető el, vagy a lekérés időtúllépés miatt megszakadt.');
  }

  if (response.status === 404) {
    return {
      enabled: false,
      level: 'notice',
      message: 'A Pages végpont HTTP 404 választ adott; az Actions-telepítés ebben a futásban kimarad.',
    };
  }

  if (response.status !== 200) {
    throw new PagesCheckError(
      'A GitHub Pages API lekérése hibás (HTTP ' + response.status +
      '). Ez nem sikeres Pages-ellenőrzés; ellenőrizd a hozzáférést, a pages: read jogosultságot és az API elérhetőségét.'
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new PagesCheckError('A GitHub Pages API válasza nem olvasható JSON-ként.');
  }
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new PagesCheckError('A GitHub Pages API válasza nem a várt objektum.');
  }

  if (data.build_type === 'workflow') {
    return {
      enabled: true,
      level: null,
      message: 'A Pages publikálási forrása GitHub Actions (build_type=workflow). Ez a forrásbeállítást igazolja, nem a telepítés sikerét.',
    };
  }

  return {
    enabled: false,
    level: 'notice',
    message: 'A Pages válasza nem build_type=workflow beállítást jelez; az Actions-telepítés ebben a futásban kimarad.',
  };
}

async function main() {
  let result;
  try {
    result = await inspectPages();
  } catch (error) {
    result = {
      enabled: false,
      level: 'error',
      message: error instanceof PagesCheckError
        ? error.message
        : 'Váratlan hiba történt a GitHub Pages állapotának ellenőrzésekor.',
    };
    process.exitCode = 1;
  }

  // Only fixed text and a boolean are written. API bodies and tokens stay private.
  const summary = '## GitHub Pages forrásellenőrzése\n\n' +
    result.message + '\n\n' +
    'Telepítési kapu: enabled=' + String(result.enabled) + '.\n' +
    (result.enabled ? '' : '\n' + setupInstruction + '\n');

  try {
    // Write the summary first: a failed summary write must not publish enabled=true.
    if (process.env.GITHUB_STEP_SUMMARY) {
      await appendFile(process.env.GITHUB_STEP_SUMMARY, summary, { encoding: 'utf8', flag: 'a' });
    }
    if (process.env.GITHUB_OUTPUT) {
      await appendFile(
        process.env.GITHUB_OUTPUT,
        'enabled=' + String(result.enabled) + '\n',
        { encoding: 'utf8', flag: 'a' }
      );
    }
  } catch {
    process.exitCode = 1;
    annotation('error', 'Az ellenőrzés kimeneti vagy összefoglaló fájlja nem írható; ez a lépés sikertelen.');
    return;
  }

  if (result.level) annotation(result.level, result.message);
  console.log('Pages ellenőrzés: enabled=' + String(result.enabled));
}

await main();

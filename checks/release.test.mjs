import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';

const bytes = await readFile(new URL('../index.html', import.meta.url));
const html = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
const manifest = JSON.parse(await readFile(new URL('../release-manifest.json', import.meta.url), 'utf8'));

test('Az index.html bájtra egyezik az ellenőrzött önálló kiadással', () => {
  assert.equal(bytes.length, manifest.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.sha256);
});
test('A magyar oldalnak van mobilnézete és tényleges alkalmazásgyökere', () => {
  assert.match(html, /<html lang="hu">/);
  assert.match(html, /name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /id="app"/);
});
test('A beágyazott program szintaktikailag végrehajtható JavaScript', () => {
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length, 1);
  assert.ok(scripts[0][1].length > 100000);
  new Script(scripts[0][1], { filename: 'matek8-inline.js' });
});
test('A kiadás betöltéséhez nem kell külső script, stílus vagy kép', () => {
  assert.doesNotMatch(html, /<script[^>]+\bsrc\s*=/i);
  assert.doesNotMatch(html, /<link[^>]+\brel=["']stylesheet/i);
  assert.doesNotMatch(html, /<(?:img|iframe|audio|video)[^>]+\bsrc=["']https?:/i);
  assert.match(html, /connect-src 'none'/);
  assert.match(html, /form-action 'none'/);
  assert.match(html, /object-src 'none'/);
  assert.match(html, /Third-party runtime: Preact/);
});

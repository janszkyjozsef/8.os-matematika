import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const script = html.match(/<script>([\s\S]*?)<\/script>/)[1];
const mount = 'lt(e(Da,{}),document.getElementById("app"));';
assert.equal(script.split(mount).length, 2, 'Unexpected v0.1.0 bundle structure: review extraction before changing it');
// Inspect the exact release without mounting a DOM. No process, require, fetch,
// filesystem, or browser is supplied to this isolated context.
const extracted = runInNewContext(
  script.replace(mount, 'return {lessons:O,curriculum:Ut};'),
  { TextEncoder },
  { timeout:2000 }
);
const fromRelease = JSON.parse(JSON.stringify(extracted));
const lessons = JSON.parse(await readFile(new URL('../content/v0.1.0/lessons.json', import.meta.url), 'utf8'));
const curriculum = JSON.parse(await readFile(new URL('../content/v0.1.0/curriculum.json', import.meta.url), 'utf8'));

test('Az olvasható leckeadatok a tényleges kiadás tartalmával egyeznek', () => {
  assert.deepEqual(lessons, fromRelease.lessons);
  assert.equal(lessons.length, 6);
  assert.equal(lessons.reduce((n,l) => n + l.practice.length, 0), 48);
  assert.equal(lessons.reduce((n,l) => n + l.exit.length, 0), 12);
  assert.equal(lessons.reduce((n,l) => n + l.examples.length, 0), 12);
  const ids = lessons.flatMap(l => [l.prediction,...l.practice,...l.exit]).map(e => e.id);
  assert.equal(new Set(ids).size, 66, 'Every authored exercise must have a unique ID');
});
test('A tématérkép a kiadás 24 modulját és 137 tervezett egységét őrzi', () => {
  assert.deepEqual(curriculum, fromRelease.curriculum);
  assert.equal(curriculum.length, 24);
  assert.equal(curriculum.reduce((n,m) => n + m.units.length, 0), 137);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import type { Exercise, TopicId } from '../src/types.ts';
import { gradeAnswer } from '../src/math/engine.ts';
import { generateExercise, legacyGeneratorFamilies as generatorFamilies } from '../src/math/generators.ts';

const topics: TopicId[] = ['tortek', 'szazalek', 'egyenlet', 'grafikon', 'pitagorasz', 'valoszinuseg'];

// Independent, intentionally small reference reader: generator answers contain
// only integer numerators / positive integer denominators, within safe bounds.
// It does not call the production parser or any production arithmetic helper.
function answerPair(exercise: Exercise): [number, number] {
  assert.equal(exercise.answer.kind, 'number');
  if (exercise.answer.kind !== 'number') throw new Error('Unexpected answer type');
  const match = /^(-?\d+)(?:\/(\d+))?$/.exec(exercise.answer.expected);
  assert.ok(match, exercise.answer.expected);
  const n = Number(match[1]);
  const d = Number(match[2] ?? 1);
  assert.ok(Number.isSafeInteger(n) && Number.isSafeInteger(d) && d > 0);
  return [n, d];
}

function values(prompt: string, pattern: RegExp): number[] {
  const match = pattern.exec(prompt.replaceAll('−', '-'));
  assert.ok(match, `${pattern}: ${prompt}`);
  return match.slice(1).map(Number);
}

function fractionsIn(prompt: string): number[][] {
  return [...prompt.matchAll(/(\d+)\/(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
}

function assertRatio(actual: [number, number], numerator: number, denominator = 1): void {
  assert.equal(actual[0] * denominator, numerator * actual[1]);
}

function lcmByEnumeration(a: number, b: number): number {
  for (let candidate = Math.max(a, b); candidate <= a * b; candidate += 1) {
    if (candidate % a === 0 && candidate % b === 0) return candidate;
  }
  throw new Error('No common multiple in the bounded reference range.');
}

/** Each reference recovers the given data from the actual student-facing prompt. */
function verifyAgainstProblem(familyId: string, exercise: Exercise): void {
  const p = exercise.prompt;
  const actual = answerPair(exercise);
  switch (familyId) {
    case 'frac-common-unit-v1': {
      const [[, b], [, d]] = fractionsIn(p);
      assertRatio(actual, lcmByEnumeration(b, d));
      break;
    }
    case 'frac-sum-v1': {
      const [[a, b], [c, d]] = fractionsIn(p);
      assertRatio(actual, a * d + c * b, b * d);
      assert.ok(actual[0] / actual[1] > Math.max(a / b, c / d));
      break;
    }
    case 'frac-measure-division-v1': {
      const [[a, b], [c, d]] = fractionsIn(p);
      // Independent back-check: proposed ratio × measuring unit = original length.
      assert.equal(actual[0] * c * b, actual[1] * d * a);
      assert.match(p, /hányadosát/);
      assert.match(p, /nem a kivágható teljes darabok/);
      assert.ok(c > 0 && b > 0 && d > 0);
      break;
    }
    case 'percent-part-v1': {
      const [base] = values(p, /eredeti ára (\d+) Ft/);
      const [percent] = values(p, /(\d+)%-os/);
      assertRatio(actual, base * percent, 100);
      assert.ok(actual[0] / actual[1] > 0 && actual[0] / actual[1] < base);
      break;
    }
    case 'percent-base-v1': {
      const [percent] = values(p, /(\d+)%-os/);
      const [remaining] = values(p, /ára (\d+) Ft/);
      // Put the proposed original price through the advertised discount.
      assert.equal(actual[0] * (100 - percent), remaining * 100 * actual[1]);
      assert.ok(actual[0] / actual[1] > remaining);
      break;
    }
    case 'percent-change-v1': {
      const [base] = values(p, /Kezdeti ár: (\d+) Ft/);
      const changes = [...p.matchAll(/(\d+)%-kal/g)].map((m) => Number(m[1]));
      assert.equal(changes.length, 2);
      const discount = base * changes[0] / 100;
      const newBase = base - discount;
      const increase = newBase * changes[1] / 100;
      assertRatio(actual, newBase + increase);
      assert.ok(actual[0] / actual[1] < base, 'Equal positive percentages use different bases.');
      break;
    }
    case 'eq-linear-v1': {
      const [a, b, c] = values(p, /(\d+)x \+ (\d+) = (-?\d+)/);
      assert.notEqual(a, 0);
      assert.equal(a * actual[0] + b * actual[1], c * actual[1]);
      break;
    }
    case 'eq-group-v1': {
      const [a, b, c] = values(p, /(\d+)\(x \+ (\d+)\) = (\d+)/);
      assert.notEqual(a, 0);
      assert.equal(a * (actual[0] + b * actual[1]), c * actual[1]);
      break;
    }
    case 'eq-negative-v1': {
      const [magnitude, b, c] = values(p, /-(\d+)x \+ (\d+) = (-?\d+)/);
      assert.ok(magnitude > 0);
      assert.equal(-magnitude * actual[0] + b * actual[1], c * actual[1]);
      break;
    }
    case 'graph-value-v1': {
      const expression = /y = (\d+)x ([+−]) (\d+)/.exec(p);
      assert.ok(expression);
      const a = Number(expression[1]);
      const b = Number(expression[3]) * (expression[2] === '−' ? -1 : 1);
      const [x] = values(p, /ha x = (-?\d+)/);
      assertRatio(actual, a * x + b);
      break;
    }
    case 'graph-start-v1': {
      const points = [...p.replaceAll('−', '-').matchAll(/\((-?\d+); (-?\d+)\)/g)]
        .map((m) => [Number(m[1]), Number(m[2])]);
      assert.equal(points.length, 2);
      const [[x1, y1], [x2, y2]] = points;
      assert.ok(x2 > x1 && x1 > 0);
      // Equal slopes from (0, proposed start) to either given point.
      assert.equal((y1 * actual[1] - actual[0]) * x2, (y2 * actual[1] - actual[0]) * x1);
      break;
    }
    case 'graph-fee-inverse-v1': {
      const [base] = values(p, /alapdíja (\d+) Ft/);
      const [rate] = values(p, /kilométerenként (\d+) Ft/);
      const [total] = values(p, /teljes díj (\d+) Ft/);
      assert.ok(rate > 0 && total > base);
      assert.equal(base * actual[1] + rate * actual[0], total * actual[1]);
      break;
    }
    case 'pyth-hypotenuse-v1': {
      const [a, b] = values(p, /befogói (\d+) cm és (\d+) cm/);
      assert.equal(actual[0] ** 2, (a ** 2 + b ** 2) * actual[1] ** 2);
      const c = actual[0] / actual[1];
      assert.ok(c > Math.max(a, b) && c < a + b);
      assert.match(p, /derékszögű/);
      break;
    }
    case 'pyth-leg-v1': {
      const [c, a] = values(p, /átfogója (\d+) cm, egyik befogója (\d+) cm/);
      assert.ok(c > a && a > 0 && actual[0] > 0);
      assert.equal(a ** 2 * actual[1] ** 2 + actual[0] ** 2, c ** 2 * actual[1] ** 2);
      break;
    }
    case 'pyth-context-v1': {
      const [a, b] = values(p, /oldalai (\d+) m és (\d+) m/);
      assert.equal(actual[0] ** 2, (a ** 2 + b ** 2) * actual[1] ** 2);
      assert.match(p, /téglalap/);
      assert.ok(actual[0] / actual[1] < a + b);
      break;
    }
    case 'prob-dice-sum-v1': {
      const [sum] = values(p, /összege (\d+)/);
      const allPairs: [number, number][] = [];
      for (let first = 1; first <= 6; first += 1) {
        for (let second = 1; second <= 6; second += 1) allPairs.push([first, second]);
      }
      const favorable = allPairs.filter(([a, b]) => a + b === sum).length;
      assert.equal(allPairs.length, 36);
      assertRatio(actual, favorable, allPairs.length);
      assert.match(p, /független, szabályos hatoldalú/);
      break;
    }
    case 'prob-favorable-v1': {
      const [total] = values(p, /pörgettyűn (\d+) egyforma/);
      const [divisor] = values(p, /szám (\d+) többszöröse/);
      let favorable = 0;
      for (let label = 1; label <= total; label += 1) if (label % divisor === 0) favorable += 1;
      assertRatio(actual, favorable, total);
      break;
    }
    case 'prob-urn-v1': {
      const [red, blue, green] = values(p, /(\d+) piros, (\d+) kék és (\d+) zöld/);
      // Explicitly enumerate individually equally likely balls, not color names.
      const balls = [...Array(red).fill('red'), ...Array(blue).fill('blue'), ...Array(green).fill('green')];
      const notRed = /hogy nem piros/.test(p);
      const favorable = balls.filter((color) => notRed ? color !== 'red' : color === 'red').length;
      assertRatio(actual, favorable, balls.length);
      break;
    }
    default: assert.fail(`A new family needs an independent reference: ${familyId}`);
  }
  if (exercise.topic === 'valoszinuseg') assert.ok(actual[0] > 0 && actual[0] <= actual[1]);
}

test('the catalog contains exactly eighteen distinct versioned families, three per topic', () => {
  assert.equal(generatorFamilies.length, 18);
  assert.equal(new Set(generatorFamilies.map((f) => f.id)).size, 18);
  for (const topic of topics) assert.equal(generatorFamilies.filter((f) => f.topic === topic).length, 3);
  for (const family of generatorFamilies) {
    assert.match(family.id, /-v1$/);
    assert.ok(family.title.length > 8);
  }
});

test('hand-solved replay references, seed 7', () => {
  // Computed independently from the printed seed-7 questions before seeing
  // their expected answers. These guard the examples as well as replay drift.
  const references = [
    '30', '17/12', '3/4', '1775', '1000', '1820', '12', '10', '5',
    '8', '-5', '3', '25', '6', '68', '1/12', '1/5', '3/7',
  ];
  generatorFamilies.forEach((family, index) => {
    const exercise = generateExercise(family.topic, 7, index % 3);
    assert.equal(exercise.answer.kind, 'number');
    if (exercise.answer.kind === 'number') assert.equal(exercise.answer.expected, references[index], family.id);
    verifyAgainstProblem(family.id, exercise);
  });
});

for (const family of generatorFamilies) {
  const variant = generatorFamilies.filter((f) => f.topic === family.topic).findIndex((f) => f.id === family.id);
  test(`${family.id}: 200 seeds satisfy independent mathematical references and authoring invariants`, () => {
    const ids = new Set<string>();
    const prompts = new Set<string>();
    for (let seed = 0; seed < 200; seed += 1) {
      const exercise = generateExercise(family.topic, seed, variant);
      assert.deepEqual(generateExercise(family.topic, seed, variant), exercise, `replay seed ${seed}`);
      assert.equal(exercise.topic, family.topic);
      assert.ok(exercise.id.includes(family.id) && exercise.id.includes(`seed=${seed}`));
      assert.ok(!ids.has(exercise.id), `duplicate replay identifier at seed ${seed}`);
      ids.add(exercise.id);
      prompts.add(exercise.prompt);
      assert.ok(exercise.prompt.length >= 25);
      assert.ok(exercise.hints.length >= 2 && exercise.hints.every((hint) => hint.length > 15));
      assert.ok(exercise.solution.length >= 2 && exercise.solution.every((s) => s.expression.length > 0 && s.why.length > 15));
      assert.ok(exercise.takeaway.length > 20);
      assert.ok([1, 2, 3].includes(exercise.difficulty));
      verifyAgainstProblem(family.id, exercise);
      if (exercise.answer.kind !== 'number') assert.fail('Unexpected generated answer kind');
      // This integration check supplements, not replaces, the independent math.
      assert.equal(gradeAnswer(exercise, exercise.answer.expected).status, 'correct');
      for (const mistake of exercise.mistakes ?? []) {
        const result = gradeAnswer(exercise, mistake.input);
        assert.equal(result.status, 'incorrect', `${exercise.id}: a diagnostic alternative accidentally matched the answer`);
        assert.equal(result.message, mistake.feedback);
      }
    }
    assert.equal(ids.size, 200);
    assert.ok(prompts.size >= 10, `Too little meaningful variation in ${family.id}`);
  });
}

test('family selection and replay are deterministic for omitted, negative, and large valid seeds', () => {
  for (const topic of topics) {
    const available = generatorFamilies.filter((f) => f.topic === topic);
    for (const seed of [0, 1, 2, 17, -1, -19, 4294967297, Number.MAX_SAFE_INTEGER]) {
      const expectedFamily = ((seed % 3) + 3) % 3;
      const first = generateExercise(topic, seed);
      assert.ok(first.id.includes(available[expectedFamily].id));
      assert.deepEqual(first, generateExercise(topic, seed));
      verifyAgainstProblem(available[expectedFamily].id, first);
    }
    assert.ok(generateExercise(topic, 10, -1).id.includes(available[2].id));
    assert.notEqual(generateExercise(topic, 10, 0).id, generateExercise(topic, 10, 3).id);
  }
});

test('invalid replay parameters and unknown topics fail explicitly', () => {
  for (const seed of [NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) assert.throws(() => generateExercise('tortek', seed), RangeError);
  for (const variant of [NaN, Infinity, 0.5]) assert.throws(() => generateExercise('tortek', 0, variant), RangeError);
  for (const topic of ['missing', 'toString', '__proto__']) assert.throws(() => generateExercise(topic as TopicId, 0), RangeError);
});

import test from "node:test";
import assert from "node:assert/strict";
import type { Exercise, TopicId } from "../src/types.ts";
import { legacyLessons as lessons, legacyLessonById as lessonById } from "../src/content/lessons.ts";
import { gradeAnswer } from "../src/math/engine.ts";

const topics: TopicId[] = [
  "tortek",
  "szazalek",
  "egyenlet",
  "grafikon",
  "pitagorasz",
  "valoszinuseg",
];
const allExercises = lessons.flatMap((lesson) => [
  lesson.prediction,
  ...lesson.practice,
  ...lesson.exit,
]);
const exercisesById = new Map(
  allExercises.map((exercise) => [exercise.id, exercise]),
);

// Small, independent exact-arithmetic reference. No production parser,
// rational helper, generator, or authored answer is used to calculate an oracle.
// These helpers only need the bounded integer/decimal/fraction literals in this
// fixed content bank; tests/math.test.ts separately exercises the input grammar.
interface Q {
  n: bigint;
  d: bigint;
}
function q(n: number | bigint, d: number | bigint = 1): Q {
  let numerator = BigInt(n);
  let denominator = BigInt(d);
  assert.notEqual(denominator, 0n, "Reference denominator must be nonzero");
  if (denominator < 0n) {
    numerator = -numerator;
    denominator = -denominator;
  }
  return { n: numerator, d: denominator };
}
function add(a: Q, b: Q): Q {
  return q(a.n * b.d + b.n * a.d, a.d * b.d);
}
function sub(a: Q, b: Q): Q {
  return q(a.n * b.d - b.n * a.d, a.d * b.d);
}
function mul(a: Q, b: Q): Q {
  return q(a.n * b.n, a.d * b.d);
}
function div(a: Q, b: Q): Q {
  return q(a.n * b.d, a.d * b.n);
}
function same(a: Q, b: Q): boolean {
  return a.n * b.d === b.n * a.d;
}
function less(a: Q, b: Q): boolean {
  return a.n * b.d < b.n * a.d;
}
function assertSame(actual: Q, expected: Q, label: string): void {
  assert.equal(actual.n * expected.d, expected.n * actual.d, label);
}
function scalar(source: string): Q {
  const match = /^([+-]?)(\d+)(?:[.,](\d+))?$/.exec(
    source.trim().replaceAll("−", "-"),
  );
  assert.ok(match, `Unsupported authored reference literal: ${source}`);
  const decimal = match[3] ?? "";
  const sign = match[1] === "-" ? -1n : 1n;
  return q(sign * BigInt(match[2] + decimal), 10n ** BigInt(decimal.length));
}
function readAuthoredNumber(source: string): Q {
  const pieces = source.split("/");
  assert.ok(pieces.length === 1 || pieces.length === 2, source);
  return pieces.length === 1
    ? scalar(pieces[0])
    : div(scalar(pieces[0]), scalar(pieces[1]));
}
function asText(value: Q): string {
  let a = value.n < 0n ? -value.n : value.n;
  let b = value.d;
  while (b !== 0n) [a, b] = [b, a % b];
  const n = value.n / a;
  const d = value.d / a;
  return d === 1n ? String(n) : `${n}/${d}`;
}
function exactPositiveRoot(square: number): Q {
  const root = Math.sqrt(square);
  assert.ok(root > 0 && Number.isSafeInteger(root) && root * root === square);
  return q(root);
}
function normalizedText(source: string): string {
  return source.replaceAll("−", "-").replace(/\s+/gu, " ").trim().toLowerCase();
}
function assertFragments(
  source: string,
  fragments: string[],
  label: string,
): void {
  const text = normalizedText(source);
  for (const fragment of fragments) {
    assert.ok(
      text.includes(normalizedText(fragment)),
      `${label}: missing problem datum "${fragment}"`,
    );
  }
}
function compactMath(source: string): string {
  return source.replace(/\s+/gu, "").replaceAll("−", "-").replaceAll(",", ".");
}
function exercise(id: string): Exercise {
  const found = exercisesById.get(id);
  assert.ok(found, `Missing fixed exercise: ${id}`);
  return found;
}

const dicePairs: [number, number][] = [];
for (let first = 1; first <= 6; first += 1) {
  for (let second = 1; second <= 6; second += 1)
    dicePairs.push([first, second]);
}
function chance(predicate: (first: number, second: number) => boolean): Q {
  return q(
    dicePairs.filter(([first, second]) => predicate(first, second)).length,
    dicePairs.length,
  );
}

interface NumericReference {
  calculate: () => Q;
  because: string;
  givens: string[];
  unit?: string;
  variable?: string;
}

// Each ID is bound to the actual problem data as well as its independent
// calculation. Changing a question requires reviewing this reference; do not
// regenerate the references from answer.expected or the rendered solution.
const numericReferences: Record<string, NumericReference> = {
  "tortek-practice-1": {
    calculate: () => add(q(1, 2), q(1, 3)),
    because: "1/2 + 1/3 = (3 + 2)/6.",
    givens: ["1/2 + 1/3"],
  },
  "tortek-practice-2": {
    calculate: () => sub(q(3, 4), q(1, 6)),
    because: "3/4 − 1/6 = (9 − 2)/12.",
    givens: ["3/4 − 1/6"],
  },
  "tortek-practice-4": {
    calculate: () => div(q(5, 6), q(1, 12)),
    because: "Ten twelfth-metre pieces fill five sixths of a metre.",
    givens: ["5/6 méteres", "1/12 méteres", "maradék nélkül"],
    unit: "darab",
  },
  "tortek-practice-5": {
    calculate: () => mul(q(3, 4), q(2, 3)),
    because: "Two thirds of three quarters is six twelfths of a litre.",
    givens: ["3/4 liter", "2/3 részét"],
    unit: "l",
  },
  "tortek-practice-7": {
    calculate: () => sub(q(7, 10), q(2, 5)),
    because: "The missing addend is the total minus the known part.",
    givens: ["2/5 + □ = 7/10"],
  },
  "tortek-practice-8": {
    calculate: () => div(q(1, 2), q(3, 4)),
    because: "The length ratio is 2/3, not the number of complete cut pieces.",
    givens: [
      "1/2 méteres",
      "3/4 méteres",
      "hosszak arányát",
      "nem levágható egész darabok",
    ],
  },
  "tortek-exit-1": {
    calculate: () => add(q(5, 8), q(1, 6)),
    because: "5/8 + 1/6 = (15 + 4)/24.",
    givens: ["5/8 + 1/6"],
  },

  "szazalek-practice-1": {
    calculate: () => mul(q(2400), q(15, 100)),
    because: "Fifteen hundredths of the stated base.",
    givens: ["2 400 Ft 15%-a"],
    unit: "Ft",
  },
  "szazalek-practice-2": {
    calculate: () => mul(q(6000), q(75, 100)),
    because: "A 25% discount leaves 75% of the original price.",
    givens: ["6 000 Ft", "25% kedvezményt"],
    unit: "Ft",
  },
  "szazalek-practice-3": {
    calculate: () => div(q(6800), q(85, 100)),
    because: "The paid 6800 Ft represents 85% of the unknown original price.",
    givens: ["15% kedvezmény után 6 800 Ft"],
    unit: "Ft",
  },
  "szazalek-practice-5": {
    calculate: () => mul(q(18, 30), q(100)),
    because: "18 of 30 expressed in hundredths, not decimal proportion.",
    givens: ["30 fős", "18-an"],
    unit: "%",
  },
  "szazalek-practice-7": {
    calculate: () => mul(mul(q(12000), q(9, 10)), q(9, 10)),
    because: "The second 10% discount uses the already discounted base.",
    givens: ["12 000 Ft-os", "előbb 10%, majd az új árra további 10%"],
    unit: "Ft",
  },
  "szazalek-practice-8": {
    calculate: () => mul(div(q(2500 - 2000), q(2000)), q(100)),
    because: "The 500 Ft increase is compared with the old 2000 Ft price.",
    givens: ["2 000 Ft-ról 2 500 Ft-ra", "eredeti árhoz képest"],
    unit: "%",
  },
  "szazalek-exit-1": {
    calculate: () => div(q(5400), q(9, 10)),
    because: "5400 Ft is the remaining 90%, so divide by 0.9.",
    givens: ["10% kedvezmény után 5 400 Ft"],
    unit: "Ft",
  },

  "egyenlet-practice-1": {
    calculate: () => q(19 - 7),
    because: "Subtract seven from both sides.",
    givens: ["x + 7 = 19"],
    variable: "x",
  },
  "egyenlet-practice-2": {
    calculate: () => q(35, 5),
    because: "Five equal parts sum to thirty-five.",
    givens: ["5x = 35"],
    variable: "x",
  },
  "egyenlet-practice-4": {
    calculate: () => add(q(20, 4), q(1)),
    because: "First undo multiplication by four, then subtraction of one.",
    givens: ["4(x − 1) = 20"],
    variable: "x",
  },
  "egyenlet-practice-5": {
    calculate: () => q(19 + 5, 7 - 3),
    because: "Collecting terms gives (7 − 3)x = 19 + 5.",
    givens: ["7x − 5 = 3x + 19"],
    variable: "x",
  },
  "egyenlet-practice-6": {
    calculate: () => q((7 - 2) * 3),
    because: "The third of x equals five, so x equals fifteen.",
    givens: ["x/3 + 2 = 7"],
    variable: "x",
  },
  "egyenlet-practice-8": {
    calculate: () => q(3300 - 500, 4),
    because: "Remove the one-off fee before dividing among four equal tickets.",
    givens: ["Négy", "egyszeri 500 Ft", "3 300 Ft", "egy belépő"],
    unit: "Ft",
  },
  "egyenlet-exit-1": {
    calculate: () => sub(q(27, 3), q(4)),
    because: "One x + 4 package is nine, so x is five.",
    givens: ["3(x + 4) = 27"],
    variable: "x",
  },

  "grafikon-practice-1": {
    calculate: () => q(800 + 250 * 4),
    because: "Add the base once to four kilometre charges.",
    givens: ["800 Ft alapdíj", "250 Ft", "4 km-es"],
    unit: "Ft",
  },
  "grafikon-practice-3": {
    calculate: () => q(600 + 400 * 5 - (600 + 400 * 3)),
    because: "The common base cancels when comparing the two complete prices.",
    givens: [
      "600 Ft alapdíj",
      "400 Ft",
      "5 km-es",
      "3 km-es",
      "Hány forinttal",
    ],
    unit: "Ft",
  },
  "grafikon-practice-4": {
    calculate: () => q(3000 - 1200, 300),
    because: "Remove the base, then convert the remaining fee to kilometres.",
    givens: ["1 200 Ft", "300 Ft", "3 000 Ft", "Hány kilométeres"],
    unit: "km",
  },
  "grafikon-practice-6": {
    calculate: () => q(3 * 200),
    because: "Three intervals above zero, each worth 200 Ft.",
    givens: ["0, 200, 400, 600", "harmadik beosztás"],
    unit: "Ft",
  },
  "grafikon-practice-7": {
    calculate: () => q(2 + 5 * 3),
    because: "Five minutes of inflow plus the initially present two litres.",
    givens: [
      "0 perc után 2 liter",
      "Percenként állandóan 3 liter",
      "5 perc után",
      "semmi nem folyik ki",
    ],
    unit: "l",
  },
  "grafikon-exit-1": {
    calculate: () => q(900 + 150 * 6),
    because: "The vertical coordinate is the complete fee, including the base.",
    givens: ["900 Ft az alapdíj", "150 Ft a kilométerdíj", "6 km"],
    unit: "Ft",
  },

  "pitagorasz-practice-1": {
    calculate: () => exactPositiveRoot(3 ** 2 + 4 ** 2),
    because: "The positive hypotenuse squares to 9 + 16.",
    givens: ["derékszögű", "3 cm és 4 cm", "átfogó"],
    unit: "cm",
  },
  "pitagorasz-practice-2": {
    calculate: () => exactPositiveRoot(10 ** 2 - 6 ** 2),
    because: "The missing positive leg squares to 100 − 36.",
    givens: ["derékszögű", "átfogója 10 cm", "befogója 6 cm"],
    unit: "cm",
  },
  "pitagorasz-practice-4": {
    calculate: () => exactPositiveRoot(5 ** 2 + 12 ** 2),
    because:
      "The rectangle diagonal is a hypotenuse, not a perimeter segment sum.",
    givens: ["téglalap", "5 cm és 12 cm", "átlója"],
    unit: "cm",
  },
  "pitagorasz-practice-5": {
    calculate: () => exactPositiveRoot(17 ** 2 - 8 ** 2),
    because: "The missing leg squares to 289 − 64.",
    givens: ["derékszögű", "átfogója 17 cm", "befogója 8 cm"],
    unit: "cm",
  },
  "pitagorasz-practice-7": {
    calculate: () => exactPositiveRoot(10 ** 2 - 6 ** 2),
    because:
      "The ladder is the hypotenuse; the wall is perpendicular to the ground.",
    givens: ["10 méter hosszú", "talajra merőleges", "6 méterre"],
    unit: "m",
  },
  "pitagorasz-practice-8": {
    calculate: () => q(9 ** 2 + 12 ** 2),
    because:
      "The question asks for square area, so no final square root is needed.",
    givens: ["derékszögű", "9 cm és 12 cm", "négyzet területe"],
    unit: "cm²",
  },
  "pitagorasz-exit-1": {
    calculate: () => exactPositiveRoot(15 ** 2 - 9 ** 2),
    because: "The second positive leg squares to 225 − 81.",
    givens: ["derékszögű", "átfogója 15 cm", "befogója 9 cm"],
    unit: "cm",
  },

  "valoszinuseg-practice-1": {
    calculate: () => chance((a, b) => a + b === 2),
    because: "Enumerate all 36 ordered pairs; only (1, 1) qualifies.",
    givens: ["összege 2"],
  },
  "valoszinuseg-practice-2": {
    calculate: () => chance((a, b) => a + b === 8),
    because: "Five of the 36 ordered pairs sum to eight.",
    givens: ["8-as összeg"],
  },
  "valoszinuseg-practice-4": {
    calculate: () => chance((a, b) => a === b),
    because: "The six diagonal cells qualify.",
    givens: ["ugyanazt a számot"],
  },
  "valoszinuseg-practice-5": {
    calculate: () => chance((a, b) => a + b > 10),
    because: "Only (5, 6), (6, 5), and (6, 6) qualify; ten is excluded.",
    givens: ["nagyobb 10-nél"],
  },
  "valoszinuseg-practice-7": {
    calculate: () => q(9, 60),
    because:
      "Observed relative frequency uses the 60 actual trials, not the 36-cell sample space.",
    givens: ["60 dobásos", "9-szer", "relatív gyakorisága"],
  },
  "valoszinuseg-practice-8": {
    calculate: () => chance((a, b) => a + b === 6 || a + b === 7),
    because: "The five sum-six pairs and six sum-seven pairs are disjoint.",
    givens: ["összege 6 vagy 7"],
  },
  "valoszinuseg-exit-1": {
    calculate: () => chance((a, b) => a + b === 9),
    because:
      "The four qualifying pairs are (3, 6), (4, 5), (5, 4), and (6, 3).",
    givens: ["9-es összeg"],
  },
};

interface ChoiceReference {
  correct: string;
  meaning: string;
  because: string;
  witness?: () => boolean;
}

// Reviewed semantic references, including all six predictions. The option ID
// alone is not sufficient: a distinctive part of its meaning is pinned too.
const choiceReferences: Record<string, ChoiceReference> = {
  "tortek-prediction": {
    correct: "between",
    meaning: "kisebb 1-nél",
    because:
      "The sum is above 2/3 but the added quarter does not fill the missing third.",
    witness: () =>
      less(q(2, 3), add(q(2, 3), q(1, 4))) && less(add(q(2, 3), q(1, 4)), q(1)),
  },
  "tortek-practice-3": {
    correct: "sameamount",
    meaning: "Minden harmadot négyfelé osztunk",
    because:
      "Refining both the unit partition and the selected parts preserves 2/3 = 8/12.",
    witness: () => same(q(2, 3), q(8, 12)),
  },
  "tortek-practice-6": {
    correct: "oneandhalf",
    meaning: "3/2 méter",
    because:
      "The halves refer to one-metre and two-metre wholes, so the total is 1/2 + 1 metre.",
    witness: () => same(add(q(1, 2), q(2, 2)), q(3, 2)),
  },
  "tortek-exit-2": {
    correct: "estimate",
    meaning: "A 2/7 kisebb 1/2-nél",
    because: "Adding a positive fifth cannot decrease a half.",
    witness: () =>
      less(q(2, 7), q(1, 2)) && less(q(1, 2), add(q(1, 5), q(1, 2))),
  },
  "szazalek-prediction": {
    correct: "lower",
    meaning: "9 600 Ft",
    because: "10000 × 0.8 × 1.2 = 9600 because the second base is 8000.",
    witness: () => same(mul(mul(q(10000), q(8, 10)), q(12, 10)), q(9600)),
  },
  "szazalek-practice-4": {
    correct: "current",
    meaning: "12 000 Ft",
    because:
      "The second change explicitly applies to the current discounted price.",
  },
  "szazalek-practice-6": {
    correct: "quarter",
    meaning: "25%",
    because: "The required increase is 2000 out of the current base 8000.",
    witness: () => same(mul(q(2000, 8000), q(100)), q(25)),
  },
  "szazalek-exit-2": {
    correct: "first",
    meaning: "a 20 főnek nagyobb része",
    because:
      "Equal increases have different proportional sizes when the starting totals differ.",
    witness: () => less(q(5, 40), q(5, 20)),
  },
  "egyenlet-prediction": {
    correct: "five",
    meaning: "x = 5",
    because: "Substitution gives three packages of seven.",
    witness: () => 3 * (5 + 2) === 21,
  },
  "egyenlet-practice-3": {
    correct: "both",
    meaning: "3x + 6 − 6 = 21 − 6",
    because: "Subtracting six from both sides preserves the original solution.",
  },
  "egyenlet-practice-7": {
    correct: "bracket",
    meaning: "2x + 8",
    because:
      "The factor two multiplies both terms. x = 0 already refutes 2x + 4.",
    witness: () => 2 * (0 + 4) === 2 * 0 + 8 && 2 * (0 + 4) !== 2 * 0 + 4,
  },
  "egyenlet-exit-2": {
    correct: "lost",
    meaning: "bármely x mellett igaz",
    because:
      "x = 1 fails the original equation but satisfies the equation after multiplication by zero.",
    witness: () => 1 + 2 !== 7 && 0 * (1 + 2) === 0 * 7,
  },
  "grafikon-prediction": {
    correct: "less",
    meaning: "1 800 Ft-ról 2 400 Ft-ra",
    because:
      "The fixed fee is paid once for either trip, so doubling distance does not double total price.",
    witness: () => 1200 + 300 * 4 < 2 * (1200 + 300 * 2),
  },
  "grafikon-practice-2": {
    correct: "pair",
    meaning: "3 km-es úthoz 1 550 Ft",
    because:
      "The first coordinate is distance; the second is the total fee, not the increment.",
  },
  "grafikon-practice-5": {
    correct: "noentry",
    meaning: "Nincs alapdíj",
    because:
      "Fee = 400 × distance has constant unit rate and zero starting fee.",
    witness: () =>
      400 * 2 === 2 * (400 * 1) && 1000 + 400 * 2 !== 2 * (1000 + 400 * 1),
  },
  "grafikon-practice-8": {
    correct: "onlya",
    meaning: "Az A;",
    because:
      "Of the specified increasing straight lines, only the one through the origin can be directly proportional.",
  },
  "grafikon-exit-2": {
    correct: "notdouble",
    meaning: "8-nak kellene lennie, de 7",
    because:
      "A doubling of x would require y = 8, contradicting the given y = 7.",
    witness: () => 4 * 2 !== 7,
  },
  "pitagorasz-prediction": {
    correct: "ten",
    meaning: "10 cm",
    because: "The positive hypotenuse has square 36 + 64.",
    witness: () => 10 > 0 && 10 ** 2 === 6 ** 2 + 8 ** 2,
  },
  "pitagorasz-practice-3": {
    correct: "opposite",
    meaning: "derékszöggel szemközti",
    because:
      "Hypotenuse is a geometric role opposite the right angle, invariant under rotation.",
  },
  "pitagorasz-practice-6": {
    correct: "notright",
    meaning: "Nem lehet derékszögű",
    because:
      "If the triangle were right-angled, its longest side would have to satisfy the square-sum relation.",
    witness: () => 9 ** 2 !== 6 ** 2 + 8 ** 2,
  },
  "pitagorasz-exit-2": {
    correct: "missing",
    meaning: "derékszöget zár be",
    because:
      "Sides 3 and 4 alone allow both a 3-4-5 and a non-right 3-4-6 triangle.",
    witness: () =>
      3 + 4 > 6 && 3 + 6 > 4 && 4 + 6 > 3 && 6 ** 2 !== 3 ** 2 + 4 ** 2,
  },
  "valoszinuseg-prediction": {
    correct: "seven",
    meaning: "több dobáspár",
    because: "Six ordered pairs sum to seven; one sums to two.",
    witness: () =>
      less(
        chance((a, b) => a + b === 2),
        chance((a, b) => a + b === 7),
      ),
  },
  "valoszinuseg-practice-3": {
    correct: "pairs",
    meaning: "különböző számú",
    because:
      "Named sums collect unequal numbers of equally likely elementary pairs.",
    witness: () =>
      !same(
        chance((a, b) => a + b === 2),
        chance((a, b) => a + b === 7),
      ),
  },
  "valoszinuseg-practice-6": {
    correct: "unchanged",
    meaning: "Továbbra is 1/6",
    because:
      "The explicitly independent next throw has the same 36 pairs and six favourable pairs.",
    witness: () =>
      same(
        chance((a, b) => a + b === 7),
        q(1, 6),
      ),
  },
  "valoszinuseg-exit-2": {
    correct: "notguaranteed",
    meaning: "egy konkrét sorozatban ettől eltérhet",
    because:
      "Six is an expectation, not a quota. Thirty-six (1,1) throws form a possible sequence with no sevens.",
    witness: () =>
      dicePairs.some(([a, b]) => a === 1 && b === 1) &&
      Array.from({ length: 36 }, () => [1, 1]).every(([a, b]) => a + b !== 7),
  },
};

test("six complete local lessons have 48 practices, 12 exit tasks, six predictions, and unique IDs", () => {
  assert.equal(lessons.length, 6);
  assert.deepEqual(
    lessons.map((lesson) => lesson.id),
    topics,
  );
  assert.deepEqual(Object.keys(lessonById).sort(), [...topics].sort());
  assert.equal(
    lessons.reduce((sum, lesson) => sum + lesson.practice.length, 0),
    48,
  );
  assert.equal(
    lessons.reduce((sum, lesson) => sum + lesson.exit.length, 0),
    12,
  );
  assert.equal(allExercises.length, 66);
  assert.equal(new Set(allExercises.map((item) => item.id)).size, 66);
  for (const lesson of lessons) {
    assert.equal(lessonById[lesson.id], lesson, lesson.id);
    assert.equal(lesson.practice.length, 8, lesson.id);
    assert.equal(lesson.exit.length, 2, lesson.id);
    assert.equal(lesson.prediction.answer.kind, "choice", lesson.id);
    assert.ok(
      lesson.practice.filter((item) => item.answer.kind === "choice").length >=
        2,
      lesson.id,
    );
    for (const item of [lesson.prediction, ...lesson.practice, ...lesson.exit])
      assert.equal(item.topic, lesson.id, item.id);
    if (lesson.nextTopic) assert.ok(lessonById[lesson.nextTopic], lesson.id);
  }
});

test("each lesson and exercise carries the agreed explanatory and feedback support", () => {
  const nonempty = (value: string, label: string) =>
    assert.ok(typeof value === "string" && value.trim().length > 0, label);
  for (const lesson of lessons) {
    assert.ok(
      lesson.explanation.length >= 4 && lesson.explanation.length <= 6,
      lesson.id,
    );
    assert.equal(lesson.examples.length, 2, lesson.id);
    assert.ok(
      lesson.glossary.length >= 3 && lesson.glossary.length <= 5,
      lesson.id,
    );
    assert.ok(lesson.recap.length >= 3, lesson.id);
    assert.ok(
      lesson.goals.length > 0 && lesson.prerequisites.length > 0,
      lesson.id,
    );
    for (const block of lesson.explanation) {
      nonempty(block.heading, lesson.id);
      nonempty(block.body, lesson.id);
    }
    for (const example of lesson.examples) {
      nonempty(example.prompt, lesson.id);
      nonempty(example.check, lesson.id);
      assert.ok(example.steps.length >= 2, lesson.id);
      for (const step of [...example.steps, ...(example.alternative ?? [])]) {
        nonempty(step.expression, lesson.id);
        nonempty(step.why, lesson.id);
      }
    }
  }
  for (const item of allExercises) {
    assert.ok(item.hints.length >= 2 && item.hints.length <= 3, item.id);
    assert.ok(item.solution.length >= 2 && item.solution.length <= 4, item.id);
    for (const hint of item.hints) nonempty(hint, item.id);
    for (const step of item.solution) {
      nonempty(step.expression, item.id);
      nonempty(step.why, item.id);
    }
    nonempty(item.takeaway, item.id);
    assert.ok(
      item.mistakes && item.mistakes.length >= 1 && item.mistakes.length <= 2,
      item.id,
    );
  }
  // Mathematical comparison signs are fine; HTML/JSX tags are not content.
  assert.doesNotMatch(JSON.stringify(lessons), /<\/?[A-Za-z][^>]*>/u);
});

test("all 41 fixed numeric answers match independent calculations bound to the visible problem data", () => {
  const numeric = allExercises.filter((item) => item.answer.kind === "number");
  assert.equal(numeric.length, 41);
  assert.equal(Object.keys(numericReferences).length, 41);
  assert.deepEqual(
    numeric.map((item) => item.id).sort(),
    Object.keys(numericReferences).sort(),
  );
  for (const item of numeric) {
    assert.equal(item.answer.kind, "number", item.id);
    if (item.answer.kind !== "number") assert.fail(item.id);
    const reference = numericReferences[item.id];
    assertFragments(item.prompt, reference.givens, item.id);
    assertSame(
      readAuthoredNumber(item.answer.expected),
      reference.calculate(),
      `${item.id}: ${reference.because}`,
    );
    assert.equal(
      item.answer.unit,
      reference.unit,
      `${item.id}: physical answer unit`,
    );
    assert.equal(
      item.answer.variable,
      reference.variable,
      `${item.id}: variable notation`,
    );
    assert.ok(
      item.answer.tolerance === undefined || item.answer.tolerance === 0,
      `${item.id}: fixed exact task must not accept a guessed decimal`,
    );
  }
});

test("all 25 choice answers, including predictions, match reviewed semantic references and witnesses", () => {
  const choices = allExercises.filter((item) => item.answer.kind === "choice");
  assert.equal(choices.length, 25);
  assert.deepEqual(
    choices.map((item) => item.id).sort(),
    Object.keys(choiceReferences).sort(),
  );
  for (const item of choices) {
    assert.equal(item.answer.kind, "choice", item.id);
    if (item.answer.kind !== "choice") assert.fail(item.id);
    const reference = choiceReferences[item.id];
    const optionIds = item.answer.options.map((option) => option.id);
    assert.equal(new Set(optionIds).size, optionIds.length, item.id);
    assert.equal(
      item.answer.correct,
      reference.correct,
      `${item.id}: ${reference.because}`,
    );
    const correctOption = item.answer.options.find(
      (option) => option.id === reference.correct,
    );
    assert.ok(correctOption, item.id);
    assertFragments(correctOption.text, [reference.meaning], item.id);
    if (reference.witness)
      assert.equal(
        reference.witness(),
        true,
        `${item.id}: independent mathematical witness`,
      );
  }
});

test("the production grader accepts independently derived numeric and choice references", () => {
  for (const [id, reference] of Object.entries(numericReferences)) {
    const item = exercise(id);
    const input = asText(reference.calculate());
    assert.equal(
      gradeAnswer(item, input).status,
      "correct",
      `${id}: independently calculated input ${input}`,
    );
    if (reference.unit)
      assert.equal(
        gradeAnswer(item, `${input} ${reference.unit}`).status,
        "correct",
        `${id}: explicit unit`,
      );
    if (reference.variable)
      assert.equal(
        gradeAnswer(item, `${reference.variable} = ${input}`).status,
        "correct",
        `${id}: explicit variable`,
      );
  }
  for (const [id, reference] of Object.entries(choiceReferences)) {
    assert.equal(
      gradeAnswer(exercise(id), reference.correct).status,
      "correct",
      id,
    );
  }
});

test("every authored diagnostic mistake is independently wrong and rejected with its intended feedback", () => {
  let checked = 0;
  for (const item of allExercises) {
    for (const mistake of item.mistakes ?? []) {
      checked += 1;
      if (item.answer.kind === "number") {
        const wrong = readAuthoredNumber(mistake.input);
        assert.equal(
          same(wrong, numericReferences[item.id].calculate()),
          false,
          `${item.id}: diagnostic is mathematically correct: ${mistake.input}`,
        );
        // Equivalent fraction spellings must not accidentally become accepted.
        const equivalentWrong = `${wrong.n * 2n}/${wrong.d * 2n}`;
        const alternativeResult = gradeAnswer(item, equivalentWrong);
        assert.equal(
          alternativeResult.status,
          "incorrect",
          `${item.id}: ${equivalentWrong}`,
        );
        assert.equal(
          alternativeResult.message,
          mistake.feedback,
          `${item.id}: equivalent diagnostic feedback`,
        );
      } else {
        assert.notEqual(
          mistake.input,
          choiceReferences[item.id].correct,
          item.id,
        );
        assert.ok(
          item.answer.options.some((option) => option.id === mistake.input),
          item.id,
        );
      }
      const result = gradeAnswer(item, mistake.input);
      assert.equal(result.status, "incorrect", `${item.id}: ${mistake.input}`);
      assert.equal(result.correct, false, item.id);
      assert.equal(
        result.message,
        mistake.feedback,
        `${item.id}: intended diagnostic message`,
      );
    }
  }
  assert.equal(checked, 132);
});

test("the fixed models retain their explicit units, right-angle conditions, and independent fair-dice assumptions", () => {
  assert.equal(dicePairs.length, 36);
  assert.equal(new Set(dicePairs.map(([a, b]) => `${a},${b}`)).size, 36);
  for (const item of allExercises.filter(
    (item) => item.topic === "valoszinuseg",
  )) {
    assertFragments(
      item.context ?? "",
      [
        "megkülönböztethető",
        "független",
        "szabályos hatoldalú",
        "egymást követő dobások is függetlenek",
      ],
      item.id,
    );
    if (item.answer.kind === "number") {
      const value = numericReferences[item.id].calculate();
      assert.ok(
        !less(value, q(0)) && !less(q(1), value),
        `${item.id}: probability/frequency in [0, 1]`,
      );
    }
  }
  for (const [id, reference] of Object.entries(numericReferences).filter(
    ([id]) => id.startsWith("pitagorasz-"),
  )) {
    assert.ok(
      less(q(0), reference.calculate()),
      `${id}: positive length or area`,
    );
    assert.ok(["cm", "m", "cm²"].includes(reference.unit ?? ""), id);
  }
  assert.equal(exercise("pitagorasz-practice-8").answer.kind, "number");
  assertFragments(
    exercise("pitagorasz-practice-8").prompt,
    ["négyzet területe"],
    "area versus side length",
  );
  assertFragments(
    exercise("pitagorasz-exit-2").prompt,
    ["Nem ismerünk szöget"],
    "missing right-angle condition",
  );
  assertFragments(
    exercise("szazalek-practice-7").prompt,
    ["az új árra"],
    "changed percentage base",
  );
  assertFragments(
    exercise("tortek-practice-8").prompt,
    ["hosszak arányát", "nem levágható egész darabok"],
    "ratio versus whole-piece count",
  );
});

test("all twelve worked examples retain independently recalculated results and the original givens", () => {
  interface ExampleReference {
    topic: TopicId;
    index: number;
    givens: string[];
    calculate: () => Q;
    renderedResult: (value: string) => string;
  }
  const references: ExampleReference[] = [
    {
      topic: "tortek",
      index: 0,
      givens: ["2/3 + 1/4"],
      calculate: () => add(q(2, 3), q(1, 4)),
      renderedResult: (v) => `8/12 + 3/12 = ${v}`,
    },
    {
      topic: "tortek",
      index: 1,
      givens: ["3/4 méteres", "1/8 méteres"],
      calculate: () => div(q(3, 4), q(1, 8)),
      renderedResult: (v) => `(6/8 m) : (1/8 m) = ${v}`,
    },
    {
      topic: "szazalek",
      index: 0,
      givens: ["20% kedvezmény után 8 000 Ft"],
      calculate: () => div(q(8000), q(4, 5)),
      renderedResult: (v) => `8 000 : 0,8 = ${v} Ft`,
    },
    {
      topic: "szazalek",
      index: 1,
      givens: ["24 fős", "6-an"],
      calculate: () => mul(q(6, 24), q(100)),
      renderedResult: (v) => `0,25 · 100 = ${v}%`,
    },
    {
      topic: "egyenlet",
      index: 0,
      givens: ["3(x + 2) = 21"],
      calculate: () => sub(q(21, 3), q(2)),
      renderedResult: (v) => `x = ${v}`,
    },
    {
      topic: "egyenlet",
      index: 1,
      givens: ["4x + 3 = 2x + 15"],
      calculate: () => q(15 - 3, 4 - 2),
      renderedResult: (v) => `x = ${v}`,
    },
    {
      topic: "grafikon",
      index: 0,
      givens: ["1 200 Ft", "300 Ft", "4 km-es"],
      calculate: () => q(1200 + 300 * 4),
      renderedResult: (v) => `(4; ${v})`,
    },
    {
      topic: "grafikon",
      index: 1,
      givens: ["2 liter", "3 liter", "4 perc után"],
      calculate: () => q(2 + 3 * 4),
      renderedResult: (v) => `(4; ${v})`,
    },
    {
      topic: "pitagorasz",
      index: 0,
      givens: ["derékszögű", "6 cm és 8 cm"],
      calculate: () => exactPositiveRoot(6 ** 2 + 8 ** 2),
      renderedResult: (v) => `c = ${v} cm`,
    },
    {
      topic: "pitagorasz",
      index: 1,
      givens: ["átfogó 13 cm", "befogó 5 cm"],
      calculate: () => exactPositiveRoot(13 ** 2 - 5 ** 2),
      renderedResult: (v) => `b = ${v} cm`,
    },
    {
      topic: "valoszinuseg",
      index: 0,
      givens: ["független", "szabályos hatoldalú", "7-es összeg"],
      calculate: () => chance((a, b) => a + b === 7),
      renderedResult: (v) => `6/36 = ${v}`,
    },
    {
      topic: "valoszinuseg",
      index: 1,
      givens: ["100 dobásból 18-szor"],
      calculate: () => q(18, 100),
      renderedResult: (v) => `18/100 = ${v}`,
    },
  ];
  assert.equal(references.length, 12);
  for (const reference of references) {
    const example = lessonById[reference.topic].examples[reference.index];
    const label = `${reference.topic}: worked example ${reference.index + 1}`;
    assertFragments(example.prompt, reference.givens, label);
    const actualDisplayedSteps = compactMath(
      example.steps.map((step) => step.expression).join("\n"),
    );
    const independentResult = compactMath(
      reference.renderedResult(asText(reference.calculate())),
    );
    assert.ok(
      actualDisplayedSteps.includes(independentResult),
      `${label}: independently calculated result ${independentResult} is not displayed`,
    );
  }
});

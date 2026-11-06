import test from "node:test";
import assert from "node:assert/strict";
import {
  foundationLessons,
  foundationManuscriptMap,
} from "../src/content/foundations.ts";
import {
  foundationGeneratorFamilies,
  generateFoundationExercise,
} from "../src/math/foundation-generators.ts";
import { gradeAnswer, normalizeExpression } from "../src/math/engine.ts";
import type {
  AnswerSpec,
  Exercise,
  ScalarAnswerSpec,
  TopicId,
} from "../src/types.ts";

// Independent arithmetic: no generator state, authored expected values or
// production rational helpers participate in the reference calculations.
interface Q {
  n: bigint;
  d: bigint;
  unit?: string;
}
const q = (n: number | bigint, d: number | bigint = 1): Q => ({
  n: BigInt(n),
  d: BigInt(d),
});
const add = (a: Q, b: Q): Q => q(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a: Q, b: Q): Q => q(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a: Q, b: Q): Q => q(a.n * b.n, a.d * b.d);
const div = (a: Q, b: Q): Q => {
  assert.notEqual(b.n, 0n);
  return q(a.n * b.d, a.d * b.n);
};
const negative = (a: Q): Q => q(-a.n, a.d);
const absolute = (a: Q): Q => q(a.n < 0n ? -a.n : a.n, a.d);
const compare = (a: Q, b: Q) =>
  a.n * b.d < b.n * a.d ? -1 : a.n * b.d > b.n * a.d ? 1 : 0;
const same = (a: Q, b: Q) => compare(a, b) === 0;
const u = (a: Q, unit: string): Q => ({ ...a, unit });
function read(text: string): Q {
  const source = text.replace(/−/g, "-").replace(/,/g, ".").trim();
  if (source.includes("/")) {
    const [a, b, ...rest] = source.split("/");
    assert.equal(rest.length, 0);
    return div(read(a), read(b));
  }
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(source);
  assert.ok(match, `independent literal reader: ${text}`);
  const fraction = match[3] ?? "";
  return q(
    (match[1] ? -1n : 1n) * BigInt(match[2] + fraction),
    10n ** BigInt(fraction.length),
  );
}
const text = (value: Q) => `${value.n}/${value.d}`;
const classify = (value: Q) =>
  value.n % value.d !== 0n ? "rational" : value.n < 0n ? "integer" : "natural";
type Expected = Q | string;
interface Reference {
  givens: string[];
  answers: Expected | Record<string, Expected>;
}
const fixed: Record<string, Reference> = {};
function addReferences(
  topic: TopicId,
  rows: Record<string, [string[], Expected | Record<string, Expected>]>,
) {
  for (const [suffix, [givens, answers]] of Object.entries(rows))
    fixed[`${topic}-${suffix}`] = { givens, answers };
}

const sortedNumbers = [q(-12, 10), q(-3, 2), q(0), q(-1, 4), q(1)].sort(
  compare,
);
addReferences("szamfogalom", {
  prediction: [["−3", "−8"], "b"],
  "practice-1": [
    ["−6", "0", "3/2", "−0,75", "4", "8/4", "legszűkebb"],
    {
      minus6: classify(q(-6)),
      zero: classify(q(0)),
      threehalves: classify(q(3, 2)),
      decimal: classify(q(-75, 100)),
      four: classify(q(4)),
      eightfourths: classify(q(8, 4)),
    },
  ],
  "practice-2": [
    ["−1,2", "−3/2", "−1/4", "növekvő"],
    Object.fromEntries(sortedNumbers.map((v, i) => [`place${i + 1}`, v])),
  ],
  "practice-3": [
    ["−7", "2,5", "0", "−|−7|"],
    {
      oppositeMinus7: negative(q(-7)),
      absMinus7: absolute(q(-7)),
      oppositePositive: negative(q(25, 10)),
      absPositive: absolute(q(25, 10)),
      oppositeZero: negative(q(0)),
      absZero: absolute(q(0)),
      outsideMinus: negative(absolute(q(-7))),
    },
  ],
  "practice-4": [
    ["−6", "4", "1 cm", "felezőpont"],
    {
      distance: u(sub(q(4), q(-6)), "cm"),
      midpoint: div(add(q(-6), q(4)), q(2)),
    },
  ],
  "practice-5": [
    ["−8 + 13", "6 + (−11)", "−4 + (−9)"],
    {
      a: add(q(-8), q(13)),
      aDirection: "right",
      b: add(q(6), q(-11)),
      bDirection: "left",
      c: add(q(-4), q(-9)),
      cDirection: "left",
    },
  ],
  "practice-6": [
    ["5 − (−7)", "−5 − 7", "−5 − (−7)"],
    { a: sub(q(5), q(-7)), b: sub(q(-5), q(7)), c: sub(q(-5), q(-7)) },
  ],
  "practice-7": [
    ["(−6) × 4", "(−6) × (−4)", "36 : (−9)", "(−36) : (−9)"],
    {
      a: mul(q(-6), q(4)),
      b: mul(q(-6), q(-4)),
      c: div(q(36), q(-9)),
      d: div(q(-36), q(-9)),
    },
  ],
  "practice-8": [
    ["−3/4 + 1/2", "−1,2 − (−0,7)"],
    { a: add(q(-3, 4), q(1, 2)), b: sub(q(-12, 10), q(-7, 10)) },
  ],
  "practice-9": [
    ["x + 7 = −2", "−4 + y = 6", "5 − z = 9"],
    { x: sub(q(-2), q(7)), y: sub(q(6), q(-4)), z: sub(q(5), q(9)) },
  ],
  "practice-10": [
    ["−3 °C", "8 °C", "6 °C", "változás"],
    {
      evening: u(sub(add(q(-3), q(8)), q(6)), "°C"),
      change: u(sub(q(8), q(6)), "°C"),
    },
  ],
  "practice-11": [
    ["−9 < −4", "|−9| < |−4|"],
    {
      order: "lt",
      abs9: absolute(q(-9)),
      abs4: absolute(q(-4)),
      distanceOrder: "gt",
    },
  ],
  "practice-12": [
    ["0 : (−8)", "8 : 0", "0 : 0", "(−8) × 0"],
    { a: div(q(0), q(-8)), b: "none", c: "ambiguous", d: mul(q(-8), q(0)) },
  ],
  "exit-1": [
    ["−2,4 + 0,9 − (−1,8)", "nullát"],
    {
      value: sub(add(q(-24, 10), q(9, 10)), q(-18, 10)),
      sign: "positive",
      crossing: "second",
    },
  ],
  "exit-2": [
    ["−3", "5", "−7", "1 méter", "AC"],
    {
      largest: "b",
      farthest: "c",
      distance: u(absolute(sub(q(-3), q(-7))), "m"),
    },
  ],
});
addReferences("muveleti-sorrend", {
  prediction: [["18 − 6 : 3"], "b"],
  "practice-1": [
    ["7 + 5 × 3"],
    { first: "multiply", value: add(q(7), mul(q(5), q(3))) },
  ],
  "practice-2": [
    ["36 : 6 × 3", "24 : 3 : 2", "12 × 3 : 6"],
    {
      a: mul(div(q(36), q(6)), q(3)),
      b: div(div(q(24), q(3)), q(2)),
      c: div(mul(q(12), q(3)), q(6)),
    },
  ],
  "practice-3": [
    ["20 − 8 + 3", "20 − (8 + 3)"],
    {
      a: add(sub(q(20), q(8)), q(3)),
      b: sub(q(20), add(q(8), q(3))),
      difference: mul(q(2), q(3)),
    },
  ],
  "practice-4": [
    ["42 − 24 : 6 + 3 × 5", "két különböző"],
    {
      division: "24:6",
      multiplication: "3*5",
      value: add(sub(q(42), div(q(24), q(6))), mul(q(3), q(5))),
    },
  ],
  "practice-5": [["3 × [8 − (5 − 2)]"], mul(q(3), sub(q(8), sub(q(5), q(2))))],
  "practice-6": [
    ["A = −5²", "B = (−5)²", "A + B"],
    { a: negative(mul(q(5), q(5))), b: mul(q(-5), q(-5)), sum: q(0) },
  ],
  "practice-7": [
    ["1,5 + 0,8 × 5", "(1,5 + 0,8) × 5"],
    {
      a: add(q(15, 10), mul(q(8, 10), q(5))),
      b: mul(add(q(15, 10), q(8, 10)), q(5)),
      difference: mul(q(15, 10), sub(q(5), q(1))),
    },
  ],
  "practice-8": [
    ["(1/2) + (3/4) × (2/3)"],
    add(q(1, 2), mul(q(3, 4), q(2, 3))),
  ],
  "practice-9": [
    ["28 − 12 : 4 = 16 : 4 = 4"],
    {
      error: "first",
      quotient: div(q(12), q(4)),
      value: sub(q(28), div(q(12), q(4))),
    },
  ],
  "practice-10": [
    ["8 − 2 × 3", "18", "2", "sorrendjét"],
    { eighteen: "(8-2)*3", two: "8-(2*3)" },
  ],
  "practice-11": [
    ["(15 − 3) : (7 − 7)"],
    {
      numerator: sub(q(15), q(3)),
      denominator: sub(q(7), q(7)),
      defined: "undefined",
    },
  ],
  "practice-12": [
    ["Három", "450 Ft", "200 Ft", "150 Ft", "egyetlen"],
    {
      model: "3*450+200-150",
      cost: u(sub(add(mul(q(3), q(450)), q(200)), q(150)), "Ft"),
    },
  ],
  "exit-1": [
    ["32 − 3 × (5 − 1) + 18 : 6"],
    {
      bracket: "5-1",
      division: "18:6",
      value: add(sub(q(32), mul(q(3), sub(q(5), q(1)))), div(q(18), q(6))),
    },
  ],
  "exit-2": [
    ["−2² + (−2)² + 12 : (7 − 4)"],
    {
      first: negative(mul(q(2), q(2))),
      second: mul(q(-2), q(-2)),
      value: div(q(12), sub(q(7), q(4))),
    },
  ],
});
addReferences("aranyossag", {
  prediction: [
    ["kétszeres", "500 Ft", "200 Ft/km", "téglalap"],
    { rope: q(2), time: div(q(1), q(2)), fee: "no", area: mul(q(2), q(2)) },
  ],
  "practice-1": [
    [
      "3 piros",
      "9 fehér",
      "6 piros, 18 fehér",
      "5 piros, 11 fehér",
      "4 piros, 12 fehér",
    ],
    {
      a: same(q(3, 9), q(6, 18)) ? "yes" : "no",
      b: same(q(3, 9), q(5, 11)) ? "yes" : "no",
      c: same(q(3, 9), q(4, 12)) ? "yes" : "no",
    },
  ],
  "practice-2": [
    ["4,5 kg", "1800 Ft", "1,75 kg", "kedvezmény"],
    {
      unitPrice: u(div(q(1800), q(45, 10)), "Ft/kg"),
      price: u(mul(div(q(1800), q(45, 10)), q(175, 100)), "Ft"),
    },
  ],
  "practice-3": [
    [
      "3 perc",
      "72",
      "8 perc",
      "192",
      "0 perc",
      "5 perc",
      "indulási késés nincs",
    ],
    {
      zero: u(q(0), "oldal"),
      five: u(mul(q(5), div(q(72), q(3))), "oldal"),
      rate: u(div(q(192), q(8)), "oldal/perc"),
    },
  ],
  "practice-4": [
    ["500 Ft", "200 Ft/km", "2 km", "4 km"],
    {
      two: u(add(q(500), mul(q(2), q(200))), "Ft"),
      four: u(add(q(500), mul(q(4), q(200))), "Ft"),
      model: "neither",
      proportionalPart: "variable",
    },
  ],
  "practice-5": [
    ["Hat", "10 óra", "négy", "szabadon felosztható"],
    u(div(mul(q(6), q(10)), q(4)), "óra"),
  ],
  "practice-6": [
    ["Négy", "15 óra", "8 órás", "egész"],
    {
      machines: u(q(Math.ceil((4 * 15) / 8)), "db"),
      time: u(q(4 * 15, Math.ceil((4 * 15) / 8)), "óra"),
    },
  ],
  "practice-7": [
    ["90 km", "45 km/h", "60 km/h", "megállás nincs"],
    {
      slow: u(div(q(90), q(45)), "óra"),
      fast: u(div(q(90), q(60)), "óra"),
      model: "inverse",
    },
  ],
  "practice-8": [
    ["60 oldalból", "10-et", "1, 2 és 3 óránál"],
    {
      pages1: u(q(60 - 10), "oldal"),
      product1: q(1 * (60 - 10)),
      pages2: u(q(60 - 2 * 10), "oldal"),
      product2: q(2 * (60 - 2 * 10)),
      pages3: u(q(60 - 3 * 10), "oldal"),
      product3: q(3 * (60 - 3 * 10)),
      model: "neither",
    },
  ],
  "practice-9": [
    ["7200 Ft", "3 : 5"],
    { paper: u(q(7200 * 3, 3 + 5), "Ft"), paint: u(q(7200 * 5, 3 + 5), "Ft") },
  ],
  "practice-10": [
    ["1 : 25 000", "3,6 cm", "egyenes"],
    {
      metres: u(q(36 * 25000, 10 * 100), "m"),
      kilometres: u(q(36 * 25000, 10 * 100 * 1000), "km"),
    },
  ],
  "practice-11": [
    ["4 cm × 6 cm", "kétszerezzük"],
    {
      oldPerimeter: u(q(2 * (4 + 6)), "cm"),
      newPerimeter: u(q(2 * (8 + 12)), "cm"),
      perimeterFactor: q(2 * (8 + 12), 2 * (4 + 6)),
      oldArea: u(q(4 * 6), "cm²"),
      newArea: u(q(8 * 12), "cm²"),
      areaFactor: q(8 * 12, 4 * 6),
    },
  ],
  "practice-12": [
    ["Három diák", "két óra", "Hat", "6 diákóra", "1 óra", "3 diákóra"],
    {
      certain: "no",
      modelOne3: u(q(6, 3), "óra"),
      modelOne6: u(q(6, 6), "óra"),
      modelTwo3: u(add(q(1), q(3, 3)), "óra"),
      modelTwo6: u(add(q(1), q(3, 6)), "óra"),
    },
  ],
  "exit-1": [
    ["Hat", "1740 Ft", "tizenegy", "külön díj nélkül"],
    { price: u(q(1740 * 11, 6), "Ft"), model: "direct" },
  ],
  "exit-2": [
    ["Öt", "20 perc", "nyolcnak", "várakozás nélkül"],
    {
      minutes: u(q(5 * 20, 8), "perc"),
      wholeMinutes: u(q(Math.floor((5 * 20) / 8)), "perc"),
      seconds: u(
        mul(sub(q(5 * 20, 8), q(Math.floor((5 * 20) / 8))), q(60)),
        "s",
      ),
      model: "inverse",
    },
  ],
});
addReferences("mertekegysegek", {
  prediction: [
    ["2,4 m", "1 dm", "1 cm", "Fél óra"],
    {
      length: u(q(24 * 100, 10), "cm"),
      changes: "no",
      squares: q(10 * 10),
      cubes: q(10 * 10 * 10),
      minutes: u(q(60, 2), "perc"),
    },
  ],
  "practice-1": [
    ["3,7 m", "45 mm", "0,08 km"],
    {
      a: u(q(37 * 100, 10), "cm"),
      b: u(q(45, 10), "cm"),
      c: u(q(8 * 1000, 100), "m"),
    },
  ],
  "practice-2": [
    ["5 m", "2 m 35 cm", "1 m 80 cm"],
    u(q(5 * 100 - (2 * 100 + 35) - (100 + 80)), "cm"),
  ],
  "practice-3": [
    ["0,7 m", "65 cm", "720 mm", "milliméterben"],
    {
      smallest: u(q(65 * 10), "mm"),
      middle: u(q(7 * 1000, 10), "mm"),
      largest: u(q(720), "mm"),
      rawEnough: "no",
    },
  ],
  "practice-4": [
    ["1,8 m²", "180 cm²"],
    { factor: u(q(100 * 100), "cm²"), area: u(q(18 * 100 * 100, 10), "cm²") },
  ],
  "practice-5": [
    ["180 cm × 1,2 m", "kerületre", "terület"],
    {
      perimeter: u(mul(q(2), add(q(180, 100), q(12, 10))), "m"),
      area: u(mul(q(180, 100), q(12, 10)), "m²"),
    },
  ],
  "practice-6": [
    ["0,006 m³", "2400 cm³", "0,75 L"],
    {
      a: u(q(6 * 1000, 1000), "L"),
      aGreater: "yes",
      b: u(q(2400, 1000), "L"),
      bGreater: "yes",
      c: u(q(75 * 1000, 100), "cm³"),
      cGreater: "no",
    },
  ],
  "practice-7": [
    ["40 cm", "25 cm", "12 cm", "belső"],
    u(q(40 * 25 * 12, 1000), "L"),
  ],
  "practice-8": [
    ["1,5 kg", "120 g", "teljes"],
    {
      packages: u(q(Math.floor(1500 / 120)), "db"),
      remaining: u(q(1500 - Math.floor(1500 / 120) * 120), "g"),
    },
  ],
  "practice-9": [
    ["1,35 óra", "1 óra 35 perc"],
    {
      decimal: u(q(135 * 60, 100), "perc"),
      clock: u(q(60 + 35), "perc"),
      difference: u(sub(q(60 + 35), q(135 * 60, 100)), "perc"),
      longer: "clock",
    },
  ],
  "practice-10": [
    ["72 km/h", "250 métert", "állandó"],
    {
      speed: u(q(72 * 1000, 3600), "m/s"),
      time: u(div(q(250), q(72 * 1000, 3600)), "s"),
    },
  ],
  "practice-11": [
    ["2 cm", "4 cm", "hat azonos"],
    {
      surfaceSmall: u(q(6 * 2 ** 2), "cm²"),
      surfaceLarge: u(q(6 * 4 ** 2), "cm²"),
      volumeSmall: u(q(2 ** 3), "cm³"),
      volumeLarge: u(q(4 ** 3), "cm³"),
      edgeFactor: q(4, 2),
      surfaceFactor: q(6 * 4 ** 2, 6 * 2 ** 2),
      volumeFactor: q(4 ** 3, 2 ** 3),
    },
  ],
  "practice-12": [
    ["2 L", "2 kg", "0,8 kg", "edény tömegét nem"],
    { automatic: "no", mass: u(q(2 * 8, 10), "kg") },
  ],
  "exit-1": [
    ["1,4 m", "90 cm", "cm²"],
    {
      perimeter: u(mul(q(2), add(q(14, 10), q(90, 100))), "m"),
      area: u(mul(q(140), q(90)), "cm²"),
    },
  ],
  "exit-2": [
    ["20 cm × 15 cm × 30 cm", "Öt", "1,5 L", "belső"],
    {
      capacity: u(q(20 * 15 * 30, 1000), "L"),
      full: "no",
      remaining: u(sub(q(20 * 15 * 30, 1000), q(5 * 15, 10)), "L"),
    },
  ],
});

const exercises = foundationLessons.flatMap((lesson) => [
  lesson.prediction,
  ...lesson.practice,
  ...lesson.exit,
]);
const allIds = exercises.map((exercise) => exercise.id);
function raw(value: Expected) {
  return typeof value === "string" ? value : text(value);
}
function scalarReference(
  spec: ScalarAnswerSpec,
  expected: Expected,
  label: string,
) {
  if (typeof expected !== "string") {
    assert.equal(spec.kind, "number", label);
    if (spec.kind !== "number") return;
    assert.ok(
      same(read(spec.expected), expected),
      `${label}: independent reference ${text(expected)} ≠ authored ${spec.expected}`,
    );
    assert.equal(spec.unit, expected.unit, `${label}: answer unit`);
    assert.ok(
      spec.tolerance === undefined || spec.tolerance === 0,
      `${label}: exact result`,
    );
  } else if (spec.kind === "choice") {
    assert.equal(spec.correct, expected, label);
    assert.equal(
      new Set(spec.options.map((option) => option.id)).size,
      spec.options.length,
      label,
    );
    assert.ok(
      spec.options.some(
        (option) => option.id === expected && option.text.length > 0,
      ),
      label,
    );
  } else {
    assert.equal(spec.kind, "expression", label);
    if (spec.kind !== "expression") return;
    assert.ok(
      spec.accepted.some(
        (value) => normalizeExpression(value) === normalizeExpression(expected),
      ),
      label,
    );
  }
}
function checkReference(exercise: Exercise, reference: Reference) {
  for (const given of reference.givens)
    assert.ok(
      exercise.prompt.toLowerCase().includes(given.toLowerCase()),
      `${exercise.id}: visible data ${given}`,
    );
  const spec = exercise.answer;
  let input: string;
  if (spec.kind === "parts") {
    const answers = reference.answers as Record<string, Expected>;
    assert.deepEqual(
      spec.parts.map((part) => part.id).sort(),
      Object.keys(answers).sort(),
      `${exercise.id}: all subquestions covered`,
    );
    for (const part of spec.parts)
      scalarReference(
        part.answer,
        answers[part.id],
        `${exercise.id}/${part.id}`,
      );
    input = JSON.stringify(
      Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [key, raw(value)]),
      ),
    );
  } else {
    const expected = reference.answers as Expected;
    scalarReference(spec, expected, exercise.id);
    input = raw(expected);
  }
  const result = gradeAnswer(exercise, input);
  assert.equal(
    result.correct,
    true,
    `${exercise.id}: independent response must pass: ${JSON.stringify(result)}`,
  );
  return input;
}

test("four manuscripts preserve 48 exercises, 8 exits, 8 examples and every numbered task", () => {
  assert.equal(foundationLessons.length, 4);
  assert.equal(exercises.length, 60);
  assert.equal(new Set(allIds).size, 60);
  assert.deepEqual(Object.keys(fixed).sort(), allIds.slice().sort());
  assert.equal(foundationManuscriptMap.length, 60);
  assert.equal(
    new Set(foundationManuscriptMap.map((row) => row.manuscriptId)).size,
    60,
  );
  assert.equal(
    foundationManuscriptMap.reduce((sum, row) => sum + row.answerFields, 0),
    187,
  );
  for (const lesson of foundationLessons) {
    assert.equal(lesson.practice.length, 12, lesson.id);
    assert.equal(lesson.exit.length, 2, lesson.id);
    assert.equal(lesson.examples.length, 2, lesson.id);
    assert.ok(lesson.explanation.length >= 8, lesson.id);
    assert.ok(
      lesson.explanation.some(
        (block) =>
          /[öÖ]t/.test(block.heading) && (block.bullets?.length ?? 0) >= 5,
      ),
      lesson.id,
    );
    for (const task of [
      lesson.prediction,
      ...lesson.practice,
      ...lesson.exit,
    ]) {
      assert.equal(task.topic, lesson.id);
      assert.ok(task.manuscriptId);
      assert.equal(task.hints.length, 2);
      assert.ok(task.solution.length >= 2);
      assert.ok(task.takeaway.length > 15);
      if (task.answer.kind === "parts") {
        assert.ok(
          task.answer.parts.length > 1 && task.answer.parts.length <= 16,
        );
        assert.equal(
          new Set(task.answer.parts.map((part) => part.id)).size,
          task.answer.parts.length,
        );
      }
    }
  }
  assert.doesNotMatch(JSON.stringify(foundationLessons), /<\/?[A-Za-z][^>]*>/u);
});

test("all 187 fixed answer fields match independent calculations or reviewed semantic references", () => {
  for (const task of exercises) checkReference(task, fixed[task.id]);
  // Semantic witnesses for the central counterexamples, not only choice IDs.
  assert.equal(compare(q(-8), q(-3)), -1);
  assert.equal(compare(absolute(q(-8)), absolute(q(-3))), 1);
  assert.notEqual((24 / 6) * 2, 24 / (6 * 2));
  assert.equal(5 * 2 + 3 * 4, 3 * 4 + 5 * 2);
  assert.notEqual(500 + 4 * 200, 2 * (500 + 2 * 200));
  assert.equal(1 + 3 / 3, 6 / 3);
  assert.notEqual(1 + 3 / 6, 6 / 6);
  assert.equal(0 * 0, 0); // never 8: witness for 8/0 impossibility.
  assert.equal(0 * 1, 0); // alongside q=0: 0/0 does not select a unique quotient.
});

test("authored diagnostic responses are wrong and reach the intended per-field feedback", () => {
  let count = 0;
  for (const task of exercises) {
    const correctRaw = checkReference(task, fixed[task.id]);
    if (task.answer.kind === "parts") {
      const correct = JSON.parse(correctRaw);
      for (const part of task.answer.parts)
        for (const mistake of part.mistakes ?? []) {
          const response = gradeAnswer(
            task,
            JSON.stringify({ ...correct, [part.id]: mistake.input }),
          );
          const feedback = response.parts?.find(
            (value) => value.id === part.id,
          )?.result;
          assert.equal(response.correct, false, `${task.id}/${part.id}`);
          assert.equal(
            feedback?.status,
            "incorrect",
            `${task.id}/${part.id}: ${mistake.input}`,
          );
          assert.equal(feedback.message, mistake.feedback);
          count++;
        }
    } else
      for (const mistake of task.mistakes ?? []) {
        const response = gradeAnswer(task, mistake.input);
        assert.equal(response.status, "incorrect", task.id);
        assert.equal(response.message, mistake.feedback, task.id);
        count++;
      }
  }
  assert.ok(count >= 50, `actual diagnostic count ${count}`);
});

function capture(source: string, pattern: RegExp): string[] {
  const match = pattern.exec(source);
  assert.ok(
    match,
    `independent reference could not read displayed data: ${source}`,
  );
  return match.slice(1);
}
function generatedReference(family: string, task: Exercise): Reference {
  let answers: Record<string, Expected>;
  const prompt = task.prompt;
  switch (family) {
    case "signed-position-v1": {
      const [a, b] = capture(
        prompt,
        /a = ([−\d,]+); B pont koordinátája b = ([−\d,]+)/,
      ).map(read);
      answers = {
        opposite: negative(a),
        absolute: absolute(a),
        distance: absolute(sub(a, b)),
        relation: compare(a, b) < 0 ? "lt" : compare(a, b) > 0 ? "gt" : "eq",
      };
      break;
    }
    case "signed-subtraction-v1": {
      const [a, b] = capture(prompt, /a = ([−\d,]+) és b = ([−\d,]+)/).map(
        read,
      );
      answers = {
        opposite: negative(b),
        value: sub(a, b),
        direction: b.n < 0n ? "right" : b.n > 0n ? "left" : "stay",
      };
      break;
    }
    case "signed-missing-v1": {
      const [a, b] = capture(prompt, /számot: ([−\d,]+) − x = ([−\d,]+)/).map(
        read,
      );
      const x = sub(a, b);
      answers = {
        x,
        sign: x.n < 0n ? "negative" : x.n > 0n ? "positive" : "zero",
      };
      break;
    }
    case "order-chain-v1": {
      const [a, b, c, d] = capture(prompt, /(\d+) : (\d+) × (\d+) − (\d+)/).map(
        read,
      );
      answers = { first: div(a, b), value: sub(mul(div(a, b), c), d) };
      break;
    }
    case "order-independent-v1": {
      const [a, b, c, d, e] = capture(
        prompt,
        /(\d+) × \((\d+) − (\d+)\) \+ (\d+) : (\d+)/,
      ).map(read);
      answers = {
        bracket: sub(b, c),
        quotient: div(d, e),
        value: add(mul(a, sub(b, c)), div(d, e)),
      };
      break;
    }
    case "order-signed-square-v1": {
      const [a, b] = capture(prompt, /−(\d+)² \+ \(−(\d+)\)²/).map(read);
      answers = {
        first: negative(mul(a, a)),
        second: mul(negative(b), negative(b)),
        sum: sub(mul(b, b), mul(a, a)),
      };
      break;
    }
    case "ratio-unit-price-v1": {
      const [mass, price, target] = capture(
        prompt,
        /([\d,]+) kg díszkő (\d+) Ft\. Mennyi ([\d,]+) kg/,
      ).map(read);
      const rate = div(price, mass);
      answers = { rate: u(rate, "Ft/kg"), price: u(mul(rate, target), "Ft") };
      break;
    }
    case "ratio-shared-work-v1": {
      const [count, time, target] = capture(
        prompt,
        /(\d+) azonos segítő (\d+) óra.*?idő kell (\d+) ilyen/,
      ).map(read);
      const work = mul(count, time);
      answers = {
        work: u(work, "segítőóra"),
        time: u(div(work, target), "óra"),
      };
      break;
    }
    case "ratio-fixed-fee-v1": {
      const [base, rate, x1, x2] = capture(
        prompt,
        /(\d+) Ft alapdíj \+ (\d+) Ft.*?díj (\d+) km és (\d+) km/,
      ).map(read);
      const first = add(base, mul(rate, x1)),
        second = add(base, mul(rate, x2));
      assert.equal(same(div(first, x1), div(second, x2)), false);
      answers = {
        first: u(first, "Ft"),
        second: u(second, "Ft"),
        direct: "no",
      };
      break;
    }
    case "units-dimensions-v1": {
      const [name, value, from, exponent, to, targetExponent] = capture(
        prompt,
        /Ugyanaz a (hosszúság|terület|térfogat) ([\d,]+) (dm|cm)([²³]?)\. Fejezd ki (dm|cm)([²³]?)/,
      );
      assert.equal(exponent, targetExponent);
      const dimension = exponent === "²" ? 2 : exponent === "³" ? 3 : 1;
      assert.equal(
        name,
        dimension === 1
          ? "hosszúság"
          : dimension === 2
            ? "terület"
            : "térfogat",
      );
      const factor = q(10 ** dimension);
      answers = {
        factor: u(factor, `cm${exponent}`),
        value: u(
          from === "dm" ? mul(read(value), factor) : div(read(value), factor),
          `${to}${exponent}`,
        ),
      };
      break;
    }
    case "units-clock-v1": {
      const [decimal, hours, minutes] = capture(
        prompt,
        /össze: (\d+,\d+) óra és (\d+) óra (\d+) perc/,
      ).map(read);
      const first = mul(decimal, q(60)),
        second = add(mul(hours, q(60)), minutes);
      answers = {
        decimal: u(first, "perc"),
        clock: u(second, "perc"),
        difference: u(absolute(sub(second, first)), "perc"),
      };
      break;
    }
    case "units-container-v1": {
      const [a, b, h, w] = capture(
        prompt,
        /méretei (\d+) cm × (\d+) cm × (\d+) cm\. A víz (\d+) cm/,
      ).map(read);
      const capacity = div(mul(mul(a, b), h), q(1000)),
        water = div(mul(mul(a, b), w), q(1000));
      assert.equal(compare(water, capacity), -1);
      answers = {
        capacity: u(capacity, "L"),
        water: u(water, "L"),
        remaining: u(sub(capacity, water), "L"),
      };
      break;
    }
    default:
      throw new Error(`Missing independent family: ${family}`);
  }
  return { givens: [], answers };
}

test("12 new deterministic families: 2400 tasks independently recalculated from displayed problem data", () => {
  assert.equal(foundationGeneratorFamilies.length, 12);
  let checked = 0;
  for (const family of foundationGeneratorFamilies) {
    const variant = foundationGeneratorFamilies
      .filter((item) => item.topic === family.topic)
      .findIndex((item) => item.id === family.id);
    const signatures = new Set<string>();
    for (let seed = 0; seed < 200; seed++) {
      const task = generateFoundationExercise(family.topic, seed, variant);
      assert.ok(task.id.includes(family.id));
      assert.deepEqual(
        task,
        generateFoundationExercise(family.topic, seed, variant),
      );
      const reference = generatedReference(family.id, task);
      const correct = JSON.parse(checkReference(task, reference));
      assert.equal(task.hints.length, 2);
      assert.ok(task.solution.length >= 2);
      if (task.answer.kind !== "parts")
        assert.fail("Generated multi-part task expected.");
      for (const part of task.answer.parts)
        for (const mistake of part.mistakes ?? []) {
          const result = gradeAnswer(
            task,
            JSON.stringify({ ...correct, [part.id]: mistake.input }),
          );
          assert.equal(
            result.correct,
            false,
            `${task.id}/${part.id}: diagnostic is a valid answer`,
          );
          assert.equal(
            result.parts?.find((row) => row.id === part.id)?.result.message,
            mistake.feedback,
          );
        }
      signatures.add(task.prompt);
      checked++;
    }
    assert.ok(
      signatures.size >= 20,
      `${family.id}: only ${signatures.size} distinct displayed problems`,
    );
  }
  assert.equal(checked, 2400);
});

test("replay keys preserve full safe integers, negative variants normalize and invalid calls fail explicitly", () => {
  for (const topic of foundationLessons.map((lesson) => lesson.id)) {
    const count = foundationGeneratorFamilies.filter(
      (family) => family.topic === topic,
    ).length;
    for (const seed of [
      -17,
      0,
      4294967297,
      Number.MAX_SAFE_INTEGER,
      Number.MIN_SAFE_INTEGER,
    ]) {
      assert.deepEqual(
        generateFoundationExercise(topic, seed),
        generateFoundationExercise(topic, seed, seed),
      );
      const task = generateFoundationExercise(topic, seed, -1);
      const family = foundationGeneratorFamilies.filter(
        (item) => item.topic === topic,
      )[count - 1];
      assert.ok(task.id.includes(family.id));
      assert.ok(task.id.includes(`seed=${seed}`));
    }
  }
  for (const value of [NaN, Infinity, 1.5, Number.MAX_SAFE_INTEGER + 1]) {
    assert.throws(
      () => generateFoundationExercise("szamfogalom", value),
      RangeError,
    );
    assert.throws(
      () => generateFoundationExercise("szamfogalom", 1, value),
      RangeError,
    );
  }
  assert.throws(() => generateFoundationExercise("tortek", 1), RangeError);
});

test("worked examples retain all eight independent numerical conclusions and model conditions", () => {
  const all = foundationLessons.flatMap((lesson) => lesson.examples);
  const expected = [
    { id: "SZ01-P01", result: -7 - -4 + 6, fragment: "= 3" },
    { id: "SZ01-P02", result: (-250 - 175 + 450) / 100, fragment: "= 0,25 °C" },
    { id: "MS02-P01", result: 30 - 18 / 3 + 2 * 4, fragment: "= 32" },
    { id: "MS02-P02", result: 4 * (-2) ** 2 - (10 - (6 - 3)), fragment: "= 9" },
    { id: "A–P1", result: ((900 * 10) / 25) * 7, fragment: "= 2520 Ft" },
    { id: "A–P2", result: (4 * 12) / 6, fragment: "= 8 perc" },
    { id: "M–P1", result: (320 / 40) * (240 / 40), fragment: "= 48" },
    { id: "M–P2", result: (30 * 20 * 18) / 1000, fragment: "= 10,8 L" },
  ];
  const numericalResults = [3, 0.25, 32, 9, 2520, 8, 48, 10.8];
  expected.forEach((ref, i) => {
    assert.equal(ref.result, numericalResults[i]);
    const example = all.find((row) => row.title.includes(ref.id));
    assert.ok(example, ref.id);
    assert.ok(
      example.steps.some((row) => row.expression.includes(ref.fragment)),
      ref.id,
    );
  });
  const tiles = all.find((row) => row.title.includes("M–P1"))!;
  assert.ok(tiles.prompt.includes("egész számú lap"));
  assert.ok(
    tiles.steps.some((row) => row.expression.includes("5 csomag: 50 lap")),
  );
  const box = all.find((row) => row.title.includes("M–P2"))!;
  assert.ok(box.prompt.includes("belső"));
  assert.ok(
    box.steps.some((row) => row.expression.includes("15 000 cm³ = 15 L")),
  );
});

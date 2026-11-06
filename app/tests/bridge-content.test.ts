import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  bridgeLessons,
  bridgeManuscriptMap,
} from "../src/content/bridge-lessons.ts";
import { gradeAnswer } from "../src/math/engine.ts";
import type { Exercise, ScalarAnswerSpec, TopicId } from "../src/types.ts";

/** Independent references: no production arithmetic or authored answer values. */
interface Q {
  n: bigint;
  d: bigint;
  unit?: string;
}
const q = (n: number | bigint, d: number | bigint = 1): Q => ({
  n: BigInt(n),
  d: BigInt(d),
});
const plus = (a: Q, b: Q): Q => q(a.n * b.d + b.n * a.d, a.d * b.d);
const minus = (a: Q, b: Q): Q => q(a.n * b.d - b.n * a.d, a.d * b.d);
const times = (a: Q, b: Q): Q => q(a.n * b.n, a.d * b.d);
const divide = (a: Q, b: Q): Q => {
  assert.notEqual(b.n, 0n);
  return q(a.n * b.d, a.d * b.n);
};
const neg = (a: Q): Q => q(-a.n, a.d);
const square = (a: Q) => times(a, a);
const power = (a: Q, n: number): Q => {
  let v = q(1);
  for (let i = 0; i < n; i++) v = times(v, a);
  return v;
};
const abs = (a: Q) => q(a.n < 0n ? -a.n : a.n, a.d);
const unit = (a: Q, value: string): Q => ({ ...a, unit: value });
const same = (a: Q, b: Q) => a.n * b.d === b.n * a.d;
const read = (input: string): Q => {
  const source = input.replaceAll("−", "-").replaceAll(",", ".").trim();
  if (source.includes("/")) {
    const parts = source.split("/");
    assert.equal(parts.length, 2);
    return divide(read(parts[0]), read(parts[1]));
  }
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(source);
  assert.ok(match, "Reference number: " + input);
  return q(
    (match[1] ? -1n : 1n) * BigInt(match[2] + (match[3] ?? "")),
    10n ** BigInt((match[3] ?? "").length),
  );
};
const asInput = (v: Q) =>
  String(v.n) + "/" + String(v.d) + (v.unit ? " " + v.unit : "");
const cleanText = (v: string) =>
  v.replaceAll("−", "-").replaceAll("×", "*").replace(/\s+/g, " ").trim();

type Expected = Q | string;
interface Reference {
  givens: string[];
  answers: Record<string, Expected>;
}
const references: Record<string, Reference> = {};
function ref(
  topic: TopicId,
  suffix: string,
  givens: string[],
  answers: Record<string, Expected>,
) {
  references[topic + "-" + suffix] = { givens, answers };
}
const A: TopicId = "betus-kifejezesek",
  M: TopicId = "szoveges-modellek",
  P: TopicId = "hatvanyok",
  R: TopicId = "negyzetgyok";
ref(A, "prediction", ["a = 4", "3a + 2", "3(a + 2)"], {
  first: plus(times(q(3), q(4)), q(2)),
  second: times(q(3), plus(q(4), q(2))),
});
ref(A, "practice-1", ["4x − 3", "x = 2", "x = 0", "x = −2"], {
  positive: minus(times(q(4), q(2)), q(3)),
  zero: minus(times(q(4), q(0)), q(3)),
  negative: minus(times(q(4), q(-2)), q(3)),
});
ref(A, "practice-2", ["a = −3", "b = 2", "2a + b", "ab", "a²"], {
  sum: plus(times(q(2), q(-3)), q(2)),
  product: times(q(-3), q(2)),
  square: square(q(-3)),
});
ref(A, "practice-3", ["3a + 5a − 2a", "a = −2"], {
  combined: "6*a",
  value: times(minus(plus(q(3), q(5)), q(2)), q(-2)),
});
ref(A, "practice-4", ["4x + 3y − x + 2y", "x = 2", "y = −1"], {
  x: minus(q(4), q(1)),
  y: plus(q(3), q(2)),
  value: plus(times(q(3), q(2)), times(q(5), q(-1))),
});
ref(A, "practice-5", ["7a − 3 + 2a + 8", "a = −1"], {
  coefficient: plus(q(7), q(2)),
  constant: plus(q(-3), q(8)),
  value: plus(times(q(9), q(-1)), q(5)),
});
ref(A, "practice-6", ["3(x + 4)", "x = 2"], {
  coefficient: q(3),
  constant: times(q(3), q(4)),
  value: times(q(3), plus(q(2), q(4))),
});
ref(A, "practice-7", ["−2(3x − 5)", "x = −1"], {
  expanded: "-6*x+10",
  value: times(q(-2), minus(times(q(3), q(-1)), q(5))),
});
ref(A, "practice-8", ["5 − (2x − 3)", "x = 4"], {
  expanded: "8-2*x",
  value: minus(q(5), minus(times(q(2), q(4)), q(3))),
});
ref(A, "practice-9", ["2(x + 3) + 3(x − 1)", "x = 0,5"], {
  coefficient: plus(q(2), q(3)),
  constant: minus(times(q(2), q(3)), q(3)),
  value: plus(
    times(q(2), plus(q(1, 2), q(3))),
    times(q(3), minus(q(1, 2), q(1))),
  ),
});
ref(A, "practice-10", ["a + a", "a × a", "a = 3"], {
  sumForm: "2*a",
  productForm: "a^2",
  sumValue: plus(q(3), q(3)),
  productValue: square(q(3)),
});
ref(A, "practice-11", ["3 cm", "(x + 2) cm", "x = 4"], {
  perimeterForm: "2*x+10",
  areaForm: "3*x+6",
  perimeter: unit(times(q(2), plus(q(3), plus(q(4), q(2)))), "cm"),
  area: unit(times(q(3), plus(q(4), q(2))), "cm²"),
});
ref(A, "practice-12", ["4(x + 1) = 4x + 1", "x = 0"], {
  left: times(q(4), plus(q(0), q(1))),
  right: plus(times(q(4), q(0)), q(1)),
  correctForm: "4*x+4",
});
ref(A, "exit-1", ["4(2x − 3) − 3(x + 1)", "x = −2", "x = 3"], {
  form: "5*x-15",
  negative: minus(
    times(q(4), minus(times(q(2), q(-2)), q(3))),
    times(q(3), plus(q(-2), q(1))),
  ),
  positive: minus(
    times(q(4), minus(times(q(2), q(3)), q(3))),
    times(q(3), plus(q(3), q(1))),
  ),
});
ref(A, "exit-2", ["Három", "(p + 200)", "két", "p = 800"], {
  coefficient: plus(q(3), q(2)),
  constant: unit(times(q(3), q(200)), "Ft"),
  price: unit(
    plus(times(q(3), plus(q(800), q(200))), times(q(2), q(800))),
    "Ft",
  ),
});

ref(M, "prediction", ["Három", "300 Ft", "2700 Ft"], {
  tickets: unit(minus(q(2700), q(300)), "Ft"),
  one: unit(divide(minus(q(2700), q(300)), q(3)), "Ft"),
});
ref(M, "practice-1", ["Négy", "500 Ft", "2300 Ft"], {
  equation: "4*x+500=2300",
  price: unit(divide(minus(q(2300), q(500)), q(4)), "Ft"),
  total: unit(plus(times(q(4), q(450)), q(500)), "Ft"),
});
ref(M, "practice-2", ["34 cm", "6 cm", "rövidebb"], {
  equation: "2*x+6=34",
  short: unit(divide(minus(q(34), q(6)), q(2)), "cm"),
  long: unit(plus(divide(minus(q(34), q(6)), q(2)), q(6)), "cm"),
});
ref(M, "practice-3", ["48", "háromszor", "négy év"], {
  child: unit(divide(q(48), q(4)), "év"),
  father: unit(times(q(3), q(12)), "év"),
  laterRatio: divide(plus(q(36), q(4)), plus(q(12), q(4))),
});
ref(M, "practice-4", ["5 L", "3 L", "0 és 4", "20 L", "állandóan"], {
  start: unit(q(5), "L"),
  four: unit(plus(q(5), times(q(3), q(4))), "L"),
  time: unit(divide(minus(q(20), q(5)), q(3)), "perc"),
});
ref(M, "practice-5", ["állandó", "60 km", "45 perc", "20 perc"], {
  hours: unit(divide(q(45), q(60)), "h"),
  speed: unit(divide(q(60), q(3, 4)), "km/h"),
  distance: unit(times(q(80), q(20, 60)), "km"),
});
ref(M, "practice-6", ["Két", "három", "2800 Ft", "felébe"], {
  equation: "2*x+3*x/2=2800",
  full: unit(divide(q(2800), plus(q(2), q(3, 2))), "Ft"),
  half: unit(divide(q(800), q(2)), "Ft"),
});
ref(M, "practice-7", ["Négy", "1800 Ft", "7 toll"], {
  needed: "no",
  price: unit(divide(q(1800), q(4)), "Ft"),
  check: unit(times(q(450), q(4)), "Ft"),
});
ref(M, "practice-8", ["12 cm", "nincs adat", "b = 3 cm", "b = 5 cm"], {
  first: unit(times(q(12), q(3)), "cm²"),
  second: unit(times(q(12), q(5)), "cm²"),
  unique: "no",
});
ref(
  M,
  "practice-9",
  ["3", "300 Ft", "850 Ft", "Kedvezmény és egyéb költség nincs"],
  {
    total: unit(times(q(3), q(300)), "Ft"),
    difference: unit(minus(times(q(3), q(300)), q(850)), "Ft"),
    consistent: "no",
  },
);
ref(M, "practice-10", ["113", "48", "mindenki ül"], {
  quotient: divide(q(113), q(48)),
  buses: unit(q(Math.ceil(113 / 48)), "db"),
  empty: minus(times(q(3), q(48)), q(113)),
});
ref(
  M,
  "practice-11",
  ["36 L", "2 L/perc", "6 csappal", "3 csappal", "nem lassítják"],
  {
    six: unit(divide(q(36), times(q(6), q(2))), "perc"),
    three: unit(divide(q(36), times(q(3), q(2))), "perc"),
    check: unit(times(times(q(3), q(2)), q(6)), "L"),
  },
);
ref(M, "practice-12", ["A = 500 + 200x", "B = 350x", "4 km"], {
  a: unit(plus(q(500), times(q(200), q(4))), "Ft"),
  b: unit(times(q(350), q(4)), "Ft"),
  same: unit(divide(q(500), minus(q(350), q(200))), "km"),
});
ref(M, "exit-1", ["Három", "700 Ft", "4300 Ft"], {
  equation: "3*x+700=4300",
  price: unit(divide(minus(q(4300), q(700)), q(3)), "Ft"),
  check: unit(plus(times(q(3), q(1200)), q(700)), "Ft"),
});
ref(M, "exit-2", ["46 cm", "8 cm"], {
  equation: "2*x+8=46",
  short: unit(divide(minus(q(46), q(8)), q(2)), "cm"),
  long: unit(plus(divide(minus(q(46), q(8)), q(2)), q(8)), "cm"),
});

ref(P, "prediction", ["3²", "2³"], {
  square: square(q(3)),
  cube: power(q(2), 3),
});
ref(P, "practice-1", ["4³", "szorzásjelekkel"], {
  base: q(4),
  exponent: q(3),
  expanded: "4*4*4",
  value: power(q(4), 3),
});
ref(P, "practice-2", ["2⁵", "5²"], {
  first: power(q(2), 5),
  second: square(q(5)),
  difference: minus(power(q(2), 5), square(q(5))),
});
ref(P, "practice-3", ["(−3)²", "−3²", "−(−3)²", "(−3)³"], {
  negativeSquare: square(q(-3)),
  oppositeSquare: neg(square(q(3))),
  outside: neg(square(q(-3))),
  cube: power(q(-3), 3),
});
ref(P, "practice-4", ["(−2)⁴", "(−2)⁵", "0³", "1⁸"], {
  even: power(q(-2), 4),
  odd: power(q(-2), 5),
  zero: power(q(0), 3),
  one: power(q(1), 8),
});
ref(P, "practice-5", ["(1/2)³", "(3/2)²", "0,2²"], {
  half: power(q(1, 2), 3),
  threeHalves: square(q(3, 2)),
  decimal: square(q(2, 10)),
});
ref(P, "practice-6", ["7 cm", "3 cm", "megdupláznánk"], {
  area: unit(square(q(7)), "cm²"),
  volume: unit(power(q(3), 3), "cm³"),
  areaFactor: square(q(2)),
  volumeFactor: power(q(2), 3),
});
ref(P, "practice-7", ["10³", "10⁶"], {
  thousand: power(q(10), 3),
  million: power(q(10), 6),
  ratio: divide(power(q(10), 6), power(q(10), 3)),
});
ref(P, "practice-8", ["5 × 10⁴ + 2 × 10³ + 7 × 10 + 4", "503 000"], {
  value: plus(
    plus(times(q(5), power(q(10), 4)), times(q(2), power(q(10), 3))),
    plus(times(q(7), q(10)), q(4)),
  ),
  hundredThousands: q(Math.floor(503000 / 100000)),
  thousands: q(Math.floor(503000 / 1000) % 10),
});
ref(P, "practice-9", ["0,047 × 10³", "62 000 : 10²", "1,2 × 10⁴"], {
  first: times(q(47, 1000), power(q(10), 3)),
  second: divide(q(62000), power(q(10), 2)),
  third: times(q(12, 10), power(q(10), 4)),
});
ref(P, "practice-10", ["198 × 51", "200 × 50"], {
  estimate: times(q(200), q(50)),
  exact: times(q(198), q(51)),
  difference: minus(times(q(198), q(51)), times(q(200), q(50))),
});
ref(P, "practice-11", ["(2 + 3)²", "2² + 3²"], {
  whole: square(plus(q(2), q(3))),
  separate: plus(square(q(2)), square(q(3))),
  difference: minus(square(plus(q(2), q(3))), plus(square(q(2)), square(q(3)))),
});
ref(P, "practice-12", ["3,2 × 10⁵", "4 700 000", "1 ≤ a < 10"], {
  value: times(q(32, 10), power(q(10), 5)),
  coefficient: divide(q(4700000), power(q(10), 6)),
  exponent: q(6),
});
ref(P, "exit-1", ["−4² + (−2)³"], {
  first: neg(square(q(4))),
  second: power(q(-2), 3),
  sum: plus(neg(square(q(4))), power(q(-2), 3)),
});
ref(P, "exit-2", ["2⁸", "Ezer", "250 bájt", "további helyigény nincs"], {
  one: unit(power(q(2), 8), "bájt"),
  total: unit(times(q(1000), power(q(2), 8)), "bájt"),
  estimate: unit(times(q(1000), q(250)), "bájt"),
});

// Independent decimal bracketing by walking up at the requested precision.
function rootFloorAt(area: number, places: number): number {
  const denominator = 10 ** places;
  let numerator = 0;
  while ((numerator + 1) ** 2 <= area * denominator ** 2) numerator++;
  return numerator;
}
function roundedRoot(area: number, places: number): Q {
  const d = 10 ** places,
    n = rootFloorAt(area, places);
  const upper = (2 * n + 1) ** 2 <= 4 * area * d * d;
  return q(n + (upper ? 1 : 0), d);
}
ref(R, "prediction", ["√36", "x² = 36"], {
  root: q(6),
  smaller: q(-6),
  larger: q(6),
});
ref(R, "practice-1", ["√0", "√1", "√49", "√100"], {
  zero: q(0),
  one: q(1),
  seven: q(7),
  ten: q(10),
});
ref(R, "practice-2", ["√(9/16)", "√0,81", "√2,25"], {
  fraction: q(3, 4),
  decimal: q(9, 10),
  larger: q(3, 2),
});
ref(R, "practice-3", ["√((−5)²)", "√((−2,4)²)", "√(0²)"], {
  negative: abs(q(-5)),
  decimal: abs(q(-24, 10)),
  zero: abs(q(0)),
});
ref(R, "practice-4", ["x² = 81", "y² = 0", "z² = −4", "valós"], {
  smaller: q(-9),
  larger: q(9),
  zero: q(0),
  negative: "none",
});
ref(R, "practice-5", ["√50", "szomszédos egész"], {
  lower: q(rootFloorAt(50, 0)),
  upper: q(rootFloorAt(50, 0) + 1),
});
ref(R, "practice-6", ["√20", "szomszédos tized", "felezőpont"], {
  lower: q(rootFloorAt(20, 1), 10),
  upper: q(rootFloorAt(20, 1) + 1, 10),
  rounded: roundedRoot(20, 1),
});
ref(R, "practice-7", ["√2", "szomszédos század", "két tizedes"], {
  lower: q(rootFloorAt(2, 2), 100),
  upper: q(rootFloorAt(2, 2) + 1, 100),
  rounded: roundedRoot(2, 2),
});
ref(R, "practice-8", ["√10", "3,16", "négyzetét"], {
  exact: "√10",
  square: square(q(316, 100)),
  equal: "no",
});
ref(R, "practice-9", ["√(9 + 16)", "√9 + √16"], {
  together: q(5),
  separate: plus(q(3), q(4)),
  difference: minus(plus(q(3), q(4)), q(5)),
});
ref(R, "practice-10", ["18 cm²", "két tizedes", "négyzetét"], {
  exact: "√18",
  side: unit(roundedRoot(18, 2), "cm"),
  check: unit(square(roundedRoot(18, 2)), "cm²"),
});
ref(
  R,
  "practice-11",
  ["70 darab", "1 cm × 1 cm", "vágás nélkül", "négyzetrácsban"],
  {
    side: unit(q(rootFloorAt(70, 0)), "cm"),
    used: unit(square(q(rootFloorAt(70, 0))), "db"),
    left: unit(minus(q(70), square(q(rootFloorAt(70, 0)))), "db"),
  },
);
ref(R, "practice-12", ["1,73", "1,7320 < √3 < 1,7321", "két tizedes"], {
  early: times(q(173, 100), q(10)),
  rounded: q(1732, 100),
  difference: minus(q(1732, 100), times(q(173, 100), q(10))),
});
ref(R, "exit-1", ["√((−7)²)", "x² = 49"], {
  root: abs(q(-7)),
  smaller: q(-7),
  larger: q(7),
});
ref(R, "exit-2", ["45 m²", "szomszédos egész", "egy tizedes", "négyzetét"], {
  exact: "√45",
  lower: unit(q(rootFloorAt(45, 0)), "m"),
  upper: unit(q(rootFloorAt(45, 0) + 1), "m"),
  rounded: unit(roundedRoot(45, 1), "m"),
  square: unit(square(roundedRoot(45, 1)), "m²"),
});

/** Small independent polynomial interpreter for authored allowlist verification.
 * It only computes rational polynomials, not JavaScript or production normalizers. */
type Poly = Map<string, Q>;
const constant = (v: Q): Poly => new Map([["", v]]);
const variable = (name: string): Poly => new Map([[name, q(1)]]);
function addPoly(a: Poly, b: Poly): Poly {
  const result = new Map(a);
  for (const [m, c] of b) result.set(m, plus(result.get(m) ?? q(0), c));
  for (const [m, c] of result) if (c.n === 0n) result.delete(m);
  return result;
}
const negativePoly = (a: Poly): Poly =>
  new Map([...a].map(([m, c]) => [m, neg(c)]));
function multiplyPoly(a: Poly, b: Poly): Poly {
  let result: Poly = new Map();
  for (const [am, ac] of a)
    for (const [bm, bc] of b)
      result = addPoly(
        result,
        new Map([[(am + bm).split("").sort().join(""), times(ac, bc)]]),
      );
  return result;
}
function polynomial(source: string): Poly {
  const normalized = source
    .replaceAll("−", "-")
    .replaceAll(",", ".")
    .replace(/[×·]/g, "*")
    .replace(/[:÷]/g, "/")
    .replaceAll("²", "^2")
    .replaceAll("³", "^3")
    .replace(/\s+/g, "");
  if (normalized.includes("=")) {
    const [left, right, ...extra] = normalized.split("=");
    assert.equal(extra.length, 0);
    return addPoly(polynomial(left), negativePoly(polynomial(right)));
  }
  const tokens = normalized.match(/\d+(?:\.\d+)?|[a-zA-Z]|[()+\-*/^]/g) ?? [];
  assert.equal(
    tokens.join(""),
    normalized,
    "Reference expression tokenizer: " + source,
  );
  let i = 0;
  const atom = (): Poly => {
    const token = tokens[i++];
    assert.ok(token, "Missing atom: " + source);
    if (token === "(") {
      const result = sum();
      assert.equal(tokens[i++], ")");
      return result;
    }
    if (/^[a-zA-Z]$/.test(token)) return variable(token);
    assert.match(token, /^\d/);
    return constant(read(token));
  };
  const raised = (): Poly => {
    let result = atom();
    if (tokens[i] === "^") {
      i++;
      const exponent = Number(tokens[i++]);
      assert.ok(Number.isInteger(exponent) && exponent >= 1 && exponent <= 8);
      const base = result;
      result = constant(q(1));
      for (let n = 0; n < exponent; n++) result = multiplyPoly(result, base);
    }
    return result;
  };
  const signed = (): Poly =>
    tokens[i] === "-"
      ? (i++, negativePoly(signed()))
      : tokens[i] === "+"
        ? (i++, signed())
        : raised();
  const product = (): Poly => {
    let result = signed();
    while (
      i < tokens.length &&
      (tokens[i] === "*" ||
        tokens[i] === "/" ||
        /^[a-zA-Z0-9(]/.test(tokens[i]))
    ) {
      const operator =
        tokens[i] === "*" || tokens[i] === "/" ? tokens[i++] : "*";
      const next = signed();
      if (operator === "*") result = multiplyPoly(result, next);
      else {
        assert.ok(next.size === 1 && next.has(""));
        result = new Map(
          [...result].map(([m, c]) => [m, divide(c, next.get("")!)]),
        );
      }
    }
    return result;
  };
  const sum = (): Poly => {
    let result = product();
    while (tokens[i] === "+" || tokens[i] === "-") {
      const op = tokens[i++];
      const next = product();
      result = addPoly(result, op === "+" ? next : negativePoly(next));
    }
    return result;
  };
  const result = sum();
  assert.equal(i, tokens.length);
  return result;
}
function sameExpression(actual: string, expected: string): boolean {
  if (expected.startsWith("√")) {
    const radicand = (s: string) =>
      /^√\(?(\d+)\)?$/.exec(s.replace(/\s+/g, ""))?.[1];
    return (
      radicand(actual) !== undefined && radicand(actual) === radicand(expected)
    );
  }
  const a = polynomial(actual),
    b = polynomial(expected);
  return [...new Set([...a.keys(), ...b.keys()])].every((key) =>
    same(a.get(key) ?? q(0), b.get(key) ?? q(0)),
  );
}
function inputFor(spec: ScalarAnswerSpec, expected: Expected): string {
  if (spec.kind === "number") {
    assert.equal(typeof expected, "object");
    const value = expected as Q;
    assert.ok(
      same(read(spec.expected), value),
      "Wrong numeric answer: " + spec.expected + " expected " + asInput(value),
    );
    assert.equal(spec.unit, value.unit);
    return asInput(value);
  }
  assert.equal(typeof expected, "string");
  if (spec.kind === "choice") {
    assert.equal(spec.correct, expected);
    return expected as string;
  }
  for (const accepted of spec.accepted)
    assert.ok(
      sameExpression(accepted, expected as string),
      "Incorrect authored expression: " + accepted,
    );
  return expected as string;
}
function referenceInput(exercise: Exercise): Record<string, string> {
  const reference = references[exercise.id];
  assert.ok(reference, exercise.id);
  assert.equal(exercise.answer.kind, "parts");
  const parts = exercise.answer.kind === "parts" ? exercise.answer.parts : [];
  assert.deepEqual(
    parts.map((p) => p.id).sort(),
    Object.keys(reference.answers).sort(),
    exercise.id + " field coverage",
  );
  for (const given of reference.givens)
    assert.ok(
      cleanText(exercise.prompt).includes(cleanText(given)),
      exercise.id + ": missing given " + given,
    );
  return Object.fromEntries(
    parts.map((part) => [
      part.id,
      inputFor(part.answer, reference.answers[part.id]),
    ]),
  );
}
const allQuestions = bridgeLessons.flatMap((l) => [
  l.prediction,
  ...l.practice,
  ...l.exit,
]);
const skills: Record<string, string[]> = {
  [A]: ["betu-helyettesites", "egynemu-tagok", "zarojel-felbontas"],
  [M]: ["adatok-es-feltetelek", "modellvalasztas", "modell-ellenorzes"],
  [P]: ["hatvany-jelentes", "hatvany-elojel", "nagysagrend"],
  [R]: ["negyzetgyok-jelentes", "gyok-becsles", "pontos-kozelito"],
};

test("four complete bridge lessons preserve 60 tasks, 183 individually tagged fields and manuscript mapping", () => {
  assert.equal(bridgeLessons.length, 4);
  assert.equal(allQuestions.length, 60);
  assert.equal(bridgeManuscriptMap.length, 60);
  assert.equal(new Set(allQuestions.map((e) => e.id)).size, 60);
  let fieldCount = 0;
  for (const lesson of bridgeLessons) {
    assert.equal(lesson.practice.length, 12);
    assert.equal(lesson.exit.length, 2);
    assert.equal(lesson.examples.length, 2);
    assert.ok(lesson.explanation.length >= 6);
    assert.ok(lesson.glossary.length >= 6);
    assert.ok(lesson.goals.length >= 4);
    assert.ok(lesson.prediction.id.endsWith("-prediction"));
    for (const e of [lesson.prediction, ...lesson.practice, ...lesson.exit]) {
      assert.equal(e.topic, lesson.id);
      assert.equal(e.hints.length, 2);
      assert.ok(e.hints.every((h) => h.trim().length > 0));
      assert.notEqual(e.hints[0], e.hints[1]);
      assert.ok(e.solution.length >= 2);
      assert.ok(e.solution.every((s) => s.expression && s.why.length > 15));
      assert.ok(e.reflection && e.reflection.checkpoints.length >= 2);
      assert.ok(
        e.manuscriptId &&
          bridgeManuscriptMap.some(
            (m) => m.manuscriptId === e.manuscriptId && m.exerciseId === e.id,
          ),
      );
      assert.equal(e.answer.kind, "parts");
      if (e.answer.kind !== "parts") continue;
      fieldCount += e.answer.parts.length;
      assert.ok(e.answer.parts.length >= 2 && e.answer.parts.length <= 16);
      assert.equal(
        new Set(e.answer.parts.map((p) => p.id)).size,
        e.answer.parts.length,
      );
      const union = new Set<string>();
      for (const part of e.answer.parts) {
        assert.match(part.id, /^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/);
        assert.ok(part.skillIds?.length);
        for (const skill of part.skillIds ?? []) {
          assert.ok(skills[lesson.id].includes(skill), skill);
          union.add(skill);
        }
      }
      assert.deepEqual([...union].sort(), [...(e.skillIds ?? [])].sort());
    }
  }
  assert.equal(fieldCount, 183);
});

test("all authored numerical fields and semantic choices match independent references; expression alternatives are equivalent", () => {
  assert.equal(Object.keys(references).length, allQuestions.length);
  for (const exercise of allQuestions) {
    const input = referenceInput(exercise);
    const result = gradeAnswer(exercise, JSON.stringify(input));
    assert.equal(
      result.correct,
      true,
      exercise.id + ": " + JSON.stringify(result),
    );
    assert.ok(result.parts?.every((p) => p.result.correct));
    if (exercise.answer.kind === "parts")
      for (const part of exercise.answer.parts) {
        if (part.answer.kind !== "expression") continue;
        for (const accepted of part.answer.accepted) {
          const response = gradeAnswer(
            exercise,
            JSON.stringify({ ...input, [part.id]: accepted }),
          );
          assert.equal(
            response.correct,
            true,
            exercise.id + ": rejected accepted form " + accepted,
          );
        }
      }
  }
});

test("all 101 targeted mistakes really receive their corresponding field feedback", () => {
  let checked = 0;
  for (const exercise of allQuestions) {
    const input = referenceInput(exercise);
    if (exercise.answer.kind !== "parts") continue;
    for (const part of exercise.answer.parts)
      for (const mistake of part.mistakes ?? []) {
        const result = gradeAnswer(
          exercise,
          JSON.stringify({ ...input, [part.id]: mistake.input }),
        );
        assert.equal(
          result.correct,
          false,
          exercise.id + ": false diagnostic " + mistake.input,
        );
        const field = result.parts?.find((p) => p.id === part.id);
        assert.ok(field);
        assert.equal(field.result.status, "incorrect");
        assert.equal(field.result.message, mistake.feedback);
        checked++;
      }
  }
  assert.equal(checked, 101);
});

test("the eight worked examples and square-root rounding boundaries agree with separate arithmetic", () => {
  const example = (topic: TopicId, index: number) => {
    const e = bridgeLessons.find((l) => l.id === topic)!.examples[index];
    assert.ok(e.steps.length >= 3 && e.check.length > 35);
    return cleanText(
      [
        e.prompt,
        ...e.steps.flatMap((s) => [s.expression, s.why]),
        e.check,
      ].join(" "),
    );
  };
  assert.ok(same(minus(times(q(2), square(q(-2))), times(q(3), q(3))), q(-1)));
  assert.ok(example(A, 0).includes("-1"));
  assert.ok(
    same(minus(times(q(3), plus(q(-3), q(4))), minus(q(-3), q(2))), q(8)),
  );
  assert.ok(example(A, 1).includes("2x + 14"));
  assert.ok(same(divide(minus(q(3500), q(300)), q(4)), q(800)));
  assert.ok(example(M, 0).includes("800"));
  assert.ok(same(divide(minus(q(54), q(10)), q(2)), q(22)));
  assert.ok(example(M, 1).includes("32"));
  assert.ok(same(plus(power(q(-2), 3), square(q(4))), q(8)));
  assert.ok(example(P, 0).includes("-8 + 16 = 8"));
  assert.ok(same(times(q(498), q(201)), q(100098)));
  assert.ok(example(P, 1).includes("100 098"));
  assert.ok(example(R, 0).includes("x = -5 vagy x = 5"));
  assert.ok(same(abs(q(-5)), q(5)));
  assert.ok(example(R, 1).includes("29,7025"));
  assert.ok(same(square(q(545, 100)), q(297025, 10000)));
  assert.ok(same(roundedRoot(30, 1), q(55, 10)));
  for (const [midpoint, expectedSquare] of [
    ["4.45", "19.8025"],
    ["1.415", "2.002225"],
    ["4.245", "18.020025"],
    ["6.75", "45.5625"],
  ])
    assert.ok(same(square(read(midpoint)), read(expectedSquare)));
  assert.ok(square(read("1.7320")).n < 3n * square(read("1.7320")).d);
  assert.ok(square(read("1.7321")).n > 3n * square(read("1.7321")).d);
});

test("domain and precision explanations explicitly separate root value, equation solutions and rounding", () => {
  const root = bridgeLessons.find((l) => l.id === R)!;
  const text = JSON.stringify(root);
  assert.ok(text.includes("√(a²) = |a|"));
  assert.ok(text.includes("a ≥ 0"));
  assert.ok(text.includes("nincs valós megoldás"));
  assert.ok(text.includes("≈"));
  assert.ok(text.includes("felezőpont"));
  assert.ok(
    !root.coveredUnits?.includes("M08.04"),
    "Irrationality proof and general root laws are not fully covered.",
  );
  const powers = bridgeLessons.find((l) => l.id === P)!;
  assert.ok(
    !powers.coveredUnits?.includes("M07.03"),
    "Complete scientific notation is not claimed.",
  );
  assert.ok(
    !powers.coveredUnits?.includes("M07.05"),
    "A brief workshop extension is not a full exponent unit.",
  );
});

test("checking fields keep only valid earlier prerequisite parts and cannot earn evidence by copying the given total alone", () => {
  let dependentCount = 0;
  for (const exercise of allQuestions) {
    if (exercise.answer.kind !== "parts") continue;
    const earlier = new Set<string>();
    for (const part of exercise.answer.parts) {
      if (part.requiresParts) {
        dependentCount++;
        assert.ok(part.requiresParts.length > 0);
        assert.equal(
          new Set(part.requiresParts).size,
          part.requiresParts.length,
        );
        for (const parent of part.requiresParts)
          assert.ok(
            earlier.has(parent),
            exercise.id +
              ": missing, forward or cyclic prerequisite " +
              parent +
              " for " +
              part.id,
          );
      }
      earlier.add(part.id);
    }
  }
  assert.equal(dependentCount, 20);
  const depends = (id: string, field: string) => {
    const exercise = allQuestions.find((e) => e.id === id)!;
    assert.equal(exercise.answer.kind, "parts");
    return exercise.answer.kind === "parts"
      ? exercise.answer.parts.find((p) => p.id === field)?.requiresParts
      : undefined;
  };
  assert.deepEqual(depends(M + "-practice-1", "total"), ["equation", "price"]);
  assert.deepEqual(depends(M + "-exit-1", "check"), ["equation", "price"]);
  assert.deepEqual(depends(M + "-practice-9", "consistent"), ["difference"]);
  assert.deepEqual(depends(M + "-practice-9", "difference"), ["total"]);
  assert.deepEqual(depends(R + "-practice-10", "check"), ["side"]);
  assert.equal(
    depends(A + "-practice-3", "value"),
    undefined,
    "Direct substitution does not require a prior symbolic transformation.",
  );
  const inverse = bridgeLessons.find((l) => l.id === M)!.practice[3];
  assert.equal(inverse.answer.kind, "parts");
  if (inverse.answer.kind === "parts")
    assert.deepEqual(
      inverse.answer.parts.find((p) => p.id === "time")!.skillIds,
      ["modellvalasztas"],
      "Solving for a new unknown alone is not back-checking evidence.",
    );
});

test("the four complete manuscripts preserve every task, hint, solution, field ID and dependency", () => {
  const files: Partial<Record<TopicId, string>> = {
    "betus-kifejezesek": "05-betus-kifejezesek.md",
    "szoveges-modellek": "06-szoveges-modellek.md",
    hatvanyok: "07-hatvanyok.md",
    negyzetgyok: "08-negyzetgyok.md",
  };
  const normalize = (value: string) =>
    value.replaceAll("\\|", "|").replace(/\s+/g, " ").trim();
  for (const lesson of bridgeLessons) {
    const text = normalize(
      readFileSync(
        new URL("../../docs/tananyag/" + files[lesson.id], import.meta.url),
        "utf8",
      ),
    );
    for (const block of lesson.explanation) {
      assert.ok(text.includes(normalize(block.heading)));
      assert.ok(text.includes(normalize(block.body)));
    }
    for (const example of lesson.examples) {
      assert.ok(text.includes(normalize(example.prompt)));
      assert.ok(text.includes(normalize(example.check)));
      for (const step of example.steps) {
        assert.ok(text.includes(normalize(step.expression)));
        assert.ok(text.includes(normalize(step.why)));
      }
    }
    for (const exercise of [
      lesson.prediction,
      ...lesson.practice,
      ...lesson.exit,
    ]) {
      assert.ok(text.includes(exercise.id));
      assert.ok(text.includes(exercise.manuscriptId!));
      assert.ok(
        text.includes(normalize(exercise.prompt)),
        exercise.id + ": manuscript prompt differs",
      );
      for (const hint of exercise.hints)
        assert.ok(
          text.includes(normalize(hint)),
          exercise.id + ": missing hint",
        );
      for (const step of exercise.solution) {
        assert.ok(text.includes(normalize(step.expression)));
        assert.ok(text.includes(normalize(step.why)));
      }
      assert.ok(text.includes(normalize(exercise.reflection!.prompt)));
      for (const checkpoint of exercise.reflection!.checkpoints)
        assert.ok(text.includes(normalize(checkpoint)));
      if (exercise.answer.kind === "parts")
        for (const part of exercise.answer.parts) {
          assert.ok(text.includes("`" + part.id + "`"));
          assert.ok(text.includes(normalize(part.label)));
          for (const parent of part.requiresParts ?? [])
            assert.ok(text.includes("`" + parent + "`"));
          for (const mistake of part.mistakes ?? [])
            assert.ok(text.includes(normalize(mistake.feedback)));
        }
    }
    assert.ok(text.includes("requiresParts"));
    assert.ok(text.includes("nem osztályozza automatikusan"));
    assert.ok(text.includes("tanári–tanulói kipróbálással"));
  }
});

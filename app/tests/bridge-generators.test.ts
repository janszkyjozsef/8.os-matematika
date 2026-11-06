import test from "node:test";
import assert from "node:assert/strict";
import {
  bridgeGeneratorFamilies,
  generateBridgeExercise,
} from "../src/math/bridge-generators.ts";
import { gradeAnswer } from "../src/math/engine.ts";
import type { Exercise, ScalarAnswerSpec, TopicId } from "../src/types.ts";

/** References use only the visible generated problem, never the RNG or its answers. */
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
const neg = (a: Q): Q => q(-a.n, a.d);
const square = (a: Q) => mul(a, a);
const same = (a: Q, b: Q) => a.n * b.d === b.n * a.d;
const u = (a: Q, unit: string): Q => ({ ...a, unit });
function pow(a: Q, count: number) {
  let result = q(1);
  for (let i = 0; i < count; i++) result = mul(result, a);
  return result;
}
function read(source: string): Q {
  const text = source.replaceAll("−", "-").replaceAll(",", ".").trim();
  if (text.includes("/")) {
    const values = text.split("/");
    assert.equal(values.length, 2);
    return div(read(values[0]), read(values[1]));
  }
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(text);
  assert.ok(match, "Reference literal " + text);
  return q(
    (match[1] ? -1n : 1n) * BigInt(match[2] + (match[3] ?? "")),
    10n ** BigInt((match[3] ?? "").length),
  );
}
const input = (v: Q) =>
  String(v.n) + "/" + String(v.d) + (v.unit ? " " + v.unit : "");
function captures(text: string, pattern: RegExp): string[] {
  const match = pattern.exec(text);
  assert.ok(match, pattern + " in " + text);
  return match.slice(1);
}
function floorRoot(area: number, decimalPlaces: number): bigint {
  const scale = 10n ** BigInt(decimalPlaces),
    target = BigInt(area) * scale * scale;
  let n = 0n;
  while ((n + 1n) * (n + 1n) <= target) n++;
  return n;
}
function roundedRoot(area: number, decimalPlaces: number): Q {
  const scale = 10n ** BigInt(decimalPlaces),
    lower = floorRoot(area, decimalPlaces);
  const midpoint = q(2n * lower + 1n, 2n * scale);
  const squared = square(midpoint);
  const aboveMidpoint = BigInt(area) * squared.d >= squared.n;
  return q(lower + (aboveMidpoint ? 1n : 0n), scale);
}
type Expected = Q | string;
function references(
  family: string,
  exercise: Exercise,
): Record<string, Expected> {
  const text = exercise.prompt.replaceAll("−", "-");
  if (family === "algebra-substitute-v1") {
    const [k, b, x] = captures(
      text,
      /\((-?\d+)\)x \+ \((-?\d+)\), ha x = (-?\d+(?:,\d+)?)/,
    ).map(read);
    return { term: mul(k, x), value: add(mul(k, x), b) };
  }
  if (family === "algebra-collect-v1") {
    const [p, qv, r, s] = captures(
      text,
      /(\d+)x \+ \((-?\d+)\)y - (\d+)x \+ \((-?\d+)\)y/,
    ).map(read);
    const [x, y] = captures(
      text,
      /Utána x = (-?\d+(?:,\d+)?), y = (-?\d+(?:,\d+)?)/,
    ).map(read);
    return {
      xCoefficient: sub(p, r),
      yCoefficient: add(qv, s),
      value: add(mul(sub(p, r), x), mul(add(qv, s), y)),
    };
  }
  if (family === "algebra-packets-v1") {
    const [count, plus] = captures(
      text,
      /^(\d+) egyforma csomag mindegyike \(x \+ (\d+)\)/,
    ).map(read);
    const [minus] = captures(text, /Összesen \(x - (\d+)\)/).map(read);
    const [x] = captures(text, /Most x = (\d+)/).map(read);
    assert.ok(x.n * minus.d > minus.n * x.d);
    return {
      coefficient: sub(count, q(1)),
      constant: add(mul(count, plus), minus),
      remaining: u(sub(mul(count, add(x, plus)), sub(x, minus)), "db"),
    };
  }
  if (family === "model-fixed-fee-v1") {
    const [countText, feeText, totalText] = captures(
      text,
      /^(\d+) egyforma jegy és egyszeri (\d+) Ft foglalási díj összesen (\d+) Ft/,
    );
    const [count, fee, total] = [countText, feeText, totalText].map(read);
    return {
      equation: countText + "*x+" + feeText + "=" + totalText,
      price: u(div(sub(total, fee), count), "Ft"),
      check: u(total, "Ft"),
    };
  }
  if (family === "model-sum-difference-v1") {
    const [totalText, differenceText] = captures(
      text,
      /összesen (\d+) cm\. A hosszabb (\d+) cm-rel hosszabb/,
    );
    const [total, difference] = [totalText, differenceText].map(read),
      short = div(sub(total, difference), q(2));
    assert.ok(short.n > 0n);
    return {
      equation: "2*x+" + differenceText + "=" + totalText,
      short: u(short, "cm"),
      long: u(add(short, difference), "cm"),
      difference: u(difference, "cm"),
    };
  }
  if (family === "model-whole-packs-v1") {
    const [neededText, sizeText] = captures(
      text,
      /foglalkozáshoz (\d+) jelzőkorong kell\. Csak bontatlan, egyenként (\d+) darabos/,
    );
    const needed = BigInt(neededText),
      size = BigInt(sizeText),
      packs = (needed + size - 1n) / size;
    assert.ok((packs - 1n) * size < needed && packs * size >= needed);
    return {
      quotient: q(needed, size),
      packs: u(q(packs), "db"),
      spare: u(q(packs * size - needed), "db"),
    };
  }
  if (family === "power-expand-v1") {
    const [baseText, exponentText] = captures(text, /a (\d+)\^(\d+) hatványt/),
      exponent = Number(exponentText);
    return {
      expanded: Array.from({ length: exponent }, () => baseText).join("*"),
      factors: q(exponent),
      value: pow(read(baseText), exponent),
    };
  }
  if (family === "power-sign-v1") {
    const [baseText, exponentText, baseAgain, exponentAgain] = captures(
      text,
      /\(-(\d+)\)\^(\d+) és -(\d+)\^(\d+)/,
    );
    assert.equal(baseAgain, baseText);
    assert.equal(exponentAgain, exponentText);
    const base = read(baseText),
      exponent = Number(exponentText),
      left = pow(neg(base), exponent),
      right = neg(pow(base, exponent));
    return {
      negativeBase: left,
      outsideMinus: right,
      equal: same(left, right) ? "yes" : "no",
    };
  }
  if (family === "power-ten-scale-v1") {
    const [coefficientText, exponentText] = captures(
        text,
        /mérete (\d+(?:,\d+)?) × 10\^(\d+) bájt/,
      ),
      coefficient = read(coefficientText),
      exponent = Number(exponentText);
    assert.ok(
      coefficient.n > coefficient.d && coefficient.n < 10n * coefficient.d,
    );
    return {
      value: u(mul(coefficient, pow(q(10), exponent)), "bájt"),
      lower: u(pow(q(10), exponent), "bájt"),
      upper: u(pow(q(10), exponent + 1), "bájt"),
    };
  }
  if (family === "root-square-absolute-v1") {
    const [aText] = captures(text, /Legyen a = (-?\d+)\./),
      a = BigInt(aText),
      absolute = a < 0n ? -a : a;
    return {
      root: q(absolute),
      smaller: q(-absolute),
      larger: q(absolute),
      count: q(a === 0n ? 1 : 2),
    };
  }
  if (family === "root-bracket-v1") {
    const [areaText] = captures(text, /√(\d+) két szomszédos egész/),
      area = Number(areaText),
      lower = floorRoot(area, 0);
    assert.ok(
      lower * lower < BigInt(area) &&
        BigInt(area) < (lower + 1n) * (lower + 1n),
    );
    return {
      lower: q(lower),
      upper: q(lower + 1n),
      rounded: roundedRoot(area, 1),
    };
  }
  if (family === "root-area-precision-v1") {
    const [areaText] = captures(text, /területe pontosan (\d+) cm²/),
      area = Number(areaText),
      root = roundedRoot(area, 2);
    assert.ok(
      !same(square(root), q(area)),
      "Generated area must not have this rational exact root.",
    );
    return {
      exact: "√" + areaText,
      rounded: u(root, "cm"),
      square: u(square(root), "cm²"),
      equal: "no",
    };
  }
  throw new Error("No independent reference for " + family);
}

/** Independent linear-expression parser: no eval and no production normalizer. */
interface Linear {
  c: Q;
  x: Q;
}
const scalar = (v: Q): Linear => ({ c: v, x: q(0) });
const plusLinear = (a: Linear, b: Linear): Linear => ({
  c: add(a.c, b.c),
  x: add(a.x, b.x),
});
const negativeLinear = (a: Linear): Linear => ({ c: neg(a.c), x: neg(a.x) });
function productLinear(a: Linear, b: Linear): Linear {
  assert.ok(
    a.x.n === 0n || b.x.n === 0n,
    "Only linear generated model forms are admitted.",
  );
  return { c: mul(a.c, b.c), x: add(mul(a.c, b.x), mul(a.x, b.c)) };
}
function linear(source: string): Linear {
  const text = source
    .replaceAll("−", "-")
    .replaceAll(",", ".")
    .replace(/[×·]/g, "*")
    .replace(/[:÷]/g, "/")
    .replace(/\s+/g, "");
  if (text.includes("=")) {
    const [left, right, ...more] = text.split("=");
    assert.equal(more.length, 0);
    return plusLinear(linear(left), negativeLinear(linear(right)));
  }
  const tokens = text.match(/\d+(?:\.\d+)?|x|[()+\-*/]/g) ?? [];
  assert.equal(tokens.join(""), text);
  let i = 0;
  const atom = (): Linear => {
    const t = tokens[i++];
    if (t === "(") {
      const result = sum();
      assert.equal(tokens[i++], ")");
      return result;
    }
    if (t === "x") return { c: q(0), x: q(1) };
    assert.ok(t && /^\d/.test(t));
    return scalar(read(t));
  };
  const signed = (): Linear =>
    tokens[i] === "-"
      ? (i++, negativeLinear(signed()))
      : tokens[i] === "+"
        ? (i++, signed())
        : atom();
  const product = (): Linear => {
    let result = signed();
    while (
      i < tokens.length &&
      (tokens[i] === "*" || tokens[i] === "/" || /^[0-9x(]/.test(tokens[i]))
    ) {
      const op = tokens[i] === "*" || tokens[i] === "/" ? tokens[i++] : "*",
        next = signed();
      if (op === "*") result = productLinear(result, next);
      else {
        assert.equal(next.x.n, 0n);
        result = { c: div(result.c, next.c), x: div(result.x, next.c) };
      }
    }
    return result;
  };
  const sum = (): Linear => {
    let result = product();
    while (tokens[i] === "+" || tokens[i] === "-") {
      const op = tokens[i++],
        next = product();
      result = plusLinear(result, op === "+" ? next : negativeLinear(next));
    }
    return result;
  };
  const result = sum();
  assert.equal(i, tokens.length);
  return result;
}
function expressionsEqual(a: string, b: string): boolean {
  if (b.startsWith("√")) {
    const root = (v: string) =>
      /^√\(?(\d+)\)?$/.exec(v.replace(/\s+/g, ""))?.[1];
    return root(a) !== undefined && root(a) === root(b);
  }
  const left = linear(a),
    right = linear(b);
  return same(left.c, right.c) && same(left.x, right.x);
}
function checkScalar(spec: ScalarAnswerSpec, reference: Expected): string {
  if (spec.kind === "number") {
    assert.equal(typeof reference, "object");
    const value = reference as Q;
    assert.ok(
      same(read(spec.expected), value),
      spec.expected + " != " + input(value),
    );
    assert.equal(spec.unit, value.unit);
    return input(value);
  }
  assert.equal(typeof reference, "string");
  if (spec.kind === "choice") {
    assert.equal(spec.correct, reference);
    return reference as string;
  }
  for (const accepted of spec.accepted)
    assert.ok(
      expressionsEqual(accepted, reference as string),
      "Wrong expression " + accepted,
    );
  return reference as string;
}
const skillSets: Record<string, string[]> = {
  "algebra-substitute-v1": ["betu-helyettesites"],
  "algebra-collect-v1": ["egynemu-tagok", "betu-helyettesites"],
  "algebra-packets-v1": [
    "zarojel-felbontas",
    "egynemu-tagok",
    "betu-helyettesites",
  ],
  "model-fixed-fee-v1": [
    "adatok-es-feltetelek",
    "modellvalasztas",
    "modell-ellenorzes",
  ],
  "model-sum-difference-v1": [
    "adatok-es-feltetelek",
    "modellvalasztas",
    "modell-ellenorzes",
  ],
  "model-whole-packs-v1": [
    "adatok-es-feltetelek",
    "modellvalasztas",
    "modell-ellenorzes",
  ],
  "power-expand-v1": ["hatvany-jelentes"],
  "power-sign-v1": ["hatvany-elojel", "hatvany-jelentes"],
  "power-ten-scale-v1": ["nagysagrend", "hatvany-jelentes"],
  "root-square-absolute-v1": ["negyzetgyok-jelentes"],
  "root-bracket-v1": ["gyok-becsles", "pontos-kozelito"],
  "root-area-precision-v1": [
    "negyzetgyok-jelentes",
    "gyok-becsles",
    "pontos-kozelito",
  ],
};

test("all twelve family IDs and within-topic orders are versioned and stable", () => {
  assert.deepEqual(
    bridgeGeneratorFamilies.map((f) => f.id),
    Object.keys(skillSets),
  );
  assert.equal(new Set(bridgeGeneratorFamilies.map((f) => f.id)).size, 12);
  for (const topic of [
    "betus-kifejezesek",
    "szoveges-modellek",
    "hatvanyok",
    "negyzetgyok",
  ])
    assert.equal(
      bridgeGeneratorFamilies.filter((f) => f.topic === topic).length,
      3,
    );
});

for (const family of bridgeGeneratorFamilies) {
  test(
    family.id +
      ": 200 problems recalculated from visible data, including diagnostic answers",
    () => {
      const variant = bridgeGeneratorFamilies
        .filter((f) => f.topic === family.topic)
        .indexOf(family);
      const prompts = new Set<string>();
      let diagnostics = 0;
      for (let seed = 0; seed < 200; seed++) {
        const exercise = generateBridgeExercise(family.topic, seed, variant);
        assert.equal(
          exercise.id,
          "generated:" + family.id + ":seed=" + seed + ":variant=" + variant,
        );
        assert.equal(exercise.topic, family.topic);
        assert.deepEqual(
          exercise,
          generateBridgeExercise(family.topic, seed, variant),
        );
        prompts.add(exercise.prompt);
        const expected = references(family.id, exercise);
        assert.equal(exercise.answer.kind, "parts");
        if (exercise.answer.kind !== "parts") continue;
        assert.deepEqual(
          exercise.answer.parts.map((p) => p.id).sort(),
          Object.keys(expected).sort(),
        );
        assert.equal(exercise.hints.length, 2);
        assert.ok(exercise.solution.length >= 2);
        assert.ok(
          exercise.reflection && exercise.reflection.checkpoints.length >= 2,
        );
        const union = new Set<string>();
        const answers: Record<string, string> = {};
        const earlier = new Set<string>();
        for (const part of exercise.answer.parts) {
          assert.ok(part.skillIds?.length);
          for (const skill of part.skillIds ?? []) {
            assert.ok(skillSets[family.id].includes(skill));
            union.add(skill);
          }
          answers[part.id] = checkScalar(part.answer, expected[part.id]);
          if (part.requiresParts) {
            assert.ok(part.requiresParts.length > 0);
            assert.equal(
              new Set(part.requiresParts).size,
              part.requiresParts.length,
            );
            for (const parent of part.requiresParts)
              assert.ok(
                earlier.has(parent),
                exercise.id +
                  ": invalid prerequisite " +
                  parent +
                  " for " +
                  part.id,
              );
          }
          earlier.add(part.id);
        }
        assert.deepEqual([...union].sort(), [...skillSets[family.id]].sort());
        assert.deepEqual(
          [...(exercise.skillIds ?? [])].sort(),
          [...union].sort(),
        );
        const result = gradeAnswer(exercise, JSON.stringify(answers));
        assert.equal(
          result.correct,
          true,
          exercise.id + ": " + JSON.stringify(result),
        );
        for (const part of exercise.answer.parts) {
          if (part.answer.kind === "expression")
            for (const accepted of part.answer.accepted)
              assert.equal(
                gradeAnswer(
                  exercise,
                  JSON.stringify({ ...answers, [part.id]: accepted }),
                ).correct,
                true,
              );
          for (const mistake of part.mistakes ?? []) {
            const bad = gradeAnswer(
              exercise,
              JSON.stringify({ ...answers, [part.id]: mistake.input }),
            );
            assert.equal(
              bad.correct,
              false,
              exercise.id + ": diagnostic equals correct answer",
            );
            const field = bad.parts?.find((item) => item.id === part.id);
            assert.ok(field);
            assert.equal(field.result.status, "incorrect");
            assert.equal(field.result.message, mistake.feedback);
            diagnostics++;
          }
        }
      }
      assert.ok(
        prompts.size >= 20,
        family.id + " varies in only " + prompts.size + " prompts",
      );
      assert.ok(
        diagnostics >= 100,
        family.id + " has too few actual diagnostic checks",
      );
    },
  );
}

test("seed and variant replay preserve negative and complete safe-integer identifiers", () => {
  const topics: TopicId[] = [
    "betus-kifejezesek",
    "szoveges-modellek",
    "hatvanyok",
    "negyzetgyok",
  ];
  const seeds = [
    0,
    1,
    -1,
    -999,
    4294967297,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  ];
  const variants = [
    undefined,
    -8,
    -1,
    0,
    1,
    2,
    3,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  ];
  for (const topic of topics)
    for (const seed of seeds)
      for (const variant of variants) {
        const exercise = generateBridgeExercise(topic, seed, variant);
        assert.deepEqual(
          exercise,
          generateBridgeExercise(topic, seed, variant),
        );
        const selector = variant ?? seed,
          families = bridgeGeneratorFamilies.filter((f) => f.topic === topic);
        const index =
          ((selector % families.length) + families.length) % families.length;
        assert.equal(
          exercise.id,
          "generated:" +
            families[index].id +
            ":seed=" +
            seed +
            ":variant=" +
            selector,
        );
        const expected = references(families[index].id, exercise);
        assert.equal(exercise.answer.kind, "parts");
        if (exercise.answer.kind === "parts") {
          const answers = Object.fromEntries(
            exercise.answer.parts.map((p) => [
              p.id,
              checkScalar(p.answer, expected[p.id]),
            ]),
          );
          assert.equal(
            gradeAnswer(exercise, JSON.stringify(answers)).correct,
            true,
          );
        }
      }
});

test("invalid generator parameters and unsupported topics are explicitly rejected", () => {
  for (const invalid of [
    NaN,
    Infinity,
    -Infinity,
    0.5,
    Number.MAX_SAFE_INTEGER + 1,
  ]) {
    assert.throws(
      () => generateBridgeExercise("hatvanyok", invalid),
      RangeError,
    );
    assert.throws(
      () => generateBridgeExercise("hatvanyok", 1, invalid),
      RangeError,
    );
  }
  for (const unsupported of ["tortek", "__proto__", "constructor", "unknown"])
    assert.throws(
      () => generateBridgeExercise(unsupported as TopicId, 1),
      RangeError,
    );
});

test("generated checking groups retain the model, the computed quantity and transitive precision evidence", () => {
  const parents = (topic: TopicId, variant: number, partId: string) => {
    const exercise = generateBridgeExercise(topic, 17, variant);
    assert.equal(exercise.answer.kind, "parts");
    return exercise.answer.kind === "parts"
      ? exercise.answer.parts.find((p) => p.id === partId)?.requiresParts
      : undefined;
  };
  assert.deepEqual(parents("szoveges-modellek", 0, "check"), [
    "equation",
    "price",
  ]);
  assert.deepEqual(parents("szoveges-modellek", 1, "difference"), [
    "equation",
    "short",
    "long",
  ]);
  assert.deepEqual(parents("szoveges-modellek", 2, "spare"), ["packs"]);
  assert.deepEqual(parents("hatvanyok", 1, "equal"), [
    "negativeBase",
    "outsideMinus",
  ]);
  assert.deepEqual(parents("negyzetgyok", 2, "square"), ["rounded"]);
  assert.deepEqual(parents("negyzetgyok", 2, "equal"), ["square"]);
  assert.equal(
    parents("betus-kifejezesek", 2, "remaining"),
    undefined,
    "The original story supports direct arithmetic without a prior symbolic method.",
  );
});

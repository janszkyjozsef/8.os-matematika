import test from "node:test";
import assert from "node:assert/strict";
import { formatRational, rational } from "../src/math/engine.ts";
import { emptyProfile, parseImport } from "../src/progress.ts";
import {
  appendProportionSample,
  convertModelUnit,
  exactHungarian,
  fractionAndDecimal,
  makeNumberLine,
  MODEL_UNITS,
  proportionValue,
  readProportionSamples,
  rNumber,
  unitBuilderModel,
} from "../src/math/foundation-models.ts";

test("number line: order, magnitude, opposite and distance remain separate", () => {
  const negative = makeNumberLine("-8", "-3", "add");
  assert.ok(negative.ok);
  if (negative.ok) {
    assert.equal(negative.comparison, "<");
    assert.equal(negative.magnitudeComparison, ">");
    assert.equal(formatRational(negative.opposite), "8");
    assert.equal(formatRational(negative.distance), "5");
  }
  const subtract = makeNumberLine("-5", "-3", "subtract");
  assert.ok(subtract.ok);
  if (subtract.ok) {
    assert.equal(formatRational(subtract.result), "-2");
    assert.equal(formatRational(subtract.displacement), "3");
  }
  const decimal = makeNumberLine("2,5", "0", "add");
  assert.ok(decimal.ok);
  if (decimal.ok) assert.equal(exactHungarian(decimal.opposite), "−2,5");
  const zero = makeNumberLine("0", "0", "subtract");
  assert.ok(zero.ok);
  if (zero.ok)
    for (const value of [
      zero.opposite,
      zero.absoluteA,
      zero.distance,
      zero.result,
    ])
      assert.equal(formatRational(value), "0");
  const distance = makeNumberLine("-6", "4", "add");
  assert.ok(distance.ok);
  if (distance.ok) assert.equal(formatRational(distance.distance), "10");
});

test("number line expands for every displayed value without changing the value", () => {
  for (const [a, b, expected] of [
    ["100", "80", "180"],
    ["-1000", "-2000", "-3000"],
    ["1/3", "2/3", "1"],
  ]) {
    const model = makeNumberLine(a, b, "add");
    assert.ok(model.ok);
    if (!model.ok) continue;
    assert.equal(formatRational(model.result), expected);
    for (const value of [model.a, model.b, model.result, model.opposite])
      assert.ok(rNumber(value) >= model.min && rNumber(value) <= model.max);
    assert.ok(model.ticks.length <= 15);
  }
  assert.equal(makeNumberLine("2+3", "0", "add").ok, false);
  assert.equal(makeNumberLine("1000000000001", "0", "add").ok, false);
});

test("proportion models retain exact values and enforce story domains", () => {
  const references = [
    ["cord", "1,5", "600"],
    ["cord", "3", "1200"],
    ["cord", "0", "0"],
    ["work", "3", "8"],
    ["work", "6", "4"],
    ["work", "5", "24/5"],
    ["fare", "2", "900"],
    ["fare", "4", "1300"],
    ["fare", "0", "500"],
  ] as const;
  for (const [kind, x, expected] of references) {
    const result = proportionValue(kind, x);
    assert.ok(result.ok, `${kind}: ${x}`);
    if (!result.ok) continue;
    assert.equal(formatRational(result.y), expected);
    if (x === "0") assert.equal(result.quotient, null);
    if (kind === "work") assert.equal(formatRational(result.product), "24");
    if (kind === "cord" && x !== "0")
      assert.equal(formatRational(result.quotient!), "400");
  }
  for (const x of ["0", "-1", "1,5", "13"])
    assert.equal(proportionValue("work", x).ok, false, x);
  assert.equal(proportionValue("cord", "-1").ok, false);
  assert.equal(proportionValue("fare", "11").ok, false);
});

test("the base-fee counterexample has neither a constant quotient nor product", () => {
  const a = proportionValue("fare", "2");
  const b = proportionValue("fare", "4");
  assert.ok(a.ok && b.ok);
  if (!a.ok || !b.ok) return;
  assert.equal(formatRational(a.quotient!), "450");
  assert.equal(formatRational(b.quotient!), "325");
  assert.notEqual(formatRational(a.product), formatRational(b.product));
});

test("proportion samples keep 1/3 exact through addition, profile export and reload", () => {
  const initial = readProportionSamples("cord", undefined, [0, 1, 2, 1.5]);
  assert.deepEqual(initial, ["0", "1", "2", "1.5"]);
  const added = appendProportionSample("cord", initial, "1/3");
  assert.equal(added.discarded, false);
  assert.ok(JSON.parse(added.exactSamples).includes("1/3"));
  const profile = emptyProfile();
  profile.lessons.aranyossag.lab = {
    model: "cord",
    samples: [0, 1, 2, 1.5],
    exactSamples: added.exactSamples,
  };
  const restored = parseImport(JSON.stringify(profile));
  const lab = restored.lessons.aranyossag.lab;
  const samples = readProportionSamples("cord", lab.exactSamples, lab.samples);
  assert.deepEqual(samples, ["0", "1", "2", "1.5", "1/3"]);
  const point = proportionValue("cord", samples.at(-1)!);
  assert.ok(point.ok);
  if (!point.ok) return;
  assert.equal(formatRational(point.x), "1/3");
  assert.equal(formatRational(point.y), "400/3");
  assert.equal(fractionAndDecimal(point.y), "400/3");
  assert.equal(formatRational(point.quotient!), "400");
  assert.equal(formatRational(point.product), "400/9");
  const equivalent = appendProportionSample("cord", samples, "2/6");
  assert.equal(equivalent.exactSamples, added.exactSamples);
});

test("exact sample history is bounded, preserves baseline pairs and retains numeric compatibility", () => {
  let samples = readProportionSamples("cord", undefined);
  let last = "";
  let discarded = false;
  for (let i = 1; i <= 30; i++) {
    last = `${i}/${"1" + "0".repeat(47)}`;
    const added = appendProportionSample("cord", samples, last);
    assert.ok(added.exactSamples.length <= 1000);
    discarded ||= added.discarded;
    samples = readProportionSamples("cord", added.exactSamples);
    assert.ok(samples.length <= 24);
    assert.deepEqual(samples.slice(0, 3), ["0", "1", "2"]);
    assert.equal(samples.at(-1), last);
  }
  assert.equal(discarded, true);
  assert.ok(
    samples.length < 24,
    "long exact values must obey the profile text limit",
  );
  for (const bad of [
    "not json",
    '["1/3","no number"]',
    "x".repeat(1001),
    "{}",
  ]) {
    assert.deepEqual(readProportionSamples("cord", bad, [0, 1, 2, 3]), [
      "0",
      "1",
      "2",
      "3",
    ]);
  }
  assert.deepEqual(readProportionSamples("work", '["0","1/2"]', [1, 2, 3, 6]), [
    "1",
    "2",
    "3",
    "6",
  ]);
});

test("unit conversion uses dimensions and exact rational factors", () => {
  const references = [
    ["2,5", "m", "cm", "250"],
    ["1", "dm2", "cm2", "100"],
    ["0,4", "m2", "cm2", "4000"],
    ["1", "dm3", "cm3", "1000"],
    ["1", "dm3", "l", "1"],
    ["750", "cm3", "l", "3/4"],
    ["0,2", "dm3", "ml", "200"],
    ["1", "m3", "l", "1000"],
    ["2,4", "kg", "g", "2400"],
    ["1", "t", "kg", "1000"],
    ["0,5", "h", "min", "30"],
    ["1,25", "h", "min", "75"],
    ["1,35", "h", "min", "81"],
    ["72", "kmh", "mps", "20"],
    ["1", "kmh", "mps", "5/18"],
    ["20", "mps", "kmh", "72"],
  ];
  for (const [amount, from, to, expected] of references) {
    const result = convertModelUnit(amount, from, to);
    assert.ok(result.ok, `${amount} ${from} -> ${to}`);
    if (!result.ok) continue;
    assert.equal(formatRational(result.result), expected);
    const back = convertModelUnit(formatRational(result.result), to, from);
    assert.ok(back.ok);
    if (back.ok) assert.deepEqual(back.result, result.amount);
  }
  for (const unit of MODEL_UNITS) {
    const identity = convertModelUnit("0,125", unit.id, unit.id);
    assert.ok(identity.ok);
    if (identity.ok) assert.equal(formatRational(identity.result), "1/8");
  }
});

test("incompatible unit conversions never fabricate missing shape or material data", () => {
  const area = convertModelUnit("1", "m2", "m");
  assert.equal(area.ok, false);
  if (!area.ok) assert.match(area.message, /négyzetes/);
  const volume = convertModelUnit("1", "l", "kg");
  assert.equal(volume.ok, false);
  if (!volume.ok) assert.match(volume.message, /anyagadat/);
  for (const [from, to] of [
    ["m", "m2"],
    ["h", "kg"],
    ["kg", "l"],
  ])
    assert.equal(convertModelUnit("1", from, to).ok, false);
  assert.equal(convertModelUnit("-1", "m", "cm").ok, false);
});

test("unit builder separates conversion from enlarging the physical object", () => {
  assert.equal(unitBuilderModel(1, 1).smallUnits, 10);
  assert.equal(unitBuilderModel(2, 1).smallUnits, 100);
  const cube = unitBuilderModel(3, 1);
  assert.equal(cube.smallUnits, 1000);
  assert.equal(cube.perLayer, 100);
  assert.equal(cube.layers, 10);
  for (const dimension of [1, 2, 3] as const) {
    const base = unitBuilderModel(dimension, 1);
    const doubled = unitBuilderModel(dimension, 2);
    assert.equal(doubled.smallUnits / base.smallUnits, 2 ** dimension);
    assert.equal(doubled.measureDm, 2 ** dimension);
  }
});

test("Hungarian exact display does not turn repeating fractions into rounded equalities", () => {
  assert.equal(exactHungarian(rational(3n, 4n)), "0,75");
  assert.equal(exactHungarian(rational(-5n, 2n)), "−2,5");
  assert.equal(exactHungarian(rational(1n, 3n)), "1/3");
  assert.equal(exactHungarian(rational(1n, 1000n)), "0,001");
  assert.equal(fractionAndDecimal(rational(24n, 5n)), "24/5 = 4,8");
  assert.equal(fractionAndDecimal(rational(24n, 7n)), "24/7");
});

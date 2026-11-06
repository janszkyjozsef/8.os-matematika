import test from "node:test";
import assert from "node:assert/strict";
import { formatRational, rational } from "../src/math/engine.ts";
import {
  ALGEBRA_CASES,
  algebraModel,
  algebraLikeTerms,
  formatAlgebra,
  STORY_MODELS,
  checkStoryModel,
  storyValue,
  powerModel,
  rationalPower,
  powerBuildModel,
  tenPower,
  integerSquareRoot,
  squareRootModel,
  rootOfSquare,
  bridgeNumber,
  bridgeCompare,
  bridgeEqual,
  exactGuess,
} from "../src/math/bridge-models.ts";
import { rMultiply } from "../src/math/foundation-models.ts";

test("algebra: independent handwritten substitution values and collected coefficients", () => {
  const references = [
    ["like", "-2", "3", "5x − 4", "-14", 5],
    ["like", "1/3", "0", "5x − 4", "-7/3", 5],
    ["unlike", "-2", "3", "3x + 2y − 4", "-4", 3],
    ["brackets", "-2", "0", "x + 6", "4", 1],
    ["minus", "-2", "0", "x + 4", "2", 1],
    ["powers", "-2", "0", "x² + x", "2", 1],
    ["powers", "1/2", "0", "x² + x", "3/4", 1],
    ["cancel", "-17/3", "0", "3", "3", 0],
  ] as const;
  for (const [id, x, y, form, expected, coefficient] of references) {
    const model = algebraModel(id, x, y);
    assert.ok(model.ok, id);
    if (!model.ok) continue;
    assert.equal(model.simplified, form);
    assert.equal(formatRational(model.total), expected);
    assert.equal(model.coefficient, coefficient);
  }
});

test("algebra: like terms depend on the complete letter part, not coincident values", () => {
  assert.equal(
    algebraLikeTerms(
      { coefficient: 3, kind: "x" },
      { coefficient: -2, kind: "x" },
    ),
    true,
  );
  assert.equal(
    algebraLikeTerms(
      { coefficient: 1, kind: "x" },
      { coefficient: 1, kind: "y" },
    ),
    false,
  );
  assert.equal(
    algebraLikeTerms(
      { coefficient: 1, kind: "x" },
      { coefficient: 1, kind: "x2" },
    ),
    false,
  );
  assert.equal(
    algebraLikeTerms(
      { coefficient: 4, kind: "constant" },
      { coefficient: -4, kind: "constant" },
    ),
    true,
  );
  assert.equal(
    formatAlgebra([
      { coefficient: 0, kind: "x" },
      { coefficient: -1, kind: "y" },
    ]),
    "−y",
  );
  assert.equal(formatAlgebra([{ coefficient: 0, kind: "x" }]), "0");
  const model = algebraModel("like", "-2", "0");
  assert.ok(model.ok);
  if (model.ok)
    assert.equal(
      formatRational(model.terms[0].value),
      "-6",
      "positive coefficient times negative x is negative",
    );
});

test("algebra: the two distributive rules hold on positive, negative and fractional examples", () => {
  for (const raw of ["-7", "0", "2,5", "1/3"]) {
    const a = algebraModel("brackets", raw, "0");
    const b = algebraModel("minus", raw, "0");
    assert.ok(a.ok && b.ok);
    if (!a.ok || !b.ok) continue;
    assert.equal(a.total.n * a.x.d, a.x.n * a.total.d + 6n * a.x.d * a.total.d);
    assert.equal(b.total.n * b.x.d, b.x.n * b.total.d + 4n * b.x.d * b.total.d);
  }
});

test("algebra: invalid and out-of-range values are rejected without changing input", () => {
  for (const raw of ["21", "-21", "2+3", "NaN", "1/0", "<script>"])
    assert.equal(algebraModel("like", raw, "0").ok, false, raw);
  assert.equal(algebraModel("unlike", "1", "21").ok, false);
  assert.equal(
    algebraModel("like", "1", "not used").ok,
    true,
    "only variables actually present need values",
  );
  assert.equal(ALGEBRA_CASES.length >= 5, true);
});

test("story models: needed data, unknown meaning and equation are all necessary", () => {
  for (const spec of STORY_MODELS) {
    const facts = spec.facts
      .filter((fact) => fact.needed)
      .map((fact) => fact.id);
    assert.equal(
      checkStoryModel(spec.id, facts, spec.correctUnknown, spec.correctModel)
        .ok,
      true,
      spec.id,
    );
    assert.equal(
      checkStoryModel(spec.id, [], spec.correctUnknown, spec.correctModel).ok,
      false,
    );
    assert.equal(
      checkStoryModel(spec.id, facts, "wrong", spec.correctModel).ok,
      false,
    );
    assert.equal(
      checkStoryModel(spec.id, facts, spec.correctUnknown, "wrong").ok,
      false,
    );
  }
  assert.equal(
    checkStoryModel("notebooks", ["count", "total", "pens"], "price", "three")
      .ok,
    false,
  );
  assert.equal(
    checkStoryModel("fare", ["base", "rate", "total"], "distance", "all").ok,
    false,
  );
  assert.equal(
    checkStoryModel("missing", ["side"], "side", "square").ok,
    false,
  );
});

test("story solutions satisfy the original sum, difference, fee and unit-price facts", () => {
  const fare = storyValue("fare", "6");
  const lengths = storyValue("lengths", "14");
  const notebooks = storyValue("notebooks", "500");
  assert.ok(fare.ok && lengths.ok && notebooks.ok);
  if (!fare.ok || !lengths.ok || !notebooks.ok) return;
  assert.equal(formatRational(fare.left), "1700");
  assert.equal(fare.matches, true);
  assert.equal(formatRational(lengths.second!), "20");
  assert.equal(formatRational(lengths.left), "34");
  assert.equal(lengths.matches, true);
  assert.equal(formatRational(notebooks.left), "1500");
  assert.equal(notebooks.matches, true);
  const fractionalDistance = storyValue("fare", "1/3");
  assert.ok(fractionalDistance.ok);
  if (fractionalDistance.ok)
    assert.equal(formatRational(fractionalDistance.left), "1700/3");
});

test("a missing rectangle side cannot produce a unique area; irrelevant ribbon is unused", () => {
  const one = storyValue("missing", "1");
  const two = storyValue("missing", "2");
  const third = storyValue("missing", "1/3");
  assert.ok(one.ok && two.ok && third.ok);
  if (!one.ok || !two.ok || !third.ok) return;
  assert.equal(formatRational(one.left), "12");
  assert.equal(formatRational(two.left), "24");
  assert.equal(formatRational(third.left), "4");
  assert.equal(one.target, null);
  assert.equal(two.matches, false);
});

test("story candidates enforce the explicit real-world domains", () => {
  assert.equal(storyValue("fare", "0").ok, true);
  assert.equal(storyValue("fare", "-1").ok, false);
  assert.equal(storyValue("fare", "51").ok, false);
  assert.equal(storyValue("lengths", "0").ok, false);
  assert.equal(storyValue("missing", "0").ok, false);
  assert.equal(storyValue("notebooks", "1/2").ok, false);
  assert.equal(storyValue("notebooks", "2001").ok, false);
});

test("powers: repeated multiplication and the location of the minus sign have different values", () => {
  const cases = [
    ["3", 2, "positive", "9"],
    ["3", 2, "negative-base", "9"],
    ["3", 2, "minus-outside", "-9"],
    ["3", 3, "negative-base", "-27"],
    ["3", 3, "minus-outside", "-27"],
    ["2/3", 3, "positive", "8/27"],
    ["1/2", 2, "negative-base", "1/4"],
    ["1/2", 2, "minus-outside", "-1/4"],
    ["2", 8, "positive", "256"],
  ] as const;
  for (const [raw, exponent, placement, expected] of cases) {
    const model = powerModel(raw, exponent, placement);
    assert.ok(model.ok, `${raw} ^ ${exponent}, ${placement}`);
    if (model.ok) assert.equal(formatRational(model.value), expected);
  }
  const outside = powerModel("3", 2, "minus-outside");
  assert.ok(outside.ok);
  if (outside.ok) assert.equal(outside.repeated, "−[(3) · (3)]");
});

test("powers: zero exponent requires a nonzero base and an outside minus remains outside", () => {
  for (const placement of [
    "positive",
    "negative-base",
    "minus-outside",
  ] as const) {
    const model = powerModel("7", 0, placement);
    assert.ok(model.ok);
    if (model.ok)
      assert.equal(
        formatRational(model.value),
        placement === "minus-outside" ? "-1" : "1",
      );
    assert.equal(powerModel("0", 0, placement).ok, false);
  }
  const zero = powerModel("0", 3, "negative-base");
  assert.ok(zero.ok);
  if (zero.ok) assert.equal(formatRational(zero.value), "0");
  assert.throws(() => rationalPower(rational(0n), 0));
});

test("power models reject exponents or magnitudes outside the displayed teaching range", () => {
  for (const exponent of [-1, 1.5, 9, Infinity, NaN])
    assert.equal(powerModel("3", exponent, "positive").ok, false);
  for (const raw of ["-3", "11", "1/0", "2**3", "1/1000000"])
    assert.equal(powerModel(raw, 2, "positive").ok, false);
  assert.throws(() => rationalPower(rational(2n), 9));
  assert.throws(() => rationalPower(rational(2n), 1.5));
});

test("the largest supported fractional powers still have enterable exact answers", () => {
  const model = powerModel("999983/999979", 8, "positive");
  assert.ok(model.ok);
  if (!model.ok) return;
  const answer = formatRational(model.value);
  assert.ok(answer.length > 80, "an exact answer can be longer than its input");
  assert.ok(
    answer.length <= 180,
    "the prediction field uses the full scalar answer limit",
  );
  assert.equal(exactGuess(answer, model.value), "correct");
});

test("square and cube builders count whole rows and layers and scale by 4 and 8", () => {
  const square = powerBuildModel(2, 2);
  const doubleSquare = powerBuildModel(4, 2);
  const cube = powerBuildModel(2, 3);
  const doubleCube = powerBuildModel(4, 3);
  assert.ok(square.ok && doubleSquare.ok && cube.ok && doubleCube.ok);
  if (!square.ok || !doubleSquare.ok || !cube.ok || !doubleCube.ok) return;
  assert.equal(square.units, 4);
  assert.equal(doubleSquare.units, 16);
  assert.equal(doubleSquare.units / square.units, 4);
  assert.equal(cube.units, 8);
  assert.equal(doubleCube.perLayer, 16);
  assert.equal(doubleCube.layers, 4);
  assert.equal(doubleCube.units, 64);
  assert.equal(doubleCube.units / cube.units, 8);
  assert.equal(powerBuildModel(1.5, 3).ok, false);
  assert.equal(powerBuildModel(6, 2).ok, false);
});

test("powers of ten include exact reciprocals and change tenfold between adjacent exponents", () => {
  assert.equal(formatRational(tenPower(-6)!), "1/1000000");
  assert.equal(formatRational(tenPower(-2)!), "1/100");
  assert.equal(formatRational(tenPower(0)!), "1");
  assert.equal(formatRational(tenPower(6)!), "1000000");
  for (let exponent = -6; exponent < 6; exponent++)
    assert.ok(
      bridgeEqual(
        rMultiply(tenPower(exponent)!, rational(10n)),
        tenPower(exponent + 1)!,
      ),
    );
  assert.equal(tenPower(-7), null);
  assert.equal(tenPower(1.5), null);
});

test("integer square root brackets the input exactly, including large non-squares", () => {
  for (const n of [
    0n,
    1n,
    2n,
    15n,
    16n,
    17n,
    999999999999999999999999n,
    1000000000000000000000000n,
  ]) {
    const root = integerSquareRoot(n);
    assert.ok(root * root <= n);
    assert.ok((root + 1n) * (root + 1n) > n);
  }
  assert.throws(() => integerSquareRoot(-1n));
});

test("square roots of rational squares are exact and principal roots are nonnegative", () => {
  for (const [raw, expected] of [
    ["0", "0"],
    ["1", "1"],
    ["36", "6"],
    ["400", "20"],
    ["1/4", "1/2"],
    ["100/9", "10/3"],
    ["2,25", "3/2"],
  ]) {
    const model = squareRootModel(raw, 3);
    assert.ok(model.ok && model.exact, raw);
    if (!model.ok || !model.exact) continue;
    assert.equal(formatRational(model.exact), expected);
    assert.ok(model.exact.n >= 0n);
    assert.ok(bridgeEqual(rMultiply(model.exact, model.exact), model.area));
    assert.equal(model.equationRootCount, raw === "0" ? 1 : 2);
  }
});

test("sqrt(2) is successively enclosed by independently known decimal bounds", () => {
  const references = [
    [0, "1", "2", "1"],
    [1, "7/5", "3/2", "7/5"],
    [2, "141/100", "71/50", "141/100"],
    [3, "707/500", "283/200", "707/500"],
  ] as const;
  for (const [precision, lower, upper, rounded] of references) {
    const model = squareRootModel("2", precision);
    assert.ok(model.ok);
    if (!model.ok) continue;
    assert.equal(model.exact, null);
    assert.equal(formatRational(model.lower), lower);
    assert.equal(formatRational(model.upper), upper);
    assert.equal(formatRational(model.approximation), rounded);
    assert.equal(model.exactAtPrecision, false);
    assert.equal(
      bridgeCompare(rMultiply(model.lower, model.lower), model.area),
      -1,
    );
    assert.equal(
      bridgeCompare(rMultiply(model.upper, model.upper), model.area),
      1,
    );
  }
});

test("rounding and exact roots stay separate near a square and at rational boundaries", () => {
  const belowFour = squareRootModel("3,99", 1);
  assert.ok(belowFour.ok);
  if (belowFour.ok) {
    assert.equal(belowFour.exact, null);
    assert.equal(formatRational(belowFour.lower), "19/10");
    assert.equal(formatRational(belowFour.upper), "2");
    assert.equal(formatRational(belowFour.approximation), "2");
    assert.equal(belowFour.exactAtPrecision, false);
  }
  const rationalRoot = squareRootModel("1/9", 3);
  assert.ok(rationalRoot.ok && rationalRoot.exact);
  if (rationalRoot.ok && rationalRoot.exact) {
    assert.equal(formatRational(rationalRoot.exact), "1/3");
    assert.equal(formatRational(rationalRoot.approximation), "333/1000");
    assert.equal(rationalRoot.exactAtPrecision, false);
  }
});

test("negative radicands and out-of-range values yield explanations, not NaN or false roots", () => {
  const negative = squareRootModel("-4", 2);
  assert.equal(negative.ok, false);
  if (!negative.ok) assert.match(negative.message, /Valós számok között/);
  for (const raw of ["401", "1/0", "NaN", "Infinity", "Math.sqrt(4)"])
    assert.equal(squareRootModel(raw, 2).ok, false);
  assert.equal(squareRootModel("2", -1).ok, false);
  assert.equal(squareRootModel("2", 4).ok, false);
});

test("sqrt(a²) is |a| for negative, zero, positive and fractional original numbers", () => {
  for (const [raw, square, root] of [
    ["-5", "25", "5"],
    ["0", "0", "0"],
    ["2,5", "25/4", "5/2"],
    ["-1/3", "1/9", "1/3"],
  ]) {
    const model = rootOfSquare(raw);
    assert.ok(model.ok);
    if (!model.ok) continue;
    assert.equal(formatRational(model.square), square);
    assert.equal(formatRational(model.root), root);
    assert.ok(model.root.n >= 0n);
  }
  assert.equal(rootOfSquare("21").ok, false);
});

test("teaching numeric boundaries retain accepted exact fractions and reject executable syntax", () => {
  assert.deepEqual(bridgeNumber("1/3"), rational(1n, 3n));
  assert.deepEqual(bridgeNumber("0,125"), rational(1n, 8n));
  assert.equal(bridgeNumber("0,1234567890123"), null);
  assert.equal(bridgeNumber("globalThis.x=1"), null);
  assert.equal(bridgeNumber("4".repeat(81)), null);
});

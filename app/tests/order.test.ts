import test from "node:test";
import assert from "node:assert/strict";
import { formatRational } from "../src/math/engine.ts";
import {
  applyOrderStep,
  formatOrderExpression,
  getOrderChoices,
  orderLiteralValue,
  orderStepValue,
  parseOrderExpression,
  replayOrderSteps,
} from "../src/math/order.ts";
import type { OrderNode } from "../src/math/order.ts";

function parse(source: string): OrderNode {
  const result = parseOrderExpression(source);
  assert.equal(result.ok, true, source);
  if (!result.ok) throw new Error(result.message);
  return result.tree;
}
function solve(source: string, fromRight = false): string {
  let tree = parse(source);
  for (let step = 0; step < 90; step++) {
    const done = orderLiteralValue(tree);
    if (done) return formatRational(done);
    const candidates = getOrderChoices(tree).filter((choice) => choice.ready);
    assert.ok(candidates.length, source);
    const choice = fromRight ? candidates.at(-1)! : candidates[0];
    const result = orderStepValue(tree, choice.nodeId!);
    if (!result.ok) return result.undefined ? "undefined" : result.message;
    const applied = applyOrderStep(
      tree,
      choice.nodeId!,
      formatRational(result.value),
    );
    assert.equal(applied.status, "correct");
    tree = applied.tree;
  }
  throw new Error("Unexpected step count");
}

test("order lab: hand-calculated whole-expression reference values", () => {
  const cases = [
    ["24 : 6 × 2", "8"],
    ["5 × 2 + 3 × 4", "22"],
    ["2 × (3 + 4)", "14"],
    ["−3²", "-9"],
    ["(−3)²", "9"],
    ["8 : (3 − 3)", "undefined"],
    ["30 − 18 : 3 + 2 × 4", "32"],
    ["18 - 7 + 2", "13"],
    ["20 : 5 : 2", "2"],
    ["2 × [3 + (7 − 5)]", "10"],
    ["1 : 3 + 1 : 6", "1/2"],
    ["0,1 + 0,2", "3/10"],
    ["2^2^3", "256"],
    ["(2^2)^3", "64"],
    ["3*(-2+1)", "-3"],
    ["-(4-2)*3+2", "-4"],
    ["0/0", "undefined"],
  ];
  for (const [source, expected] of cases) {
    assert.equal(solve(source), expected, source);
    assert.equal(
      solve(source, true),
      expected,
      `reverse independent order: ${source}`,
    );
  }
});

test("24:6×2 follows the left association, with a separate interpretation feedback", () => {
  const tree = parse("24:6*2");
  const choices = getOrderChoices(tree);
  assert.deepEqual(
    choices.filter((choice) => choice.ready).map((choice) => choice.expression),
    ["24 : 6"],
  );
  const regroup = choices.find((choice) => choice.expression === "6 × 2");
  assert.ok(regroup);
  assert.equal(regroup.ready, false);
  assert.equal(regroup.nodeId, undefined);
  assert.match(regroup.reason, /másik kifejezést/);
  const blocked = choices.find(
    (choice) => choice.nodeId !== undefined && !choice.ready,
  )!;
  const applied = applyOrderStep(tree, blocked.nodeId!, "12");
  assert.equal(applied.status, "blocked");
  assert.equal(applied.tree, tree);
});

test("both independent multiplications can begin and lead to 22", () => {
  const tree = parse("5*2+3*4");
  const options = getOrderChoices(tree).filter((choice) => choice.ready);
  assert.deepEqual(
    options.map((choice) => choice.expression),
    ["5 × 2", "3 × 4"],
  );
  assert.equal(
    formatOrderExpression(applyOrderStep(tree, options[0].nodeId!, "10").tree),
    "10 + 3 × 4",
  );
  assert.equal(
    formatOrderExpression(applyOrderStep(tree, options[1].nodeId!, "12").tree),
    "5 × 2 + 12",
  );
});

test("grouping remains structural, while independent outside products are allowed", () => {
  const choices = getOrderChoices(parse("2*(3+4)+5*6")).filter(
    (choice) => choice.ready,
  );
  assert.deepEqual(
    choices.map((choice) => choice.expression),
    ["3 + 4", "5 × 6"],
  );
  // Independent branches can be reduced without changing precedence/association.
  const scope = getOrderChoices(parse("2+3+4*5"));
  assert.equal(
    scope.find((choice) => choice.expression === "2 + 3")?.ready,
    true,
  );
  assert.deepEqual(
    getOrderChoices(parse("2*3+4^2"))
      .filter((choice) => choice.ready)
      .map((choice) => choice.expression),
    ["2 × 3", "4²"],
  );
  assert.equal(
    getOrderChoices(parse("2+3*4")).some(
      (choice) => choice.expression === "2 + 3",
    ),
    false,
  );
});

test("unary minus and a negative power base remain distinct until finished", () => {
  const ungrouped = parse("-3²");
  const grouped = parse("(-3)²");
  assert.equal(formatOrderExpression(ungrouped), "−3²");
  assert.equal(formatOrderExpression(grouped), "(−3)²");
  assert.equal(
    getOrderChoices(ungrouped).filter((choice) => choice.ready)[0].expression,
    "3²",
  );
  assert.equal(
    getOrderChoices(grouped).filter((choice) => choice.ready)[0].expression,
    "(−3)²",
  );
});

test("unary plus preserves a grouped value and never describes it as its opposite", () => {
  const tree = parse("+(2+3)");
  const sum = getOrderChoices(tree).find((choice) => choice.ready)!;
  const after = applyOrderStep(tree, sum.nodeId!, "5").tree;
  const plus = getOrderChoices(after).find((choice) => choice.ready)!;
  assert.equal(plus.operation, "Pozitív előjel feloldása");
  assert.doesNotMatch(plus.reason, /mínusz|ellentett/);
  assert.equal(solve("+(2+3)"), "5");
});

test("a wrong value is distinct from an invalid choice and never changes the expression", () => {
  const tree = parse("2*(3+4)");
  const id = getOrderChoices(tree).find((choice) => choice.ready)!.nodeId!;
  assert.equal(applyOrderStep(tree, id, "8").status, "incorrect");
  assert.equal(applyOrderStep(tree, id, "3+4").status, "invalid");
  assert.equal(applyOrderStep(tree, id, "8").tree, tree);
  assert.equal(
    formatOrderExpression(applyOrderStep(tree, id, "7").tree),
    "2 × (7)",
  );
});

test("zero division stops with a mathematical explanation, never a numeric surrogate", () => {
  const tree = parse("8/(3-3)");
  const first = getOrderChoices(tree).find((choice) => choice.ready)!.nodeId!;
  const next = applyOrderStep(tree, first, "0").tree;
  const division = getOrderChoices(next).find(
    (choice) => choice.ready,
  )!.nodeId!;
  const result = applyOrderStep(next, division, "0");
  assert.equal(result.status, "undefined");
  assert.match(result.message, /nincs értelmezve/);
  assert.equal(orderLiteralValue(result.tree), null);
  assert.equal(result.tree, next);
});

test("step history replays deterministically and rejects an invalid saved step", () => {
  const tree = parse("5*2+3*4");
  const id = getOrderChoices(tree).filter((choice) => choice.ready)[1].nodeId!;
  const replay = replayOrderSteps("5*2+3*4", [id]);
  assert.ok(replay.ok);
  if (!replay.ok) return;
  assert.equal(replay.history.length, 1);
  assert.equal(replay.history[0].before, "5 × 2 + 3 × 4");
  assert.equal(replay.history[0].after, "5 × 2 + 12");
  const invalid = replayOrderSteps("5*2+3*4", [id, 999]);
  assert.ok(invalid.ok);
  if (invalid.ok) {
    assert.equal(invalid.history.length, 1);
    assert.match(invalid.warning, /nem folytatható/);
  }
});

test("unsupported syntax and resource-heavy input are rejected without executing anything", () => {
  for (const source of [
    "",
    "2(3+4)",
    "1..2",
    "2**3",
    "Math.random()",
    "globalThis.process.exit()",
    "1;2",
    "[2+3)",
    "a+2",
    "1e3",
    "9".repeat(13),
    "(".repeat(40) + "1" + ")".repeat(40),
    "2+".repeat(150) + "2",
  ]) {
    assert.equal(parseOrderExpression(source).ok, false, source);
  }
  assert.match(solve("2^9"), /0 és 8/);
  assert.equal(solve("0^0"), "undefined");
});

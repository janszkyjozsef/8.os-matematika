import { formatRational, parseRational, rational } from "./engine.ts";
import type { Rational } from "./engine.ts";

/** A deliberately small arithmetic grammar. No source text is executed. */
export type OrderNode =
  | { kind: "number"; id: number; value: Rational }
  | { kind: "group"; id: number; bracket: "(" | "["; child: OrderNode }
  | { kind: "unary"; id: number; operator: "+" | "-"; child: OrderNode }
  | {
      kind: "binary";
      id: number;
      operator: "+" | "-" | "*" | "/" | "^";
      left: OrderNode;
      right: OrderNode;
    };

type OperatorNode = Extract<OrderNode, { kind: "binary" | "unary" }>;
export interface OrderChoice {
  key: string;
  nodeId?: number;
  expression: string;
  operation: string;
  ready: boolean;
  reason: string;
}
export type OrderValueResult =
  | { ok: true; value: Rational }
  | { ok: false; message: string; undefined: boolean };
export type OrderParseResult =
  { ok: true; tree: OrderNode } | { ok: false; message: string };

const MAX_LENGTH = 220;
const MAX_NODES = 90;
const MAX_DEPTH = 18;
const MAX_RESULT_DIGITS = 160;
const symbols: Record<string, string> = {
  "+": "+",
  "-": "−",
  "*": "×",
  "/": ":",
  "^": "^",
};
const operationNames: Record<string, string> = {
  "+": "Összeadás",
  "-": "Kivonás",
  "*": "Szorzás",
  "/": "Osztás",
  "^": "Hatványozás",
};

export function parseOrderExpression(source: string): OrderParseResult {
  if (typeof source !== "string" || !source.trim())
    return { ok: false, message: "Előbb írj be egy rövid kifejezést." };
  if (source.length > MAX_LENGTH)
    return {
      ok: false,
      message:
        "A műhely legfeljebb 220 karakteres kifejezést kezel. Bontsd kisebb részekre.",
    };
  const text = source
    .replace(/[−﹣－]/g, "-")
    .replace(/[×·∙]/g, "*")
    .replace(/[:÷]/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3");
  const tokens: string[] = [];
  let position = 0;
  while (position < text.length) {
    const rest = text.slice(position);
    if (/^\s/.test(rest)) {
      position++;
      continue;
    }
    const token = rest.match(/^(?:\d+(?:[.,]\d+)?|[.,]\d+|[+\-*/^()[\]])/);
    if (!token)
      return {
        ok: false,
        message:
          "Itt számokat, +, −, ×, :, ^ és kerek vagy szögletes zárójeleket használhatsz. Szorzást mindig jelölj külön.",
      };
    tokens.push(token[0]);
    position += token[0].length;
  }
  let cursor = 0;
  let nextId = 0;
  let depth = 0;
  const id = () => {
    if (++nextId > MAX_NODES)
      throw new Error("Túl sok részszámítás. Válassz rövidebb kifejezést.");
    return nextId;
  };
  const nested = <T>(action: () => T): T => {
    if (++depth > MAX_DEPTH)
      throw new Error(
        "Túl sok egymásba ágyazott zárójel vagy hatvány. Bontsd kisebb részekre.",
      );
    try {
      return action();
    } finally {
      depth--;
    }
  };
  function primary(): OrderNode {
    const token = tokens[cursor++];
    if (token === "(" || token === "[") {
      const child = nested(sum);
      const closing = token === "(" ? ")" : "]";
      if (tokens[cursor++] !== closing)
        throw new Error(`A ${token} zárójelhez ${closing} zárójel kell.`);
      return { kind: "group", id: id(), bracket: token, child };
    }
    if (!token || !/^(?:\d|[.,])/.test(token))
      throw new Error("Itt egy szám vagy egy zárójelbe zárt rész hiányzik.");
    if (token.replace(/[.,]/g, "").length > 12)
      throw new Error(
        "Egy szám legfeljebb 12 számjegyű lehet ebben a műhelyben.",
      );
    const value = parseRational(token);
    if (!value)
      throw new Error(
        "Ez a szám nem olvasható. Például 2,5 vagy 12 használható.",
      );
    return { kind: "number", id: id(), value };
  }
  function power(): OrderNode {
    const left = primary();
    if (tokens[cursor] !== "^") return left;
    cursor++;
    const right = nested(unary);
    return { kind: "binary", id: id(), operator: "^", left, right };
  }
  function unary(): OrderNode {
    const token = tokens[cursor];
    if (token !== "+" && token !== "-") return power();
    cursor++;
    const child = nested(unary);
    // A sign on a literal names a number. A sign before a power remains a
    // distinct operation, which is why -3^2 and (-3)^2 stay different trees.
    if (child.kind === "number")
      return {
        ...child,
        value: rational(
          token === "-" ? -child.value.n : child.value.n,
          child.value.d,
        ),
      };
    return { kind: "unary", id: id(), operator: token, child };
  }
  function product(): OrderNode {
    let node = unary();
    while (tokens[cursor] === "*" || tokens[cursor] === "/") {
      const operator = tokens[cursor++] as "*" | "/";
      const right = unary();
      node = { kind: "binary", id: id(), operator, left: node, right };
    }
    return node;
  }
  function sum(): OrderNode {
    let node = product();
    while (tokens[cursor] === "+" || tokens[cursor] === "-") {
      const operator = tokens[cursor++] as "+" | "-";
      const right = product();
      node = { kind: "binary", id: id(), operator, left: node, right };
    }
    return node;
  }
  try {
    const tree = sum();
    if (cursor !== tokens.length)
      throw new Error(
        "Két szám vagy zárójel között jelöld a műveletet; ellenőrizd a zárójelek párját is.",
      );
    return { ok: true, tree };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error ? error.message : "A kifejezés nem olvasható.",
    };
  }
}

/** A group containing a single number is already a known operand. */
export function orderLiteralValue(node: OrderNode): Rational | null {
  if (node.kind === "number") return node.value;
  return node.kind === "group" ? orderLiteralValue(node.child) : null;
}

function priority(node: OrderNode): number {
  if (node.kind === "number" || node.kind === "group") return 5;
  if (node.kind === "unary") return 3;
  return node.operator === "^"
    ? 4
    : node.operator === "*" || node.operator === "/"
      ? 2
      : 1;
}

export function formatOrderNumber(value: Rational): string {
  return formatRational(value).replace(/-/g, "−");
}

export function formatOrderExpression(node: OrderNode): string {
  if (node.kind === "number") return formatOrderNumber(node.value);
  if (node.kind === "group")
    return `${node.bracket}${formatOrderExpression(node.child)}${node.bracket === "(" ? ")" : "]"}`;
  if (node.kind === "unary") {
    const body = formatOrderExpression(node.child);
    return `${symbols[node.operator]}${priority(node.child) < priority(node) ? `(${body})` : body}`;
  }
  const operand = (child: OrderNode, side: "left" | "right") => {
    const body = formatOrderExpression(child);
    const literal = orderLiteralValue(child);
    const negative =
      child.kind !== "group" && literal !== null && literal.n < 0n;
    const fraction = child.kind === "number" && child.value.d !== 1n;
    const protect =
      priority(child) < priority(node) ||
      (side === "right" &&
        child.kind === "binary" &&
        priority(child) === priority(node) &&
        node.operator !== "^") ||
      (side === "left" &&
        node.operator === "^" &&
        child.kind === "binary" &&
        child.operator === "^") ||
      (negative && (side === "right" || node.operator === "^")) ||
      (fraction && (node.operator === "^" || node.operator === "/"));
    return protect ? `(${body})` : body;
  };
  const left = operand(node.left, "left");
  const right = operand(node.right, "right");
  const power = orderLiteralValue(node.right);
  if (
    node.operator === "^" &&
    power?.d === 1n &&
    (power.n === 2n || power.n === 3n)
  )
    return `${left}${power.n === 2n ? "²" : "³"}`;
  return `${left} ${symbols[node.operator]} ${right}`;
}

function operators(tree: OrderNode): { node: OperatorNode; scope: number }[] {
  const nodes: { node: OperatorNode; scope: number }[] = [];
  function visit(node: OrderNode, scope: number): void {
    if (node.kind === "group") visit(node.child, node.id);
    else if (node.kind === "unary") {
      visit(node.child, scope);
      nodes.push({ node, scope });
    } else if (node.kind === "binary") {
      visit(node.left, scope);
      visit(node.right, scope);
      nodes.push({ node, scope });
    }
  }
  visit(tree, 0);
  return nodes;
}

function readyOperands(node: OperatorNode): boolean {
  return node.kind === "unary"
    ? orderLiteralValue(node.child) !== null
    : orderLiteralValue(node.left) !== null &&
        orderLiteralValue(node.right) !== null;
}

export function getOrderChoices(tree: OrderNode): OrderChoice[] {
  const entries = operators(tree);
  const choices = entries.map(({ node, scope }): OrderChoice => {
    const operands = readyOperands(node);
    // The parsed dependency tree already embodies precedence and association.
    // Different independent branches can be reduced in either order even when
    // their operators have different precedence; their values do not interact.
    const ready = operands;
    let reason: string;
    if (!operands)
      reason =
        "Előbb számold ki ennek a műveletnek a még összetett operandusát. A zárójel vagy az előző részszámítás egy egységként kapcsolódik hozzá.";
    else if (node.kind === "unary")
      reason =
        node.operator === "-"
          ? "A mínusz az egész utána álló érték ellentettjét jelenti. Az utána álló teljes rész értékét már kiszámoltuk."
          : "Az előtte álló plusz nem változtatja meg az egész utána álló rész értékét. Ennek a résznek az értékét már kiszámoltuk.";
    else if (node.operator === "^")
      reason =
        "A hatványt az előtte álló ellentettképzés és a szorzás előtt számoljuk ki. A zárójel határozza meg, mi tartozik az alaphoz.";
    else if (node.operator === "*" || node.operator === "/")
      reason =
        "A szorzás és az osztás azonos szintű. Egy láncban balról jobbra kapcsolódnak; a független részszámítások sorrendje választható.";
    else
      reason = `${scope ? "A zárójel ezt a részt egy egységgé csoportosítja. " : ""}Ennek a műveletnek mindkét operandusa már ismert. Az összeadás és kivonás azonos szintű; egy láncban balról jobbra haladunk. Másik, független ág részszámítása ettől még megmaradhat.`;
    return {
      key: `node-${node.id}`,
      nodeId: node.id,
      expression: formatOrderExpression(node),
      operation:
        node.kind === "unary"
          ? node.operator === "-"
            ? "Ellentett képzése"
            : "Pozitív előjel feloldása"
          : operationNames[node.operator],
      ready,
      reason,
    };
  });
  // A deliberate interpretation choice makes the familiar 24:6×2 error
  // observable without ever replacing the real expression with a new one.
  for (const { node } of entries) {
    if (
      node.kind !== "binary" ||
      node.operator !== "*" ||
      node.left.kind !== "binary" ||
      node.left.operator !== "/"
    )
      continue;
    if (!orderLiteralValue(node.left.right) || !orderLiteralValue(node.right))
      continue;
    const tempting = `${formatOrderExpression(node.left.right)} × ${formatOrderExpression(node.right)}`;
    choices.push({
      key: `regroup-${node.id}`,
      expression: tempting,
      operation: "Másik csoportosítás?",
      ready: false,
      reason: `A ${formatOrderExpression(node)} kifejezésben a szorzás és osztás azonos szintű. A ${tempting} összevonásával új zárójelet tennél az osztóba, és másik kifejezést oldanál meg. Előbb a ${formatOrderExpression(node.left)} osztás következik.`,
    });
  }
  return choices;
}

function findOperator(tree: OrderNode, id: number): OperatorNode | undefined {
  return operators(tree).find((entry) => entry.node.id === id)?.node;
}

export function orderStepValue(tree: OrderNode, id: number): OrderValueResult {
  const choice = getOrderChoices(tree).find((entry) => entry.nodeId === id);
  const node = findOperator(tree, id);
  if (!choice?.ready || !node)
    return {
      ok: false,
      undefined: false,
      message: choice?.reason ?? "Ez nem választható részszámítás.",
    };
  const first = orderLiteralValue(
    node.kind === "unary" ? node.child : node.left,
  )!;
  let value: Rational;
  if (node.kind === "unary")
    value = rational(node.operator === "-" ? -first.n : first.n, first.d);
  else {
    const second = orderLiteralValue(node.right)!;
    switch (node.operator) {
      case "+":
        value = rational(
          first.n * second.d + second.n * first.d,
          first.d * second.d,
        );
        break;
      case "-":
        value = rational(
          first.n * second.d - second.n * first.d,
          first.d * second.d,
        );
        break;
      case "*":
        value = rational(first.n * second.n, first.d * second.d);
        break;
      case "/":
        if (second.n === 0n)
          return {
            ok: false,
            undefined: true,
            message:
              "A nevező 0. Nullával nem lehet osztani: nincs olyan egyértelmű szám, amellyel a 0-t szorozva visszakapnánk az osztandót. A teljes kifejezés nincs értelmezve.",
          };
        value = rational(first.n * second.d, first.d * second.n);
        break;
      case "^":
        if (second.d !== 1n || second.n < 0n || second.n > 8n)
          return {
            ok: false,
            undefined: false,
            message:
              "Ez a műhely 0 és 8 közötti egész kitevőt kezel. A kifejezés nincs megváltoztatva; válassz ennek megfelelő példát.",
          };
        if (first.n === 0n && second.n === 0n)
          return {
            ok: false,
            undefined: true,
            message:
              "A 0⁰ ebben az iskolai hatványfogalomban nincs értelmezve. Nem helyettesítjük találomra egy számmal.",
          };
        value = rational(first.n ** second.n, first.d ** second.n);
        break;
    }
  }
  if (
    String(value.n).length > MAX_RESULT_DIGITS ||
    String(value.d).length > MAX_RESULT_DIGITS
  )
    return {
      ok: false,
      undefined: false,
      message:
        "Ez az eredmény túl nagy ehhez a szemléltető műhelyhez. A kifejezést nem kerekítettük és nem írtuk át.",
    };
  return { ok: true, value };
}

function replaceNode(tree: OrderNode, id: number, value: Rational): OrderNode {
  if (tree.id === id) return { kind: "number", id, value };
  if (tree.kind === "unary" || tree.kind === "group")
    return { ...tree, child: replaceNode(tree.child, id, value) };
  if (tree.kind === "binary")
    return {
      ...tree,
      left: replaceNode(tree.left, id, value),
      right: replaceNode(tree.right, id, value),
    };
  return tree;
}

export function applyOrderStep(
  tree: OrderNode,
  id: number,
  answer: string,
): {
  status: "correct" | "incorrect" | "invalid" | "blocked" | "undefined";
  tree: OrderNode;
  message: string;
} {
  const result = orderStepValue(tree, id);
  if (!result.ok)
    return {
      status: result.undefined ? "undefined" : "blocked",
      tree,
      message: result.message,
    };
  const parsed = parseRational(answer);
  if (!parsed)
    return {
      status: "invalid",
      tree,
      message:
        "A részszámítás eredményét írd be számként vagy egyszerű törtként, például −2, 0,5 vagy 1/2.",
    };
  if (parsed.n * result.value.d !== result.value.n * parsed.d)
    return {
      status: "incorrect",
      tree,
      message:
        "A kiválasztott rész kiszámítható, de az érték még nem helyes. Ellenőrizd ennek a műveletnek a számolását; a teljes kifejezést egyelőre nem változtattuk meg.",
    };
  return {
    status: "correct",
    tree: replaceNode(tree, id, result.value),
    message: getOrderChoices(tree).find((entry) => entry.nodeId === id)!.reason,
  };
}

export interface OrderHistoryEntry {
  id: number;
  before: string;
  after: string;
  part: string;
  reason: string;
}
export function replayOrderSteps(
  source: string,
  steps: number[],
):
  | {
      ok: true;
      tree: OrderNode;
      history: OrderHistoryEntry[];
      warning: string;
    }
  | { ok: false; message: string } {
  const parsed = parseOrderExpression(source);
  if (!parsed.ok) return parsed;
  let tree = parsed.tree;
  const history: OrderHistoryEntry[] = [];
  for (const id of steps.slice(0, MAX_NODES)) {
    const choice = getOrderChoices(tree).find((entry) => entry.nodeId === id);
    const result = orderStepValue(tree, id);
    if (!result.ok || !choice)
      return {
        ok: true,
        tree,
        history,
        warning:
          "A mentett lépéssor itt nem folytatható. Az eddigi érvényes lépések megmaradtak; lépj vissza vagy kezdd újra a példát.",
      };
    const before = formatOrderExpression(tree);
    tree = replaceNode(tree, id, result.value);
    history.push({
      id,
      before,
      after: formatOrderExpression(tree),
      part: choice.expression,
      reason: choice.reason,
    });
  }
  return { ok: true, tree, history, warning: "" };
}

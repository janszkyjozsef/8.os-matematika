import { formatRational, parseRational, rational } from "./engine.ts";
import type { Rational } from "./engine.ts";
import {
  exactHungarian,
  rAdd,
  rMultiply,
  rEqual,
} from "./foundation-models.ts";

const ZERO = rational(0n);
const ONE = rational(1n);
export const bridgeEqual = rEqual;
export const bridgeAbs = (a: Rational) => rational(a.n < 0n ? -a.n : a.n, a.d);
export const bridgeCompare = (a: Rational, b: Rational) =>
  a.n * b.d < b.n * a.d ? -1 : a.n * b.d > b.n * a.d ? 1 : 0;

/** Explicit finite teaching range; invalid input is rejected, never clamped. */
export function bridgeNumber(raw: string, limit = 400): Rational | null {
  if (typeof raw !== "string" || raw.length > 80) return null;
  const value = parseRational(raw);
  if (
    !value ||
    bridgeAbs(value).n > BigInt(limit) * value.d ||
    String(bridgeAbs(value).n).length > 12 ||
    String(value.d).length > 12
  )
    return null;
  return value;
}

export type AlgebraKind = "x2" | "x" | "y" | "constant";
export interface AlgebraTerm {
  coefficient: number;
  kind: AlgebraKind;
}
export type AlgebraCaseId =
  "like" | "unlike" | "brackets" | "minus" | "powers" | "cancel";
export interface AlgebraCase {
  id: AlgebraCaseId;
  title: string;
  expression: string;
  terms: readonly AlgebraTerm[];
  focus: AlgebraKind;
  expansion?: {
    options: readonly { id: string; text: string }[];
    correct: string;
    why: string;
  };
}
export const ALGEBRA_CASES: readonly AlgebraCase[] = [
  {
    id: "like",
    title: "Egynemű tagok",
    expression: "3x + 2x − 4",
    terms: [
      { coefficient: 3, kind: "x" },
      { coefficient: 2, kind: "x" },
      { coefficient: -4, kind: "constant" },
    ],
    focus: "x",
  },
  {
    id: "unlike",
    title: "Két különböző betű",
    expression: "3x + 2y − 4",
    terms: [
      { coefficient: 3, kind: "x" },
      { coefficient: 2, kind: "y" },
      { coefficient: -4, kind: "constant" },
    ],
    focus: "x",
  },
  {
    id: "brackets",
    title: "Szorzás a zárójel minden tagjával",
    expression: "2(x + 3) − x",
    terms: [
      { coefficient: 2, kind: "x" },
      { coefficient: 6, kind: "constant" },
      { coefficient: -1, kind: "x" },
    ],
    focus: "x",
    expansion: {
      options: [
        { id: "each", text: "2x + 6 − x" },
        { id: "first", text: "2x + 3 − x" },
        { id: "sign", text: "2x + 6 + x" },
      ],
      correct: "each",
      why: "A 2 a zárójel mindkét tagját szorozza: 2·x + 2·3. A zárójel utáni −x előjele megmarad.",
    },
  },
  {
    id: "minus",
    title: "Mínuszjel a zárójel előtt",
    expression: "−(x − 4) + 2x",
    terms: [
      { coefficient: -1, kind: "x" },
      { coefficient: 4, kind: "constant" },
      { coefficient: 2, kind: "x" },
    ],
    focus: "x",
    expansion: {
      options: [
        { id: "both", text: "−x + 4 + 2x" },
        { id: "first", text: "−x − 4 + 2x" },
        { id: "drop", text: "x − 4 + 2x" },
      ],
      correct: "both",
      why: "A zárójel előtti mínusz −1-gyel való szorzást jelent. Ezért (−1)·x = −x és (−1)·(−4) = +4.",
    },
  },
  {
    id: "powers",
    title: "Azonos betű, különböző hatvány",
    expression: "x² + x",
    terms: [
      { coefficient: 1, kind: "x2" },
      { coefficient: 1, kind: "x" },
    ],
    focus: "x2",
  },
  {
    id: "cancel",
    title: "Ellentett tagok",
    expression: "2x − 2x + 3",
    terms: [
      { coefficient: 2, kind: "x" },
      { coefficient: -2, kind: "x" },
      { coefficient: 3, kind: "constant" },
    ],
    focus: "x",
  },
];
export const algebraKindText = (kind: AlgebraKind) =>
  kind === "x2" ? "x²" : kind === "constant" ? "1" : kind;
export function formatAlgebra(terms: readonly AlgebraTerm[]): string {
  const pieces: string[] = [];
  for (const term of terms) {
    if (!term.coefficient) continue;
    const magnitude = Math.abs(term.coefficient);
    const factor =
      term.kind === "constant"
        ? String(magnitude)
        : `${magnitude === 1 ? "" : magnitude}${algebraKindText(term.kind)}`;
    pieces.push(
      `${pieces.length ? (term.coefficient < 0 ? " − " : " + ") : term.coefficient < 0 ? "−" : ""}${factor}`,
    );
  }
  return pieces.join("") || "0";
}
export const algebraLikeTerms = (a: AlgebraTerm, b: AlgebraTerm) =>
  a.kind === b.kind;
export function algebraModel(caseId: string, xRaw: string, yRaw: string) {
  const lesson =
    ALGEBRA_CASES.find((item) => item.id === caseId) ?? ALGEBRA_CASES[0];
  const x = bridgeNumber(xRaw, 20);
  const needsY = lesson.terms.some((term) => term.kind === "y");
  const y = needsY ? bridgeNumber(yRaw, 20) : ZERO;
  if (!x || !y)
    return {
      ok: false as const,
      message:
        "A változókhoz −20 és 20 közötti számot vagy törtet adj meg, legfeljebb 12 jegyű számlálóval és nevezővel. A bevitt értéket nem írjuk át.",
    };
  const base = (kind: AlgebraKind): Rational =>
    kind === "constant"
      ? ONE
      : kind === "x2"
        ? rMultiply(x, x)
        : kind === "x"
          ? x
          : y;
  const terms = lesson.terms.map((term) => ({
    ...term,
    value: rMultiply(rational(BigInt(term.coefficient)), base(term.kind)),
  }));
  const combined = (["x2", "x", "y", "constant"] as const).map((kind) => ({
    kind,
    coefficient: terms
      .filter((term) => term.kind === kind)
      .reduce((sum, term) => sum + term.coefficient, 0),
  }));
  const total = terms.reduce((sum, term) => rAdd(sum, term.value), ZERO);
  return {
    ok: true as const,
    lesson,
    x,
    y,
    terms,
    combined,
    total,
    simplified: formatAlgebra(combined),
    expanded: formatAlgebra(lesson.terms),
    coefficient: combined.find((term) => term.kind === lesson.focus)!
      .coefficient,
  };
}

export type StoryId = "fare" | "lengths" | "notebooks" | "missing";
export interface StorySpec {
  id: StoryId;
  title: string;
  story: string;
  question: string;
  condition: string;
  facts: readonly { id: string; text: string; needed: boolean }[];
  unknowns: readonly { id: string; text: string }[];
  correctUnknown: string;
  models: readonly { id: string; text: string; feedback: string }[];
  correctModel: string;
  variable: string;
  unit: string;
  outputUnit: string;
  equation: string;
  candidates: readonly string[];
  start: string;
}
export const STORY_MODELS: readonly StorySpec[] = [
  {
    id: "fare",
    title: "Alapdíjas út",
    story:
      "Egy fuvar alapdíja 500 Ft, és minden megtett kilométer 200 Ft. A számla végösszege 1700 Ft.",
    question: "Hány kilométer volt az út?",
    condition:
      "A modellben nincs más díj vagy kedvezmény; az út nemnegatív. Tört kilométer is lehet.",
    facts: [
      { id: "base", text: "500 Ft alapdíj", needed: true },
      { id: "rate", text: "200 Ft kilométerenként", needed: true },
      { id: "total", text: "1700 Ft végösszeg", needed: true },
    ],
    unknowns: [
      { id: "distance", text: "x: az út hossza kilométerben" },
      { id: "price", text: "x: a teljes díj forintban" },
      { id: "rate", text: "x: az egységár Ft/km-ben" },
    ],
    correctUnknown: "distance",
    models: [
      {
        id: "fee",
        text: "500 + 200x = 1700",
        feedback:
          "Az alapdíjat egyszer fizetjük, a 200 Ft-ot pedig kilométerenként.",
      },
      {
        id: "all",
        text: "(500 + 200)x = 1700",
        feedback:
          "Ez minden kilométerhez újra hozzáadná az alapdíjat is. Az 500 Ft egyszeri díj.",
      },
      {
        id: "no-fee",
        text: "200x = 1700",
        feedback: "Ebből hiányzik az 500 Ft-os egyszeri alapdíj.",
      },
    ],
    correctModel: "fee",
    variable: "x",
    unit: "km",
    outputUnit: "Ft",
    equation: "500 + 200x = 1700",
    candidates: ["0", "2", "4"],
    start: "4",
  },
  {
    id: "lengths",
    title: "Összeg és különbség",
    story:
      "Két szalag együttes hossza 34 cm. A hosszabb 6 cm-rel hosszabb a rövidebbnél.",
    question: "Milyen hosszú a két szalag?",
    condition:
      "Mindkét hosszúság pozitív. A 6 cm a két hossz különbsége, nem a hosszabb szalag teljes hossza.",
    facts: [
      { id: "sum", text: "34 cm együttes hossz", needed: true },
      { id: "difference", text: "6 cm különbség", needed: true },
    ],
    unknowns: [
      { id: "short", text: "x: a rövidebb szalag hossza cm-ben" },
      { id: "long", text: "x: a hosszabb szalag hossza cm-ben" },
      { id: "sum", text: "x: a két hossz összege cm-ben" },
    ],
    correctUnknown: "short",
    models: [
      {
        id: "sum",
        text: "x + (x + 6) = 34",
        feedback:
          "A rövidebb x, a hosszabb x+6. A történet az összegüket adja meg.",
      },
      {
        id: "difference",
        text: "x + 6 = 34",
        feedback:
          "Itt csak a hosszabb szalag lenne 34 cm, pedig 34 cm a két hossz összege.",
      },
      {
        id: "subtract",
        text: "x + (x − 6) = 34",
        feedback:
          "x a rövidebb szalagot jelöli. A másikhoz 6 cm-t hozzá kell adni.",
      },
    ],
    correctModel: "sum",
    variable: "x",
    unit: "cm",
    outputUnit: "cm",
    equation: "x + (x + 6) = 34",
    candidates: ["8", "10", "12"],
    start: "12",
  },
  {
    id: "notebooks",
    title: "Szükséges és felesleges adat",
    story:
      "Három egyforma árú füzet összesen 1500 Ft-ba kerül. A vásárló táskájában 7 toll van.",
    question: "Mennyibe kerül egy füzet?",
    condition:
      "A füzetek ára azonos, más díj nincs. Egész forintos, pozitív árakkal számolunk; a táskában lévő tollak nem szerepelnek a számlán.",
    facts: [
      { id: "count", text: "3 egyforma árú füzet", needed: true },
      { id: "total", text: "1500 Ft a füzetek teljes ára", needed: true },
      { id: "pens", text: "7 toll a táskában", needed: false },
    ],
    unknowns: [
      { id: "price", text: "x: egy füzet ára forintban" },
      { id: "count", text: "x: a füzetek darabszáma" },
      { id: "pen", text: "x: egy toll ára forintban" },
    ],
    correctUnknown: "price",
    models: [
      {
        id: "three",
        text: "3x = 1500",
        feedback:
          "Három azonos árat adunk össze. A tollak számát nem kell felhasználni.",
      },
      {
        id: "ten",
        text: "(3 + 7)x = 1500",
        feedback:
          "A hét toll nincs a vásárlásban, és az áráról sem tudunk semmit.",
      },
      {
        id: "plus",
        text: "x + 3 = 1500",
        feedback:
          "A 3 darabszám, nem 3 forintos felár. Az egységárat meg kell szorozni vele.",
      },
    ],
    correctModel: "three",
    variable: "x",
    unit: "Ft",
    outputUnit: "Ft",
    equation: "3x = 1500",
    candidates: ["300", "400", "600"],
    start: "400",
  },
  {
    id: "missing",
    title: "Egy adat még hiányzik",
    story:
      "Egy téglalap egyik oldala 12 cm. A másik oldal hosszát nem adták meg. Az asztalon egy 5 m-es szalag is fekszik.",
    question: "Meghatározható-e a téglalap területe?",
    condition:
      "A másik oldal pozitív hossz. Nincs olyan feltétel, hogy a téglalap négyzet, vagy hogy a szalag a kerülete lenne.",
    facts: [
      { id: "side", text: "12 cm az egyik oldal", needed: true },
      { id: "ribbon", text: "5 m szalag az asztalon", needed: false },
    ],
    unknowns: [
      { id: "side", text: "b: a hiányzó másik oldal cm-ben" },
      { id: "area", text: "b: a terület cm²-ben" },
      { id: "ribbon", text: "b: a szalag hossza méterben" },
    ],
    correctUnknown: "side",
    models: [
      {
        id: "unknown",
        text: "A = 12b; b nélkül nincs egyetlen terület",
        feedback:
          "A 12 cm-es oldal önmagában kevés. Különböző pozitív b értékek különböző területet adnak.",
      },
      {
        id: "square",
        text: "A = 12² = 144 cm²",
        feedback:
          "Ez négyzetet feltételezne. A történet csak téglalapot mondott.",
      },
      {
        id: "ribbon",
        text: "A = 12 · 5 = 60 cm²",
        feedback:
          "Az 5 m-es szalagról nem állítottuk, hogy a téglalap másik oldala lenne. A mértékegységek sem egyeznek.",
      },
    ],
    correctModel: "unknown",
    variable: "b",
    unit: "cm",
    outputUnit: "cm²",
    equation: "A = 12b",
    candidates: ["1", "2", "3"],
    start: "2",
  },
];
export function storySpec(id: string): StorySpec {
  return STORY_MODELS.find((model) => model.id === id) ?? STORY_MODELS[0];
}
export function checkStoryModel(
  id: string,
  selectedFacts: readonly string[],
  unknown: string,
  equation: string,
) {
  const model = storySpec(id);
  const required = model.facts
    .filter((fact) => fact.needed)
    .map((fact) => fact.id);
  if (
    selectedFacts.length !== required.length ||
    !required.every((fact) => selectedFacts.includes(fact)) ||
    new Set(selectedFacts).size !== selectedFacts.length
  )
    return {
      ok: false,
      message:
        "Vizsgáld meg a szükséges adatokat: mi kapcsolódik közvetlenül a kérdéshez? Minden szükséges adatot jelölj, a pusztán mellékes adatokat hagyd üresen.",
    };
  if (unknown !== model.correctUnknown)
    return {
      ok: false,
      message:
        "Az ismeretlen jelentése és mértékegysége még nem egyezik a választott jelöléssel. Olvasd újra, mit kérdez a történet.",
    };
  const chosen = model.models.find((item) => item.id === equation);
  if (!chosen)
    return {
      ok: false,
      message:
        "Válassz modellt, és indokold, mit jelent minden tagja a történetben.",
    };
  return { ok: equation === model.correctModel, message: chosen.feedback };
}
export function storyValue(id: string, raw: string) {
  const spec = storySpec(id);
  const limit = spec.id === "notebooks" ? 2000 : 50;
  const x = bridgeNumber(raw, limit);
  if (
    !x ||
    x.n < 0n ||
    (spec.id !== "fare" && x.n === 0n) ||
    (spec.id === "notebooks" && x.d !== 1n)
  )
    return {
      ok: false as const,
      message:
        spec.id === "notebooks"
          ? "Ebben a történetben 1 és 2000 Ft közötti egész füzetárat adj meg."
          : `Ebben a műhelyben ${spec.id === "fare" ? "0 és 50 közötti nemnegatív" : "0-nál nagyobb, legfeljebb 50"} ${spec.unit} értéket vizsgálunk. Az értéket nem kerekítjük vagy vágjuk le.`,
    };
  const second = spec.id === "lengths" ? rAdd(x, rational(6n)) : null;
  const left =
    spec.id === "fare"
      ? rAdd(rational(500n), rMultiply(rational(200n), x))
      : spec.id === "lengths"
        ? rAdd(x, second!)
        : rMultiply(rational(spec.id === "notebooks" ? 3n : 12n), x);
  const target =
    spec.id === "fare"
      ? rational(1700n)
      : spec.id === "lengths"
        ? rational(34n)
        : spec.id === "notebooks"
          ? rational(1500n)
          : null;
  return {
    ok: true as const,
    spec,
    x,
    second,
    left,
    target,
    matches: target !== null && rEqual(left, target),
    comparison: target === null ? null : bridgeCompare(left, target),
  };
}

export type PowerPlacement = "positive" | "negative-base" | "minus-outside";
export function rationalPower(base: Rational, exponent: number): Rational {
  if (!Number.isInteger(exponent) || exponent < 0 || exponent > 8)
    throw new RangeError("A kitevő 0–8 közötti egész lehet.");
  if (base.n === 0n && exponent === 0)
    throw new RangeError("A 0⁰ kifejezést itt nem értelmezzük.");
  return rational(base.n ** BigInt(exponent), base.d ** BigInt(exponent));
}
export function powerModel(
  magnitudeRaw: string,
  exponent: number,
  placement: PowerPlacement,
) {
  const magnitude = bridgeNumber(magnitudeRaw, 10);
  if (
    !magnitude ||
    magnitude.n < 0n ||
    String(magnitude.n).length > 6 ||
    String(magnitude.d).length > 6
  )
    return {
      ok: false as const,
      message:
        "Az a értékéhez 0 és 10 közötti számot vagy törtet adj meg, legfeljebb 6 jegyű számlálóval és nevezővel. Az előjel szerepét külön választhatod ki.",
    };
  if (!Number.isInteger(exponent) || exponent < 0 || exponent > 8)
    return {
      ok: false as const,
      message:
        "A műhely 0 és 8 közötti egész kitevőket kezel. A beírt kitevőt nem kerekítjük.",
    };
  if (magnitude.n === 0n && exponent === 0)
    return {
      ok: false as const,
      message:
        "A nulladik hatvány szabályát csak nem nulla alapra használjuk. A 0⁰ kifejezéshez ebben a tananyagban nem rendelünk értéket.",
    };
  const base =
    placement === "negative-base"
      ? rational(-magnitude.n, magnitude.d)
      : magnitude;
  const powered = rationalPower(base, exponent);
  const value =
    placement === "minus-outside" ? rational(-powered.n, powered.d) : powered;
  const positive = rationalPower(magnitude, exponent);
  const negativeBase = rationalPower(
    rational(-magnitude.n, magnitude.d),
    exponent,
  );
  const outside = rational(-positive.n, positive.d);
  const factor = `(${exactHungarian(base)})`;
  const repeated =
    exponent === 0
      ? `${placement === "minus-outside" ? "−" : ""}1 (nem nulla alap nulladik hatványa${placement === "minus-outside" ? ", majd ellentett" : ""})`
      : `${placement === "minus-outside" ? "−[" : ""}${Array.from({ length: exponent }, () => factor).join(" · ")}${placement === "minus-outside" ? "]" : ""}`;
  const expression =
    placement === "negative-base"
      ? `(−${exactHungarian(magnitude)})^${exponent}`
      : `${placement === "minus-outside" ? "−" : ""}(${exactHungarian(magnitude)})^${exponent}`;
  return {
    ok: true as const,
    magnitude,
    base,
    exponent,
    placement,
    value,
    expression,
    repeated,
    positive,
    negativeBase,
    outside,
  };
}
export function powerBuildModel(edge: number, dimension: number) {
  if (
    !Number.isInteger(edge) ||
    edge < 1 ||
    edge > 5 ||
    (dimension !== 2 && dimension !== 3)
  )
    return {
      ok: false as const,
      message:
        "Az építő 1–5 közötti egész élhosszal négyzetet vagy kockát mutat.",
    };
  return {
    ok: true as const,
    edge,
    dimension,
    perLayer: edge * edge,
    layers: dimension === 3 ? edge : 1,
    units: edge ** dimension,
  };
}
export function tenPower(exponent: number): Rational | null {
  if (!Number.isInteger(exponent) || exponent < -6 || exponent > 6) return null;
  return exponent < 0
    ? rational(1n, 10n ** BigInt(-exponent))
    : rational(10n ** BigInt(exponent));
}

export function integerSquareRoot(n: bigint): bigint {
  if (n < 0n) throw new RangeError("Nemnegatív egész szám szükséges.");
  if (n < 2n) return n;
  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}
export function squareRootModel(raw: string, precision: number) {
  const area = bridgeNumber(raw, 400);
  if (!area)
    return {
      ok: false as const,
      message:
        "Legfeljebb 400 abszolút értékű számot vagy törtet adj meg, legfeljebb 12 jegyű számlálóval és nevezővel. A műhely nem írja át a bevitelt.",
    };
  if (area.n < 0n)
    return {
      ok: false as const,
      message:
        "Valós számok között ennek nincs négyzetgyöke: minden valós szám négyzete nemnegatív. Az x² = negatív szám egyenletnek sincs valós megoldása.",
      negative: true as const,
      area,
    };
  if (!Number.isInteger(precision) || precision < 0 || precision > 3)
    return {
      ok: false as const,
      message: "A becslést 0–3 tizedesjegyig szűkítjük.",
    };
  const nRoot = integerSquareRoot(area.n);
  const dRoot = integerSquareRoot(area.d);
  const exact =
    nRoot * nRoot === area.n && dRoot * dRoot === area.d
      ? rational(nRoot, dRoot)
      : null;
  const integerLower = integerSquareRoot(area.n / area.d);
  const scale = 10n ** BigInt(precision);
  const lowerCount = integerSquareRoot((area.n * scale * scale) / area.d);
  const lower = rational(lowerCount, scale);
  const hit = rEqual(rMultiply(lower, lower), area);
  const upper = hit ? lower : rational(lowerCount + 1n, scale);
  const midpoint = rational(2n * lowerCount + 1n, 2n * scale);
  const roundUp = bridgeCompare(area, rMultiply(midpoint, midpoint)) >= 0;
  const approximation = rational(lowerCount + (roundUp ? 1n : 0n), scale);
  return {
    ok: true as const,
    area,
    precision,
    exact,
    integerLower,
    integerUpper: integerLower + 1n,
    lower,
    upper,
    approximation,
    exactAtPrecision: hit,
    equationRootCount: area.n === 0n ? 1 : 2,
  };
}
export function rootOfSquare(raw: string) {
  const a = bridgeNumber(raw, 20);
  if (!a)
    return {
      ok: false as const,
      message: "A példához −20 és 20 közötti számot vagy törtet adj meg.",
    };
  return { ok: true as const, a, square: rMultiply(a, a), root: bridgeAbs(a) };
}

export function exactGuess(
  raw: string,
  expected: Rational,
): "invalid" | "correct" | "incorrect" {
  if (raw.length > 180) return "invalid";
  const guess = parseRational(raw);
  return !guess ? "invalid" : rEqual(guess, expected) ? "correct" : "incorrect";
}
export const exactText = exactHungarian;
export const rationalText = formatRational;

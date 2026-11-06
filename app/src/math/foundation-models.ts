import { formatRational, parseRational, rational } from "./engine.ts";
import type { Rational } from "./engine.ts";

export const rAdd = (a: Rational, b: Rational) =>
  rational(a.n * b.d + b.n * a.d, a.d * b.d);
export const rSubtract = (a: Rational, b: Rational) =>
  rational(a.n * b.d - b.n * a.d, a.d * b.d);
export const rMultiply = (a: Rational, b: Rational) =>
  rational(a.n * b.n, a.d * b.d);
export const rDivide = (a: Rational, b: Rational) =>
  rational(a.n * b.d, a.d * b.n);
export const rEqual = (a: Rational, b: Rational) => a.n * b.d === b.n * a.d;
export const rNumber = (a: Rational) => Number(a.n) / Number(a.d);

/** Finite decimals are printed exactly, with a comma. Other numbers stay fractions. */
export function exactHungarian(input: Rational): string {
  const value = rational(input.n, input.d);
  if (value.d === 1n) return String(value.n).replace("-", "−");
  let denominator = value.d;
  let twos = 0;
  let fives = 0;
  while (denominator % 2n === 0n) {
    denominator /= 2n;
    twos++;
  }
  while (denominator % 5n === 0n) {
    denominator /= 5n;
    fives++;
  }
  if (denominator !== 1n || Math.max(twos, fives) > 24)
    return formatRational(value).replace("-", "−");
  const decimals = Math.max(twos, fives);
  const scaled = value.n * (10n ** BigInt(decimals) / value.d);
  const unsigned = String(scaled < 0n ? -scaled : scaled).padStart(
    decimals + 1,
    "0",
  );
  return `${scaled < 0n ? "−" : ""}${unsigned.slice(0, -decimals)},${unsigned.slice(-decimals).replace(/0+$/, "")}`;
}

export function fractionAndDecimal(value: Rational): string {
  const fraction = formatRational(value).replace("-", "−");
  const decimal = exactHungarian(value);
  return fraction === decimal ? fraction : `${fraction} = ${decimal}`;
}

function readNumber(raw: string): Rational | null {
  if (raw.length > 80) return null;
  const value = parseRational(raw);
  if (
    !value ||
    (value.n < 0n ? -value.n : value.n) > 1_000_000_000_000n * value.d
  )
    return null;
  return value;
}

export type NumberLineOperation = "add" | "subtract";
export function makeNumberLine(
  aRaw: string,
  bRaw: string,
  operation: NumberLineOperation,
) {
  const a = readNumber(aRaw);
  const b = readNumber(bRaw);
  if (!a || !b)
    return {
      ok: false as const,
      message:
        "Mindkét koordinátát számként vagy egyszerű törtként add meg. A műhely legfeljebb ezermilliárdos abszolút értéket ábrázol; az értéket nem vágja le.",
    };
  const opposite = rational(-a.n, a.d);
  const absoluteA = rational(a.n < 0n ? -a.n : a.n, a.d);
  const absoluteB = rational(b.n < 0n ? -b.n : b.n, b.d);
  const displacement = operation === "subtract" ? rational(-b.n, b.d) : b;
  const result = rAdd(a, displacement);
  const difference = rSubtract(b, a);
  const distance = rational(
    difference.n < 0n ? -difference.n : difference.n,
    difference.d,
  );
  const comparison =
    a.n * b.d < b.n * a.d ? "<" : a.n * b.d > b.n * a.d ? ">" : "=";
  const magnitudeComparison =
    absoluteA.n * absoluteB.d < absoluteB.n * absoluteA.d
      ? "<"
      : absoluteA.n * absoluteB.d > absoluteB.n * absoluteA.d
        ? ">"
        : "=";
  const points = [
    0,
    rNumber(a),
    rNumber(b),
    rNumber(result),
    rNumber(opposite),
  ];
  let min = -12;
  let max = 12;
  let tick = 4;
  if (Math.min(...points) < min || Math.max(...points) > max) {
    min = Math.min(-12, ...points);
    max = Math.max(12, ...points);
    const span = max - min;
    const rough = span / 6;
    const power = 10 ** Math.floor(Math.log10(rough));
    tick =
      [1, 2, 5, 10]
        .map((factor) => factor * power)
        .find((step) => step >= rough) ?? power * 10;
    min = Math.floor((min - span * 0.08) / tick) * tick;
    max = Math.ceil((max + span * 0.08) / tick) * tick;
  }
  const ticks = Array.from(
    { length: Math.min(15, Math.round((max - min) / tick) + 1) },
    (_, i) => min + i * tick,
  );
  return {
    ok: true as const,
    a,
    b,
    opposite,
    absoluteA,
    absoluteB,
    displacement,
    result,
    distance,
    comparison,
    magnitudeComparison,
    min,
    max,
    ticks,
  };
}

export type ProportionKind = "cord" | "work" | "fare";
export const PROPORTION_MODELS = {
  cord: {
    title: "Zsinór ára",
    story:
      "Egy méter zsinór ára 400 Ft. Ugyanilyen zsinórból vásárolunk; nincs alapdíj, csomagolási díj vagy mennyiségi kedvezmény.",
    formula: "y = 400x",
    xLabel: "Zsinór hossza",
    xUnit: "m",
    yLabel: "Ár",
    yUnit: "Ft",
    max: 5,
    min: 0,
    step: 0.25,
    samples: [0, 1, 2],
    start: "1,5",
    type: "direct",
  },
  work: {
    title: "Közös munka",
    story:
      "Egy feladat összesen 24 segítőórányi munka. A segítők azonos és állandó ütemben dolgoznak; a munka szabadon felosztható, nincs várakozás vagy egymás akadályozása. Csak e feltételek mellett használjuk a modellt.",
    formula: "t = 24/n",
    xLabel: "Segítők száma",
    xUnit: "fő",
    yLabel: "Szükséges idő",
    yUnit: "óra",
    max: 12,
    min: 1,
    step: 1,
    samples: [1, 2, 3],
    start: "6",
    type: "inverse",
  },
  fare: {
    title: "Alapdíjas út",
    story:
      "A képzeletbeli fuvar ára 500 Ft alapdíjból és minden megtett kilométer után 200 Ft-ból áll. A modellben nincs további díj vagy kedvezmény.",
    formula: "y = 500 + 200x",
    xLabel: "Megtett út",
    xUnit: "km",
    yLabel: "Teljes díj",
    yUnit: "Ft",
    max: 10,
    min: 0,
    step: 0.5,
    samples: [0, 1, 2],
    start: "4",
    type: "neither",
  },
} as const;

export function proportionValue(kind: ProportionKind, xRaw: string) {
  const x = readNumber(xRaw);
  const model = PROPORTION_MODELS[kind];
  if (
    !x ||
    x.n < BigInt(model.min) * x.d ||
    x.n > BigInt(model.max) * x.d ||
    (kind === "work" && x.d !== 1n)
  )
    return {
      ok: false as const,
      message:
        kind === "work"
          ? "A segítők száma 1 és 12 közötti pozitív egész. Nulla vagy fél segítő nem megengedett ebben a történetben."
          : `Ebben a kísérletben ${model.min} és ${model.max} közötti ${model.xUnit} értéket adj meg. A bevitt értéket nem kerekítjük vagy vágjuk le.`,
    };
  const y =
    kind === "cord"
      ? rMultiply(rational(400n), x)
      : kind === "work"
        ? rDivide(rational(24n), x)
        : rAdd(rational(500n), rMultiply(rational(200n), x));
  return {
    ok: true as const,
    x,
    y,
    quotient: x.n === 0n ? null : rDivide(y, x),
    product: rMultiply(x, y),
  };
}

const MAX_PROPORTION_SAMPLES = 24;
const MAX_PROPORTION_SAMPLE_TEXT = 1000;

/** Keep accepted input text: converting it through Number loses exact fractions. */
function boundedProportionSamples(
  kind: ProportionKind,
  values: readonly string[],
) {
  const samples = PROPORTION_MODELS[kind].samples.map(String);
  const baselineCount = samples.length;
  const keys = new Set(samples);
  let discarded = false;
  for (const raw of values) {
    const point = proportionValue(kind, raw);
    if (!point.ok) continue;
    const key = formatRational(point.x);
    if (keys.has(key)) continue;
    samples.push(raw.trim());
    keys.add(key);
    while (
      samples.length > MAX_PROPORTION_SAMPLES ||
      JSON.stringify(samples).length > MAX_PROPORTION_SAMPLE_TEXT
    ) {
      const removed = samples.splice(baselineCount, 1)[0];
      const previous = proportionValue(kind, removed);
      if (previous.ok) keys.delete(formatRational(previous.x));
      discarded = true;
    }
  }
  return { samples, discarded };
}

/** Older numeric workshop samples remain readable; new samples never use Number. */
export function readProportionSamples(
  kind: ProportionKind,
  exactSaved: unknown,
  legacySaved: unknown = [],
): string[] {
  if (
    typeof exactSaved === "string" &&
    exactSaved.length <= MAX_PROPORTION_SAMPLE_TEXT
  ) {
    try {
      const parsed: unknown = JSON.parse(exactSaved);
      if (
        Array.isArray(parsed) &&
        parsed.length <= MAX_PROPORTION_SAMPLES &&
        parsed.every(
          (raw) => typeof raw === "string" && proportionValue(kind, raw).ok,
        )
      )
        return boundedProportionSamples(kind, parsed).samples;
    } catch {
      // Invalid optional workshop state does not erase an older usable sample list.
    }
  }
  const legacy = Array.isArray(legacySaved)
    ? legacySaved
        .slice(0, MAX_PROPORTION_SAMPLES)
        .filter((n) => typeof n === "number" && Number.isFinite(n))
        .map(String)
    : [];
  return boundedProportionSamples(kind, legacy).samples;
}

export function appendProportionSample(
  kind: ProportionKind,
  samples: readonly string[],
  nextRaw: string,
): { exactSamples: string; discarded: boolean } {
  const bounded = boundedProportionSamples(kind, [...samples, nextRaw]);
  return {
    exactSamples: JSON.stringify(bounded.samples),
    discarded: bounded.discarded,
  };
}

export type UnitDimension =
  "length" | "area" | "volume" | "mass" | "time" | "speed";
export interface ModelUnit {
  id: string;
  label: string;
  dimension: UnitDimension;
  factor: string;
}
/** Factors refer to mm, mm², mm³, mg, seconds, and m/s respectively. */
export const MODEL_UNITS: readonly ModelUnit[] = [
  { id: "mm", label: "mm", dimension: "length", factor: "1" },
  { id: "cm", label: "cm", dimension: "length", factor: "10" },
  { id: "dm", label: "dm", dimension: "length", factor: "100" },
  { id: "m", label: "m", dimension: "length", factor: "1000" },
  { id: "km", label: "km", dimension: "length", factor: "1000000" },
  { id: "mm2", label: "mm²", dimension: "area", factor: "1" },
  { id: "cm2", label: "cm²", dimension: "area", factor: "100" },
  { id: "dm2", label: "dm²", dimension: "area", factor: "10000" },
  { id: "m2", label: "m²", dimension: "area", factor: "1000000" },
  { id: "mm3", label: "mm³", dimension: "volume", factor: "1" },
  { id: "cm3", label: "cm³", dimension: "volume", factor: "1000" },
  { id: "dm3", label: "dm³", dimension: "volume", factor: "1000000" },
  { id: "m3", label: "m³", dimension: "volume", factor: "1000000000" },
  { id: "ml", label: "mL", dimension: "volume", factor: "1000" },
  { id: "cl", label: "cL", dimension: "volume", factor: "10000" },
  { id: "dl", label: "dL", dimension: "volume", factor: "100000" },
  { id: "l", label: "L", dimension: "volume", factor: "1000000" },
  { id: "mg", label: "mg", dimension: "mass", factor: "1" },
  { id: "g", label: "g", dimension: "mass", factor: "1000" },
  { id: "kg", label: "kg", dimension: "mass", factor: "1000000" },
  { id: "t", label: "t", dimension: "mass", factor: "1000000000" },
  { id: "s", label: "másodperc", dimension: "time", factor: "1" },
  { id: "min", label: "perc", dimension: "time", factor: "60" },
  { id: "h", label: "óra", dimension: "time", factor: "3600" },
  { id: "day", label: "nap", dimension: "time", factor: "86400" },
  { id: "mps", label: "m/s", dimension: "speed", factor: "1" },
  { id: "kmh", label: "km/h", dimension: "speed", factor: "5/18" },
];
export const UNIT_DIMENSION_LABELS: Record<UnitDimension, string> = {
  length: "Hosszúság",
  area: "Terület",
  volume: "Térfogat / űrtartalom",
  mass: "Tömeg",
  time: "Idő",
  speed: "Sebesség",
};

export function convertModelUnit(
  amountRaw: string,
  fromId: string,
  toId: string,
) {
  const from = MODEL_UNITS.find((unit) => unit.id === fromId);
  const to = MODEL_UNITS.find((unit) => unit.id === toId);
  if (!from || !to)
    return {
      ok: false as const,
      message: "Válassz a műhelyben szereplő mértékegységek közül.",
    };
  if (from.dimension !== to.dimension) {
    const message =
      from.dimension === "area" && to.dimension === "length"
        ? "Területet mérünk. Melyik négyzetes egységet választod? Oldalhosszt további alakzati adat nélkül nem határozhatunk meg a terület egységváltásával."
        : (from.dimension === "volume" && to.dimension === "mass") ||
            (from.dimension === "mass" && to.dimension === "volume")
          ? "A liter térfogatot, a kilogramm tömeget mér. A kettő kapcsolatának kiszámításához anyagadat, például sűrűség kell. Nem feltételezzük, hogy 1 L = 1 kg."
          : "Ez két különböző fajtájú mennyiség. Közvetlen egységváltás nem végezhető közöttük; további kapcsolat és adatok kellenek.";
    return { ok: false as const, message };
  }
  const amount = readNumber(amountRaw);
  if (!amount || amount.n < 0n)
    return {
      ok: false as const,
      message:
        "Nemnegatív számot vagy egyszerű törtet adj meg; a műhely legfeljebb ezermilliárdos mérőszámot kezel. Az értéket nem kerekítjük.",
    };
  const factor = rDivide(
    parseRational(from.factor)!,
    parseRational(to.factor)!,
  );
  const result = rMultiply(amount, factor);
  return { ok: true as const, amount, from, to, factor, result };
}

export function unitBuilderModel(dimension: 1 | 2 | 3, scale: 1 | 2) {
  const edge = 10 * scale;
  return {
    dimension,
    scale,
    edge,
    measureDm: scale ** dimension,
    smallUnits: edge ** dimension,
    perLayer: edge ** 2,
    layers: dimension === 3 ? edge : 1,
    magnitudeFactor: scale ** dimension,
  };
}

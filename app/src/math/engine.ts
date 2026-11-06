import type {
  AnswerSpec,
  Exercise,
  GradeResult,
  MistakeRule,
  ScalarAnswerSpec,
} from "../types.ts";

/** A reduced rational number. The denominator is always positive. */
export interface Rational {
  n: bigint;
  d: bigint;
}

// Numeric answers accept literals, not executable expressions or a CAS grammar.
const MAX_INPUT_LENGTH = 180;
const MAX_LITERAL_DIGITS = 48;
const MAX_DECIMAL_PLACES = 24;
const HORIZONTAL_SPACE = /[\u00a0\u202f]/g;

export const MAX_ANSWER_PARTS = 16;
export const MAX_PART_VALUE_LENGTH = MAX_INPUT_LENGTH;
// Include JSON's worst-case escaping without allowing unbounded payloads.
export const MAX_PART_INPUT_LENGTH =
  MAX_ANSWER_PARTS * (MAX_PART_VALUE_LENGTH * 6 + 48) + 2;
export type PartResponses = Record<string, string>;
const validPartId = (id: string): boolean =>
  /^[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(id) &&
  !["constructor", "prototype", "__proto__"].includes(id);

function cleanPartResponses(value: unknown): PartResponses | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const entries = Object.entries(value);
  if (entries.length > MAX_ANSWER_PARTS) return null;
  const clean: PartResponses = {};
  for (const [key, response] of entries) {
    if (
      !validPartId(key) ||
      typeof response !== "string" ||
      response.length > MAX_PART_VALUE_LENGTH
    )
      return null;
    clean[key] = response;
  }
  return clean;
}

/** Decode only a bounded flat map. An untouched exercise has no filled parts. */
export function decodePartResponses(input: string): PartResponses | null {
  if (typeof input !== "string" || input.length > MAX_PART_INPUT_LENGTH)
    return null;
  if (input === "") return {};
  try {
    return cleanPartResponses(JSON.parse(input));
  } catch {
    return null;
  }
}

export function encodePartResponses(responses: PartResponses): string {
  const clean = cleanPartResponses(responses);
  if (!clean) throw new Error("Hibás vagy túl hosszú részválasz.");
  const input = JSON.stringify(clean);
  if (input.length > MAX_PART_INPUT_LENGTH)
    throw new Error("Túl hosszú részválaszok.");
  return input;
}

function abs(value: bigint): bigint {
  return value < 0n ? -value : value;
}

export function gcd(a: bigint, b: bigint): bigint {
  a = abs(a);
  b = abs(b);
  while (b !== 0n) [a, b] = [b, a % b];
  return a;
}

export function rational(n: bigint, d: bigint = 1n): Rational {
  if (d === 0n) throw new RangeError("A nevező nem lehet nulla.");
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const factor = gcd(n, d);
  return { n: n / factor, d: d / factor };
}

export function formatRational(value: Rational): string {
  const reduced = rational(value.n, value.d);
  return reduced.d === 1n ? String(reduced.n) : `${reduced.n}/${reduced.d}`;
}

function normalizeSymbols(input: string): string {
  return input
    .replace(/[\u2212\ufe63\uff0d]/g, "-")
    .replace(/[\u2044\u2215]/g, "/");
}

interface Scalar {
  n: bigint;
  d: bigint;
  integerLiteral: boolean;
}
interface Parsed {
  value: Rational;
  kind: "integer" | "decimal" | "fraction";
  literalNumerator?: bigint;
  literalDenominator?: bigint;
}

function parseScalar(source: string): Scalar | null {
  const text = source.trim().replace(HORIZONTAL_SPACE, " ");
  if (!text || !/^[+\-]?[0-9., ]+$/.test(text)) return null;
  const negative = text[0] === "-";
  const unsigned = /^[+\-]/.test(text) ? text.slice(1) : text;
  const parts = unsigned.split(/[.,]/);
  if (parts.length > 2) return null;
  const integerPart = parts[0];
  const fractionalPart = parts[1];
  const decimal = parts.length === 2;
  if (decimal && (!fractionalPart || !/^\d+$/.test(fractionalPart)))
    return null;
  if (fractionalPart && fractionalPart.length > MAX_DECIMAL_PLACES) return null;
  // An empty integer part is allowed only in .5 / ,5. Spaces are thousands
  // separators only when the first group has 1–3 digits and all later groups 3.
  if (
    integerPart !== "" &&
    !/^(?:\d+|[1-9]\d{0,2}(?: +\d{3})+)$/.test(integerPart)
  )
    return null;
  if (integerPart === "" && !decimal) return null;
  const integerDigits = integerPart.replace(/ /g, "") || "0";
  const fractionDigits = fractionalPart ?? "";
  if (integerDigits.length + fractionDigits.length > MAX_LITERAL_DIGITS)
    return null;
  try {
    const numerator = BigInt(integerDigits + fractionDigits);
    return {
      n: negative ? -numerator : numerator,
      d: 10n ** BigInt(fractionDigits.length),
      integerLiteral: !decimal,
    };
  } catch {
    return null;
  }
}

function parseDetailed(input: string): Parsed | null {
  if (typeof input !== "string" || input.length > MAX_INPUT_LENGTH) return null;
  const text = normalizeSymbols(input).trim();
  if (!text) return null;
  const parts = text.split("/");
  if (parts.length > 2) return null;
  const first = parseScalar(parts[0]);
  if (!first) return null;
  if (parts.length === 1) {
    return {
      value: rational(first.n, first.d),
      kind: first.integerLiteral ? "integer" : "decimal",
    };
  }
  const second = parseScalar(parts[1]);
  if (!second || second.n === 0n) return null;
  const parsed: Parsed = {
    value: rational(first.n * second.d, first.d * second.n),
    kind: "fraction",
  };
  if (first.integerLiteral && second.integerLiteral) {
    parsed.literalNumerator = first.n;
    parsed.literalDenominator = second.n;
  }
  return parsed;
}

/**
 * Accepts a signed integer, a decimal (comma or point), or one simple fraction.
 * Decimal numerators/denominators are also exact; mixed numbers, scientific
 * notation, arithmetic expressions and nested fractions are deliberately absent.
 */
export function parseRational(input: string): Rational | null {
  return parseDetailed(input)?.value ?? null;
}

function equal(a: Rational, b: Rational): boolean {
  return a.n * b.d === b.n * a.d;
}

function simplestForm(parsed: Parsed): boolean {
  if (parsed.value.d === 1n) return parsed.kind === "integer";
  return (
    parsed.kind === "fraction" &&
    parsed.literalNumerator !== undefined &&
    parsed.literalDenominator !== undefined &&
    parsed.literalDenominator > 0n &&
    gcd(parsed.literalNumerator, parsed.literalDenominator) === 1n
  );
}

function normalizeUnit(unit: string): string {
  let text = unit
    .normalize("NFC")
    .trim()
    .replace(/[ \u00a0\u202f]+/g, "");
  text = text.replace(/²/g, "^2").replace(/³/g, "^3");
  text = text.replace(/([A-Za-zµμ])([23])(?=$|[\/·])/g, "$1^$2");
  // Ft/ft is a harmless local spelling variation. Other SI letter case is kept.
  return text.toLowerCase() === "ft" ? "Ft" : text;
}

type NumberAnswer = Extract<AnswerSpec, { kind: "number" }>;
type ReadResponse =
  { parsed: Parsed; unit?: string } | { error: "variable" | "syntax" };

function readResponse(input: string, answer: NumberAnswer): ReadResponse {
  let body = normalizeSymbols(input).trim();
  if (body.includes("=")) {
    const pieces = body.split("=");
    if (
      pieces.length !== 2 ||
      !answer.variable ||
      pieces[0].trim() !== answer.variable
    ) {
      return { error: "variable" };
    }
    body = pieces[1].trim();
  }
  const plain = parseDetailed(body);
  if (plain) return { parsed: plain };
  // A suffix is notation, never an expression. In particular ^2 is allowed in
  // an area unit, but powers in the numeric part remain unsupported.
  const measured = body.match(
    /^([0-9+\-.,/ \u00a0\u202f]+?)[ \u00a0\u202f]*([A-Za-zÀ-ÖØ-öø-ÿΑ-Ωα-ωµμ%°][A-Za-zÀ-ÖØ-öø-ÿΑ-Ωα-ωµμ%°0-9²³^/· \u00a0\u202f-]{0,23})$/u,
  );
  if (!measured) return { error: "syntax" };
  const parsed = parseDetailed(measured[1]);
  return parsed ? { parsed, unit: measured[2] } : { error: "syntax" };
}

function unitMatches(
  unit: string | undefined,
  expected: string | undefined,
): boolean {
  if (unit === undefined) return true; // The exercise already labels the unit.
  return (
    expected !== undefined && normalizeUnit(unit) === normalizeUnit(expected)
  );
}

// Interpret a configured numeric tolerance by its decimal spelling, rather than
// introducing an implicit floating point tolerance into exact fraction grading.
function toleranceAsRational(value: number): Rational | null {
  if (!Number.isFinite(value) || value < 0) return null;
  const match = value.toString().match(/^(\d+)(?:\.(\d+))?(?:e([+\-]?\d+))?$/i);
  if (!match) return null;
  const fraction = match[2] ?? "";
  const exponent = Number(match[3] ?? "0");
  if (Math.abs(exponent) > 100) return null;
  const shift = exponent - fraction.length;
  const digits = BigInt(match[1] + fraction);
  return shift >= 0
    ? rational(digits * 10n ** BigInt(shift))
    : rational(digits, 10n ** BigInt(-shift));
}

function withinTolerance(
  actual: Rational,
  expected: Rational,
  tolerance: Rational,
): boolean {
  const difference = abs(actual.n * expected.d - expected.n * actual.d);
  return difference * tolerance.d <= tolerance.n * actual.d * expected.d;
}

function invalid(message: string): GradeResult {
  return { status: "invalid", correct: false, message };
}

/** Normalize notation only; parentheses and operation order remain significant. */
export function normalizeExpression(input: string): string | null {
  if (typeof input !== "string" || input.length > MAX_INPUT_LENGTH) return null;
  const text = normalizeSymbols(input.normalize("NFC"))
    .replace(/[\s\u00a0\u202f]+/g, "")
    .replace(/[×·]/g, "*")
    .replace(/[:÷]/g, "/")
    .replace(/²/g, "^2")
    .replace(/³/g, "^3")
    .replace(/\[/g, "(")
    .replace(/\]/g, ")")
    .replace(/,/g, ".");
  return text &&
    /^[0-9A-Za-z.+\-*/^()=]+$/.test(text) &&
    !/[A-Za-z]{2,}/.test(text)
    ? text
    : null;
}

function gradeScalar(
  answer: ScalarAnswerSpec,
  mistakes: MistakeRule[] | undefined,
  input: string,
): GradeResult {
  if (typeof input !== "string" || input.length > MAX_INPUT_LENGTH) {
    return invalid(
      "Ez a bevitel túl hosszú. A kért számot, kifejezést vagy a felkínált választ add meg.",
    );
  }
  const text = input.trim();
  if (!text)
    return invalid(
      answer.kind === "choice"
        ? "Előbb válassz egy választ."
        : answer.kind === "expression"
          ? "Előbb írd le a kért kifejezést."
          : "Előbb írj be egy számot vagy egyszerű törtet.",
    );

  if (answer.kind === "expression") {
    if (
      !Array.isArray(answer.accepted) ||
      !answer.accepted.length ||
      answer.accepted.length > 40
    ) {
      return invalid(
        "A feladat ellenőrzése nincs megfelelően beállítva. Válassz másik feladatot.",
      );
    }
    const accepted = answer.accepted.map(normalizeExpression);
    if (accepted.some((value) => value === null)) {
      return invalid(
        "A feladat ellenőrzése nincs megfelelően beállítva. Válassz másik feladatot.",
      );
    }
    const normalized = normalizeExpression(text);
    if (normalized === null)
      return invalid(
        "A megadott számokkal és matematikai jelekkel írd le a kifejezést. A zárójeleket is jelöld.",
      );
    if (accepted.includes(normalized))
      return {
        status: "correct",
        correct: true,
        normalized,
        message: "A leírt kifejezés megfelel a feladatnak.",
      };
    return {
      status: "incorrect",
      correct: false,
      normalized,
      message:
        mistakes?.find(
          (mistake) => normalizeExpression(mistake.input) === normalized,
        )?.feedback ??
        "Ez az alak nem szerepel a feladat elfogadott megoldásai között. Ellenőrizd a megadott számokat, a műveleteket és a zárójelek helyét; a teljes magyarázatban találsz összehasonlítható mintát.",
    };
  }

  if (answer.kind === "choice") {
    if (!answer.options.some((option) => option.id === answer.correct)) {
      return invalid(
        "A feladat ellenőrzése nincs megfelelően beállítva. Válassz másik feladatot.",
      );
    }
    if (!answer.options.some((option) => option.id === text))
      return invalid("A megadott lehetőségek közül válassz.");
    if (text === answer.correct)
      return {
        status: "correct",
        correct: true,
        message: "Ez a helyes válasz.",
        normalized: text,
      };
    return {
      status: "incorrect",
      correct: false,
      normalized: text,
      message:
        mistakes?.find((mistake) => mistake.input === text)?.feedback ??
        "Ez most nem helyes. Nézd át a feltételeket, vagy kérj egy támpontot.",
    };
  }

  const expected = parseRational(answer.expected);
  const tolerance =
    answer.tolerance === undefined
      ? undefined
      : toleranceAsRational(answer.tolerance);
  if (!expected || tolerance === null)
    return invalid(
      "A feladat ellenőrzése nincs megfelelően beállítva. Válassz másik feladatot.",
    );
  const response = readResponse(text, answer);
  if ("error" in response) {
    if (response.error === "variable") {
      return invalid(
        answer.variable
          ? `Ebben a feladatban a változó ${answer.variable}. Csak az értékét, vagy „${answer.variable} = érték” alakot írj be.`
          : "Itt csak a számértéket kérjük, változó és egyenlőségjel nélkül.",
      );
    }
    return invalid(
      "Írj egy számot vagy egyszerű törtet, például 0,75 vagy 3/4. A műveletsorokat és vegyes számokat előbb számold ki.",
    );
  }
  const normalized = formatRational(response.parsed.value);
  if (!unitMatches(response.unit, answer.unit)) {
    return {
      status: "incorrect",
      correct: false,
      normalized,
      message: answer.unit
        ? `A választ ${answer.unit} egységben kérjük. Ellenőrizd a mértékegységet, és szükség esetén váltsd át az értéket.`
        : "Ebben a feladatban egység nélküli számot vagy arányt kérünk. Ellenőrizd az értéket és a hozzáírt egységet.",
    };
  }

  const exact = equal(response.parsed.value, expected);
  const accepted =
    exact ||
    (tolerance !== undefined &&
      withinTolerance(response.parsed.value, expected, tolerance));
  if (accepted) {
    if (answer.requireSimplified && !simplestForm(response.parsed)) {
      let message =
        "Az érték helyes, de a tört még egyszerűsíthető. Oszd a számlálót és a nevezőt ugyanazzal a közös osztóval.";
      if (response.parsed.value.d === 1n)
        message =
          "Az érték helyes. A legegyszerűbb alakot kérjük: írd egész számmal.";
      else if (
        response.parsed.kind !== "fraction" ||
        response.parsed.literalDenominator === undefined
      ) {
        message =
          "Az érték helyes. Ebben a feladatban egyszerűsített közönséges törtet kérünk, egész számlálóval és nevezővel.";
      } else if (
        response.parsed.literalDenominator < 0n &&
        gcd(
          response.parsed.literalNumerator!,
          response.parsed.literalDenominator,
        ) === 1n
      ) {
        message =
          "Az érték helyes. A végső alakban a nevező legyen pozitív; az előjelet a számlálóhoz írd.";
      }
      return { status: "form", correct: false, message, normalized };
    }
    return {
      status: "correct",
      correct: true,
      normalized,
      message: exact
        ? "Helyes! Az eredmény megfelel a feladatnak."
        : "A megadott pontossággal helyes.",
    };
  }

  const matchingMistake = mistakes?.find((mistake) => {
    const candidate = readResponse(mistake.input, answer);
    return (
      !("error" in candidate) &&
      unitMatches(candidate.unit, answer.unit) &&
      equal(candidate.parsed.value, response.parsed.value)
    );
  });
  return {
    status: "incorrect",
    correct: false,
    normalized,
    message:
      matchingMistake?.feedback ??
      "Ez most nem helyes. Próbáld meg újra, vagy kérj egy támpontot.",
  };
}

/** All parts belong to one exercise and one attempt; partial success is explicit. */
export function gradeAnswer(exercise: Exercise, input: string): GradeResult {
  if (exercise.answer.kind !== "parts")
    return gradeScalar(exercise.answer, exercise.mistakes, input);
  const { parts } = exercise.answer;
  if (
    !parts.length ||
    parts.length > MAX_ANSWER_PARTS ||
    new Set(parts.map((part) => part.id)).size !== parts.length ||
    parts.some((part) => !validPartId(part.id))
  ) {
    return invalid(
      "A feladat részválaszai nincsenek megfelelően beállítva. Válassz másik feladatot.",
    );
  }
  const responses = decodePartResponses(input);
  if (
    responses === null ||
    Object.keys(responses).some((id) => !parts.some((part) => part.id === id))
  ) {
    return invalid("A részválaszokat a hozzájuk tartozó mezőkbe írd.");
  }
  const results = parts.map((part) => ({
    id: part.id,
    label: part.label,
    result: gradeScalar(part.answer, part.mistakes, responses[part.id] ?? ""),
  }));
  const correctCount = results.filter((part) => part.result.correct).length;
  const allCorrect = correctCount === results.length;
  // A mathematical error must count even if another field is still empty.
  const status: GradeResult["status"] = allCorrect
    ? "correct"
    : results.some((part) => part.result.status === "incorrect")
      ? "incorrect"
      : results.some((part) => part.result.status === "form")
        ? "form"
        : "invalid";
  return {
    status,
    correct: allCorrect,
    message: allCorrect
      ? `Mind a(z) ${results.length} részválasz helyes.`
      : `${correctCount} / ${results.length} részválasz helyes. A többihez lent külön visszajelzést találsz.`,
    parts: results,
  };
}

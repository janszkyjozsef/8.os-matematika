import test from "node:test";
import assert from "node:assert/strict";
import type { AnswerSpec, Exercise } from "../src/types.ts";
import {
  decodePartResponses,
  encodePartResponses,
  formatRational,
  gcd,
  gradeAnswer,
  MAX_ANSWER_PARTS,
  MAX_PART_INPUT_LENGTH,
  normalizeExpression,
  parseRational,
  rational,
} from "../src/math/engine.ts";

type NumberAnswer = Extract<AnswerSpec, { kind: "number" }>;
function numberExercise(
  expected: string,
  options: Partial<NumberAnswer> = {},
): Exercise {
  return {
    id: "test-number-v1",
    topic: "tortek",
    kind: "compute",
    prompt: "Add meg a választ.",
    answer: { kind: "number", expected, ...options },
    hints: ["Első támpont.", "Második támpont."],
    solution: [{ expression: expected, why: "Kézzel megoldott referencia." }],
    takeaway: "Ellenőrzés.",
    difficulty: 1,
  };
}

test("exact rational parsing: integer, signs, decimal comma/point, fraction", () => {
  const references: [string, bigint, bigint][] = [
    ["7", 7n, 1n],
    ["-12", -12n, 1n],
    ["+7", 7n, 1n],
    ["−3", -3n, 1n],
    ["-0", 0n, 1n],
    ["0,75", 3n, 4n],
    ["0.75", 3n, 4n],
    [",5", 1n, 2n],
    ["-.5", -1n, 2n],
    ["  6 / 8  ", 3n, 4n],
    ["3/-4", -3n, 4n],
    ["-3/-4", 3n, 4n],
    ["0/7", 0n, 1n],
    ["3⁄4", 3n, 4n],
    ["3∕4", 3n, 4n],
    ["1,5/0,5", 3n, 1n],
    ["0,1/0,3", 1n, 3n],
    ["9007199254740993", 9007199254740993n, 1n],
    ["9007199254740993/9007199254740992", 9007199254740993n, 9007199254740992n],
  ];
  for (const [input, n, d] of references)
    assert.deepEqual(parseRational(input), { n, d }, input);
});

test("only unambiguous space-separated thousands are accepted", () => {
  const references: [string, bigint, bigint][] = [
    ["1 000", 1000n, 1n],
    ["12 345 678", 12345678n, 1n],
    ["1\u00a0234", 1234n, 1n],
    ["1\u202f234,5", 2469n, 2n],
    ["12 345 678,9", 123456789n, 10n],
    ["-1 234/2 000", -617n, 1000n],
    ["1  000", 1000n, 1n],
    // Comma and point are decimal marks, never implicit thousands separators.
    ["1,000", 1n, 1n],
    ["1.000", 1n, 1n],
  ];
  for (const [input, n, d] of references)
    assert.deepEqual(parseRational(input), { n, d }, input);
  for (const input of [
    "1 23",
    "12 34",
    "1234 567",
    "0 001",
    "001 000",
    "1 000 00",
    "1,2 3",
    "1\t000",
    "1\n000",
    "1 1/2",
  ]) {
    assert.equal(parseRational(input), null, input);
  }
});

test("malformed, ambiguous and executable-looking input is never evaluated", () => {
  for (const input of [
    "",
    " ",
    ".",
    ",",
    "1,2,3",
    "1.2,3",
    "1.",
    "1,",
    "1,234.5",
    "1.234,5",
    "1/0",
    "1/-0",
    "1/0,00",
    "/2",
    "2/",
    "1/2/3",
    "--2",
    "++2",
    "+-2",
    "1+2",
    "2^3",
    "2**1000000",
    "(1/2)",
    "1/(2/3)",
    "NaN",
    "Infinity",
    "0x10",
    "1e3",
    "1e-3",
    "Math.random()",
    "globalThis.process.exit()",
    '(()=>{throw new Error("executed")})()',
    "3;console.log(1)",
    "[1,2]",
    "{n:1,d:2}",
    "√16",
    "50%",
    "3cm",
    "x=3",
  ])
    assert.equal(parseRational(input), null, input);
});

test("resource limits reject huge values and nesting before arithmetic", () => {
  for (const input of [
    "9".repeat(49),
    `0.${"1".repeat(25)}`,
    "(".repeat(10000) + "1" + ")".repeat(10000),
    "1/".repeat(10000) + "1",
    "9".repeat(100000),
    `1/${"9".repeat(100000)}`,
  ])
    assert.equal(parseRational(input), null);
  assert.equal(
    gradeAnswer(numberExercise("1"), "1".repeat(100000)).status,
    "invalid",
  );
});

test("rational normalization and formatting preserve exact values", () => {
  assert.equal(gcd(-12n, 18n), 6n);
  assert.equal(gcd(0n, 7n), 7n);
  assert.equal(gcd(0n, 0n), 0n);
  assert.deepEqual(rational(6n, -8n), { n: -3n, d: 4n });
  assert.equal(formatRational({ n: 6n, d: -8n }), "-3/4");
  assert.equal(formatRational({ n: 8n, d: 4n }), "2");
  assert.equal(formatRational({ n: 0n, d: 25n }), "0");
  assert.throws(() => rational(1n, 0n), RangeError);
});

test("exact grading accepts equivalent values, not nearby decimal guesses", () => {
  for (const input of ["3/4", "6/8", "0,75", ".75", "0.7500"])
    assert.equal(
      gradeAnswer(numberExercise("3/4"), input).status,
      "correct",
      input,
    );
  assert.equal(gradeAnswer(numberExercise("1/3"), "0,33").status, "incorrect");
  assert.equal(
    gradeAnswer(numberExercise("1/3"), "0.333333333333333333333333").status,
    "incorrect",
  );
  assert.equal(
    gradeAnswer(numberExercise("9007199254740993"), "9007199254740992").status,
    "incorrect",
  );
  assert.equal(
    gradeAnswer(numberExercise("9007199254740993/9007199254740992"), "1")
      .status,
    "incorrect",
  );
});

test("simplified-form requests distinguish mathematical value from required form", () => {
  const half = numberExercise("1/2", { requireSimplified: true });
  assert.equal(gradeAnswer(half, "1/2").status, "correct");
  for (const input of ["2/4", "0,5", "1,0/2,0", "-1/-2"]) {
    const result = gradeAnswer(half, input);
    assert.equal(result.status, "form", input);
    assert.equal(result.correct, false, input);
    assert.match(result.message, /érték helyes/);
    assert.equal(result.normalized, "1/2");
  }
  const negativeHalf = numberExercise("-1/2", { requireSimplified: true });
  assert.equal(gradeAnswer(negativeHalf, "1/-2").status, "form");
  assert.equal(gradeAnswer(negativeHalf, "-1/2").status, "correct");
  const integer = numberExercise("2", { requireSimplified: true });
  for (const input of ["4/2", "2/1", "2,0"])
    assert.equal(gradeAnswer(integer, input).status, "form");
  assert.equal(gradeAnswer(integer, "2").status, "correct");
  assert.equal(
    gradeAnswer(numberExercise("0", { requireSimplified: true }), "0/5").status,
    "form",
  );
  assert.equal(gradeAnswer(half, "2/5").status, "incorrect");
});

test("units are optional suffixes, but wrong units are never silently ignored", () => {
  const length = numberExercise("5", { unit: "cm" });
  for (const input of ["5", "5 cm", "5cm", "5,0 cm", "10/2 cm"])
    assert.equal(gradeAnswer(length, input).status, "correct", input);
  for (const input of ["5 m", "5 cm²", "5 kg", "0,05 m"]) {
    const result = gradeAnswer(length, input);
    assert.equal(result.status, "incorrect", input);
    assert.match(result.message, /mértékegység/);
  }
  const area = numberExercise("300", { unit: "cm²" });
  for (const input of ["300 cm²", "300cm2", "300 cm^2"])
    assert.equal(gradeAnswer(area, input).status, "correct", input);
  assert.equal(
    gradeAnswer(numberExercise("1000", { unit: "Ft" }), "1 000 ft").status,
    "correct",
  );
  assert.equal(
    gradeAnswer(numberExercise("25", { unit: "%" }), "25%").status,
    "correct",
  );
  assert.equal(gradeAnswer(numberExercise("1/4"), "25%").status, "incorrect");
  assert.equal(gradeAnswer(numberExercise("5"), "5 cm").status, "incorrect");
});

test("variable prefixes are enabled only by the answer contract", () => {
  const equation = numberExercise("-1/2", { variable: "x" });
  for (const input of ["-1/2", "x=-1/2", "x = −0,5"])
    assert.equal(gradeAnswer(equation, input).status, "correct", input);
  for (const input of ["y=-1/2", "2x=-1", "x=x=-1/2", "-1/2=x"])
    assert.equal(gradeAnswer(equation, input).status, "invalid", input);
  assert.equal(gradeAnswer(numberExercise("5"), "x=5").status, "invalid");
  assert.equal(
    gradeAnswer(numberExercise("5", { variable: "y" }), "y = 5").status,
    "correct",
  );
  assert.equal(
    gradeAnswer(numberExercise("5", { variable: "x", unit: "cm" }), "x = 5 cm")
      .status,
    "correct",
  );
});

test("tolerance is explicit, absolute, and exact at the configured boundary", () => {
  assert.equal(
    gradeAnswer(numberExercise("1"), "1.000001").status,
    "incorrect",
  );
  assert.equal(
    gradeAnswer(numberExercise("1", { tolerance: 0 }), "1.000001").status,
    "incorrect",
  );
  const hundredth = numberExercise("1", { tolerance: 0.01 });
  assert.equal(gradeAnswer(hundredth, "1,01").status, "correct");
  assert.equal(gradeAnswer(hundredth, "0.99").status, "correct");
  assert.equal(gradeAnswer(hundredth, "1.010000000000001").status, "incorrect");
  const millionth = numberExercise("1", { tolerance: 1e-6 });
  assert.equal(gradeAnswer(millionth, "1.000001").status, "correct");
  assert.equal(gradeAnswer(millionth, "1.0000011").status, "incorrect");
  for (const tolerance of [-1, NaN, Infinity])
    assert.equal(
      gradeAnswer(numberExercise("1", { tolerance }), "1").status,
      "invalid",
    );
});

test("known mathematical mistakes receive authored feedback, unknown answers do not get diagnosed", () => {
  const exercise = numberExercise("7/12");
  exercise.mistakes = [
    {
      input: "2/7",
      feedback:
        "Előbb válassz közös nevezőt; az azonos méretű részeket adjuk össze.",
    },
  ];
  assert.equal(
    gradeAnswer(exercise, "4/14").message,
    exercise.mistakes[0].feedback,
  );
  const unknown = gradeAnswer(exercise, "3/8");
  assert.equal(unknown.status, "incorrect");
  assert.equal(
    unknown.message,
    "Ez most nem helyes. Próbáld meg újra, vagy kérj egy támpontot.",
  );
  assert.equal(gradeAnswer(exercise, "3/").status, "invalid");
});

test("choice answers use option identifiers, not labels or array indices", () => {
  const exercise: Exercise = {
    ...numberExercise("0"),
    kind: "reason",
    answer: {
      kind: "choice",
      correct: "same-unit",
      options: [
        { id: "same-unit", text: "Azonos méretű részek." },
        { id: "add-denominators", text: "Nevezőket adunk össze." },
      ],
    },
    mistakes: [
      {
        input: "add-denominators",
        feedback: "A részek mérete nem adódik össze.",
      },
    ],
  };
  assert.equal(gradeAnswer(exercise, "same-unit").status, "correct");
  assert.equal(
    gradeAnswer(exercise, "add-denominators").message,
    "A részek mérete nem adódik össze.",
  );
  for (const input of ["0", "Azonos méretű részek.", "", "unknown"])
    assert.equal(gradeAnswer(exercise, input).status, "invalid", input);
});

test("invalid exercise configuration is reported separately from a student error", () => {
  assert.equal(gradeAnswer(numberExercise("1/0"), "2").status, "invalid");
  const exercise = numberExercise("0");
  exercise.answer = {
    kind: "choice",
    correct: "missing",
    options: [{ id: "one", text: "Egy." }],
  };
  assert.equal(gradeAnswer(exercise, "one").status, "invalid");
});

function multipartExercise(): Exercise {
  return {
    ...numberExercise("0"),
    topic: "szamfogalom",
    id: "SZ01-multiple-test",
    answer: {
      kind: "parts",
      parts: [
        {
          id: "opposite",
          label: "A 2,5 ellentettje",
          answer: { kind: "number", expected: "-5/2" },
          mistakes: [
            {
              input: "5/2",
              feedback: "Az ellentett a nulla másik oldalán van.",
            },
          ],
        },
        {
          id: "distance",
          label: "A −6 és a 4 távolsága",
          answer: { kind: "number", expected: "10" },
          mistakes: [
            { input: "2", feedback: "A két pont között a nullát is átléped." },
          ],
        },
        {
          id: "relation",
          label: "−8 és −3 sorrendje",
          answer: {
            kind: "choice",
            correct: "less",
            options: [
              { id: "less", text: "−8 < −3" },
              { id: "greater", text: "−8 > −3" },
            ],
          },
        },
      ],
    },
  };
}

test("multipart grading requires every answer and keeps targeted per-part feedback", () => {
  const exercise = multipartExercise();
  const good = gradeAnswer(
    exercise,
    encodePartResponses({ opposite: "−2,5", distance: "10", relation: "less" }),
  );
  assert.equal(good.status, "correct");
  assert.equal(good.parts?.length, 3);
  assert.ok(good.parts?.every((part) => part.result.correct));
  const wrong = gradeAnswer(
    exercise,
    encodePartResponses({ opposite: "2.5", distance: "10", relation: "less" }),
  );
  assert.equal(wrong.correct, false);
  assert.equal(wrong.status, "incorrect");
  assert.equal(
    wrong.parts?.[0].result.message,
    "Az ellentett a nulla másik oldalán van.",
  );
  assert.equal(wrong.parts?.[1].result.status, "correct");
  const incomplete = gradeAnswer(
    exercise,
    encodePartResponses({ opposite: "-2.5" }),
  );
  assert.equal(incomplete.status, "invalid");
  assert.equal(incomplete.parts?.[0].result.correct, true);
  assert.equal(
    gradeAnswer(exercise, encodePartResponses({ opposite: "2.5" })).status,
    "incorrect",
    "an incomplete other field must not hide a mathematical error",
  );
  assert.equal(gradeAnswer(exercise, "").status, "invalid");
  assert.equal(gradeAnswer(exercise, "10").status, "invalid");
  assert.equal(
    gradeAnswer(exercise, encodePartResponses({ unknown: "10" })).status,
    "invalid",
  );
});

test("multipart forms and units retain the scalar checking contract", () => {
  const exercise: Exercise = {
    ...numberExercise("0"),
    answer: {
      kind: "parts",
      parts: [
        {
          id: "fraction",
          label: "Egyszerűsített tört",
          answer: { kind: "number", expected: "1/2", requireSimplified: true },
        },
        {
          id: "area",
          label: "Terület cm²-ben",
          answer: { kind: "number", expected: "300", unit: "cm²" },
        },
      ],
    },
  };
  const form = gradeAnswer(
    exercise,
    encodePartResponses({ fraction: "2/4", area: "300 cm^2" }),
  );
  assert.equal(form.status, "form");
  assert.equal(form.parts?.[1].result.correct, true);
  assert.equal(
    gradeAnswer(
      exercise,
      encodePartResponses({ fraction: "1/2", area: "300 m²" }),
    ).status,
    "incorrect",
  );
  assert.equal(
    gradeAnswer(
      exercise,
      encodePartResponses({ fraction: "1/2", area: "300 cm²" }),
    ).status,
    "correct",
  );
});

test("part response encoding is bounded and rejects nested or dangerous records", () => {
  assert.deepEqual(decodePartResponses(""), {});
  assert.deepEqual(
    decodePartResponses(encodePartResponses({ first: "-3/2", second: "less" })),
    { first: "-3/2", second: "less" },
  );
  for (const input of [
    "null",
    "[]",
    "1",
    '"text"',
    "{broken",
    '{"part":1}',
    '{"part":{"x":"1"}}',
    '{"__proto__":"x"}',
    '{"constructor":"x"}',
    '{"prototype":"x"}',
    '{"bad id":"1"}',
    JSON.stringify({ part: "x".repeat(181) }),
    JSON.stringify(
      Object.fromEntries(
        Array.from({ length: MAX_ANSWER_PARTS + 1 }, (_, i) => [
          `part${i}`,
          "1",
        ]),
      ),
    ),
    " ".repeat(MAX_PART_INPUT_LENGTH + 1),
  ])
    assert.equal(decodePartResponses(input), null, input.slice(0, 60));
  assert.throws(() => encodePartResponses({ part: "x".repeat(181) }));
  const maximum = Object.fromEntries(
    Array.from({ length: MAX_ANSWER_PARTS }, (_, i) => [
      `part${i}`,
      "\u0000".repeat(180),
    ]),
  );
  assert.deepEqual(decodePartResponses(encodePartResponses(maximum)), maximum);
  const badConfig = multipartExercise();
  if (badConfig.answer.kind === "parts")
    badConfig.answer.parts[1].id = badConfig.answer.parts[0].id;
  assert.equal(gradeAnswer(badConfig, "{}").status, "invalid");
});

test("typed expression tasks normalize notation without evaluating arbitrary input", () => {
  const expression: Exercise = {
    ...numberExercise("0"),
    answer: {
      kind: "expression",
      accepted: ["2 × (3 + 4)", "(3 + 4) × 2"],
      example: "Például: 2 × (3 + 4)",
    },
    mistakes: [
      {
        input: "2 × 3 + 4",
        feedback: "Itt az egész összeget kell kétszerezni.",
      },
    ],
  };
  for (const input of ["2*(3+4)", "2 · [3 + 4]", "(3+4)×2"])
    assert.equal(gradeAnswer(expression, input).status, "correct", input);
  assert.equal(
    gradeAnswer(expression, "2*3+4").message,
    "Itt az egész összeget kell kétszerezni.",
  );
  assert.equal(
    gradeAnswer(expression, "14").status,
    "incorrect",
    "a final number does not satisfy a request to construct the expression",
  );
  assert.equal(normalizeExpression(" −3² "), "-3^2");
  assert.equal(normalizeExpression("(−3)²"), "(-3)^2");
  assert.notEqual(normalizeExpression("−3²"), normalizeExpression("(−3)²"));
  assert.equal(normalizeExpression("1,5 : [2 + 1]"), "1.5/(2+1)");
  for (const input of [
    "",
    "(()=>1)()",
    "globalThis.process.exit()",
    "1;alert(1)",
    "x".repeat(181),
  ]) {
    assert.equal(
      gradeAnswer(expression, input).status,
      "invalid",
      input.slice(0, 60),
    );
  }
  const noAccepted: Exercise = {
    ...expression,
    answer: { kind: "expression", accepted: [] },
  };
  assert.equal(gradeAnswer(noAccepted, "1").status, "invalid");
});

test("foundation unit suffixes retain dimensions, accents, and case", () => {
  for (const unit of [
    "°C",
    "cm²",
    "cm³",
    "m²",
    "m/s",
    "Ft/m",
    "Ft/kg",
    "óra",
    "perc",
    "s",
    "db",
    "oldal/perc",
    "km",
  ]) {
    assert.equal(
      gradeAnswer(numberExercise("5/2", { unit }), `2,5 ${unit}`).status,
      "correct",
      unit,
    );
  }
  for (const [unit, wrong] of [
    ["cm²", "cm"],
    ["cm³", "cm²"],
    ["m/s", "km/h"],
    ["óra", "perc"],
    ["mL", "ML"],
  ]) {
    assert.equal(
      gradeAnswer(numberExercise("5/2", { unit }), `2,5 ${wrong}`).status,
      "incorrect",
      `${unit} vs ${wrong}`,
    );
  }
});

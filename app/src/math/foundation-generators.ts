import type {
  AnswerPart,
  AnswerSpec,
  Exercise,
  ScalarAnswerSpec,
  SolutionStep,
  TopicId,
} from "../types.ts";
import { formatRational, parseRational, rational } from "./engine.ts";

interface Family {
  id: string;
  topic: TopicId;
  title: string;
}
export const foundationGeneratorFamilies: readonly Family[] = Object.freeze([
  {
    id: "signed-position-v1",
    topic: "szamfogalom",
    title: "Hely, ellentett és távolság",
  },
  {
    id: "signed-subtraction-v1",
    topic: "szamfogalom",
    title: "Kivonás az ellentett hozzáadásával",
  },
  {
    id: "signed-missing-v1",
    topic: "szamfogalom",
    title: "Hiányzó kivonandó és visszahelyettesítés",
  },
  {
    id: "order-chain-v1",
    topic: "muveleti-sorrend",
    title: "Azonos rangú osztás és szorzás",
  },
  {
    id: "order-independent-v1",
    topic: "muveleti-sorrend",
    title: "Független részek és zárójel",
  },
  {
    id: "order-signed-square-v1",
    topic: "muveleti-sorrend",
    title: "Négyzet vagy a négyzet ellentettje?",
  },
  {
    id: "ratio-unit-price-v1",
    topic: "aranyossag",
    title: "Változatlan egységár és új mennyiség",
  },
  {
    id: "ratio-shared-work-v1",
    topic: "aranyossag",
    title: "Állandó teljes munka, más létszám",
  },
  {
    id: "ratio-fixed-fee-v1",
    topic: "aranyossag",
    title: "Alapdíjas ellenpélda két adatpárral",
  },
  {
    id: "units-dimensions-v1",
    topic: "mertekegysegek",
    title: "Egy, két vagy három irányú egységváltás",
  },
  {
    id: "units-clock-v1",
    topic: "mertekegysegek",
    title: "Tizedes óra és óra–perc különbsége",
  },
  {
    id: "units-container-v1",
    topic: "mertekegysegek",
    title: "Rétegek, térfogat és szabad hely",
  },
]);

interface Random {
  int(min: number, max: number): number;
  pick<T>(values: readonly T[]): T;
}
function randomFrom(key: string): Random {
  let state = 2166136261;
  for (let i = 0; i < key.length; i++)
    state = Math.imul(state ^ key.charCodeAt(i), 16777619) >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) =>
    min + Math.floor(next() * (max - min + 1));
  return {
    int,
    pick: <T>(values: readonly T[]) => values[int(0, values.length - 1)],
  };
}

const fraction = (n: number, d = 1) => {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d === 0)
    throw new RangeError(
      "Pontosan megadott egész generátorparaméter szükséges.",
    );
  return formatRational(rational(BigInt(n), BigInt(d)));
};
// Only denominators with finite, short decimals enter the displayed data.
const hu = (n: number, d = 1) =>
  String(n / d)
    .replace("-", "−")
    .replace(".", ",");
const exactHu = (n: number, d = 1) => fraction(n, d).replace("-", "−");
const num = (
  expected: string,
  unit?: string,
  variable?: string,
): ScalarAnswerSpec => ({
  kind: "number",
  expected,
  ...(unit ? { unit } : {}),
  ...(variable ? { variable } : {}),
});
const select = (
  correct: string,
  options: [string, string][],
): ScalarAnswerSpec => ({
  kind: "choice",
  correct,
  options: options.map(([id, text]) => ({ id, text })),
});
const step = (expression: string, why: string): SolutionStep => ({
  expression,
  why,
});
const explanation = (prompt: string, ...checkpoints: string[]) => ({
  prompt,
  checkpoints,
});
const yesNo = (yes: boolean) =>
  select(yes ? "yes" : "no", [
    ["yes", "Igen"],
    ["no", "Nem"],
  ]);

function field(
  id: string,
  label: string,
  answer: ScalarAnswerSpec,
  alternatives: [string, string][] = [],
): AnswerPart {
  // Avoid diagnostics that accidentally equal a valid answer after parameters
  // are substituted (e.g. zero, opposite values, or a factor of one).
  const seen = new Set<string>();
  const mistakes = alternatives.flatMap(([input, feedback]) => {
    let key = input;
    if (answer.kind === "number") {
      const actual = parseRational(input),
        expected = parseRational(answer.expected);
      if (
        !actual ||
        !expected ||
        actual.n * expected.d === expected.n * actual.d
      )
        return [];
      key = formatRational(actual);
    } else if (answer.kind === "choice" && input === answer.correct) return [];
    if (seen.has(key)) return [];
    seen.add(key);
    return [{ input, feedback }];
  });
  return { id, label, answer, ...(mistakes.length ? { mistakes } : {}) };
}
const multipart = (...parts: AnswerPart[]): AnswerSpec => ({
  kind: "parts",
  parts,
});
type Draft = Omit<Exercise, "id" | "topic">;

function signedNumbers(family: number, random: Random): Draft {
  const a = random.int(-48, 48),
    b = random.int(-48, 48);
  const start = hu(a, 4),
    other = hu(b, 4);
  if (family === 0)
    return {
      kind: "reason",
      difficulty: 2,
      prompt: `A pont koordinátája a = ${start}; B pont koordinátája b = ${other}. A számegyenes egysége rögzített. Add meg a ellentettjét, abszolút értékét, a két pont távolságát és a koordináták sorrendjét.`,
      answer: multipart(
        field("opposite", "a ellentettje", num(fraction(-a, 4)), [
          [
            fraction(a, 4),
            "Az ellentett az a szám, amely az eredetivel összeadva nullát ad.",
          ],
        ]),
        field("absolute", "|a|", num(fraction(Math.abs(a), 4)), [
          [fraction(-Math.abs(a), 4), "A nullától mért távolság nem negatív."],
        ]),
        field(
          "distance",
          "A két pont távolsága (egység)",
          num(fraction(Math.abs(a - b), 4)),
          [
            [
              fraction(a - b, 4),
              "A pontok távolsága nemnegatív. Az előjeles különbségből távolságot keress.",
            ],
          ],
        ),
        field(
          "relation",
          "a … b",
          select(a < b ? "lt" : a > b ? "gt" : "eq", [
            ["lt", "<"],
            ["eq", "="],
            ["gt", ">"],
          ]),
        ),
      ),
      hints: [
        "Az ellentettet tükrözéssel, az abszolút értéket távolsággal keresd.",
        `A két pont között ${hu(Math.abs(a - b), 4)} egységnyi út van; külön kérdés, melyik van jobbra.`,
      ],
      solution: [
        step(
          `−a = ${hu(-a, 4)}; |a| = ${hu(Math.abs(a), 4)}`,
          "Az egyik művelet tükrözés, a másik nemnegatív távolság.",
        ),
        step(
          `AB = |${other} − (${start})| = ${hu(Math.abs(a - b), 4)}`,
          "A két pont közti út hosszát keressük.",
        ),
        step(
          `${start} ${a < b ? "<" : a > b ? ">" : "="} ${other}`,
          "A számegyenesen jobbra nagyobbak a koordináták.",
        ),
      ],
      takeaway: "A koordináta, az ellentett és a távolság külön fogalom.",
      reflection: explanation(
        "Indokold a sorrendet és az abszolút értéket külön-külön.",
        "A sorrendet a bal–jobb helyzettel magyaráztam.",
        "A távolság nemnegatív, akkor is, ha a koordináta negatív.",
      ),
    };
  if (family === 1)
    return {
      kind: "compute",
      difficulty: 2,
      prompt: `Számítsd ki a − b értékét, ha a = ${start} és b = ${other}. Add meg külön a hozzáadandó ellentettet, a végeredményt és az elmozdulás irányát.`,
      answer: multipart(
        field("opposite", "A kivonandó ellentettje", num(fraction(-b, 4)), [
          [fraction(b, 4), "A kivonandó ellentettjét kell hozzáadnunk."],
        ]),
        field("value", "a − b értéke", num(fraction(a - b, 4)), [
          [
            fraction(a + b, 4),
            "Ez a + b értéke lehet. A kivonásnál b ellentettjét adjuk a-hoz.",
          ],
        ]),
        field(
          "direction",
          "Elmozdulás az a pontból",
          select(b < 0 ? "right" : b > 0 ? "left" : "stay", [
            ["left", "Balra"],
            ["right", "Jobbra"],
            ["stay", "Nem mozdul"],
          ]),
        ),
      ),
      hints: [
        "a − b = a + (−b). A kivonandó előjele szabja meg az elmozdulást.",
        `A kivonandó ${other}, az ellentettje ${hu(-b, 4)}.`,
      ],
      solution: [
        step(
          `${start} − (${other}) = ${start} + (${hu(-b, 4)})`,
          "A kivonás az ellentett hozzáadása.",
        ),
        step(
          `a − b = ${hu(a - b, 4)}`,
          b < 0
            ? "A negatív kivonandó miatt jobbra lépünk."
            : b > 0
              ? "A pozitív kivonandó miatt balra lépünk."
              : "Nulla kivonásakor helyben maradunk.",
        ),
        step(
          `${hu(a - b, 4)} + (${other}) = ${start}`,
          "A kivont szám visszaadása az eredeti kezdőértéket adja.",
        ),
      ],
      takeaway: "A kivonás nem jelent automatikusan csökkenést.",
    };
  return {
    kind: "transfer",
    difficulty: 2,
    prompt: `Keresd a hiányzó x számot: ${start} − x = ${other}. Add meg x-et, és helyettesítéssel ellenőrizd. A kivonandó előjelét is válaszd ki.`,
    answer: multipart(
      field("x", "x értéke", num(fraction(a - b, 4), undefined, "x"), [
        [
          fraction(b - a, 4),
          "Ez a fordított különbség. Ellenőrizd az eredeti a − x = b egyenletben.",
        ],
      ]),
      field(
        "sign",
        "x előjele",
        select(a - b < 0 ? "negative" : a - b > 0 ? "positive" : "zero", [
          ["negative", "Negatív"],
          ["zero", "Nulla"],
          ["positive", "Pozitív"],
        ]),
      ),
    ),
    hints: [
      "Milyen kivonandó visz a kezdőértéktől a megadott eredményig?",
      `A hiányzó kivonandó: ${start} − (${other}).`,
    ],
    solution: [
      step(
        `x = ${start} − (${other}) = ${hu(a - b, 4)}`,
        "A kezdőérték és eredmény különbsége a kivonandó.",
      ),
      step(
        `${start} − (${hu(a - b, 4)}) = ${other}`,
        "Visszahelyettesítve visszakapjuk az eredeti jobb oldalt.",
      ),
    ],
    takeaway: "Az előjelet a visszahelyettesítés is ellenőrzi.",
    reflection: explanation(
      "Mutasd meg a visszahelyettesítést az eredeti egyenletben.",
      "Az x helyére a megtalált előjeles számot írtam.",
      "Az eredeti kivonást megtartottam, és a jobb oldalt kaptam.",
    ),
  };
}

function operationOrder(family: number, random: Random): Draft {
  if (family === 0) {
    const divisor = random.int(2, 9),
      quotient = random.int(2, 15),
      multiplier = random.int(2, 7),
      last = random.int(1, 35);
    const first = divisor * quotient,
      answer = quotient * multiplier - last;
    return {
      kind: "compute",
      difficulty: 2,
      prompt: `Számítsd ki: ${first} : ${divisor} × ${multiplier} − ${last}. Add meg a jogos első hányadost és az egész kifejezés értékét.`,
      answer: multipart(
        field(
          "first",
          "Az első elvégezhető hányados értéke",
          num(String(quotient)),
          [
            [
              fraction(quotient, multiplier),
              "A szorzás és osztás azonos rangú; a lánc bal oldali osztásával kezdünk.",
            ],
          ],
        ),
        field("value", "Teljes érték", num(String(answer)), [
          [
            fraction(quotient - last * multiplier, multiplier),
            "Ez az első osztó és a szorzótényező összezárójelezéséből jöhet. Az eredeti lánc balról jobbra értelmezett.",
          ],
        ]),
      ),
      hints: [
        "A szorzás nem előzi meg automatikusan az osztást.",
        `Először ${first} : ${divisor}, ezt szorozd meg a ${multiplier} számmal; a kivonás ezután jön.`,
      ],
      solution: [
        step(
          `${first} : ${divisor} × ${multiplier} − ${last} = ${quotient} × ${multiplier} − ${last}`,
          "Azonos rangnál a bal oldali művelettel kezdünk.",
        ),
        step(
          `${quotient * multiplier} − ${last} = ${answer}`,
          "A szorzás a kivonás előtt következik.",
        ),
      ],
      takeaway: "Tartsd meg az azonos rangú lánc balról jobbra szerkezetét.",
    };
  }
  if (family === 1) {
    const a = random.int(2, 8),
      c = random.int(1, 12),
      difference = random.int(2, 14),
      b = c + difference;
    const divisor = random.int(2, 9),
      quotient = random.int(2, 16),
      dividend = divisor * quotient;
    return {
      kind: "reason",
      difficulty: 2,
      prompt: `Számítsd ki: ${a} × (${b} − ${c}) + ${dividend} : ${divisor}. Add meg a zárójel értékét, a független hányadost és az egész kifejezés értékét. Indokold a két jogos kezdést.`,
      answer: multipart(
        field("bracket", "A zárójel értéke", num(String(difference))),
        field("quotient", "A független osztás értéke", num(String(quotient))),
        field("value", "Teljes érték", num(String(a * difference + quotient)), [
          [
            String(a * b - c + quotient),
            "A szorzó a teljes zárójelre vonatkozik. A belső kivonás különbsége az egyik tényező.",
          ],
        ]),
      ),
      hints: [
        "A zárójel és a másik tag osztása nem egymás eredményéből számol.",
        `A két kezdő rész: ${b} − ${c}, illetve ${dividend} : ${divisor}.`,
      ],
      solution: [
        step(
          `${b} − ${c} = ${difference}; ${dividend} : ${divisor} = ${quotient}`,
          "A két független rész bármely sorrendben kiszámítható.",
        ),
        step(
          `${a} × ${difference} + ${quotient} = ${a * difference} + ${quotient} = ${a * difference + quotient}`,
          "A zárójel értékével szorzunk, utána összeadunk.",
        ),
      ],
      takeaway:
        "A független részek miatt több jogos kezdés lehet, a zárójel értelmét mindegyik megőrzi.",
      reflection: explanation(
        "Miért lehet a másik tag osztásával kezdeni?",
        "Nem használja a zárójel eredményét.",
        "A teljes kifejezés többi része változatlanul megmarad.",
      ),
    };
  }
  const a = random.int(2, 12),
    b = random.int(2, 12);
  return {
    kind: "reason",
    difficulty: 2,
    prompt: `Számítsd ki: −${a}² + (−${b})². Add meg külön a két tagot és az összegüket.`,
    answer: multipart(
      field("first", "Első tag", num(String(-a * a)), [
        [String(a * a), "Az első tagban a mínusz a négyzeten kívül áll."],
      ]),
      field("second", "Második tag", num(String(b * b)), [
        [
          String(-b * b),
          "A második tagban a negatív előjel a teljes hatványalaphoz tartozik.",
        ],
      ]),
      field("sum", "Összeg", num(String(b * b - a * a)), [
        [
          String(a * a + b * b),
          "A két négyzetet nem adhatjuk automatikusan pozitívként össze: olvasd el az első előjelet.",
        ],
      ]),
    ),
    hints: [
      "A hatvány alapját a zárójel határolja.",
      `Az első tag −(${a} × ${a}), a második (−${b}) × (−${b}).`,
    ],
    solution: [
      step(
        `−${a}² = −${a * a}; (−${b})² = ${b * b}`,
        "Az egyik a négyzet ellentettje, a másik két negatív tényező szorzata.",
      ),
      step(
        `−${a * a} + ${b * b} = ${b * b - a * a}`,
        "A két kiszámított tagot az előjelével együtt adjuk össze.",
      ),
    ],
    takeaway: "A zárójel eldönti, része-e az előjel a hatvány alapjának.",
  };
}

function proportions(family: number, random: Random): Draft {
  if (family === 0) {
    const rate = random.int(5, 40) * 20,
      initialQuarters = random.int(3, 24);
    let targetQuarters = random.int(1, 32);
    if (targetQuarters === initialQuarters) targetQuarters += 1;
    const initialPrice = (rate * initialQuarters) / 4,
      finalPrice = (rate * targetQuarters) / 4;
    return {
      kind: "transfer",
      difficulty: 2,
      prompt: `${hu(initialQuarters, 4)} kg díszkő ${initialPrice} Ft. Mennyi ${hu(targetQuarters, 4)} kg ára változatlan egységárral, kedvezmény és más díj nélkül? Add meg a kilogrammonkénti árat is.`,
      answer: multipart(
        field("rate", "Egységár (Ft/kg)", num(String(rate), "Ft/kg")),
        field("price", "Új ár (Ft)", num(String(finalPrice), "Ft"), [
          [
            fraction(initialPrice * initialQuarters, targetQuarters),
            "Az ár a mennyiséggel azonos irányban változik. Egységárat keress, ne fordított arányt.",
          ],
        ]),
      ),
      hints: [
        "Változatlan az egy kilogrammra jutó ár.",
        `Először ${initialPrice} Ft-ot ossz ${hu(initialQuarters, 4)} kilogrammal.`,
      ],
      solution: [
        step(
          `${initialPrice} : ${hu(initialQuarters, 4)} = ${rate} Ft/kg`,
          "Az állandó egységárat keressük.",
        ),
        step(
          `${hu(targetQuarters, 4)} × ${rate} = ${finalPrice} Ft`,
          "Minden kilogramm ugyanannyit ér.",
        ),
        step(
          `${finalPrice} : ${hu(targetQuarters, 4)} = ${rate} Ft/kg`,
          "A hányados ellenőrzése visszaadja az egységárat.",
        ),
      ],
      takeaway:
        "A fix díj hiánya és az állandó egységár teszi egyenesen arányossá a kapcsolatot.",
    };
  }
  if (family === 1) {
    const oldCount = random.int(2, 8),
      oldTime = random.int(4, 24);
    let newCount = random.int(2, 12);
    if (newCount === oldCount) newCount = newCount === 12 ? 11 : newCount + 1;
    const work = oldCount * oldTime;
    return {
      kind: "transfer",
      difficulty: 2,
      prompt: `${oldCount} azonos segítő ${oldTime} óra alatt végez egy munkával. Mennyi idő kell ${newCount} ilyen segítőnek? A teljes munka ugyanaz, szabadon felosztható, az ütem állandó, közös várakozás vagy előkészítés nincs. Pontos értéket adj; egyszerű tört is használható.`,
      answer: multipart(
        field(
          "work",
          "A teljes munka (segítőóra)",
          num(String(work), "segítőóra"),
        ),
        field("time", "Az új idő (óra)", num(fraction(work, newCount), "óra"), [
          [
            fraction(oldTime * newCount, oldCount),
            "Az idő nem egyenesen arányos a létszámmal. A létszám és idő szorzata a teljes munka.",
          ],
        ]),
      ),
      hints: [
        "A teljes munkamennyiség rögzített.",
        `Előbb ${oldCount} × ${oldTime} segítőórát számolj, majd ezt oszd az új létszámmal.`,
      ],
      solution: [
        step(
          `${oldCount} × ${oldTime} = ${work} segítőóra`,
          "Ez a teljes munka.",
        ),
        step(
          `${work} : ${newCount} = ${exactHu(work, newCount)} óra`,
          "A rögzített munka ennyi segítő közt oszlik meg.",
        ),
        step(
          `${newCount} × (${exactHu(work, newCount)}) = ${work}`,
          "A szorzat változatlan marad.",
        ),
      ],
      takeaway:
        "A fordított arányosságot a munka feltételei indokolják; a törtes idő nem törtes létszám.",
      reflection: explanation(
        "Melyik feltétel hiányában nem volna biztos a számítás?",
        "Azonos és állandó munkaütem.",
        "Szabadon felosztható teljes munka, közös várakozás vagy előkészítés nélkül.",
      ),
    };
  }
  const base = random.int(2, 12) * 100,
    rate = random.int(1, 8) * 50,
    distance = random.int(1, 6);
  const first = base + rate * distance,
    second = base + rate * distance * 2;
  return {
    kind: "reason",
    difficulty: 2,
    prompt: `A kitalált díj ${base} Ft alapdíj + ${rate} Ft kilométerenként. Mennyi a teljes díj ${distance} km és ${distance * 2} km útnál? Egyenesen arányos-e a teljes díj a távolsággal?`,
    answer: multipart(
      field(
        "first",
        `${distance} km teljes díja (Ft)`,
        num(String(first), "Ft"),
      ),
      field(
        "second",
        `${distance * 2} km teljes díja (Ft)`,
        num(String(second), "Ft"),
        [
          [
            String(first * 2),
            "Az alapdíjat mindkét útnál egyszer fizetjük, ezért nem kétszerezzük az egész összeget.",
          ],
        ],
      ),
      field("direct", "A teljes díj egyenesen arányos?", yesNo(false)),
    ),
    hints: [
      "Mindkét díjnál egyszer szerepel az alapdíj.",
      `Hasonlítsd össze a ${first} kétszeresét a hosszabb út tényleges díjával.`,
    ],
    solution: [
      step(
        `${base} + ${rate} × ${distance} = ${first} Ft`,
        "Alapdíj és távolságtól függő rész együtt.",
      ),
      step(
        `${base} + ${rate} × ${distance * 2} = ${second} Ft`,
        "A távolság kétszeres, de a fix tag változatlan.",
      ),
      step(
        `${first} × 2 = ${first * 2} ≠ ${second}`,
        "Ez ellenpélda az egyenes arányosságra; csak az alapdíjon felüli rész arányos.",
      ),
    ],
    takeaway:
      "Az alapdíjas díj növekvő, mégsem egyenesen arányos a távolsággal.",
    reflection: explanation(
      "Melyik díjrész lenne egyenesen arányos a távolsággal?",
      "A teljes díjból az alapdíjat levonva kapott rész.",
      "Minden kilométerre ugyanannyi díjrész jut.",
    ),
  };
}

function units(family: number, random: Random): Draft {
  if (family === 0) {
    const dimension = random.int(1, 3),
      tenths = random.int(1, 99),
      reverse = random.int(0, 1) === 1;
    const power = dimension === 1 ? "" : dimension === 2 ? "²" : "³";
    const from = `${reverse ? "cm" : "dm"}${power}`,
      to = `${reverse ? "dm" : "cm"}${power}`;
    const factor = 10 ** dimension;
    const expected = reverse
      ? fraction(tenths, 10 * factor)
      : fraction(tenths * factor, 10);
    const dimensionName =
      dimension === 1 ? "hosszúság" : dimension === 2 ? "terület" : "térfogat";
    return {
      kind: "reason",
      difficulty: dimension === 1 ? 1 : 2,
      prompt: `Ugyanaz a ${dimensionName} ${hu(tenths, 10)} ${from}. Fejezd ki ${to}-ben. Add meg azt is, hány ${`cm${power}`} egy ${`dm${power}`}. A tárgy méretét nem változtatjuk meg.`,
      answer: multipart(
        field(
          "factor",
          `1 dm${power} hány cm${power}?`,
          num(String(factor), `cm${power}`),
          [
            [
              dimension === 1 ? "100" : "10",
              `A váltószám ${dimension} irányban érvényesül. Számold külön az egy irányra jutó tízes tényezőket.`,
            ],
          ],
        ),
        field("value", `Az eredmény (${to})`, num(expected, to), [
          [
            reverse
              ? fraction(tenths * factor, 10)
              : fraction(tenths, 10 * factor),
            "Nézd a váltás irányát: ugyanazt a pozitív mennyiséget kisebb egységben nagyobb, nagyobban kisebb számmal írjuk.",
          ],
        ]),
      ),
      hints: [
        `A dm–cm hosszkapcsolat tízes. Ennél a mennyiségnél ${dimension} irányban számolunk.`,
        `A váltószám ${Array(dimension).fill("10").join(" × ")} = ${factor}; most ${reverse ? "nagyobb" : "kisebb"} egységre váltunk.`,
      ],
      solution: [
        step(
          `1 dm${power} = ${factor} cm${power}`,
          `${dimension} kiterjedési irányból ered a váltószám.`,
        ),
        step(
          `${hu(tenths, 10)} ${from} = ${expected.replace("-", "−")} ${to}`,
          reverse
            ? "Nagyobb egységből kevesebb kell, ezért osztunk."
            : "Kisebb egységből több kell, ezért szorzunk.",
        ),
      ],
      takeaway:
        "A mérőszám és az egység változott; a mennyiség ugyanaz maradt.",
      reflection: explanation(
        "Miért nem nagyítás történt?",
        "Ugyanazt a tárgyat más egységgel mértük.",
        "A fizikai hossz/terület/térfogat nem változott.",
      ),
    };
  }
  if (family === 1) {
    const hours = random.int(1, 4),
      minuteLabel = random.int(1, 11) * 5;
    const decimalMinutes = hours * 60 + (minuteLabel * 3) / 5;
    const clockMinutes = hours * 60 + minuteLabel;
    return {
      kind: "reason",
      difficulty: 2,
      prompt: `Hasonlítsd össze: ${hours},${String(minuteLabel).padStart(2, "0")} óra és ${hours} óra ${minuteLabel} perc. Add meg mindkettőt percben és a két idő különbségét.`,
      answer: multipart(
        field(
          "decimal",
          "A tizedes órában megadott idő (perc)",
          num(String(decimalMinutes), "perc"),
          [
            [
              String(clockMinutes),
              "A vessző utáni szám századórákat jelöl, nem perceket. Szorozd a tört órát 60-nal.",
            ],
          ],
        ),
        field(
          "clock",
          "Az óra–perc alakban megadott idő (perc)",
          num(String(clockMinutes), "perc"),
        ),
        field(
          "difference",
          "A hosszabb és rövidebb idő különbsége (perc)",
          num(String(clockMinutes - decimalMinutes), "perc"),
        ),
      ),
      hints: [
        "Az egész óra 60 perc, a tizedes rész ugyanennek az órának a törtrésze.",
        `${minuteLabel}/100 óra = ${minuteLabel}/100 × 60 perc.`,
      ],
      solution: [
        step(
          `${hours} × 60 + (${minuteLabel}/100) × 60 = ${decimalMinutes} perc`,
          "A tört részt is órából váltjuk.",
        ),
        step(
          `${hours} × 60 + ${minuteLabel} = ${clockMinutes} perc`,
          "Itt a második tag már eleve percben van.",
        ),
        step(
          `${clockMinutes} − ${decimalMinutes} = ${clockMinutes - decimalMinutes} perc`,
          "Azonos egységű időket hasonlítunk össze.",
        ),
      ],
      takeaway:
        "A tizedesvessző utáni számjegyek nem alkotnak külön percmezőt.",
    };
  }
  const a = random.int(2, 6) * 10,
    b = random.int(2, 8) * 5,
    height = random.int(2, 10) * 5;
  const waterHeight = random.int(1, height - 1),
    capacity = a * b * height,
    water = a * b * waterHeight;
  return {
    kind: "transfer",
    difficulty: 3,
    prompt: `Egy téglatest alakú edény belső méretei ${a} cm × ${b} cm × ${height} cm. A víz ${waterHeight} cm magasan áll, vízszintje vízszintes. Mennyi az edény befogadóképessége, a benne lévő víz és a szabad hely literben?`,
    answer: multipart(
      field(
        "capacity",
        "Befogadóképesség (L)",
        num(fraction(capacity, 1000), "L"),
        [
          [
            String(capacity),
            "Ez köbcentiméterben adja a térfogatot; ezer köbcentiméter egy liter.",
          ],
        ],
      ),
      field("water", "Benne lévő víz (L)", num(fraction(water, 1000), "L")),
      field(
        "remaining",
        "Szabad hely (L)",
        num(fraction(capacity - water, 1000), "L"),
      ),
    ),
    hints: [
      "Az alap mindkét térfogatnál ugyanaz; a magasság változik.",
      `Az alap ${a} × ${b} = ${a * b} cm². A teljes edényhez ${height}, a vízhez ${waterHeight} cm magasságot használj.`,
    ],
    solution: [
      step(
        `${a} × ${b} × ${height} = ${capacity} cm³ = ${exactHu(capacity, 1000)} L`,
        "A belső élek szorzata a teljes befogadóképesség.",
      ),
      step(
        `${a} × ${b} × ${waterHeight} = ${water} cm³ = ${exactHu(water, 1000)} L`,
        "A víznél a tényleges vízmagassággal számolunk.",
      ),
      step(
        `Szabad tér: ${capacity - water} cm³ = ${exactHu(capacity - water, 1000)} L`,
        "Az edény és víz térfogatának különbségét vesszük, azonos egységben.",
      ),
    ],
    takeaway:
      "A benne lévő és a szabad tér együtt pontosan az edény belső térfogata.",
  };
}

const builders: Partial<
  Record<TopicId, (index: number, random: Random) => Draft>
> = {
  szamfogalom: signedNumbers,
  "muveleti-sorrend": operationOrder,
  aranyossag: proportions,
  mertekegysegek: units,
};

/** Versioned family + complete safe-integer seed/variant identifies the task. */
export function generateFoundationExercise(
  topic: TopicId,
  seed: number,
  variant?: number,
): Exercise {
  if (!Number.isSafeInteger(seed))
    throw new RangeError("A seed biztonságos egész szám legyen.");
  if (variant !== undefined && !Number.isSafeInteger(variant))
    throw new RangeError("A változat biztonságos egész szám legyen.");
  if (!Object.hasOwn(builders, topic))
    throw new RangeError("Ismeretlen alapozó témakör.");
  const available = foundationGeneratorFamilies.filter(
    (family) => family.topic === topic,
  );
  const selectedVariant = variant ?? seed;
  const index =
    ((selectedVariant % available.length) + available.length) %
    available.length;
  const family = available[index];
  const key = `${family.id}:seed=${seed}:variant=${selectedVariant}`;
  return {
    ...builders[topic]!(
      index,
      randomFrom(`matek8-foundation-generator-v1:${key}`),
    ),
    topic,
    id: `generated:${key}`,
  };
}

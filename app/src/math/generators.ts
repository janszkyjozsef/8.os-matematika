import type { AnswerSpec, Exercise, SolutionStep, TopicId } from "../types.ts";
import {
  foundationGeneratorFamilies,
  generateFoundationExercise,
} from "./foundation-generators.ts";
import { formatRational, parseRational, rational } from "./engine.ts";
import { bridgeGeneratorFamilies, generateBridgeExercise } from "./bridge-generators.ts";

export interface GeneratorFamily {
  id: string;
  topic: TopicId;
  title: string;
}

/** The order within each topic is the public variant 0 / 1 / 2 order. */
export const legacyGeneratorFamilies: readonly GeneratorFamily[] =
  Object.freeze([
    {
      id: "frac-common-unit-v1",
      topic: "tortek",
      title: "A közös részegység megkeresése",
    },
    {
      id: "frac-sum-v1",
      topic: "tortek",
      title: "Törtek összeadása és egyszerűsítése",
    },
    {
      id: "frac-measure-division-v1",
      topic: "tortek",
      title: "Osztás mint két hossz aránya",
    },
    {
      id: "percent-part-v1",
      topic: "szazalek",
      title: "Mennyi az adott százalék?",
    },
    {
      id: "percent-base-v1",
      topic: "szazalek",
      title: "Az eredeti egész visszakeresése",
    },
    {
      id: "percent-change-v1",
      topic: "szazalek",
      title: "Két változás, két százalékalap",
    },
    {
      id: "eq-linear-v1",
      topic: "egyenlet",
      title: "Egyenlet két visszafordítható lépéssel",
    },
    {
      id: "eq-group-v1",
      topic: "egyenlet",
      title: "Azonos csomagok és zárójelek",
    },
    {
      id: "eq-negative-v1",
      topic: "egyenlet",
      title: "Negatív együttható, változatlan egyenlőség",
    },
    {
      id: "graph-value-v1",
      topic: "grafikon",
      title: "Szabályból összetartozó értékpár",
    },
    {
      id: "graph-start-v1",
      topic: "grafikon",
      title: "Kezdőérték két pontból",
    },
    {
      id: "graph-fee-inverse-v1",
      topic: "grafikon",
      title: "Alapdíjas modell visszafelé",
    },
    {
      id: "pyth-hypotenuse-v1",
      topic: "pitagorasz",
      title: "Az átfogó és a négyzetterületek",
    },
    { id: "pyth-leg-v1", topic: "pitagorasz", title: "Egy hiányzó befogó" },
    {
      id: "pyth-context-v1",
      topic: "pitagorasz",
      title: "A téglalap átlója mint legrövidebb út",
    },
    {
      id: "prob-dice-sum-v1",
      topic: "valoszinuseg",
      title: "Két kocka rendezett dobáspárjai",
    },
    {
      id: "prob-favorable-v1",
      topic: "valoszinuseg",
      title: "A kedvező mezők megszámolása",
    },
    {
      id: "prob-urn-v1",
      topic: "valoszinuseg",
      title: "Golyók és színek esélye",
    },
  ]);

type NumberAnswer = Extract<AnswerSpec, { kind: "number" }>;
type Draft = Omit<Exercise, "id" | "topic">;
type DraftOptions = Pick<
  Partial<Exercise>,
  "kind" | "difficulty" | "context" | "mistakes"
>;
interface Random {
  int(min: number, max: number): number;
  pick<T>(values: readonly T[]): T;
}

function seededRandom(key: string): Random {
  // FNV-1a seed mixing + a fixed 32-bit PRNG. No clock, network or Math.random.
  let state = 2166136261;
  for (let i = 0; i < key.length; i += 1)
    state = Math.imul(state ^ key.charCodeAt(i), 16777619) >>> 0;
  const next = () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let x = state;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const int = (min: number, max: number) =>
    min + Math.floor(next() * (max - min + 1));
  return {
    int,
    pick: <T>(values: readonly T[]) => values[int(0, values.length - 1)],
  };
}

function frac(n: number, d = 1): string {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d))
    throw new RangeError("A feladat paramétere nem pontos egész szám.");
  return formatRational(rational(BigInt(n), BigInt(d)));
}

function ngcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return Math.abs(a);
}

function display(value: number): string {
  return value < 0 ? `−${-value}` : String(value);
}
function signedTerm(value: number): string {
  return `${value < 0 ? "−" : "+"} ${Math.abs(value)}`;
}
function step(expression: string, why: string): SolutionStep {
  return { expression, why };
}

function draft(
  prompt: string,
  answer: NumberAnswer,
  hints: string[],
  solution: SolutionStep[],
  takeaway: string,
  options: DraftOptions = {},
): Draft {
  const expected = parseRational(answer.expected)!;
  const seen = new Set<string>();
  // A generated diagnostic alternative must never be the correct answer.
  const mistakes = options.mistakes?.filter((mistake) => {
    const value = parseRational(mistake.input);
    if (!value || value.n * expected.d === expected.n * value.d) return false;
    const key = formatRational(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return {
    kind: "compute",
    difficulty: 2,
    prompt,
    answer,
    hints,
    solution,
    takeaway,
    ...options,
    mistakes,
  };
}

const denominatorPairs = [
  [4, 6],
  [6, 8],
  [8, 12],
  [3, 9],
  [5, 10],
  [4, 10],
  [6, 9],
  [3, 4],
  [5, 6],
  [4, 12],
] as const;

function properNumerator(denominator: number, random: Random): number {
  const choices = Array.from(
    { length: denominator - 1 },
    (_, index) => index + 1,
  ).filter((candidate) => ngcd(candidate, denominator) === 1);
  return random.pick(choices);
}

function fractions(family: number, random: Random): Draft {
  const [b, d] = random.pick(denominatorPairs);
  const a = properNumerator(b, random);
  const c = properNumerator(d, random);
  const common = (b * d) / ngcd(b, d);
  const left = (a * common) / b;
  const right = (c * common) / d;
  if (family === 0) {
    const firstMultiples = Array.from(
      { length: common / b },
      (_, i) => (i + 1) * b,
    ).join(", ");
    const secondMultiples = Array.from(
      { length: common / d },
      (_, i) => (i + 1) * d,
    ).join(", ");
    return draft(
      `Az ${a}/${b} és ${c}/${d} törtek ugyanakkora egészre vonatkoznak. Az összeadáshoz mi a megadott nevezők legkisebb pozitív közös többszöröse, vagyis a legkisebb közös nevező?`,
      { kind: "number", expected: String(common) },
      [
        "Olyan pozitív számot keresünk, amelyet mindkét nevező maradék nélkül oszt.",
        `Sorold a ${b} és a ${d} többszöröseit. Az első közös számot keresd, ne a nevezők összegét.`,
      ],
      [
        step(
          `${b} többszörösei: ${firstMultiples}`,
          "Mindig ugyanannyi darabot hozzáadva kapjuk a következő többszöröst.",
        ),
        step(
          `${d} többszörösei: ${secondMultiples}`,
          `Az első közös pozitív szám ${common}; egyik felsorolásban sincs korábbi közös elem.`,
        ),
        step(
          `${a}/${b} = ${left}/${common}; ${c}/${d} = ${right}/${common}`,
          "Ezzel ugyanakkora részeket számolhatunk, a két tört értéke nem változott.",
        ),
      ],
      "A közös nevező közös részegységet ad. A nevezők szorzata lehet közös nevező, de nem mindig a legkisebb.",
      {
        kind: "reason",
        difficulty: 1,
        mistakes: [
          {
            input: String(b + d),
            feedback:
              "A nevezők összegét nem kell vennünk. Keress olyan számot, amelyet mindkét nevező maradék nélkül oszt.",
          },
          {
            input: String(b * d),
            feedback:
              "Ez közös nevező, de itt kisebb is létezik. Melyik a többszörösök első közös pozitív eleme?",
          },
        ],
      },
    );
  }
  if (family === 1) {
    const expected = frac(left + right, common);
    return draft(
      `Add össze: ${a}/${b} + ${c}/${d}. Az eredményt egyszerűsített közönséges tört alakban add meg; ha egész számot kapsz, írd egész számmal.`,
      { kind: "number", expected, requireSimplified: true },
      [
        "Különböző méretű részek darabszámát nem lehet közvetlenül összeadni. Először válassz közös részegységet.",
        `A ${common} közös nevező. Mennyivel kell megszorozni az egyes számlálókat és nevezőket?`,
      ],
      [
        step(
          `${a}/${b} = ${left}/${common}; ${c}/${d} = ${right}/${common}`,
          "Mindkét tört számlálóját és nevezőjét ugyanazzal a nem nulla számmal szoroztuk.",
        ),
        step(
          `${left}/${common} + ${right}/${common} = ${left + right}/${common}`,
          "Azonos méretű részek darabszámát adjuk össze; a részek mérete változatlan.",
        ),
        step(
          `${left + right}/${common} = ${expected}`,
          "A végén a számlálót és nevezőt közös osztóval egyszerűsítjük, ha lehetséges.",
        ),
      ],
      "Az összeadásnál a számlálók a közös részegység darabszámai. A nevezőt nem adjuk hozzá önmagához.",
      {
        mistakes: [
          {
            input: frac(a + c, b + d),
            feedback:
              "Ellenőrizd, hogy ugyanakkora részeket adtál-e össze. A nevezők összeadása nem hoz közös részegységet.",
          },
          {
            input: frac(a + c, common),
            feedback:
              "A közös nevezőre váltáskor a számlálók is változnak. Írd át külön mindkét törtet, és csak utána add össze őket.",
          },
        ],
      },
    );
  }
  const expected = frac(a * d, b * c);
  return draft(
    `Egy szalag ${a}/${b} méter hosszú, a választott mérőegység ${c}/${d} méter. Hányszor akkora a szalag a mérőegységnél? A méretek hányadosát add meg egyszerűsített törtként, nem a kivágható teljes darabok számát. Egész eredményt egész számmal írj.`,
    { kind: "number", expected, requireSimplified: true },
    [
      "Azt keressük, hány mérőegységnyi a hossz. Egy mérőegység törtrésze is beleszámít az arányba.",
      `Mérj mindent ${common}-ed méterben: a két hossz ekkor ${left}, illetve ${right} azonos kis részből áll.`,
    ],
    [
      step(
        `${a}/${b} m = ${left}/${common} m; ${c}/${d} m = ${right}/${common} m`,
        "Közös mértékkel a két hossz összehasonlítható.",
      ),
      step(
        `${left} : ${right} = ${expected}`,
        "Azonos méretű részek darabszámainak hányadosát vesszük. A méter/méter arány egység nélküli.",
      ),
      step(
        `(${a}/${b}) : (${c}/${d}) = (${a}/${b}) · (${d}/${c}) = ${expected}`,
        "A reciprokos szorzás ugyanazt a hosszarányt adja; az osztó nem nulla.",
      ),
    ],
    "A méretek hányadosa lehet tört. Egész darabok kivágásakor külön kellene megadni a teljes darabszámot és a maradékot.",
    {
      kind: "transfer",
      mistakes: [
        {
          input: frac(a * c, b * d),
          feedback:
            "Most két hossz arányát keressük. Nem a szalag adott törtrészét vesszük, hanem a mérőegységhez hasonlítjuk.",
        },
        {
          input: String(Math.floor((a * d) / (b * c))),
          feedback:
            "A teljes mérőegységeken túl egy mérőegység törtrésze is beleszámít. Itt a pontos arányt kérjük, nem csak az egész darabokat.",
        },
      ],
    },
  );
}

function percentages(family: number, random: Random): Draft {
  const base = random.int(10, 90) * 100;
  const percent = random.pick([5, 10, 15, 20, 25, 30, 40]);
  if (family === 0) {
    const part = (base * percent) / 100;
    return draft(
      `Egy könyv eredeti ára ${base} Ft. A bolt ${percent}%-os kedvezményt ad. Hány forint maga a kedvezmény?`,
      { kind: "number", expected: String(part), unit: "Ft" },
      [
        "A 100% az eredeti ár. Most a kedvezmény összegét, nem a fizetendő árat keressük.",
        `Először keresd meg az ár 1%-át: oszd az eredeti árat 100-zal. Ebből kell ${percent} rész.`,
      ],
      [
        step(
          `${base} : 100 = ${base / 100} Ft`,
          "Az egész egy századrésze az 1%.",
        ),
        step(
          `${base / 100} · ${percent} = ${part} Ft`,
          "A keresett százalék ennyi századrészből áll.",
        ),
        step(
          `${base} − ${part} = ${base - part} Ft`,
          "Ez már a fizetendő ár. A kérdés a levont összegre vonatkozott.",
        ),
      ],
      "Mindig különítsd el az eredeti árat, a kedvezmény összegét és a fizetendő árat.",
      {
        difficulty: 1,
        mistakes: [
          {
            input: String(base - part),
            feedback:
              "Ez a kedvezmény utáni ár lehet. A kérdés most azt kéri, hány forintot vonunk le az eredeti árból.",
          },
        ],
      },
    );
  }
  if (family === 1) {
    const remaining = (base * (100 - percent)) / 100;
    return draft(
      `A ${percent}%-os árengedmény után egy társasjáték ára ${remaining} Ft. Mennyi volt az eredeti ár?`,
      { kind: "number", expected: String(base), unit: "Ft" },
      [
        `A kedvezmény után az eredeti ár ${100 - percent}%-át fizetjük. Ez felel meg a megadott összegnek.`,
        "Először az eredeti ár 1%-át keresd vissza, majd ebből számíts 100%-ot.",
      ],
      [
        step(
          `${100 - percent}% = ${remaining} Ft`,
          "A megadott ár a kedvezmény után megmaradt rész.",
        ),
        step(
          `1% = ${remaining} : ${100 - percent} = ${base / 100} Ft`,
          "Ugyanannak az eredeti egésznek a századrészét keressük.",
        ),
        step(
          `100% = ${base / 100} · 100 = ${base} Ft`,
          "Száz ilyen rész adja az eredeti árat.",
        ),
      ],
      "A csökkentett árhoz az eredeti kedvezmény százalékát hozzáadni más százalékalapot használna.",
      {
        kind: "transfer",
        mistakes: [
          {
            input: frac(remaining * (100 + percent), 100),
            feedback:
              "A visszaút alapja nem a kedvezményes ár. A megadott összeg az eredeti ár egy megmaradt százaléka; ebből keresd vissza a teljes 100%-ot.",
          },
        ],
      },
    );
  }
  const original = random.int(5, 40) * 400;
  const change = random.pick([10, 20, 25, 30, 40]);
  const afterDiscount = (original * (100 - change)) / 100;
  const final = (original * (100 - change) * (100 + change)) / 10000;
  return draft(
    `Kezdeti ár: ${original} Ft. Először ${change}%-kal csökkentik, majd az új árat ${change}%-kal emelik. Mennyi lesz a végső ár?`,
    { kind: "number", expected: String(final), unit: "Ft" },
    [
      "A két változás nem ugyanarra az alapra vonatkozik. Először külön számítsd ki a csökkentett árat.",
      "A második százalékot már az új, kisebb árból kell meghatározni.",
    ],
    [
      step(
        `${original} · ${100 - change}/100 = ${afterDiscount} Ft`,
        "A csökkentés után az eredeti ár megmaradó százalékát fizetjük.",
      ),
      step(
        `${afterDiscount} · ${change}/100 = ${final - afterDiscount} Ft`,
        "Ez az emelés összege; az alap a csökkentett ár.",
      ),
      step(
        `${afterDiscount} + ${final - afterDiscount} = ${final} Ft`,
        "Az új alaphoz a belőle számított emelést adjuk hozzá.",
      ),
    ],
    "Azonos százalékú csökkenés és emelkedés eltérő alap mellett nem oltja ki egymást.",
    {
      kind: "transfer",
      difficulty: 3,
      mistakes: [
        {
          input: String(original),
          feedback:
            "A második változás százalékalapja már kisebb. Írd ki külön a két alapot és a hozzájuk tartozó forintösszeget.",
        },
        {
          input: String(afterDiscount),
          feedback:
            "Ellenőrizd, hogy a második, emelést jelentő lépést is elvégezted-e az új áron.",
        },
      ],
    },
  );
}

function equations(family: number, random: Random): Draft {
  const a = random.int(2, 9);
  const b = random.int(1, 12);
  const x =
    family === 2
      ? random.pick([-8, -6, -4, -3, -1, 1, 2, 4, 5, 7])
      : random.int(-5, 12);
  if (family === 0) {
    const c = a * x + b;
    return draft(
      `Oldd meg az egyenletet: ${a}x + ${b} = ${display(c)}. Az x értékét add meg.`,
      { kind: "number", expected: String(x), variable: "x" },
      [
        `Először mindkét oldalból vonj ki ${b}-t. Így csak az x-es tag marad bal oldalon.`,
        `Az x együtthatója ${a}. Mindkét oldalt ezzel a nem nulla számmal oszd el.`,
      ],
      [
        step(
          `${a}x = ${display(c)} − ${b} = ${display(a * x)}`,
          "Ugyanazt a számot vonjuk ki mindkét oldalból.",
        ),
        step(
          `x = ${display(a * x)} : ${a} = ${display(x)}`,
          "A nem nulla együtthatóval osztás visszafordítható lépés.",
        ),
        step(
          `${a} · (${display(x)}) + ${b} = ${display(c)}`,
          "Visszahelyettesítünk az eredeti egyenletbe: a két oldal egyezik.",
        ),
      ],
      "A megoldás olyan szám, amely az eredeti egyenletet igazzá teszi. A visszahelyettesítés külön ellenőrzés.",
      {
        difficulty: 1,
        mistakes: [
          {
            input: String(c - b),
            feedback:
              "Az x-es tag értékét már megkaphattad. Nézd meg, hányszor x áll a bal oldalon; még egy osztás szükséges lehet.",
          },
          {
            input: frac(c + b, a),
            feedback:
              "A bal oldali hozzáadott szám megszüntetéséhez mindkét oldalból ugyanazt a számot kell kivonni.",
          },
        ],
      },
    );
  }
  if (family === 1) {
    const solutionX = random.int(1, 12);
    const c = a * (solutionX + b);
    return draft(
      `Oldd meg: ${a}(x + ${b}) = ${c}. Egy csomagban x egység és még ${b} egység van; ${a} ilyen csomag azonos összértékét látod.`,
      { kind: "number", expected: String(solutionX), variable: "x" },
      [
        `A ${a} az egész zárójelet szorozza. Itt rövid út lehet először mindkét oldalt ${a}-val osztani.`,
        `Egy csomag értéke ${c / a}. Ebből vond ki a már ismert ${b} egységet.`,
      ],
      [
        step(
          `x + ${b} = ${c} : ${a} = ${c / a}`,
          "Azonos számú azonos csomagot bontunk egy csomag értékére.",
        ),
        step(
          `x = ${c / a} − ${b} = ${solutionX}`,
          "Mindkét oldalból a hozzáadott ismert mennyiséget vonjuk ki.",
        ),
        step(
          `${a}(${solutionX} + ${b}) = ${c}`,
          "Az eredeti zárójeles alakba visszahelyettesítve is igaz az állítás.",
        ),
      ],
      "Zárójelbontással is megoldható: a kívül álló tényező a zárójel mindkét tagját szorozza.",
      {
        mistakes: [
          {
            input: String(c / a + b),
            feedback:
              "Egy csomag összértékében az ismert rész már benne van. Az ismeretlenhez ezt ki kell vonni, nem újra hozzáadni.",
          },
          {
            input: frac(c - b, a),
            feedback:
              "Ha felbontod a zárójelet, a kívül álló szám a zárójel mindkét tagját szorozza. Az ismert tagot is ennyiszer kell venni.",
          },
        ],
      },
    );
  }
  const c = -a * x + b;
  return draft(
    `Oldd meg az egyenletet: −${a}x + ${b} = ${display(c)}. Figyeld meg a negatív együtthatót.`,
    { kind: "number", expected: String(x), variable: "x" },
    [
      `Mindkét oldalból vonj ki ${b}-t. Az x együtthatója továbbra is −${a}.`,
      `Ezután mindkét oldalt −${a}-val oszd. Az előjelet az osztásnál is tartsd meg.`,
    ],
    [
      step(
        `−${a}x = ${display(c)} − ${b} = ${display(-a * x)}`,
        "A hozzáadott tagot ugyanazzal a kivonással szüntetjük meg mindkét oldalon.",
      ),
      step(
        `x = (${display(-a * x)}) : (−${a}) = ${display(x)}`,
        "Mindkét oldalt ugyanazzal a nem nulla számmal osztjuk; az egyenlőség megmarad.",
      ),
      step(
        `(−${a}) · (${display(x)}) + ${b} = ${display(c)}`,
        "A visszahelyettesítés az előjelhibát is észrevehetővé teszi.",
      ),
    ],
    "Negatív együtthatóval is ugyanaz az egyenlőségi elv működik. A szám és a művelet előjelét külön figyeld.",
    {
      mistakes: [
        {
          input: String(-x),
          feedback:
            "Ellenőrizd az osztó előjelét: az x együtthatója negatív. Próbáld visszahelyettesíteni a válaszodat az eredeti egyenletbe.",
        },
      ],
    },
  );
}

function graphs(family: number, random: Random): Draft {
  const a = random.int(1, 6);
  const b = random.int(-8, 12);
  if (family === 0) {
    const x = random.int(-5, 8);
    const y = a * x + b;
    return draft(
      `Egy összefüggés szabálya y = ${a}x ${signedTerm(b)}. Mennyi y, ha x = ${display(x)}?`,
      { kind: "number", expected: String(y), variable: "y" },
      [
        "Az x helyére a megadott szám kerül. A szorzást végezd el először.",
        "A szorzat után az állandó tagot is figyelembe kell venni, az előjelével együtt.",
      ],
      [
        step(
          `${a} · (${display(x)}) = ${display(a * x)}`,
          "A szabály x-es részében helyettesítünk.",
        ),
        step(
          `y = ${display(a * x)} ${signedTerm(b)} = ${display(y)}`,
          "Hozzávesszük a kezdőértéket is.",
        ),
        step(
          `A pont: (${display(x)}; ${display(y)})`,
          "Az első koordináta a bemenet, a második a hozzá tartozó érték.",
        ),
      ],
      "A szabály, a táblázatsor és a grafikon pontja ugyanazt az összetartozást fejezi ki.",
      {
        difficulty: 1,
        mistakes: [
          {
            input: String(a * x),
            feedback:
              "A szorzat után a szabály állandó tagját is figyelembe kell venni. Nézd meg a plusz- vagy mínuszjelet.",
          },
          {
            input: String(a * (x + b)),
            feedback:
              "A szorzó csak az x-re vonatkozik; a szabályban az állandó tag nincs közös zárójelben az x-szel.",
          },
        ],
      },
    );
  }
  if (family === 1) {
    const x1 = random.int(1, 4);
    const x2 = x1 + random.int(1, 4);
    const y1 = a * x1 + b;
    const y2 = a * x2 + b;
    return draft(
      `Egy egyenes grafikonja a (${x1}; ${display(y1)}) és (${x2}; ${display(y2)}) ponton halad át. Azonos x-növekedéshez mindig azonos y-változás tartozik. Mennyi az y értéke x = 0-nál?`,
      { kind: "number", expected: String(b), variable: "y" },
      [
        "A két pont között mennyivel változott x, és mennyivel változott y? Ebből keresd az egységnyi x-változáshoz tartozó y-változást.",
        `Az első pont x-koordinátája ${x1}. Innen ${x1} egységgel kell visszalépni az x = 0 helyig.`,
      ],
      [
        step(
          `Δx = ${x2} − ${x1} = ${x2 - x1}; Δy = ${display(y2)} − (${display(y1)}) = ${y2 - y1}`,
          "Először a két megadott pont közti változást hasonlítjuk össze.",
        ),
        step(
          `${y2 - y1} : ${x2 - x1} = ${a}`,
          "Egy egységnyi x-növekedéshez ennyi y-növekedés tartozik.",
        ),
        step(
          `y(0) = ${display(y1)} − ${x1} · ${a} = ${display(b)}`,
          "A kezdőértékhez az első pontból a megfelelő számú egységet visszalépjük.",
        ),
      ],
      "Az első felsorolt pont nem feltétlenül a kezdőpont. A kezdőérték az x = 0-hoz tartozó y.",
      {
        kind: "reason",
        mistakes: [
          {
            input: String(y1),
            feedback:
              "Az első megadott pontban x még nem nulla. A kezdőértékhez innen vissza kell lépned az x = 0 helyig.",
          },
          {
            input: String(a),
            feedback:
              "Az egységnyi változás és a kezdőérték két külön adat. A megadott pontból lépj vissza az x = 0 helyre.",
          },
        ],
      },
    );
  }
  const initialFee = random.int(4, 15) * 100;
  const rate = random.int(2, 8) * 50;
  const distance = random.int(1, 12);
  const total = initialFee + rate * distance;
  return draft(
    `Egy kitalált futárszolgáltatás alapdíja ${initialFee} Ft, ezen felül kilométerenként ${rate} Ft-ot kér. A teljes díj ${total} Ft. Hány kilométer volt az út?`,
    { kind: "number", expected: String(distance), unit: "km" },
    [
      "A teljes díjból először válaszd le az úthossztól független alapdíjat.",
      "A fennmaradó összeg csak a kilométerek díja. Oszd el az egy kilométerre jutó árral.",
    ],
    [
      step(
        `${total} − ${initialFee} = ${total - initialFee} Ft`,
        "Ez az összeg függ a megtett úttól.",
      ),
      step(
        `${total - initialFee} : ${rate} = ${distance} km`,
        "Megkeressük, hány kilométer díja fér ebbe az összegbe.",
      ),
      step(
        `${initialFee} + ${rate} · ${distance} = ${total} Ft`,
        "A kapott úttal az eredeti teljes díjat kapjuk vissza.",
      ),
    ],
    "Alapdíjas modellnél a teljes árat nem oszthatjuk rögtön a kilométerdíjjal. A grafikonról most visszafelé olvasunk.",
    {
      kind: "transfer",
      difficulty: 3,
      context:
        "A díjszabás csak szemléltető modell, nem aktuális piaci ajánlat.",
      mistakes: [
        {
          input: frac(total, rate),
          feedback:
            "A teljes ár az alapdíjat is tartalmazza. Előbb vond le a távolságtól független részt, és csak a maradékot oszd a kilométerdíjjal.",
        },
      ],
    },
  );
}

const triples = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
] as const;

function pythagoras(family: number, random: Random): Draft {
  const base = random.pick(triples);
  const scale = random.int(1, 4);
  const swap = random.int(0, 1) === 1;
  const a = base[swap ? 1 : 0] * scale;
  const b = base[swap ? 0 : 1] * scale;
  const c = base[2] * scale;
  if (family === 0) {
    return draft(
      `Egy derékszögű háromszög befogói ${a} cm és ${b} cm hosszúak. Mekkora az átfogó?`,
      { kind: "number", expected: String(c), unit: "cm" },
      [
        "Az átfogó a derékszöggel szemközti oldal. A befogókra emelt négyzetek területét kell összeadni.",
        "A négyzetterületek összegéből még vissza kell keresni az oldalhosszt: a pozitív négyzetgyököt.",
      ],
      [
        step(
          `c² = ${a}² + ${b}² = ${a * a} + ${b * b}`,
          "A derékszög miatt alkalmazható a Pitagorasz-tétel.",
        ),
        step(
          `c² = ${c * c} cm²`,
          "Ez az átfogóra emelt négyzet területe, még nem az oldalhossz.",
        ),
        step(
          `c = √${c * c} = ${c} cm`,
          "Hosszúságot keresünk, ezért a pozitív négyzetgyököt választjuk.",
        ),
      ],
      "A tétel négyzetterületeket kapcsol össze. Az átfogó hosszához az összeg négyzetgyöke szükséges.",
      {
        mistakes: [
          {
            input: String(a + b),
            feedback:
              "A tételben a befogók négyzeteit adjuk össze, nem közvetlenül a két hosszúságot.",
          },
          {
            input: String(c * c),
            feedback:
              "Ez az átfogóra emelt négyzet területe lehet. A kérdés az oldalhossz: még négyzetgyököt kell venni.",
          },
        ],
      },
    );
  }
  if (family === 1) {
    return draft(
      `Egy derékszögű háromszög átfogója ${c} cm, egyik befogója ${a} cm. Mekkora a másik befogó?`,
      { kind: "number", expected: String(b), unit: "cm" },
      [
        "Most nem az átfogót keressük. Az átfogó négyzete már a két befogónégyzet összegét jelenti.",
        "A keresett befogó négyzetéhez vond ki az ismert befogó négyzetét az átfogó négyzetéből.",
      ],
      [
        step(
          `b² = ${c}² − ${a}² = ${c * c} − ${a * a}`,
          "A teljes négyzetterületből az ismert részt kivonjuk.",
        ),
        step(
          `b = √${b * b} = ${b} cm`,
          "A keresett hossz a pozitív négyzetgyök.",
        ),
        step(
          `${a * a} + ${b * b} = ${c * c}`,
          "Az eredményt az eredeti négyzetösszegbe visszahelyettesítve ellenőrizzük.",
        ),
      ],
      "Először mindig az átfogót azonosítsd. Befogó keresésekor a négyzetek között kivonásra van szükség.",
      {
        mistakes: [
          {
            input: String(c - a),
            feedback:
              "A különbséget a négyzetterületekből képezzük. Előbb négyzetre kell emelni a két ismert oldalt.",
          },
          {
            input: String(b * b),
            feedback:
              "A keresett oldal négyzetét már megkaphattad. A hosszúsághoz még a pozitív négyzetgyök szükséges.",
          },
        ],
      },
    );
  }
  return draft(
    `Egy téglalap alakú udvar oldalai ${a} m és ${b} m. Milyen hosszú egyenes út köti össze a két átellenes sarkát? Az udvar sík, és nincs akadály az egyenes útban.`,
    { kind: "number", expected: String(c), unit: "m" },
    [
      "Rajzold be az átlót. Az udvar két merőleges oldala és az átló derékszögű háromszöget alkot.",
      "A két oldal a befogó; a keresett egyenes út az átfogó. A két oldal mentén tett kerülő más hosszúság.",
    ],
    [
      step(
        `d² = ${a}² + ${b}²`,
        "A téglalap szomszédos oldalai merőlegesek, ezért a háromszögben alkalmazható a tétel.",
      ),
      step(
        `d² = ${a * a} + ${b * b} = ${c * c}`,
        "A négyzetterületeket adjuk össze.",
      ),
      step(
        `d = ${c} m; a két oldal mentén ${a + b} m lenne`,
        "A két különböző útvonalat nem szabad összekeverni: a kérdés az egyenes átlóra vonatkozott.",
      ),
    ],
    "Szöveges helyzetben előbb a derékszögű háromszöget kell felismerni, és csak utána választani műveletet.",
    {
      kind: "transfer",
      difficulty: 3,
      mistakes: [
        {
          input: String(a + b),
          feedback:
            "Ez a két oldal mentén vezető kerülő hossza. A kérdés az átellenes sarkokat összekötő egyenesre, az átlóra vonatkozik.",
        },
      ],
    },
  );
}

function probability(family: number, random: Random): Draft {
  if (family === 0) {
    const sum = random.int(2, 12);
    const favorable = 6 - Math.abs(7 - sum);
    const pairs = Array.from({ length: 6 }, (_, i) => i + 1)
      .filter((first) => sum - first >= 1 && sum - first <= 6)
      .map((first) => `(${first}; ${sum - first})`)
      .join(", ");
    const expected = frac(favorable, 36);
    return draft(
      `Két egymástól független, szabályos hatoldalú kockát dobunk. Mennyi annak az esélye, hogy a dobott számok összege ${sum}? Egyszerűsített törtet adj meg.`,
      { kind: "number", expected, requireSimplified: true },
      [
        "A két kockát különböztessük meg: az első és a második dobás együtt rendezett párt ad. Összesen 6 · 6 pár lehetséges.",
        `Sorold fel azokat a párokat, amelyek összege ${sum}. Mindkét számnak 1 és 6 közé kell esnie.`,
      ],
      [
        step(
          "Összes elemi kimenet: 6 · 6 = 36",
          "A független, szabályos kockák rendezett párjai egyenlő esélyűek.",
        ),
        step(
          `Kedvező párok: ${pairs}; darabszámuk ${favorable}`,
          "Az összegeseményhez tartozó összes elemi párt külön számoljuk.",
        ),
        step(
          `P = ${favorable}/36 = ${expected}`,
          "Egyenlő esélyű elemi kimeneteknél a kedvező és összes eset aránya az esély.",
        ),
      ],
      "A lehetséges összegek nem egyenlő esélyűek. A nevezőben a rendezett dobáspárok száma szerepel.",
      {
        mistakes: [
          {
            input: "1/11",
            feedback:
              "Tizenegy különböző összeg van, de ezek nem egyenlő esélyűek. A 36 rendezett dobáspárt számold össze.",
          },
          {
            input: frac(favorable, 12),
            feedback:
              "Az összes dobáspár száma nem 6 + 6. Az első kocka mindegyik eredményéhez a másodikon hat lehetőség tartozik.",
          },
        ],
      },
    );
  }
  if (family === 1) {
    const total = random.pick([6, 8, 10, 12, 15, 18, 20]);
    const divisor = random.pick([2, 3, 4, 5]);
    const favorable = Math.floor(total / divisor);
    const values = Array.from(
      { length: favorable },
      (_, i) => (i + 1) * divisor,
    ).join(", ");
    const expected = frac(favorable, total);
    return draft(
      `Egy szabályos pörgettyűn ${total} egyforma méretű mező van, 1-től ${total}-ig számozva. Minden mező egyenlő esélyű. Mennyi annak az esélye, hogy a kipörgetett szám ${divisor} többszöröse? Egyszerűsített törtet adj meg.`,
      { kind: "number", expected, requireSimplified: true },
      [
        `Sorold fel ${divisor} pozitív többszöröseit, de állj meg ${total}-nál.`,
        "A számlálóba a megfelelő mezők darabszáma, a nevezőbe az összes egyenlő esélyű mező száma kerül.",
      ],
      [
        step(
          `Megfelelő számok: ${values}`,
          "Csak azokat az értékeket soroljuk fel, amelyek valóban szerepelnek a pörgettyűn.",
        ),
        step(
          `Kedvező mezők: ${favorable}; összes mező: ${total}`,
          "A kiválasztási feltételnek megfelelő elemeket számoljuk, nem magát az osztót.",
        ),
        step(
          `P = ${favorable}/${total} = ${expected}`,
          "A kapott arányt a végén egyszerűsítjük.",
        ),
      ],
      "Az esélyhez előbb pontosan le kell írni az eseményt, majd teljesen felsorolni vagy megszámolni a kedvező eseteket.",
      {
        kind: "reason",
        mistakes: [
          {
            input: frac(divisor, total),
            feedback:
              "A számlálóba a megfelelő mezők darabszáma kerül, nem az a szám, amelynek a többszöröseit keresed.",
          },
          {
            input: frac(1, divisor),
            feedback:
              "Ellenőrizd a ténylegesen felsorolt mezőket: a számozás nem feltétlenül teljes többszöröscsoportoknál ér véget.",
          },
        ],
      },
    );
  }
  const red = random.int(2, 7);
  const blue = random.int(1, 8);
  const green = random.int(1, 6);
  const notRed = random.int(0, 1) === 1;
  const total = red + blue + green;
  const favorable = notRed ? blue + green : red;
  const expected = frac(favorable, total);
  return draft(
    `Egy zsákban ${red} piros, ${blue} kék és ${green} zöld golyó van. Egy golyót húzunk; minden egyes golyó egyenlő esélyű. Mekkora az esélye, hogy ${notRed ? "nem piros" : "piros"} golyót húzunk? Egyszerűsített törtet adj meg.`,
    { kind: "number", expected, requireSimplified: true },
    [
      "A lehetséges elemi kimenetek a golyók, nem a színek. Először add össze az összes golyó számát.",
      notRed
        ? "A nem piros golyók itt a kékek és a zöldek együtt."
        : "A kedvező kimenetek a piros golyók. Egy színhez több különböző golyó tartozhat.",
    ],
    [
      step(
        `Összes golyó: ${red} + ${blue} + ${green} = ${total}`,
        "Mindegyik golyó egy lehetséges, azonos esélyű elemi kimenet.",
      ),
      step(
        `Kedvező golyók: ${notRed ? `${blue} + ${green} = ` : ""}${favorable}`,
        notRed
          ? "A nem piros eseménybe mind a kék, mind a zöld beleértendő."
          : "A piros eseményhez az összes piros golyó hozzátartozik.",
      ),
      step(
        `P = ${favorable}/${total} = ${expected}`,
        "A kedvező golyók számát az összes golyó számához viszonyítjuk.",
      ),
    ],
    "Három szín nem jelent automatikusan három egyenlő esélyt. A darabszámok és a pontosan megnevezett esemény számítanak.",
    {
      difficulty: notRed ? 2 : 1,
      mistakes: [
        {
          input: "1/3",
          feedback:
            "A színek helyett az egyenlő esélyű golyókat számold. Három szín önmagában nem jelent három egyenlő esélyt.",
        },
        {
          input: frac(notRed ? red : total - red, total),
          feedback:
            "Nézd meg újra, hogy piros vagy nem piros golyót kérdezünk. A két esemény egymás kiegészítője.",
        },
      ],
    },
  );
}

const builders: Partial<
  Record<TopicId, (family: number, random: Random) => Draft>
> = {
  tortek: fractions,
  szazalek: percentages,
  egyenlet: equations,
  grafikon: graphs,
  pitagorasz: pythagoras,
  valoszinuseg: probability,
};

export const generatorFamilies: readonly GeneratorFamily[] = Object.freeze([
  ...legacyGeneratorFamilies,
  ...foundationGeneratorFamilies,
  ...bridgeGeneratorFamilies,
]);
export const familiesFor = (topic: TopicId) =>
  generatorFamilies.filter((family) => family.topic === topic);

/**
 * Selects within each topic's actual family list; omitting variant uses the seed.
 * The full safe-integer seed and variant are included in the replay key.
 */
export function generateExercise(
  topic: TopicId,
  seed: number,
  variant?: number,
): Exercise {
  if (!Number.isSafeInteger(seed))
    throw new RangeError("A seed biztonságos egész szám legyen.");
  if (variant !== undefined && !Number.isSafeInteger(variant))
    throw new RangeError(
      "A változat azonosítója biztonságos egész szám legyen.",
    );
  if (foundationGeneratorFamilies.some((family) => family.topic === topic))
    return generateFoundationExercise(topic, seed, variant);
  if (bridgeGeneratorFamilies.some((family) => family.topic === topic))
    return generateBridgeExercise(topic, seed, variant);
  if (!Object.hasOwn(builders, topic))
    throw new RangeError("Ismeretlen témakör.");
  const selectedVariant = variant ?? seed;
  const available = familiesFor(topic);
  const familyIndex =
    ((selectedVariant % available.length) + available.length) %
    available.length;
  const family = available[familyIndex];
  const key = `${family.id}:seed=${seed}:variant=${selectedVariant}`;
  const result = builders[topic]!(
    familyIndex,
    seededRandom(`matek8-generator-v1:${key}`),
  );
  return { ...result, id: `generated:${key}`, topic };
}

import type {
  AnswerPart,
  Exercise,
  ScalarAnswerSpec,
  TopicId,
} from "../types.ts";
import type { GeneratorFamily } from "./generators.ts";
import {
  formatRational,
  normalizeExpression,
  parseRational,
  rational,
} from "./engine.ts";

export const bridgeGeneratorFamilies: readonly GeneratorFamily[] =
  Object.freeze([
    {
      id: "algebra-substitute-v1",
      topic: "betus-kifejezesek",
      title: "Előjeles és törtes helyettesítés",
    },
    {
      id: "algebra-collect-v1",
      topic: "betus-kifejezesek",
      title: "Kétféle egynemű tag és ellenőrzés",
    },
    {
      id: "algebra-packets-v1",
      topic: "betus-kifejezesek",
      title: "Csomagok, kiadás és előjeles zárójel",
    },
    {
      id: "model-fixed-fee-v1",
      topic: "szoveges-modellek",
      title: "Egységár és egyszeri díj modellje",
    },
    {
      id: "model-sum-difference-v1",
      topic: "szoveges-modellek",
      title: "Két hossz összege és különbsége",
    },
    {
      id: "model-whole-packs-v1",
      topic: "szoveges-modellek",
      title: "Egész csomag és megmaradó darabok",
    },
    {
      id: "power-expand-v1",
      topic: "hatvanyok",
      title: "A hatványból ismételt szorzás",
    },
    {
      id: "power-sign-v1",
      topic: "hatvanyok",
      title: "Negatív alap vagy külső mínusz",
    },
    {
      id: "power-ten-scale-v1",
      topic: "hatvanyok",
      title: "Adatméret és két szomszédos tízhatvány",
    },
    {
      id: "root-square-absolute-v1",
      topic: "negyzetgyok",
      title: "Abszolút érték és egyenletmegoldások",
    },
    {
      id: "root-bracket-v1",
      topic: "negyzetgyok",
      title: "Egész határok és tizedes kerekítés",
    },
    {
      id: "root-area-precision-v1",
      topic: "negyzetgyok",
      title: "Pontos terület, közelített oldal",
    },
  ]);
const S = {
  substitute: "betu-helyettesites",
  collect: "egynemu-tagok",
  brackets: "zarojel-felbontas",
  data: "adatok-es-feltetelek",
  model: "modellvalasztas",
  check: "modell-ellenorzes",
  power: "hatvany-jelentes",
  sign: "hatvany-elojel",
  scale: "nagysagrend",
  root: "negyzetgyok-jelentes",
  estimate: "gyok-becsles",
  precision: "pontos-kozelito",
} as const;
type Skill = (typeof S)[keyof typeof S];
interface Random {
  int(min: number, max: number): number;
}
function randomFrom(key: string): Random {
  let state = 2166136261;
  for (let i = 0; i < key.length; i++)
    state = Math.imul(state ^ key.charCodeAt(i), 16777619) >>> 0;
  return {
    int(min, max) {
      state = (state + 0x6d2b79f5) >>> 0;
      let value = Math.imul(state ^ (state >>> 15), state | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return (
        min +
        Math.floor(
          (((value ^ (value >>> 14)) >>> 0) / 4294967296) * (max - min + 1),
        )
      );
    },
  };
}
const exact = (n: number, d = 1): string => {
  if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d === 0)
    throw new RangeError("Egész, pontos generátorparaméter szükséges.");
  return formatRational(rational(BigInt(n), BigInt(d)));
};
// Display denominators are powers of two and/or five, with short finite decimals.
const hu = (n: number, d = 1): string =>
  String(n / d)
    .replace("-", "−")
    .replace(".", ",");
const decimal = (n: number, places: number): string => {
  const digits = String(Math.abs(n)).padStart(places + 1, "0");
  return (
    (n < 0 ? "−" : "") +
    (places ? digits.slice(0, -places) + "," + digits.slice(-places) : digits)
  );
};
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
const expr = (...accepted: string[]): ScalarAnswerSpec => ({
  kind: "expression",
  accepted,
});
const yesNo = (yes: boolean): ScalarAnswerSpec => ({
  kind: "choice",
  correct: yes ? "yes" : "no",
  options: [
    { id: "yes", text: "Igen" },
    { id: "no", text: "Nem" },
  ],
});
function field(
  id: string,
  label: string,
  answer: ScalarAnswerSpec,
  skillIds: Skill[],
  candidates: [string, string][] = [],
): AnswerPart {
  const seen = new Set<string>();
  const mistakes = candidates.flatMap(([input, feedback]) => {
    if (seen.has(input)) return [];
    seen.add(input);
    if (answer.kind === "number") {
      const given = parseRational(input),
        wanted = parseRational(answer.expected);
      if (given && wanted && given.n * wanted.d === wanted.n * given.d)
        return [];
    } else if (answer.kind === "choice" && input === answer.correct) return [];
    else if (
      answer.kind === "expression" &&
      answer.accepted
        .map(normalizeExpression)
        .includes(normalizeExpression(input))
    )
      return [];
    return [{ input, feedback }];
  });
  return {
    id,
    label,
    answer,
    skillIds,
    ...(mistakes.length ? { mistakes } : {}),
  };
}
const needs = (part: AnswerPart, ...requiresParts: string[]): AnswerPart => ({
  ...part,
  requiresParts,
});
type Draft = Omit<Exercise, "id" | "topic">;
function draft(
  prompt: string,
  parts: AnswerPart[],
  hints: [string, string],
  solution: [string, string][],
  takeaway: string,
  reflectionPrompt: string,
  checkpoints: string[],
  kind: Exercise["kind"] = "compute",
  difficulty: Exercise["difficulty"] = 2,
): Draft {
  return {
    prompt,
    answer: { kind: "parts", parts },
    skillIds: [...new Set(parts.flatMap((part) => part.skillIds ?? []))],
    hints,
    solution: solution.map(([expression, why]) => ({ expression, why })),
    takeaway,
    reflection: { prompt: reflectionPrompt, checkpoints },
    kind,
    difficulty,
  };
}
function fixedFeeForms(count: number, fee: number, total: number): string[] {
  return [
    count + "x+" + fee + "=" + total,
    count + "*x+" + fee + "=" + total,
    fee + "+" + count + "x=" + total,
    fee + "+" + count + "*x=" + total,
    "x*" + count + "+" + fee + "=" + total,
  ];
}
function sumForms(extra: number, total: number): string[] {
  return [
    "x+(x+" + extra + ")=" + total,
    "(x+" + extra + ")+x=" + total,
    "x+x+" + extra + "=" + total,
    "2x+" + extra + "=" + total,
    "2*x+" + extra + "=" + total,
    extra + "+2x=" + total,
    extra + "+2*x=" + total,
  ];
}

/** Exact floor and rounding: comparisons of integer squares, never floating sqrt. */
function squareRootFloor(value: bigint): bigint {
  let low = 0n,
    high = value + 1n;
  while (high - low > 1n) {
    const middle = (low + high) / 2n;
    if (middle * middle <= value) low = middle;
    else high = middle;
  }
  return low;
}
function rootDigits(area: number, places: number) {
  const scale = 10n ** BigInt(places),
    scaledArea = BigInt(area) * scale * scale;
  const floor = squareRootFloor(scaledArea);
  const doubledMidpoint = 2n * floor + 1n;
  const rounded =
    4n * scaledArea >= doubledMidpoint * doubledMidpoint ? floor + 1n : floor;
  return {
    floor: Number(floor),
    rounded: Number(rounded),
    scale: Number(scale),
  };
}

function algebra(index: number, random: Random): Draft {
  if (index === 0) {
    const k = random.int(2, 9) * (random.int(0, 1) ? -1 : 1),
      b = random.int(-10, 10),
      x = random.int(-12, 12);
    const term = k * x,
      total = term + 2 * b;
    return draft(
      "Számítsd ki (" +
        hu(k) +
        ")x + (" +
        hu(b) +
        "), ha x = " +
        hu(x, 2) +
        ". Add meg külön az x-es tagot és a teljes értéket.",
      [
        field(
          "term",
          "Az x-es tag értéke",
          num(exact(term, 2)),
          [S.substitute],
          [
            [
              exact(2 * k + x, 2),
              "Az együttható szorozza az x-et; itt nem az együttható és x összegét keressük.",
            ],
          ],
        ),
        field(
          "value",
          "Teljes helyettesítési érték",
          num(exact(total, 2)),
          [S.substitute],
          [
            [
              exact(term - 2 * b, 2),
              "Az állandó tagot a megadott előjelével adjuk az x-es taghoz.",
            ],
          ],
        ),
      ],
      [
        "A betű teljes, előjeles értékét helyettesítsd be.",
        "Előbb (" +
          hu(k) +
          ") × (" +
          hu(x, 2) +
          "), majd a (" +
          hu(b) +
          ") állandó hozzáadása következik.",
      ],
      [
        [
          hu(k) + " × (" + hu(x, 2) + ") = " + hu(term, 2),
          "Az együttható és a behelyettesített szám szorzata.",
        ],
        [
          hu(term, 2) + " + (" + hu(b) + ") = " + hu(total, 2),
          "Az állandó tag előjele is megmarad.",
        ],
      ],
      "A helyettesítés megőrzi az eredeti műveleteket és az előjeleket.",
      "Miért hasznos zárójelezni a behelyettesített számot?",
      [
        "Látszik, hogy a teljes szám kerül a betű helyére.",
        "Negatív értéknél így az előjel sem keveredik a kivonás jelével.",
      ],
    );
  }
  if (index === 1) {
    const p = random.int(2, 9),
      q = random.int(-6, 6),
      r = random.int(1, 9),
      s = random.int(-6, 6);
    const x = random.int(-6, 6),
      y = random.int(-10, 10),
      cx = p - r,
      cy = q + s,
      value = 2 * cx * x + cy * y;
    return draft(
      "Vond össze: " +
        p +
        "x + (" +
        hu(q) +
        ")y − " +
        r +
        "x + (" +
        hu(s) +
        ")y. Utána x = " +
        hu(x) +
        ", y = " +
        hu(y, 2) +
        " mellett ellenőrizd az értéket.",
      [
        field(
          "xCoefficient",
          "Az x együtthatója összevonás után",
          num(exact(cx)),
          [S.collect],
          [
            [
              exact(p + r),
              "A kivont x-es tag előjelét meg kell őrizni: az együttható különbség.",
            ],
          ],
        ),
        field(
          "yCoefficient",
          "Az y együtthatója összevonás után",
          num(exact(cy)),
          [S.collect],
          [
            [
              exact(q - s),
              "Mindkét y-os tagot a saját előjelével adjuk össze; a második előtt is összeadásjel van.",
            ],
          ],
        ),
        field("value", "Teljes helyettesítési érték", num(exact(value, 2)), [
          S.collect,
          S.substitute,
        ]),
      ],
      [
        "Két külön csoport van: x-es és y-os tagok.",
        "Az új együtthatók (" +
          p +
          " − " +
          r +
          ") és (" +
          hu(q) +
          " + (" +
          hu(s) +
          ")).",
      ],
      [
        [
          p + "x − " + r + "x = (" + hu(cx) + ")x",
          "Az x-es tagok együtthatói különbséget alkotnak.",
        ],
        [
          "(" + hu(q) + ")y + (" + hu(s) + ")y = (" + hu(cy) + ")y",
          "Az y-os tagokat csak egymással vonjuk össze.",
        ],
        [
          "(" +
            hu(cx) +
            ") × (" +
            hu(x) +
            ") + (" +
            hu(cy) +
            ") × (" +
            hu(y, 2) +
            ") = " +
            hu(value, 2),
          "Mindkét változó a saját megadott értékét kapja.",
        ],
      ],
      "A nulla együttható is megengedett: az adott fajta tagok kiolthatják egymást.",
      "Miért nem lehet az x-es és y-os együtthatókat egyetlen számként összeadni?",
      [
        "A betűs részek különböznek.",
        "Az összevont alaknak különböző x és y értékeknél is őriznie kell az eredeti értéket.",
      ],
      "reason",
    );
  }
  const groups = random.int(2, 7),
    plus = random.int(1, 6),
    minus = random.int(1, 3),
    x = minus + random.int(1, 6);
  const coefficient = groups - 1,
    constant = groups * plus + minus,
    result = coefficient * x + constant;
  return draft(
    groups +
      " egyforma csomag mindegyike (x + " +
      plus +
      ") jelzőkorongot tartalmaz. Összesen (x − " +
      minus +
      ") korongot kiadunk. Most x = " +
      x +
      ". A maradó darabszám összevont alakjában add meg x együtthatóját, az állandó tagot és a tényleges darabszámot.",
    [
      field(
        "coefficient",
        "Az x együtthatója",
        num(exact(coefficient)),
        [S.brackets, S.collect],
        [
          [
            exact(groups + 1),
            "A kiadott x-es mennyiséget kivonjuk, ezért egy x-szel kevesebb marad.",
          ],
        ],
      ),
      field(
        "constant",
        "Állandó tag",
        num(exact(constant)),
        [S.brackets, S.collect],
        [
          [
            exact(groups * plus - minus),
            "A kivonandó zárójelben −" +
              minus +
              " szerepel; ennek kivonása +" +
              minus +
              ".",
          ],
        ],
      ),
      field("remaining", "Megmaradt korongok (db)", num(exact(result), "db"), [
        S.substitute,
      ]),
    ],
    [
      "Először a csomagok teljes tartalmából vond ki a kiadott mennyiséget.",
      "A modell: " + groups + "(x + " + plus + ") − (x − " + minus + ").",
    ],
    [
      [
        groups + "x + " + groups * plus + " − x + " + minus,
        "A kivonás a teljes második zárójelre vonatkozik.",
      ],
      [
        "Összevont alak: " + coefficient + "x + " + constant,
        "Az x-es és állandó tagokat külön gyűjtjük.",
      ],
      [
        groups +
          " × " +
          (x + plus) +
          " − " +
          (x - minus) +
          " = " +
          result +
          " db",
        "Az eredeti csomagolási történetben is ellenőrzünk.",
      ],
    ],
    "A mennyiségek csomagolása és kiadása pontosan megjelenik a zárójelekben.",
    "Miért kell a második zárójel mindkét tagját kivonni?",
    [
      "A teljes kiadott mennyiséget vonjuk le.",
      "A mínuszjel elhagyása az egyik tagnál más darabszámot jelentene.",
    ],
    "transfer",
    3,
  );
}

function models(index: number, random: Random): Draft {
  if (index === 0) {
    const count = random.int(2, 9),
      fee = random.int(1, 9) * 100,
      price = random.int(4, 30) * 50,
      total = count * price + fee;
    return draft(
      count +
        " egyforma jegy és egyszeri " +
        fee +
        " Ft foglalási díj összesen " +
        total +
        " Ft. x egy jegy ára Ft-ban. Írd fel a teljes költség eredeti egyenletét, add meg az egységárat és a visszaellenőrzött teljes összeget.",
      [
        field(
          "equation",
          "Teljes költség balra, a közölt összeg jobbra",
          expr(...fixedFeeForms(count, fee, total)),
          [S.data, S.model],
          [
            [
              count + "*(x+" + fee + ")=" + total,
              "A foglalási díj egyszeri; nem minden jegy után külön fizetjük.",
            ],
          ],
        ),
        field(
          "price",
          "Egy jegy ára (Ft)",
          num(exact(price), "Ft", "x"),
          [S.model],
          [
            [
              exact(total, count),
              "Előbb az egyszeri díjat kell levonni a teljes összegből, utána osztani a jegyszámmal.",
            ],
          ],
        ),
        needs(
          field(
            "check",
            "Visszaellenőrzött teljes összeg (Ft)",
            num(exact(total), "Ft"),
            [S.check],
          ),
          "equation",
          "price",
        ),
      ],
      [
        "A jegyárak és az egyszeri díj külön tagok.",
        "A jegyekre " +
          total +
          " − " +
          fee +
          " = " +
          count * price +
          " Ft jut.",
      ],
      [
        [
          count + "x + " + fee + " = " + total,
          "A szövegben szereplő költségeket összeadjuk.",
        ],
        [
          "x = " + count * price + " : " + count + " = " + price + " Ft",
          "Az egyforma jegyekre jutó összeget egyenlően osztjuk szét.",
        ],
        [
          count + " × " + price + " + " + fee + " = " + total + " Ft",
          "Az eredeti teljes költség visszakapható.",
        ],
      ],
      "A megoldás előtt rögzítsd, melyik költség egyszeri.",
      "Melyik szórész határozza meg az állandó tag szerepét?",
      ["Az 'egyszeri' díj.", "A jegyszám csak az x Ft-os ár szorzója."],
      "transfer",
    );
  }
  if (index === 1) {
    const short = random.int(5, 40),
      difference = random.int(2, 20),
      long = short + difference,
      total = short + long;
    return draft(
      "Két szalag összesen " +
        total +
        " cm. A hosszabb " +
        difference +
        " cm-rel hosszabb a rövidebbnél. x a rövidebb hossza. Írd fel az összeg egyenletét, add meg a két hosszt és ellenőrizd a különbséget.",
      [
        field(
          "equation",
          "A két hossz összege balra, a teljes hossz jobbra",
          expr(...sumForms(difference, total)),
          [S.data, S.model],
          [
            [
              "x+" + difference + "=" + total,
              "Ez csak a hosszabb szalagot tenné egyenlővé a teljes összeggel.",
            ],
          ],
        ),
        field("short", "Rövidebb (cm)", num(exact(short), "cm", "x"), [
          S.model,
        ]),
        field("long", "Hosszabb (cm)", num(exact(long), "cm"), [S.model]),
        needs(
          field(
            "difference",
            "Hosszabb mínusz rövidebb (cm)",
            num(exact(difference), "cm"),
            [S.check],
          ),
          "equation",
          "short",
          "long",
        ),
      ],
      [
        "A hosszabb szakasz egy x hosszú részből és a többletből áll.",
        "A " + difference + " cm többlet elvétele után két egyenlő rész marad.",
      ],
      [
        [
          "x + (x + " + difference + ") = " + total,
          "Mindkét szalagot beleszámítjuk.",
        ],
        [
          "x = (" + total + " − " + difference + ") : 2 = " + short + " cm",
          "Két azonos alaprészre osztunk.",
        ],
        [
          "Hosszabb: " + short + " + " + difference + " = " + long + " cm",
          "Visszaadjuk a többletet.",
        ],
        [
          short +
            " + " +
            long +
            " = " +
            total +
            "; " +
            long +
            " − " +
            short +
            " = " +
            difference,
          "Az összeg és a különbség is teljesül.",
        ],
      ],
      "A történet minden feltételéhez tartozzon ellenőrzés.",
      "Mi maradna ellenőrizetlen, ha csak a két szám összegét néznénk?",
      [
        "A hosszabb és rövidebb közötti különbség.",
        "Sok más számpárnak is lehetne ugyanaz az összege.",
      ],
      "transfer",
    );
  }
  const size = random.int(4, 16),
    packs = random.int(2, 9),
    spare = random.int(1, size - 1),
    needed = size * packs - spare;
  return draft(
    "Egy foglalkozáshoz " +
      needed +
      " jelzőkorong kell. Csak bontatlan, egyenként " +
      size +
      " darabos csomagokat vehetünk. Mennyi a szükséges mennyiség és a csomagméret pontos hányadosa, hány csomag a legkevesebb, és hány korong marad meg?",
    [
      field(
        "quotient",
        "Szükséges darabszám : csomagméret",
        num(exact(needed, size)),
        [S.data, S.model],
      ),
      field(
        "packs",
        "Legkevesebb csomag (db)",
        num(exact(packs), "db"),
        [S.model],
        [
          [
            exact(packs - 1),
            "Ennyi bontatlan csomagban még nincs elég korong. Itt az elegendő darabszám a feltétel.",
          ],
        ],
      ),
      needs(
        field(
          "spare",
          "Megmaradt korongok (db)",
          num(exact(spare), "db"),
          [S.check],
          [
            [
              exact(size - spare),
              "Ez a kisebb csomagszámnál még hiányzó mennyiség. A megmaradást a ténylegesen vett csomagokból számold.",
            ],
          ],
        ),
        "packs",
      ),
    ],
    [
      "Előbb oszd el a szükséges darabszámot a csomagmérettel.",
      "A " +
        (packs - 1) +
        " csomag " +
        size * (packs - 1) +
        ", a " +
        packs +
        " csomag " +
        size * packs +
        " korongot tartalmaz.",
    ],
    [
      [
        needed + " : " + size + " = " + exact(needed, size),
        "A pontos hányados még nem feltétlenül egész csomagszám.",
      ],
      [
        "Legkevesebb " + packs + " csomag",
        "Az előző egész csomagszám kevés, ez már elegendő.",
      ],
      [
        packs + " × " + size + " − " + needed + " = " + spare + " db",
        "A vásárolt és felhasznált mennyiség különbsége a maradék.",
      ],
    ],
    "Egész csomagnál a legkisebb elegendő egész számot keressük, nem automatikusan a legközelebbi egészet.",
    "Hogyan bizonyítja két szomszédos csomagszám vizsgálata, hogy a választás a legkisebb?",
    [
      "Az eggyel kevesebb csomag nem elég.",
      "A választott csomagszám elegendő, így kisebb megfelelő egész nincs.",
    ],
    "transfer",
    3,
  );
}

function powers(index: number, random: Random): Draft {
  if (index === 0) {
    const base = random.int(2, 7),
      exponent = random.int(2, 5),
      value = base ** exponent;
    const expanded = Array.from({ length: exponent }, () => String(base)).join(
      "*",
    );
    return draft(
      "Írd fel a " +
        base +
        "^" +
        exponent +
        " hatványt szorzásjelekkel, hatványjel és köztes zárójel nélkül. Add meg a tényezők számát és a pontos értéket.",
      [
        field(
          "expanded",
          "Ismételt szorzás, egy sorban",
          expr(expanded, "(" + expanded + ")"),
          [S.power],
          [
            [
              base + "*" + exponent,
              "A kitevő a tényezők számát jelöli; minden tényező az alap legyen.",
            ],
          ],
        ),
        field(
          "factors",
          "Tényezők száma",
          num(exact(exponent)),
          [S.power],
          [
            [
              exact(base),
              "A tényezők számát a kitevő mondja meg, nem az alap.",
            ],
          ],
        ),
        field(
          "value",
          "Pontos érték",
          num(exact(value)),
          [S.power],
          [
            [
              exact(base * exponent),
              "Az alap és a kitevő egyszerű szorzata helyett az alapot ismételd tényezőként.",
            ],
          ],
        ),
      ],
      [
        "A kitevőben megadott számú tényezőt írj ki.",
        "Minden tényező " +
          base +
          "; összesen " +
          exponent +
          " ilyen számot szorzunk össze.",
      ],
      [
        [
          expanded.replaceAll("*", " × ") + " = " + value,
          "Az ismételt szorzást végezzük el.",
        ],
        ["A tényezők száma " + exponent, "Ez a hatvány kitevőjének jelentése."],
      ],
      "Az alap egy tényező értékét, a kitevő a tényezők számát adja meg.",
      "Miben különbözne az alap és a kitevő összeszorzása?",
      [
        "Csak két tényező lenne: az alap és a kitevő.",
        "Az eredeti hatványban minden tényező azonos az alappal.",
      ],
    );
  }
  if (index === 1) {
    const base = random.int(2, 8),
      exponent = random.int(2, 5),
      magnitude = base ** exponent;
    const left = exponent % 2 ? -magnitude : magnitude,
      right = -magnitude;
    return draft(
      "Hasonlítsd össze: (−" +
        base +
        ")^" +
        exponent +
        " és −" +
        base +
        "^" +
        exponent +
        ". Számítsd ki mindkettőt, és döntsd el, azonos-e az értékük.",
      [
        field(
          "negativeBase",
          "A negatív alap hatványa",
          num(exact(left)),
          [S.sign, S.power],
          [
            [
              exact(-left),
              "A negatív tényezők száma " +
                exponent +
                "; a párok és az esetleges egy maradék tényező döntik el az előjelet.",
            ],
          ],
        ),
        field(
          "outsideMinus",
          "A hatvány ellentettje",
          num(exact(right)),
          [S.sign],
          [
            [
              exact(magnitude),
              "A kezdő mínusz a pozitív alapból kiszámított hatvány ellentettjét jelöli.",
            ],
          ],
        ),
        needs(
          field(
            "equal",
            "Egyenlő a két érték?",
            yesNo(left === right),
            [S.sign],
            [
              [
                left === right ? "no" : "yes",
                exponent % 2
                  ? "Páratlan kitevőnél mindkét alak ugyanazt a negatív értéket adja."
                  : "Páros kitevőnél a negatív alap hatványa pozitív, a külső mínuszos alak negatív.",
              ],
            ],
          ),
          "negativeBase",
          "outsideMinus",
        ),
      ],
      [
        "Az első alakban a teljes negatív szám az alap.",
        "A másodikban előbb a pozitív alap hatványát számoljuk, aztán vesszük az ellentettjét.",
      ],
      [
        [
          "(−" + base + ")^" + exponent + " = " + hu(left),
          exponent % 2
            ? "Páratlan számú negatív tényező ad negatív eredményt."
            : "A negatív tényezők párokba rendezhetők.",
        ],
        [
          "−" + base + "^" + exponent + " = " + hu(right),
          "A külső mínusz a teljes pozitív hatvány elé kerül.",
        ],
      ],
      "A különböző szerkezet nem jelenti, hogy minden konkrét esetben eltérő az érték; a kitevőt is vizsgáld.",
      "Mikor egyezik a két alak ebben a családban?",
      [
        "Páratlan pozitív egész kitevőnél.",
        "Páros kitevőnél a nem nulla alap miatt ellenkező előjelűek.",
      ],
      "reason",
    );
  }
  const coefficient = random.int(12, 99),
    exponent = random.int(2, 6);
  const value = coefficient * 10 ** (exponent - 1),
    lower = 10 ** exponent,
    upper = 10 ** (exponent + 1);
  return draft(
    "Egy adatmodellben egy képkocka mérete " +
      hu(coefficient, 10) +
      " × 10^" +
      exponent +
      " bájt. Írd fel számként a pontos méretet, majd add meg a két szomszédos tízhatvány számértékét, amelyek közé szigorúan esik.",
    [
      field(
        "value",
        "Pontos méret (bájt)",
        num(exact(value), "bájt"),
        [S.scale, S.power],
        [
          [
            exact(value, 10),
            "Ez tízszer kisebb a megadott értéknél. Ellenőrizd a tízes szorzó kitevőjét.",
          ],
        ],
      ),
      field(
        "lower",
        "Alsó tízhatvány számértéke (bájt)",
        num(exact(lower), "bájt"),
        [S.scale],
      ),
      field(
        "upper",
        "Felső tízhatvány számértéke (bájt)",
        num(exact(upper), "bájt"),
        [S.scale],
        [
          [
            exact(lower * 2),
            "Két szomszédos tízhatvány között tízszeres, nem kétszeres a szorzó.",
          ],
        ],
      ),
    ],
    [
      "A szorzó 1 és 10 közé esik.",
      "Ezért a méret 10^" +
        exponent +
        " és 10^" +
        (exponent + 1) +
        " között van.",
    ],
    [
      [
        hu(coefficient, 10) + " × " + lower + " = " + value + " bájt",
        "A pontos mérőszámot kiszámoljuk.",
      ],
      [
        lower + " < " + value + " < " + upper,
        "A két szomszédos tízhatvány közrefogja a méretet.",
      ],
    ],
    "A tíz hatványai a pontos alak és a nagyságrendi ellenőrzés közötti kapcsolatot adják.",
    "Miért nem a szorzó kerekítéséből állapítottuk meg a két határt?",
    [
      "Az 1-nél nagyobb és 10-nél kisebb szorzó helye pontosan ismert.",
      "A közrefogó tízhatványokhoz nincs szükség a méret kerekítésére.",
    ],
    "transfer",
  );
}

function roots(index: number, random: Random): Draft {
  if (index === 0) {
    const a = random.int(-12, 12),
      absolute = Math.abs(a),
      count = a === 0 ? 1 : 2;
    return draft(
      "Legyen a = " +
        hu(a) +
        ". Mennyi √(a²)? Add meg az x² = a² egyenlet legkisebb és legnagyobb valós megoldását, valamint a különböző megoldások számát. Ha csak egy megoldás van, mindkét helyre ugyanazt írd.",
      [
        field(
          "root",
          "√(a²) értéke",
          num(exact(absolute)),
          [S.root],
          [
            [
              exact(a === 0 ? 1 : -absolute),
              "A gyökjel nemnegatív értéket jelöl; a négyzet után az abszolút értéket kapjuk vissza.",
            ],
          ],
        ),
        field("smaller", "Legkisebb valós megoldás", num(exact(-absolute)), [
          S.root,
        ]),
        field("larger", "Legnagyobb valós megoldás", num(exact(absolute)), [
          S.root,
        ]),
        field(
          "count",
          "Különböző valós megoldások száma",
          num(exact(count)),
          [S.root],
          [
            [
              exact(count === 1 ? 2 : 1),
              count === 1
                ? "A +0 és −0 ugyanaz a szám, ezért csak egy különböző megoldás van."
                : "Pozitív jobb oldal mellett a pozitív és negatív gyök is megoldás.",
            ],
          ],
        ),
      ],
      [
        "A √(a²) értéke |a|.",
        "A jobb oldal " +
          a * a +
          ". A gyökjel nemnegatív értéket kér, az egyenlet minden valós megoldást.",
      ],
      [
        [
          "a² = " + a * a + "; √(a²) = |" + hu(a) + "| = " + absolute,
          "A négyzet utáni gyök az abszolút értéket adja.",
        ],
        [
          "Legkisebb: " +
            hu(-absolute) +
            "; legnagyobb: " +
            absolute +
            "; különböző megoldás: " +
            count,
          a === 0
            ? "A két szélső megoldás ugyanaz a nulla."
            : "Két különböző ellentett szám négyzete ugyanaz.",
        ],
      ],
      "A gyök értékét és az egyenlet megoldásainak számát külön ellenőrizzük.",
      "Melyik feltétel választja ki a √ jel egyetlen értékét?",
      [
        "A négyzetgyök nemnegatív.",
        "Az x² = a² egyenletben x előjele nincs eleve korlátozva.",
      ],
      "reason",
    );
  }
  const integer = random.int(2, index === 1 ? 19 : 29),
    area = integer * integer + random.int(1, 2 * integer);
  if (index === 1) {
    const digits = rootDigits(area, 1),
      midpointNumerator = 2 * digits.floor + 1;
    const midpointSquareNumerator = midpointNumerator * midpointNumerator;
    const smallerSide = 400 * area < midpointSquareNumerator;
    const wrong =
      digits.rounded === digits.floor ? digits.floor + 1 : digits.floor;
    return draft(
      "Keresd meg √" +
        area +
        " két szomszédos egész határát, majd add meg a gyök egy tizedesre kerekített értékét. A kerekítést a megfelelő felezőpont négyzetével ellenőrizd.",
      [
        field(
          "lower",
          "Alsó egész határ",
          num(exact(integer)),
          [S.estimate],
          [
            [
              exact(area, 2),
              "A gyökvonás nem felezés. Olyan egész határt keress, amelynek a négyzete az adott szám alatt van.",
            ],
          ],
        ),
        field("upper", "Felső egész határ", num(exact(integer + 1)), [
          S.estimate,
        ]),
        field(
          "rounded",
          "Egy tizedesre kerekített gyök",
          num(exact(digits.rounded, 10)),
          [S.estimate, S.precision],
          [
            [
              exact(wrong, 10),
              "A felezőpont " +
                hu(midpointNumerator, 20) +
                ", négyzete " +
                hu(midpointSquareNumerator, 400) +
                ". Ezt hasonlítsd a gyök alatti számhoz.",
            ],
          ],
        ),
      ],
      [
        "Két szomszédos négyzetszám közé szorítsd a gyök alatti számot.",
        "A tizedes határok " +
          decimal(digits.floor, 1) +
          " és " +
          decimal(digits.floor + 1, 1) +
          "; a felezőpont négyzete dönti el a kerekítést.",
      ],
      [
        [
          integer * integer + " < " + area + " < " + (integer + 1) ** 2,
          "Ezért a gyök " + integer + " és " + (integer + 1) + " között van.",
        ],
        [
          hu(midpointNumerator, 20) +
            "² = " +
            hu(midpointSquareNumerator, 400) +
            (smallerSide ? " > " : " < ") +
            area,
          smallerSide
            ? "A gyök a felezőpont alatt van."
            : "A gyök a felezőpont fölött van.",
        ],
        [
          "√" + area + " ≈ " + decimal(digits.rounded, 1),
          "A kerekítés egy tizedesre szól.",
        ],
      ],
      "A biztos egész határ és a kerekített érték más pontosságú információ.",
      "Miért kell a felezőpontot is megvizsgálni a szomszédos tizedek mellett?",
      [
        "A teljes tizedes intervallum két kerekítési tartományból áll.",
        "A felezőpont négyzete pontos összehasonlítást tesz lehetővé.",
      ],
      "reason",
      3,
    );
  }
  const digits = rootDigits(area, 2),
    square = digits.rounded * digits.rounded,
    midpointNumerator = 2 * digits.floor + 1;
  const midpointSquareNumerator = midpointNumerator * midpointNumerator;
  const smallerSide = 40_000 * area < midpointSquareNumerator;
  const wrong =
    digits.rounded === digits.floor ? digits.floor + 1 : digits.floor;
  return draft(
    "Egy négyzet területe pontosan " +
      area +
      " cm². Írd fel az oldal mérőszámát gyökjellel, az eredeti " +
      area +
      " számmal a gyök alatt. Add meg az oldalt két tizedesre kerekítve és ennek a kerekített oldalnak a négyzetét. Pontosan visszakapjuk-e az eredeti területet?",
    [
      field(
        "exact",
        "Pontos mérőszám, egység nélkül",
        expr("√" + area, "√(" + area + ")"),
        [S.root, S.precision],
        [
          [
            area + "/2",
            "A négyzet oldalához négyzetgyök tartozik; a terület felezése nem adja az oldalt.",
          ],
        ],
      ),
      field(
        "rounded",
        "Oldal két tizedesre (cm)",
        num(exact(digits.rounded, 100), "cm"),
        [S.estimate, S.precision],
        [
          [
            exact(wrong, 100),
            "A századok felezőpontja " +
              hu(midpointNumerator, 200) +
              ". A négyzetét az adott területtel összehasonlítva döntsd el a kerekítést.",
          ],
        ],
      ),
      needs(
        field(
          "square",
          "A kerekített oldal négyzete (cm²)",
          num(exact(square, 10_000), "cm²"),
          [S.precision],
          [
            [
              exact(area),
              "A kerekített oldal nem pontosan a gyök. Előbb a kerekített számot szorozd önmagával.",
            ],
          ],
        ),
        "rounded",
      ),
      needs(
        field(
          "equal",
          "Pontosan az eredeti területet kapjuk?",
          yesNo(false),
          [S.precision],
          [
            [
              "yes",
              "A kerekített oldal négyzete eltér a megadott területtől; a közelítés nem pontos egyenlőség.",
            ],
          ],
        ),
        "square",
      ),
    ],
    [
      "A pontos oldalhoz nem kell tizedes alak: a gyökjel megőrzi az értéket.",
      "A szomszédos századok " +
        decimal(digits.floor, 2) +
        " és " +
        decimal(digits.floor + 1, 2) +
        ". A felezőpont négyzete dönt.",
    ],
    [
      [
        "Pontos oldal: √" + area + " cm",
        "A területből a nemnegatív oldalt keressük.",
      ],
      [
        hu(midpointNumerator, 200) +
          "² = " +
          hu(midpointSquareNumerator, 40_000) +
          (smallerSide ? " > " : " < ") +
          area,
        smallerSide
          ? "A gyök a felezőpont alatt van."
          : "A gyök a felezőpont fölött van.",
      ],
      [
        "Két tizedesre: " + decimal(digits.rounded, 2) + " cm",
        "A kért pontosságú közelítést adjuk meg.",
      ],
      [
        decimal(digits.rounded, 2) + "² = " + decimal(square, 4) + " cm²",
        "A kerekített szám pontos négyzetét számoljuk; ez nem azonos az eredeti területtel.",
      ],
    ],
    "A pontos gyökjeles alak és a közelített mérőszám egyszerre hasznos, de nem cserélhető fel egyenlőségként.",
    "Miért nem jelent hibát, hogy a kerekített oldalból kicsit más terület adódik?",
    [
      "Az oldal csak két tizedesre adott közelítés.",
      "Az eredeti pontos területhez a gyökjeles oldal tartozik.",
    ],
    "transfer",
    3,
  );
}
const builders: Partial<
  Record<TopicId, (index: number, random: Random) => Draft>
> = {
  "betus-kifejezesek": algebra,
  "szoveges-modellek": models,
  hatvanyok: powers,
  negyzetgyok: roots,
};
export function generateBridgeExercise(
  topic: TopicId,
  seed: number,
  variant?: number,
): Exercise {
  if (!Number.isSafeInteger(seed))
    throw new RangeError("A seed biztonságos egész szám legyen.");
  if (variant !== undefined && !Number.isSafeInteger(variant))
    throw new RangeError("A változat biztonságos egész szám legyen.");
  if (!Object.hasOwn(builders, topic))
    throw new RangeError("Ismeretlen összekötő témakör.");
  const available = bridgeGeneratorFamilies.filter(
    (family) => family.topic === topic,
  );
  const selectedVariant = variant ?? seed;
  const index =
    ((selectedVariant % available.length) + available.length) %
    available.length;
  const family = available[index],
    key = family.id + ":seed=" + seed + ":variant=" + selectedVariant;
  return {
    ...builders[topic]!(index, randomFrom("matek8-bridge-generator-v1:" + key)),
    topic,
    id: "generated:" + key,
  };
}

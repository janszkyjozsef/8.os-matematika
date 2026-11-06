import type {
  AnswerSpec,
  Exercise,
  Lesson,
  ScalarAnswerSpec,
  SolutionStep,
  TopicId,
} from "../types.ts";

// The manuscript IDs remain visible provenance. Each numbered manuscript task
// is ONE exercise; the parts preserve its separately checked questions.
type Part = Extract<AnswerSpec, { kind: "parts" }>["parts"][number];
type Mistake = { input: string; feedback: string };
const number = (
  expected: string,
  unit?: string,
  variable?: string,
): ScalarAnswerSpec => ({
  kind: "number",
  expected,
  ...(unit ? { unit } : {}),
  ...(variable ? { variable } : {}),
});
const choice = (
  correct: string,
  options: [string, string][],
): ScalarAnswerSpec => ({
  kind: "choice",
  correct,
  options: options.map(([id, text]) => ({ id, text })),
});
const expression = (
  accepted: string[],
  example?: string,
): ScalarAnswerSpec => ({
  kind: "expression",
  accepted,
  ...(example ? { example } : {}),
});
const part = (
  id: string,
  label: string,
  answer: ScalarAnswerSpec,
  mistakes: [string, string][] = [],
): Part => ({
  id,
  label,
  answer,
  ...(mistakes.length
    ? { mistakes: mistakes.map(([input, feedback]) => ({ input, feedback })) }
    : {}),
});
const parts = (...items: Part[]): AnswerSpec => ({
  kind: "parts",
  parts: items,
});
const steps = (...items: [string, string][]): SolutionStep[] =>
  items.map(([expression, why]) => ({ expression, why }));
const reflect = (prompt: string, ...checkpoints: string[]) => ({
  prompt,
  checkpoints,
});
const exercise = (
  topic: TopicId,
  suffix: string,
  manuscriptId: string,
  prompt: string,
  answer: AnswerSpec,
  hints: [string, string],
  solution: SolutionStep[],
  takeaway: string,
  extra: Partial<
    Pick<
      Exercise,
      "kind" | "difficulty" | "context" | "reflection" | "mistakes"
    >
  > = {},
): Exercise => ({
  id: `${topic}-${suffix}`,
  topic,
  manuscriptId,
  kind: "compute",
  difficulty: 2,
  prompt,
  answer,
  hints,
  solution,
  takeaway,
  ...extra,
});
const relation = (correct: string) =>
  choice(correct, [
    ["lt", "< (kisebb)"],
    ["eq", "= (egyenlő)"],
    ["gt", "> (nagyobb)"],
  ]);
const direction = (correct: string) =>
  choice(correct, [
    ["left", "Balra"],
    ["right", "Jobbra"],
    ["stay", "Nem mozdul"],
  ]);
const sign = (correct: string) =>
  choice(correct, [
    ["negative", "Negatív"],
    ["zero", "Nulla"],
    ["positive", "Pozitív"],
  ]);
const yesNo = (yes: boolean) =>
  choice(yes ? "yes" : "no", [
    ["yes", "Igen"],
    ["no", "Nem"],
  ]);

const szamfogalom: Lesson = {
  id: "szamfogalom",
  moduleId: "M01",
  title: "Számfogalom és előjelek",
  shortTitle: "Számok és előjelek",
  question: "Hogyan lehet egy szám kisebb, miközben messzebb van a nullától?",
  teaser:
    "Válaszd külön a szám helyét, ellentettjét és nullától mért távolságát.",
  description:
    "A számegyeneshez kapcsoljuk az előjeleket és a műveletek jelentését. A szám állapota, a változás és a távolság külön kérdés; egész számokkal, törtekkel és tizedesekkel is gyakoroljuk.",
  goals: [
    "Példákon elkülöníted a természetes, egész és racionális számokat, és felismered ugyanazt az értéket több alakban.",
    "Elhelyezel és összehasonlítasz pozitív, negatív és nulla értékű számokat.",
    "Megkülönbözteted az ellentettet, az abszolút értéket, az előjelet és a kivonás jelét.",
    "Értelmezed az előjeles műveleteket, és megindokolod, miért nem osztunk nullával.",
    "Számegyenessel, becsléssel vagy visszafelé végzett művelettel ellenőrzöl.",
  ],
  prerequisites: [
    "Pozitív egész számok alapműveletei; az osztás mint visszafelé végzett szorzás.",
    "Egyszerű törtek jelentése, például 1/2 = 0,5. A közös nevezőt a törtes példán újra bemutatjuk.",
  ],
  prerequisiteTopics: ["tortek"],
  coveredUnits: ["M01.01", "M01.02", "M01.03", "M03.01", "M03.02"],
  estimateMinutes: 45,
  color: "#a9d8f4",
  layer: "ALAP",
  nextTopic: "muveleti-sorrend",
  prediction: exercise(
    "szamfogalom",
    "prediction",
    "SZ01-J01",
    "A koordinátája −3, B koordinátája −8. Melyik pont van messzebb a nullától, és melyik koordináta a nagyobb?",
    choice("b", [
      ["a", "B van messzebb, és −8 a nagyobb szám."],
      ["b", "B van messzebb, de −3 a nagyobb szám."],
      ["c", "A van messzebb, és −3 a nagyobb szám."],
    ]),
    [
      "A sorrendhez a pontok bal–jobb helyzetét nézd.",
      "A nullától mért távolságok 3 és 8 egység.",
    ],
    steps(
      ["−8 < −3", "A −3 a számegyenesen jobbra található."],
      [
        "|−8| = 8 > 3 = |−3|",
        "A távolság más kérdés, mint a számok sorrendje.",
      ],
    ),
    "A nagyobb szám nem feltétlenül van messzebb a nullától.",
    {
      kind: "reason",
      difficulty: 1,
      reflection: reflect(
        "Indokold külön a sorrendet és a távolságot.",
        "A −3 pontja jobbra van.",
        "A −8 nullától mért távolsága 8, a −3-é 3.",
      ),
      mistakes: [
        {
          input: "a",
          feedback:
            "A 8 a távolságot mutatja. Melyik pont van jobbra a számegyenesen?",
        },
        {
          input: "c",
          feedback:
            "Számold meg külön a nulláig tartó egységeket: A-tól 3, B-től 8.",
        },
      ],
    },
  ),
  explanation: [
    {
      heading: "Az érték dönt, nem a szám külalakja",
      body: "Ebben a leckében a természetes számokat 0-val kezdjük: 0, 1, 2, … . Az egész számok a negatív egészeket is tartalmazzák. Racionális az a szám, amely két egész hányadosaként felírható, nem nulla nevezővel. Minden természetes egész, minden egész racionális; a „legszűkebb kategória” a rá illő legkisebb csoportot kéri.",
      formula: "4 = 4/1; 0 = 0/1; 0,5 = 1/2; −1,25 = −5/4; 8/4 = 2",
      bullets: [
        "A 8/4 természetes szám: a törtvonal nem teszi nem egésszé.",
        "Egy másik tananyag kezdheti 1-nél a természetes számokat; itt kifejezetten beleértjük a nullát.",
      ],
    },
    {
      heading: "Melyik mínusz mit jelent?",
      body: "A −5-ben a mínusz előjel. A 8 − 5-ben kivonási művelet. A 8 − (−5)-ben az első mínusz kivonás, a második a kivonandó előjele. A +5 és 5 azonos. A nulla sem pozitív, sem negatív; −0 = +0 = 0.",
      formula:
        "Nemnegatív: pozitív vagy nulla. Nempozitív: negatív vagy nulla.",
    },
    {
      heading: "Számegyenes: sorrend és egység",
      body: "Rögzítjük a nulla helyét, az egységet és a növekedés irányát. Egyenlő osztásközökkel jobbra nőnek a számok. A −7 kisebb −2-nél, mert balra található. Negatív törteknél ugyanez igaz. Mért adatoknál az egység és a viszonyítási szint is egyezzen.",
      formula: "−3/2 = −1,5 < −1,2 < −1/4 = −0,25 < 0",
      bullets: [
        "A −2 m és −50 cm összevetése előtt: −50 cm = −0,5 m.",
        "Két pont távolsága nemnegatív; a felezőpont koordinátája lehet negatív.",
      ],
    },
    {
      heading: "Ellentett: tükrözés a nullára",
      body: "Egy szám ellentettje ugyanakkora távolságra van a nulla másik oldalán. Összegük nulla. A −a jelölés nem jelenti, hogy az eredmény biztosan negatív: ha a = −6, akkor −a = 6.",
      formula: "−6 + 6 = 0; a 6 ellentettje −6; a 0 ellentettje 0",
    },
    {
      heading: "Abszolút érték: távolság",
      body: "Az abszolút érték a nullától mért távolság, ezért nem lehet negatív. Egy pozitív szám ellentettje negatív, de abszolút értéke pozitív. A külső mínuszt az abszolútérték-képzés után értelmezzük.",
      formula: "|−6| = |6| = 6; |0| = 0; −|−6| = −6",
      bullets: [
        "A −8 kisebb −3-nál, miközben |−8| nagyobb |−3|-nál.",
        "Az abszolút érték képzése nem őrzi meg minden számpár sorrendjét.",
      ],
    },
    {
      heading: "Összeadás és kivonás mint elmozdulás",
      body: "Az első számtól indulunk. Pozitív szám hozzáadása jobbra, negatív hozzáadása balra visz; nulla hozzáadásakor maradunk. Egy szám kivonása az ellentettjének hozzáadása. A kivonás tehát nem mindig balra lépés.",
      formula: "a − b = a + (−b); −3 − 7 = −10; −3 − (−7) = 4",
      bullets: [
        "−8 + 3 = −5, de −8 + 11 = 3: az összeg előjeléhez a nagyságok is kellenek.",
        "A −5 − (−3) = −5 + 3 = −2. A negatív kivonandó jobbra mozdít.",
      ],
    },
    {
      heading: "Miért pozitív két negatív szorzata?",
      body: "A 3 × (−2) három darab −2 összege, ezért −6. A szorzásnak a zárójelfelbontással is összhangban kell lennie: (−3) × [2 + (−2)] = 0. Felbontva −6 + (−3) × (−2) = 0, ezért a második tagnak +6-nak kell lennie.",
      formula: "(−3) × (−2) = 6",
      bullets: [
        "Két nem nulla, azonos előjelű tényező szorzata pozitív; különböző előjelűeké negatív.",
        "Ezt a szorzási szabályt nem alkalmazzuk automatikusan az összeadásra.",
      ],
    },
    {
      heading: "Az osztást visszaszorzással ellenőrizzük",
      body: "A 12 : (−3) = −4 azért helyes, mert (−4) × (−3) = 12. A 0 : (−5) = 0 is helyes: az osztó nem nulla. A 7 : 0-hoz olyan szám kellene, amelyet nullával szorozva 7-et kapunk; ilyen nincs. A 0 : 0 esetén minden szám teljesítené a visszaszorzást, így nem volna egyértelmű hányados.",
      formula: "a : b = q azt kívánja, hogy b × q = a; b ≠ 0",
      bullets: [
        "Nullával nem osztunk. A helyén sem 0, sem „végtelen” nem adható meg.",
        "A nulla szorzata bármely számmal nulla.",
      ],
    },
    {
      heading: "Öt elakadási pont és az ellenpróbája",
      body: "Egyetlen hibás szám még nem árulja el biztosan a gondolatmenetedet. Nézd meg, melyik állítást használtad, és próbáld ki ellenpéldán.",
      bullets: [
        "„−8 nagyobb −3-nál.” Ellenpróba: −8 °C hidegebb, és a −8 balra van.",
        "„Ellentett és abszolút érték azonos.” A 2,5 ellentettje −2,5; abszolút értéke 2,5.",
        "„Két mínusz mindig pozitív eredményt ad.” −10 − (−2) = −8.",
        "„Negatív szám csak egész lehet.” −0,3 és −1/2 is negatív; −0,3 > −1/2.",
        "„Ha nulla szerepel az osztásban, az eredmény nulla.” 0 : 5 = 0, de 5 : 0 és 0 : 0 nincs értelmezve.",
      ],
    },
  ],
  examples: [
    {
      title: "SZ01-P01 — Negatív szám kivonása",
      prompt: "Számítsd ki: −7 − (−4) + 6.",
      steps: steps(
        ["−7 − (−4) + 6 = −7 + 4 + 6", "A −4 kivonása +4 hozzáadását jelenti."],
        ["−7 + 4 + 6 = −3 + 6", "Négy egységet jobbra lépünk −7-től."],
        ["−3 + 6 = 3", "A hat egységnyi jobbra lépéssel átlépjük a nullát."],
      ),
      alternative: steps(
        [
          "4 + 6 = 10",
          "Az átalakítás után csak összeadások maradnak; a pozitív tagokat csoportosíthatjuk.",
        ],
        ["−7 + 10 = 3", "Ugyanaz a teljes elmozdulás."],
      ),
      check: "A kezdőpont −7, a teljes elmozdulás +10, így a végpont 3.",
    },
    {
      title: "SZ01-P02 — Hőmérséklet-változás",
      prompt:
        "−2,5 °C-ról 1,75 °C-kal csökken, majd 4,5 °C-kal emelkedik a hőmérséklet. Mennyi lesz?",
      steps: steps(
        ["−2,5 − 1,75 = −4,25 °C", "A csökkenés negatív változás."],
        ["−4,25 + 4,5 = 0,25 °C", "Az emelkedést a köztes állapothoz adjuk."],
      ),
      alternative: steps(
        [
          "−2,5 = −10/4; −1,75 = −7/4; 4,5 = 18/4",
          "Azonos részegységet választunk.",
        ],
        [
          "(−10 − 7 + 18)/4 = 1/4 = 0,25",
          "A negyedek darabszámait összeadjuk.",
        ],
      ),
      check:
        "−4,25 °C-ról 4,25 °C emelkedés jutna nulláig. A tényleges emelkedés még 0,25 °C-kal több.",
    },
  ],
  practice: [
    exercise(
      "szamfogalom",
      "practice-1",
      "SZ01-G01",
      "Sorold a −6; 0; 3/2; −0,75; 4; 8/4 számokat a rájuk illő legszűkebb kategóriába. Ebben a leckében 0 természetes szám.",
      parts(
        ...[
          ["minus6", "−6", "integer"],
          ["zero", "0", "natural"],
          ["threehalves", "3/2", "rational"],
          ["decimal", "−0,75", "rational"],
          ["four", "4", "natural"],
          ["eightfourths", "8/4", "natural"],
        ].map(([id, label, correct]) =>
          part(
            id,
            label,
            choice(correct, [
              ["natural", "Természetes"],
              ["integer", "Egész, de nem természetes"],
              ["rational", "Racionális, de nem egész"],
            ]),
            [
              [
                correct === "natural" ? "rational" : "natural",
                "A szám értékét nézd: például 8/4 = 2. A legszűkebb csoportot kérjük, és itt 0 is természetes.",
              ],
            ],
          ),
        ),
      ),
      [
        "Az értéket vizsgáld, ne azt, látsz-e törtvonalat.",
        "Egyszerűsítsd a 8/4-et, majd keresd a két szomszédos egész közé eső értékeket.",
      ],
      steps(
        [
          "−6: egész, de nem természetes; 0, 4, 8/4 = 2: természetes",
          "A negatív egész nem természetes; a nullát most beleértjük a természetesekbe.",
        ],
        [
          "3/2 = 1,5; −0,75 = −3/4: racionális, de nem egész",
          "Két egész közé esnek. Mind a hat szám racionális is, de a legszűkebb kategóriát keressük.",
        ],
      ),
      "A számot az értéke alapján soroljuk be.",
      {
        kind: "reason",
        difficulty: 1,
        reflection: reflect(
          "Miért természetes szám a 8/4, és miért racionális mind a hat szám?",
          "8/4 = 2.",
          "Minden felsorolt érték két egész hányadosaként felírható nem nulla nevezővel.",
        ),
      },
    ),
    exercise(
      "szamfogalom",
      "practice-2",
      "SZ01-G02",
      "Írd növekvő sorrendbe: −1,2; −3/2; 0; −1/4; 1. A mezőkbe balról jobbra a teljes sorozat öt elemét írd.",
      parts(
        ...["-3/2", "-1.2", "-1/4", "0", "1"].map((value, i) =>
          part(`place${i + 1}`, `${i + 1}. szám`, number(value)),
        ),
      ),
      [
        "Növekvő sorrendben balról jobbra haladunk a számegyenesen.",
        "−3/2 = −1,5 és −1/4 = −0,25; a negatívak között a nullához közelebbi nagyobb.",
      ],
      steps(
        [
          "−3/2 = −1,5; −1/4 = −0,25",
          "A törteket összehasonlítható alakba írtuk.",
        ],
        [
          "−3/2 < −1,2 < −1/4 < 0 < 1",
          "A legbaloldalibb ponttól haladunk jobbra.",
        ],
      ),
      "A legkisebb felsorolt számnak itt a legnagyobb az abszolút értéke.",
      { difficulty: 1 },
    ),
    exercise(
      "szamfogalom",
      "practice-3",
      "SZ01-G03",
      "Add meg a −7, a 2,5 és a 0 ellentettjét és abszolút értékét; majd számítsd ki: −|−7|.",
      parts(
        part("oppositeMinus7", "A −7 ellentettje", number("7")),
        part("absMinus7", "|−7|", number("7"), [
          ["-7", "Az abszolút érték távolság, ezért nem negatív."],
        ]),
        part("oppositePositive", "A 2,5 ellentettje", number("-2.5"), [
          [
            "2.5",
            "Az ellentett a nulla másik oldalán van; ne az abszolút értéket add meg.",
          ],
        ]),
        part("absPositive", "|2,5|", number("2.5")),
        part("oppositeZero", "A 0 ellentettje", number("0")),
        part("absZero", "|0|", number("0")),
        part("outsideMinus", "−|−7|", number("-7"), [
          [
            "7",
            "A külső mínusz az abszolút érték kiszámítása után annak ellentettjét kéri.",
          ],
        ]),
      ),
      [
        "Az ellentett a nullára tükröz, az abszolút érték távolság.",
        "A 2,5 ellentettje negatív. A −|−7| külső mínusza az abszolútérték-képzés után érvényesül.",
      ],
      steps(
        [
          "−7 → ellentett: 7, abszolút érték: 7",
          "A két fogalom eredménye ennél a negatív számnál megegyezik.",
        ],
        [
          "2,5 → ellentett: −2,5, abszolút érték: 2,5; 0 → 0 és 0",
          "A pozitív szám példája mutatja a két fogalom különbségét.",
        ],
        ["−|−7| = −7", "Előbb |−7| = 7, majd vesszük a 7 ellentettjét."],
      ),
      "Az ellentett és az abszolút érték külön fogalom.",
      {
        reflection: reflect(
          "Melyik megadott szám mutatja legjobban, hogy a két fogalom különbözik?",
          "A 2,5 ellentettje −2,5, abszolút értéke +2,5.",
        ),
      },
    ),
    exercise(
      "szamfogalom",
      "practice-4",
      "SZ01-G04",
      "A koordinátája −6, B-é 4; a rajzon 1 egység 1 cm. Mekkora az AB hossz, és mi a felezőpont koordinátája?",
      parts(
        part("distance", "AB hossza (cm)", number("10", "cm"), [
          [
            "-10",
            "A távolság nemnegatív. Számold a −6-tól 0-ig, majd 4-ig tartó utat.",
          ],
        ]),
        part("midpoint", "Felezőpont koordinátája", number("-1"), [
          ["5", "Az 5 a fél távolság. A −6 kezdőponthoz add hozzá."],
        ]),
      ),
      [
        "A két pont a nulla két oldalán van: előbb nulláig, majd B-ig számolj.",
        "A teljes út 6 + 4; a felezőpontot A-tól indulva ennek a felénél találod.",
      ],
      steps(
        ["AB = 6 + 4 = 10 cm", "Két nemnegatív szakaszhosszt adunk össze."],
        [
          "10 : 2 = 5; −6 + 5 = −1",
          "A felezőponthoz az A-tól öt egységet lépünk jobbra.",
        ],
        ["−1 − (−6) = 5; 4 − (−1) = 5", "A két fél hossza egyenlő."],
      ),
      "A szakaszhossz és a koordináta eltérő kérdés.",
    ),
    exercise(
      "szamfogalom",
      "practice-5",
      "SZ01-G05",
      "Számítsd ki mindhárom összeget, és minden esetben add meg az elmozdulás irányát: a) −8 + 13; b) 6 + (−11); c) −4 + (−9).",
      parts(
        part("a", "a) eredmény", number("5")),
        part("aDirection", "a) elmozdulás", direction("right")),
        part("b", "b) eredmény", number("-5")),
        part("bDirection", "b) elmozdulás", direction("left")),
        part("c", "c) eredmény", number("-13"), [
          [
            "13",
            "A negatív számhoz újabb negatív elmozdulás kerül: a −4-től balra lépünk.",
          ],
        ]),
        part("cDirection", "c) elmozdulás", direction("left")),
      ),
      [
        "Az első szám a kezdőpont, a második előjele az elmozdulás iránya.",
        "a) 13 jobbra; b) 11 balra; c) 9 balra.",
      ],
      steps(
        [
          "−8 + 13 = 5",
          "Nyolc jobbra lépés nulláig, majd még öt a pozitív oldalra visz.",
        ],
        ["6 + (−11) = −5", "Hat balra lépés nulláig, majd még öt balra."],
        ["−4 + (−9) = −13", "Negatív kezdőponttól tovább balra haladunk."],
      ),
      "Ellentétes előjelű összeadandóknál a nagyságok is döntenek az eredmény előjeléről.",
    ),
    exercise(
      "szamfogalom",
      "practice-6",
      "SZ01-G06",
      "Számítsd ki: a) 5 − (−7); b) −5 − 7; c) −5 − (−7). Nevezd meg, melyik számot vonjuk ki.",
      parts(
        part("a", "a) 5 − (−7)", number("12"), [
          ["-2", "A kivonandó −7; ennek ellentettje +7."],
        ]),
        part("b", "b) −5 − 7", number("-12"), [
          ["12", "Itt pozitív 7-et vonunk ki a −5-ből, ezért balra lépünk."],
        ]),
        part("c", "c) −5 − (−7)", number("2"), [
          ["-12", "A −7 kivonása +7 hozzáadása."],
        ]),
      ),
      [
        "Minden kivonást alakíts az ellentett hozzáadásává.",
        "Az a) és c) kivonandója −7, a b) kivonandója +7.",
      ],
      steps(
        ["5 − (−7) = 5 + 7 = 12", "A kivonandó ellentettjét adjuk hozzá."],
        ["−5 − 7 = −5 + (−7) = −12", "A pozitív 7 ellentettje −7."],
        [
          "−5 − (−7) = −5 + 7 = 2",
          "A kezdőpont negatív marad az átíráskor; csak a kivonást értelmeztük újra.",
        ],
      ),
      "A „két mínusz plusz” helyett olvasd el a jelek szerepét.",
      {
        reflection: reflect(
          "Miért nem használható a „két mínusz mindig pozitív” mondat?",
          "Különbözik az előjel és a kivonás.",
          "Negatív szám kivonása jobbra mozdít, de a végpont maradhat negatív: −10 − (−2) = −8.",
        ),
      },
    ),
    exercise(
      "szamfogalom",
      "practice-7",
      "SZ01-G07",
      "Számítsd ki: a) (−6) × 4; b) (−6) × (−4); c) 36 : (−9); d) (−36) : (−9). Az osztásokat visszaszorzással ellenőrizd.",
      parts(
        part("a", "a) eredmény", number("-24")),
        part("b", "b) eredmény", number("24"), [
          [
            "-24",
            "Két negatív tényező szorzata pozitív; ellenőrizd a zárójelfelbontásos indoklást.",
          ],
        ]),
        part("c", "c) eredmény", number("-4")),
        part("d", "d) eredmény", number("4")),
      ),
      [
        "Először a nem nulla tényezők előjeleit, majd a nagyságukat vizsgáld.",
        "Az osztásnál keresd azt a számot, amelyet −9-cel szorozva visszakapod az osztandót.",
      ],
      steps(
        [
          "(−6) × 4 = −24; (−6) × (−4) = 24",
          "Különböző előjelek negatív, azonos előjelek pozitív szorzatot adnak.",
        ],
        [
          "36 : (−9) = −4, mert (−4) × (−9) = 36",
          "Visszaszorzás igazolja a hányadost.",
        ],
        [
          "(−36) : (−9) = 4, mert 4 × (−9) = −36",
          "A két előjel együtt számít.",
        ],
      ),
      "Az osztást szorzással tudod ellenőrizni.",
    ),
    exercise(
      "szamfogalom",
      "practice-8",
      "SZ01-G08",
      "Számítsd ki: a) −3/4 + 1/2; b) −1,2 − (−0,7).",
      parts(
        part("a", "a) eredmény", number("-1/4"), [
          ["-2/6", "A nevezőket nem adjuk össze. Írd a felet két negyednek."],
        ]),
        part("b", "b) eredmény", number("-0.5"), [
          ["-1.9", "A −0,7 kivonása +0,7 hozzáadása."],
        ]),
      ),
      [
        "Az a) esetben közös törtegység kell; a b) esetben először a kivonás jelentését tisztázd.",
        "1/2 = 2/4; a −0,7 ellentettje +0,7.",
      ],
      steps(
        [
          "−3/4 + 1/2 = −3/4 + 2/4 = −1/4",
          "Három negatív negyedhez két pozitív negyed társul.",
        ],
        [
          "−1,2 − (−0,7) = −1,2 + 0,7 = −0,5",
          "Hét tizedet jobbra lépünk, de nem érjük el a nullát.",
        ],
      ),
      "A törtvonal és a tizedesvessző nem változtat az előjelek jelentésén.",
    ),
    exercise(
      "szamfogalom",
      "practice-9",
      "SZ01-G09",
      "Keresd meg a hiányzó számokat, és ellenőrizz helyettesítéssel: a) x + 7 = −2; b) −4 + y = 6; c) 5 − z = 9.",
      parts(
        part("x", "x értéke", number("-9", undefined, "x")),
        part("y", "y értéke", number("10", undefined, "y")),
        part("z", "z értéke", number("-4", undefined, "z"), [
          [
            "4",
            "Próbáld vissza: 5 − 4 = 1. Milyen szám kivonásával nőhet 5-ről 9-re az érték?",
          ],
        ]),
      ),
      [
        "A megfelelő kezdőpontot vagy elmozdulást keresd.",
        "A c) eredménye nagyobb 5-nél. Milyen előjelű szám kivonása növel?",
      ],
      steps(
        [
          "x = −2 − 7 = −9; ellenőrzés: −9 + 7 = −2",
          "A hozzáadott hetet a fordított művelettel visszavesszük.",
        ],
        [
          "y = 6 − (−4) = 10; ellenőrzés: −4 + 10 = 6",
          "A kezdőponttól a végpontig tartó elmozdulást keressük.",
        ],
        [
          "z = −4; ellenőrzés: 5 − (−4) = 9",
          "Négy egységnyi növekedéshez −4-et vonunk ki.",
        ],
      ),
      "A hiányzó szám előjelét a helyzetből is ellenőrizheted.",
      {
        kind: "transfer",
        reflection: reflect(
          "Írd le az egyik visszahelyettesítést.",
          "Az eredeti egyenlőségbe a megtalált számot írtam.",
          "A két oldal ugyanazt az értéket adja.",
        ),
      },
    ),
    exercise(
      "szamfogalom",
      "practice-10",
      "SZ01-G10",
      "Reggel −3 °C van; délig 8 °C-kal melegszik, estig 6 °C-kal hűl. Mennyi az esti hőmérséklet és az egész napi előjeles változás?",
      parts(
        part("evening", "Esti hőmérséklet (°C)", number("-1", "°C"), [
          [
            "2",
            "Ez a napi változás. A változást a −3 °C-os kezdethez kell hozzáadni.",
          ],
        ]),
        part("change", "Napi változás (°C)", number("2", "°C"), [
          [
            "-1",
            "Ez az esti állapot. A változás a végső és a kezdeti hőmérséklet különbsége.",
          ],
        ]),
      ),
      [
        "Külön kérdés az állapot és a kezdethez viszonyított változás.",
        "A változások összege +8 − 6; ezt add a kezdeti −3-hoz.",
      ],
      steps(
        [
          "−3 + 8 = 5 °C; 5 − 6 = −1 °C",
          "Egymás után követjük az állapotokat.",
        ],
        ["+8 − 6 = +2 °C", "A két változás összege a napi változás."],
        [
          "−1 − (−3) = 2 °C",
          "A végső és kezdeti állapot különbsége ugyanazt adja.",
        ],
      ),
      "A −1 °C állapot, a +2 °C változás.",
      { kind: "transfer" },
    ),
    exercise(
      "szamfogalom",
      "practice-11",
      "SZ01-G11",
      "Valaki ezt írta: „−9 < −4, ezért |−9| < |−4|.” Vizsgáld külön a sorrendet és a távolságot, majd javítsd az indoklást.",
      parts(
        part("order", "−9 … −4", relation("lt")),
        part("abs9", "|−9| értéke", number("9")),
        part("abs4", "|−4| értéke", number("4")),
        part("distanceOrder", "|−9| … |−4|", relation("gt"), [
          [
            "lt",
            "A távolságok 9 és 4. A számok eredeti sorrendje nem vihető át automatikusan.",
          ],
        ]),
      ),
      [
        "A két összehasonlítást külön vizsgáld.",
        "Írd ki számjeggyel a nullától mért két távolságot.",
      ],
      steps(
        ["−9 < −4 igaz", "A −9 balra van a −4-től."],
        ["|−9| = 9 > 4 = |−4|", "A távolságok sorrendje fordított."],
      ),
      "Az abszolút érték nem őrzi meg minden számpár kisebb–nagyobb viszonyát.",
      {
        kind: "reason",
        reflection: reflect(
          "Pontosan melyik következtetés hibás, és miért?",
          "Az első állítás igaz.",
          "A számsorrendből nem következik ugyanilyen irányú távolságsorrend.",
        ),
      },
    ),
    exercise(
      "szamfogalom",
      "practice-12",
      "SZ01-G12",
      "Döntsd el, mely műveletek értelmezettek. Add meg az értelmezett műveletek eredményét, a többinél válassz indoklást: a) 0 : (−8); b) 8 : 0; c) 0 : 0; d) (−8) × 0.",
      parts(
        part("a", "a) 0 : (−8)", number("0")),
        part(
          "b",
          "b) 8 : 0 értelmezése",
          choice("none", [
            ["none", "Nincs értelmezve: 0 × q = 8 lehetetlen."],
            ["zero", "0 az eredmény."],
            ["infinite", "Végtelen az eredmény."],
          ]),
          [
            [
              "zero",
              "A 0 × 0 nem 8; nincs visszaszorzással ellenőrizhető hányados.",
            ],
            [
              "infinite",
              "Ebben a számkörben nem adunk végtelen értéket a nullával osztásnak.",
            ],
          ],
        ),
        part(
          "c",
          "c) 0 : 0 értelmezése",
          choice("ambiguous", [
            [
              "ambiguous",
              "Nincs értelmezve: 0 × q = 0 nem választ ki egyetlen hányadost.",
            ],
            ["zero", "0 az eredmény."],
            ["one", "1 az eredmény."],
          ]),
        ),
        part("d", "d) (−8) × 0", number("0")),
      ),
      [
        "A nullával szorzás és a nullával osztás két külön helyzet.",
        "Az a : b = q azt kívánná, hogy b × q = a. Próbáld a b) és c) esetben.",
      ],
      steps(
        [
          "0 : (−8) = 0; (−8) × 0 = 0",
          "Az első osztója nem nulla; a második szorzás.",
        ],
        [
          "8 : 0 nincs értelmezve",
          "A 0 × q = 8 egyenlőségnek nincs megoldása.",
        ],
        [
          "0 : 0 nincs értelmezve",
          "A 0 × q = 0 minden számmal igaz, ezért nem határoz meg egyetlen hányadost.",
        ],
      ),
      "Nullával nem osztunk, akkor sem, ha az osztandó is nulla.",
      {
        kind: "reason",
        reflection: reflect(
          "Miben különbözik a két nem értelmezett osztás indoka?",
          "8 : 0 esetében nincs megfelelő hányados.",
          "0 : 0 esetében a visszaszorzás nem ad egyértelmű hányadost.",
        ),
      },
    ),
  ],
  exit: [
    exercise(
      "szamfogalom",
      "exit-1",
      "SZ01-Z01",
      "Számítsd ki: −2,4 + 0,9 − (−1,8). Add meg az eredményt és előjelét; melyik műveletnél léped át a nullát balról jobbra haladva?",
      parts(
        part("value", "Eredmény", number("0.3")),
        part("sign", "Az eredmény előjele", sign("positive")),
        part(
          "crossing",
          "A nulla átlépése",
          choice("second", [
            ["first", "Az első, +0,9 lépésben."],
            ["second", "A második, −(−1,8) lépésben."],
            ["never", "Egyik lépésben sem."],
          ]),
        ),
      ),
      [
        "A negatív szám kivonását előbb írd át.",
        "−2,4 + 0,9 = −1,5; innen következik az új elmozdulás.",
      ],
      steps(
        [
          "−2,4 + 0,9 − (−1,8) = −2,4 + 0,9 + 1,8",
          "A −1,8 kivonása az ellentett hozzáadása.",
        ],
        [
          "−1,5 + 1,8 = 0,3",
          "A második műveletben lépjük át a nullát; az eredmény pozitív.",
        ],
        ["(−24 + 9 + 18)/10 = 3/10", "Tizedekkel függetlenül ellenőrizhetjük."],
      ),
      "A helyes számot az elmozdulás értelmezése is támassza alá.",
      {
        reflection: reflect(
          "Indokold, miért jobbra lépsz a második műveletnél.",
          "A −1,8 kivonása +1,8 hozzáadása.",
          "−1,5-ről 1,8 egység jobbra a pozitív 0,3-hoz visz.",
        ),
      },
    ),
    exercise(
      "szamfogalom",
      "exit-2",
      "SZ01-Z02",
      "A koordinátája −3, B-é 5, C-é −7. Egy egység 1 méter. a) Melyik koordináta a legnagyobb? b) Melyik pont van legtávolabb a nullától? c) Mekkora az AC távolság?",
      parts(
        part(
          "largest",
          "a) Legnagyobb koordináta pontja",
          choice("b", [
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
          ]),
        ),
        part(
          "farthest",
          "b) Legtávolabbi pont",
          choice("c", [
            ["a", "A"],
            ["b", "B"],
            ["c", "C"],
          ]),
        ),
        part("distance", "c) AC távolság (m)", number("4", "m"), [
          [
            "10",
            "A és C is a nulla bal oldalán van. A köztük lévő utat keresd, ne a nullától mért távolságaik összegét.",
          ],
        ]),
      ),
      [
        "A sorrendhez és a távolsághoz külön vizsgálat kell.",
        "AC a −7-től −3-ig tartó út hossza.",
      ],
      steps(
        ["−7 < −3 < 5 → B a legnagyobb", "A B pont van legjobbra."],
        [
          "|−3| = 3; |5| = 5; |−7| = 7 → C a legtávolabbi",
          "A nullától mért távolságokat hasonlítjuk össze.",
        ],
        ["AC = −3 − (−7) = 4 m", "A két pont között négy egység van."],
      ),
      "Más ponthoz tartozhat a legnagyobb koordináta és a legnagyobb abszolút érték.",
      {
        kind: "transfer",
        reflection: reflect(
          "Miért nem ugyanaz a pont az a) és b) válasz?",
          "A sorrend a bal–jobb helyzetet követi.",
          "A nullától mért távolság mindkét irányban pozitív nagyság.",
        ),
      },
    ),
  ],
  recap: [
    "A számsorrend és a nullától mért távolság két külön dolog.",
    "A mínusz szerepe lehet előjel, kivonás vagy ellentettképzés.",
    "Kivonáskor a kivonandó ellentettjét adhatod hozzá.",
    "A szorzás előjelszabályát nem visszük át az összeadásra.",
    "A különböző számleírások jelölhetnek ugyanakkora értéket.",
    "A nulla sem pozitív, sem negatív; nullával nem osztunk.",
  ],
  glossary: [
    {
      term: "Előjel",
      definition: "A nem nulla szám nullához viszonyított oldalát jelöli.",
    },
    {
      term: "Ellentett",
      definition: "Az a szám, amely az eredetivel összeadva nullát ad.",
    },
    {
      term: "Abszolút érték",
      definition: "A szám pontjának nullától mért távolsága.",
    },
    {
      term: "Racionális szám",
      definition:
        "Két egész hányadosaként felírható szám, nem nulla nevezővel.",
    },
    {
      term: "Koordináta",
      definition:
        "A pont helyét megadó szám rögzített origó és egység mellett.",
    },
    {
      term: "Állapot és változás",
      definition:
        "Az állapot egy érték; a változás az új és a régi érték különbsége.",
    },
  ],
};

const muveletiSorrend: Lesson = {
  id: "muveleti-sorrend",
  moduleId: "M03",
  title: "Műveleti sorrend: olvasd a szerkezetet!",
  shortTitle: "Műveleti sorrend",
  question: "Miért adhat más eredményt ugyanaz a számsor más zárójelekkel?",
  teaser:
    "Válassz jogos következő lépést, és őrizd meg a teljes kifejezés jelentését.",
  description:
    "A sorrendi szabályok a kifejezés olvasását teszik egyértelművé. A műhelyben te választod a részszámítást, és a változatlan értékű teljes kifejezést követed.",
  goals: [
    "Felismered és megindokolod a következő elvégezhető részszámítást.",
    "Külön kezeled a csoportosítást, a hatványt, a szorzás–osztás és az összeadás–kivonás szintjét.",
    "Megkülönbözteted a negatív alap négyzetét a négyzet ellentettjétől.",
    "Több jogos, független kezdőlépést is észreveszel.",
    "Az egyenlőséglánc minden sorában megtartod az egész kifejezés értékét.",
    "Felismered a nullával osztáshoz vezető részszámítást.",
  ],
  prerequisites: [
    "Az alapműveletek és előjeles számok összeadása, szorzása.",
    "Egyszerű törtek; a² = a × a, a³ = a × a × a. Itt csak pozitív egész kitevőket használunk.",
  ],
  prerequisiteTopics: ["szamfogalom", "tortek"],
  coveredUnits: ["M03.03"],
  estimateMinutes: 45,
  color: "#f1c49a",
  layer: "ALAP",
  nextTopic: "aranyossag",
  prediction: exercise(
    "muveleti-sorrend",
    "prediction",
    "MS02-J01",
    "Mennyi 18 − 6 : 3? Előbb válassz kezdőlépést és indokold.",
    choice("b", [
      ["a", "4, mert először 18 − 6-ot számolok."],
      ["b", "16, mert először 6 : 3-at számolok."],
      ["c", "6, mert először 18 : 3-at számolok."],
    ]),
    [
      "Mely számokra vonatkozik az osztás jele?",
      "Az osztás magasabb szintű, mint a kivonás.",
    ],
    steps(
      [
        "18 − 6 : 3 = 18 − 2 = 16",
        "Először az eredetileg leírt osztást számoljuk ki.",
      ],
      [
        "(18 − 6) : 3 = 4",
        "Ez más kifejezés: az új zárójel változtatja meg a jelentést.",
      ],
    ),
    "A sorrend a feladat értelmezésének része.",
    {
      kind: "reason",
      difficulty: 1,
      reflection: reflect(
        "Miért a 6 és 3 között végzünk osztást?",
        "Az eredeti osztás ezekre a számokra vonatkozik.",
        "Nincs zárójel a 18 − 6 körül.",
      ),
      mistakes: [
        {
          input: "a",
          feedback:
            "Ez a (18 − 6) : 3 értéke lenne. Az eredeti kifejezésben az osztás következik előbb.",
        },
        {
          input: "c",
          feedback:
            "Az eredeti leírásban nem 18 : 3 szerepel. Jelöld meg az osztás tényleges két adatát.",
        },
      ],
    },
  ),
  explanation: [
    {
      heading: "A zárójel megváltoztathatja az utasítást",
      body: "A 2 + 3 × 4-ben a 3 × 4 egy részértékké áll össze, majd hozzáadunk kettőt. A (2 + 3) × 4-ben a teljes zárójel értékét szorozzuk. Ugyanazok a számok és jelek más szerkezetben más feladatot írnak le.",
      formula: "2 + 3 × 4 = 2 + 12 = 14; (2 + 3) × 4 = 5 × 4 = 20",
    },
    {
      heading: "A négy szint",
      body: "Előbb a szükséges csoportosított részeket olvassuk el; zárójelen belül is ugyanazok a szabályok érvényesek. A hatványozást a szorzás és osztás követi, majd az összeadás és kivonás. Ha valamely szint nem szerepel, kihagyjuk.",
      bullets: [
        "Zárójel: a legbelső szükséges rész értéke.",
        "Hatványozás: előbb pontosan azonosítsd az alapot.",
        "Szorzás és osztás: azonos rang, egy láncban balról jobbra.",
        "Összeadás és kivonás: azonos rang, egy láncban balról jobbra.",
        "A szögletes és kerek zárójel is csoportosít; alakjuk segít követni a belső és külső szinteket.",
      ],
    },
    {
      heading: "Azonos rang: nem mindig a szorzás az első",
      body: "A 24 : 6 × 2-ben az osztás és a szorzás azonos szinten van. A balról jobbra értelmezés miatt az osztás eredményét szorozzuk kettővel. Ha előbb 6 × 2-t számolnánk, új zárójelezést vezetnénk be. Hasonlóan az összeadás sem előzi meg automatikusan a kivonást.",
      formula: "24 : 6 × 2 = 4 × 2 = 8; 24 : (6 × 2) = 2",
      bullets: [
        "18 − 7 + 2 = 13, míg 18 − (7 + 2) = 9.",
        "Másik utat ismert műveleti tulajdonsággal választhatsz, ha indokolod az átalakítást.",
      ],
    },
    {
      heading: "Zárójel és törtvonal: ezt együtt kezeljük",
      body: "A 2 × [3 + (8 − 5)] kifejezésben előbb a belső különbséget, majd a külső összeget értelmezzük. A törtvonal is csoportosít: teljes számlálót osztunk teljes nevezővel. Egysoros jelölésnél mindkettőt zárójelezzük.",
      formula:
        "2 × [3 + (8 − 5)] = 2 × [3 + 3] = 12; (9 + 3)/(8 − 2) = 12/6 = 2",
      bullets: [
        "A 9 + 3/8 − 2 már más kifejezés.",
        "A (3/4) × (2/3) zárójelei egy-egy törtszám határát teszik egyértelművé.",
        "A műhely egy rész kiszámításakor a többi tagot változatlanul hagyja.",
      ],
    },
    {
      heading: "A hatvány teljes alapja számít",
      body: "A (−3)² alapja −3, ezért két negatív hármat szorzunk. A −3² a három négyzetének ellentettje. A 3² nem 3 × 2: a kitevő a tényezők számát jelöli.",
      formula: "(−3)² = (−3) × (−3) = 9; −3² = −(3 × 3) = −9",
      bullets: [
        "−2³ és (−2)³ is −8, de ez az egybeesés nem teszi mindig elhagyhatóvá a zárójelet.",
        "A négyzetes ellenpélda mutatja a különbséget.",
      ],
    },
    {
      heading: "Független részek: több jó kezdés is lehet",
      body: "Az 5 × 2 + 3 × 4 két szorzása nem egymás eredményével dolgozik, ezért bármelyik kezdhető először. Mindkét út végén 10 + 12 = 22. Ez különbözik a 24 : 6 × 2 lánctól, ahol a szorzás egyik tényezője a megelőző osztás eredménye.",
      formula: "5 × 2 + 3 × 4 = 10 + 3 × 4 = 10 + 12 = 22",
    },
    {
      heading: "Az egyenlőségjel ígéret",
      body: "Minden egyenlőségjel két oldalán azonos értékű teljes kifejezés álljon. A 2 + 3 × 4 = 3 × 4 = 12 + 2 = 14 hibás lánc: az első egyenlőségben eltűnik a +2. A jó végérték nem teszi helyessé a közbülső hamis egyenlőséget.",
      formula: "Helyesen: 2 + 3 × 4 = 2 + 12 = 14",
      bullets: [
        "Jelöld a következő műveletet.",
        "Számold ki a részértéket.",
        "Csak ezt a részt cseréld ki; a többit írd tovább.",
      ],
    },
    {
      heading: "A sorrend néha az értelmezhetetlenséget tárja fel",
      body: "A 10/(4 − 4) nevezője 0. Nincs olyan hányados, amelyet nullával szorozva 10-et kapnánk, ezért megállunk. Nem írunk helyére sem nullát, sem végtelent.",
      formula: "10/(4 − 4) = 10/0: nincs értelmezve",
    },
    {
      heading: "Öt téves szabály ellenpróbája",
      body: "A hibakeresésnél nevezd meg a megváltoztatott részszámítást. A következő állítások általános szabályként nem igazak.",
      bullets: [
        "„Mindig az egész sort balról jobbra.” Ellenpróba: 2 + 3 × 4 = 14, nem 20.",
        "„A szorzás mindig megelőzi az osztást.” 24 : 6 × 2 = 8, nem 2.",
        "„Az összeadás mindig megelőzi a kivonást.” 18 − 7 + 2 = 13, nem 9.",
        "„−3² és (−3)² ugyanaz.” Az első −9, a második 9.",
        "„A zárójel bármikor kitörölhető.” 2 × (3 + 4) = 14, de 2 × 3 + 4 = 10. Jogosan: 2 × 3 + 2 × 4 = 14.",
      ],
    },
  ],
  examples: [
    {
      title: "MS02-P01 — Két magasabb szintű művelet",
      prompt: "Számítsd ki: 30 − 18 : 3 + 2 × 4.",
      steps: steps(
        [
          "30 − 18 : 3 + 2 × 4 = 30 − 6 + 2 × 4",
          "Az osztás az összeadásnál és kivonásnál magasabb szintű.",
        ],
        [
          "30 − 6 + 2 × 4 = 30 − 6 + 8",
          "A másik magasabb szintű rész a szorzás.",
        ],
        [
          "30 − 6 + 8 = 24 + 8 = 32",
          "Azonos rangú láncban balról jobbra haladunk.",
        ],
      ),
      alternative: steps(
        ["30 − 18 : 3 + 8", "A független szorzással is kezdhetünk."],
        [
          "30 + (−6 + 8) = 30 + 2 = 32",
          "Kivonás helyett az ellentett hozzáadása után csoportosítunk.",
        ],
      ),
      check:
        "30-ból 6-ot veszünk el, majd 8-at adunk hozzá: összesen 2-vel nő.",
    },
    {
      title: "MS02-P02 — Zárójel, negatív alap, hatvány",
      prompt: "Számítsd ki: 4 × (−2)² − [10 − (6 − 3)].",
      steps: steps(
        ["4 × (−2)² − [10 − 3]", "A belső 6 − 3 különbség értéke 3."],
        ["4 × (−2)² − 7", "A szögletes zárójel teljes értéke 7."],
        ["4 × 4 − 7", "A hatvány alapja −2; (−2) × (−2) = 4."],
        ["16 − 7 = 9", "A szorzás után a kivonás következik."],
      ),
      alternative: steps(
        [
          "4 × 4 − [10 − (6 − 3)]",
          "A hatvány független a szögletes zárójeltől, ezért ezzel is kezdhetünk.",
        ],
        [
          "16 − [10 − 3] = 16 − 7 = 9",
          "A zárójel belsejében továbbra is megtartjuk a szerkezetet.",
        ],
      ),
      check:
        "9 + 7 = 16. A −23 más feladathoz tartozna: ha a negatív előjel nem része a hatvány alapjának.",
    },
  ],
  practice: [
    exercise(
      "muveleti-sorrend",
      "practice-1",
      "MS02-G01",
      "A 7 + 5 × 3 kifejezésben melyik részszámítással szabad kezdeni, és mennyi a végeredmény?",
      parts(
        part(
          "first",
          "Kezdőlépés",
          choice("multiply", [
            ["add", "7 + 5"],
            ["multiply", "5 × 3"],
          ]),
          [
            [
              "add",
              "Ehhez (7 + 5) zárójel kellene. Az eredeti kifejezésben előbb szorzunk.",
            ],
          ],
        ),
        part("value", "Az egész kifejezés értéke", number("22"), [
          ["36", "Ez a (7 + 5) × 3 értéke. Az eredetiben a 7 külön tag marad."],
        ]),
      ),
      [
        "Van-e zárójel, amely az összeadást egy egységként kezelteti?",
        "Zárójel nincs; a szorzás magasabb rangú.",
      ],
      steps(
        ["5 × 3 = 15", "Ez a jogos kezdő részszámítás."],
        [
          "7 + 5 × 3 = 7 + 15 = 22",
          "A teljes kifejezésben csak a szorzatot cseréljük ki.",
        ],
      ),
      "Az eredmény mellett a jogos kezdőlépést is tudd megnevezni.",
      { difficulty: 1 },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-2",
      "MS02-G02",
      "Számítsd ki: a) 36 : 6 × 3; b) 24 : 3 : 2; c) 12 × 3 : 6.",
      parts(
        part("a", "a) eredmény", number("18"), [
          [
            "2",
            "A szorzás nem előzi meg az osztást. Előbb 36 : 6, aztán szorzás 3-mal.",
          ],
        ]),
        part("b", "b) eredmény", number("4"), [
          [
            "16",
            "Ez a 24 : (3 : 2) értéke lenne. Az eredeti lánc balról jobbra olvasandó.",
          ],
        ]),
        part("c", "c) eredmény", number("6")),
      ),
      [
        "Csak szorzás és osztás szerepel: azonos rangúak.",
        "Az első lépések: 36 : 6; 24 : 3; 12 × 3.",
      ],
      steps(
        ["36 : 6 × 3 = 6 × 3 = 18", "Balról jobbra értelmezzük a láncot."],
        ["24 : 3 : 2 = 8 : 2 = 4", "Az első hányadost osztjuk kettővel."],
        ["12 × 3 : 6 = 36 : 6 = 6", "Az első szorzatot osztjuk hattal."],
      ),
      "A szorzás és az osztás azonos szint.",
    ),
    exercise(
      "muveleti-sorrend",
      "practice-3",
      "MS02-G03",
      "Számítsd ki mindkettőt, majd magyarázd meg a különbséget: a) 20 − 8 + 3; b) 20 − (8 + 3).",
      parts(
        part("a", "a) érték", number("15"), [
          [
            "9",
            "Az eredeti a) esetben a +3 hozzáadás. Nem tartozik a kivonandóhoz.",
          ],
        ]),
        part("b", "b) érték", number("9")),
        part("difference", "Mennyivel nagyobb az a) eredmény?", number("6")),
      ),
      [
        "Az a) azonos rangú lánc; a b) előbb a teljes zárójelet kéri.",
        "a)-ban hozzáadunk 3-at, b)-ben a 3 is a kivonandó része.",
      ],
      steps(
        ["20 − 8 + 3 = 12 + 3 = 15", "A kivonás után hozzáadunk."],
        ["20 − (8 + 3) = 20 − 11 = 9", "A teljes összeget vonjuk ki."],
        ["15 − 9 = 6", "A +3 és −3 hatása között hat egység van."],
      ),
      "A zárójel határolja, mire vonatkozik a kivonás.",
      {
        reflection: reflect(
          "Miért hat a két változatban eltérően a 3?",
          "Az a)-ban +3-at adunk hozzá.",
          "A b)-ben a 3 is része a kivont összegnek.",
        ),
      },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-4",
      "MS02-G04",
      "Számítsd ki: 42 − 24 : 6 + 3 × 5. Írd be a két különböző jogos kezdő részszámítást, majd az eredményt. Az egyik mező az osztást, a másik a szorzást kéri.",
      parts(
        part(
          "division",
          "Az osztást tartalmazó kezdő részszámítás",
          expression(["24:6", "24/6", "(24:6)", "(24/6)"], "például 18:3"),
          [["42-24", "Ez a kivonás nem kezdhető az osztás előtt."]],
        ),
        part(
          "multiplication",
          "A szorzást tartalmazó kezdő részszámítás",
          expression(["3*5", "(3*5)"], "például 2*4"),
        ),
        part("value", "Az egész kifejezés értéke", number("53")),
      ),
      [
        "Keresd az összeadásnál és kivonásnál magasabb szintű részeket.",
        "A 24 : 6 és a 3 × 5 egymástól független.",
      ],
      steps(
        [
          "24 : 6 = 4 vagy 3 × 5 = 15 lehet az első",
          "A két művelet nem egymás eredményével dolgozik.",
        ],
        [
          "42 − 4 + 15 = 38 + 15 = 53",
          "A független részek után az azonos rangú láncot számoljuk.",
        ],
      ),
      "Egy helyes megoldásnak több kezdősorrendje is lehet.",
      {
        kind: "reason",
        reflection: reflect(
          "Miért nem hiba a szorzással kezdeni?",
          "A 3 × 5 nem a 24 : 6 eredményével dolgozik.",
          "Mindkét sorrend ugyanahhoz a 42 − 4 + 15 kifejezéshez vezet.",
        ),
      },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-5",
      "MS02-G05",
      "Számítsd ki: 3 × [8 − (5 − 2)]. Írd tovább a teljes kifejezést minden lépésben.",
      number("15"),
      [
        "A legbelső szükséges zárójel értékét keresd.",
        "Az 5 − 2 értéke 3; a szögletes zárójelben 8 − 3 marad.",
      ],
      steps(
        [
          "3 × [8 − (5 − 2)] = 3 × [8 − 3]",
          "A belső különbséget cseréltük a részértékére.",
        ],
        [
          "3 × [8 − 3] = 3 × 5 = 15",
          "A külső szorzás a teljes zárójelre vonatkozik.",
        ],
      ),
      "A belső zárójel nem törölhető ki a kivonandó értelmének megváltoztatása nélkül.",
      {
        mistakes: [
          {
            input: "3",
            feedback:
              "Ez a 3 × (8 − 5 − 2) eredménye. Az eredetiben 5 − 2 együtt a kivonandó.",
          },
        ],
      },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-6",
      "MS02-G06",
      "Legyen A = −5² és B = (−5)². Mennyi A, B és A + B?",
      parts(
        part("a", "A = −5²", number("-25", undefined, "A"), [
          [
            "25",
            "A mínusz az alapot határoló zárójelen kívül áll: a 25 ellentettjét keressük.",
          ],
        ]),
        part("b", "B = (−5)²", number("25", undefined, "B"), [
          [
            "-25",
            "A zárójel miatt a teljes −5 az alap: két negatív számot szorzunk.",
          ],
        ]),
        part("sum", "A + B", number("0")),
      ),
      [
        "Része-e a negatív előjel a hatvány alapjának?",
        "A esetében a 25 ellentettjét; B esetében két −5 szorzatát vesszük.",
      ],
      steps(
        ["A = −(5 × 5) = −25", "A négyzet előtt álló mínusz ellentettképzés."],
        ["B = (−5) × (−5) = 25", "A hatvány teljes alapja negatív."],
        ["A + B = −25 + 25 = 0", "Ellentett számokat adunk össze."],
      ),
      "A hatványalap határát a zárójel rögzíti.",
    ),
    exercise(
      "muveleti-sorrend",
      "practice-7",
      "MS02-G07",
      "Számítsd ki: a) 1,5 + 0,8 × 5; b) (1,5 + 0,8) × 5. Mennyivel nagyobb a b) eredmény?",
      parts(
        part("a", "a) eredmény", number("5.5")),
        part("b", "b) eredmény", number("11.5")),
        part("difference", "b) − a)", number("6")),
      ),
      [
        "A tizedestörtek nem változtatnak a műveleti szinteken.",
        "a)-ban 0,8 × 5, b)-ben 1,5 + 0,8 az első részszámítás.",
      ],
      steps(
        ["1,5 + 0,8 × 5 = 1,5 + 4 = 5,5", "A szorzatot az 1,5-höz adjuk."],
        ["(1,5 + 0,8) × 5 = 2,3 × 5 = 11,5", "A teljes összeget ötszörözzük."],
        [
          "11,5 − 5,5 = 6",
          "b)-ben az 1,5 is ötször szerepel, a)-ban csak egyszer.",
        ],
      ),
      "A zárójel megmondja, melyik mennyiséget szorozzuk.",
      {
        reflection: reflect(
          "Miért szerepel az 1,5 a b)-ben ötször?",
          "A teljes összeget szorozzuk 5-tel, ezért mindkét tagra hat a szorzó.",
        ),
      },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-8",
      "MS02-G08",
      "Számítsd ki: (1/2) + (3/4) × (2/3).",
      number("1"),
      [
        "A zárójelek egy-egy törtszámot határolnak; előbb a két tört szorzata következik.",
        "(3/4) × (2/3) = (3 × 2)/(4 × 3); egyszerűsítsd ezt a törtet.",
      ],
      steps(
        ["(3/4) × (2/3) = 6/12 = 1/2", "A háromnegyed kétharmada fél egész."],
        ["1/2 + 1/2 = 1", "Ehhez adjuk hozzá az eredeti fél egészet."],
      ),
      "A törtalak nem változtatja meg a műveleti sorrendet.",
      {
        mistakes: [
          {
            input: "5/6",
            feedback:
              "Ez az (1/2 + 3/4) × 2/3 eredménye. Az eredetiben előbb a két utolsó tört szorzatát keressük.",
          },
        ],
      },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-9",
      "MS02-G09",
      "Hibás megoldás: 28 − 12 : 4 = 16 : 4 = 4. Melyik az első hibás egyenlőség? Add meg a jogos első részértéket és a helyes végeredményt, majd írd le a helyes láncot saját szavaiddal.",
      parts(
        part(
          "error",
          "Első hibás egyenlőség",
          choice("first", [
            ["first", "28 − 12 : 4 = 16 : 4"],
            ["second", "16 : 4 = 4"],
            ["none", "Mindkettő helyes."],
          ]),
        ),
        part("quotient", "12 : 4 értéke", number("3")),
        part("value", "Az eredeti kifejezés értéke", number("25"), [
          [
            "4",
            "Ez más zárójelezés eredménye. A 28 külön tagként marad, amíg a 12 : 4-et kiszámolod.",
          ],
        ]),
      ),
      [
        "Minden egyenlőségjel két oldalán azonos értéknek kell állnia.",
        "Előbb 12 : 4-et határozd meg; a 28-at írd tovább.",
      ],
      steps(
        [
          "Az első egyenlőség hibás",
          "A 28 − 12 kiszámítása jogosulatlanul megelőzte az osztást.",
        ],
        [
          "28 − 12 : 4 = 28 − 3 = 25",
          "A teljes kifejezés minden sorban ugyanazt az értéket őrzi.",
        ],
        [
          "(28 − 12) : 4 = 4",
          "A hibás megoldás valójában ezt a másik feladatot számolta.",
        ],
      ),
      "A hibás átcsoportosítást kell javítani, nem az egyébként jól számolt osztást.",
      {
        kind: "reason",
        reflection: reflect(
          "Írd le a helyes egyenlőségláncot és az első hiba okát.",
          "28 − 12 : 4 = 28 − 3 = 25.",
          "Az osztás előtti kivonás új, nem megadott csoportosítás.",
        ),
      },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-10",
      "MS02-G10",
      "A 8 − 2 × 3 leírásba tegyél egy pár zárójelet úgy, hogy a) 18; b) 2 legyen az érték. Tartsd meg a számok és műveleti jelek sorrendjét; a mezőkbe a teljes zárójeles kifejezést írd, egyenlőségjel nélkül.",
      parts(
        part(
          "eighteen",
          "a) Kifejezés, amelynek értéke 18",
          expression(["(8-2)*3"], "például (9-3)*2"),
          [
            [
              "8-(2*3)",
              "Ez 8 − 6 = 2. A 18-hoz a kivonást kell a szorzás elé helyezni.",
            ],
          ],
        ),
        part(
          "two",
          "b) Kifejezés, amelynek értéke 2",
          expression(
            ["8-(2*3)", "(8-2*3)", "(8)-2*3", "8-(2)*3", "8-2*(3)"],
            "például 9-(3*2)",
          ),
          [
            [
              "(8-2)*3",
              "Ez a teljes különbséget szorozza hárommal, így 18-at ad.",
            ],
          ],
        ),
      ),
      [
        "Melyik részértéket kell a másik művelet előtt meghatározni?",
        "A 18-hoz 6 × 3, a 2-höz 8 − 6 alak vezet.",
      ],
      steps(
        ["(8 − 2) × 3 = 6 × 3 = 18", "A zárójel új sorrendet ír elő."],
        [
          "8 − (2 × 3) = 8 − 6 = 2",
          "A zárójel itt az eredeti sorrendet teszi láthatóvá.",
        ],
      ),
      "A zárójel helyével a művelet hatókörét jelölöd.",
      {
        kind: "reason",
        difficulty: 3,
        reflection: reflect(
          "Melyik zárójelezés változtat az eredeti értéken?",
          "Az (8 − 2) × 3 új csoportosítást ír elő.",
          "A 8 − (2 × 3) az eredeti műveleti sorrendet teszi láthatóvá.",
        ),
      },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-11",
      "MS02-G11",
      "Elvégezhető-e (15 − 3) : (7 − 7)? Számold ki a zárójelek értékét, majd mondd meg, helyes volna-e 0-t írni végeredményként.",
      parts(
        part("numerator", "Az osztandó zárójel értéke", number("12")),
        part("denominator", "Az osztó zárójel értéke", number("0")),
        part(
          "defined",
          "A teljes kifejezés",
          choice("undefined", [
            ["undefined", "Nincs értelmezve."],
            ["zero", "Értéke 0."],
            ["twelve", "Értéke 12."],
          ]),
          [
            [
              "zero",
              "A 0 × 0 nem adja vissza a 12-t. Nullával osztásnak nem adunk 0 értéket.",
            ],
          ],
        ),
      ),
      [
        "Előbb a két zárójelet számold ki külön.",
        "A további művelet 12 : 0 volna. Létezik-e olyan szám, amellyel 0-t szorozva 12-t kapunk?",
      ],
      steps(
        [
          "15 − 3 = 12; 7 − 7 = 0",
          "A két csoportosított rész külön értékelhető.",
        ],
        ["12 : 0 nincs értelmezve", "A 0 × q = 12 egyenlőség lehetetlen."],
        ["A 0 sem megoldás", "0 × 0 = 0, nem 12."],
      ),
      "A helyes sorrend néha azt mutatja meg, hogy nem létezik számeredmény.",
      {
        kind: "reason",
        reflection: reflect(
          "Miért nem írható 0 a nullával osztás helyére?",
          "A visszaszorzás nem adná vissza az osztandó 12-t.",
        ),
      },
    ),
    exercise(
      "muveleti-sorrend",
      "practice-12",
      "MS02-G12",
      "Három füzetet veszel, darabja 450 Ft. Egyetlen 200 Ft-os szállítás és egyetlen 150 Ft-os kedvezmény tartozik az egész rendeléshez; más tétel nincs. Írd fel a ki nem számított modellkifejezést a szöveg sorrendjében (füzetek + szállítás − kedvezmény), és add meg a fizetendő összeget. Miért más a 3 × (450 + 200 − 150)?",
      parts(
        part(
          "model",
          "A szöveg sorrendjét követő modell",
          expression(
            [
              "3*450+200-150",
              "(3*450)+200-150",
              "3*450+(200-150)",
              "(3*450+200)-150",
              "3*(450)+200-150",
              "3*450+200-(150)",
            ],
            "például 2*300+100-50",
          ),
        ),
        part("cost", "Fizetendő összeg (Ft)", number("1400", "Ft"), [
          [
            "1500",
            "Ez háromszor számolhatja a szállítást és a kedvezményt. Melyik tétel ismétlődik ténylegesen?",
          ],
        ]),
      ),
      [
        "Válaszd külön a háromszor ismétlődő és az egyszeri tételeket.",
        "Csak a füzet ára tartozik a hármas szorzóhoz.",
      ],
      steps(
        ["3 × 450 = 1350 Ft", "A három azonos füzet ára háromszor ismétlődik."],
        [
          "3 × 450 + 200 − 150 = 1350 + 200 − 150 = 1400 Ft",
          "A két rendelési tételt csak egyszer vesszük.",
        ],
        [
          "3 × (450 + 200 − 150) = 1500 Ft",
          "Ez háromszoros szállítást és kedvezményt modellezne, tehát más történetet.",
        ],
      ),
      "A szorzóhoz csak a ténylegesen ismétlődő tételek tartozzanak.",
      {
        kind: "transfer",
        reflection: reflect(
          "Miért nem írja le a vásárlást a 3 × (450 + 200 − 150)?",
          "A szállítás és a kedvezmény az egész rendeléshez egyszer tartozik.",
          "A zárójelbe téve a 3 mindkettőt megszorozná.",
        ),
      },
    ),
  ],
  exit: [
    exercise(
      "muveleti-sorrend",
      "exit-1",
      "MS02-Z01",
      "Számítsd ki: 32 − 3 × (5 − 1) + 18 : 6. Írd be az egymástól független két kezdő részszámítást: az egyik zárójeles, a másik osztás. Majd add meg az eredményt.",
      parts(
        part(
          "bracket",
          "Zárójeles kezdő részszámítás",
          expression(["5-1", "(5-1)"], "például 8-2"),
        ),
        part(
          "division",
          "Független osztás",
          expression(["18:6", "18/6", "(18:6)", "(18/6)"], "például 12:3"),
        ),
        part("value", "Az egész kifejezés értéke", number("23")),
      ),
      [
        "A szorzás csak a zárójel értéke után végezhető el; a másik tag osztása ettől független.",
        "5 − 1 = 4; 18 : 6 = 3.",
      ],
      steps(
        [
          "5 − 1 = 4 vagy 18 : 6 = 3 lehet az első",
          "A két rész nem függ egymás értékétől.",
        ],
        [
          "32 − 3 × 4 + 3 = 32 − 12 + 3",
          "A zárójel után elvégezhetjük a szorzást.",
        ],
        [
          "32 − 12 + 3 = 20 + 3 = 23",
          "A teljes kifejezésben azonos rangú műveletek maradnak.",
        ],
      ),
      "A jogos sorrendet a részszámítások függése határozza meg.",
      {
        reflection: reflect(
          "Miért nem kezdhető rögtön a 3 × 5 szorzás?",
          "A 3 a teljes (5 − 1) kifejezést szorozza, nem csak az 5-öt.",
        ),
      },
    ),
    exercise(
      "muveleti-sorrend",
      "exit-2",
      "MS02-Z02",
      "Számítsd ki: −2² + (−2)² + 12 : (7 − 4). Add meg külön a két első tagot és a teljes eredményt. Indokold, miért nem két azonos pozitív négyzetet adunk össze.",
      parts(
        part("first", "Első tag: −2²", number("-4"), [
          ["4", "Az első tagban a mínusz a négyzeten kívül áll."],
        ]),
        part("second", "Második tag: (−2)²", number("4")),
        part("value", "A teljes eredmény", number("4"), [
          ["12", "Ez akkor jönne ki, ha a −2²-t tévesen +4-nek vennénk."],
        ]),
      ),
      [
        "Pontosan jelöld ki a két hatvány alapját.",
        "Az első tag −(2 × 2), a második (−2) × (−2).",
      ],
      steps(
        [
          "−2² = −4; (−2)² = 4",
          "Az elsőben ellentettképzés, a másodikban negatív hatványalap szerepel.",
        ],
        ["7 − 4 = 3; 12 : 3 = 4", "Az osztó a teljes zárójel értéke."],
        ["−4 + 4 + 4 = 4", "Az első két tag kioltja egymást."],
      ),
      "Az azonos számjegyek nem jelentenek azonos kifejezést.",
      {
        reflection: reflect(
          "Írd ki szorzással a két hatványt, az előjelekkel együtt.",
          "−2² = −(2 × 2).",
          "(−2)² = (−2) × (−2).",
        ),
      },
    ),
  ],
  recap: [
    "Először a szerkezetet olvasd: zárójel, alap, számláló és nevező.",
    "Szorzás–osztás és összeadás–kivonás külön-külön azonos rangú.",
    "Részszámítás után a többi tag változatlan marad.",
    "Független részeknél több helyes kezdés lehet.",
    "Hatványozásnál külön olvasd az előjel és a zárójel szerepét.",
    "Nullával osztást nem helyettesítünk számmal.",
    "Minden egyenlőségjel két oldalán azonos érték álljon.",
  ],
  glossary: [
    {
      term: "Kifejezés",
      definition:
        "Számokból, műveletekből és csoportosító jelekből álló matematikai leírás.",
    },
    {
      term: "Részérték",
      definition:
        "Egy kifejezés kijelölt, önállóan kiszámított részének értéke.",
    },
    {
      term: "Azonos rangú műveletek",
      definition:
        "Azonos sorrendi szinten állnak; egy láncban balról jobbra értelmezzük őket.",
    },
    {
      term: "Hatványalap",
      definition:
        "Az a teljes szám vagy csoportosított kifejezés, amelyet a kitevőre emelünk.",
    },
    {
      term: "Kitevő",
      definition:
        "Itt pozitív egész: az egymással összeszorzott azonos tényezők száma.",
    },
    {
      term: "Egyenlőséglánc",
      definition:
        "Azonos értékű teljes kifejezések sorozata egyenlőségjelekkel összekötve.",
    },
  ],
};

const proportionality = (correct: string) =>
  choice(correct, [
    ["direct", "Egyenes arányosság"],
    ["inverse", "Fordított arányosság"],
    ["neither", "Egyik sem"],
    ["insufficient", "A feltételek/adatok önmagukban nem elegendők"],
  ]);
const workConditions =
  "Azonos, állandó ütem; ugyanaz a teljes munka szabadon felosztható; mindenki egyszerre dolgozik, nincs közös várakozás, akadályozás vagy külön előkészítési idő.";

const aranyossag: Lesson = {
  id: "aranyossag",
  moduleId: "M05",
  title: "Arányosság: mi marad ugyanaz?",
  shortTitle: "Arányosság",
  question:
    "Az állandó hányados, az állandó szorzat vagy egy másik szabály írja le a helyzetet?",
  teaser:
    "Kapcsold össze a történetet, az adatpárokat és a grafikont; keresd a feltételeket is.",
  description:
    "Egységárból, közös munkából és alapdíjas ellenpéldából értjük meg az arányosságot. A jó modellhez a számadatok mellett a helyzet feltételeit is megvizsgáljuk.",
  goals: [
    "Megmagyarázod, miért őrzi meg az arányt a közös pozitív szorzás.",
    "Elkülöníted az állandó hányadost az állandó különbségtől.",
    "Feltételekkel együtt felismered az egyenes és fordított arányosságot.",
    "Egységre visszavezetéssel, táblázattal, hányadossal vagy szorzattal ellenőrzöl.",
    "Megkülönbözteted a rész–rész és a rész–egész arányt.",
    "Észreveszed, ha egyetlen adatpárból nem választható biztosan modell.",
  ],
  prerequisites: [
    "Szorzás, osztás, egyszerű törtek és tizedes számok.",
    "A hossz és idő alapegységei; a szövegben szereplő mennyiség megnevezése.",
  ],
  prerequisiteTopics: ["tortek", "muveleti-sorrend"],
  coveredUnits: ["M05.01", "M05.02", "M05.03", "M05.04", "M05.05", "M05.06"],
  estimateMinutes: 50,
  color: "#c2d3a1",
  layer: "ALAP",
  nextTopic: "mertekegysegek",
  prediction: exercise(
    "aranyossag",
    "prediction",
    "A–J01–04",
    "Jósolj négy külön helyzetben. 1) Alapdíj és kedvezmény nélkül kétszeres zsinórhossz. 2) Ugyanannyi szabadon felosztható munka, kétszer annyi azonos ütemű segítő, várakozás nélkül. 3) 500 Ft alapdíj + 200 Ft/km mellett kétszeres távolság. 4) Egy téglalap mindkét oldalát kétszerezzük.",
    parts(
      part("rope", "1) Az ár a korábbi hányszorosa?", number("2")),
      part("time", "2) Az idő a korábbi hányszorosa?", number("1/2"), [
        [
          "2",
          "Azonos munka több segítő között oszlik el: a létszám és az idő szorzata marad állandó.",
        ],
      ]),
      part("fee", "3) Biztosan kétszeres a teljes díj?", yesNo(false), [
        [
          "yes",
          "Az alapdíjat mindkét útnál egyszer fizetjük. 2 km és 4 km díjával ellenőrizd.",
        ],
      ]),
      part("area", "4) A terület a korábbi hányszorosa?", number("4"), [
        ["2", "Mindkét irányban kétszer annyi területegység fér el: 2 × 2."],
      ]),
    ),
    [
      "Mi ismétlődik változatlanul, és melyik mennyiség rögzített?",
      "Az egységár a hányadost, a teljes munka a szorzatot tartja állandóan; a terület két irányban nő.",
    ],
    steps(
      [
        "Ár: kétszeres; idő: feleannyi",
        "Az elsőnél ugyanannyi jut egy méterre, a másodiknál ugyanaz a munka oszlik kettőször annyi részre.",
      ],
      ["2 km: 900 Ft; 4 km: 1300 Ft", "A teljes díj nem kétszereződik."],
      ["Terület: 2 × 2 = 4-szeres", "Mindkét hosszméret megkétszereződött."],
    ),
    "A „kétszer annyi” hatása a kapcsolattól és a feltételektől függ.",
    {
      kind: "reason",
      reflection: reflect(
        "Válassz egy jóslatot, és nevezd meg a döntő feltételt.",
        "Egységárnál nincs alapdíj vagy kedvezmény.",
        "A munkamodellhez azonos ütem és felosztható teljes munka kell.",
        "A terület két irány méretét szorozza össze.",
      ),
    },
  ),
  explanation: [
    {
      heading: "Az arány nem ugyanaz, mint a különbség",
      body: "A 2 kék és 6 fehér gyöngyből álló keverékben minden kékre 3 fehér jut. A 4 kék és 12 fehér ugyanilyen keverék: mindkét mennyiség kétszeres. A 3 kék és 7 fehér viszont más arány, noha a darabszámok különbsége ugyanúgy 4.",
      formula: "2 : 6 = 4 : 12 = 1 : 3; 3 : 7 ≠ 1 : 3",
      bullets: [
        "Közös pozitív szorzás megőrzi az arányt: (2 × 2)/(6 × 2) = 2/6.",
        "Azonos hozzáadás általában a különbséget őrzi, nem az arányt.",
      ],
    },
    {
      heading: "Sorrend és egység",
      body: "Előbb mondd meg, melyik mennyiséget melyikhez viszonyítod: kék : fehér és fehér : kék más arány. Azonos fajtájú mennyiséget azonos egységre váltunk. Különböző mennyiségek hányadosához új egység tartozik.",
      formula:
        "2 m : 50 cm = 200 cm : 50 cm = 4 : 1; 900 Ft : 2,5 m = 360 Ft/m",
      bullets: [
        "Ebben a leckében nemnegatív, fordított arányosságnál pozitív mennyiségekkel dolgozunk.",
        "A darabszámok egész számok; a számított törtrész nem mindig megengedett létszám.",
      ],
    },
    {
      heading: "Egyenes arányosság: állandó hányados",
      body: "A zsinór métere 400 Ft, nincs alapdíj vagy kedvezmény. Így 1 m 400 Ft, 1,5 m 600 Ft, 3 m 1200 Ft. Minden pozitív hossznál ugyanannyi pénz jut egy méterre. Ha a hossz egy pozitív tényezővel változik, az ár is ugyanannyiszoros.",
      formula: "y/x = k; y = kx; itt k = 400 Ft/m",
      bullets: [
        "A nulla hosszhoz itt nulla ár tartozik, de 0/0 hányadost nem számítunk.",
        "A „mindkettő nő” megfigyelés önmagában nem bizonyít egyenes arányosságot.",
      ],
    },
    {
      heading: "Alapdíj: egyenes grafikon, de nem egyenes arányosság",
      body: "Az 500 Ft alapdíj + 200 Ft/km modellben 2 km teljes díja 900 Ft, 4 km-é 1300 Ft. A távolság kétszereződött, a díj nem. A pozitív adatpárok hányadosa 450 és 325 Ft/km; nem állandó. Az alapdíjon felüli rész viszont minden kilométernél 200 Ft-tal változik.",
      formula: "y = 500 + 200x; y − 500 = 200x",
      bullets: [
        "A grafikon egyenes, de nem az origón halad át.",
        "Az állandó növekmény nem ugyanaz, mint az állandó hányados.",
      ],
    },
    {
      heading: "Fordított arányosság: állandó szorzat",
      body: "Egy munka összesen 24 segítőóra. Egy segítő 24 órát, 3 segítő fejenként 8 órát, 6 segítő 4 órát, 8 segítő 3 órát dolgozik. A létszám és az idő szorzata ugyanaz. Másfélszeres létszámhoz az időt másféllel osztjuk.",
      formula: "n × t = W; t = W/n; itt W = 24 segítőóra",
      bullets: [
        workConditions,
        "A segítők száma pozitív egész. Nulla segítőhöz nem rendelünk véges elkészülési időt.",
        "5 segítőnél 24/5 óra = 4,8 óra: az idő lehet tört, a létszám nem.",
      ],
    },
    {
      heading: "A csökkenés önmagában kevés",
      body: "Egy 60 oldalas szövegből óránként 10 oldal fogy. 1, 2, 3 óra után 50, 40, 30 oldal marad. Az idő és a hátralévő oldalak szorzatai 50, 80, 90: nem állandók. Ez állandó különbségű csökkenés, nem fordított arányosság.",
      formula: "Hátralévő oldal = 60 − 10 × eltelt óra; 0 ≤ idő ≤ 6",
      bullets: [
        "A szöveg elfogyása után nem keletkezik negatív oldalszám.",
        "„Az egyik nő, a másik csökken” nem elég a modell azonosításához.",
      ],
    },
    {
      heading: "Modellválasztás öt kérdéssel",
      body: "Nevezd meg a két mennyiséget és egységüket; rögzítsd, mit tartunk változatlannak; jósolj az eredményre; vizsgáld a hányadost vagy szorzatot; majd ellenőrizz az eredeti történetben.",
      bullets: [
        "Egyetlen adatpár nem igazol arányosságot.",
        "Több egyező hányados vagy szorzat hasznos ellenőrzés, de a teljes tartományra érvényes modellhez feltételek is kellenek.",
        "Az egységre visszavezetés megmutatja az állandót, de egy könnyebb közös lépték is használható.",
      ],
    },
    {
      heading: "Arány szerinti felosztás",
      body: "A 3 : 5 arány két rész egymáshoz viszonyított nagysága. Együtt 8 egyenlő arányrészt alkotnak. Ha a teljes összeget osztjuk fel, az első rész az egész 3/8-a, a második 5/8-a. A 3/5 az első résznek a másodikhoz viszonyított aránya.",
      formula: "1600 : 8 = 200; 3 × 200 = 600; 5 × 200 = 1000",
      bullets: [
        "Ellenőrizd az összeget is: 600 + 1000 = 1600.",
        "Ellenőrizd az arányt is: 600 : 1000 = 3 : 5.",
      ],
    },
    {
      heading: "Méretarány és kétirányú nagyítás",
      body: "Az 1 : 25 000 térképi méretarány azonos hosszúságegységben értendő: 1 cm a rajzon 25 000 cm a valóságban. Minden irányú kétszeres nagyításkor a kerület kétszeres, a terület négyszeres. Két külön irány szorzódik, ezért a terület nem a hossz nagyítási tényezőjével arányos.",
      formula: "1 térképi cm = 250 valós m; területi tényező = 2 × 2 = 4",
      bullets: [
        "A térképi egyenes szakasz nem feltétlenül egy kanyargó útvonal hossza.",
        "A tervrajz ugyanezt az azonos egységű hosszarányt használja; például 1 : 50 esetén 4 cm 2 m-nek felel meg.",
      ],
    },
    {
      heading: "Öt hibaminta helyett öt vizsgálat",
      body: "Egy rossz végeredményből nem állapítjuk meg biztosan a tévképzetet. Nézd meg, melyik állításra épült a megoldásod.",
      bullets: [
        "„Ugyanannyit adtam hozzá, ezért ugyanaz az arány.” Ellenpróba: 2 : 6 és 3 : 7.",
        "„Mindkettő nő, tehát egyenes.” Vizsgáld az alapdíjas út hányadosait.",
        "„Egyik csökken, tehát fordított.” Vizsgáld a hátralévő oldalak szorzatait.",
        "„Több ember mindig arányosan gyorsabb.” Kérdezz rá a várakozásra, feloszthatóságra és munkaütemre.",
        "„3 : 5 esetén az első rész az egész 3/5-e.” Az egész 8 arányrészből áll.",
      ],
    },
  ],
  examples: [
    {
      title: "A–P1 — Egy méterből gondolkodva",
      prompt:
        "2,5 m dekorzsinór 900 Ft. Mennyi 7 m ára változatlan egységárral, alapdíj és kedvezmény nélkül?",
      steps: steps(
        [
          "900 : 2,5 = 360 Ft/m",
          "Az összes árból egy méterre jutó árat keresünk.",
        ],
        ["7 × 360 = 2520 Ft", "Minden méter ugyanannyiba kerül."],
        ["2520 : 7 = 360 Ft/m", "A hányados visszaadja az eredeti egységárat."],
      ),
      alternative: steps(
        [
          "5 m: 1800 Ft; 7,5 m: 2700 Ft",
          "Könnyen áttekinthető többszörösökkel becsülünk.",
        ],
        [
          "1800 < 2520 < 2700",
          "A 7 m hossznak megfelelő ár a kettő közé esik.",
        ],
      ),
      check: "2520 : 7 = 360 Ft/m; az ár a 5 m és 7,5 m ára közé esik.",
    },
    {
      title: "A–P2 — Több gép, ugyanaz a munka",
      prompt:
        "Négy azonos nyomtató 12 perc alatt készít el egy adott kártyamennyiséget. Mennyi idő kell hat ilyen nyomtatónak? Azonos, állandó ütemmel, szabad feloszthatósággal, egyidejű indulással, közös szűk keresztmetszet és előkészítési idő nélkül számolunk.",
      steps: steps(
        ["4 × 12 = 48 gépperc", "A teljes munkamennyiség rögzített."],
        ["48 : 6 = 8 perc", "A munkát hat egyforma gép között osztjuk el."],
        ["6 × 8 = 48 gépperc", "A szorzat ugyanaz maradt."],
      ),
      alternative: steps(
        ["6/4 = 1,5", "A gépszám másfélszeresére változott."],
        [
          "12 : 1,5 = 8 perc",
          "Fordított arányosságnál az időt ugyanazzal a tényezővel osztjuk.",
        ],
      ),
      check:
        "8 perc kisebb 12-nél, és 6 × 8 = 4 × 12. A következtetés a megadott feltételekre vonatkozik.",
    },
  ],
  practice: [
    exercise(
      "aranyossag",
      "practice-1",
      "A–G01",
      "Eredetileg 3 piros és 9 fehér gyöngy van. Melyik összeállítás őrzi a piros : fehér arányt? Dönts mindháromról: A: 6 piros, 18 fehér; B: 5 piros, 11 fehér; C: 4 piros, 12 fehér. Indokold, miért nem elég a különbséget nézni.",
      parts(
        part("a", "A megőrzi az arányt?", yesNo(true)),
        part("b", "B megőrzi az arányt?", yesNo(false), [
          [
            "yes",
            "A különbség valóban 6, de egy pirosra nem 3 fehér jut: öt piroshoz 15 fehér kellene.",
          ],
        ]),
        part("c", "C megőrzi az arányt?", yesNo(true)),
      ),
      [
        "Egy pirosra hány fehér jut az eredetiben és az új összeállításokban?",
        "3 : 9 = 1 : 3. Ellenőrizd, a fehérek száma a pirosak háromszorosa-e.",
      ],
      steps(
        [
          "3/9 = 1/3; 6/18 = 1/3; 4/12 = 1/3",
          "A és C ugyanazt az arányt adja.",
        ],
        ["5/11 ≠ 1/3", "B-ben öt piros mellé 15 fehér kellene."],
        [
          "9 − 3 = 11 − 5 = 6",
          "A különbség egyezése nem őrzi a keverési arányt.",
        ],
      ),
      "Az arányt közös szorzás, nem általában azonos hozzáadás őrzi.",
      {
        kind: "reason",
        reflection: reflect(
          "Mutass rá B példáján a különbség és arány eltérésére.",
          "A különbség 6 mindkettőben.",
          "A 5 : 11 hányados eltér a 3 : 9-től.",
        ),
      },
    ),
    exercise(
      "aranyossag",
      "practice-2",
      "A–G02",
      "4,5 kg alma 1800 Ft. Változatlan kilogrammonkénti árral, kedvezmény és más díj nélkül mennyibe kerül 1,75 kg? Add meg az egységárat is.",
      parts(
        part("unitPrice", "Egységár (Ft/kg)", number("400", "Ft/kg")),
        part("price", "1,75 kg ára (Ft)", number("700", "Ft")),
      ),
      [
        "1,75 kg a 4,5 kg felénél is kevesebb, ezért az ár 900 Ft alatt legyen.",
        "Az 1800 : 4,5 hányadosból indulj, majd szorozz 1,75-tel.",
      ],
      steps(
        ["1800 : 4,5 = 400 Ft/kg", "Egy kilogrammra jutó árat keresünk."],
        ["1,75 × 400 = 700 Ft", "Minden kilogramm azonos áron számít."],
        ["700 : 1,75 = 400 Ft/kg", "Az egységár visszaellenőrzése egyezik."],
      ),
      "A változatlan egységár indokolja az egyenes arányosságot.",
      { kind: "transfer" },
    ),
    exercise(
      "aranyossag",
      "practice-3",
      "A–G03",
      "Egy nyomtató állandó ütemű, kezdetben 0 kész oldal van, indulási késés nincs. 3 perc alatt 72, 8 perc alatt 192 oldal készül. Töltsd ki a hiányzó adatokat: 0 perc → ? oldal; 5 perc → ? oldal. Add meg a percenkénti teljesítményt.",
      parts(
        part("zero", "0 perc alatt (oldal)", number("0", "oldal")),
        part("five", "5 perc alatt (oldal)", number("120", "oldal")),
        part(
          "rate",
          "Percenkénti teljesítmény (oldal/perc)",
          number("24", "oldal/perc"),
        ),
      ),
      [
        "Pozitív időnél oszd az elkészült oldalakat a percekkel; 0/0-t ne számíts.",
        "72 : 3 = 24 oldal/perc; öt perc ennek ötszöröse.",
      ],
      steps(
        [
          "72 : 3 = 24; 192 : 8 = 24 oldal/perc",
          "Mindkét adott pozitív adatpár azonos ütemet mutat.",
        ],
        [
          "0 perc: 0 oldal; 5 perc: 5 × 24 = 120 oldal",
          "Az állandó ütem és a nulla kezdőérték együtt alapozza meg az egyenes arányosságot.",
        ],
      ),
      "Nulla bemenetnél a modell megadja az értéket, de a hányados nem értelmezett.",
    ),
    exercise(
      "aranyossag",
      "practice-4",
      "A–G04",
      "A szállítás díja 500 Ft alapdíj + 200 Ft/km. Lili szerint kétszeres távolság kétszeres árat jelent. Számold ki 2 km és 4 km díját; döntsd el a teljes díj kapcsolatát, és nevezd meg a távolsággal egyenesen arányos díjrészt.",
      parts(
        part("two", "2 km teljes díja (Ft)", number("900", "Ft")),
        part("four", "4 km teljes díja (Ft)", number("1300", "Ft"), [
          ["1800", "Az alapdíjat a második útnál sem fizetjük kétszer."],
        ]),
        part(
          "model",
          "Teljes díj és távolság kapcsolata",
          proportionality("neither"),
        ),
        part(
          "proportionalPart",
          "Melyik díjrész egyenesen arányos?",
          choice("variable", [
            ["base", "Az 500 Ft alapdíj."],
            [
              "variable",
              "Az alapdíjon felüli, kilométerenként 200 Ft-os rész.",
            ],
            ["total", "A teljes díj."],
          ]),
        ),
      ),
      [
        "Az alapdíjat mindkét útnál egyszer számítjuk fel.",
        "2 km: 500 + 2 × 200; 4 km: 500 + 4 × 200. Hasonlítsd a másodikat az első kétszereséhez.",
      ],
      steps(
        ["2 km: 900 Ft; 4 km: 1300 Ft", "A fix tag nem kétszereződik."],
        [
          "900 : 2 = 450; 1300 : 4 = 325 Ft/km",
          "A teljes díj hányadosa nem állandó.",
        ],
        [
          "Alapdíjon felül: 400 és 800 Ft",
          "Ez a rész arányos: minden kilométerre 200 Ft jut.",
        ],
      ),
      "Egy egyenes grafikon is lehet nem arányos, ha a fix hozzáadott tag nem nulla.",
      {
        kind: "reason",
        reflection: reflect(
          "Mutass egy számpárral ellenpéldát Lili állítására.",
          "A 900 Ft kétszerese 1800, de a 4 km tényleges díja 1300 Ft.",
        ),
      },
    ),
    exercise(
      "aranyossag",
      "practice-5",
      "A–G05",
      "Hat azonos ütemű segítő 10 óra alatt végez. Mennyi idő kell négy ilyen segítőnek ugyanahhoz a munkához? A munka szabadon felosztható, nincs várakozás, az ütem változatlan.",
      number("15", "óra"),
      [
        "Kevesebb segítőhöz a feltételek mellett több idő tartozik.",
        "A teljes munka 6 × 10 = 60 segítőóra; ezt oszd néggyel.",
      ],
      steps(
        ["6 × 10 = 60 segítőóra", "Rögzítjük a teljes munkát."],
        ["60 : 4 = 15 óra", "Négy egyenlő részre oszlik a munka."],
        [
          "4 × 15 = 60 segítőóra",
          "A szorzat megmaradt; a létszám 2/3-ára, az idő 3/2-szeresére változott.",
        ],
      ),
      "Ugyanazt a munkát kevesebb azonos segítő hosszabb idő alatt végzi.",
      {
        kind: "transfer",
        mistakes: [
          {
            input: "20/3",
            feedback:
              "Ez a létszámmal egyenes arányban csökkentené az időt. Ugyanazt a munkát kell elvégezni, a létszám és idő szorzatát tartsd meg.",
          },
        ],
      },
    ),
    exercise(
      "aranyossag",
      "practice-6",
      "A–G06",
      "Négy azonos gép 15 óra alatt végez egy szabadon felosztható munkát. Legalább hány egész gép kell legfeljebb 8 órás munkához? Minden gép azonos ütemben, egyszerre dolgozik, nincs előkészítési idő. Add meg a választott gépszám tényleges idejét is.",
      parts(
        part(
          "machines",
          "Legkisebb megfelelő gépszám (db)",
          number("8", "db"),
          [
            [
              "7.5",
              "Gépből egész darabszám kell. Ellenőrizd, 7 vagy 8 gép teljesíti-e a határidőt.",
            ],
            ["7", "7 × 8 = 56 gépóra, kevesebb a szükséges 60-nál."],
          ],
        ),
        part("time", "Tényleges idő ennyi géppel (óra)", number("7.5", "óra")),
      ),
      [
        "Határozd meg a munkát gépórában, majd egész gépszámot keress.",
        "60 : 8 = 7,5 gépnyi teljesítmény kellene; 7 és 8 gépet külön ellenőrizz.",
      ],
      steps(
        ["4 × 15 = 60 gépóra", "Ez a munka változatlan."],
        ["7 × 8 = 56 < 60; 8 × 8 = 64 ≥ 60", "Hét gép kevés, nyolc már elég."],
        [
          "60 : 8 = 7,5 óra",
          "Nyolc géppel a tényleges idő a határidőn belül van.",
        ],
      ),
      "A felfelé választott egész számot a teljesítendő feltétel indokolja, nem egy vak kerekítési szabály.",
      {
        kind: "transfer",
        difficulty: 3,
        reflection: reflect(
          "Mi bizonyítja, hogy 8 a legkisebb megfelelő egész szám?",
          "7 gép 8 óra alatt csak 56 gépórát teljesít.",
          "8 gép 7,5 óra alatt elvégez 60 gépórát.",
        ),
      },
    ),
    exercise(
      "aranyossag",
      "practice-7",
      "A–G07",
      "A modellben a távolság mindig 90 km, a sebesség állandó, megállás nincs. Mennyi az idő 45 km/h és 60 km/h mellett? Milyen kapcsolat van a sebesség és idő között?",
      parts(
        part("slow", "45 km/h-hoz tartozó idő (óra)", number("2", "óra")),
        part("fast", "60 km/h-hoz tartozó idő (óra)", number("1.5", "óra")),
        part("model", "Sebesség és idő kapcsolata", proportionality("inverse")),
      ),
      [
        "A teljes út mindkét esetben ugyanannyi.",
        "Sebesség × idő = út; 45 × t = 90 és 60 × t = 90.",
      ],
      steps(
        [
          "90 : 45 = 2 óra; 90 : 60 = 1,5 óra",
          "Azonos utat osztunk a két állandó sebességgel.",
        ],
        [
          "45 × 2 = 60 × 1,5 = 90 km",
          "A szorzat állandó, tehát a megadott modell fordított arányosság.",
        ],
        ["1,5 óra = 1 óra 30 perc", "A fél óra 30 perc."],
      ),
      "Várakozás vagy változó sebesség más modellt kívánna.",
      {
        kind: "transfer",
        reflection: reflect(
          "Melyik feltétel tartja állandóan a szorzatot?",
          "Mindkét esetben ugyanaz a 90 km az út.",
          "A modellben a sebesség állandó és megállás nincs.",
        ),
      },
    ),
    exercise(
      "aranyossag",
      "practice-8",
      "A–G08",
      "60 oldalból óránként 10-et olvasunk el. Marci szerint az eltelt idő és a hátralévő oldalak fordítottan arányosak, mert egyik nő, másik csökken. Vizsgáld 1, 2 és 3 óránál a maradékot és a szorzatot, majd dönts.",
      parts(
        part("pages1", "1 óra után marad (oldal)", number("50", "oldal")),
        part("product1", "1 × hátralévő oldalszám", number("50")),
        part("pages2", "2 óra után marad (oldal)", number("40", "oldal")),
        part("product2", "2 × hátralévő oldalszám", number("80")),
        part("pages3", "3 óra után marad (oldal)", number("30", "oldal")),
        part("product3", "3 × hátralévő oldalszám", number("90")),
        part("model", "A kapcsolat", proportionality("neither")),
      ),
      [
        "Fordított arányosságnál a szorzatnak kellene változatlannak lennie.",
        "A maradékok 60 − 10, 60 − 20 és 60 − 30; szorozd rendre 1, 2 és 3 órával.",
      ],
      steps(
        [
          "1 óra: 50 oldal és 50; 2 óra: 40 oldal és 80; 3 óra: 30 oldal és 90",
          "A szorzatokat külön kiszámítjuk.",
        ],
        ["50 ≠ 80 ≠ 90", "A szorzat nem állandó, nincs fordított arányosság."],
        [
          "Hátralévő oldal = 60 − 10 × idő",
          "Állandó különbségű csökkenés, 0 és 6 óra között értelmezve.",
        ],
      ),
      "Csökkenésből önmagában nem következik fordított arányosság.",
      {
        kind: "reason",
        reflection: reflect(
          "Mi történne a modellel 6 óra után?",
          "A szöveg elfogyott.",
          "A helyzetet nem folytatjuk negatív oldalszámmal.",
        ),
      },
    ),
    exercise(
      "aranyossag",
      "practice-9",
      "A–G09",
      "7200 Ft-ot papírra és festékre költünk, a két összeg aránya 3 : 5. Mennyi jut papírra és festékre?",
      parts(
        part("paper", "Papírra (Ft)", number("2700", "Ft"), [
          [
            "4320",
            "A 3/5 a két rész aránya. Az egész 3 + 5 = 8 egyenlő részből áll.",
          ],
        ]),
        part("paint", "Festékre (Ft)", number("4500", "Ft")),
      ),
      [
        "A 3 és 5 az egymáshoz viszonyított részek száma. Hány részből áll az egész?",
        "Egy rész 7200 : 8; a papírra három, festékre öt rész jut.",
      ],
      steps(
        [
          "3 + 5 = 8; 7200 : 8 = 900 Ft",
          "A teljes összeget az összes arányrész között osztjuk el.",
        ],
        [
          "Papír: 3 × 900 = 2700 Ft; festék: 5 × 900 = 4500 Ft",
          "Az egyenlő részekből a megadott darabszámokat vesszük.",
        ],
        [
          "2700 + 4500 = 7200; 2700 : 4500 = 3 : 5",
          "Az összeg és az arány is megfelel.",
        ],
      ),
      "Az első rész az egész 3/8-a, nem 3/5-e.",
      {
        kind: "transfer",
        reflection: reflect(
          "Miért 8-cal osztjuk az egészet?",
          "A 3 és az 5 együtt 8 azonos arányrészt jelöl.",
        ),
      },
    ),
    exercise(
      "aranyossag",
      "practice-10",
      "A–G10",
      "A térkép méretaránya 1 : 25 000. Egy egyenes szakasz a térképen 3,6 cm. Mekkora a valós egyenes távolság méterben és kilométerben?",
      parts(
        part("metres", "Valós távolság (m)", number("900", "m"), [
          [
            "90000",
            "Ez a 3,6 × 25 000 eredménye centiméterben. A méterhez még 100-zal osztunk.",
          ],
        ]),
        part("kilometres", "Ugyanaz (km)", number("0.9", "km")),
      ),
      [
        "A méretarány azonos egységekre vonatkozik.",
        "3,6 × 25 000 centimétert ad; méterre 100-zal, kilométerre még 1000-rel osztunk.",
      ],
      steps(
        [
          "3,6 × 25 000 = 90 000 cm",
          "A térképi hossz azonos egységben 25 000-szeres valós hosszt jelöl.",
        ],
        ["90 000 cm = 900 m = 0,9 km", "A kért egységekre váltunk."],
        [
          "1 térképi cm = 250 m; 3,6 × 250 = 900 m",
          "Más léptékből visszaellenőrizzük.",
        ],
      ),
      "A méretarány hosszarány; a megadott egyenes szakasz nem feltétlenül útvonalhossz.",
      { kind: "transfer" },
    ),
    exercise(
      "aranyossag",
      "practice-11",
      "A–G11",
      "Egy téglalap 4 cm × 6 cm-es. Mindkét oldalát kétszerezzük. Számold ki a régi és új kerületet, területet, majd a két változás tényezőjét. Miért nem kétszeres a terület?",
      parts(
        part("oldPerimeter", "Régi kerület (cm)", number("20", "cm")),
        part("newPerimeter", "Új kerület (cm)", number("40", "cm")),
        part("perimeterFactor", "Kerület változási tényezője", number("2")),
        part("oldArea", "Régi terület (cm²)", number("24", "cm²")),
        part("newArea", "Új terület (cm²)", number("96", "cm²")),
        part("areaFactor", "Terület változási tényezője", number("4"), [
          ["2", "Mindkét oldal kétszeres: a terület tényezője 2 × 2."],
        ]),
      ),
      [
        "Új oldalak: 8 cm és 12 cm. Kerületnél összeadunk, területnél szorzunk.",
        "K = 2 × (4 + 6), T = 4 × 6; az új oldalakkal számold újra.",
      ],
      steps(
        [
          "Régi K = 20 cm, új K = 40 cm",
          "Az oldalak összege a hossztényezővel változik.",
        ],
        [
          "Régi T = 24 cm², új T = 96 cm²",
          "Mindkét kiterjedési irány kétszeres.",
        ],
        [
          "40 : 20 = 2; 96 : 24 = 4",
          "A kerület kétszeres, a terület négyszeres.",
        ],
      ),
      "Minden irányú nagyításnál a terület a hossztényező négyzetével változik.",
      {
        kind: "reason",
        difficulty: 3,
        reflection: reflect(
          "Indokold egységnégyzetekkel a négyszeres területet.",
          "Kétszer annyi négyzet fér egy sorba.",
          "Kétszer annyi sor van, így összesen négyszer annyi négyzet.",
        ),
      },
    ),
    exercise(
      "aranyossag",
      "practice-12",
      "A–G12",
      "„Három diák két óra alatt készít dekorációt. Hat biztosan egy óra alatt végez.” Következik ez az első adatból? Hasonlíts össze két modellt: I. a teljes munka 6 diákóra, szabadon felosztható; II. 1 óra nem rövidíthető előkészítés, majd 3 diákóra felosztható munka. Minden diák azonos ütemű.",
      parts(
        part(
          "certain",
          "A biztos állítás következik az egyetlen adatból?",
          yesNo(false),
          [
            [
              "yes",
              "Mindkét megadott modell illik az első adatra, de hat diáknál különböznek.",
            ],
          ],
        ),
        part("modelOne3", "I. modell: 3 diák ideje (óra)", number("2", "óra")),
        part("modelOne6", "I. modell: 6 diák ideje (óra)", number("1", "óra")),
        part("modelTwo3", "II. modell: 3 diák ideje (óra)", number("2", "óra")),
        part(
          "modelTwo6",
          "II. modell: 6 diák ideje (óra)",
          number("1.5", "óra"),
        ),
      ),
      [
        "Lehet nem felosztható vagy várakozási szakasz a munkában?",
        "I. t = 6/n; II. t = 1 + 3/n. Mindkettőt ellenőrizd 3 és 6 diáknál.",
      ],
      steps(
        [
          "I. modell: 6 : 3 = 2 óra, 6 : 6 = 1 óra",
          "Az összes munka felosztható, a szorzat állandó.",
        ],
        [
          "II. modell: 1 + 3 : 3 = 2 óra; 1 + 3 : 6 = 1,5 óra",
          "Az egyórás előkészítés több emberrel sem rövidül.",
        ],
        [
          "A kétórás adat önmagában nem dönt",
          "Ugyanaz az első adat két különböző folytatással is összeegyeztethető.",
        ],
      ),
      "A modellhez feltételek kellenek; egyetlen adatpár kevés.",
      {
        kind: "reason",
        difficulty: 3,
        reflection: reflect(
          "Fogalmazz meg feltételeket, amelyek mellett igaz az állítás, és saját ellenpéldát, amikor nem.",
          "Igaz lehet azonos ütem, szabad feloszthatóság és közös várakozás nélkül.",
          "Ellenpélda egy mindenki számára kötelező, nem rövidíthető előkészítés vagy száradás.",
          "A példám megfelel a három diákról szóló kiinduló adatnak is.",
        ),
      },
    ),
  ],
  exit: [
    exercise(
      "aranyossag",
      "exit-1",
      "A–Z01",
      "Hat azonos füzet 1740 Ft. Változatlan egységár, csomagkedvezmény és külön díj nélkül mennyi tizenegy füzet ára? Nevezd meg az arányosságot és indokold a feltételekkel.",
      parts(
        part("price", "11 füzet ára (Ft)", number("3190", "Ft")),
        part("model", "Ár és darabszám kapcsolata", proportionality("direct")),
      ),
      [
        "Az egy füzetre jutó ár változatlan.",
        "1740 : 6 megadja egy füzet árát.",
      ],
      steps(
        ["1740 : 6 = 290 Ft/db", "Az állandó egységárat keressük."],
        ["11 × 290 = 3190 Ft", "Minden füzet ugyanannyiba kerül."],
        [
          "3190 : 11 = 290 Ft/db; 3190 < 3480",
          "A hányados egyezik; 11 füzet kevesebbe kerül, mint a kétszeres, 12 darab.",
        ],
      ),
      "Az állandó egységár és a fix díj hiánya indokolja az egyenes arányosságot.",
      {
        kind: "transfer",
        reflection: reflect(
          "Ne csak nevezd meg a modellt: indokold és ellenőrizd.",
          "Az egy füzetre jutó ár állandó, nincs hozzáadott díj.",
          "3190 : 11 = 1740 : 6 = 290 Ft/db.",
        ),
      },
    ),
    exercise(
      "aranyossag",
      "exit-2",
      "A–Z02",
      "Öt azonos szivattyú 20 perc alatt emel át adott vízmennyiséget. Mennyi idő kell nyolcnak? Ugyanannyi víz, állandó és független teljesítmény, előkészítés és várakozás nélkül. Add meg az időt percben és perc–másodperc alakban; nevezd meg a kapcsolatot.",
      parts(
        part("minutes", "Teljes idő (perc)", number("12.5", "perc")),
        part(
          "wholeMinutes",
          "Perc–másodperc alak: egész perc",
          number("12", "perc"),
        ),
        part(
          "seconds",
          "Perc–másodperc alak: maradék másodperc",
          number("30", "s"),
          [["50", "Fél perc a 60 másodperc fele, nem ötven másodperc."]],
        ),
        part(
          "model",
          "Szivattyúszám és idő kapcsolata",
          proportionality("inverse"),
        ),
      ),
      [
        "Azonos mennyiséget több egyforma szivattyú rövidebb ideig emel.",
        "A teljes munka 5 × 20 = 100 szivattyúperc; a fél percet 60 másodpercből számold.",
      ],
      steps(
        [
          "5 × 20 = 100 szivattyúperc; 100 : 8 = 12,5 perc",
          "A szorzat rögzített, az arányosság fordított.",
        ],
        [
          "0,5 × 60 = 30 s → 12 perc 30 s",
          "A tört percet a megfelelő váltószámmal váltjuk.",
        ],
        ["8 × 12,5 = 100", "Visszakaptuk ugyanazt a munkát."],
      ),
      "A megadott modell feltételei és az időegységek együtt számítanak.",
      {
        kind: "transfer",
        reflection: reflect(
          "Melyik mennyiség állandó, és mi módosíthatná a modellt?",
          "A teljes átengedendő vízmennyiség és az egységnyi szivattyúteljesítmény rögzített.",
          "Közös szűk keresztmetszet vagy előkészítés megszüntethetné a fordított arányosságot.",
        ),
      },
    ),
  ],
  recap: [
    "Nevezd meg a mennyiségeket és egységeiket.",
    "Egyenes arányosságnál a hányados, fordítottnál a szorzat állandó.",
    "Az alapdíjas egyenes nem egyenes arányosság.",
    "Egyetlen adatpár nem bizonyít modellt; a feltételek is szükségesek.",
    "A rész–rész arány és a rész–egész arány külön kérdés.",
    "A megoldást az eredeti kapcsolatba visszatéve ellenőrizd.",
  ],
  glossary: [
    {
      term: "Arány",
      definition:
        "Két megnevezett mennyiség egymáshoz viszonyított nagysága; azonos fajtánál azonos egységet használunk.",
    },
    {
      term: "Egységre jutó mennyiség",
      definition:
        "Például egy méterre jutó ár; a hányadosnak Ft/m egysége van.",
    },
    {
      term: "Egyenes arányosság",
      definition: "Pozitív bemenetnél állandó hányadosú kapcsolat: y = kx.",
    },
    {
      term: "Fordított arányosság",
      definition:
        "Pozitív mennyiségeknél állandó szorzatú kapcsolat: x × y = k.",
    },
    {
      term: "Modellfeltétel",
      definition:
        "Olyan feltevés, amely mellett a számítás leírja a történetet.",
    },
    {
      term: "Arányrész",
      definition:
        "Az arány szerinti felosztás azonos nagyságú alapegysége; 3 : 5 esetén az egészben 8 ilyen van.",
    },
  ],
};

const mertekegysegek: Lesson = {
  id: "mertekegysegek",
  moduleId: "M20",
  title: "Mértékegységek: ugyanaz a mennyiség",
  shortTitle: "Mértékegységek",
  question: "Miért lesz nagyobb a mérőszám, ha kisebb egységgel mérünk?",
  teaser:
    "Építs hosszt, területet és térfogatot egységekből; különítsd el a váltást a nagyítástól.",
  description:
    "A szám és az egység együtt fejez ki mennyiséget. A váltószámokat egy, két vagy három irányból értjük meg, majd idővel, tömeggel és összetett egységekkel is alkalmazzuk.",
  goals: [
    "Megmagyarázod, miért nő a mérőszám kisebb egységnél, miközben a mennyiség változatlan.",
    "Külön indokolod a hossz-, terület- és térfogatváltást.",
    "Összekapcsolod a litert, köbdecimétert, köbcentimétert és millilitert.",
    "Az órát, percet és másodpercet a 60-as kapcsolattal váltod.",
    "Kerületet, területet és térfogatot a megfelelő egységgel adsz meg.",
    "Felismered, amikor két külön mennyiség összekapcsolásához további adat kell.",
  ],
  prerequisites: [
    "Tizedes számok, szorzás, osztás.",
    "A téglalap kerülete és területe, a téglatest térfogata; a feladatokban újra megindokoljuk.",
  ],
  prerequisiteTopics: ["szamfogalom", "muveleti-sorrend", "aranyossag"],
  coveredUnits: ["M20.01", "M20.02", "M20.03", "M20.04"],
  estimateMinutes: 50,
  color: "#d7c5ec",
  layer: "ALAP",
  nextTopic: "szazalek",
  prediction: exercise(
    "mertekegysegek",
    "prediction",
    "M–J01–04",
    "Jósolj! 1) 2,4 m szalag hány cm, és változik-e a szalag? 2) 1 dm oldalú négyzetet hány 1 cm oldalú négyzet fed le? 3) 1 dm élű kocka hány 1 cm élű kockából épül? 4) Fél óra hány perc?",
    parts(
      part("length", "1) A mérőszám centiméterben", number("240", "cm")),
      part("changes", "1) Változik a szalag hosszúsága?", yesNo(false)),
      part("squares", "2) Kis négyzetek száma", number("100"), [
        ["10", "Egy sorban 10 van, de 10 sor kell."],
      ]),
      part("cubes", "3) Kis kockák száma", number("1000"), [
        ["100", "Ez egy réteg. A kockához 10 ilyen réteg kell."],
      ]),
      part("minutes", "4) 0,5 óra percben", number("30", "perc"), [
        ["50", "Az egész óra 60 perc, ennek a felét keressük."],
      ]),
    ),
    [
      "A kisebb egységből több fér ugyanabba a hosszba, területbe vagy térbe.",
      "Négyzet: 10 sor × 10 oszlop; kocka: ehhez 10 réteg; idő: 60 perc az egész.",
    ],
    steps(
      [
        "2,4 m = 240 cm; a szalag változatlan",
        "A kisebb egységhez nagyobb mérőszám tartozik.",
      ],
      [
        "10 × 10 = 100; 10 × 10 × 10 = 1000",
        "Két, illetve három irányban számolunk.",
      ],
      ["0,5 × 60 = 30 perc", "Az időváltás nem tízes."],
    ),
    "A váltószámot a mennyiség és az egységek kapcsolata indokolja.",
    {
      kind: "reason",
      reflection: reflect(
        "Melyik kép vagy kapcsolat magyarázza az egyik válaszodat?",
        "Az egységváltás nem nyújtja meg a szalagot.",
        "Területnél két, térfogatnál három irányból számolunk.",
        "Fél óra a 60 perc fele.",
      ),
    },
  ),
  explanation: [
    {
      heading: "A szám és az egység együtt mondja meg a mennyiséget",
      body: "Egy asztal hossza lehet 1,2 m vagy 120 cm. Az asztal nem változott: más méretű egységgel mértük meg. A puszta 120 nem mondja meg, millimétert, centimétert vagy métert mérünk. Ugyanazt a pozitív mennyiséget kisebb egységben nagyobb mérőszámmal fejezzük ki.",
      formula: "1,2 m = 120 cm",
    },
    {
      heading: "Hossz: egymás mögé tesszük az egységeket",
      body: "Egy méterben száz centiméteres szakasz fér el. Ezért méterről centiméterre százzal szorzunk, visszafelé százzal osztunk. Nem minden egymás mellé írt egység között tíz a váltószám: kilométer és méter között ezer.",
      formula: "1 m = 10 dm = 100 cm = 1000 mm; 1 km = 1000 m",
      bullets: [
        "2,4 m = 2,4 × 100 cm = 240 cm.",
        "Az irányellenőrzés és a fordított váltás segít észrevenni a téves szorzást vagy osztást.",
      ],
    },
    {
      heading: "Terület: két irányban számolunk",
      body: "Egy 1 dm oldalú négyzet mindkét oldala 10 cm. Egy sorban 10 egységnégyzet fér el és 10 sor van, ezért 100 cm². Az 1 m² oldalai 100 cm hosszúak, ezért 100 × 100 = 10 000 cm². A váltószámot is négyzetre emeljük.",
      formula: "1 dm² = 100 cm²; 1 m² = 100 dm² = 10 000 cm²",
      bullets: [
        "3 m² három négyzetméternyi terület; nem egy 3 m oldalú négyzet, amely 9 m² lenne.",
        "0,4 m² = 4000 cm², mert a méter–centiméter hosszváltószám négyzete 10 000.",
      ],
    },
    {
      heading: "Térfogat: rétegekben építünk",
      body: "Egy 1 dm élű kockában egy élen 10 egycentiméteres szakasz, egy rétegben 10 × 10 = 100 kis kocka, összesen 10 réteg van. Három külön irányt szorzunk össze. A kitevő nem dísz az egység végén.",
      formula: "1 dm³ = 1000 cm³; 1 m³ = 1000 dm³ = 1 000 000 cm³",
      bullets: [
        "1 m és 1 cm hosszaránya 100; a köbegységek váltószáma 100³.",
        "Nagy darabszámnál csoportokat és rétegeket érdemes számolni, nem minden kockát külön.",
      ],
    },
    {
      heading: "Egységváltás és nagyítás különbözik",
      body: "Ugyanaz a négyzet lehet 1 dm² vagy 100 cm²: a tárgy változatlan. Ha az oldalát kétszerezzük, más méretű tárgyat kapunk, amelynek területe négyszeres. Hasonló testek minden hosszméretének kétszerezése a felszínt négyszerezi, a térfogatot nyolcszorozza.",
      formula:
        "Egységváltás: ugyanaz a mennyiség. Nagyítás: hossz × 2, felszín × 4, térfogat × 8.",
    },
    {
      heading: "Liter és köbegységek ugyanazt mérik",
      body: "A liter térfogatot fejez ki. Egy liter pontosan egy köbdeciméter; egy milliliter egy köbcentiméter. Ez köti a doboz belső méreteiből számolt térfogatot a palackon látható jelöléshez.",
      formula: "1 L = 1 dm³ = 1000 cm³ = 1000 mL; 1 mL = 1 cm³; 1 m³ = 1000 L",
      bullets: [
        "1 L = 10 dL = 100 cL = 1000 mL.",
        "750 mL = 750 cm³ = 0,75 L.",
      ],
    },
    {
      heading: "Tömeg: nem térfogat",
      body: "Tömegben 1 t = 1000 kg, 1 kg = 1000 g és 1 g = 1000 mg. A kilogramm tömeget, a liter térfogatot mér. Literből nem lehet puszta egységváltással kilogrammot készíteni: anyagadat kell, például egy liter adott folyadék tömege.",
      formula: "1 t = 1000 kg; 1 kg = 1000 g; 1 g = 1000 mg",
      bullets: [
        "0,8 kg/L anyagadat mellett 2 L tömege 1,6 kg.",
        "Ez két külön mennyiség közötti számítás, nem egységváltás.",
      ],
    },
    {
      heading: "Idő: a tizedesvessző nem órakijelző",
      body: "Egy óra 60 perc, egy perc 60 másodperc. A tizedes tört az éppen megadott egység törtrésze. Az 1,25 órában a 0,25 egy óra negyede, vagyis 15 perc; nem 25 perc.",
      formula: "1,25 óra = 1 óra + 0,25 × 60 perc = 1 óra 15 perc",
      bullets: [
        "1,35 óra = 1 óra 21 perc = 81 perc.",
        "A perc–másodperc alaknál is 60 a kapcsolat.",
      ],
    },
    {
      heading: "Sebesség: két egységet váltunk",
      body: "A km/h megadja az egy óra alatt megtett kilométert. m/s-ra váltva a távolság és az idő egysége is változik: 1000 m-t osztunk 3600 másodperccel. Innen ered a 3,6-os tényező.",
      formula: "1 km/h = 1000/3600 m/s = 5/18 m/s",
      bullets: [
        "km/h-ról m/s-ra 3,6-del osztunk; visszafelé 3,6-del szorzunk.",
        "A kapcsolódó út–idő feladatokban a megadott állandó sebességű modellt használjuk.",
      ],
    },
    {
      heading: "Összeadás előtt mennyiséget és egységet egyeztetünk",
      body: "2 m és 30 cm összeadható: 2,3 m. A 2 m és 30 cm² különböző mennyiség, ezért nem adható össze egyetlen hosszúságként vagy területként. Csomagoknál külön vizsgáljuk az egész darabszámot és a maradékot.",
      formula: "2 m + 30 cm = 2 m + 0,3 m = 2,3 m",
      bullets: [
        "Kerület: hossz; lefedés: terület; befogadóképesség: térfogat.",
        "Területből nem találunk ki hiányzó oldalhosszt további adat nélkül.",
        "A jó szám rossz egységgel más mennyiséget jelenthet.",
      ],
    },
    {
      heading: "Öt hibaminta ellenőrző kérdése",
      body: "A hibás szám helyett a használt kapcsolatot vizsgáld meg; egyetlen válasz nem bizonyítja a hiba okát.",
      bullets: [
        "„Kisebb egység, kisebb szám.” Egy méterhez több centiméteres szakasz kell: 2,4 m = 240 cm.",
        "„1 m² = 100 cm².” Hány sor és hány oszlop van? 100 × 100 = 10 000.",
        "„1 L = 100 cm³.” Hány réteg? 10 × 10 × 10 = 1000.",
        "„1,35 óra = 1 óra 35 perc.” A 60 perc 0,35 része 21 perc.",
        "„Liter és kilogramm átváltható.” Van-e az anyagra vonatkozó tömeg/térfogat adat?",
      ],
    },
  ],
  examples: [
    {
      title: "M–P1 — Burkolás: közös egység és egész csomag",
      prompt:
        "3,2 m × 2,4 m téglalapot fedünk 40 cm oldalú négyzetlapokkal. Csomagonként 10 lap van. Hány lap és teljes csomag kell? Hézagmentes, veszteség és tartalék nélküli iskolai modell; az oldalakhoz egész számú lap illeszkedik.",
      steps: steps(
        [
          "40 cm = 0,4 m; T = 3,2 × 2,4 = 7,68 m²",
          "Közös egységgel számoljuk a teljes felületet.",
        ],
        [
          "Egy lap: 0,4 × 0,4 = 0,16 m²; 7,68 : 0,16 = 48 lap",
          "Azonos területegységben hasonlítjuk össze a felületeket.",
        ],
        [
          "3,2 : 0,4 = 8; 2,4 : 0,4 = 6; 8 × 6 = 48",
          "A valódi kirakhatóságot az oldalak mentén is ellenőrizzük.",
        ],
        [
          "4 csomag: 40 lap, kevés; 5 csomag: 50 lap, elég",
          "Egész csomagot veszünk; 2 lap megmarad.",
        ],
      ),
      alternative: steps(
        [
          "7,68 m² = 76 800 cm²; 40 × 40 = 1600 cm²",
          "Centiméterben is ugyanazt a felületet mérjük.",
        ],
        ["76 800 : 1600 = 48", "A közös egység ugyanazt a darabszámot adja."],
      ),
      check:
        "48 lap kirakható 8 × 6 elrendezésben; 5 teljes csomag fedezi. Valós vásárlási veszteség vagy tartalék nem része ennek a modellnek.",
    },
    {
      title: "M–P2 — Dobozból liter",
      prompt:
        "A tároló belső méretei 30 cm × 20 cm × 25 cm. Mennyi a befogadóképesség literben, és mennyi víz van benne 18 cm vízmagasságnál?",
      steps: steps(
        ["30 × 20 = 600 cm²", "Az alap területét keressük."],
        [
          "600 × 25 = 15 000 cm³ = 15 L",
          "Huszonöt 1 cm magas réteg adja a teljes térfogatot.",
        ],
        [
          "600 × 18 = 10 800 cm³ = 10,8 L",
          "A víznél a tényleges vízmagassággal számolunk.",
        ],
      ),
      alternative: steps(
        ["18/25 a vízmagasság aránya", "Az alap állandó."],
        [
          "15 × 18/25 = 10,8 L",
          "A víztérfogat a magassággal egyenesen arányos.",
        ],
      ),
      check:
        "10,8 L kisebb 15 L-nél. Belső méreteket adtunk meg, így a fal vastagságát nem számítjuk a rendelkezésre álló térbe.",
    },
  ],
  practice: [
    exercise(
      "mertekegysegek",
      "practice-1",
      "M–G01",
      "Váltsd át: a) 3,7 m centiméterre; b) 45 mm centiméterre; c) 0,08 km méterre. Mindegyiknél mondd meg, miért nő vagy csökken a mérőszám.",
      parts(
        part("a", "a) 3,7 m = … cm", number("370", "cm"), [
          [
            "0.037",
            "Kisebb egységre váltunk: ugyanahhoz a hosszhoz több centiméter kell, nem kevesebb.",
          ],
        ]),
        part("b", "b) 45 mm = … cm", number("4.5", "cm")),
        part("c", "c) 0,08 km = … m", number("80", "m")),
      ),
      [
        "A centiméter a méternél kisebb, a milliméternél nagyobb.",
        "1 m = 100 cm; 1 cm = 10 mm; 1 km = 1000 m.",
      ],
      steps(
        ["3,7 × 100 = 370 cm", "Kisebb egységet többször számolunk."],
        ["45 : 10 = 4,5 cm", "Nagyobb egységből kevesebb kell."],
        ["0,08 × 1000 = 80 m", "A méter kisebb a kilométernél."],
      ),
      "Az irányt mindig az egységek mérete alapján ellenőrizd.",
      {
        difficulty: 1,
        reflection: reflect(
          "Válassz egy váltást, és mondd el az irányát a mennyiségből.",
          "Ugyanaz a hossz marad.",
          "Kisebb egységből több, nagyobból kevesebb fér bele.",
        ),
      },
    ),
    exercise(
      "mertekegysegek",
      "practice-2",
      "M–G02",
      "Egy 5 m-es zsinórból levágunk 2 m 35 cm-t, majd 1 m 80 cm-t. Vágási veszteség nélkül hány centiméter marad?",
      number("85", "cm"),
      [
        "Mindhárom hosszúságot ugyanabban az egységben írd le.",
        "500 cm-ből 235 cm-t és 180 cm-t veszünk el.",
      ],
      steps(
        [
          "235 + 180 = 415 cm",
          "Közös egységben összeadjuk a levágott darabokat.",
        ],
        [
          "500 − 415 = 85 cm = 0,85 m",
          "A teljes hosszból kivonjuk az elhasznált részt.",
        ],
        [
          "235 + 180 + 85 = 500 cm",
          "A darabok és maradék együtt visszaadják a kezdeti hosszt.",
        ],
      ),
      "Összeadás és kivonás előtt közös egység kell.",
      {
        kind: "transfer",
        mistakes: [
          {
            input: "0.85",
            feedback: "Ez a maradék méterben lenne. A mező centimétert kér.",
          },
        ],
      },
    ),
    exercise(
      "mertekegysegek",
      "practice-3",
      "M–G03",
      "Állítsd növekvő sorrendbe: 0,7 m; 65 cm; 720 mm. A rendezett értékeket milliméterben írd be. Bizonyítja-e önmagában a 720-as mérőszám, hogy a harmadik hosszúság a legnagyobb?",
      parts(
        part("smallest", "Legkisebb (mm)", number("650", "mm")),
        part("middle", "Középső (mm)", number("700", "mm")),
        part("largest", "Legnagyobb (mm)", number("720", "mm")),
        part(
          "rawEnough",
          "Elég bizonyíték az eredeti 720-as szám?",
          yesNo(false),
        ),
      ),
      [
        "Csak azonos egységű mérőszámokat hasonlíts össze.",
        "0,7 m = 700 mm; 65 cm = 650 mm.",
      ],
      steps(
        [
          "650 mm < 700 mm < 720 mm",
          "Az átváltás után azonos egységű értékeket rendezünk.",
        ],
        ["65 cm < 0,7 m < 720 mm", "Visszaírjuk az eredeti alakokat."],
        [
          "720 mm < 2 m, noha 720 > 2",
          "Ellenpélda arra, hogy a puszta mérőszám önmagában döntene.",
        ],
      ),
      "A számot az egységével együtt hasonlítjuk össze.",
      {
        kind: "reason",
        reflection: reflect(
          "Miért kell átváltás akkor is, ha a végső sorrendben valóban a 720 mm a legnagyobb?",
          "Az eredeti mérőszámok különböző egységeket számolnak.",
          "Csak a közös egységben elvégzett összehasonlítás igazolja a sorrendet.",
        ),
      },
    ),
    exercise(
      "mertekegysegek",
      "practice-4",
      "M–G04",
      "Réka ezt írta: „1,8 m² = 180 cm², mert egy méter száz centiméter.” Add meg a helyes váltószámot és a helyes eredményt, majd magyarázd meg a hiányzó irányt.",
      parts(
        part("factor", "1 m² hány cm²?", number("10000", "cm²"), [
          ["100", "100 kis négyzet fér egy sorba, de 100 ilyen sor van."],
        ]),
        part("area", "1,8 m² hány cm²?", number("18000", "cm²"), [
          [
            "180",
            "A hosszváltószámot mindkét irányban alkalmazzuk, ezért 10 000-rel szorzunk.",
          ],
        ]),
      ),
      [
        "Hány centiméteres négyzet van egy sorban és hány sorban?",
        "1 m² = 100 × 100 cm²; ezzel a váltószámmal számolj.",
      ],
      steps(
        ["1 m² = 100 × 100 = 10 000 cm²", "A terület két hosszúság szorzata."],
        [
          "1,8 × 10 000 = 18 000 cm²",
          "Ugyanazt a területet kisebb egységgel mérjük.",
        ],
        [
          "3 m × 0,6 m = 300 cm × 60 cm = 18 000 cm²",
          "Egy téglalappal külön is ellenőrizhetjük a váltást.",
        ],
      ),
      "A hosszváltás tényezőjét területnél négyzetre emeljük.",
      {
        kind: "reason",
        reflection: reflect(
          "Melyik lépést hagyta ki Réka?",
          "Az egyik irány 100-szoros felosztását.",
          "A 100-as váltószámot mindkét irányban kell alkalmazni.",
        ),
      },
    ),
    exercise(
      "mertekegysegek",
      "practice-5",
      "M–G05",
      "Egy téglalap alakú asztallap 180 cm × 1,2 m. Mennyi szegély kell az egész kerületre méterben, és mekkora a terület m²-ben? Átfedéssel, hulladékkal és vastagsággal nem számolunk.",
      parts(
        part("perimeter", "Szegély hossza (m)", number("6", "m"), [
          [
            "2.16",
            "Ez a terület mérőszáma lehet; a szegély az oldalak összegét követi.",
          ],
        ]),
        part("area", "Asztallap területe (m²)", number("2.16", "m²"), [
          [
            "6",
            "A 6 a kerület méterben. A felülethez a két közös egységű oldal szorzata kell.",
          ],
        ]),
      ),
      [
        "A szegély kerület, a fedés terület. Először váltsd a 180 cm-t méterre.",
        "Az oldalak 1,8 m és 1,2 m; K = 2 × (1,8 + 1,2), T = 1,8 × 1,2.",
      ],
      steps(
        ["180 cm = 1,8 m", "Az oldalakhoz közös egységet választunk."],
        ["K = 2 × (1,8 + 1,2) = 6 m", "Mind a négy oldal hosszát összeadjuk."],
        ["T = 1,8 × 1,2 = 2,16 m²", "Egységnégyzetekkel fedjük a felületet."],
        [
          "K = 600 cm; T = 21 600 cm²",
          "A másik egység ugyanazokat a mennyiségeket adja.",
        ],
      ),
      "A kerület hosszegységet, a terület négyzetes egységet kíván.",
      { kind: "transfer" },
    ),
    exercise(
      "mertekegysegek",
      "practice-6",
      "M–G06",
      "Váltsd át: a) 0,006 m³ literre; b) 2400 cm³ literre; c) 0,75 L köbcentiméterre. Jelöld meg azt is, melyik mennyiség nagyobb 1 liternél.",
      parts(
        part("a", "a) 0,006 m³ = … L", number("6", "L")),
        part("aGreater", "a) Nagyobb 1 L-nél?", yesNo(true)),
        part("b", "b) 2400 cm³ = … L", number("2.4", "L")),
        part("bGreater", "b) Nagyobb 1 L-nél?", yesNo(true)),
        part("c", "c) 0,75 L = … cm³", number("750", "cm³"), [
          ["75", "1 L = 1 dm³ = 1000 cm³; itt három irányban számolunk."],
        ]),
        part("cGreater", "c) Nagyobb 1 L-nél?", yesNo(false)),
      ),
      [
        "A liter és a köbegységek is térfogatot mérnek.",
        "1 m³ = 1000 L és 1 L = 1000 cm³.",
      ],
      steps(
        ["0,006 × 1000 = 6 L", "A köbméterhez képest kisebb egységre váltunk."],
        ["2400 : 1000 = 2,4 L", "A köbcentiméternél nagyobb egységre váltunk."],
        [
          "0,75 × 1000 = 750 cm³",
          "A háromnegyed liter háromnegyed ezernyi köbcentiméter.",
        ],
        [
          "6 L és 2,4 L > 1 L; 0,75 L < 1 L",
          "A nagyságrendi ellenőrzés egységváltás nélkül is értelmezhető.",
        ],
      ),
      "1 L = 1 dm³ = 1000 cm³ = 1000 mL.",
    ),
    exercise(
      "mertekegysegek",
      "practice-7",
      "M–G07",
      "A téglatest alakú tároló belső alapélei 40 cm és 25 cm. A víz 12 cm magasan áll; a tároló elég magas, a vízszint vízszintes. Hány liter víz van benne?",
      number("12", "L"),
      [
        "A víz magasságával számolj, ne ismeretlen teljes edénymagassággal.",
        "40 × 25 × 12 cm³ a térfogat; 1000 cm³ egy liter.",
      ],
      steps(
        ["40 × 25 = 1000 cm²", "Ez az alap területe."],
        [
          "1000 × 12 = 12 000 cm³ = 12 L",
          "Tizenkét darab 1 cm magas réteget veszünk.",
        ],
        [
          "Egy 1 cm-es réteg 1000 cm³ = 1 L",
          "A rétegek külön számolása is 12 litert ad.",
        ],
      ),
      "A kitöltött tér magassága számít a víztérfogatnál.",
      {
        kind: "transfer",
        mistakes: [
          {
            input: "12000",
            feedback:
              "Ez a térfogat köbcentiméterben. A mező literben kéri: 1000 cm³ = 1 L.",
          },
        ],
      },
    ),
    exercise(
      "mertekegysegek",
      "practice-8",
      "M–G08",
      "1,5 kg gyöngyből 120 g-os csomagokat töltünk. Legfeljebb hány teljes csomag készül, és hány gramm marad? A csomagolóanyag tömegét nem számítjuk.",
      parts(
        part("packages", "Teljes csomagok száma (db)", number("12", "db"), [
          [
            "12.5",
            "Ez nem egész darabszám. Csak teljes, 120 g-os csomagokat kérünk.",
          ],
          ["13", "13 × 120 = 1560 g, több a rendelkezésre álló 1500 g-nál."],
        ]),
        part("remaining", "Maradék (g)", number("60", "g")),
      ),
      [
        "Írd a teljes tömeget grammba; nem használhatsz több anyagot, mint amennyi van.",
        "1500 : 120 = 12,5. Ellenőrizd 12 és 13 teljes csomag anyagszükségletét.",
      ],
      steps(
        [
          "1,5 kg = 1500 g; 1500 : 120 = 12,5",
          "Közös tömegegységben keressük a hányadost.",
        ],
        [
          "12 × 120 = 1440 g; 1500 − 1440 = 60 g",
          "Tizenkét teljes csomag után fél csomagra elég anyag marad.",
        ],
        ["13 × 120 = 1560 g > 1500 g", "Több teljes csomag nem tölthető."],
      ),
      "Itt lefelé választunk egész számot; más kérdésnél, például vásárlásnál, más lehet az irány.",
      {
        kind: "transfer",
        difficulty: 3,
        reflection: reflect(
          "Miért nem kerekítjük 13-ra a 12,5-öt?",
          "Teljes csomagot csak rendelkezésre álló anyagból tölthetünk.",
          "13 csomaghoz 60 g-mal több anyag kellene.",
        ),
      },
    ),
    exercise(
      "mertekegysegek",
      "practice-9",
      "M–G09",
      "Ugyanannyi idő az 1,35 óra és az 1 óra 35 perc? Váltsd mindkettőt percre; add meg a különbséget és melyik hosszabb.",
      parts(
        part("decimal", "1,35 óra percben", number("81", "perc"), [
          ["95", "A 0,35 az óra törtrésze: 0,35 × 60 = 21 perc."],
        ]),
        part("clock", "1 óra 35 perc percben", number("95", "perc")),
        part("difference", "A két idő különbsége (perc)", number("14", "perc")),
        part(
          "longer",
          "Melyik hosszabb?",
          choice("clock", [
            ["decimal", "Az 1,35 óra."],
            ["clock", "Az 1 óra 35 perc."],
            ["equal", "Egyenlők."],
          ]),
        ),
      ),
      [
        "Az 1,35 órában a 0,35 egy óra része, nem percadat.",
        "Számold 0,35 × 60-at; a másik idő 60 + 35 perc.",
      ],
      steps(
        [
          "1,35 óra = 60 + 0,35 × 60 = 81 perc",
          "Egy óra 60 perc, ezért a tört részre is ezt használjuk.",
        ],
        [
          "1 óra 35 perc = 95 perc",
          "Az egész órát és a már percben adott részt összeadjuk.",
        ],
        ["95 − 81 = 14 perc", "A vegyes alakú adat hosszabb."],
        ["81 : 60 = 1,35 óra", "A fordított váltás visszaadja a tizedes órát."],
      ),
      "A tizedes törtrész mindig a mellé írt egységre vonatkozik.",
      { kind: "reason" },
    ),
    exercise(
      "mertekegysegek",
      "practice-10",
      "M–G10",
      "Állandó 72 km/h sebességű matematikai mozgásmodellben hány m/s a sebesség? Mennyi idő alatt tesz meg a jármű 250 métert? Gyorsítás és megállás nincs.",
      parts(
        part("speed", "Sebesség (m/s)", number("20", "m/s"), [
          [
            "259.2",
            "km/h-ról m/s-ra osztunk 3,6-del; nézd a 72 000 m és 3600 s kapcsolatát.",
          ],
        ]),
        part("time", "250 m ideje (s)", number("12.5", "s")),
      ),
      [
        "Írd a 72 km-t méterre, az egy órát másodpercre.",
        "Másodpercenként 72 000 : 3600 métert teszünk meg; a 250 m-t ezzel a sebességgel oszd.",
      ],
      steps(
        [
          "72 000 : 3600 = 20 m/s",
          "Mind a távolság, mind az idő egységét átváltottuk.",
        ],
        [
          "250 : 20 = 12,5 s",
          "Az idő a rögzített út és állandó sebesség hányadosa.",
        ],
        [
          "20 × 12,5 = 250 m; 20 × 3,6 = 72 km/h",
          "Az utat és az eredeti sebességet is visszakaptuk.",
        ],
      ),
      "A 3,6 a 3600 másodperc és 1000 méter kapcsolatából ered.",
      { kind: "transfer", difficulty: 3 },
    ),
    exercise(
      "mertekegysegek",
      "practice-11",
      "M–G11",
      "Egy kocka éle 2 cm, egy másiké 4 cm. Add meg mindkét felszínt és térfogatot, majd az él, felszín és térfogat változási tényezőjét. Egy kocka felszíne hat azonos négyzetlap területének összege.",
      parts(
        part(
          "surfaceSmall",
          "2 cm élű kocka felszíne (cm²)",
          number("24", "cm²"),
        ),
        part(
          "surfaceLarge",
          "4 cm élű kocka felszíne (cm²)",
          number("96", "cm²"),
        ),
        part(
          "volumeSmall",
          "2 cm élű kocka térfogata (cm³)",
          number("8", "cm³"),
        ),
        part(
          "volumeLarge",
          "4 cm élű kocka térfogata (cm³)",
          number("64", "cm³"),
        ),
        part("edgeFactor", "Élhossz tényezője", number("2")),
        part("surfaceFactor", "Felszín tényezője", number("4")),
        part("volumeFactor", "Térfogat tényezője", number("8"), [
          ["2", "A kocka három irányban kétszeres: 2 × 2 × 2."],
        ]),
      ),
      [
        "Felszín: hat lap, laponként él × él. Térfogat: három él szorzata.",
        "Számolj 6 × 2² és 2³, majd 6 × 4² és 4³ alakokkal; ezután képezd a hányadosokat.",
      ],
      steps(
        [
          "Kisebb kocka: 6 × 2² = 24 cm²; 2³ = 8 cm³",
          "A felszínt lapokból, a térfogatot három irányból számoljuk.",
        ],
        [
          "Nagyobb kocka: 6 × 4² = 96 cm²; 4³ = 64 cm³",
          "Ugyanazokat az összefüggéseket alkalmazzuk.",
        ],
        [
          "Él: 4/2 = 2; felszín: 96/24 = 4; térfogat: 64/8 = 8",
          "A különböző kiterjedések eltérő tényezővel változnak.",
        ],
      ),
      "Itt nagyítás történt: két külön tárgyat hasonlítunk; egységváltásnál a tárgy változatlan.",
      {
        kind: "reason",
        difficulty: 3,
        reflection: reflect(
          "Miben különbözik ez a feladat egy cm³ → dm³ átváltástól?",
          "Itt két különböző méretű kocka van.",
          "Egységváltásnál ugyanannak a kockának a térfogata marad változatlan.",
        ),
      },
    ),
    exercise(
      "mertekegysegek",
      "practice-12",
      "M–G12",
      "Valaki szerint „2 L folyadék tömege biztosan 2 kg”. Következik ez az egységekből? Ha az adott folyadék minden literének tömege 0,8 kg, mennyi 2 L tömege? Az anyagadat állandó; az edény tömegét nem számítjuk.",
      parts(
        part(
          "automatic",
          "Következik az általános állítás az egységekből?",
          yesNo(false),
          [
            [
              "yes",
              "A liter térfogatot, a kilogramm tömeget mér. Az anyagadat nélkül nincs egyértelmű tömeg.",
            ],
          ],
        ),
        part(
          "mass",
          "A megadott folyadék 2 literének tömege (kg)",
          number("1.6", "kg"),
          [
            [
              "2",
              "Használd az adott 0,8 kg/L anyagadatot: nem 1 kg jut egy literre.",
            ],
          ],
        ),
      ),
      [
        "A tömeg és a térfogat két külön mennyiség.",
        "Két literhez kétszer 0,8 kg tartozik a megadott anyag esetében.",
      ],
      steps(
        [
          "Az általános állítás nem következik",
          "Térfogatból anyagadat nélkül nem állapítható meg tömeg.",
        ],
        [
          "2 × 0,8 = 1,6 kg",
          "A konkrét adat alapján két egyforma liter tömegét összeadjuk.",
        ],
        ["1,6 : 2 = 0,8 kg/L", "A hányados egyezik az anyagadattal."],
      ),
      "Anyagadat alapján két mennyiséget kapcsoltunk össze; ez nem puszta egységváltás.",
      {
        kind: "reason",
        reflection: reflect(
          "Mi az a plusz adat, ami nélkül nem számolhatnánk?",
          "Az adott folyadék egy literének tömege, itt 0,8 kg.",
          "Az adatnak a teljes vizsgált mennyiségre érvényesnek kell lennie.",
        ),
      },
    ),
  ],
  exit: [
    exercise(
      "mertekegysegek",
      "exit-1",
      "M–Z01",
      "Egy téglalap alakú lap 1,4 m hosszú és 90 cm széles. Hány méter szalag kell a teljes kerületre, és mekkora a lefedendő terület cm²-ben? Átfedés, hulladék és vastagság nélkül számolunk.",
      parts(
        part("perimeter", "Szalag hossza (m)", number("4.6", "m")),
        part("area", "Lefedendő terület (cm²)", number("12600", "cm²"), [
          [
            "1.26",
            "Ez a terület négyzetméterben. A válaszmező négyzetcentimétert kér.",
          ],
        ]),
      ),
      [
        "Különítsd el a kerületet és a területet; mindkettőhöz közös egységet válassz.",
        "Kerületnél 90 cm = 0,9 m; területnél 1,4 m = 140 cm.",
      ],
      steps(
        [
          "K = 2 × (1,4 + 0,9) = 4,6 m",
          "A négy oldal hosszát méterben összeadjuk.",
        ],
        [
          "T = 140 × 90 = 12 600 cm²",
          "A centiméterben megadott oldalak szorzata négyzetcentimétert ad.",
        ],
        [
          "K = 460 cm = 4,6 m; T = 1,26 m² = 12 600 cm²",
          "Más közös egységgel mindkét mennyiséget ellenőrizzük.",
        ],
      ),
      "A szegély hossz, a fedés terület; más egységek kellenek.",
      {
        kind: "transfer",
        reflection: reflect(
          "Írd le, melyik számításhoz milyen közös egységet választottál.",
          "A kerülethez métert vagy utólag méterre váltott centimétert.",
          "A területhez centimétert vagy négyzetcentiméterre átváltott négyzetmétert.",
        ),
      },
    ),
    exercise(
      "mertekegysegek",
      "exit-2",
      "M–Z02",
      "Egy üres téglatest alakú edény belső méretei 20 cm × 15 cm × 30 cm. Öt, egyenként 1,5 L vizet tartalmazó palack teljes tartalmát beleöntjük veszteség nélkül. Mennyi az edény befogadóképessége? Megtelik-e, és még hány liter fér bele?",
      parts(
        part("capacity", "Befogadóképesség (L)", number("9", "L")),
        part("full", "Megtelik öt palacktól?", yesNo(false)),
        part("remaining", "Még beleférő víz (L)", number("1.5", "L")),
      ),
      [
        "A belső élek szorzata cm³-t ad; utána válts literre.",
        "20 × 15 × 30 cm³ az edény; 5 × 1,5 L a betöltött víz.",
      ],
      steps(
        [
          "20 × 15 × 30 = 9000 cm³ = 9 L",
          "A belső térfogat a befogadóképesség.",
        ],
        ["5 × 1,5 = 7,5 L", "Öt palack ismert vízmennyiségét összeadjuk."],
        ["9 − 7,5 = 1,5 L", "Nem telik meg; egy palacknyi hely marad."],
        ["6 × 1,5 = 9 L", "Hat palack éppen megtöltené."],
      ),
      "A térfogatszámítás után azonos egységben hasonlítsd össze a vizet és az edényt.",
      {
        kind: "transfer",
        reflection: reflect(
          "Adj az eredeti helyzethez kapcsolódó ellenőrzést.",
          "Hat ilyen palack 9 liter, pontosan az edény mérete.",
          "Öt után egy palacknyi, 1,5 liter hely marad.",
        ),
      },
    ),
  ],
  recap: [
    "Nevezd meg, milyen mennyiséget mérsz.",
    "Egységváltáskor a mennyiség változatlan; nagyításkor a tárgy is megváltozik.",
    "Hossznál egy, területnél két, térfogatnál három irányban számolunk.",
    "Az óra–perc és perc–másodperc váltószáma 60.",
    "Tömeg és térfogat összekapcsolásához anyagadat kell.",
    "Fordított váltással, másik közös egységgel vagy a részek összegével ellenőrizhetsz.",
  ],
  glossary: [
    {
      term: "Mérőszám",
      definition: "Megmondja, hány választott egységnyi a mennyiség.",
    },
    {
      term: "Mértékegység",
      definition:
        "A méréshez választott, meghatározott méretű egység; a számmal együtt ad mennyiséget.",
    },
    {
      term: "Váltószám",
      definition:
        "Az egyik egységben a másikból elférő mennyiség; iránytól függően szorzunk vagy osztunk vele.",
    },
    {
      term: "Terület",
      definition:
        "Két kiterjedési irányhoz tartozó mennyiség, négyzetes egységgel.",
    },
    {
      term: "Térfogat és űrtartalom",
      definition:
        "Három irányban kiterjedő belső tér; köbegységekben és literben is megadható.",
    },
    {
      term: "Összetett egység",
      definition:
        "Két mennyiség kapcsolatának egysége; például a m/s egy másodpercre jutó utat fejez ki.",
    },
  ],
};

export const foundationLessons: Lesson[] = [
  szamfogalom,
  muveletiSorrend,
  aranyossag,
  mertekegysegek,
];

/** This is task-level provenance, not a count of independent lesson units. */
export const foundationManuscriptMap = foundationLessons.flatMap((lesson) =>
  [lesson.prediction, ...lesson.practice, ...lesson.exit].map((item) => ({
    manuscriptId: item.manuscriptId!,
    exerciseId: item.id,
    topic: lesson.id,
    answerFields: item.answer.kind === "parts" ? item.answer.parts.length : 1,
  })),
);

import type {
  AnswerPart,
  Exercise,
  Lesson,
  ScalarAnswerSpec,
  TopicId,
} from "../types.ts";

/** Stable task IDs and field IDs also identify the corresponding manuscript paragraphs. */
type Skill =
  | "betu-helyettesites"
  | "egynemu-tagok"
  | "zarojel-felbontas"
  | "adatok-es-feltetelek"
  | "modellvalasztas"
  | "modell-ellenorzes"
  | "hatvany-jelentes"
  | "hatvany-elojel"
  | "nagysagrend"
  | "negyzetgyok-jelentes"
  | "gyok-becsles"
  | "pontos-kozelito";
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
const choose = (
  correct: string,
  options: [string, string][],
): ScalarAnswerSpec => ({
  kind: "choice",
  correct,
  options: options.map(([id, text]) => ({ id, text })),
});
const yesNo = (yes: boolean) =>
  choose(yes ? "yes" : "no", [
    ["yes", "Igen"],
    ["no", "Nem"],
  ]);
const field = (
  id: string,
  label: string,
  answer: ScalarAnswerSpec,
  skillIds: Skill[],
  mistakes: [string, string][] = [],
): AnswerPart => ({
  id,
  label,
  answer,
  skillIds,
  ...(mistakes.length
    ? { mistakes: mistakes.map(([input, feedback]) => ({ input, feedback })) }
    : {}),
});
// A checking part earns its own skill evidence only with correct prerequisite parts.
const needs = (part: AnswerPart, ...requiresParts: string[]): AnswerPart => ({
  ...part,
  requiresParts,
});
const prefixes: Partial<Record<TopicId, string>> = {
  "betus-kifejezesek": "BK05",
  "szoveges-modellek": "SM06",
  hatvanyok: "H07",
  negyzetgyok: "GY08",
};
function task(
  topic: TopicId,
  suffix: string,
  prompt: string,
  parts: AnswerPart[],
  hints: [string, string],
  solution: [string, string][],
  takeaway: string,
  reflection: { prompt: string; checkpoints: string[] },
  extra: Partial<Pick<Exercise, "kind" | "difficulty" | "context">> = {},
): Exercise {
  const manuscriptSuffix =
    suffix === "prediction"
      ? "J01"
      : suffix.startsWith("practice-")
        ? "G" + suffix.slice(9).padStart(2, "0")
        : "Z" + suffix.slice(5).padStart(2, "0");
  return {
    id: topic + "-" + suffix,
    topic,
    manuscriptId: prefixes[topic] + "-" + manuscriptSuffix,
    kind: "compute",
    difficulty: 2,
    prompt,
    answer: { kind: "parts", parts },
    skillIds: [...new Set(parts.flatMap((part) => part.skillIds ?? []))],
    hints,
    solution: solution.map(([expression, why]) => ({ expression, why })),
    takeaway,
    reflection,
    ...extra,
  };
}
const reflect = (prompt: string, ...checkpoints: string[]) => ({
  prompt,
  checkpoints,
});

const algebra: Lesson = {
  id: "betus-kifejezesek",
  moduleId: "M09",
  title: "Betűs kifejezések: mit őriz meg az átalakítás?",
  shortTitle: "Betűs kifejezések",
  question:
    "Miért helyettesíthet egy betű sok számot, és mikor vonhatunk össze két tagot?",
  teaser:
    "Helyettesíts, csoportosíts, bonts zárójelet; minden lépésnél őrizd meg az értéket.",
  description:
    "A betű számot jelöl. Először konkrét értékeket helyettesítünk, majd megértjük, mely átalakítások működnek minden megengedett értéknél. Az előjelet a taggal együtt visszük tovább.",
  goals: [
    "Megkülönbözteted a változót, az együtthatót, a tagot és az állandó tagot.",
    "Negatív számot és törtet is helyesen helyettesítesz a betű helyére.",
    "Csak az egynemű tagok együtthatóit adod össze.",
    "A teljes zárójelet szorzod meg; a zárójel előtti mínusz minden belső tagra hat.",
    "Behelyettesítéssel hibát keresel, és megkülönbözteted az ellenőrző példát az általános indoklástól.",
  ],
  prerequisites: [
    "Előjeles számok alapműveletei és műveleti sorrend.",
    "A szorzás és az összeadás különbsége; egyszerű törtek és tizedesek.",
  ],
  prerequisiteTopics: ["szamfogalom", "muveleti-sorrend", "tortek"],
  coveredUnits: ["M09.01", "M09.02", "M09.03", "M09.04", "M09.05"],
  estimateMinutes: 50,
  color: "#bad8f2",
  layer: "TÖRZS",
  nextTopic: "egyenlet",
  prediction: task(
    "betus-kifejezesek",
    "prediction",
    "Legyen a = 4. Ugyanazt jelenti-e a 3a + 2 és a 3(a + 2)? Számold ki mindkettőt, majd indokold az eltérést.",
    [
      field(
        "first",
        "3a + 2 értéke",
        num("14"),
        [S.substitute],
        [["18", "A +2 itt egyszer szerepel. Csak az a-t szorozzuk hárommal."]],
      ),
      field(
        "second",
        "3(a + 2) értéke",
        num("18"),
        [S.substitute, S.brackets],
        [
          [
            "14",
            "A zárójel három teljes a + 2 csomagot jelent: a +2 is háromszor szerepel.",
          ],
        ],
      ),
    ],
    [
      "Írd a 4-et minden a helyére. Hol van a zárójel?",
      "Az első kifejezés 3 × 4 + 2; a második 3 × (4 + 2).",
    ],
    [
      ["3 × 4 + 2 = 14", "A szorzás csak a 4-re vonatkozik."],
      ["3 × (4 + 2) = 3 × 6 = 18", "A teljes összeget szorozzuk hárommal."],
    ],
    "A zárójel megmondja, mire vonatkozik a művelet.",
    reflect(
      "Mondd el, hányszor szerepel a +2 a két kifejezésben.",
      "Az elsőben egyszer, a másodikban háromszor.",
      "A különbség nem a behelyettesítésből, hanem a kifejezés szerkezetéből ered.",
    ),
    { kind: "reason", difficulty: 1 },
  ),
  explanation: [
    {
      heading: "A betű helye megmarad, az értéke változhat",
      body: "A 4x − 3 kifejezésben az x egy szám helye. A 4x azt jelenti: 4 × x; nem a 4 és x számjegyeinek egymás mellé írását. Helyettesítéskor ugyanannak a betűnek minden előfordulása ugyanazt az értéket kapja. Egy másik betű más mennyiséget jelölhet.",
      formula: "x = −2 esetén: 4x − 3 = 4 × (−2) − 3 = −11",
    },
    {
      heading: "Az előjel a taghoz tartozik",
      body: "Az összeadás vagy kivonás által elválasztott részeket tagoknak nevezzük. A 3x − 2y + 5 felírható 3x + (−2y) + 5 alakban. Az x-es tag együtthatója 3, az y-osé −2; az állandó tag 5. Az x együtthatója 1, a −x-é −1.",
      formula: "3x − 2y + 5: három tag, köztük a −2y teljes egészében egy tag",
    },
    {
      heading: "Azonos fajta tagokat lehet összevonni",
      body: "A 3a + 2a öt darab ugyanabból az a mennyiségből: 5a. Az együtthatók adódnak össze, a betűs rész változatlan. A 3a és 2b általában nem egynemű; az a és a² sem az. Nem kell kitalálni a betű értékét ahhoz, hogy egynemű tagokat összevonjunk.",
      formula: "3a + 2a = (3 + 2)a = 5a",
      bullets: [
        "3a + 2b általában így marad.",
        "a + a = 2a, de a × a = a².",
        "2x − 2x = 0, bármely x-nél.",
      ],
    },
    {
      heading: "A szorzás minden belső tagra hat",
      body: "A 3(x + 4) három egyforma csomag összege. Mindegyikben van x és 4, ezért összesen 3x és 12. Területként is elképzelheted: egy 3 cm magas, (x + 4) cm széles téglalapot az x cm és 4 cm széles résznél kettévágva 3x cm² és 12 cm² területű részeket kapunk. Ez a rajz pozitív hosszakat feltételez; negatív számokra az előjeles műveletek szabálya adja az indoklást.",
      formula: "k(a + b) = ka + kb; k(a − b) = ka − kb",
    },
    {
      heading: "A mínusz a teljes zárójelet érinti",
      body: "Az 5 − (2x − 3) azt jelenti, hogy a teljes 2x − 3 mennyiséget vonjuk ki. Ez ugyanaz, mint a zárójel minden tagját −1-gyel szorozni: −2x + 3. A +5 megmarad, ezért az összevont alak 8 − 2x.",
      formula: "−(a − b) = −a + b",
      bullets: [
        "A −2(3x − 5) alakban a szorzó −2: az eredmény −6x + 10.",
        "A tagokat az előjelükkel együtt csoportosítsd.",
      ],
    },
    {
      heading: "Ellenőrző szám és általános indok",
      body: "Két alakba ugyanazt az értéket helyettesítve könnyen találhatunk hibát. Ha az eredmények eltérnek, az alakok nem azonosak minden x-re. Egy-két egyező példa önmagában még nem bizonyít azonosságot; az általános indok az alkalmazott műveleti szabály, például a szorzás széttagolása.",
      formula:
        "Egy ellenpélda cáfolhat; néhány egyező példa nem bizonyít minden esetet.",
    },
  ],
  examples: [
    {
      title: "Negatív érték behelyettesítése",
      prompt: "Mennyi 2a² − 3b, ha a = −2 és b = 3?",
      steps: [
        {
          expression: "2 × (−2)² − 3 × 3",
          why: "Az a és b minden helyére a megadott számot írjuk; a negatív számot zárójelezzük.",
        },
        {
          expression: "(−2)² = (−2) × (−2) = 4",
          why: "A hatvány alapja itt a teljes −2.",
        },
        {
          expression: "2 × 4 − 9 = 8 − 9 = −1",
          why: "A hatvány után végezzük a szorzásokat és a kivonást.",
        },
      ],
      check:
        "A két tag értéke 8 és −9, összegük −1. Ha a négyzetet −4-nek vennénk, más eredményhez jutnánk; ezért az alap zárójele lényeges.",
    },
    {
      title: "Két zárójel, kétféle előjel",
      prompt: "Vond össze: 3(x + 4) − (x − 2), majd ellenőrizd x = −3 esetén!",
      steps: [
        {
          expression: "3x + 12 − x + 2",
          why: "A 3 mindkét első tagot szorozza. A második zárójel előtt −1 áll.",
        },
        {
          expression: "(3x − x) + (12 + 2) = 2x + 14",
          why: "Külön vonjuk össze az x-es és az állandó tagokat.",
        },
        {
          expression: "x = −3: 2 × (−3) + 14 = 8",
          why: "Az összevont kifejezésbe behelyettesítünk.",
        },
      ],
      check:
        "Az eredeti alakban 3 × (−3 + 4) − (−3 − 2) = 3 − (−5) = 8. Az általános azonosságot a helyes zárójelbontás indokolja.",
      alternative: [
        {
          expression: "3x − x + 3 × 4 + 2",
          why: "A tagok előjelét megtartva más csoportosítás is ugyanarra az alakra vezet.",
        },
      ],
    },
  ],
  practice: [
    task(
      "betus-kifejezesek",
      "practice-1",
      "Számítsd ki a 4x − 3 értékét három különböző helyettesítéssel: x = 2, x = 0, x = −2.",
      [
        field(
          "positive",
          "x = 2 esetén",
          num("5"),
          [S.substitute],
          [["3", "A 4x szorzás, nem 4 + x. Az első művelet 4 × 2, nem 4 + 2."]],
        ),
        field(
          "zero",
          "x = 0 esetén",
          num("-3"),
          [S.substitute],
          [["0", "A 4x lesz nulla, a −3 állandó tag megmarad."]],
        ),
        field(
          "negative",
          "x = −2 esetén",
          num("-11"),
          [S.substitute],
          [["5", "A behelyettesített −2 előjelét is őrizd meg: 4 × (−2)."]],
        ),
      ],
      [
        "Mindháromszor ugyanazt a szerkezetet használd.",
        "A 4x rendre 8, 0 és −8; mindegyikből még 3-at vonunk ki.",
      ],
      [
        ["4 × 2 − 3 = 5", "A szorzás után vonunk ki."],
        ["4 × 0 − 3 = −3", "A betűs tag nulla, az állandó nem."],
        [
          "4 × (−2) − 3 = −11",
          "Negatívból pozitívat kivonva tovább csökken az érték.",
        ],
      ],
      "Helyettesítéskor a kifejezés szerkezetét és a szám előjelét is megőrizzük.",
      reflect(
        "Mi maradt ugyanaz a három számolásban?",
        "Mindig a megadott x-et szoroztuk néggyel, majd kivontunk hármat.",
        "Az állandó tag x = 0 esetén sem tűnik el.",
      ),
      { difficulty: 1 },
    ),
    task(
      "betus-kifejezesek",
      "practice-2",
      "Legyen a = −3 és b = 2. Add meg a 2a + b, az ab és az a² értékét.",
      [
        field(
          "sum",
          "2a + b",
          num("-4"),
          [S.substitute],
          [["-8", "A b értéke +2, ezért a −6-hoz kettőt hozzáadunk."]],
        ),
        field(
          "product",
          "ab",
          num("-6"),
          [S.substitute],
          [["-1", "Az ab az a × b szorzást jelöli, nem összeadást."]],
        ),
        field(
          "square",
          "a²",
          num("9"),
          [S.substitute],
          [["-9", "Az a helyére a teljes −3 kerül: (−3)² = (−3) × (−3)."]],
        ),
      ],
      [
        "Minden a helyére −3, minden b helyére 2 kerüljön.",
        "A három szerkezet: 2 × (−3) + 2; (−3) × 2; (−3) × (−3).",
      ],
      [
        ["−6 + 2 = −4", "Az első kifejezés összeg."],
        ["(−3) × 2 = −6", "Az egymás mellé írt betűk szorzatot jelölnek."],
        ["(−3)² = 9", "A negatív alapot kétszer szorozzuk össze."],
      ],
      "A betű helyettesítése nem változtatja meg, milyen művelet szerepel.",
      reflect(
        "Miért más az ab és az a², ha mindkettő szorzás?",
        "Az ab két külön megadott szám szorzata.",
        "Az a² ugyanazt az a számot használja két tényezőként.",
      ),
    ),
    task(
      "betus-kifejezesek",
      "practice-3",
      "Vond össze a 3a + 5a − 2a kifejezést egyetlen a-s taggá. Utána számítsd ki az értékét a = −2 esetén.",
      [
        field(
          "combined",
          "Összevont alak: egy szám szorozva a-val",
          expr("6a", "6*a", "a*6"),
          [S.collect],
          [
            [
              "a^6",
              "Összeadunk azonos fajta tagokat, nem hatványozunk. A kitevő nem az együtthatók összege.",
            ],
          ],
        ),
        field(
          "value",
          "Érték a = −2 esetén",
          num("-12"),
          [S.substitute],
          [["12", "A hat a értéke itt 6 × (−2), ezért negatív."]],
        ),
      ],
      [
        "Mindegyik tag ugyanolyan a-t tartalmaz.",
        "Az együttható 3 + 5 − 2; ezt szorozd a megadott a-val.",
      ],
      [
        [
          "3a + 5a − 2a = (3 + 5 − 2)a = 6a",
          "Az egynemű tagok együtthatóit vonjuk össze.",
        ],
        [
          "6 × (−2) = −12",
          "Behelyettesítéssel számoljuk ki az új alak értékét.",
        ],
      ],
      "Összevonáskor a betűs rész megmarad, az együttható változik.",
      reflect(
        "Hogyan magyaráznád az összevonást az a értékének ismerete nélkül?",
        "Három a és öt a együtt nyolc a.",
        "Ebből két a-t elvéve hat a marad.",
      ),
    ),
    task(
      "betus-kifejezesek",
      "practice-4",
      "A 4x + 3y − x + 2y összevonásakor add meg az x és az y együtthatóját. Mennyi az érték x = 2, y = −1 esetén?",
      [
        field(
          "x",
          "Az x együtthatója",
          num("3"),
          [S.collect],
          [
            [
              "7",
              "A 3y nem x-es tag. Csak a 4x és −x tartozik ebbe a csoportba.",
            ],
          ],
        ),
        field("y", "Az y együtthatója", num("5"), [S.collect]),
        field(
          "value",
          "Helyettesítési érték",
          num("1"),
          [S.substitute],
          [["11", "Az y értéke −1; az 5y ezért −5."]],
        ),
      ],
      [
        "Külön jelöld az x-es és y-os tagokat.",
        "Az új alak (4 − 1)x + (3 + 2)y.",
      ],
      [
        [
          "4x − x = 3x; 3y + 2y = 5y",
          "Csak azonos betűs részű tagokat vonunk össze.",
        ],
        [
          "3 × 2 + 5 × (−1) = 6 − 5 = 1",
          "Az új alakban is minden betű megkapja a saját értékét.",
        ],
      ],
      "Kétféle mennyiség együtthatóját külön kezeljük.",
      reflect(
        "Miért nem lesz az egész kifejezés 8xy?",
        "Az összeadás nem változik a változók szorzásává.",
        "Az x-es és y-os tagok külön csoportban maradnak.",
      ),
    ),
    task(
      "betus-kifejezesek",
      "practice-5",
      "Vond össze: 7a − 3 + 2a + 8. Add meg az a együtthatóját, az állandó tagot és az értéket a = −1 esetén.",
      [
        field("coefficient", "Az a együtthatója", num("9"), [S.collect]),
        field(
          "constant",
          "Állandó tag",
          num("5"),
          [S.collect],
          [["11", "A −3 előjele a tag része. Az állandó rész −3 + 8."]],
        ),
        field(
          "value",
          "Érték a = −1 esetén",
          num("-4"),
          [S.substitute],
          [["14", "A 9a helyére −9 kerül, majd hozzáadjuk az 5-öt."]],
        ),
      ],
      [
        "Válaszd külön a betűs és a betű nélküli tagokat.",
        "7a + 2a és −3 + 8 a két összevonható csoport.",
      ],
      [
        ["7a + 2a = 9a; −3 + 8 = 5", "Az előjelek a tagokkal együtt mozognak."],
        ["9a + 5 → 9 × (−1) + 5 = −4", "Az összevont alakban helyettesítünk."],
      ],
      "Az állandó tagok egymással, a betűs tagok a megfelelő fajtájukkal vonhatók össze.",
      reflect(
        "Miért nem módosítja az a együtthatóját a −3 és a +8?",
        "Nincs bennük a tényező.",
        "Külön állandó taggá adódnak össze.",
      ),
    ),
    task(
      "betus-kifejezesek",
      "practice-6",
      "Bontsd fel a 3(x + 4) zárójelet. Add meg az x együtthatóját, az állandó tagot, majd az értéket x = 2 esetén.",
      [
        field("coefficient", "Az x együtthatója", num("3"), [S.brackets]),
        field(
          "constant",
          "Állandó tag",
          num("12"),
          [S.brackets],
          [
            [
              "4",
              "A 3 a zárójel minden tagját szorozza; háromszor van benne a 4 is.",
            ],
          ],
        ),
        field("value", "Érték x = 2 esetén", num("18"), [S.substitute]),
      ],
      [
        "Képzelj el három egyforma x + 4 csomagot.",
        "A felbontás 3 × x + 3 × 4.",
      ],
      [
        ["3(x + 4) = 3x + 12", "A szorzást széttagoljuk a két összeadandóra."],
        ["3 × 2 + 12 = 18", "Az eredeti alak is 3 × 6 = 18."],
      ],
      "A külső szorzó minden belső tagra vonatkozik.",
      reflect(
        "Hogyan látható a három csomagból a 12?",
        "Mindhárom csomagban van négy állandó elem.",
        "A csomagok együtt három x-et és tizenkét állandó elemet tartalmaznak.",
      ),
    ),
    task(
      "betus-kifejezesek",
      "practice-7",
      "Bontsd fel és írd két összevont taggal: −2(3x − 5). Add meg az értékét x = −1 esetén is.",
      [
        field(
          "expanded",
          "Felbontott alak: x-es tag és állandó",
          expr("-6x+10", "-6*x+10", "10-6x", "10-6*x"),
          [S.brackets],
          [["-6x-10", "A −2 és a −5 szorzata pozitív. A második tag +10."]],
        ),
        field(
          "value",
          "Érték x = −1 esetén",
          num("16"),
          [S.substitute],
          [["4", "A −6x értéke x = −1 mellett +6, nem −6."]],
        ),
      ],
      [
        "A szorzó −2, az előjele is részt vesz mindkét szorzásban.",
        "Számold ki külön: (−2) × 3x és (−2) × (−5).",
      ],
      [
        ["−2(3x − 5) = −6x + 10", "Két negatív tényező szorzata pozitív."],
        ["−6 × (−1) + 10 = 16", "Az eredeti alakban −2 × (−8) is 16."],
      ],
      "A negatív külső szorzó előjelét egyik tagon sem hagyhatjuk el.",
      reflect(
        "Miért lesz az állandó tag pozitív?",
        "A belső állandó −5.",
        "Ezt −2-vel szorozzuk, így +10 lesz.",
      ),
    ),
    task(
      "betus-kifejezesek",
      "practice-8",
      "Vond össze az 5 − (2x − 3) kifejezést két taggá. Mennyi az értéke x = 4 esetén?",
      [
        field(
          "expanded",
          "Összevont alak: x-es tag és állandó",
          expr("-2x+8", "-2*x+8", "8-2x", "8-2*x"),
          [S.brackets, S.collect],
          [["2-2x", "A zárójel előtti mínusz miatt a belső −3-ból +3 lesz."]],
        ),
        field(
          "value",
          "Érték x = 4 esetén",
          num("0"),
          [S.substitute],
          [
            [
              "-6",
              "Az 5 − 2x − 3 alakban a második tag előjelváltása hiányzik.",
            ],
          ],
        ),
      ],
      [
        "A teljes 2x − 3 mennyiséget vonjuk ki.",
        "Előbb írd: 5 − 2x + 3; csak ezután vond össze az állandókat.",
      ],
      [
        [
          "5 − (2x − 3) = 5 − 2x + 3 = 8 − 2x",
          "A kivonás a zárójel mindkét tagját érinti.",
        ],
        ["8 − 2 × 4 = 0", "Ellenőrzés az eredeti alakban: 5 − (8 − 3) = 0."],
      ],
      "A zárójel előtti mínusz minden belső előjelet megváltoztat.",
      reflect(
        "Miért különbözik az 5 − 2x − 3 az eredeti kifejezéstől?",
        "Az eredetiben a −3-at is kivonjuk.",
        "Negatív mennyiség kivonása a pozitív ellentett hozzáadása.",
      ),
    ),
    task(
      "betus-kifejezesek",
      "practice-9",
      "Vond össze: 2(x + 3) + 3(x − 1). Add meg az x együtthatóját, az állandó tagot és az értéket x = 0,5 esetén.",
      [
        field("coefficient", "Az x együtthatója", num("5"), [
          S.brackets,
          S.collect,
        ]),
        field(
          "constant",
          "Állandó tag",
          num("3"),
          [S.brackets, S.collect],
          [["9", "A második csomag állandója −3, ezért 6 − 3-at számolunk."]],
        ),
        field(
          "value",
          "Érték x = 0,5 esetén",
          num("11/2"),
          [S.substitute],
          [["8", "Az 5x itt 5 × 0,5, azaz 2,5; ehhez adódik a 3."]],
        ),
      ],
      [
        "Mindkét zárójelet a saját külső szorzójával bontsd fel.",
        "2x + 6 + 3x − 3 keletkezik.",
      ],
      [
        [
          "2x + 6 + 3x − 3 = 5x + 3",
          "Az x-es és állandó tagokat külön vonjuk össze.",
        ],
        [
          "5 × 0,5 + 3 = 2,5 + 3 = 5,5",
          "A tizedes értéket is ugyanúgy helyettesítjük.",
        ],
      ],
      "Több zárójel után a tagok előjeles csoportosítása segít.",
      reflect(
        "Hogyan ellenőriznéd az 5,5-öt az eredeti alakban?",
        "2 × 3,5 = 7.",
        "3 × (−0,5) = −1,5; a két érték összege 5,5.",
      ),
    ),
    task(
      "betus-kifejezesek",
      "practice-10",
      "Különítsd el az a + a és az a × a műveletet. Az elsőt egyetlen a-s taggal, a másodikat hatvánnyal írd fel; számítsd ki mindkettőt a = 3 esetén.",
      [
        field(
          "sumForm",
          "a + a összevont alakja",
          expr("2a", "2*a", "a*2"),
          [S.collect],
          [
            [
              "a^2",
              "Az összeadásból 2a lesz; a négyzet két tényező szorzatát jelöli.",
            ],
          ],
        ),
        field(
          "productForm",
          "a × a hatványalakja",
          expr("a^2", "(a)^2"),
          [S.collect],
          [["2a", "A két a most tényező, nem összeadandó."]],
        ),
        field("sumValue", "a + a értéke a = 3-nál", num("6"), [S.substitute]),
        field("productValue", "a × a értéke a = 3-nál", num("9"), [
          S.substitute,
        ]),
      ],
      [
        "Azonos betűk között is számít a műveleti jel.",
        "Az elsőben 3 + 3, a másodikban 3 × 3 szerepel.",
      ],
      [
        ["a + a = 2a → 6", "Két egyforma összeadandó."],
        ["a × a = a² → 9", "Két egyforma tényező."],
      ],
      "Az egynemű tagok összevonása nem ugyanaz, mint a hatványozás.",
      reflect(
        "Elég-e az a = 2 próba a különbség kimutatására?",
        "Ott véletlenül 2 + 2 = 2 × 2 = 4.",
        "Az a = 3 ellenpélda megmutatja, hogy az alakok nem általában azonosak.",
      ),
      { kind: "reason" },
    ),
    task(
      "betus-kifejezesek",
      "practice-11",
      "Egy téglalap oldalai 3 cm és (x + 2) cm, ahol x pozitív. Írd fel a kerületet és a területet két összevont taggal. Add meg mindkettőt x = 4 esetén.",
      [
        field(
          "perimeterForm",
          "Kerület mérőszámának összevont alakja",
          expr("2x+10", "2*x+10", "10+2x", "10+2*x"),
          [S.brackets, S.collect],
          [["2x+5", "Mindkét oldalhossz kétszer szerepel a kerületben."]],
        ),
        field(
          "areaForm",
          "Terület mérőszámának összevont alakja",
          expr("3x+6", "3*x+6", "6+3x", "6+3*x"),
          [S.brackets],
          [["3x+2", "A 3 a teljes x + 2 oldalt szorozza."]],
        ),
        field("perimeter", "Kerület x = 4 esetén", num("18", "cm"), [
          S.substitute,
        ]),
        field("area", "Terület x = 4 esetén", num("18", "cm²"), [S.substitute]),
      ],
      [
        "A kerület a négy oldal összege; a terület két szomszédos oldal szorzata.",
        "K = 2 × [3 + (x + 2)]; T = 3(x + 2). Az alakok mezőibe az egység nélküli kifejezést írd.",
      ],
      [
        ["K = 2x + 10; T = 3x + 6", "A két mennyiséget más művelet írja le."],
        ["x = 4: oldalak 3 cm és 6 cm", "Konkrét téglalapot kapunk."],
        [
          "K = 18 cm; T = 18 cm²",
          "Azonos mérőszám mellett is más mennyiségekről van szó.",
        ],
      ],
      "A képlet mellett a mennyiség és az egység is a jelentés része.",
      reflect(
        "Miért nem jelenti a két 18, hogy a kerület és a terület ugyanaz?",
        "Az egyik hosszt, a másik felületet mér.",
        "Az egységek cm és cm²; a mérőszámok egyezése itt véletlen.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
    task(
      "betus-kifejezesek",
      "practice-12",
      "Valaki ezt írja: 4(x + 1) = 4x + 1 minden x-re. Ellenőrizd x = 0-val, majd írd le a bal oldal helyes, felbontott alakját.",
      [
        field("left", "4(x + 1) értéke x = 0-nál", num("4"), [S.substitute]),
        field("right", "4x + 1 értéke x = 0-nál", num("1"), [S.substitute]),
        field(
          "correctForm",
          "A bal oldal helyes felbontott alakja",
          expr("4x+4", "4*x+4", "4+4x", "4+4*x"),
          [S.brackets],
          [
            [
              "4x+1",
              "A +1 minden csomagban szerepel, ezért összesen +4-et ad.",
            ],
          ],
        ),
      ],
      [
        "A két oldalba ugyanazt a nullát helyettesítsd.",
        "A bal oldalon 4 × (0 + 1), a jobbon 4 × 0 + 1 áll.",
      ],
      [
        [
          "Bal oldal 4, jobb oldal 1",
          "Egyetlen eltérés elég a minden x-re szóló állítás cáfolatához.",
        ],
        ["4(x + 1) = 4x + 4", "A szorzás mindkét belső tagra hat."],
      ],
      "Ellenpéldával hibát mutatunk ki; a helyes általános alakot a műveleti szabály adja.",
      reflect(
        "Miért volt elég egyetlen helyettesítés az állítás megcáfolásához?",
        "Az állítás minden x-re szólt.",
        "Az x = 0 megengedett érték, és ott az oldalak eltérnek.",
      ),
      { kind: "reason" },
    ),
  ],
  exit: [
    task(
      "betus-kifejezesek",
      "exit-1",
      "Vond össze két taggá: 4(2x − 3) − 3(x + 1). Számítsd ki az értékét x = −2 és x = 3 esetén.",
      [
        field(
          "form",
          "Összevont alak: x-es tag és állandó",
          expr("5x-15", "5*x-15", "-15+5x", "-15+5*x"),
          [S.brackets, S.collect],
          [["5x-9", "A második zárójelet −3 szorozza: az állandó tagja −3."]],
        ),
        field("negative", "Érték x = −2 esetén", num("-25"), [S.substitute]),
        field("positive", "Érték x = 3 esetén", num("0"), [S.substitute]),
      ],
      [
        "Bontsd fel mindkét zárójelet az előjeles szorzóval.",
        "8x − 12 − 3x − 3 az első felbontott sor.",
      ],
      [
        [
          "8x − 12 − 3x − 3 = 5x − 15",
          "Az x-es és állandó tagok külön csoportosulnak.",
        ],
        [
          "x = −2: −10 − 15 = −25; x = 3: 15 − 15 = 0",
          "Mindkét megadott értéket behelyettesítjük.",
        ],
      ],
      "A biztos zárójelbontás és a helyettesítés együtt ad ellenőrizhető megoldást.",
      reflect(
        "Hogyan ellenőriznéd a nullát az eredeti alakban?",
        "x = 3 esetén az első tag 4 × 3 = 12.",
        "A második tag 3 × 4 = 12; különbségük nulla.",
      ),
      { difficulty: 3 },
    ),
    task(
      "betus-kifejezesek",
      "exit-2",
      "Három belépő darabonként (p + 200) Ft, további két belépő darabonként p Ft. Nincs más költség. A teljes ár összevont alakjában mennyi p együtthatója és az állandó tag? Mennyi az ár p = 800 esetén?",
      [
        field("coefficient", "p együtthatója a teljes árban", num("5"), [
          S.brackets,
          S.collect,
        ]),
        field(
          "constant",
          "Állandó tag (Ft)",
          num("600", "Ft"),
          [S.brackets],
          [["200", "A 200 Ft három belépőnél is szerepel."]],
        ),
        field(
          "price",
          "Teljes ár p = 800 esetén",
          num("4600", "Ft"),
          [S.substitute],
          [["4200", "A felár nem egyszeri: háromszor 200 Ft."]],
        ),
      ],
      [
        "Írd fel: 3(p + 200) + 2p.",
        "Az összeg 3p + 600 + 2p; vond össze a p-s tagokat.",
      ],
      [
        ["3(p + 200) + 2p = 5p + 600", "Öt alapár és három felár szerepel."],
        [
          "5 × 800 + 600 = 4600 Ft",
          "Az összevont alakban egyszerű a helyettesítés.",
        ],
        [
          "3 × 1000 + 2 × 800 = 4600 Ft",
          "Az eredeti történet külön tételei is ugyanezt adják.",
        ],
      ],
      "A zárójel valódi csomagot is jelölhet; minden csomag állandó része számít.",
      reflect(
        "Miért 600 Ft az állandó rész?",
        "Három drágább belépőnél van 200 Ft felár.",
        "A két p Ft-os belépőben nincs ilyen felár.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
  ],
  recap: [
    "Ugyanaz a betű egy helyettesítésen belül ugyanazt a számot jelöli.",
    "A tag előjelét együtt visszük a taggal.",
    "Egynemű tagoknál az együtthatókat vonjuk össze; az a és a² különböző fajta.",
    "A külső szorzó a zárójel minden tagjára hat.",
    "Egy ellenpélda cáfolhat; általános azonossághoz jogos átalakítás kell.",
  ],
  glossary: [
    {
      term: "Változó",
      definition:
        "Betűvel jelölt szám, amely különböző megengedett értékeket vehet fel.",
    },
    {
      term: "Helyettesítési érték",
      definition:
        "A kifejezés eredménye, amikor minden betűnek megadtuk az értékét.",
    },
    {
      term: "Tag",
      definition: "Egy összeg előjeles része; például a 3x − 2-ben 3x és −2.",
    },
    {
      term: "Együttható",
      definition: "A betűs részt szorzó szám; a −x együtthatója −1.",
    },
    {
      term: "Egynemű tagok",
      definition:
        "Azonos betűs részű tagok, például 2x és −5x. Az x és x² nem egynemű.",
    },
    {
      term: "Disztributivitás",
      definition:
        "A szorzás széttagolhatósága összegre vagy különbségre: k(a + b) = ka + kb.",
    },
    {
      term: "Azonosság",
      definition:
        "Olyan egyenlőség, amely minden megengedett helyettesítésnél igaz.",
    },
  ],
};

const models: Lesson = {
  id: "szoveges-modellek",
  moduleId: "M12",
  title: "Szöveges feladatok: a történettől a modellig",
  shortTitle: "Szövegből modell",
  question:
    "Mit keresünk, milyen feltételekkel, és melyik számolás mondja ugyanazt, mint a történet?",
  teaser:
    "Válaszd ki az adatokat, nevezd meg az ismeretlent, majd ellenőrizd a történetben.",
  description:
    "Szakaszábrával, táblázattal, próbálgatással vagy egyenlettel írunk le helyzeteket. A számolás előtt tisztázzuk a feltételeket; a végén azt is vizsgáljuk, hogy a kapott szám lehet-e válasz a kérdésre.",
  goals: [
    "Különválasztod az adatot, kérdést, feltételt és felesleges információt.",
    "Megnevezed, mit jelöl az ismeretlen, és milyen egységben mérjük.",
    "Szakaszábrát, táblázatot vagy egyenletet kapcsolsz a történethez.",
    "Felismered a hiányos vagy egymásnak ellentmondó adatokat.",
    "Ellenőrzöd az összeget, különbséget, egységet és a darabszámra vonatkozó feltételt.",
  ],
  prerequisites: [
    "Betűs kifejezés és egyszerű egyenlet jelentése.",
    "Arányok, mértékegységek és a tizedes vagy tört alakú válasz értelmezése.",
  ],
  prerequisiteTopics: [
    "betus-kifejezesek",
    "egyenlet",
    "aranyossag",
    "mertekegysegek",
  ],
  coveredUnits: ["M12.01", "M12.02", "M12.03", "M12.04", "M12.06", "M12.07"],
  estimateMinutes: 60,
  color: "#f4d8a0",
  layer: "TÖRZS",
  nextTopic: "grafikon",
  prediction: task(
    "szoveges-modellek",
    "prediction",
    "Három egyforma árú jegy és egyszeri 300 Ft foglalási díj együtt 2700 Ft. Mennyi jut a három jegyre, és mennyi egy jegy ára?",
    [
      field(
        "tickets",
        "A három jegy ára együtt (Ft)",
        num("2400", "Ft"),
        [S.data, S.model],
        [["2700", "A 2700 Ft-ban az egyszeri foglalási díj is benne van."]],
      ),
      field(
        "one",
        "Egy jegy ára (Ft)",
        num("800", "Ft"),
        [S.model],
        [
          [
            "900",
            "Így a foglalási díjat is három jegyárként osztanád szét. Előbb vond le az egyszeri díjat.",
          ],
        ],
      ),
    ],
    [
      "A teljes összeg kétféle költségből áll.",
      "A jegyekre 2700 − 300 Ft marad; ezt osztjuk három egyenlő részre.",
    ],
    [
      ["2700 − 300 = 2400 Ft", "Az egyszeri költség nem egy jegy része."],
      ["2400 : 3 = 800 Ft", "A jegyek egyforma árúak."],
      ["3 × 800 + 300 = 2700 Ft", "A történet teljes összegét kaptuk vissza."],
    ],
    "A műveletet a költségek kapcsolata, nem pusztán a szövegben szereplő számok választják ki.",
    reflect(
      "Miért kell előbb kivonni és csak azután osztani?",
      "A 300 Ft az egész vásárláshoz egyszer tartozik.",
      "A megmaradt összeget viselik egyenlően a jegyek.",
    ),
    { kind: "reason", difficulty: 1 },
  ),
  explanation: [
    {
      heading: "A kérdés jelöli ki a célt",
      body: "Előbb saját szavaiddal mondd el, mit keresel. Írd a mennyiség mellé az egységét. Az x = egy jegy ára forintban pontosabb megállapodás, mint az, hogy x az ismeretlen. Egy darabszám lehet, hogy csak nemnegatív egész; egy hossz viszont lehet tört is.",
      formula: "x: egy jegy ára, Ft-ban; n: buszok száma, pozitív egész",
    },
    {
      heading: "Az adatoknak szerepük van",
      body: "Nem minden számot kell felhasználni. Egy tollakra vonatkozó adat nem módosítja a külön megadott füzetvásárlás árát. Máskor egyetlen adat hiányzik a megoldáshoz: a téglalap egyik oldala nem határozza meg a területét. Két különböző megengedett példa megmutathatja, hogy nincs egyértelmű válasz.",
      bullets: [
        "Mit tudunk biztosan?",
        "Mi a kapcsolat az adatok között?",
        "Mit kellene még tudnunk?",
        "Lehet-e egyszerre igaz az összes közölt adat?",
      ],
    },
    {
      heading: "A szakaszábra az összeg és a különbség modellje",
      body: "Ha két hossz összege 34 cm és különbsége 6 cm, a hosszabb két részből áll: egy a rövidebbel egyenlő részből és 6 cm többletből. A 6 cm elvétele után két egyenlő szakasz marad. Ugyanezt írja le az x + (x + 6) = 34 egyenlet.",
      formula: "rövidebb: x; hosszabb: x + 6; együtt: 2x + 6",
    },
    {
      heading: "A módszert a kapcsolathoz válaszd",
      body: "Az egyenlet tömören őriz egy kapcsolatot. A táblázat több összetartozó érték vizsgálatát segíti. A szakaszábra láthatóvá teszi az egyenlő részeket. Rendszeres próbálgatás is lehet jó út, ha minden tippnél ugyanazokat a feltételeket ellenőrizzük. Több módszer is lehet jogos; indokold, miért használható a választottad.",
      bullets: [
        "Egyenlő részek és többlet: szakaszábra vagy egyenlet.",
        "Idővel állandó ütemben változó mennyiség: táblázat és szabály.",
        "Kevés megengedett egész eset: rendezett próbálgatás.",
        "A rajz, a táblázat és az egyenlet ugyanazt a történetet kell hogy leírja.",
      ],
    },
    {
      heading: "Az állandó ütem feltétel",
      body: "Az út = sebesség × idő kapcsolatban az adott sebesség csak akkor használható közvetlenül, ha arra az egész időre érvényes. A 60 km-t 45 perc alatt megtevő, végig egyenletesen haladó jármű sebességét azonos időegységgel számoljuk. A párhuzamos csapok munkamodellje azonos, állandó vízhozamot és közös szűk keresztmetszet hiányát feltételezi.",
      formula: "45 perc = 3/4 óra; 60 : (3/4) = 80 km/h",
    },
    {
      heading: "A számolás után térj vissza a történethez",
      body: "A megoldásnak teljesítenie kell minden feltételt. Az összeg helyessége mellett a különbséget is ellenőrizd. Buszokból vagy bontatlan csomagokból nem vásárolhatunk tetszőleges törtrészt: itt a legkisebb megfelelő egész számot keressük. A feltételek döntik el, mikor kell felfelé egészre váltani; ez nem minden számolás általános kerekítési szabálya.",
      formula: "113 tanuló, 48 férőhely/busz: 2 busz kevés, 3 elég",
    },
    {
      heading: "Néha a helyes eredmény a hiány felismerése",
      body: "Ha 3 termék darabonként 300 Ft, kedvezmény és egyéb költség nélkül, akkor az összeg nem lehet 850 Ft. Ilyenkor nem egy új művelettel kell mindenáron számot gyártani: jelezni kell az ellentmondást. Ha csak egy téglalap 12 cm-es oldalát ismerjük, több terület is lehetséges.",
      formula:
        "A hiányzó vagy ellentmondó adat felismerése is matematikai megoldás.",
    },
  ],
  examples: [
    {
      title: "Az egyszeri díjat különválasztjuk",
      prompt:
        "Négy egyforma belépő és egyszeri 300 Ft kezelési díj együtt 3500 Ft. Mennyibe kerül egy belépő?",
      steps: [
        {
          expression: "x: egy belépő ára, Ft-ban",
          why: "Az ismeretlen jelentését és egységét rögzítjük.",
        },
        {
          expression: "4x + 300 = 3500",
          why: "Négy azonos árhoz egyszer adjuk a kezelési díjat.",
        },
        {
          expression: "4x = 3200; x = 800",
          why: "Előbb az egyszeri részt vesszük el, majd négy egyenlő részre osztunk.",
        },
      ],
      check:
        "4 × 800 Ft + 300 Ft = 3500 Ft. A 800 Ft pozitív ár, és az eredeti teljes költséget kapjuk vissza.",
      alternative: [
        {
          expression: "(3500 − 300) : 4 = 800",
          why: "Az egyenlet lépései egyetlen aritmetikai kifejezésbe is összefoglalhatók.",
        },
      ],
    },
    {
      title: "Két szakasz összege és különbsége",
      prompt:
        "Két szalag összesen 54 cm. Az egyik 10 cm-rel hosszabb a másiknál. Mekkora a két hossz?",
      steps: [
        {
          expression: "Rövidebb: x; hosszabb: x + 10",
          why: "A különbség ugyanahhoz a rövidebb hosszhoz képest adott.",
        },
        {
          expression: "x + (x + 10) = 54",
          why: "A két szakasz összege az ismert teljes hossz.",
        },
        {
          expression: "54 − 10 = 44; 44 : 2 = 22 cm",
          why: "A többletet levéve két egyenlő szakasz marad.",
        },
        {
          expression: "Hosszabb: 22 + 10 = 32 cm",
          why: "Visszaadjuk a hosszabb szakasz többletét.",
        },
      ],
      check:
        "22 + 32 = 54 és 32 − 22 = 10. Mindkét feltétel teljesül; önmagában az összeg ellenőrzése kevés volna.",
    },
  ],
  practice: [
    task(
      "szoveges-modellek",
      "practice-1",
      "Négy egyforma füzet és egyszeri 500 Ft szállítás együtt 2300 Ft. x egy füzet ára Ft-ban. Írd fel az eredeti teljes költség egyenletét, majd számítsd ki x-et és ellenőrizd az összeget.",
      [
        field(
          "equation",
          "Teljes költség balra, 2300 jobbra",
          expr(
            "4x+500=2300",
            "4*x+500=2300",
            "500+4x=2300",
            "500+4*x=2300",
            "x*4+500=2300",
          ),
          [S.data, S.model],
          [
            [
              "4*(x+500)=2300",
              "A szállítás egyszeri költség, nem mind a négy füzethez külön tartozik.",
            ],
          ],
        ),
        field("price", "Egy füzet ára (Ft)", num("450", "Ft", "x"), [S.model]),
        needs(
          field("total", "Ellenőrzött teljes összeg (Ft)", num("2300", "Ft"), [
            S.check,
          ]),
          "equation",
          "price",
        ),
      ],
      [
        "Válaszd külön a füzetek árát az egyszeri költségtől.",
        "4x = 2300 − 500 = 1800. A modellmezőben az eredeti összefüggést kérjük, a megoldás előtti alakban.",
      ],
      [
        ["4x + 500 = 2300", "Négy egyforma ár és egyetlen szállítás szerepel."],
        [
          "x = 1800 : 4 = 450 Ft",
          "A füzetekre jutó összeget négy egyenlő részre osztjuk.",
        ],
        ["4 × 450 + 500 = 2300 Ft", "A teljes összeget ellenőrizzük."],
      ],
      "A modellben annak is látszania kell, melyik költség egyszeri.",
      reflect(
        "Miben lenne más a 4(x + 500) története?",
        "Az 500 Ft mind a négy csomagban szerepelne.",
        "Ez összesen 2000 Ft kiegészítő díj lenne, nem 500.",
      ),
    ),
    task(
      "szoveges-modellek",
      "practice-2",
      "Két zsinór összesen 34 cm. A hosszabb 6 cm-rel hosszabb a rövidebbnél. x a rövidebb hossza cm-ben. Írd fel az összeg egyenletét, majd add meg mindkét hosszt.",
      [
        field(
          "equation",
          "A két hossz összege balra, 34 jobbra",
          expr(
            "x+(x+6)=34",
            "x+x+6=34",
            "(x+6)+x=34",
            "2x+6=34",
            "2*x+6=34",
            "6+2x=34",
            "6+2*x=34",
          ),
          [S.model],
          [
            [
              "x+6=34",
              "A 34 cm a két zsinór összege, nem a hosszabb hossza önmagában.",
            ],
          ],
        ),
        field("short", "Rövidebb (cm)", num("14", "cm", "x"), [
          S.data,
          S.model,
        ]),
        field(
          "long",
          "Hosszabb (cm)",
          num("20", "cm"),
          [S.model],
          [["17", "A két hossz nem egyenlő: a különbségük 6 cm."]],
        ),
      ],
      [
        "Rajzolj két egyenlő részt, és a hosszabbhoz még 6 cm-t.",
        "Ha a 34-ből elvesszük a 6 többletet, 28 cm marad két egyenlő részre.",
      ],
      [
        ["2x + 6 = 34; 2x = 28; x = 14", "Az összegből levonjuk a többletet."],
        ["14 + 6 = 20 cm", "A hosszabb a rövidebbnél hattal több."],
        ["14 + 20 = 34; 20 − 14 = 6", "Az összeg és a különbség is teljesül."],
      ],
      "Két feltételhez két ellenőrzés tartozik.",
      reflect(
        "Magyarázd el szakaszábrával vagy egyenlettel, miért nem jó a 17 cm és 17 cm. Miért ezt a módszert választottad?",
        "Az összegük 34 cm, de a különbségük nulla.",
        "A szakaszábrán a 6 cm többlet látszik; az egyenlet ugyanezt x + (x + 6) alakban őrzi.",
        "A választott módszernek az összeg és a különbség feltételét is meg kell mutatnia.",
      ),
    ),
    task(
      "szoveges-modellek",
      "practice-3",
      "Egy gyerek és az apja most együtt 48 évesek. Az apa most háromszor annyi idős, mint a gyerek. Hány éves most a gyerek, hány az apa, és hányszor annyi idős lesz az apa négy év múlva?",
      [
        field(
          "child",
          "Gyerek életkora most (év)",
          num("12", "év"),
          [S.data, S.model],
          [
            [
              "16",
              "A teljes összeg négy egyenlő rész: a gyerek egy, az apa három rész.",
            ],
          ],
        ),
        field("father", "Apa életkora most (év)", num("36", "év"), [S.model]),
        needs(
          field(
            "laterRatio",
            "Apa / gyerek életkor négy év múlva",
            num("5/2"),
            [S.check],
            [
              [
                "3",
                "Négy évet mindkettejükhöz hozzáadunk; az életkorok aránya ettől változik.",
              ],
            ],
          ),
          "child",
          "father",
        ),
      ],
      [
        "Jelöld a gyerek életkorát x-szel: az apáé 3x.",
        "Most 4x = 48. Négy év múlva 12 + 4 és 36 + 4 lesz az életkoruk.",
      ],
      [
        ["x = 48 : 4 = 12; 3x = 36", "A két életkor együtt négy egyenlő rész."],
        [
          "Négy év múlva: 16 és 40 év",
          "Ugyanannyi idő telik el mindkettejüknél.",
        ],
        [
          "40 : 16 = 5/2 = 2,5",
          "A háromszoros kapcsolat csak a megadott jelenre vonatkozott.",
        ],
      ],
      "A szövegben szereplő időpont a feltétel része.",
      reflect(
        "Mi marad állandó, ha mindkét életkorhoz négy évet adunk?",
        "A 24 éves korkülönbség.",
        "Az arány nem marad három, mert az összeadás más arányban változtatja az életkorokat.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
    task(
      "szoveges-modellek",
      "practice-4",
      "Egy elég nagy tartályban kezdetben 5 L víz van. Percenként állandóan 3 L érkezik, és semmi nem folyik ki. Add meg a 0 és 4 perchez tartozó mennyiséget, valamint azt, hány perc után lesz benne 20 L.",
      [
        field(
          "start",
          "0 percnél (L)",
          num("5", "L"),
          [S.data],
          [["0", "A 0 perc az idő kezdete, nem üres tartályt jelent."]],
        ),
        field(
          "four",
          "4 percnél (L)",
          num("17", "L"),
          [S.model],
          [["12", "A 12 L csak a beérkező víz. Az induló 5 L is bent marad."]],
        ),
        field(
          "time",
          "A 20 L eléréséhez szükséges idő (perc)",
          num("5", "perc"),
          [S.model],
        ),
      ],
      [
        "A teljes víz az induló víz és a beérkező víz összege.",
        "V = 5 + 3t. A 20 L-hez még 15 L-nek kell beérkeznie.",
      ],
      [
        [
          "t = 0: 5 + 3 × 0 = 5 L",
          "A kezdőértéket is feltüntetjük a táblázatban.",
        ],
        ["t = 4: 5 + 3 × 4 = 17 L", "Az állandó ütem négy percen át érvényes."],
        ["(20 − 5) : 3 = 5 perc", "Öt perc alatt 15 L új víz érkezik."],
      ],
      "A táblázatnak és a szabálynak a kezdőértéket is őriznie kell.",
      reflect(
        "Mely feltételek mellett használhatjuk a V = 5 + 3t szabályt?",
        "A befolyás végig 3 L/perc és nincs kifolyás.",
        "A tartály elég nagy, így nem folyik túl a vizsgált időben.",
      ),
    ),
    task(
      "szoveges-modellek",
      "practice-5",
      "Egy jármű egyenes szakaszon, megállás nélkül, végig állandó sebességgel 60 km-t tesz meg 45 perc alatt. Hány óra a 45 perc, mennyi a sebesség km/h-ban, és mekkora utat tesz meg ugyanígy 20 perc alatt? Pontos értéket adj.",
      [
        field(
          "hours",
          "45 perc órában",
          num("3/4", "h"),
          [S.data],
          [["0.45", "Az óra 60 perc, nem 100. A 45 perc 45/60 óra."]],
        ),
        field("speed", "Sebesség (km/h)", num("80", "km/h"), [S.model]),
        field(
          "distance",
          "20 perc alatti út (km)",
          num("80/3", "km"),
          [S.model],
          [["1600", "A 20 percet a km/h sebességhez órára kell váltani."]],
        ),
      ],
      [
        "A sebesség egységében óra szerepel, ezért az időket is órában add meg.",
        "45 perc = 3/4 h; 20 perc = 1/3 h. A sebesség út osztva idővel.",
      ],
      [
        [
          "60 : (3/4) = 80 km/h",
          "Az azonos egységben megadott időre számolunk.",
        ],
        ["80 × (1/3) = 80/3 km", "A 20 perc egyharmad óra."],
        [
          "(80/3) × (45/20) = 60 km",
          "Az állandó sebesség modelljében az utak aránya az idők aránya.",
        ],
      ],
      "A modellfeltétel és az egységváltás együtt teszi jogossá a számolást.",
      reflect(
        "Miért nem írhatnánk le ugyanezt automatikusan egy megállásokat tartalmazó út minden részére?",
        "A feltételezett sebesség akkor nem lenne végig állandó.",
        "Az egész útra számolt átlagsebesség nem mondja meg minden részszakasz sebességét.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
    task(
      "szoveges-modellek",
      "practice-6",
      "Két teljes árú és három félárú jegy együtt 2800 Ft. Minden félárú jegy a teljes ár felébe kerül, más költség nincs. x a teljes jegyár Ft-ban. Írd fel a teljes költség egyenletét, majd add meg a kétféle jegyárat.",
      [
        field(
          "equation",
          "Teljes költség balra, 2800 jobbra",
          expr(
            "2x+3*(x/2)=2800",
            "2*x+3*(x/2)=2800",
            "2x+3*x/2=2800",
            "2*x+3*x/2=2800",
            "2x+3x/2=2800",
            "3.5x=2800",
            "3.5*x=2800",
            "(2+3/2)*x=2800",
            "7x/2=2800",
            "7*x/2=2800",
          ),
          [S.data, S.model],
          [
            [
              "5x=2800",
              "A három félárú jegy nem teljes x Ft-os; egyenként x/2 Ft-ba kerül.",
            ],
          ],
        ),
        field("full", "Teljes árú jegy (Ft)", num("800", "Ft", "x"), [S.model]),
        field("half", "Félárú jegy (Ft)", num("400", "Ft"), [S.model]),
      ],
      [
        "A három félárú jegy együtt másfél teljes jegy árának felel meg.",
        "Összesen 2 + 3/2 = 7/2 teljes árnyi költség szerepel.",
      ],
      [
        [
          "(7/2)x = 2800; x = 2800 × 2/7 = 800 Ft",
          "A teljes árat a teljesár-egységek számával visszakeressük.",
        ],
        ["800 : 2 = 400 Ft", "A félárú jegy a teljes ár fele."],
        [
          "2 × 800 + 3 × 400 = 2800 Ft",
          "Mindkét jegyfajtát a saját árával ellenőrizzük.",
        ],
      ],
      "Különböző árú tételeket nem szabad azonos jegyárként összevonni.",
      reflect(
        "Miért lehet mégis teljesár-egységekkel számolni?",
        "Minden félárú jegy pontosan fél teljes ár.",
        "A két teljes és három fél ár összesen három és fél teljes ár.",
      ),
      { difficulty: 3 },
    ),
    task(
      "szoveges-modellek",
      "practice-7",
      "Négy egyforma füzet 1800 Ft-ba kerül. A vásárló táskájában közben 7 toll van. Szükséges-e a 7-es adat a füzet egységárához? Mennyi egy füzet ára, és mennyi a négy füzet ellenőrzött összege?",
      [
        field(
          "needed",
          "Szükséges a táskában lévő tollak száma?",
          yesNo(false),
          [S.data],
          [
            [
              "yes",
              "A tollak mennyisége nem kapcsolódik a külön megadott füzetárhoz.",
            ],
          ],
        ),
        field("price", "Egy füzet ára (Ft)", num("450", "Ft"), [S.model]),
        needs(
          field(
            "check",
            "Négy füzet ára visszaszámolva (Ft)",
            num("1800", "Ft"),
            [S.check],
          ),
          "price",
        ),
      ],
      [
        "A kérdés füzetárról szól; keresd az ahhoz tartozó mennyiséget és összeget.",
        "1800 Ft-ot négy egyenlő részre osztunk.",
      ],
      [
        [
          "A 7 toll adata felesleges ehhez a kérdéshez",
          "Nem módosítja sem a füzetek számát, sem a vásárlás árát.",
        ],
        [
          "1800 : 4 = 450 Ft; 4 × 450 = 1800 Ft",
          "Az egységárból visszakapjuk az ismert teljes árat.",
        ],
      ],
      "Nem kötelező minden számot felhasználni.",
      reflect(
        "Milyen új kérdésben lehetne mégis szerepe a 7 tollnak?",
        "Például a táskában lévő tárgyak számánál.",
        "Ehhez azonban külön meg kellene mondani, milyen tárgyakat számolunk együtt.",
      ),
      { kind: "reason", difficulty: 1 },
    ),
    task(
      "szoveges-modellek",
      "practice-8",
      "Egy téglalap egyik oldala 12 cm. A másik oldaláról nincs adat. Számítsd ki a területet két megengedett példában: b = 3 cm és b = 5 cm. Egyértelműen meghatározza-e az eredeti adat a területet?",
      [
        field("first", "Terület b = 3 cm mellett (cm²)", num("36", "cm²"), [
          S.model,
        ]),
        field("second", "Terület b = 5 cm mellett (cm²)", num("60", "cm²"), [
          S.model,
        ]),
        needs(
          field(
            "unique",
            "Egyetlen terület következik a 12 cm-es adatból?",
            yesNo(false),
            [S.data, S.check],
            [
              [
                "yes",
                "A 36 cm² és a 60 cm² is megfelel az egyetlen közölt oldalnak; nincs egyértelmű terület.",
              ],
            ],
          ),
          "first",
          "second",
        ),
      ],
      [
        "A területhez két szomszédos oldal szorzata kell.",
        "T = 12b. A b = 3 és b = 5 is megengedett, mert nincs más feltétel.",
      ],
      [
        [
          "12 × 3 = 36 cm²; 12 × 5 = 60 cm²",
          "Két különböző téglalap is teljesíti a közölt adatot.",
        ],
        [
          "A terület nem egyértelmű",
          "Eltérő eredményekhez vezető megengedett példákat találtunk.",
        ],
      ],
      "A hiányzó adatot nem találjuk ki; megmutatjuk, miért van rá szükség.",
      reflect(
        "Milyen plusz adat tenné kiszámíthatóvá a területet?",
        "Például a másik oldal hossza.",
        "Megfelelő kerületadat is elég lehetne a másik oldal meghatározásához.",
      ),
      { kind: "reason" },
    ),
    task(
      "szoveges-modellek",
      "practice-9",
      "Egy feljegyzés szerint 3 egyforma termék darabonként 300 Ft, és a teljes ár 850 Ft. Kedvezmény és egyéb költség nincs. Mennyi lenne a számított összeg, mekkora az eltérés, és lehet-e egyszerre igaz minden adat?",
      [
        field("total", "Számított teljes ár (Ft)", num("900", "Ft"), [S.model]),
        needs(
          field(
            "difference",
            "A számított ár ennyivel nagyobb 850-nél (Ft)",
            num("50", "Ft"),
            [S.check],
          ),
          "total",
        ),
        needs(
          field(
            "consistent",
            "Összhangban vannak az adatok?",
            yesNo(false),
            [S.data, S.check],
            [
              [
                "yes",
                "Háromszor 300 Ft pontosan 900 Ft. A megadott feltételek között az 850 Ft nem egyeztethető ezzel össze.",
              ],
            ],
          ),
          "difference",
        ),
      ],
      [
        "A kedvezmény hiányát is feltételként kezeld.",
        "Hasonlítsd össze a 3 × 300 Ft-ot az állított 850 Ft-tal.",
      ],
      [
        ["3 × 300 = 900 Ft", "Azonos egységár és darabszám szorzatát vesszük."],
        ["900 − 850 = 50 Ft", "Az eltérés nem nulla."],
        [
          "Legalább egy adatot javítani vagy kiegészíteni kell",
          "Nem feltételezhetünk hallgatólagosan kedvezményt, amikor a szöveg kizárja.",
        ],
      ],
      "Az adatok összhangja is ellenőrizendő feltétel.",
      reflect(
        "Miért nem írhatunk be magunktól 50 Ft kedvezményt?",
        "A történet kifejezetten azt mondja, hogy nincs kedvezmény.",
        "Előbb tisztázni kell, mely adat vagy feltétel hibás.",
      ),
      { kind: "reason" },
    ),
    task(
      "szoveges-modellek",
      "practice-10",
      "113 tanulónak szervezünk utazást. Egy buszon 48 tanulói ülőhely van; mindenki ül, más utas nincs. Add meg a 113 : 48 pontos hányadost, a szükséges buszok legkisebb egész számát és az üres tanulói helyek számát.",
      [
        field("quotient", "113 : 48 pontosan", num("113/48"), [S.model]),
        field(
          "buses",
          "Legkevesebb busz (db)",
          num("3", "db"),
          [S.data, S.model],
          [
            [
              "2",
              "Két busz csak 96 tanulónak ad helyet, ami kevesebb 113-nál.",
            ],
          ],
        ),
        needs(
          field(
            "empty",
            "Üres helyek száma",
            num("31"),
            [S.check],
            [
              [
                "17",
                "A 17 a két busz után még el nem helyezett tanulók száma. Három buszon 144 hely van.",
              ],
            ],
          ),
          "buses",
        ),
      ],
      [
        "A hányados nem automatikusan megvásárolható buszszám.",
        "Két busz 96, három busz 144 tanulói helyet ad.",
      ],
      [
        ["113/48 = 2 + 17/48", "Két teljes busz után 17 tanuló marad."],
        [
          "3 busz szükséges",
          "A legkisebb egész számot keressük, amely elegendő helyet ad.",
        ],
        [
          "3 × 48 − 113 = 31",
          "A tényleges kapacitásból levonjuk a tanulók számát.",
        ],
      ],
      "Az egész darabszámra és az elegendő kapacitásra vonatkozó feltétel határozza meg a választ.",
      reflect(
        "Miért nem a szokásos legközelebbi egészre kerekítünk?",
        "Az lefelé 2-t adna, ami nem elég.",
        "Itt az összes tanuló elhelyezése a feltétel, ezért felfelé választunk egész buszszámot.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
    task(
      "szoveges-modellek",
      "practice-11",
      "Egy medencébe 36 L vizet töltünk. Egy csap végig 2 L/perc vizet ad. Az azonos csapok egymást nem lassítják, egyszerre indulnak, nincs kifolyás. Mennyi idő kell 6 csappal, mennyi 3 csappal, és mennyi víz érkezik 3 csappal az utóbbi idő alatt?",
      [
        field("six", "Idő 6 csappal (perc)", num("3", "perc"), [S.model]),
        field(
          "three",
          "Idő 3 csappal (perc)",
          num("6", "perc"),
          [S.model],
          [
            [
              "1.5",
              "Kevesebb azonos csap kisebb összhozamot ad; a szükséges idő ezért nő.",
            ],
          ],
        ),
        needs(
          field(
            "check",
            "3 csap összes vize a számított idő alatt (L)",
            num("36", "L"),
            [S.check],
          ),
          "three",
        ),
      ],
      [
        "Először az együtt működő csapok percenkénti összhozamát keresd.",
        "Hat csap 12 L/percet, három csap 6 L/percet ad.",
      ],
      [
        ["36 : (6 × 2) = 3 perc", "Hat csap együttes vízhozamával osztunk."],
        [
          "36 : (3 × 2) = 6 perc",
          "A fele létszám kétszer annyi ideig dolgozik ebben a modellben.",
        ],
        ["3 × 2 × 6 = 36 L", "A kapott idővel visszaszámoljuk a térfogatot."],
      ],
      "A fordított arányosság a kimondott, azonos teljesítményű és egymást nem akadályozó működésből következik.",
      reflect(
        "Miért szerepel a feltétel, hogy a csapok nem lassítják egymást?",
        "Közös szűk keresztmetszetnél a vízhozam nem feltétlenül a csapok számával szorzódna.",
        "A választott modell csak a megadott működésre érvényes.",
      ),
      { kind: "transfer" },
    ),
    task(
      "szoveges-modellek",
      "practice-12",
      "Két kitalált díjszabás érvényes ugyanarra az útra: A = 500 + 200x Ft, B = 350x Ft, ahol x az út km-ben. Számítsd ki mindkét árat 4 km-re, és keresd meg azt a pontos úthosszt, ahol egyenlők. Nincs más költség.",
      [
        field("a", "A díj 4 km-re (Ft)", num("1300", "Ft"), [S.model]),
        field("b", "B díj 4 km-re (Ft)", num("1400", "Ft"), [S.model]),
        field(
          "same",
          "Azonos díjhoz tartozó út (km)",
          num("10/3", "km", "x"),
          [S.model],
          [
            [
              "2.5",
              "A két változó díj különbsége kilométerenként 150 Ft, nem 200 Ft.",
            ],
          ],
        ),
      ],
      [
        "A fix 500 Ft-ot a kilométerenkénti díjkülönbség egyenlíti ki.",
        "500 + 200x = 350x, tehát 500 = 150x.",
      ],
      [
        [
          "A(4) = 500 + 800 = 1300 Ft; B(4) = 1400 Ft",
          "Mindkét szabályba ugyanazt az utat helyettesítjük.",
        ],
        [
          "x = 500/150 = 10/3 km",
          "A díjegyenlőségből a pontos tört értéket kapjuk.",
        ],
        [
          "Mindkét díj 3500/3 Ft az egyenlőségi pontban",
          "A tört úthosszal is ellenőrizhető az azonosság.",
        ],
      ],
      "A modellalkotás nemcsak számolás, hanem összehasonlítás is lehet.",
      reflect(
        "Miért nem egyenes arányosság az A teljes díja az úttal?",
        "A kezdőértéke 500 Ft.",
        "Az út duplázása nem duplázza meg az egyszeri alapdíjat.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
  ],
  exit: [
    task(
      "szoveges-modellek",
      "exit-1",
      "Három egyforma táska és egyszeri 700 Ft szállítás együtt 4300 Ft. x egy táska ára Ft-ban. Írd fel a teljes költség egyenletét, számítsd ki x-et, és add meg a visszaellenőrzött teljes összeget.",
      [
        field(
          "equation",
          "Teljes költség balra, 4300 jobbra",
          expr(
            "3x+700=4300",
            "3*x+700=4300",
            "700+3x=4300",
            "700+3*x=4300",
            "x*3+700=4300",
          ),
          [S.data, S.model],
          [["3*(x+700)=4300", "A szállítás egyszer szerepel, nem háromszor."]],
        ),
        field("price", "Egy táska ára (Ft)", num("1200", "Ft", "x"), [S.model]),
        needs(
          field("check", "Ellenőrzött teljes költség (Ft)", num("4300", "Ft"), [
            S.check,
          ]),
          "equation",
          "price",
        ),
      ],
      [
        "Az egyszeri szállítást külön tagként írd.",
        "A táskákra 4300 − 700 Ft jut; ennek harmadát keresed.",
      ],
      [
        [
          "3x + 700 = 4300; 3x = 3600; x = 1200 Ft",
          "A történet műveleteit visszafelé végezzük el.",
        ],
        ["3 × 1200 + 700 = 4300 Ft", "Az eredeti összefüggés teljesül."],
      ],
      "Az ismeretlen jelentése, az egyszeri tag és a visszaellenőrzés együtt ad teljes választ.",
      reflect(
        "Melyik adat mondja meg, hogy a 700-at csak egyszer adjuk hozzá?",
        "Az egyszeri szállítás megfogalmazás.",
        "A három darab a táskák számára vonatkozik.",
      ),
      { kind: "transfer" },
    ),
    task(
      "szoveges-modellek",
      "exit-2",
      "Két rúd együtt 46 cm hosszú. A hosszabb 8 cm-rel hosszabb a rövidebbnél. x a rövidebb hossza cm-ben. Írd fel az összeg egyenletét és add meg a két hosszt.",
      [
        field(
          "equation",
          "Összeg balra, 46 jobbra",
          expr(
            "x+(x+8)=46",
            "x+x+8=46",
            "(x+8)+x=46",
            "2x+8=46",
            "2*x+8=46",
            "8+2x=46",
            "8+2*x=46",
          ),
          [S.data, S.model],
        ),
        field(
          "short",
          "Rövidebb (cm)",
          num("19", "cm", "x"),
          [S.model],
          [
            [
              "23",
              "A két rész nem egyenlő: előbb a 8 cm többletet kell elkülöníteni.",
            ],
          ],
        ),
        field("long", "Hosszabb (cm)", num("27", "cm"), [S.model]),
      ],
      [
        "A hosszabb rúd x + 8, és mindkettőt beleszámítjuk az összegbe.",
        "46 − 8 = 38 cm marad két egyenlő alapdarabra.",
      ],
      [
        [
          "2x + 8 = 46; x = 38 : 2 = 19 cm",
          "A többlet után megmaradt részt felezzük.",
        ],
        ["19 + 8 = 27 cm", "Visszaállítjuk a hosszabb rudat."],
        ["19 + 27 = 46; 27 − 19 = 8", "A két feltétel egyszerre teljesül."],
      ],
      "A két hossz csak akkor jó, ha az összeg és a különbség is megfelelő.",
      reflect(
        "Mely két egyenlőséggel ellenőriznéd a válaszodat?",
        "A két hossz összege 46 cm.",
        "A hosszabb és rövidebb különbsége 8 cm.",
      ),
      { kind: "transfer" },
    ),
  ],
  recap: [
    "Nevezd meg a keresett mennyiséget és az egységét.",
    "Az adatokat a szerepük szerint válogasd; hiányzó adatot ne találj ki.",
    "A rajz, táblázat és egyenlet ugyanazt a kapcsolatot őrizze.",
    "Mondd ki a munkamodell, sebesség vagy ár feltételeit.",
    "A megoldás minden feltételt teljesítsen, a szükséges egész darabszámot is.",
  ],
  glossary: [
    {
      term: "Matematikai modell",
      definition:
        "A helyzet lényeges kapcsolatait leíró rajz, táblázat, kifejezés vagy egyenlet, megadott feltételekkel.",
    },
    {
      term: "Ismeretlen",
      definition:
        "A keresett mennyiség; jelölését, jelentését és egységét előre rögzítjük.",
    },
    {
      term: "Feltétel",
      definition:
        "Olyan kikötés, amely megszabja, milyen helyzetre és milyen válaszokra érvényes a feladat.",
    },
    {
      term: "Felesleges adat",
      definition:
        "A kérdés megválaszolásához nem szükséges információ; más kérdésben még lehet szerepe.",
    },
    {
      term: "Hiányos feladat",
      definition:
        "A közölt adatokból nem állapítható meg egyértelműen a kért érték.",
    },
    {
      term: "Ellentmondó adatok",
      definition:
        "Olyan állítások, amelyek a megadott feltételekkel nem lehetnek egyszerre igazak.",
    },
    {
      term: "Visszaellenőrzés",
      definition:
        "A kapott eredmény vizsgálata az eredeti történet minden lényeges feltétele alapján.",
    },
  ],
};

const powers: Lesson = {
  id: "hatvanyok",
  moduleId: "M07",
  title: "Hatványok: ismételt szorzás és nagyságrend",
  shortTitle: "Hatványok",
  question: "Mit számol a kitevő, és miért számít, hol van a mínuszjel?",
  teaser:
    "Bontsd tényezőkre a hatványt, ellenőrizd az előjelet és a nagyságrendet.",
  description:
    "Pozitív egész kitevőkkel dolgozunk. A négyzet és köb jelentését területtel és térfogattal kötjük össze, majd tíz hatványaival és becsléssel ellenőrizzük a nagyobb számokat.",
  goals: [
    "Az alapot és a pozitív egész kitevőt ismételt szorzáshoz kapcsolod.",
    "Megkülönbözteted a negatív alapot a hatvány elé írt mínusztól.",
    "Értelmezed a négyzetet és köböt mennyiségek és egységek mellett.",
    "Tíz hatványaival írsz fel helyi értékeket és ellenőrzöd a nagyságrendet.",
    "A pontos számolást elkülöníted a közelítő becsléstől.",
  ],
  prerequisites: [
    "Szorzás előjeles számokkal; műveleti sorrend és zárójelek.",
    "Törtek, tizedesek, valamint a terület- és térfogategységek alapjai.",
  ],
  prerequisiteTopics: ["szamfogalom", "muveleti-sorrend", "mertekegysegek"],
  coveredUnits: ["M07.01", "M07.02"],
  estimateMinutes: 50,
  color: "#d9c7f2",
  layer: "TÖRZS",
  nextTopic: "negyzetgyok",
  prediction: task(
    "hatvanyok",
    "prediction",
    "Melyik a nagyobb: 3² vagy 2³? Előbb képzeld el az ismételt szorzást, majd add meg külön a két értéket.",
    [
      field(
        "square",
        "3² értéke",
        num("9"),
        [S.power],
        [["6", "A 3² két darab 3 tényezőt jelent, nem 3 × 2-t."]],
      ),
      field(
        "cube",
        "2³ értéke",
        num("8"),
        [S.power],
        [["6", "A 2³ három darab 2 tényező: 2 × 2 × 2."]],
      ),
    ],
    ["A kitevő a tényezők számát jelöli.", "3² = 3 × 3; 2³ = 2 × 2 × 2."],
    [
      ["3 × 3 = 9", "Két darab 3-at szorzunk össze."],
      ["2 × 2 × 2 = 8", "Három darab 2-t szorzunk össze."],
      [
        "9 > 8",
        "A nagyobb kitevő önmagában nem dönti el két különböző alapú hatvány sorrendjét.",
      ],
    ],
    "Az alap és a kitevő együtt határozza meg a hatványt.",
    reflect(
      "Miért nem elég csak a 2-es és 3-as kitevőt összehasonlítani?",
      "Az alapok is eltérnek.",
      "A tényleges szorzatokat kell vizsgálni.",
    ),
    { kind: "reason", difficulty: 1 },
  ),
  explanation: [
    {
      heading: "A kitevő a tényezőket számolja",
      body: "A 4³ röviden azt jelenti: 4 × 4 × 4. A 4 az alap, a 3 a kitevő. Pozitív egész kitevőnél ennyi darab alapot szorzunk össze. Az a¹ egyszerűen a. Ez az út törzsanyaga. A műhely külön kitekintésében a nem nulla alap nulladik hatványa 1, a negatív tízkitevő pedig reciprokot jelöl: például 10⁻² = 1/100. Ezek feltételes kiterjesztések; a 0⁰ nem része ennek a szabálynak.",
      formula: "4³ = 4 × 4 × 4 = 64",
      bullets: [
        "4³ nem 4 × 3.",
        "Az alap és a kitevő felcserélése általában más eredményt ad.",
        "Az 1 minden pozitív egész hatványa 1; a 0-é 0.",
      ],
    },
    {
      heading: "A zárójel kijelöli az alapot",
      body: "A (−3)² alapja a teljes −3: (−3) × (−3) = 9. A −3² viszont a 3² ellentettje, ezért −9. A hatványozást a kifejezés elé írt mínusz előtt végezzük. Ha bizonytalan vagy, írd ki a tényezőket a zárójelekkel együtt.",
      formula: "(−3)² = 9, de −3² = −9",
    },
    {
      heading: "Páros és páratlan számú negatív tényező",
      body: "Két negatív tényező pozitív szorzatot ad. Páros számú negatív tényezőt párokba rendezve a hatvány pozitív. Páratlan számúnál marad egy negatív tényező, így az eredmény negatív. Ez a megállapítás nem nulla, negatív alapra és pozitív egész kitevőre szól.",
      formula: "(−2)⁴ = 16; (−2)⁵ = −32",
    },
    {
      heading: "Négyzet és köb: valódi geometriai jelentés",
      body: "Egy a oldalú négyzet területe a × a = a². Egy a élű kocka térfogata a × a × a = a³. Hosszúság esetén cm, területnél cm², térfogatnál cm³ az egység. Ha minden hossz kétszeresére változik, a négyzet területe négyszeres, a kocka térfogata nyolcszoros lesz.",
      formula: "(2a)² = 4a²; (2a)³ = 8a³",
      bullets: [
        "A geometriai hossz itt pozitív.",
        "A felületet két, a térfogatot három független irányban növeljük.",
      ],
    },
    {
      heading: "Tíz hatványai helyi értéket neveznek meg",
      body: "10¹ = 10, 10² = 100, 10³ = 1000. Minden újabb tízes tényező tízszeres értéket ad. A 52 074 felbontható 5 × 10⁴ + 2 × 10³ + 7 × 10 + 4 alakban. A tizedesvessző helyiérték-váltást követ; nem számjegyeket tüntetünk el indok nélkül.",
      formula: "0,047 × 1000 = 47; 62 000 : 100 = 620",
    },
    {
      heading: "A becslés hibát jelezhet, de nem pontos egyenlőség",
      body: "A 198 × 51 közel van a 200 × 50 = 10 000-hez. Ez segít észrevenni a tízszeres hibát. A pontos érték 10 098, ezért a 198 × 51 ≈ 10 000 jelölés helyes, az egyenlőségjel nem. A becsléshez meg kell mondanunk, mely számokat milyen módon közelítettük.",
      formula: "198 × 51 ≈ 200 × 50 = 10 000",
    },
    {
      heading: "Kitekintés: nagy számok normálalakja",
      body: "Nagy pozitív számot a × 10ⁿ alakban is írhatunk, ahol 1 ≤ a < 10. A rögzített gyakorlók itt pozitív egész n-es példákat használnak: 4 700 000 = 4,7 × 10⁶. A műhely a nulla és negatív tízkitevők helyi értékeit is megmutatja. A normálalak teljes témáját és minden kitevőesetét ez az út még nem gyakoroltatja végig.",
      formula: "3,2 × 10⁵ = 320 000",
      bullets: [
        "A szorzó 1 és 10 közé esik, a 10-et már nem érheti el.",
        "A 47 × 10⁵ ugyanaz az érték, de nem a kért normálalak.",
      ],
    },
  ],
  examples: [
    {
      title: "Negatív alap, majd összeadás",
      prompt: "Számítsd ki: (−2)³ + 4².",
      steps: [
        {
          expression: "(−2)³ = (−2) × (−2) × (−2)",
          why: "A teljes −2 az alap, háromszor szerepel tényezőként.",
        },
        {
          expression: "(−2) × (−2) = 4; 4 × (−2) = −8",
          why: "A harmadik negatív tényező miatt negatív a köb.",
        },
        {
          expression: "4² = 4 × 4 = 16",
          why: "A másik hatvány két 4-es tényező szorzata.",
        },
        {
          expression: "−8 + 16 = 8",
          why: "A két hatvány kiszámítása után adjuk össze az értékeket.",
        },
      ],
      check:
        "Az egyik tag −8, a másik +16; a pozitív tag abszolút értéke nagyobb, így a pozitív 8 ésszerű.",
    },
    {
      title: "Előbb nagyságrend, utána pontos eredmény",
      prompt: "Becsüld meg, majd számítsd ki pontosan: 498 × 201.",
      steps: [
        {
          expression: "498 ≈ 500; 201 ≈ 200",
          why: "Közeli, könnyen szorozható számokat választunk.",
        },
        {
          expression: "500 × 200 = 100 000 = 10⁵",
          why: "A pontos eredményt ennek közelében várjuk.",
        },
        {
          expression: "498 × (200 + 1) = 99 600 + 498 = 100 098",
          why: "A szorzás széttagolásával pontosan számolunk.",
        },
        {
          expression: "100 098 − 100 000 = 98",
          why: "A becsléstől való eltérés kicsi a teljes eredményhez képest.",
        },
      ],
      check:
        "A 10 009,8 vagy az 1 000 980 tízszeres eltérést jelentene a várt mérettől. A becslés nem bizonyítja minden számjegy helyességét, de feltűnő hibákat jelez.",
    },
  ],
  practice: [
    task(
      "hatvanyok",
      "practice-1",
      "A 4³ alakban nevezd meg az alapot és a kitevőt. Írd ki szorzásjelekkel az ismételt szorzást, majd számítsd ki.",
      [
        field("base", "Alap", num("4"), [S.power]),
        field("exponent", "Kitevő", num("3"), [S.power]),
        field(
          "expanded",
          "Ismételt szorzás, hatványjel nélkül",
          expr("4*4*4", "(4*4)*4", "4*(4*4)", "(4*4*4)"),
          [S.power],
          [["4*3", "A 3 a 4-es tényezők száma, nem egy új tényező."]],
        ),
        field(
          "value",
          "Érték",
          num("64"),
          [S.power],
          [["12", "A 4³ nem 4 × 3; három darab 4 szorzata."]],
        ),
      ],
      [
        "Számold meg, hány darab 4 szerepel tényezőként.",
        "Előbb 4 × 4 = 16, majd ezt is szorozd 4-gyel.",
      ],
      [
        ["4³ = 4 × 4 × 4", "Az alap 4, a tényezők száma 3."],
        ["16 × 4 = 64", "Egymás után végezzük a szorzásokat."],
      ],
      "A kitevő a tényezők számát írja le.",
      reflect(
        "Mi a különbség a 4³ és a 4 × 3 között?",
        "A hatványban három 4-es tényező van.",
        "A 4 × 3 szorzatnak két tényezője van: 4 és 3.",
      ),
      { difficulty: 1 },
    ),
    task(
      "hatvanyok",
      "practice-2",
      "Számítsd ki külön a 2⁵ és 5² értékét. Mennyivel nagyobb az első a másodiknál?",
      [
        field(
          "first",
          "2⁵",
          num("32"),
          [S.power],
          [["10", "Öt darab 2-t szorzunk össze, nem a 2-t szorozzuk 5-tel."]],
        ),
        field("second", "5²", num("25"), [S.power]),
        needs(
          field("difference", "2⁵ − 5²", num("7"), [S.power]),
          "first",
          "second",
        ),
      ],
      [
        "A két hatványban az alap és a tényezők száma is különbözik.",
        "2 × 2 × 2 × 2 × 2 = 32; 5 × 5 = 25.",
      ],
      [
        ["2⁵ = 32; 5² = 25", "Az ismételt szorzások két külön értéket adnak."],
        ["32 − 25 = 7", "Az elsőből vonjuk ki a másodikat."],
      ],
      "Az alap és a kitevő szerepe nem felcserélhető.",
      reflect(
        "Miért nem általános szabály az aⁿ = nᵃ?",
        "Az ismételt szorzásban más tényezőből más darabszám szerepel.",
        "A 2⁵ és 5² konkrét ellenpélda.",
      ),
    ),
    task(
      "hatvanyok",
      "practice-3",
      "A zárójelekre figyelve számítsd ki: (−3)², −3², −(−3)² és (−3)³.",
      [
        field(
          "negativeSquare",
          "(−3)²",
          num("9"),
          [S.sign, S.power],
          [
            [
              "-9",
              "A teljes −3-at szorozzuk önmagával: két negatív tényező pozitívat ad.",
            ],
          ],
        ),
        field(
          "oppositeSquare",
          "−3²",
          num("-9"),
          [S.sign],
          [
            [
              "9",
              "Itt a hatvány alapja 3, és az elkészült 9 ellentettjét vesszük.",
            ],
          ],
        ),
        field("outside", "−(−3)²", num("-9"), [S.sign]),
        field(
          "cube",
          "(−3)³",
          num("-27"),
          [S.sign, S.power],
          [
            [
              "27",
              "Három negatív tényezőnél egy negatív előjel pár nélkül marad.",
            ],
          ],
        ),
      ],
      [
        "Előbb minden esetben nevezd meg a hatvány alapját.",
        "A zárójel nélküli kezdő mínusz a hatvány értékének ellentettjét jelöli.",
      ],
      [
        [
          "(−3)² = 9; −3² = −9",
          "Az elsőben negatív az alap, a másodikban a hatvány elé kerül a mínusz.",
        ],
        [
          "−(−3)² = −9",
          "A belső négyzet pozitív, ennek vesszük az ellentettjét.",
        ],
        ["(−3)³ = −27", "Páratlan számú negatív tényező szorzata negatív."],
      ],
      "A mínusz helye a műveleti szerkezet része.",
      reflect(
        "Melyik két alakban vesszük egy már kiszámított négyzet ellentettjét?",
        "A −3² és a −(−3)² alakban.",
        "Mindkét négyzet 9, ezért az ellentett −9.",
      ),
    ),
    task(
      "hatvanyok",
      "practice-4",
      "Számítsd ki: (−2)⁴, (−2)⁵, 0³ és 1⁸. A kitevők mind pozitív egészek.",
      [
        field(
          "even",
          "(−2)⁴",
          num("16"),
          [S.sign, S.power],
          [
            [
              "-16",
              "Négy negatív tényező két párt alkot, ezért pozitív a szorzat.",
            ],
          ],
        ),
        field(
          "odd",
          "(−2)⁵",
          num("-32"),
          [S.sign, S.power],
          [["32", "Az ötödik negatív tényező negatívvá teszi az előző 16-ot."]],
        ),
        field("zero", "0³", num("0"), [S.power]),
        field(
          "one",
          "1⁸",
          num("1"),
          [S.power],
          [["8", "Nyolc darab 1-et szorzunk, nem összeadunk."]],
        ),
      ],
      [
        "A két első alakban számold a negatív tényezők párait.",
        "0 × 0 × 0 = 0; akármennyi 1-es tényező szorzata 1.",
      ],
      [
        [
          "(−2)⁴ = 16; (−2)⁵ = 16 × (−2) = −32",
          "A következő kitevő egy újabb alapnyi szorzást jelent.",
        ],
        [
          "0³ = 0; 1⁸ = 1",
          "A nulla és az egy szorzási tulajdonságai érvényesülnek.",
        ],
      ],
      "A kitevő növelése egy újabb alapnyi szorzás; az eredmény nem feltétlenül lesz nagyobb.",
      reflect(
        "Miért nem állítjuk, hogy minden hatványozás növeli a számot?",
        "Az 1 értéke változatlan marad.",
        "A nulla is nulla marad, a negatív alapnál pedig az előjel is váltakozik.",
      ),
    ),
    task(
      "hatvanyok",
      "practice-5",
      "Számítsd ki pontosan: (1/2)³, (3/2)² és 0,2². A törteket vagy a pontos tizedes alakot is használhatod.",
      [
        field(
          "half",
          "(1/2)³",
          num("1/8"),
          [S.power],
          [
            [
              "3/2",
              "A fél háromszori összeadása más művelet. Itt 1/2 × 1/2 × 1/2 szerepel.",
            ],
          ],
        ),
        field("threeHalves", "(3/2)²", num("9/4"), [S.power]),
        field(
          "decimal",
          "0,2²",
          num("1/25"),
          [S.power, S.scale],
          [
            [
              "0.4",
              "A 0,2 + 0,2 összeadás 0,4. A szorzat 2/10 × 2/10 = 4/100.",
            ],
          ],
        ),
      ],
      [
        "Tört szorzásánál a számlálókat és nevezőket külön szorozzuk.",
        "A 0,2 alak 2/10. A négyzetben a nevező is kétszer tényező.",
      ],
      [
        ["(1/2)³ = 1/8", "Három fél tényező összeszorzása."],
        [
          "(3/2)² = 9/4 = 2,25",
          "Mind a 3-at, mind a 2-t négyzetre emeljük a szorzásban.",
        ],
        ["0,2² = 4/100 = 0,04", "Két tizednyi tényező századnyi részeket ad."],
      ],
      "A 0 és 1 közötti pozitív szám ismételt önmagával szorzásakor kisebb értéket kapunk.",
      reflect(
        "Miért ésszerű, hogy 0,2² kisebb 0,2-nél?",
        "A 0,2-nek a 0,2-szeresét, azaz egyötödét vesszük.",
        "Nem egy teljes 0,2-t adunk hozzá, hanem annak részét keressük.",
      ),
    ),
    task(
      "hatvanyok",
      "practice-6",
      "Egy négyzet oldala 7 cm, egy másik test, egy kocka éle 3 cm. Add meg a négyzet területét és a kocka térfogatát. Hányszorosra változna a terület, illetve a térfogat, ha az adott alakzat minden hosszát megdupláznánk?",
      [
        field(
          "area",
          "A négyzet területe (cm²)",
          num("49", "cm²"),
          [S.power],
          [
            [
              "14",
              "A négyzet területe két oldalhossz szorzata, nem kétszer az oldal.",
            ],
          ],
        ),
        field("volume", "A kocka térfogata (cm³)", num("27", "cm³"), [S.power]),
        field(
          "areaFactor",
          "Terület szorzója kétszeres oldalaknál",
          num("4"),
          [S.power],
          [
            [
              "2",
              "A hossz két irányban is kétszeres: 2 × 2 a terület szorzója.",
            ],
          ],
        ),
        field(
          "volumeFactor",
          "Térfogat szorzója kétszeres éleknél",
          num("8"),
          [S.power],
          [
            [
              "6",
              "A három kétszerezést összeszorozzuk: 2 × 2 × 2, nem összeadjuk.",
            ],
          ],
        ),
      ],
      [
        "A négyzethez két, a kockához három egyenlő hossz tényező tartozik.",
        "A nagyítás szorzója területnél 2², térfogatnál 2³.",
      ],
      [
        [
          "7² = 49 cm²; 3³ = 27 cm³",
          "A mérőszám mellett az egység is négyzetre vagy köbre kerül.",
        ],
        ["2² = 4; 2³ = 8", "Két vagy három irányban duplázunk."],
        [
          "14² = 196 = 4 × 49; 6³ = 216 = 8 × 27",
          "Konkrét értékekkel is ellenőrizhető a szorzó.",
        ],
      ],
      "A hossz, terület és térfogat más hatvány szerint változik.",
      reflect(
        "Miért nem egyszerűen kétszeres a megduplázott élű kocka térfogata?",
        "A kockába két irányban és magasságban is kétszer annyi egység fér.",
        "Ez nyolc eredeti kocka térfogatát jelenti.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
    task(
      "hatvanyok",
      "practice-7",
      "Írd számként: 10³ és 10⁶. Hányszorosa a 10⁶ a 10³-nak?",
      [
        field(
          "thousand",
          "10³",
          num("1000"),
          [S.power, S.scale],
          [["30", "Három tízes tényezőt szorzunk össze."]],
        ),
        field("million", "10⁶", num("1000000"), [S.power, S.scale]),
        field(
          "ratio",
          "10⁶ : 10³",
          num("1000"),
          [S.scale],
          [
            [
              "2",
              "A kitevők hányadosa nem a számok hányadosa. Egymillióban ezer darab ezer van.",
            ],
          ],
        ),
      ],
      [
        "Minden új tízes tényező tízszeres értéket ad.",
        "1 000 000 : 1 000-et számolj; három tízes tényező marad.",
      ],
      [
        [
          "10³ = 1000; 10⁶ = 1 000 000",
          "A tízes helyiérték-rendszer hatványai.",
        ],
        ["1 000 000 : 1000 = 1000", "Az osztó ezerszer fér az osztandóba."],
      ],
      "Három helyiértéknyi különbség itt ezerszeres szorzót jelent.",
      reflect(
        "Hogyan ellenőrizhető a kapott 1000?",
        "1000 × 1000 = 1 000 000.",
        "A visszaszorzás visszaadja az osztandót.",
      ),
    ),
    task(
      "hatvanyok",
      "practice-8",
      "Számítsd ki: 5 × 10⁴ + 2 × 10³ + 7 × 10 + 4. Az 503 000 felbontásában mennyi a 10⁵ és a 10³ együtthatója?",
      [
        field(
          "value",
          "A megadott összeg",
          num("52074"),
          [S.scale],
          [
            [
              "5274",
              "10⁴ tízezer, 10³ ezer. A százezer alatti, ötvenezer körüli értéket keressük.",
            ],
          ],
        ),
        field("hundredThousands", "10⁵ együtthatója az 503 000-ben", num("5"), [
          S.scale,
        ]),
        field(
          "thousands",
          "10³ együtthatója az 503 000-ben",
          num("3"),
          [S.scale],
          [
            [
              "30",
              "A 10³ már ezret jelent. Három ilyen helyiértéknyi egység ad 3000-et.",
            ],
          ],
        ),
      ],
      [
        "Előbb számold ki külön a helyiértéknyi részeket.",
        "50 000 + 2000 + 70 + 4 az első összeg. Az 503 000 = 500 000 + 3000.",
      ],
      [
        [
          "50 000 + 2000 + 70 + 4 = 52 074",
          "A hiányzó százas hely értéke nulla.",
        ],
        [
          "503 000 = 5 × 10⁵ + 3 × 10³",
          "A számjegyek a megadott helyi értékek darabszámát mondják meg.",
        ],
      ],
      "A tíz hatványa az egységet, az együttható az egységek számát mutatja.",
      reflect(
        "Mit jelez a nulla az 503 000 tízezres helyén?",
        "Nincs külön tízezres tag a felbontásban.",
        "A helyét mégis meg kell őrizni, különben más számot írnánk.",
      ),
    ),
    task(
      "hatvanyok",
      "practice-9",
      "Számítsd ki pontosan: 0,047 × 10³, 62 000 : 10² és 1,2 × 10⁴.",
      [
        field(
          "first",
          "0,047 × 10³",
          num("47"),
          [S.scale],
          [["4.7", "Ez csak százas szorzó lenne; 10³ = 1000."]],
        ),
        field(
          "second",
          "62 000 : 10²",
          num("620"),
          [S.scale],
          [["6200", "Ez tízzel osztás eredménye volna. 10² = 100."]],
        ),
        field("third", "1,2 × 10⁴", num("12000"), [S.scale]),
      ],
      [
        "A tíz hatványát előbb nevezd meg számként.",
        "Ezerszeres, századrész és tízezerszeres változtatás történik.",
      ],
      [
        ["0,047 × 1000 = 47", "Három helyiértékkel nagyobb értéket kapunk."],
        ["62 000 : 100 = 620", "Száz egyenlő rész egyikét keressük."],
        ["1,2 × 10 000 = 12 000", "A tizedes mérőszám is pontosan skálázható."],
      ],
      "A helyiérték-váltás a szorzó vagy osztó nagyságából következik.",
      reflect(
        "Melyik eredményt ellenőriznéd visszaosztással?",
        "Például 47 : 1000 = 0,047.",
        "A szorzás és osztás egymás visszafelé végzett művelete lehet.",
      ),
    ),
    task(
      "hatvanyok",
      "practice-10",
      "A 198 × 51-et előbb a 200 × 50-nel becsüljük. Add meg ezt a becslést, a pontos szorzatot és a pontos értéknek a becsléshez képesti többletét.",
      [
        field("estimate", "Becslés a megadott 200 × 50 alapján", num("10000"), [
          S.scale,
        ]),
        field(
          "exact",
          "198 × 51 pontosan",
          num("10098"),
          [S.power, S.scale],
          [
            [
              "100980",
              "Ez tízszer akkora, mint a becslés környéke. Ellenőrizd a helyi értékeket.",
            ],
          ],
        ),
        needs(
          field("difference", "Pontos érték mínusz becslés", num("98"), [
            S.scale,
          ]),
          "estimate",
          "exact",
        ),
      ],
      [
        "A becslésnél a feladat által megadott közeli számokat használd.",
        "Pontosan: 198 × (50 + 1) = 9900 + 198.",
      ],
      [
        ["200 × 50 = 10 000", "Ez a kijelölt becslés."],
        ["198 × 51 = 10 098", "A pontos szorzást széttagolva végezzük."],
        [
          "10 098 − 10 000 = 98",
          "A közelítés és pontos érték eltérését mérjük.",
        ],
      ],
      "A becslést közelítő jel, a pontos számolást egyenlőségjel fejezi ki.",
      reflect(
        "Bizonyítja-e a jó nagyságrend az összes számjegy helyességét?",
        "Nem; több közeli, de hibás szám is hasonló nagyságú.",
        "A becslés egy ellenőrzési eszköz a pontos számolás mellett.",
      ),
      { kind: "reason" },
    ),
    task(
      "hatvanyok",
      "practice-11",
      "Hasonlítsd össze: (2 + 3)² és 2² + 3². Számítsd ki mindkettőt és az elsőnek a másodikhoz képesti többletét.",
      [
        field(
          "whole",
          "(2 + 3)²",
          num("25"),
          [S.power],
          [["13", "Itt az egész összeg az alap: előbb 2 + 3 = 5, majd 5²."]],
        ),
        field(
          "separate",
          "2² + 3²",
          num("13"),
          [S.power],
          [["25", "Ebben az alakban két külön négyzetet adunk össze."]],
        ),
        needs(
          field("difference", "A két érték különbsége", num("12"), [S.power]),
          "whole",
          "separate",
        ),
      ],
      [
        "Keresd meg, pontosan melyik részre vonatkozik a négyzet.",
        "Az első 5 × 5; a második 4 + 9.",
      ],
      [
        ["(2 + 3)² = 25", "A teljes összeg négyzete."],
        ["2² + 3² = 4 + 9 = 13", "A tagok négyzeteinek összege más szerkezet."],
        [
          "25 − 13 = 12",
          "Konkrét ellenpélda a négyzet összegre való hibás szétosztására.",
        ],
      ],
      "A szorzás széttagolhatóságából nem következik, hogy a négyzet összeadásra is szétosztható.",
      reflect(
        "Mit mutatna egy 5 × 5-ös négyzet 2 és 3 hosszú részekre osztása?",
        "A 2 × 2 és 3 × 3 négyzet mellett két 2 × 3 téglalap is megjelenik.",
        "Ezek területe együtt 12, ami hiányzik a 4 + 9 összegből.",
      ),
      { kind: "reason" },
    ),
    task(
      "hatvanyok",
      "practice-12",
      "Kitekintés: nagy pozitív számok normálalakja. Írd számként a 3,2 × 10⁵ értékét. A 4 700 000 = a × 10ⁿ alakban keresd a-t és a pozitív egész n-et úgy, hogy 1 ≤ a < 10.",
      [
        field("value", "3,2 × 10⁵ értéke", num("320000"), [S.scale]),
        field(
          "coefficient",
          "a értéke",
          num("47/10"),
          [S.scale],
          [
            [
              "47",
              "A kért normálalakban a szorzó kisebb 10-nél; 47 nem teljesíti ezt a formai feltételt.",
            ],
          ],
        ),
        field(
          "exponent",
          "n értéke",
          num("6"),
          [S.scale, S.power],
          [
            [
              "5",
              "4,7 × 10⁵ csak 470 000; itt tízszer akkora számot kell visszakapni.",
            ],
          ],
        ),
      ],
      [
        "A 10⁵ százezer; a 3,2 ennek a szorzója.",
        "A 4,7-et egymillióval kell szorozni, hogy 4 700 000 legyen.",
      ],
      [
        ["3,2 × 100 000 = 320 000", "A hatványt számként is felírjuk."],
        [
          "4 700 000 = 4,7 × 10⁶",
          "A szorzó a kívánt 1 és 10 közötti tartományba kerül.",
        ],
        ["1 ≤ 4,7 < 10", "Az érték mellett a kért alak feltétele is teljesül."],
      ],
      "Egy értéknek több hatványos alakja lehet; a normálalak külön formai feltételt is ad.",
      reflect(
        "Miért értékben helyes, de nem a kért normálalak a 47 × 10⁵?",
        "A szorzata ugyanúgy 4 700 000.",
        "A 47 azonban nem kisebb 10-nél.",
      ),
      { kind: "reason", difficulty: 3 },
    ),
  ],
  exit: [
    task(
      "hatvanyok",
      "exit-1",
      "Számítsd ki a −4² + (−2)³ kifejezést. Add meg külön a két tagot, majd az összeget.",
      [
        field(
          "first",
          "Első tag: −4²",
          num("-16"),
          [S.sign],
          [["16", "A mínusz a 4² elé kerül; nem a (−4)² alak szerepel."]],
        ),
        field("second", "Második tag: (−2)³", num("-8"), [S.sign, S.power]),
        needs(
          field(
            "sum",
            "Teljes összeg",
            num("-24"),
            [S.sign, S.power],
            [
              [
                "8",
                "Az első tag is negatív, ezért −16 és −8 összegét keressük.",
              ],
            ],
          ),
          "first",
          "second",
        ),
      ],
      [
        "Az elsőben a 4-et négyzetre emeljük, majd az ellentettjét vesszük.",
        "A másodikban három darab −2-t szorzunk össze.",
      ],
      [
        [
          "−4² = −16; (−2)³ = −8",
          "A hatványalap és a külső előjel külön kérdés.",
        ],
        ["−16 + (−8) = −24", "Két negatív tag összege negatív."],
      ],
      "Előbb a hatványok jelentését tisztázd, utána végezd az összegzést.",
      reflect(
        "Hogyan változna az eredmény, ha az első tag (−4)² lenne?",
        "Az első tag +16-ra változna.",
        "A teljes összeg akkor 16 − 8 = 8 lenne.",
      ),
    ),
    task(
      "hatvanyok",
      "exit-2",
      "Egy egyszerű adatmodellben egy csomag pontosan 2⁸ bájtot foglal. Ezer egyforma csomagot tárolunk, további helyigény nincs. Mennyi egy csomag és az ezer csomag mérete? Becsüld a teljes méretet csomagonként 250 bájttal is.",
      [
        field(
          "one",
          "Egy csomag mérete (bájt)",
          num("256", "bájt"),
          [S.power],
          [["16", "A 2⁸ nyolc darab 2 szorzata, nem 2 × 8."]],
        ),
        field(
          "total",
          "Ezer csomag pontos mérete (bájt)",
          num("256000", "bájt"),
          [S.scale, S.power],
        ),
        field(
          "estimate",
          "Becslés csomagonként 250 bájttal (bájt)",
          num("250000", "bájt"),
          [S.scale],
        ),
      ],
      [
        "A 2 hatványain haladva minden lépésben kétszerezünk.",
        "2⁸ = 256. Az ezer darabhoz ezerszeres méret tartozik.",
      ],
      [
        ["2⁸ = 256 bájt", "A hatvány tényezőit összeszorozzuk."],
        ["1000 × 256 = 256 000 bájt", "Az azonos csomagok mérete összeadódik."],
        [
          "1000 × 250 = 250 000 bájt",
          "A megadott becslőértékkel közelítő teljes méretet kapunk.",
        ],
      ],
      "A hatvány jelentése és a nagyságrend valószerű adatmennyiségek értelmezésében is használható.",
      reflect(
        "Miért kell kimondani, hogy nincs további helyigény?",
        "Csak így elég az egy csomagra megadott méretet a csomagszámmal szorozni.",
        "A számolás a megadott egyszerű modellre vonatkozik.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
  ],
  recap: [
    "Pozitív egész kitevőnél az alap ismétlődik tényezőként.",
    "A kitevő nem szorzója az alapnak.",
    "A (−a)² és −a² más szerkezet; a zárójel számít.",
    "A négyzet területet, a köb térfogatot is leírhat, megfelelő egységgel.",
    "Becsléskor ≈, pontos egyenlőségnél = jel használható.",
  ],
  glossary: [
    {
      term: "Hatvány",
      definition:
        "Pozitív egész kitevőnél ismételt szorzás; az ettől eltérő kitevőkhöz külön szabály és feltétel tartozik, amelyet a műhely rövid kitekintésben mutat meg.",
    },
    { term: "Alap", definition: "A hatványban ismétlődő tényező." },
    {
      term: "Kitevő",
      definition:
        "Pozitív egész esetben megmondja, hány darab alapot szorzunk össze.",
    },
    {
      term: "Négyzet",
      definition:
        "Egy szám második hatványa; pozitív hossz mellett a négyzet területének mérőszáma is lehet.",
    },
    {
      term: "Köb",
      definition:
        "Egy szám harmadik hatványa; pozitív hossz mellett a kocka térfogatának mérőszáma is lehet.",
    },
    {
      term: "Nagyságrendi ellenőrzés",
      definition:
        "Annak vizsgálata, hogy az eredmény a várható méret környékén van-e; például nem lett-e tízszeres a helyiérték-hiba miatt.",
    },
    {
      term: "Normálalak",
      definition:
        "a × 10ⁿ alak, ahol 1 ≤ |a| < 10; itt pozitív a-val és pozitív egész n-nel csak a nagy számok alapozó példáit tárgyaljuk.",
    },
  ],
};

const roots: Lesson = {
  id: "negyzetgyok",
  moduleId: "M08",
  title: "Négyzetgyök: visszafelé a négyzet területéből",
  shortTitle: "Négyzetgyök",
  question:
    "Melyik nemnegatív szám négyzete az adott szám, és hogyan közelíthetjük, ha nem egész?",
  teaser:
    "Keresd vissza az oldalt, szorítsd két ismert érték közé, és őrizd meg a pontos jelentést.",
  description:
    "A gyökjel egyetlen nemnegatív számot jelöl. Elkülönítjük ezt a négyzetes egyenlet megoldásaitól, majd négyzetszámok és pontos összehasonlítások segítségével becslünk és kerekítünk.",
  goals: [
    "A nemnegatív négyzetgyök jelentését területből oldalhossz visszakeresésével magyarázod.",
    "Megkülönbözteted a √a értékét az x² = a egyenlet valós megoldásaitól.",
    "Felismered és értelmezed a √(a²) = |a| kapcsolatot.",
    "Négyzetre emeléssel ellenőrzöd a gyök egész vagy tizedes korlátait.",
    "A pontos gyökjeles alakot elkülöníted a megadott pontosságú közelítéstől.",
  ],
  prerequisites: [
    "Négyzetszámok, előjelek és abszolút érték.",
    "Tizedesek szorzása, területegység és oldalhossz megkülönböztetése.",
  ],
  prerequisiteTopics: ["hatvanyok", "szamfogalom", "mertekegysegek"],
  coveredUnits: ["M08.01", "M08.02", "M08.03"],
  estimateMinutes: 55,
  color: "#b9dec7",
  layer: "TÖRZS",
  nextTopic: "pitagorasz",
  prediction: task(
    "negyzetgyok",
    "prediction",
    "Mennyi √36? Melyik két valós szám teljesíti az x² = 36 egyenletet? A két megoldást növekvő sorrendben add meg.",
    [
      field(
        "root",
        "√36 értéke",
        num("6"),
        [S.root],
        [
          [
            "-6",
            "A gyökjel a nemnegatív négyzetgyököt jelöli. A −6 az egyenlet egyik megoldása, de nem √36.",
          ],
        ],
      ),
      field("smaller", "x² = 36 kisebb megoldása", num("-6"), [S.root]),
      field("larger", "x² = 36 nagyobb megoldása", num("6"), [S.root]),
    ],
    [
      "Két ellentett szám négyzete azonos lehet.",
      "6² = 36 és (−6)² = 36, de a gyökjelhez a nemnegatív értéket választjuk.",
    ],
    [
      ["√36 = 6", "A négyzetgyök definíciója nemnegatív értéket jelöl ki."],
      ["x = −6 vagy x = 6", "Az egyenlet mindkét előjelű számot megengedi."],
      ["(−6)² = 6² = 36", "Mindkét megoldást behelyettesítéssel ellenőrizzük."],
    ],
    "Egy gyökjel értéke és egy egyenlet összes megoldása két külön kérdés.",
    reflect(
      "Miért nem írjuk, hogy √36 = ±6?",
      "A √ jel egyetlen nemnegatív számot jelöl.",
      "A ±6 a két egyenletmegoldás tömör felsorolása lehet, nem a gyökjel értéke.",
    ),
    { kind: "reason", difficulty: 1 },
  ),
  explanation: [
    {
      heading: "A gyökjel nemnegatív számot nevez meg",
      body: "Ha egy négyzet területe 49 cm², az oldala 7 cm, mert 7 × 7 = 49. A √49 az a nemnegatív szám, amelynek a négyzete 49. Nulla gyöke nulla. Negatív számnak a valós számok között nincs négyzetgyöke, mert egy valós szám négyzete nem lehet negatív.",
      formula: "√a = b azt jelenti: b ≥ 0 és b² = a; a ≥ 0",
    },
    {
      heading: "A gyökjel és az egyenlet nem ugyanazt kéri",
      body: "A √25 egyetlen érték: 5. Az x² = 25 egyenlet viszont azt kérdezi, mely valós számok négyzete 25, ezért −5 és 5 is megoldás. Az x² = 0 csak a 0-t engedi meg. Az x² = −4-nek nincs valós megoldása. Ez a különbség itt fogalmi kitekintés; nem általános másodfokúegyenlet-megoldó eljárás.",
      formula: "a > 0 esetén x² = a → x = −√a vagy x = √a",
    },
    {
      heading: "A négyzetből visszakeresve az abszolút értéket kapjuk",
      body: "A négyzetre emelés elveszíti az eredeti előjel különbségét: 5 és −5 négyzete egyaránt 25. A gyökjel ezután a nemnegatív 5-öt adja vissza. Emiatt √(a²) = |a| minden valós a-ra; csak a ≥ 0 mellett írhatjuk egyszerűen a-t.",
      formula: "√((−5)²) = √25 = 5 = |−5|",
      bullets: [
        "Ha a pozitív, |a| = a.",
        "Ha a negatív, |a| = −a, ami pozitív.",
        "a = 0 esetén a gyök és az abszolút érték is 0.",
      ],
    },
    {
      heading: "Két ismert négyzet közé szorítunk",
      body: "Mivel 7² = 49 és 8² = 64, a √50 a 7 és 8 közé esik. A nemnegatív számok körében a nagyobb számnak nagyobb a négyzete, így a területek sorrendjéből az oldalak sorrendjére is következtethetünk. Tizedes végpontokkal tovább szűkíthető az intervallum.",
      formula: "49 < 50 < 64 → 7 < √50 < 8",
    },
    {
      heading: "A kerekítéshez a felezőpont is számít",
      body: "Abból, hogy 4,4 < √20 < 4,5, még nem derül ki önmagában, melyik tizedhez van közelebb. A felezőpont 4,45, és 4,45² = 19,8025 < 20. Tehát √20 nagyobb 4,45-nél, ezért egy tizedesre kerekítve 4,5. A négyzetre emelt összehasonlítás pontos, nem találgatás.",
      formula: "√20 ≈ 4,5 egy tizedesre kerekítve",
    },
    {
      heading: "A pontos alak és a közelítés együtt hasznos",
      body: "A √2 pontosan jelöli a keresett számot. Az 1,41 egy két tizedesre kerekített értéke, ezért √2 ≈ 1,41, nem egyenlő vele. Ha a közelítő számot négyzetre emeljük, általában nem kapjuk pontosan vissza a gyök alatti számot. Többlépéses feladatban érdemes a kerekítést a végére hagyni.",
      formula: "1,41² = 1,9881 ≠ 2",
      bullets: [
        "A pontos gyökjeles alakot megőrizhetjük a számolásban.",
        "A végeredmény közelítésénél megmondjuk, hány tizedesre kerekítettünk.",
        "A mért terület és az oldalhossz egysége különbözik.",
      ],
    },
    {
      heading: "A gyököt nem osztjuk szét összeadásra",
      body: "A √(9 + 16) a 25 gyöke, tehát 5. A √9 + √16 viszont 3 + 4 = 7. Az összeg gyöke általában nem a gyökök összege. Egyetlen ilyen ellenpélda elég az általános hibás szabály cáfolására.",
      formula: "√(9 + 16) = 5, míg √9 + √16 = 7",
    },
  ],
  examples: [
    {
      title: "Visszakapjuk-e a negatív előjelet?",
      prompt:
        "Hasonlítsd össze: √((−5)²), √25 és az x² = 25 egyenlet megoldásai.",
      steps: [
        {
          expression: "(−5)² = 25",
          why: "Két negatív tényező szorzata pozitív.",
        },
        {
          expression: "√((−5)²) = √25 = 5",
          why: "A gyökjel a nemnegatív négyzetgyököt jelöli.",
        },
        {
          expression: "|−5| = 5",
          why: "Ezért az általános visszakereső kapcsolat az abszolút értéket adja.",
        },
        {
          expression: "x² = 25 → x = −5 vagy x = 5",
          why: "Az egyenlet mindkét valós megoldást kéri, nem csak a nemnegatívat.",
        },
      ],
      check:
        "5² és (−5)² is 25. A √25 értéke mégis csak 5, mert ezt a gyökjel definíciója rögzíti.",
    },
    {
      title: "A √30 egy tizedesre",
      prompt:
        "Szorítsd két egész és két szomszédos tized közé a √30-at, majd kerekítsd egy tizedesre.",
      steps: [
        {
          expression: "5² = 25 < 30 < 36 = 6²",
          why: "A gyök 5 és 6 közé esik.",
        },
        {
          expression: "5,4² = 29,16; 5,5² = 30,25",
          why: "Ezek a szomszédos tizedek közrefogják a 30-hoz tartozó oldalt.",
        },
        {
          expression: "5,45² = 29,7025 < 30",
          why: "A gyök a két tized felezőpontjánál nagyobb.",
        },
        {
          expression: "√30 ≈ 5,5",
          why: "A nagyobbik szomszédos tizedhez van közelebb.",
        },
      ],
      check:
        "A 5,5² = 30,25 nem pontosan 30, ezért a végeredmény mellé közelítő jelet és a kerekítés pontosságát tesszük.",
    },
  ],
  practice: [
    task(
      "negyzetgyok",
      "practice-1",
      "A nemnegatív négyzetgyök jelentését használva számítsd ki: √0, √1, √49 és √100.",
      [
        field("zero", "√0", num("0"), [S.root]),
        field(
          "one",
          "√1",
          num("1"),
          [S.root],
          [["-1", "Bár (−1)² = 1, a gyökjel a nemnegatív értéket választja."]],
        ),
        field("seven", "√49", num("7"), [S.root]),
        field(
          "ten",
          "√100",
          num("10"),
          [S.root],
          [
            [
              "50",
              "A gyökvonás nem felezés. Olyan nemnegatív számot keresünk, amely önmagával szorozva 100.",
            ],
          ],
        ),
      ],
      [
        "Melyik nemnegatív szám négyzete a megadott érték?",
        "0² = 0; 1² = 1; 7² = 49; 10² = 100.",
      ],
      [
        ["√0 = 0; √1 = 1", "A definíció a nullára és egyre is alkalmazható."],
        [
          "√49 = 7; √100 = 10",
          "A négyzetre emeléssel visszakapjuk a gyök alatti számot.",
        ],
      ],
      "A gyök nem felezést, hanem a négyzethez tartozó nemnegatív érték visszakeresését jelenti.",
      reflect(
        "Hogyan ellenőriznéd egyetlen művelettel a √49 válaszát?",
        "A kapott 7-et négyzetre emelem.",
        "7² = 49 és 7 nemnegatív.",
      ),
      { difficulty: 1 },
    ),
    task(
      "negyzetgyok",
      "practice-2",
      "Számítsd ki pontosan: √(9/16), √0,81 és √2,25. Minden válasz nemnegatív legyen.",
      [
        field(
          "fraction",
          "√(9/16)",
          num("3/4"),
          [S.root],
          [
            [
              "9/4",
              "A számlálóban is olyan szám kell, amelynek a négyzete 9: ez 3.",
            ],
          ],
        ),
        field(
          "decimal",
          "√0,81",
          num("9/10"),
          [S.root],
          [["0.09", "0,09² = 0,0081, ami túl kicsi. 0,9² = 0,81."]],
        ),
        field("larger", "√2,25", num("3/2"), [S.root]),
      ],
      [
        "Próbáld visszaemelni négyzetre a jelölt válaszodat.",
        "A 9/16 = 3²/4²; 0,81 = 81/100; 2,25 = 225/100.",
      ],
      [
        ["(3/4)² = 9/16", "A pozitív 3/4 ezért a gyök."],
        ["0,9² = 0,81; 1,5² = 2,25", "Pontos tizedes szorzással ellenőrzünk."],
      ],
      "Törteknek és tizedes számoknak is lehet pontos racionális négyzetgyökük.",
      reflect(
        "Miért nem alkalmazható egy egyszerű 'felezd a számjegyeket' módszer?",
        "A gyök definíciója a négyzetre emeléssel kapcsolja össze a számokat.",
        "A helyes értéket szorzással kell tudni visszaellenőrizni.",
      ),
    ),
    task(
      "negyzetgyok",
      "practice-3",
      "Számítsd ki: √((−5)²), √((−2,4)²) és √(0²). Fogalmazd meg, hogyan kapcsolódnak az eredmények az eredeti alap abszolút értékéhez.",
      [
        field(
          "negative",
          "√((−5)²)",
          num("5"),
          [S.root],
          [
            [
              "-5",
              "A négyzet elveszíti az előjel különbségét, a gyökjel pedig a nemnegatív értéket adja.",
            ],
          ],
        ),
        field(
          "decimal",
          "√((−2,4)²)",
          num("12/5"),
          [S.root],
          [["-2.4", "A √(a²) értéke |a|, nem minden a esetén maga a."]],
        ),
        field("zero", "√(0²)", num("0"), [S.root]),
      ],
      [
        "Először négyzetre emelünk, utána a nemnegatív gyököt keressük.",
        "A köztes értékek: 25, 5,76 és 0.",
      ],
      [
        ["√25 = 5; √5,76 = 2,4; √0 = 0", "Mindegyik gyök nemnegatív."],
        [
          "√(a²) = |a|",
          "A kapott érték az eredeti szám nullától mért távolsága.",
        ],
      ],
      "A gyökvonás a négyzet előtti szám abszolút értékét adja vissza.",
      reflect(
        "Mikor írhatjuk a √(a²) helyére egyszerűen a-t?",
        "Ha a nemnegatív.",
        "Negatív a esetén −a a nemnegatív eredmény; általánosan |a| kell.",
      ),
    ),
    task(
      "negyzetgyok",
      "practice-4",
      "Oldd meg a valós számok között: x² = 81 és y² = 0. Az első két megoldását növekvő sorrendben írd. Döntsd el azt is, van-e valós megoldása a z² = −4 egyenletnek.",
      [
        field("smaller", "x² = 81 kisebb megoldása", num("-9"), [S.root]),
        field("larger", "x² = 81 nagyobb megoldása", num("9"), [S.root]),
        field("zero", "y² = 0 megoldása", num("0"), [S.root]),
        field(
          "negative",
          "z² = −4 valós megoldásainak száma",
          choose("none", [
            ["none", "Nincs valós megoldás"],
            ["one", "Egy valós megoldás"],
            ["two", "Két valós megoldás"],
          ]),
          [S.root],
          [
            [
              "two",
              "Valós szám négyzete nem lehet negatív, így a ±2 sem jó: mindkettő négyzete +4.",
            ],
          ],
        ),
      ],
      [
        "Pozitív négyzethez két ellentett alap tartozhat.",
        "9² = (−9)² = 81. Csak a 0 négyzete nulla, negatív négyzetérték pedig nem adódik valós alapból.",
      ],
      [
        [
          "x = −9 vagy 9; y = 0",
          "Minden megadott értéket visszahelyettesíthetünk.",
        ],
        [
          "z² = −4: nincs valós megoldás",
          "A valós számok négyzete mindig nemnegatív.",
        ],
      ],
      "A pozitív, nulla és negatív jobb oldal különböző megoldásszámhoz vezet.",
      reflect(
        "Miért nem két különböző megoldás a +0 és −0?",
        "Ugyanazt a számot jelölik.",
        "Az y² = 0 megoldása ezért egyetlen érték.",
      ),
      { kind: "reason" },
    ),
    task(
      "negyzetgyok",
      "practice-5",
      "Keresd meg azt a két szomszédos egész számot, amelyek közé √50 szigorúan esik. Add meg az alsó és felső határt.",
      [
        field(
          "lower",
          "Alsó egész határ",
          num("7"),
          [S.estimate],
          [
            [
              "25",
              "A gyökvonás nem osztás kettővel. A közeli négyzetszámokat keresd.",
            ],
          ],
        ),
        field("upper", "Felső egész határ", num("8"), [S.estimate]),
      ],
      [
        "Melyik két szomszédos egész négyzete fogja közre az 50-et?",
        "7² = 49, 8² = 64.",
      ],
      [
        ["49 < 50 < 64", "Az 50 két szomszédos négyzetszám közé esik."],
        [
          "7 < √50 < 8",
          "Nemnegatív oldalaknál a négyzetek sorrendje követi az oldalakét.",
        ],
      ],
      "Becsléshez nem kell előre ismerni a gyök tizedes jegyeit.",
      reflect(
        "Miért szigorú mindkét egyenlőtlenség?",
        "Az 50 egyik határoló négyzetszámmal sem egyenlő.",
        "Ezért a gyök sem 7, sem 8.",
      ),
    ),
    task(
      "negyzetgyok",
      "practice-6",
      "Szorítsd √20-at két szomszédos tized közé, majd kerekítsd egy tizedesre. A kerekítéshez a két tized közötti felezőpontot is vizsgáld.",
      [
        field("lower", "Alsó tizedes határ", num("22/5"), [S.estimate]),
        field("upper", "Felső tizedes határ", num("9/2"), [S.estimate]),
        field(
          "rounded",
          "√20 egy tizedesre kerekítve",
          num("9/2"),
          [S.estimate, S.precision],
          [
            [
              "4.4",
              "A felezőpont 4,45. Négyzete 19,8025, kisebb 20-nál, így a gyök a felezőpont fölött van.",
            ],
          ],
        ),
      ],
      [
        "Négyzetre emeléssel próbáld a 4,4 és 4,5 értékeket.",
        "4,4² = 19,36; 4,5² = 20,25. A felezőpont 4,45.",
      ],
      [
        [
          "19,36 < 20 < 20,25 → 4,4 < √20 < 4,5",
          "A gyököt két szomszédos tized közé szorítottuk.",
        ],
        ["4,45² = 19,8025 < 20", "A gyök a felezőpontnál nagyobb."],
        ["√20 ≈ 4,5", "Ezért a nagyobb tizedhez kerekítünk."],
      ],
      "A két határ mellett a felezőpont dönti el a kerekítés irányát.",
      reflect(
        "Miért nem elég csak a 4,4 és 4,5 közötti helyet tudni?",
        "Az intervallum mindkét kerekítési tartományból tartalmaz pontokat.",
        "A 4,45 felezőpont választja el a két esetet.",
      ),
    ),
    task(
      "negyzetgyok",
      "practice-7",
      "Szorítsd √2-t két szomszédos század közé, és kerekítsd két tizedesre. A felezőpont négyzetével indokold a kerekítést.",
      [
        field("lower", "Alsó százados határ", num("141/100"), [S.estimate]),
        field("upper", "Felső százados határ", num("71/50"), [S.estimate]),
        field(
          "rounded",
          "√2 két tizedesre kerekítve",
          num("141/100"),
          [S.estimate, S.precision],
          [
            [
              "1.42",
              "Az 1,415 felezőpont négyzete 2,002225, nagyobb 2-nél. A gyök ezért alatta van.",
            ],
          ],
        ),
      ],
      [
        "Számold ki az 1,41 és 1,42 négyzetét.",
        "1,41² = 1,9881; 1,42² = 2,0164. A felezőpont 1,415.",
      ],
      [
        ["1,9881 < 2 < 2,0164", "A gyök 1,41 és 1,42 között van."],
        ["1,415² = 2,002225 > 2", "A gyök kisebb a felezőpontnál."],
        [
          "√2 ≈ 1,41 két tizedesre",
          "A kisebb szomszédos századhoz kerekítünk.",
        ],
      ],
      "A közelítés pontosságát mindig megadjuk.",
      reflect(
        "Miért közelítő jel kell az 1,41 mellé?",
        "1,41² nem pontosan 2.",
        "Az 1,41 a megadott pontosságú kerekítés, a √2 a pontos alak.",
      ),
    ),
    task(
      "negyzetgyok",
      "practice-8",
      "A √10 két tizedesre kerekítve 3,16. Írd le a pontos értéket gyökjellel úgy, hogy 10 maradjon a gyök alatt. Számítsd ki a 3,16 négyzetét, majd döntsd el, pontosan egyenlő-e a 3,16 a √10-zel.",
      [
        field("exact", "Pontos gyökjeles alak", expr("√10", "√(10)"), [
          S.root,
          S.precision,
        ]),
        field(
          "square",
          "3,16²",
          num("6241/625"),
          [S.precision],
          [
            [
              "10",
              "A közelített érték négyzete közel van 10-hez, de nem pontosan 10.",
            ],
          ],
        ),
        needs(
          field(
            "equal",
            "3,16 = √10 pontos egyenlőség?",
            yesNo(false),
            [S.precision],
            [
              [
                "yes",
                "3,16² = 9,9856, ezért nem lehet pontosan a 10 négyzetgyöke.",
              ],
            ],
          ),
          "square",
        ),
      ],
      [
        "A pontos jelölést nem kell tizedesszámmá alakítani.",
        "316 × 316 = 99 856; a két tizedes szám szorzatában négy tizedesjegy lesz.",
      ],
      [
        ["Pontos alak: √10", "A gyökjel egyértelműen megnevezi a számot."],
        ["3,16² = 9,9856", "Pontos szorzással ellenőrizzük a közelítést."],
        [
          "√10 ≈ 3,16, nem = 3,16",
          "A négyzetek eltérése kizárja a pontos egyenlőséget.",
        ],
      ],
      "A jól kerekített érték is közelítés.",
      reflect(
        "Mire jó, ha a pontos és közelítő alakot egyszerre tartjuk meg?",
        "A pontos alakot további számoláshoz őrizhetjük.",
        "A közelítő alak a szám nagyságának elképzelésében és a gyakorlati megadásban segít.",
      ),
      { kind: "reason" },
    ),
    task(
      "negyzetgyok",
      "practice-9",
      "Számítsd ki külön: √(9 + 16) és √9 + √16. Mennyi a második értéknek az elsőhöz képesti többlete?",
      [
        field(
          "together",
          "√(9 + 16)",
          num("5"),
          [S.root],
          [["7", "Az első alakban a teljes 25 összegből vonunk gyököt."]],
        ),
        field("separate", "√9 + √16", num("7"), [S.root]),
        needs(
          field("difference", "Második mínusz első", num("2"), [S.root]),
          "together",
          "separate",
        ),
      ],
      [
        "A gyökjel alatt előbb a teljes összeget számold ki.",
        "√25 = 5, míg a második kifejezés 3 + 4.",
      ],
      [
        ["√(9 + 16) = √25 = 5", "Az összeg gyöke."],
        ["√9 + √16 = 3 + 4 = 7", "Két külön gyök összege."],
        ["7 − 5 = 2", "A két szerkezet eltérő értéket ad."],
      ],
      "A gyökvonás általában nem osztható szét összeadásra.",
      reflect(
        "Mit cáfol ez az egyetlen példa?",
        "Azt az általános állítást, hogy √(a + b) mindig √a + √b.",
        "Nem azt állítja, hogy semmilyen különleges esetben nem lehetnek egyenlők.",
      ),
      { kind: "reason" },
    ),
    task(
      "negyzetgyok",
      "practice-10",
      "Egy négyzet területe pontosan 18 cm². Írd fel az oldalhossz pontos mérőszámát egyetlen gyökjellel, a gyök alatt 18-cal. Add meg az oldalt két tizedesre kerekítve, és számítsd ki ennek a kerekített oldalnak a négyzetét.",
      [
        field("exact", "Pontos mérőszám, egység nélkül", expr("√18", "√(18)"), [
          S.root,
          S.precision,
        ]),
        field(
          "side",
          "Oldal két tizedesre kerekítve (cm)",
          num("106/25", "cm"),
          [S.estimate, S.precision],
          [
            [
              "9",
              "A 18 felezése nem adja a négyzet oldalát. A keresett oldal négyzete 18.",
            ],
          ],
        ),
        needs(
          field(
            "check",
            "A kerekített oldal négyzete (cm²)",
            num("11236/625", "cm²"),
            [S.precision],
            [
              [
                "18",
                "A 4,24 csak kerekített oldalhossz. Pontos négyzete 17,9776.",
              ],
            ],
          ),
          "side",
        ),
      ],
      [
        "4,24² = 17,9776 és 4,25² = 18,0625.",
        "A felezőpont 4,245; négyzete 18,020025, ami nagyobb 18-nál.",
      ],
      [
        ["Pontos oldal: √18 cm", "Pozitív oldalhosszt keresünk a területből."],
        [
          "4,24 < √18 < 4,245 → két tizedesre 4,24 cm",
          "A gyök az alsó századhoz van közelebb.",
        ],
        [
          "4,24² = 17,9776 cm²",
          "A kerekítés miatt a visszaszámolt terület kicsit eltér az eredetitől.",
        ],
      ],
      "A területből keresett oldalhossz és a közelítés hibája külön kérdés.",
      reflect(
        "Miért nem hibás a 4,24 cm-es kerekített válasz attól, hogy a négyzete nem pontosan 18?",
        "A feladat itt két tizedesre kerekített értéket kért.",
        "A pontos eredményt külön a √18 cm jelölés őrzi.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
    task(
      "negyzetgyok",
      "practice-11",
      "70 darab 1 cm × 1 cm-es négyzetlapból vágás nélkül, négyzetrácsban hézagmentes nagy négyzetet készítünk. A lehető legnagyobbat szeretnénk. Mekkora az oldala, hány kis lap kell hozzá, és hány marad ki?",
      [
        field(
          "side",
          "Legnagyobb oldal (cm)",
          num("8", "cm"),
          [S.estimate],
          [["9", "A 9 × 9-es négyzethez 81 lap kellene; csak 70 van."]],
        ),
        needs(
          field("used", "Felhasznált lapok (db)", num("64", "db"), [
            S.root,
            S.estimate,
          ]),
          "side",
        ),
        needs(
          field("left", "Kimaradó lapok (db)", num("6", "db"), [S.precision]),
          "used",
        ),
      ],
      [
        "Az oldal itt egész számú kis lapból áll.",
        "8² = 64 ≤ 70, de 9² = 81 > 70.",
      ],
      [
        [
          "8 cm a legnagyobb megengedett oldal",
          "A következő egész oldalhoz már nincs elég lap.",
        ],
        [
          "8 × 8 = 64 lap; 70 − 64 = 6 lap marad",
          "A felhasznált és megmaradt lapok száma együtt 70.",
        ],
      ],
      "A gyök becslése mellett a helyzet egész darabszámra vonatkozó feltétele is számít.",
      reflect(
        "Miért nem használunk egyszerűen √70 cm-es oldalt?",
        "Az adott, vágás nélküli négyzetrácsban csak egész számú lap kerülhet egy oldalra.",
        "A 70 nem négyzetszám, ezért valamennyi lap kimarad.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
    task(
      "negyzetgyok",
      "practice-12",
      "A √3 két tizedesre kerekítve 1,73, és tudjuk, hogy 1,7320 < √3 < 1,7321. Mennyi lenne 10√3, ha túl korán az 1,73-mal számolnánk? Mennyi 10√3 valóban két tizedesre kerekítve a megadott szűk intervallum alapján, és mennyi a két kapott érték különbsége?",
      [
        field("early", "A korán kerekített 1,73 × 10", num("173/10"), [
          S.precision,
        ]),
        field(
          "rounded",
          "10√3 két tizedesre kerekítve",
          num("433/25"),
          [S.estimate, S.precision],
          [
            [
              "17.3",
              "A szűk intervallum alapján 17,320 < 10√3 < 17,321. Két tizedesre ez 17,32.",
            ],
          ],
        ),
        needs(
          field(
            "difference",
            "Helyes kerekítés mínusz korai eredmény",
            num("1/50"),
            [S.precision],
          ),
          "early",
          "rounded",
        ),
      ],
      [
        "Szorozd meg a megadott szűk intervallum mindkét határát tízzel.",
        "A valódi érték 17,320 és 17,321 közé esik; az 1,73 × 10 viszont 17,30.",
      ],
      [
        ["1,73 × 10 = 17,30", "Ez a már kerekített bemenettel számolt érték."],
        [
          "17,320 < 10√3 < 17,321 → 17,32",
          "Az egész intervallum ugyanarra a századra kerekedik.",
        ],
        [
          "17,32 − 17,30 = 0,02",
          "A túl korai kerekítés a kért pontosságban már látható különbséget okoz.",
        ],
      ],
      "Többlépéses számolásban a kerekítést lehetőleg a végére hagyjuk.",
      reflect(
        "Miért segített a megadott szűk intervallum, pontos tizedes kifejtés nélkül is?",
        "Minden benne lévő szám tízszerese 17,32-re kerekedik két tizedesre.",
        "A kért pontosság eldöntéséhez elég ilyen biztos határokat ismernünk.",
      ),
      { kind: "reason", difficulty: 3 },
    ),
  ],
  exit: [
    task(
      "negyzetgyok",
      "exit-1",
      "Mennyi √((−7)²)? Melyik két valós szám oldja meg az x² = 49 egyenletet? A két megoldást növekvő sorrendben írd.",
      [
        field(
          "root",
          "√((−7)²)",
          num("7"),
          [S.root],
          [["-7", "A gyökjel az abszolút értéket adja vissza: |−7| = 7."]],
        ),
        field("smaller", "x² = 49 kisebb megoldása", num("-7"), [S.root]),
        field("larger", "x² = 49 nagyobb megoldása", num("7"), [S.root]),
      ],
      [
        "Az első kérdés gyökjelértéket, a második minden egyenletmegoldást keres.",
        "(−7)² = 49; a nemnegatív gyök 7, de az egyenletben −7 is működik.",
      ],
      [
        ["√((−7)²) = √49 = 7", "A nemnegatív értéket választjuk."],
        ["x = −7 vagy 7", "Mindkét szám négyzete 49."],
      ],
      "A √(a²) = |a| szabály és az egyenlet két megoldása összefügg, de nem azonos állítás.",
      reflect(
        "Melyik feltétel választja ki az első válaszban a pozitív értéket?",
        "A négyzetgyök nemnegatív voltának definíciója.",
        "Az x² = 49 egyenlet nem tartalmaz x ≥ 0 megkötést.",
      ),
    ),
    task(
      "negyzetgyok",
      "exit-2",
      "Egy négyzet területe pontosan 45 m². Az oldal mérőszámát írd fel egyetlen gyökjellel, a gyök alatt 45-tel. Add meg a két szomszédos egész határt, az oldalt egy tizedesre kerekítve, és a kerekített oldal négyzetét.",
      [
        field("exact", "Pontos mérőszám, egység nélkül", expr("√45", "√(45)"), [
          S.root,
          S.precision,
        ]),
        field("lower", "Alsó egész határ (m)", num("6", "m"), [S.estimate]),
        field("upper", "Felső egész határ (m)", num("7", "m"), [S.estimate]),
        field(
          "rounded",
          "Oldal egy tizedesre (m)",
          num("67/10", "m"),
          [S.estimate, S.precision],
          [["6.8", "A gyök 6,7 és 6,75 között van, mert 6,7² < 45 < 6,75²."]],
        ),
        needs(
          field(
            "square",
            "A kerekített oldal négyzete (m²)",
            num("4489/100", "m²"),
            [S.precision],
            [["45", "A 6,7 m kerekített hossz. A négyzete pontosan 44,89 m²."]],
          ),
          "rounded",
        ),
      ],
      [
        "6² = 36 és 7² = 49. A gyök e két egész közé esik.",
        "6,7² = 44,89; a 6,7 és 6,8 közötti felezőpont 6,75, és 6,75² = 45,5625.",
      ],
      [
        [
          "Pontos oldal: √45 m; 6 < √45 < 7",
          "A területből a nemnegatív gyököt keressük.",
        ],
        [
          "44,89 < 45 < 45,5625 → 6,7 < √45 < 6,75",
          "A gyök a kerekítési felezőpont alatt van.",
        ],
        [
          "√45 ≈ 6,7; 6,7² = 44,89",
          "A közelítő hossz négyzete már nem pontosan az eredeti terület.",
        ],
      ],
      "A pontos alak, a biztos határ és a kerekített mérőszám mind más információt ad.",
      reflect(
        "Mit jelentene a √45 = 6,7 hibás egyenlőség a területre nézve?",
        "Azt állítaná, hogy 6,7² pontosan 45.",
        "Ez ellentmond a pontos 44,89-es szorzatnak; közelítő jelet kell használni.",
      ),
      { kind: "transfer", difficulty: 3 },
    ),
  ],
  recap: [
    "A √a a nemnegatív négyzetgyököt jelöli, és a ≥ 0 esetén értelmezett a valós számok között.",
    "x² = a pozitív a mellett két ellentett valós megoldást ad.",
    "√(a²) = |a|, nem minden valós a esetén a.",
    "A gyök határait a végpontok négyzetével ellenőrizzük.",
    "A kerekítést és a pontosságot külön jelezzük; lehetőleg a számolás végén kerekítünk.",
  ],
  glossary: [
    {
      term: "Négyzetgyök",
      definition:
        "Az a ≥ 0 számnak az a nemnegatív gyöke, amelynek négyzete a. Jele √a.",
    },
    {
      term: "Négyzetszám",
      definition: "Egész szám négyzete; a nemnegatív példák 0, 1, 4, 9, 16, …",
    },
    {
      term: "Abszolút érték",
      definition:
        "A szám nullától mért távolsága; mindig nemnegatív. Ezért √(a²) = |a|.",
    },
    {
      term: "Pontos alak",
      definition:
        "A számot változatlan értékkel megnevező jelölés, például √2.",
    },
    {
      term: "Közelítő érték",
      definition:
        "Az eredeti szám helyett megadott közeli szám, választott pontossággal; a kapcsolat jele ≈.",
    },
    {
      term: "Intervallumba szorítás",
      definition:
        "Olyan alsó és felső határ megadása, amelyek között a keresett szám biztosan elhelyezkedik.",
    },
    {
      term: "Kerekítési felezőpont",
      definition:
        "A két szomszédos választható kerekített érték közötti középső szám, amely eldönti a kerekítés irányát.",
    },
  ],
};

export const bridgeManuscriptMap = [algebra, models, powers, roots].flatMap(
  (lesson) =>
    [lesson.prediction, ...lesson.practice, ...lesson.exit].map((exercise) => ({
      topic: lesson.id,
      manuscriptId: exercise.manuscriptId!,
      exerciseId: exercise.id,
      fieldIds:
        exercise.answer.kind === "parts"
          ? exercise.answer.parts.map((part) => part.id)
          : ["answer"],
      skillIds: exercise.skillIds ?? [],
    })),
);

export const bridgeLessons: Lesson[] = [algebra, models, powers, roots];

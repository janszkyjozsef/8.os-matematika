import type { Exercise } from "../types.ts";
import { formatRational, rational } from "../math/engine.ts";

/**
 * Extra remedial families are intentionally separate from the public general
 * family order: adding one must not change older mixed-practice replay.
 */
export const TARGETED_GENERATOR_FAMILIES = Object.freeze([
  {
    id: "experiment-frequency-v1",
    topic: "valoszinuseg",
    title: "Megfigyelt gyakoriság és független következő próba",
    variants: 2,
  },
] as const);

export function generateTargetedExercise(familyId: string, seed: number, variant = 0): Exercise {
  if (familyId !== "experiment-frequency-v1") throw new RangeError("Ismeretlen célzott feladatcsalád.");
  if (!Number.isSafeInteger(seed) || seed < 0 || seed > 1_000_000_000 || (variant !== 0 && variant !== 1)) {
    throw new RangeError("Hibás célzott feladatazonosító.");
  }
  let state = (seed ^ (variant ? 0x85ebca6b : 0x9e3779b9)) >>> 0;
  const next = () => (state = (Math.imul(state, 1664525) + 1013904223) >>> 0);
  const faces = variant === 0 ? 6 : 2;
  const total = faces * (4 + next() % 37);
  const observed = seed % 13 === 0 ? 0 : seed % 17 === 0 ? total : seed % 11 === 0 ? total / faces : next() % (total + 1);
  const frequency = formatRational(rational(BigInt(observed), BigInt(total)));
  const theory = "1/" + faces;
  const event = variant === 0 ? "6-os" : "fej";
  const model = variant === 0
    ? "Szabályos hatoldalú kockával dobunk; a dobások egymástól függetlenek."
    : "Szabályos pénzérmét dobunk fel; a fej és írás egyenlő esélyű, a feldobások egymástól függetlenek.";
  const skillIds = ["esely-es-kiserlet"];
  return {
    id: "targeted-generated:" + familyId + ":seed=" + seed + ":variant=" + variant,
    topic: "valoszinuseg", kind: variant === 0 ? "reason" : "transfer", difficulty: 2,
    skillIds,
    prompt: model + " A feljegyzett sorozatban összesen " + total + " próba volt, ebből " + observed + " alkalommal lett " + event + ". Add meg a megfigyelt relatív gyakoriságot, a modell szerinti esélyt, majd a következő próba esélyét. Végül döntsd el, mit következtethetünk a sorozat eltéréséből.",
    answer: {
      kind: "parts",
      parts: [
        {
          id: "frequency", label: "Megfigyelt relatív gyakoriság",
          answer: { kind: "number", expected: frequency }, skillIds,
          mistakes: frequency === theory ? [] : [{
            input: theory,
            feedback: "Ez a modell szerinti elméleti esély. A megfigyelt gyakorisághoz a feljegyzett kedvező próbák számát oszd a feljegyzett összes próba számával.",
          }],
        },
        {
          id: "theoretical", label: "A megadott modell szerinti esély",
          answer: { kind: "number", expected: theory }, skillIds,
          mistakes: frequency === theory ? [] : [{
            input: frequency,
            feedback: "Ez a megfigyelt sorozat gyakorisága. Az elméleti esélyt az egyenlő esélyű elemi kimenetelekből számold.",
          }],
        },
        {
          id: "next", label: "A következő próba kedvező kimenetelének esélye",
          answer: { kind: "number", expected: theory }, skillIds,
          mistakes: [
            { input: "0", feedback: "A korábbi sorozat nem teszi lehetetlenné a következő kedvező kimenetelt. A próbák függetlenek." },
            { input: "1", feedback: "Nem kötelező a kiegyenlítődés. A következő kedvező kimenetel továbbra sem biztos." },
          ],
        },
        {
          id: "interpretation", label: "Mit jelent az elméleti esély és a gyakoriság esetleges eltérése?",
          answer: {
            kind: "choice", correct: "independent",
            options: [
              { id: "independent", text: "Rövid sorozatban eltérhetnek; a következő független próba esélyét ez nem változtatja meg." },
              { id: "balance", text: "A következő próbáknak kötelező kiegyenlíteniük a korábbi eltérést." },
              { id: "changes", text: "A következő próba elméleti esélyét mindig átírjuk az eddigi gyakoriságra." },
            ],
          },
          mistakes: [
            { input: "balance", feedback: "A független következő próba nem emlékszik a korábbi sorozatra; nincs kötelező pótlás." },
            { input: "changes", feedback: "A modell szabályosságot és függetlenséget adott meg. Az egy megfigyelt sorozatból számolt gyakoriságot külön kezeljük az elméleti esélytől." },
          ],
          skillIds,
        },
      ],
    },
    hints: [
      "Válaszd külön a megfigyelést és a modellt. A relatív gyakoriság a feljegyzett kedvező próbák száma osztva a feljegyzett összes próbával.",
      "A gyakoriság " + observed + "/" + total + ". A modellben egy kedvező elemi kimenetel jut " + faces + " egyenlő esélyűre; a következő független próbánál is ez a helyzet.",
    ],
    solution: [
      { expression: observed + " / " + total + " = " + frequency, why: "A megfigyelt relatív gyakoriságot a feljegyzett darabszámokból számoljuk." },
      { expression: "P(" + event + ") = " + theory, why: "A megadott modellben egy kedvező elemi kimenetel van " + faces + " egyenlő esélyű kimenetel közül." },
      { expression: "A következő próba esélye is " + theory, why: "A függetlenség miatt a korábbi eredménysor nem módosítja a következő próba esélyét." },
      { expression: "Az eltérés nem ír elő kötelező kiegyenlítődést.", why: "Az elméleti esély nem rögzíti előre egy véges sorozat kedvező eredményeinek számát." },
    ],
    takeaway: "A feljegyzett gyakoriság és a modell szerinti esély más adat. A független következő próba esélyét nem írja át az eddigi sorozat.",
    reflection: {
      prompt: "Miért nem válik biztossá a következő kedvező kimenetel akkor sem, ha eddig kevésszer fordult elő?",
      checkpoints: [
        "A megfigyelt arányt a sorozat darabszámaiból számoltad.",
        "A modell szabályosságot és függetlenséget feltételez.",
        "A következő próba nem köteles kijavítani az eddigi eltérést.",
      ],
    },
  };
}

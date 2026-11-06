import { useEffect, useId, useState } from "preact/hooks";
import type { LabProps, LabState, TopicId } from "../types.ts";
import { parseRational, rational } from "../math/engine.ts";
import {
  fractionAndDecimal,
  rMultiply,
  rNumber,
} from "../math/foundation-models.ts";
import {
  ALGEBRA_CASES,
  algebraKindText,
  algebraLikeTerms,
  algebraModel,
  formatAlgebra,
  STORY_MODELS,
  storySpec,
  checkStoryModel,
  storyValue,
  powerModel,
  powerBuildModel,
  tenPower,
  squareRootModel,
  rootOfSquare,
  bridgeCompare,
  bridgeEqual,
  exactGuess,
  exactText,
} from "../math/bridge-models.ts";
import type { PowerPlacement, StoryId } from "../math/bridge-models.ts";
import "./bridge-labs.css";

interface Props {
  value: LabState;
  onChange: (next: LabState) => void;
  uid: string;
}
const text = (state: LabState, key: string, fallback = "") =>
  typeof state[key] === "string" ? (state[key] as string) : fallback;
const boundedInt = (
  state: LabState,
  key: string,
  fallback: number,
  min: number,
  max: number,
) =>
  typeof state[key] === "number" &&
  Number.isInteger(state[key]) &&
  Number(state[key]) >= min &&
  Number(state[key]) <= max
    ? Number(state[key])
    : fallback;
const indices = (state: LabState, key: string, max: number) =>
  Array.isArray(state[key])
    ? [...new Set(state[key] as number[])].filter(
        (n) => Number.isInteger(n) && n >= 0 && n < max,
      )
    : [];

export function bridgeInitialLabState(topic: TopicId): LabState {
  switch (topic) {
    case "betus-kifejezesek":
      return {
        case: "like",
        x: "-2",
        y: "3",
        expanded: false,
        expansionChoice: "",
        expansionMessage: "",
        selectedTerms: [],
        termMessage: "",
        coefficientGuess: "",
        simplified: false,
        simplifyMessage: "",
        valueGuess: "",
        substituted: false,
        valueMessage: "",
        thought: "",
        saveThought: false,
      };
    case "szoveges-modellek":
      return {
        story: "fare",
        facts: [],
        unknown: "",
        model: "",
        modelChecked: false,
        modelMessage: "",
        guess: "4",
        checked: false,
        calculationMessage: "",
        thought: "",
        saveThought: false,
      };
    case "hatvanyok":
      return {
        magnitude: "3",
        exponent: 2,
        placement: "minus-outside",
        guess: "",
        checked: false,
        feedback: "",
        edge: 3,
        dimension: 2,
        layer: 1,
        buildGuess: "",
        built: false,
        buildMessage: "",
        tenExponent: 3,
        tenGuess: "",
        tenChecked: false,
        tenMessage: "",
        thought: "",
        saveThought: false,
      };
    case "negyzetgyok":
      return {
        area: "2",
        precision: 0,
        guess: "",
        revealed: false,
        feedback: "",
        equationGuess: "",
        equationChecked: false,
        equationMessage: "",
        a: "-5",
        absoluteGuess: "",
        absoluteShown: false,
        absoluteMessage: "",
        thought: "",
        saveThought: false,
      };
    default:
      return {};
  }
}

function Field({
  id,
  testId,
  label,
  value,
  onChange,
  hint,
  maxLength = 80,
}: {
  id: string;
  testId?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
  maxLength?: number;
}) {
  return (
    <div className="lab-control">
      <label className="lab-label" htmlFor={id}>
        {label}
      </label>
      <input
        className="lab-number"
        id={id}
        data-testid={testId}
        type="text"
        inputMode="decimal"
        value={value}
        onInput={(event) => onChange(event.currentTarget.value)}
        maxLength={maxLength}
        autoComplete="off"
        aria-describedby={hint ? `${id}-hint` : undefined}
      />
      {hint && (
        <span className="lab-bounds" id={`${id}-hint`}>
          {hint}
        </span>
      )}
    </div>
  );
}
function ScrollHint({ table = false }: { table?: boolean }) {
  return (
    <p className="bl-scroll-hint" data-testid="bridge-scroll-hint">
      {table ? "A táblázat" : "Az ábra"} oldalra is görgethető.
    </p>
  );
}
function Thought({
  value,
  onChange,
  uid,
  question,
  checkpoints,
  onDraftChange,
}: Props & {
  question: string;
  checkpoints: readonly string[];
  onDraftChange?: (draft: string) => void;
}) {
  const save = value.saveThought === true;
  const [draft, setDraft] = useState(save ? text(value, "thought") : "");
  useEffect(() => {
    if (save) {
      const restored = text(value, "thought");
      setDraft(restored);
      onDraftChange?.(restored);
    }
  }, [save, value.thought]);
  return (
    <aside className="lab-reflection">
      <h4>Mondd el a saját szavaiddal</h4>
      <label className="lab-label" htmlFor={`${uid}-thought`}>
        {question}
      </label>
      <textarea
        data-testid="bridge-thought"
        id={`${uid}-thought`}
        rows={3}
        maxLength={600}
        value={draft}
        onInput={(event) => {
          const next = event.currentTarget.value;
          setDraft(next);
          onDraftChange?.(next);
          if (save) onChange({ ...value, thought: next });
        }}
      />
      <label className="bl-thought-save" htmlFor={`${uid}-save-thought`}>
        <input
          id={`${uid}-save-thought`}
          data-testid="bridge-thought-save"
          type="checkbox"
          checked={save}
          onChange={(event) =>
            onChange({
              ...value,
              saveThought: event.currentTarget.checked,
              thought: event.currentTarget.checked ? draft : "",
            })
          }
        />
        Az indoklást is mentse a haladásommal
      </label>
      <details>
        <summary>Szempontok az indoklásod ellenőrzéséhez</summary>
        <ul>
          {checkpoints.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </details>
      <p>
        Az indoklás alapból csak ezen a megnyitott műhelynézeten marad meg. A
        jelölőnégyzettel külön mentheted; kikapcsolásakor a mentett szöveget
        töröljük. Vendégmódban nincs tartós böngészős mentés. A szöveget a
        program nem értékeli automatikusan.
      </p>
    </aside>
  );
}

function AlgebraLab({ value, onChange, uid }: Props) {
  const caseId = text(value, "case", "like");
  const spec =
    ALGEBRA_CASES.find((item) => item.id === caseId) ?? ALGEBRA_CASES[0];
  const model = algebraModel(
    spec.id,
    text(value, "x", "-2"),
    text(value, "y", "3"),
  );
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const expanded = !spec.expansion || value.expanded === true;
  const selected = indices(value, "selectedTerms", spec.terms.length).slice(-2);
  const selectTerm = (index: number) =>
    patch({
      selectedTerms: selected.includes(index)
        ? selected.filter((n) => n !== index)
        : [...selected, index].slice(-2),
      termMessage: "",
    });
  const compareTerms = () => {
    if (selected.length !== 2) {
      patch({
        termMessage:
          "Jelölj ki két külön tagot. A színük mellett a betűrészüket és a kitevőjüket is nézd meg.",
      });
      return;
    }
    const [a, b] = selected.map((index) => spec.terms[index]);
    const like = algebraLikeTerms(a, b);
    patch({
      termMessage: like
        ? `Egynemű tagok: a betűrészük ${a.kind === "constant" ? "mindkettőnél 1, vagyis mindkettő konstans" : `mindkettőnél ${algebraKindText(a.kind)}`}. Az együtthatók összege ${a.coefficient} + (${b.coefficient}) = ${a.coefficient + b.coefficient}.`
        : "Ezek nem egynemű tagok. Csak azonos betűrészt és azonos kitevőket tartalmazó tagok együtthatóit vonjuk össze. Az x, az y és az x² három külön tagfajta, akkor is, ha egy behelyettesítésnél véletlenül egyezik az értékük.",
    });
  };
  const checkExpansion = () => {
    if (!spec.expansion) return;
    const correct = text(value, "expansionChoice") === spec.expansion.correct;
    patch({
      expanded: correct,
      expansionMessage: correct
        ? spec.expansion.why
        : "A zárójel előtti szorzót minden belső tagra alkalmazd, az előjelekkel együtt. A külső tagot ne változtasd meg.",
    });
  };
  const checkCoefficient = () => {
    if (!model.ok) return;
    const result = exactGuess(
      text(value, "coefficientGuess"),
      rational(BigInt(model.coefficient)),
    );
    patch({
      simplified: result === "correct",
      simplifyMessage:
        result === "invalid"
          ? "Az együtthatót egyetlen számként add meg."
          : result === "correct"
            ? `Az együttható ${model.coefficient}. Az egynemű tagok számértékei bármely megengedett behelyettesítésnél ugyanígy adódnak össze.`
            : "Még nem ez az együttható. Csak a kiválasztott betűrészhez tartozó előjeles együtthatókat add össze; a többi tag külön marad.",
    });
  };
  const checkValue = () => {
    if (!model.ok) return;
    const result = exactGuess(text(value, "valueGuess"), model.total);
    patch({
      substituted: result !== "invalid",
      valueMessage:
        result === "invalid"
          ? "Előbb írj egy számot vagy egyszerű törtet a jóslatmezőbe."
          : result === "correct"
            ? "A jóslatod egyezik a pontos behelyettesítéssel. Ellenőrizd külön minden előjeles tag értékét is."
            : "A jóslatod eltér. Az alábbi tagonkénti behelyettesítés megmutatja, hol érdemes újraszámolni. A negatív változóértéket zárójelbe tesszük.",
    });
  };
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Betűk és számértékek</span>
        <h3>Mi marad ugyanaz az átalakításkor?</h3>
        <p>
          A betű egy változó helyét jelöli. Előbb a kifejezés szerkezetét
          vizsgáld, majd válassz számértéket és ellenőrizd a behelyettesítést.
        </p>
      </header>
      <div className="lab-control">
        <label className="lab-label" htmlFor={`${uid}-case`}>
          Vizsgált kifejezés
        </label>
        <select
          id={`${uid}-case`}
          data-testid="algebra-case"
          className="lab-number"
          value={spec.id}
          onChange={(event) =>
            onChange({
              ...bridgeInitialLabState("betus-kifejezesek"),
              case: event.currentTarget.value,
            })
          }
        >
          {ALGEBRA_CASES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}: {item.expression}
            </option>
          ))}
        </select>
      </div>
      <div className="lab-summary">
        <p className="lab-note">Az eredeti kifejezés</p>
        <p className="lab-equation" data-testid="algebra-original">
          {spec.expression}
        </p>
      </div>
      {spec.expansion && (
        <section className="bl-section">
          <h4>1. Bontsd fel a zárójelet</h4>
          <div className="lab-control">
            <label className="lab-label" htmlFor={`${uid}-expansion`}>
              Melyik alak őrzi meg minden tag előjelét?
            </label>
            <select
              id={`${uid}-expansion`}
              data-testid="algebra-expansion"
              className="lab-number"
              value={text(value, "expansionChoice")}
              onChange={(event) =>
                patch({
                  expansionChoice: event.currentTarget.value,
                  expanded: false,
                  expansionMessage: "",
                })
              }
            >
              <option value="">Válassz egy alakot</option>
              {spec.expansion.options.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.text}
                </option>
              ))}
            </select>
          </div>
          <div className="lab-actions">
            <button
              className="lab-button lab-button-primary"
              data-testid="algebra-expansion-check"
              type="button"
              onClick={checkExpansion}
            >
              Zárójelbontás ellenőrzése
            </button>
            <button
              className="lab-button"
              type="button"
              onClick={() =>
                patch({ expanded: true, expansionMessage: spec.expansion!.why })
              }
            >
              Mutasd a zárójelbontást és az okát
            </button>
          </div>
          {text(value, "expansionMessage") && (
            <p role="status" className="bl-feedback">
              {text(value, "expansionMessage")}
            </p>
          )}
        </section>
      )}
      {expanded && (
        <section className="bl-section">
          <h4>{spec.expansion ? "2. " : "1. "}Mely tagok vonhatók össze?</h4>
          <p className="lab-equation" data-testid="algebra-expanded">
            {formatAlgebra(spec.terms)}
          </p>
          <p>
            Jelölj ki két tagot. A lapok színe a tagfajtát, a rájuk írt előjel
            az együttható előjelét mutatja. Ezek jelképes lapok; a negatív tag
            nem negatív terület.
          </p>
          <div
            className="bl-term-list"
            role="group"
            aria-label="Két tag kiválasztása"
          >
            {spec.terms.map((term, index) => (
              <button
                key={index}
                className={`lab-button bl-term bl-kind-${term.kind}`}
                data-testid="algebra-term"
                type="button"
                aria-pressed={selected.includes(index)}
                onClick={() => selectTerm(index)}
              >
                <span>{index + 1}. tag:</span>
                <strong>{formatAlgebra([term])}</strong>
                <span>
                  Együttható: {term.coefficient};{" "}
                  {term.kind === "constant"
                    ? "konstans tag"
                    : `betűrész: ${algebraKindText(term.kind)}`}
                </span>
              </button>
            ))}
          </div>
          <button
            className="lab-button"
            data-testid="algebra-terms-check"
            type="button"
            onClick={compareTerms}
          >
            A két tag kapcsolatának ellenőrzése
          </button>
          {text(value, "termMessage") && (
            <p
              className="bl-feedback"
              role="status"
              data-testid="algebra-terms-result"
            >
              {text(value, "termMessage")}
            </p>
          )}
          <div
            className="bl-tiles"
            aria-label="Az eredeti tagok jelképes lapjai"
          >
            {spec.terms.map((term, index) => (
              <div className="bl-tile-group" key={index}>
                <p>{formatAlgebra([term])}</p>
                <div>
                  {Array.from(
                    { length: Math.abs(term.coefficient) },
                    (_, tile) => (
                      <span
                        key={tile}
                        className={`bl-tile bl-kind-${term.kind} ${term.coefficient < 0 ? "bl-negative" : ""}`}
                      >
                        {term.coefficient < 0 ? "−" : "+"}
                        {algebraKindText(term.kind)}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ))}
          </div>
          <Field
            id={`${uid}-coefficient`}
            testId="algebra-coefficient"
            label={`Mennyi az ${algebraKindText(spec.focus)} tag együtthatója az összevonás után?`}
            value={text(value, "coefficientGuess")}
            onChange={(next) =>
              patch({
                coefficientGuess: next,
                simplified: false,
                simplifyMessage: "",
              })
            }
            hint="Ha az ilyen tagok kioltják egymást, az együttható 0."
          />
          <div className="lab-actions">
            <button
              className="lab-button lab-button-primary"
              data-testid="algebra-simplify-check"
              type="button"
              onClick={checkCoefficient}
            >
              Összevonás ellenőrzése
            </button>
            <button
              className="lab-button"
              type="button"
              onClick={() =>
                patch({
                  simplified: true,
                  simplifyMessage:
                    "Az azonos betűrészű tagok előjeles együtthatóit összeadtuk. A konstans külön marad.",
                })
              }
            >
              Mutasd az egyszerűsített alakot
            </button>
          </div>
          {text(value, "simplifyMessage") && (
            <p className="bl-feedback" role="status">
              {text(value, "simplifyMessage")}
            </p>
          )}
          {value.simplified === true && model.ok && (
            <div className="lab-summary" data-testid="algebra-simplified">
              <p className="lab-equation">
                {spec.expression} = {model.simplified}
              </p>
              <p>
                Ez az azonosság a változók minden megengedett értékénél igaz. A
                most beírt számérték csak egy ellenőrzés.
              </p>
            </div>
          )}
        </section>
      )}
      <section className="bl-section">
        <h4>{spec.expansion ? "3. " : "2. "}Jósolj, majd helyettesíts be</h4>
        <div className="lab-controls">
          <Field
            id={`${uid}-x`}
            testId="algebra-x"
            label="Az x értéke"
            value={text(value, "x", "-2")}
            onChange={(next) =>
              patch({ x: next, substituted: false, valueMessage: "" })
            }
            hint="−20 és 20 között; tizedesvessző és egyszerű tört is használható."
          />
          {spec.terms.some((term) => term.kind === "y") && (
            <Field
              id={`${uid}-y`}
              testId="algebra-y"
              label="Az y értéke"
              value={text(value, "y", "3")}
              onChange={(next) =>
                patch({ y: next, substituted: false, valueMessage: "" })
              }
              hint="Az y önálló változó; nem kell egyenlőnek lennie x-szel."
            />
          )}
        </div>
        {!model.ok && (
          <p className="bl-feedback" role="status">
            {model.message}
          </p>
        )}
        <Field
          id={`${uid}-prediction`}
          testId="algebra-value-guess"
          label="Jóslat: mennyi a teljes kifejezés értéke?"
          value={text(value, "valueGuess")}
          onChange={(next) =>
            patch({ valueGuess: next, substituted: false, valueMessage: "" })
          }
        />
        <button
          type="button"
          className="lab-button lab-button-primary"
          data-testid="algebra-value-check"
          disabled={!model.ok}
          onClick={checkValue}
        >
          Behelyettesítés ellenőrzése
        </button>
        {text(value, "valueMessage") && (
          <p className="bl-feedback" role="status">
            {text(value, "valueMessage")}
          </p>
        )}
        {value.substituted === true && model.ok && (
          <>
            <ScrollHint table />
            <div
              className="lab-table-scroll"
              role="region"
              tabIndex={0}
              aria-label="Tagonkénti pontos behelyettesítés"
            >
              <table className="lab-table bl-table">
                <caption>Az előjelek követése</caption>
                <thead>
                  <tr>
                    <th scope="col">Tag</th>
                    <th scope="col">Behelyettesítés</th>
                    <th scope="col">Pontos érték</th>
                  </tr>
                </thead>
                <tbody>
                  {model.terms.map((term, index) => (
                    <tr key={index}>
                      <th scope="row">{formatAlgebra([term])}</th>
                      <td>
                        {term.kind === "constant"
                          ? term.coefficient
                          : `${term.coefficient} · (${exactText(term.kind === "y" ? model.y : model.x)})${term.kind === "x2" ? "²" : ""}`}
                      </td>
                      <td>{fractionAndDecimal(term.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              className="lab-summary"
              role="status"
              data-testid="algebra-value"
            >
              <p className="lab-equation">
                A teljes érték:{" "}
                <strong>{fractionAndDecimal(model.total)}</strong>
              </p>
              <p>
                A +x jelű lap együtthatója +1. Ha x negatív, a laphoz rendelt
                számérték negatív; a −x számértéke ekkor pozitív. A lap címkéjét
                és a behelyettesített számot külön olvasd.
              </p>
            </div>
          </>
        )}
      </section>
      <Thought
        value={value}
        onChange={onChange}
        uid={uid}
        question="Miért vonható össze 3x és 2x, és miért marad külön x és x²? Mi változik, ha x negatív?"
        checkpoints={[
          "Az egyneműséghez a teljes betűrésznek és a kitevőknek is egyezniük kell.",
          "Az együttható a betűrész szorzója; a konstans nem függ a változótól.",
          "A zárójel előtti mínusz minden belső tagot −1-gyel szoroz.",
          "Az azonosságot a szerkezet indokolja; egy számérték kipróbálása ellenőrzés.",
        ]}
      />
    </>
  );
}

function StoryDiagram({
  id,
  raw,
  uid,
}: {
  id: StoryId;
  raw: string;
  uid: string;
}) {
  const model = storyValue(id, raw);
  if (!model.ok) return null;
  const x = rNumber(model.x);
  const total = rNumber(model.left);
  const target = model.target ? rNumber(model.target) : total;
  const scale = 330 / Math.max(total, target, x + 6, 1);
  const start = 54;
  const rectangleUnit = 150 / Math.max(12, x);
  return (
    <>
      <ScrollHint />
      <div
        className="lab-plot-scroll bl-plot"
        role="region"
        tabIndex={0}
        aria-label="A történet adatainak szakaszábrája; minden érték szövegesen is olvasható"
      >
        <svg
          className="lab-svg bl-story-svg"
          viewBox="0 0 470 250"
          role="img"
          aria-labelledby={`${uid}-story-title ${uid}-story-desc`}
        >
          <title id={`${uid}-story-title`}>
            {model.spec.title}: {model.spec.equation}
          </title>
          <desc id={`${uid}-story-desc`}>
            A választott {model.spec.variable} = {exactText(model.x)}{" "}
            {model.spec.unit}. A képlet eredménye {exactText(model.left)}{" "}
            {model.spec.outputUnit}.
            {model.second
              ? ` A hosszabb szalag ${exactText(model.second)} cm, a különbség 6 cm.`
              : ""}
            {id === "missing"
              ? "Ez csak egy lehetséges téglalap; a történetből a másik oldal hossza nem tudható."
              : ""}
          </desc>
          {id === "lengths" ? (
            <>
              <text x={start} y="28" className="lab-svg-label">
                Rövidebb: {exactText(model.x)} cm
              </text>
              <rect
                x={start}
                y="42"
                width={x * scale}
                height="38"
                fill="#cde4d4"
                stroke="#27695f"
              />
              <text x={start} y="106" className="lab-svg-label">
                Hosszabb: {exactText(model.second!)} cm
              </text>
              <rect
                x={start}
                y="120"
                width={x * scale}
                height="38"
                fill="#cde4d4"
                stroke="#27695f"
              />
              <rect
                x={start + x * scale}
                y="120"
                width={6 * scale}
                height="38"
                fill="#efcf91"
                stroke="#795b26"
              />
              <text
                x={start + (x + 3) * scale}
                y="183"
                text-anchor="middle"
                className="lab-svg-small"
              >
                +6 cm
              </text>
              <text x={start} y="224" className="lab-svg-label">
                Összesen: {exactText(model.left)} cm; cél: 34 cm
              </text>
            </>
          ) : id === "missing" ? (
            <>
              <rect
                x="68"
                y="44"
                width={12 * rectangleUnit}
                height={x * rectangleUnit}
                fill="#deebce"
                stroke="#27695f"
                stroke-width="2"
              />
              <text
                x="173"
                y="29"
                text-anchor="middle"
                className="lab-svg-label"
              >
                12 cm
              </text>
              <text x="292" y="107" className="lab-svg-label">
                b = {exactText(model.x)} cm
              </text>
              <text x="68" y="215" className="lab-svg-label">
                A = 12 · {exactText(model.x)} = {exactText(model.left)} cm²
              </text>
              <text x="68" y="239" className="lab-svg-small">
                A két oldal aránya a megadott értékeket követi.
              </text>
            </>
          ) : (
            <>
              <text x={start} y="30" className="lab-svg-label">
                {id === "fare"
                  ? "Egyszeri alapdíj + út díja"
                  : "Három azonos füzetár"}
              </text>
              {id === "fare" ? (
                <>
                  <rect
                    x={start}
                    y="70"
                    width={500 * scale}
                    height="58"
                    fill="#efcf91"
                    stroke="#795b26"
                  />
                  <rect
                    x={start + 500 * scale}
                    y="70"
                    width={200 * x * scale}
                    height="58"
                    fill="#cde4d4"
                    stroke="#27695f"
                  />
                  <text x={start} y="153" className="lab-svg-small">
                    500 Ft + 200 · {exactText(model.x)} Ft
                  </text>
                </>
              ) : (
                <>
                  {[0, 1, 2].map((i) => (
                    <rect
                      key={i}
                      x={start + i * x * scale}
                      y="70"
                      width={x * scale}
                      height="58"
                      fill={i % 2 ? "#c8dfeb" : "#cde4d4"}
                      stroke="#27695f"
                    />
                  ))}
                  <text x={start} y="153" className="lab-svg-small">
                    {exactText(model.x)} Ft + {exactText(model.x)} Ft +{" "}
                    {exactText(model.x)} Ft
                  </text>
                </>
              )}
              <line
                x1={start}
                x2={start + target * scale}
                y1="185"
                y2="185"
                stroke="#526257"
                stroke-dasharray="5 3"
              />
              <text x={start} y="211" className="lab-svg-label">
                Modell: {exactText(model.left)} Ft; számla:{" "}
                {exactText(model.target!)} Ft
              </text>
            </>
          )}
        </svg>
      </div>
    </>
  );
}

function StoryLab({ value, onChange, uid }: Props) {
  const spec = storySpec(text(value, "story", "fare"));
  const [reason, setReason] = useState(
    value.saveThought === true ? text(value, "thought") : "",
  );
  const facts = indices(value, "facts", spec.facts.length);
  const modelCheck = checkStoryModel(
    spec.id,
    facts.map((index) => spec.facts[index].id),
    text(value, "unknown"),
    text(value, "model"),
  );
  const verified = value.modelChecked === true && modelCheck.ok;
  const raw = text(value, "guess", spec.start);
  const candidate = storyValue(spec.id, raw);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const changeModel = (next: LabState) =>
    patch({
      ...next,
      modelChecked: false,
      checked: false,
      modelMessage: "",
      calculationMessage: "",
    });
  const verifyModel = () => {
    if (!reason.trim()) {
      patch({
        modelMessage:
          "Írj előbb egy rövid indokot: mit jelent az egyenlet minden tagja a történetben? A szöveg értelmét a program nem minősíti; lent önellenőrző szempontokat találsz.",
        modelChecked: false,
      });
      return;
    }
    patch({
      modelChecked: modelCheck.ok,
      modelMessage: `${modelCheck.message}${modelCheck.ok ? " Az adatok és a jelölés összeillenek. Az indoklásodat a szempontokkal ellenőrizd; most jöhet a számolás." : ""}`,
      checked: false,
    });
  };
  const calculate = () => {
    if (!candidate.ok) {
      patch({ calculationMessage: candidate.message, checked: false });
      return;
    }
    let message = "";
    if (spec.id === "missing")
      message = `Ha b = ${exactText(candidate.x)} cm lenne, a terület ${exactText(candidate.left)} cm² lenne. Ez egy lehetséges eset, nem a hiányzó adat pótlása. Más b más területet ad: az eredeti kérdésnek nincs egyetlen számszerű válasza.`;
    else if (candidate.matches)
      message =
        spec.id === "lengths"
          ? `A két hossz ${exactText(candidate.x)} cm és ${exactText(candidate.second!)} cm. Összegük 34 cm, különbségük 6 cm; mindkettő pozitív. A válasz a történet mindkét adatát teljesíti.`
          : `${spec.variable} = ${exactText(candidate.x)} ${spec.unit}. Behelyettesítve ${exactText(candidate.left)} ${spec.outputUnit} adódik, pontosan az előírt végösszeg. A mértékegység és a történet feltétele is megfelelő.`;
    else
      message = `A ${exactText(candidate.x)} ${spec.unit} választás a modellben ${exactText(candidate.left)} ${spec.outputUnit} eredményt ad. Ez ${candidate.comparison! < 0 ? "kisebb" : "nagyobb"} a megadott ${exactText(candidate.target!)} ${spec.outputUnit}-nál. A táblázat és az ábra alapján módosítsd az ismeretlent, majd ellenőrizd újra.`;
    patch({ checked: true, calculationMessage: message });
  };
  const rows = spec.candidates
    .map((raw) => storyValue(spec.id, raw))
    .filter((row) => row.ok);
  if (
    value.checked === true &&
    candidate.ok &&
    !rows.some((row) => bridgeEqual(row.x, candidate.x))
  )
    rows.push(candidate);
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Történetből matematikai modell</span>
        <h3>Melyik adat mit jelent az egyenletben?</h3>
        <p>
          Válaszd külön az adatot, a kérdést és a feltételt. A modell
          kiválasztását indokold meg; csak utána számolj, végül térj vissza a
          történethez.
        </p>
      </header>
      <div className="lab-control">
        <label className="lab-label" htmlFor={`${uid}-story`}>
          Vizsgált történet
        </label>
        <select
          id={`${uid}-story`}
          className="lab-number"
          data-testid="story-case"
          value={spec.id}
          onChange={(event) => {
            const next = storySpec(event.currentTarget.value);
            setReason("");
            onChange({
              ...bridgeInitialLabState("szoveges-modellek"),
              story: next.id,
              guess: next.start,
            });
          }}
        >
          {STORY_MODELS.map((model) => (
            <option key={model.id} value={model.id}>
              {model.title}
            </option>
          ))}
        </select>
      </div>
      <div className="bl-story">
        <h4>{spec.title}</h4>
        <p>{spec.story}</p>
        <p>
          <strong>Kérdés:</strong> {spec.question}
        </p>
        <p>
          <strong>Feltétel:</strong> {spec.condition}
        </p>
      </div>
      <fieldset className="bl-fieldset">
        <legend>1. Mely adatokat használod a kérdés megválaszolásához?</legend>
        {spec.facts.map((fact, index) => (
          <label key={fact.id} className="bl-check">
            <input
              type="checkbox"
              data-testid={`story-fact-${fact.id}`}
              checked={facts.includes(index)}
              onChange={(event) =>
                changeModel({
                  facts: event.currentTarget.checked
                    ? [...facts, index]
                    : facts.filter((n) => n !== index),
                })
              }
            />
            {fact.text}
          </label>
        ))}
      </fieldset>
      <div className="lab-control">
        <label className="lab-label" htmlFor={`${uid}-unknown`}>
          2. Mit jelöljön az ismeretlen? A mértékegységet is olvasd el.
        </label>
        <select
          className="lab-number"
          id={`${uid}-unknown`}
          data-testid="story-unknown"
          value={text(value, "unknown")}
          onChange={(event) =>
            changeModel({ unknown: event.currentTarget.value })
          }
        >
          <option value="">Válassz jelentést és egységet</option>
          {spec.unknowns.map((item) => (
            <option key={item.id} value={item.id}>
              {item.text}
            </option>
          ))}
        </select>
      </div>
      <div className="lab-control">
        <label className="lab-label" htmlFor={`${uid}-model`}>
          3. Melyik modell kapcsolja össze a szükséges adatokat?
        </label>
        <select
          className="lab-number"
          id={`${uid}-model`}
          data-testid="story-equation"
          value={text(value, "model")}
          onChange={(event) =>
            changeModel({ model: event.currentTarget.value })
          }
        >
          <option value="">Válassz egy modellt</option>
          {spec.models.map((item) => (
            <option key={item.id} value={item.id}>
              {item.text}
            </option>
          ))}
        </select>
      </div>
      <Thought
        key={spec.id}
        value={value}
        onChange={onChange}
        uid={uid}
        question="Miért ezt a modellt választottad? Írd le röviden, melyik tag melyik adatot jelenti."
        checkpoints={[
          "A kérdéshez szükséges adatokat használom, a mellékeseket nem erőltetem a képletbe.",
          "Az ismeretlen jelentését és egységét végig ugyanúgy használom.",
          "Az alapdíj egyszer szerepel; azonos darabárak összege szorzatként írható.",
          "Hiányzó adat helyére nem találok ki számot vagy új feltételt.",
        ]}
        onDraftChange={setReason}
      />
      <button
        className="lab-button lab-button-primary"
        type="button"
        data-testid="story-model-check"
        onClick={verifyModel}
      >
        Adatok és modell ellenőrzése
      </button>
      {text(value, "modelMessage") && (
        <p
          role="status"
          className="bl-feedback"
          data-testid="story-model-result"
        >
          {text(value, "modelMessage")}
        </p>
      )}
      {verified && (
        <section className="bl-section" data-testid="story-calculation">
          <h4>4. Számolj, majd ellenőrizd a történetben</h4>
          <p className="lab-equation">{spec.equation}</p>
          <p>
            {spec.id === "missing"
              ? "Próbálj több lehetséges másik oldalt. Mind megfelel a megadott adatoknak, mégis különböző területet ad."
              : "Az alábbi három adatpár ugyanabból a képletből származik. Keresd meg, melyik ismeretlenérték adja a történetben megadott végösszeget."}
          </p>
          <ScrollHint table />
          <div
            className="lab-table-scroll"
            role="region"
            tabIndex={0}
            aria-label="A történet képletéhez tartozó adatpárok"
          >
            <table className="lab-table bl-table">
              <caption>Adatpárok</caption>
              <thead>
                <tr>
                  <th scope="col">
                    {spec.variable} ({spec.unit})
                  </th>
                  <th scope="col">
                    {spec.id === "missing" ? "Terület" : "Számított összeg"} (
                    {spec.outputUnit})
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={exactText(row.x)}
                    className={
                      value.checked === true &&
                      candidate.ok &&
                      bridgeEqual(candidate.x, row.x)
                        ? "lab-row-selected"
                        : undefined
                    }
                  >
                    <th scope="row">{exactText(row.x)}</th>
                    <td>{fractionAndDecimal(row.left)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Field
            id={`${uid}-guess`}
            testId="story-answer"
            label={`${spec.id === "missing" ? "Egy lehetséges" : "A keresett"} ${spec.variable} érték (${spec.unit})`}
            value={raw}
            onChange={(next) =>
              patch({ guess: next, checked: false, calculationMessage: "" })
            }
          />
          <button
            className="lab-button lab-button-primary"
            type="button"
            data-testid="story-calculate"
            onClick={calculate}
          >
            {spec.id === "missing"
              ? "Lehetséges eset vizsgálata"
              : "Behelyettesítés és történetbeli ellenőrzés"}
          </button>
          {text(value, "calculationMessage") && (
            <p className="bl-feedback" role="status" data-testid="story-result">
              {text(value, "calculationMessage")}
            </p>
          )}
          {value.checked === true && candidate.ok && (
            <StoryDiagram id={spec.id} raw={raw} uid={uid} />
          )}
        </section>
      )}
    </>
  );
}

function PowerNotation({
  magnitude,
  exponent,
  placement,
}: {
  magnitude: string;
  exponent: number;
  placement: PowerPlacement;
}) {
  return (
    <span>
      {placement === "negative-base"
        ? `(−${magnitude})`
        : `${placement === "minus-outside" ? "−" : ""}${magnitude.includes("/") || magnitude.includes(",") ? `(${magnitude})` : magnitude}`}
      <sup>{exponent}</sup>
    </span>
  );
}
function PowerBuildDiagram({
  edge,
  dimension,
  layer,
  revealed,
  uid,
}: {
  edge: number;
  dimension: 2 | 3;
  layer: number;
  revealed: boolean;
  uid: string;
}) {
  const model = powerBuildModel(edge, dimension);
  if (!model.ok) return null;
  const size = edge * 30;
  const depth = dimension === 3 ? edge * 9 : 0;
  const x = 58;
  const bottom = 224;
  return (
    <>
      <ScrollHint />
      <div
        className="lab-plot-scroll bl-plot"
        role="region"
        tabIndex={0}
        aria-label="Négyzet és kocka egységekből, szöveges leírással"
      >
        <svg
          className="lab-svg bl-power-svg"
          viewBox="0 0 470 290"
          role="img"
          aria-labelledby={`${uid}-power-build-title ${uid}-power-build-desc`}
        >
          <title id={`${uid}-power-build-title`}>
            {dimension === 2 ? "Négyzet" : "Kocka"}, {edge} egység hosszú
            élekkel
          </title>
          <desc id={`${uid}-power-build-desc`}>
            {revealed
              ? dimension === 2
                ? `${edge} sor, soronként ${edge} egységnégyzet: ${model.units} négyzetegység.`
                : `${edge} réteg, rétegenként ${model.perLayer} egységkocka: ${model.units} köbegység. Alulról a(z) ${layer}. réteget emeltük ki.`
              : "Jósolj: hány egységnégyzet vagy egységkocka alkotja? A felosztást a jóslat ellenőrzése mutatja meg."}
          </desc>
          {dimension === 3 && (
            <g>
              <polygon
                points={`${x},${bottom - size} ${x + depth},${bottom - size - depth} ${x + depth + size},${bottom - size - depth} ${x + size},${bottom - size}`}
                fill="#d9e7cd"
                stroke="#27695f"
                stroke-width="2"
              />
              <polygon
                points={`${x + size},${bottom - size} ${x + size + depth},${bottom - size - depth} ${x + size + depth},${bottom - depth} ${x + size},${bottom}`}
                fill="#b5d2c6"
                stroke="#27695f"
                stroke-width="2"
              />
            </g>
          )}
          <rect
            x={x}
            y={bottom - size}
            width={size}
            height={size}
            fill="#e4efd7"
            stroke="#27695f"
            stroke-width="2"
          />
          {revealed &&
            Array.from({ length: edge + 1 }, (_, i) => (
              <g key={i}>
                <line
                  x1={x + i * 30}
                  x2={x + i * 30}
                  y1={bottom - size}
                  y2={bottom}
                  stroke="#638375"
                />
                <line
                  x1={x}
                  x2={x + size}
                  y1={bottom - i * 30}
                  y2={bottom - i * 30}
                  stroke="#638375"
                />
                {dimension === 3 && (
                  <>
                    <line
                      x1={x + i * 30}
                      x2={x + depth + i * 30}
                      y1={bottom - size}
                      y2={bottom - size - depth}
                      stroke="#638375"
                    />
                    <line
                      x1={x + i * 9}
                      x2={x + size + i * 9}
                      y1={bottom - size - i * 9}
                      y2={bottom - size - i * 9}
                      stroke="#638375"
                    />
                  </>
                )}
              </g>
            ))}
          {revealed && dimension === 3 && (
            <g>
              <rect
                x={x}
                y={bottom - layer * 30}
                width={size}
                height="30"
                fill="#efd49a"
                stroke="#805b24"
                stroke-width="2"
              />
              <polygon
                points={`${x},${bottom - layer * 30} ${x + depth},${bottom - layer * 30 - depth} ${x + depth + size},${bottom - layer * 30 - depth} ${x + size},${bottom - layer * 30}`}
                fill="#efd49a"
                fill-opacity="0.35"
                stroke="#805b24"
                stroke-dasharray="5 3"
              />
            </g>
          )}
          <text x={x} y="253" className="lab-svg-label">
            Élhossz: {edge} egység
          </text>
          <text x="286" y="74" className="lab-svg-label">
            {edge}
            <tspan dy="-7" font-size="12">
              {dimension}
            </tspan>
          </text>
          {revealed && (
            <>
              <text x="286" y="108" className="lab-svg-label">
                = {model.units}
              </text>
              <text x="286" y="138" className="lab-svg-small">
                {dimension === 2 ? "egységnégyzet" : "egységkocka"}
              </text>
              {dimension === 3 && (
                <text x="286" y="171" className="lab-svg-small">
                  {layer}. réteg / {edge}
                </text>
              )}
            </>
          )}
        </svg>
      </div>
    </>
  );
}
function PowersLab({ value, onChange, uid }: Props) {
  const exponent = boundedInt(value, "exponent", 2, 0, 8);
  const placement: PowerPlacement =
    value.placement === "positive" || value.placement === "negative-base"
      ? value.placement
      : "minus-outside";
  const raw = text(value, "magnitude", "3");
  const model = powerModel(raw, exponent, placement);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const change = (next: LabState) =>
    patch({ ...next, checked: false, feedback: "" });
  const checkPower = () => {
    if (!model.ok) {
      patch({ feedback: model.message, checked: false });
      return;
    }
    const result = exactGuess(text(value, "guess"), model.value);
    const guess = parseRational(text(value, "guess"));
    const multiplied = rMultiply(model.base, rational(BigInt(exponent)));
    const hint =
      guess &&
      bridgeEqual(guess, multiplied) &&
      !bridgeEqual(multiplied, model.value)
        ? "A hatványozás nem az alap és a kitevő szorzata. A kitevő az ismétlődő tényezők számát mondja meg."
        : placement === "minus-outside"
          ? "A kitevő az a alapra vonatkozik. A kívül maradó mínusz a teljes hatvány ellentettjét kéri."
          : placement === "negative-base"
            ? "A negatív alap minden tényezőben szerepel. Páros sok negatív tényező szorzata pozitív, páratlan soké negatív."
            : "Annyi azonos tényezőt szorozz össze, amennyit a kitevő mutat.";
    patch({
      checked: result !== "invalid",
      feedback:
        result === "invalid"
          ? "A jóslatot számként vagy egyszerű törtként add meg."
          : `${result === "correct" ? "A jóslatod helyes." : "A jóslatod eltér a hatvány értékétől."} ${exponent === 0 ? "Nem nulla alap nulladik hatványa 1; a kívül álló mínusz ettől még megmarad." : hint}`,
    });
  };
  const edge = boundedInt(value, "edge", 3, 1, 5);
  const dimension: 2 | 3 = value.dimension === 3 ? 3 : 2;
  const layer = boundedInt(value, "layer", 1, 1, edge);
  const build = powerBuildModel(edge, dimension);
  const checkBuild = () => {
    if (!build.ok) return;
    const result = exactGuess(
      text(value, "buildGuess"),
      rational(BigInt(build.units)),
    );
    patch({
      built: result !== "invalid",
      buildMessage:
        result === "invalid"
          ? "Előbb jósolj: hány egységből áll a teljes alakzat?"
          : `${result === "correct" ? "A jóslatod egyezik a felosztással." : "A felosztás más darabszámot mutat; kövesd a sorokat és a rétegeket."} ${dimension === 2 ? `${edge} sor × ${edge} oszlop = ${build.units} egységnégyzet.` : `${edge} sor × ${edge} oszlop × ${edge} réteg = ${build.units} egységkocka.`}`,
    });
  };
  const tenExponent = boundedInt(value, "tenExponent", 3, -6, 6);
  const ten = tenPower(tenExponent)!;
  const checkTen = () => {
    const result = exactGuess(text(value, "tenGuess"), ten);
    patch({
      tenChecked: result !== "invalid",
      tenMessage:
        result === "invalid"
          ? "A jóslatot számként vagy egyszerű törtként add meg."
          : `${result === "correct" ? "A jóslat helyes." : "A jóslat eltér; kövesd a tízszeres szorzásokat vagy a tizedrészeket."} Ha a kitevő eggyel nő, az érték tízszeresére változik. Ha eggyel csökken, az érték tizedére változik.`,
    });
  };
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Az ismételt szorzás szerkezete</span>
        <h3>Mi az alap, és mire vonatkozik a kitevő?</h3>
        <p>
          Jósolj a számértékre, majd bontsd fel tényezőkre. A zárójel
          megmutatja, hogy a mínuszjel az alap része-e.
        </p>
      </header>
      <div className="lab-controls">
        <Field
          id={`${uid}-magnitude`}
          testId="power-magnitude"
          label="Az a nemnegatív értéke"
          value={raw}
          onChange={(next) => change({ magnitude: next })}
          hint="0–10 között, legfeljebb 6 jegyű számlálóval és nevezővel. A mínuszjel helyét külön választjuk."
        />
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-exponent`}>
            Kitevő
          </label>
          <select
            className="lab-number"
            id={`${uid}-exponent`}
            data-testid="power-exponent"
            value={exponent}
            onChange={(event) =>
              change({ exponent: Number(event.currentTarget.value) })
            }
          >
            {Array.from({ length: 9 }, (_, n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-placement`}>
            A mínuszjel és a zárójel helye
          </label>
          <select
            className="lab-number"
            id={`${uid}-placement`}
            data-testid="power-placement"
            value={placement}
            onChange={(event) =>
              change({ placement: event.currentTarget.value })
            }
          >
            <option value="positive">aⁿ: a nemnegatív alap hatványa</option>
            <option value="negative-base">
              (−a)ⁿ: a negatív alap hatványa
            </option>
            <option value="minus-outside">−aⁿ: a hatvány ellentettje</option>
          </select>
        </div>
      </div>
      {model.ok ? (
        <div className="lab-summary">
          <p className="lab-equation" data-testid="power-expression">
            <PowerNotation
              magnitude={exactText(model.magnitude)}
              exponent={exponent}
              placement={placement}
            />
          </p>
          <p>
            Alap: {exactText(model.base)}. Kitevő: {exponent}.
            {placement === "minus-outside"
              ? " A kifejezésben ezen felül a teljes hatvány előtt áll egy mínusz."
              : ""}
          </p>
        </div>
      ) : (
        <p className="bl-feedback" role="status" data-testid="power-error">
          {model.message}
        </p>
      )}
      <Field
        id={`${uid}-guess`}
        testId="power-guess"
        label="Jóslat: mennyi a teljes kifejezés értéke?"
        maxLength={180}
        value={text(value, "guess")}
        onChange={(next) => change({ guess: next })}
      />
      <button
        type="button"
        className="lab-button lab-button-primary"
        data-testid="power-check"
        onClick={checkPower}
      >
        Hatvány ellenőrzése tényezőkkel
      </button>
      {text(value, "feedback") && (
        <p className="bl-feedback" role="status">
          {text(value, "feedback")}
        </p>
      )}
      {value.checked === true && model.ok && (
        <>
          <div className="lab-summary" data-testid="power-result">
            <p className="lab-equation">
              {model.repeated} ={" "}
              <strong>{fractionAndDecimal(model.value)}</strong>
            </p>
            <p>
              {exponent === 0
                ? "A nem nulla alap nulladik hatványa 1. A 0⁰-at e szabállyal nem értelmezzük."
                : `A szorzat ${exponent} darab azonos alapot tartalmaz. A kitevő nem az alaphoz hozzáadott vagy az alapot megszorzó szám.`}
            </p>
          </div>
          <div className="bl-comparison" data-testid="power-comparison">
            {(
              [
                ["positive", model.positive],
                ["negative-base", model.negativeBase],
                ["minus-outside", model.outside],
              ] as const
            ).map(([mode, value]) => (
              <div key={mode}>
                <p>
                  <PowerNotation
                    magnitude={exactText(model.magnitude)}
                    exponent={exponent}
                    placement={mode}
                  />
                </p>
                <strong>{fractionAndDecimal(value)}</strong>
              </div>
            ))}
          </div>
          <p className="lab-note">
            Például −3² = −(3·3) = −9, míg (−3)² = (−3)·(−3) = 9. Páratlan
            kitevőnél a két negatív alak értéke egyezhet, a szerkezetük akkor is
            különbözik.
          </p>
        </>
      )}
      <section className="bl-section">
        <h4>Négyzet és köb: mit számol a kitevő?</h4>
        <p>
          A hosszúságot egy irányban mérjük. A négyzetnél két, a kockánál három
          egymásra merőleges irányban számoljuk az egységeket.
        </p>
        <div className="lab-controls">
          <div className="lab-control">
            <label className="lab-label" htmlFor={`${uid}-dimension`}>
              Építendő alakzat
            </label>
            <select
              className="lab-number"
              id={`${uid}-dimension`}
              data-testid="power-dimension"
              value={dimension}
              onChange={(event) =>
                patch({
                  dimension: Number(event.currentTarget.value),
                  built: false,
                  buildMessage: "",
                  layer: 1,
                })
              }
            >
              <option value="2">Négyzet: második hatvány</option>
              <option value="3">Kocka: harmadik hatvány</option>
            </select>
          </div>
          <div className="lab-control">
            <label className="lab-label" htmlFor={`${uid}-edge`}>
              Élhossz: {edge} egység
            </label>
            <input
              id={`${uid}-edge`}
              data-testid="power-edge"
              type="range"
              min="1"
              max="5"
              step="1"
              value={edge}
              onInput={(event) =>
                patch({
                  edge: Number(event.currentTarget.value),
                  built: false,
                  buildMessage: "",
                  layer: 1,
                })
              }
            />
            <span className="lab-bounds">
              1–5 egész egység; a nyílbillentyűkkel is változtatható.
            </span>
          </div>
        </div>
        <Field
          id={`${uid}-build-guess`}
          testId="power-build-guess"
          label={`Jóslat: hány ${dimension === 2 ? "egységnégyzet" : "egységkocka"} alkotja?`}
          value={text(value, "buildGuess")}
          onChange={(next) =>
            patch({ buildGuess: next, built: false, buildMessage: "" })
          }
        />
        <button
          type="button"
          className="lab-button lab-button-primary"
          data-testid="power-build-check"
          onClick={checkBuild}
        >
          Egységekre bontás és ellenőrzés
        </button>
        {text(value, "buildMessage") && (
          <p
            role="status"
            className="bl-feedback"
            data-testid="power-build-result"
          >
            {text(value, "buildMessage")}
          </p>
        )}
        <PowerBuildDiagram
          edge={edge}
          dimension={dimension}
          layer={layer}
          revealed={value.built === true}
          uid={uid}
        />
        {value.built === true && dimension === 3 && build.ok && (
          <div className="lab-control">
            <label className="lab-label" htmlFor={`${uid}-layer`}>
              Kijelölt vízszintes réteg: {layer}. / {edge}
            </label>
            <input
              id={`${uid}-layer`}
              data-testid="power-layer"
              type="range"
              min="1"
              max={edge}
              step="1"
              value={layer}
              onInput={(event) =>
                patch({ layer: Number(event.currentTarget.value) })
              }
            />
            <p>
              Egy réteg {edge} × {edge} = {build.perLayer} kiskocka. Az alsó{" "}
              {layer} rétegben {layer} × {build.perLayer} ={" "}
              {layer * build.perLayer} kiskocka van. A teljes kockában {edge}{" "}
              ilyen réteg szerepel.
            </p>
          </div>
        )}
      </section>
      <section className="bl-section">
        <h4>Tíz hatványai és a nagyságrend</h4>
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-ten`}>
            A tíz kitevője
          </label>
          <select
            id={`${uid}-ten`}
            data-testid="power-ten-exponent"
            className="lab-number"
            value={tenExponent}
            onChange={(event) =>
              patch({
                tenExponent: Number(event.currentTarget.value),
                tenChecked: false,
                tenMessage: "",
              })
            }
          >
            {Array.from({ length: 13 }, (_, i) => i - 6).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <p className="lab-equation">
          10<sup>{tenExponent}</sup>
        </p>
        {tenExponent < 0 && (
          <p>
            A negatív kitevő itt fordított irányt jelent a tízszeres lépésekben:
            10<sup>−k</sup> = 1 / 10<sup>k</sup>. Az érték pozitív marad.
          </p>
        )}
        <Field
          id={`${uid}-ten-guess`}
          testId="power-ten-guess"
          label="Jóslat: mekkora ez a tízhatvány?"
          value={text(value, "tenGuess")}
          onChange={(next) =>
            patch({ tenGuess: next, tenChecked: false, tenMessage: "" })
          }
        />
        <button
          type="button"
          className="lab-button lab-button-primary"
          data-testid="power-ten-check"
          onClick={checkTen}
        >
          Nagyságrend ellenőrzése
        </button>
        {text(value, "tenMessage") && (
          <p className="bl-feedback" role="status">
            {text(value, "tenMessage")}
          </p>
        )}
        {value.tenChecked === true && (
          <div className="bl-comparison" data-testid="power-ten-result">
            {[tenExponent - 1, tenExponent, tenExponent + 1]
              .filter((n) => tenPower(n) !== null)
              .map((n) => (
                <div key={n}>
                  <p>
                    10<sup>{n}</sup>
                  </p>
                  <strong>{fractionAndDecimal(tenPower(n)!)}</strong>
                  <p>
                    {n < tenExponent
                      ? "Az előző nagyságrend"
                      : n === tenExponent
                        ? "A választott hatvány"
                        : "A következő nagyságrend"}
                  </p>
                </div>
              ))}
          </div>
        )}
      </section>
      <Thought
        value={value}
        onChange={onChange}
        uid={uid}
        question="Miért más −3² és (−3)²? Hogyan látszik a négyzetben és a kockában az ismételt szorzás?"
        checkpoints={[
          "Az alapot a zárójel és a kitevő helye határozza meg.",
          "A negatív alap minden tényezőben negatív; a kívül álló mínusz csak a kész hatvány ellentettjét veszi.",
          "Négyzetnél sor × oszlop, kockánál sor × oszlop × réteg szerepel.",
          "A tíz kitevőjének egyes növelése az értéket tízszeresére változtatja.",
        ]}
      />
    </>
  );
}

function RootDiagram({
  raw,
  revealed,
  uid,
}: {
  raw: string;
  revealed: boolean;
  uid: string;
}) {
  const model = squareRootModel(raw, 0);
  if (!model.ok) return null;
  const lower = Number(model.integerLower);
  const upper = lower + 1;
  const unit = 172 / upper;
  const side = Math.sqrt(rNumber(model.area)) * unit;
  const x = 56;
  const bottom = 234;
  return (
    <>
      <ScrollHint />
      <div
        className="lab-plot-scroll bl-plot"
        role="region"
        tabIndex={0}
        aria-label="Négyzet területéből az oldal hossza, teljes szöveges magyarázattal"
      >
        <svg
          className="lab-svg bl-root-svg"
          viewBox="0 0 470 290"
          role="img"
          aria-labelledby={`${uid}-root-title ${uid}-root-desc`}
        >
          <title id={`${uid}-root-title`}>
            A négyzet területe {exactText(model.area)} területegység
          </title>
          <desc id={`${uid}-root-desc`}>
            A keresett oldal a terület nemnegatív négyzetgyöke.{" "}
            {revealed
              ? model.exact
                ? `Pontos oldala ${exactText(model.exact)} hosszegység.`
                : `${lower} és ${upper} hosszegység közé esik, mert a terület ${lower * lower} és ${upper * upper} közé esik.`
              : "A feladat a keresett oldal megjóslása, majd a négyzetre emelés ellenőrzése."}{" "}
            Az ábra méretarányos közelítő rajz; a pontos határokat a szöveg adja
            meg.
          </desc>
          {revealed && !model.exact && (
            <rect
              x={x}
              y={bottom - upper * unit}
              width={upper * unit}
              height={upper * unit}
              fill="none"
              stroke="#7d692e"
              stroke-width="2"
              stroke-dasharray="7 4"
            />
          )}
          <rect
            x={x}
            y={bottom - side}
            width={side}
            height={side}
            fill="#dceace"
            stroke="#27695f"
            stroke-width="2"
          />
          {revealed && !model.exact && lower > 0 && (
            <rect
              x={x}
              y={bottom - lower * unit}
              width={lower * unit}
              height={lower * unit}
              fill="#efcf91"
              fill-opacity="0.55"
              stroke="#7d692e"
            />
          )}
          {revealed &&
            model.exact &&
            model.exact.d === 1n &&
            model.exact.n <= 10n &&
            Array.from({ length: Number(model.exact.n) + 1 }, (_, i) => (
              <g key={i}>
                <line
                  x1={x + i * unit}
                  x2={x + i * unit}
                  y1={bottom - side}
                  y2={bottom}
                  stroke="#6a8a79"
                />
                <line
                  x1={x}
                  x2={x + side}
                  y1={bottom - i * unit}
                  y2={bottom - i * unit}
                  stroke="#6a8a79"
                />
              </g>
            ))}
          <text x={x} y="264" className="lab-svg-label">
            Oldal: {revealed ? `√(${exactText(model.area)})` : "s = ?"}
          </text>
          <text x="272" y="78" className="lab-svg-label">
            Terület:
          </text>
          <text x="272" y="106" className="lab-svg-label">
            {exactText(model.area)}
          </text>
          <text x="272" y="134" className="lab-svg-small">
            területegység
          </text>
          {revealed && (
            <text x="272" y="180" className="lab-svg-small">
              s · s = {exactText(model.area)}
            </text>
          )}
        </svg>
      </div>
    </>
  );
}
function RootsLab({ value, onChange, uid }: Props) {
  const raw = text(value, "area", "2");
  const precision = boundedInt(value, "precision", 0, 0, 3);
  const model = squareRootModel(raw, precision);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const changeArea = (next: string) =>
    patch({
      area: next,
      revealed: false,
      feedback: "",
      equationChecked: false,
      equationMessage: "",
    });
  const checkRoot = () => {
    if (!model.ok) {
      patch({ feedback: model.message, revealed: false });
      return;
    }
    const guess = parseRational(text(value, "guess"));
    if (!guess || guess.n < 0n) {
      patch({
        feedback:
          "A négyzet oldala és a négyzetgyök nemnegatív. Adj meg egy nemnegatív számot vagy törtet; a negatív egyenletmegoldást külön vizsgáljuk.",
        revealed: false,
      });
      return;
    }
    const squared = rMultiply(guess, guess);
    const exact = bridgeEqual(squared, model.area);
    const rounded = bridgeEqual(guess, model.approximation);
    const near =
      bridgeCompare(guess, model.lower) >= 0 &&
      bridgeCompare(guess, model.upper) <= 0;
    patch({
      revealed: true,
      feedback: exact
        ? `A jóslat pontos: (${exactText(guess)})² = ${exactText(model.area)}, és ${exactText(guess)} nemnegatív.`
        : `${exactText(guess)} négyzete ${fractionAndDecimal(squared)}, tehát ${bridgeCompare(squared, model.area) < 0 ? "kisebb" : "nagyobb"} a területnél. ${rounded ? `Ez a ${precision} tizedesjegyre kerekített közelítés.` : near ? "A tipped a most vizsgált szűk intervallumba esik, de nem pontos egyenlőség." : "A két szomszédos négyzetszám és a pontosított határok segítenek jobb becslést adni."} A közelítést ≈ jellel írjuk, az = jelet csak pontos egyenlőséghez használjuk.`,
    });
  };
  const rootCount = model.ok
    ? model.equationRootCount
    : "negative" in model && model.negative
      ? 0
      : null;
  const checkEquation = () => {
    if (rootCount === null) return;
    const chosen = text(value, "equationGuess");
    const correct = chosen === String(rootCount);
    patch({
      equationChecked: true,
      equationMessage: `${correct ? "Helyes darabszám." : "Gondold át az előjeleket és a nullát."} ${rootCount === 0 ? "Negatív szám nem lehet valós szám négyzete, ezért nincs valós megoldás." : rootCount === 1 ? "Az x² = 0 egyetlen megoldása x = 0. A +0 és −0 ugyanaz a szám." : "Pozitív jobb oldalnál két valós szám négyzete adja ugyanazt: √A és −√A. A √A jel önmagában csak a nemnegatív értéket jelenti."}`,
    });
  };
  const absolute = rootOfSquare(text(value, "a", "-5"));
  const checkAbsolute = () => {
    if (!absolute.ok) {
      patch({ absoluteMessage: absolute.message, absoluteShown: false });
      return;
    }
    const result = exactGuess(text(value, "absoluteGuess"), absolute.root);
    patch({
      absoluteShown: result !== "invalid",
      absoluteMessage:
        result === "invalid"
          ? "Írj egy nemnegatív számot vagy törtet."
          : `${result === "correct" ? "A jóslat helyes." : "A jóslat eltér a nemnegatív négyzetgyöktől; a szám nullától mért távolságát keresd."} A négyzetre emelés eltünteti az eredeti előjelet; a négyzetgyök a nemnegatív gyököt választja. Ezért √(a²) = |a|.`,
    });
  };
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Területből oldal</span>
        <h3>Melyik nemnegatív szám négyzete a terület?</h3>
        <p>
          A négyzetgyök jele egyetlen, nemnegatív értéket jelöl. Ha nincs véges
          tizedes alak, a gyökjel pontos marad, a tizedes számot pedig
          közelítésként jelöljük.
        </p>
      </header>
      <div className="lab-actions bl-examples">
        {["0", "2", "9", "36", "1/4", "-4"].map((sample) => (
          <button
            type="button"
            className="lab-button"
            key={sample}
            onClick={() => changeArea(sample)}
          >
            Vizsgáld: √({sample.replace("-", "−")})
          </button>
        ))}
      </div>
      <Field
        id={`${uid}-area`}
        testId="root-area"
        label="A terület / a gyökjel alatti szám"
        value={raw}
        onChange={changeArea}
        hint="A négyzet területe nemnegatív. Negatív számot is kipróbálhatsz, hogy lásd, miért nincs valós négyzetgyöke. Legfeljebb 400 abszolút értékig."
      />
      {!model.ok && (
        <p className="bl-feedback" role="status" data-testid="root-error">
          {model.message}
        </p>
      )}
      {model.ok && (
        <>
          <RootDiagram raw={raw} revealed={value.revealed === true} uid={uid} />
          <Field
            id={`${uid}-guess`}
            testId="root-guess"
            label="Jóslat: mekkora lehet a négyzet oldala?"
            value={text(value, "guess")}
            onChange={(next) =>
              patch({ guess: next, revealed: false, feedback: "" })
            }
            hint="Nemnégyzetszámnál becslést is adhatsz. A négyzetre emeléssel ellenőrzünk."
          />
          <button
            className="lab-button lab-button-primary"
            type="button"
            data-testid="root-check"
            onClick={checkRoot}
          >
            Jóslat ellenőrzése négyzetre emeléssel
          </button>
          {text(value, "feedback") && (
            <p
              className="bl-feedback"
              role="status"
              data-testid="root-feedback"
            >
              {text(value, "feedback")}
            </p>
          )}
          <div className="lab-control">
            <label className="lab-label" htmlFor={`${uid}-precision`}>
              A becslés felbontása
            </label>
            <select
              id={`${uid}-precision`}
              data-testid="root-precision"
              className="lab-number"
              value={precision}
              onChange={(event) =>
                patch({
                  precision: Number(event.currentTarget.value),
                  feedback: "",
                })
              }
            >
              <option value="0">Két egész szám között</option>
              <option value="1">Tizedek között</option>
              <option value="2">Századok között</option>
              <option value="3">Ezredek között</option>
            </select>
            <p>
              Előbb nézd meg a két szomszédos négyzetszámot, majd szűkítsd a
              közrezáró intervallumot.
            </p>
          </div>
          {value.revealed === true && (
            <>
              <div className="lab-summary" data-testid="root-exact">
                <p className="lab-equation">
                  √({exactText(model.area)})
                  {model.exact ? (
                    <>
                      {" "}
                      = <strong>{fractionAndDecimal(model.exact)}</strong>
                    </>
                  ) : (
                    <> a pontos jelölés.</>
                  )}
                </p>
                {!model.exact && (
                  <p>
                    Ennek a racionális számnak a négyzetgyöke nem racionális. A
                    tizedes közelítés nem egyenlő a pontos gyökkel.
                  </p>
                )}
              </div>
              <div className="bl-bounds" data-testid="root-bounds">
                <h4>A két határ ellenőrzése</h4>
                {model.exactAtPrecision ? (
                  <>
                    <p>
                      ({exactText(model.lower)})² = {exactText(model.area)}
                    </p>
                    <p>
                      √({exactText(model.area)}) = {exactText(model.lower)}{" "}
                      pontosan.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      ({exactText(model.lower)})² ={" "}
                      {fractionAndDecimal(rMultiply(model.lower, model.lower))}{" "}
                      &lt; {exactText(model.area)}
                    </p>
                    <p>
                      ({exactText(model.upper)})² ={" "}
                      {fractionAndDecimal(rMultiply(model.upper, model.upper))}{" "}
                      &gt; {exactText(model.area)}
                    </p>
                    <p className="lab-equation">
                      {exactText(model.lower)} &lt; √({exactText(model.area)})
                      &lt; {exactText(model.upper)}
                    </p>
                    <p className="lab-equation">
                      √({exactText(model.area)}) ≈{" "}
                      {exactText(model.approximation)}
                    </p>
                    <p>
                      Az utolsó sor {precision} tizedesjegyre kerekített
                      közelítés. A szigorú kétoldali határt az előző sor
                      mutatja.
                    </p>
                  </>
                )}
              </div>
            </>
          )}
        </>
      )}
      <section className="bl-section">
        <h4>Négyzetgyök vagy egyenlet?</h4>
        <p className="lab-equation">
          x² = {model.ok ? exactText(model.area) : raw.replace("-", "−")}
        </p>
        <p>
          A √A egy számot nevez meg. Az x² = A egyenlet minden olyan valós
          számot keres, amelynek négyzete A.
        </p>
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-equation-count`}>
            Hány valós megoldása van most az egyenletnek?
          </label>
          <select
            id={`${uid}-equation-count`}
            className="lab-number"
            data-testid="root-equation-count"
            value={text(value, "equationGuess")}
            onChange={(event) =>
              patch({
                equationGuess: event.currentTarget.value,
                equationChecked: false,
                equationMessage: "",
              })
            }
          >
            <option value="">Válassz darabszámot</option>
            <option value="0">0: nincs valós megoldás</option>
            <option value="1">1 megoldás</option>
            <option value="2">2 megoldás</option>
          </select>
        </div>
        <button
          className="lab-button"
          type="button"
          data-testid="root-equation-check"
          disabled={rootCount === null}
          onClick={checkEquation}
        >
          Az egyenlet megoldásainak ellenőrzése
        </button>
        {text(value, "equationMessage") && (
          <p
            className="bl-feedback"
            role="status"
            data-testid="root-equation-result"
          >
            {text(value, "equationMessage")}
          </p>
        )}
        {value.equationChecked === true && model.ok && (
          <p className="lab-equation">
            {model.area.n === 0n
              ? "x = 0"
              : model.exact
                ? `x = ${exactText(model.exact)} vagy x = −(${exactText(model.exact)})`
                : `x = √(${exactText(model.area)}) vagy x = −√(${exactText(model.area)})`}
          </p>
        )}
      </section>
      <section className="bl-section">
        <h4>Miért √(a²) = |a|?</h4>
        <Field
          id={`${uid}-a`}
          testId="root-original-a"
          label="Az eredeti a szám"
          value={text(value, "a", "-5")}
          onChange={(next) =>
            patch({ a: next, absoluteShown: false, absoluteMessage: "" })
          }
          hint="−20 és 20 között, negatív számmal és törttel is próbáld ki."
        />
        {absolute.ok ? (
          <p className="lab-equation">
            a² = ({exactText(absolute.a)})² ={" "}
            {fractionAndDecimal(absolute.square)}
          </p>
        ) : (
          <p className="bl-feedback">{absolute.message}</p>
        )}
        <Field
          id={`${uid}-absolute-guess`}
          testId="root-absolute-guess"
          label="Jóslat: mennyi a √(a²) értéke?"
          value={text(value, "absoluteGuess")}
          onChange={(next) =>
            patch({
              absoluteGuess: next,
              absoluteShown: false,
              absoluteMessage: "",
            })
          }
        />
        <button
          className="lab-button lab-button-primary"
          type="button"
          data-testid="root-absolute-check"
          onClick={checkAbsolute}
        >
          Az eredeti előjel ellenőrzése
        </button>
        {text(value, "absoluteMessage") && (
          <p className="bl-feedback" role="status">
            {text(value, "absoluteMessage")}
          </p>
        )}
        {value.absoluteShown === true && absolute.ok && (
          <div className="lab-summary" data-testid="root-absolute-result">
            <p className="lab-equation">
              √(({exactText(absolute.a)})²) = |{exactText(absolute.a)}| ={" "}
              {fractionAndDecimal(absolute.root)}
            </p>
            <p>
              A nulla távolsága önmagától nulla. Pozitív a-nál |a| = a; negatív
              a-nál |a| = −a.
            </p>
          </div>
        )}
      </section>
      <Thought
        value={value}
        onChange={onChange}
        uid={uid}
        question="Miért csak 6 a √36 értéke, miközben az x² = 36 egyenletnek −6 is megoldása? Mit jelent a √2 melletti ≈ jel?"
        checkpoints={[
          "A négyzetgyök definíció szerint nemnegatív.",
          "Az egyenlet két ellentett megoldása ugyanazt a pozitív négyzetet adja; nullánál csak egy megoldás van.",
          "A nemnégyzetszám gyökét két négyzetre emelhető határ közé szoríthatom.",
          "A gyökjel lehet pontos, miközben a véges tizedes leírás csak közelítés.",
          "A √(a²) az eredeti szám abszolút értéke, nem minden esetben maga az eredeti szám.",
        ]}
      />
    </>
  );
}

export function BridgeLab({ topic, value, onChange }: LabProps) {
  const uid = useId();
  const props = { value, onChange, uid };
  return (
    <div className="bridge-lab" data-testid={`bridge-lab-${topic}`}>
      {topic === "betus-kifejezesek" ? (
        <AlgebraLab {...props} />
      ) : topic === "szoveges-modellek" ? (
        <StoryLab {...props} />
      ) : topic === "hatvanyok" ? (
        <PowersLab {...props} />
      ) : topic === "negyzetgyok" ? (
        <RootsLab {...props} />
      ) : null}
    </div>
  );
}

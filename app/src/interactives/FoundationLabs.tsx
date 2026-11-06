import { useEffect, useId, useState } from "preact/hooks";
import type { LabProps, LabState, TopicId } from "../types";
import { formatRational, parseRational, rational } from "../math/engine";
import {
  appendProportionSample,
  convertModelUnit,
  exactHungarian,
  fractionAndDecimal,
  makeNumberLine,
  MODEL_UNITS,
  PROPORTION_MODELS,
  proportionValue,
  readProportionSamples,
  rAdd,
  rEqual,
  rNumber,
  unitBuilderModel,
  UNIT_DIMENSION_LABELS,
} from "../math/foundation-models";
import type { ProportionKind, UnitDimension } from "../math/foundation-models";
import {
  applyOrderStep,
  formatOrderExpression,
  getOrderChoices,
  orderLiteralValue,
  orderStepValue,
  parseOrderExpression,
  replayOrderSteps,
} from "../math/order";
import "./foundations.css";

const hu = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 8 });
const fmt = (n: number) => hu.format(Object.is(n, -0) ? 0 : n);
const text = (value: LabState, key: string, fallback = "") =>
  typeof value[key] === "string"
    ? (value[key] as string)
    : typeof value[key] === "number"
      ? String(value[key])
      : fallback;
function int(
  value: LabState,
  key: string,
  fallback: number,
  min: number,
  max: number,
) {
  const n = value[key];
  return typeof n === "number" && Number.isInteger(n) && n >= min && n <= max
    ? n
    : fallback;
}
const numberArray = (value: LabState, key: string) =>
  Array.isArray(value[key]) ? (value[key] as number[]) : [];
interface Props {
  value: LabState;
  onChange: (next: LabState) => void;
  uid: string;
}

function ScrollHint({ table = false }: { table?: boolean }) {
  return (
    <p className="fl-scroll-hint" data-testid="foundation-scroll-hint">
      {table ? "A táblázat" : "Az ábra"} oldalra is görgethető.
    </p>
  );
}

export function foundationInitialLabState(topic: TopicId): LabState {
  switch (topic) {
    case "szamfogalom":
      return {
        a: "-5",
        b: "-3",
        operation: "subtract",
        stepSize: "0,5",
        showOpposite: false,
        showAbsolute: false,
        moveStep: 0,
        prediction: "",
        thought: "",
      };
    case "muveleti-sorrend":
      return {
        preset: "serial",
        expression: "24 : 6 × 2",
        draft: "24 : 6 × 2",
        steps: [],
        selected: "",
        answer: "",
        orderMessage: "",
        thought: "",
      };
    case "aranyossag":
      return {
        model: "cord",
        input: "1,5",
        samples: [0, 1, 2],
        revealed: false,
        showRatio: false,
        showProduct: false,
        prediction: "",
        thought: "",
        classification: "",
        classificationMessage: "",
      };
    case "mertekegysegek":
      return {
        dimension: 2,
        scale: 1,
        layer: 1,
        divided: false,
        displayUnit: "dm2",
        estimate: "",
        builderMessage: "",
        amount: "0,4",
        from: "m2",
        to: "cm2",
        challenge: "",
        thought: "",
      };
    default:
      return {};
  }
}

function Thought({
  uid,
  value,
  onChange,
  question,
  checkpoints,
}: Props & { question: string; checkpoints: string[] }) {
  const [draft, setDraft] = useState(
    value.saveThought === true ? text(value, "thought") : "",
  );
  const saveThought = value.saveThought === true;
  useEffect(() => {
    if (saveThought) setDraft(text(value, "thought"));
  }, [saveThought, value.thought]);
  return (
    <aside className="lab-reflection">
      <h4>Mondd el a saját szavaiddal</h4>
      <label className="lab-label" htmlFor={`${uid}-thought`}>
        {question}
      </label>
      <textarea
        id={`${uid}-thought`}
        data-testid="foundation-thought"
        value={draft}
        rows={3}
        maxLength={600}
        onInput={(event) => {
          const next = event.currentTarget.value;
          setDraft(next);
          if (saveThought) onChange({ ...value, thought: next });
        }}
      />
      <label className="fl-thought-save" htmlFor={`${uid}-save-thought`}>
        <input
          id={`${uid}-save-thought`}
          data-testid="foundation-thought-save"
          type="checkbox"
          checked={saveThought}
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
        töröljük. Vendégmódban nincs tartós böngészős mentés. A program az
        indoklást nem pontozza automatikusan; a szempontokkal te vagy egy segítő
        ellenőrizhetitek.
      </p>
    </aside>
  );
}

function DecimalField({
  id,
  label,
  raw,
  unit,
  onChange,
  testId,
  hint,
}: {
  id: string;
  label: string;
  raw: string;
  unit?: string;
  onChange: (raw: string) => void;
  testId?: string;
  hint?: string;
}) {
  return (
    <div className="lab-control">
      <label className="lab-label" htmlFor={id}>
        {label}
        {unit && <span className="lab-unit"> · {unit}</span>}
      </label>
      <input
        id={id}
        data-testid={testId}
        className="lab-number"
        type="text"
        inputMode="decimal"
        maxLength={80}
        value={raw}
        onInput={(event) => onChange(event.currentTarget.value)}
        aria-describedby={hint ? `${id}-hint` : undefined}
        autoComplete="off"
      />
      {hint && (
        <span className="lab-bounds" id={`${id}-hint`}>
          {hint}
        </span>
      )}
    </div>
  );
}

function NumberLineLab({ value, onChange, uid }: Props) {
  const a = text(value, "a", "-5");
  const b = text(value, "b", "-3");
  const operation = value.operation === "add" ? "add" : "subtract";
  const model = makeNumberLine(a, b, operation);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const change = (next: LabState) => patch({ ...next, moveStep: 0 });
  const moveStep = int(value, "moveStep", 0, 0, 2);
  const step =
    parseRational(text(value, "stepSize", "0,5")) ?? rational(1n, 2n);
  const nudge = (key: "a" | "b", direction: 1 | -1) => {
    const current = parseRational(key === "a" ? a : b);
    if (current)
      change({
        [key]: exactHungarian(
          rAdd(current, rational(step.n * BigInt(direction), step.d)),
        ),
      });
  };
  const predicted = parseRational(text(value, "prediction"));
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Számok mozgásban</span>
        <h3>Irány, hely és távolság</h3>
        <p>
          Ugyanaz a pont több kérdésre ad választ: hol van, melyik oldalon van,
          és milyen messze van a nullától? A távolság és az előjel külön
          információ.
        </p>
      </header>
      <div className="lab-controls">
        {(["a", "b"] as const).map((key) => (
          <div className="fl-coordinate" key={key}>
            <DecimalField
              id={`${uid}-${key}`}
              testId={`number-${key}`}
              label={
                key === "a"
                  ? "a — az A pont koordinátája"
                  : "b — a B pont koordinátája"
              }
              raw={key === "a" ? a : b}
              onChange={(raw) => change({ [key]: raw })}
              hint="Negatív számot, tizedesvesszőt és egyszerű törtet is használhatsz."
            />
            <div className="fl-stepper">
              <button
                className="lab-button"
                type="button"
                aria-label={`${key} csökkentése ${exactHungarian(step)}-del`}
                onClick={() => nudge(key, -1)}
              >
                − {exactHungarian(step)}
              </button>
              <button
                className="lab-button"
                type="button"
                aria-label={`${key} növelése ${exactHungarian(step)}-del`}
                onClick={() => nudge(key, 1)}
              >
                + {exactHungarian(step)}
              </button>
            </div>
          </div>
        ))}
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-operation`}>
            Művelet az a pontból indulva
          </label>
          <select
            className="lab-number"
            id={`${uid}-operation`}
            data-testid="number-operation"
            value={operation}
            onChange={(event) =>
              change({ operation: event.currentTarget.value })
            }
          >
            <option value="add">Összeadás: a + b</option>
            <option value="subtract">Kivonás: a − b</option>
          </select>
        </div>
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-step`}>
            A léptetőgombok lépésköze
          </label>
          <select
            className="lab-number"
            id={`${uid}-step`}
            value={text(value, "stepSize", "0,5")}
            onChange={(event) => patch({ stepSize: event.currentTarget.value })}
          >
            <option value="0,5">Fél egység</option>
            <option value="1">Egy egység</option>
          </select>
        </div>
      </div>
      <div className="lab-actions">
        <button
          type="button"
          className="lab-button"
          data-testid="number-opposite"
          aria-pressed={value.showOpposite === true}
          onClick={() => patch({ showOpposite: !value.showOpposite })}
        >
          Mutasd az a ellentettjét
        </button>
        <button
          type="button"
          className="lab-button"
          data-testid="number-absolute"
          aria-pressed={value.showAbsolute === true}
          onClick={() => patch({ showAbsolute: !value.showAbsolute })}
        >
          Mutasd az abszolút értékeket
        </button>
        <button
          type="button"
          className="lab-button"
          onClick={() => onChange(foundationInitialLabState("szamfogalom"))}
        >
          Számegyenes újrakezdése
        </button>
      </div>
      {!model.ok ? (
        <p className="fl-feedback" role="status">
          {model.message}
        </p>
      ) : (
        <>
          <dl className="fl-facts">
            <div>
              <dt>A számok sorrendje</dt>
              <dd>
                {exactHungarian(model.a)} {model.comparison}{" "}
                {exactHungarian(model.b)}
              </dd>
            </div>
            <div>
              <dt>Távolságuk a nullától</dt>
              <dd>
                |{exactHungarian(model.a)}| = {exactHungarian(model.absoluteA)};
                |{exactHungarian(model.b)}| = {exactHungarian(model.absoluteB)}
              </dd>
            </div>
            <div>
              <dt>Az abszolút értékek sorrendje</dt>
              <dd>
                |{exactHungarian(model.a)}| {model.magnitudeComparison} |
                {exactHungarian(model.b)}|
              </dd>
            </div>
            <div>
              <dt>A két pont távolsága</dt>
              <dd>{exactHungarian(model.distance)} egység</dd>
            </div>
            {value.showOpposite === true && (
              <div>
                <dt>Az a ellentettje</dt>
                <dd>
                  −({exactHungarian(model.a)}) ={" "}
                  {exactHungarian(model.opposite)}
                </dd>
              </div>
            )}
          </dl>
          <ScrollHint />
          <div
            className="lab-plot-scroll fl-plot"
            role="region"
            tabIndex={0}
            aria-label="Számegyenes, szükség esetén vízszintesen görgethető; minden adat szövegesen is olvasható"
          >
            {(() => {
              const x = (n: number) =>
                48 + ((n - model.min) / (model.max - model.min)) * 460;
              const xa = x(rNumber(model.a));
              const xb = x(rNumber(model.b));
              const xr = x(rNumber(model.result));
              const zero = x(0);
              const anchor = (position: number) =>
                position < 160 ? "start" : position > 395 ? "end" : "middle";
              return (
                <svg
                  className="lab-svg fl-numberline"
                  viewBox="0 0 560 310"
                  role="img"
                  aria-labelledby={`${uid}-line-title ${uid}-line-desc`}
                >
                  <title id={`${uid}-line-title`}>
                    Az A és B pont a számegyenesen
                  </title>
                  <desc id={`${uid}-line-desc`}>
                    A koordinátája {exactHungarian(model.a)}, B koordinátája{" "}
                    {exactHungarian(model.b)}. Távolságuk{" "}
                    {exactHungarian(model.distance)}. Az ábratartomány{" "}
                    {fmt(model.min)} és {fmt(model.max)} között van.
                    {moveStep >= 2
                      ? ` Az elmozdulás végpontja E = ${exactHungarian(model.result)}; a szaggatott vetítővonal összeköti a nyilat a tengelyen megjelölt E ponttal.`
                      : ""}
                  </desc>
                  <defs>
                    <marker
                      id={`${uid}-arrow`}
                      viewBox="0 0 10 10"
                      refX="9"
                      refY="5"
                      markerWidth="7"
                      markerHeight="7"
                      orient="auto-start-reverse"
                    >
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#27695f" />
                    </marker>
                  </defs>
                  <line
                    x1={xa}
                    x2={xb}
                    y1="40"
                    y2="40"
                    stroke="#55665d"
                    stroke-width="2"
                  />
                  {[xa, xb].map((px, i) => (
                    <line
                      key={i}
                      x1={px}
                      x2={px}
                      y1="33"
                      y2="48"
                      stroke="#55665d"
                      stroke-width="2"
                    />
                  ))}
                  <text
                    x="278"
                    y="22"
                    text-anchor="middle"
                    className="lab-svg-label"
                  >
                    A és B távolsága: {exactHungarian(model.distance)}
                  </text>
                  {value.showAbsolute === true && (
                    <g>
                      <line
                        x1={zero}
                        x2={xa}
                        y1="65"
                        y2="65"
                        stroke="#b58937"
                        stroke-width="7"
                      />
                      <text x="48" y="60" className="lab-svg-small">
                        A: {exactHungarian(model.absoluteA)} a nullától
                      </text>
                      <line
                        x1={zero}
                        x2={xb}
                        y1="92"
                        y2="92"
                        stroke="#427caa"
                        stroke-width="5"
                        stroke-dasharray="8 3"
                      />
                      <text x="48" y="87" className="lab-svg-small">
                        B: {exactHungarian(model.absoluteB)} a nullától
                      </text>
                    </g>
                  )}
                  <line
                    x1="30"
                    x2="530"
                    y1="130"
                    y2="130"
                    stroke="#263b36"
                    stroke-width="2"
                    marker-end={`url(#${uid}-arrow)`}
                  />
                  {model.ticks.map((tick, i) => (
                    <g key={i}>
                      <line
                        x1={x(tick)}
                        x2={x(tick)}
                        y1="124"
                        y2="136"
                        stroke="#263b36"
                      />
                      <text
                        x={x(tick)}
                        y="116"
                        text-anchor={
                          i === 0
                            ? "start"
                            : i === model.ticks.length - 1
                              ? "end"
                              : "middle"
                        }
                        className="lab-svg-small"
                      >
                        {fmt(tick)}
                      </text>
                    </g>
                  ))}
                  <line
                    x1={zero}
                    x2={zero}
                    y1="120"
                    y2="140"
                    stroke="#172b32"
                    stroke-width="3"
                  />
                  {moveStep >= 2 && (
                    <g>
                      <line
                        x1={xa}
                        x2={xa}
                        y1="139"
                        y2="244"
                        stroke="#27695f"
                        stroke-width="1"
                        stroke-dasharray="4 4"
                      />
                      <line
                        x1={xr}
                        x2={xr}
                        y1="139"
                        y2="244"
                        stroke="#27695f"
                        stroke-width="1"
                        stroke-dasharray="4 4"
                      />
                    </g>
                  )}
                  <circle
                    cx={xa}
                    cy="130"
                    r={moveStep >= 1 ? 8 : 6}
                    fill="#27766e"
                    stroke="#173d36"
                    stroke-width="2"
                  />
                  <line x1={xa} x2={xa} y1="140" y2="151" stroke="#27766e" />
                  <text
                    x={xa}
                    y="169"
                    text-anchor={anchor(xa)}
                    className="lab-svg-label fl-point-label"
                  >
                    A = {exactHungarian(model.a)}
                  </text>
                  <rect
                    x={xb - 5}
                    y="125"
                    width="10"
                    height="10"
                    fill="#e7c27d"
                    stroke="#594018"
                    stroke-width="2"
                  />
                  <line
                    x1={xb}
                    x2={xb}
                    y1="140"
                    y2="180"
                    stroke="#7b5b28"
                    stroke-dasharray="3 3"
                  />
                  <text
                    x={xb}
                    y="195"
                    text-anchor={anchor(xb)}
                    className="lab-svg-label fl-point-label"
                  >
                    B = {exactHungarian(model.b)}
                  </text>
                  {value.showOpposite === true && (
                    <g>
                      <path
                        d={`M ${x(rNumber(model.opposite))} 121 l 7 14 h -14 z`}
                        fill="#fff"
                        stroke="#714e82"
                        stroke-width="2"
                      />
                      <line
                        x1={x(rNumber(model.opposite))}
                        x2={x(rNumber(model.opposite))}
                        y1="139"
                        y2="205"
                        stroke="#714e82"
                        stroke-dasharray="4 3"
                      />
                      <text
                        x={x(rNumber(model.opposite))}
                        y="221"
                        text-anchor={anchor(x(rNumber(model.opposite)))}
                        className="lab-svg-label fl-point-label"
                      >
                        −a = {exactHungarian(model.opposite)}
                      </text>
                    </g>
                  )}
                  {moveStep >= 2 && (
                    <g>
                      <path
                        data-testid="number-result-point"
                        d={`M ${xr} 122 l 8 8 l -8 8 l -8 -8 z`}
                        fill="#fffdf7"
                        stroke="#27695f"
                        stroke-width="2"
                      />
                      <text
                        x={xr + 11}
                        y="147"
                        className="lab-svg-small fl-point-label"
                      >
                        E
                      </text>
                      <line
                        data-testid="number-movement-arrow"
                        x1={xa}
                        x2={xr}
                        y1="248"
                        y2="248"
                        stroke="#27695f"
                        stroke-width="3"
                        marker-end={
                          model.displacement.n === 0n
                            ? undefined
                            : `url(#${uid}-arrow)`
                        }
                      />
                      <circle cx={xr} cy="248" r="5" fill="#27695f" />
                      <text
                        x="278"
                        y="276"
                        text-anchor="middle"
                        className="lab-svg-label"
                      >
                        Végpont E: {exactHungarian(model.result)}; elmozdulás:{" "}
                        {exactHungarian(model.displacement)}
                      </text>
                    </g>
                  )}
                </svg>
              );
            })()}
          </div>
          <p className="lab-note">
            Az ellentett a nullára tükrözött hely. Az abszolút érték a nullától
            mért, nemnegatív távolság. A nézet automatikusan kitágul, ha
            szükséges; az eredményt nem írja át.
          </p>
          <DecimalField
            id={`${uid}-prediction`}
            label="Jóslat: hova érkezünk a művelet után?"
            raw={text(value, "prediction")}
            onChange={(raw) => patch({ prediction: raw })}
          />
          <div className="lab-actions">
            <button
              data-testid="number-step-start"
              className="lab-button"
              type="button"
              onClick={() => patch({ moveStep: 1 })}
            >
              1. Indulj az a pontból
            </button>
            <button
              data-testid="number-step-move"
              className="lab-button lab-button-primary"
              type="button"
              onClick={() => patch({ moveStep: 2 })}
            >
              2. Mutasd az elmozdulást
            </button>
          </div>
          {moveStep >= 2 && (
            <div
              className="lab-summary"
              data-testid="number-result"
              role="status"
            >
              <p className="lab-equation">
                {exactHungarian(model.a)} {operation === "add" ? "+" : "−"} (
                {exactHungarian(model.b)})
                {operation === "subtract"
                  ? ` = ${exactHungarian(model.a)} + (${exactHungarian(model.displacement)})`
                  : ""}{" "}
                = <strong>{exactHungarian(model.result)}</strong>
              </p>
              <p>
                {model.displacement.n === 0n
                  ? "Nullát adunk hozzá: nincs elmozdulás."
                  : `${exactHungarian(rational(model.displacement.n < 0n ? -model.displacement.n : model.displacement.n, model.displacement.d))} egységet lépünk ${model.displacement.n < 0n ? "balra" : "jobbra"}.`}
              </p>
              {operation === "subtract" && (
                <p>
                  A kivonás az ellentett hozzáadása:{" "}
                  <strong>a − b = a + (−b)</strong>.
                </p>
              )}
              <p>
                {predicted
                  ? rEqual(predicted, model.result)
                    ? "A jóslatod egyezik a végponttal. Mi indokolja az irányt?"
                    : "A jóslatod és a végpont eltér. Nézd meg, milyen előjelű számot adunk hozzá, miután a kivonást átírtuk."
                  : "A következő beállításnál jósolj is, mielőtt megmutatod az elmozdulást."}
              </p>
            </div>
          )}
        </>
      )}
      <Thought
        value={value}
        onChange={onChange}
        uid={uid}
        question="Hogyan lehet −8 kisebb, mint −3, miközben az abszolút értéke nagyobb?"
        checkpoints={[
          "A számok sorrendjét a balra–jobbra elhelyezkedés dönti el.",
          "Az abszolút érték távolság, ezért a nullától távolabbi ponté nagyobb.",
          "Negatív szám kivonásakor annak pozitív ellentettjét adjuk hozzá.",
        ]}
      />
    </>
  );
}

export const ORDER_PRESETS = [
  { id: "serial", label: "Azonos szint: 24 : 6 × 2", expression: "24 : 6 × 2" },
  {
    id: "left-independent",
    label: "Két független szorzás",
    expression: "5 × 2 + 3 × 4",
  },
  { id: "brackets", label: "A zárójel szerepe", expression: "2 × (3 + 4)" },
  {
    id: "minus-power",
    label: "A három négyzetének ellentettje",
    expression: "−3²",
  },
  {
    id: "negative-power",
    label: "A negatív három négyzete",
    expression: "(−3)²",
  },
  {
    id: "zero",
    label: "Mi történik, ha a nevező nulla?",
    expression: "8 : (3 − 3)",
  },
  {
    id: "nested",
    label: "Egymásba ágyazott zárójelek",
    expression: "2 × [3 + (7 − 5)]",
  },
  {
    id: "worked",
    label: "Többlépéses műveletsor",
    expression: "30 − 18 : 3 + 2 × 4",
  },
] as const;

function OrderLab({ value, onChange, uid }: Props) {
  const source = text(value, "expression", ORDER_PRESETS[0].expression);
  const steps = numberArray(value, "steps");
  const replay = replayOrderSteps(source, steps);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const load = (expression: string, preset = "custom") =>
    onChange({
      ...foundationInitialLabState("muveleti-sorrend"),
      expression,
      draft: expression,
      preset,
    });
  const choices = replay.ok ? getOrderChoices(replay.tree) : [];
  const selected = choices.find(
    (choice) => choice.key === text(value, "selected"),
  );
  const selectedValue =
    replay.ok && selected?.nodeId !== undefined && selected.ready
      ? orderStepValue(replay.tree, selected.nodeId)
      : null;
  const final = replay.ok ? orderLiteralValue(replay.tree) : null;
  const mathematicalStop = replay.ok
    ? choices
        .filter((choice) => choice.ready && choice.nodeId !== undefined)
        .map((choice) => orderStepValue(replay.tree, choice.nodeId!))
        .find((result) => !result.ok && result.undefined)
    : null;
  const choose = (key: string) => {
    const choice = choices.find((entry) => entry.key === key);
    if (!choice) return;
    const result =
      replay.ok && choice.nodeId !== undefined && choice.ready
        ? orderStepValue(replay.tree, choice.nodeId)
        : null;
    patch({
      selected: key,
      answer: "",
      orderMessage:
        result && !result.ok
          ? result.message
          : choice.ready
            ? `Ez a rész kiszámítható. ${choice.reason}`
            : choice.reason,
    });
  };
  const check = () => {
    if (!replay.ok || selected?.nodeId === undefined) return;
    const result = applyOrderStep(
      replay.tree,
      selected.nodeId,
      text(value, "answer"),
    );
    if (result.status === "correct")
      patch({
        steps: [...replay.history.map((entry) => entry.id), selected.nodeId],
        selected: "",
        answer: "",
        orderMessage: `Helyes részszámítás. ${result.message}`,
      });
    else patch({ orderMessage: result.message });
  };
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Műveleti sorrend műhely</span>
        <h3>Melyik rész számolható ki most?</h3>
        <p>
          Válassz egy részszámítást, írd be az értékét, és figyeld, hogyan
          változik az egész kifejezés. A zárójel egy teljes részt fog össze. A
          független részek között több helyes sorrend is lehet.
        </p>
      </header>
      <div className="lab-control">
        <label className="lab-label" htmlFor={`${uid}-preset`}>
          Válassz vizsgálni való kifejezést
        </label>
        <select
          id={`${uid}-preset`}
          data-testid="order-preset"
          className="lab-number"
          value={text(value, "preset", "serial")}
          onChange={(event) => {
            const preset = ORDER_PRESETS.find(
              (entry) => entry.id === event.currentTarget.value,
            );
            if (preset) load(preset.expression, preset.id);
          }}
        >
          {ORDER_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.label}
            </option>
          ))}
          {value.preset === "custom" && (
            <option value="custom">Saját kifejezés</option>
          )}
        </select>
      </div>
      <details className="fl-custom">
        <summary>Saját rövid kifejezést próbálok</summary>
        <label className="lab-label" htmlFor={`${uid}-draft`}>
          Kifejezés
        </label>
        <input
          id={`${uid}-draft`}
          className="lab-number"
          type="text"
          maxLength={220}
          value={text(value, "draft", source)}
          onInput={(event) => patch({ draft: event.currentTarget.value })}
        />
        <p className="lab-note">
          Számok, +, −, ×, :, ^, (), [] használhatók. A szorzásjelet mindig írd
          ki. A műhely 0–8 közötti egész kitevőt kezel; más programkódot nem
          értelmez.
        </p>
        <button
          type="button"
          className="lab-button"
          onClick={() => {
            const parsed = parseOrderExpression(text(value, "draft"));
            if (parsed.ok) load(text(value, "draft"));
            else patch({ orderMessage: parsed.message });
          }}
        >
          Saját kifejezés indítása
        </button>
      </details>
      <div className="lab-summary">
        <p className="lab-note">Eredeti teljes kifejezés</p>
        <p className="lab-equation">{source}</p>
        <p className="lab-note">Most itt tartunk</p>
        <p className="lab-equation fl-current" data-testid="order-current">
          {replay.ok
            ? formatOrderExpression(replay.tree)
                .split(/([()[\]])/)
                .map((part, i) =>
                  /[()[\]]/.test(part) ? (
                    <span className="fl-bracket" key={i}>
                      {part}
                    </span>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )
            : replay.message}
        </p>
      </div>
      {replay.ok && replay.warning && (
        <p role="status" className="fl-feedback">
          {replay.warning}
        </p>
      )}
      {choices.length > 0 && !mathematicalStop && (
        <>
          <h4>1. Jelöld ki a következő részszámítást</h4>
          <div
            data-testid="order-candidates"
            className="fl-order-choices"
            role="group"
            aria-label="Következő részszámítás választása"
          >
            {choices.map((choice) => (
              <button
                key={choice.key}
                type="button"
                className="lab-button fl-order-choice"
                aria-label={`${choice.operation}: ${choice.expression}`}
                aria-pressed={selected?.key === choice.key}
                onClick={() => choose(choice.key)}
              >
                <span>{choice.operation}: </span>
                <strong>{choice.expression}</strong>
              </button>
            ))}
          </div>
          {selected?.ready && selectedValue?.ok && (
            <form
              className="fl-step-answer"
              onSubmit={(event) => {
                event.preventDefault();
                check();
              }}
            >
              <label className="lab-label" htmlFor={`${uid}-answer`}>
                2. Mennyi a kijelölt rész értéke? {selected.expression}
              </label>
              <input
                id={`${uid}-answer`}
                data-testid="order-answer"
                className="lab-number"
                type="text"
                inputMode="decimal"
                maxLength={80}
                value={text(value, "answer")}
                onInput={(event) =>
                  patch({ answer: event.currentTarget.value })
                }
                autoComplete="off"
              />
              <button
                data-testid="order-submit"
                className="lab-button lab-button-primary"
                type="submit"
              >
                Részszámítás ellenőrzése
              </button>
            </form>
          )}
        </>
      )}
      {text(value, "orderMessage") && (
        <p className="fl-feedback" role="status" data-testid="order-message">
          {text(value, "orderMessage")}
        </p>
      )}
      {mathematicalStop && !mathematicalStop.ok && (
        <div
          className="fl-feedback fl-undefined"
          role="status"
          data-testid="order-final"
        >
          <strong>A teljes kifejezés nincs értelmezve.</strong>
          <p>{mathematicalStop.message}</p>
        </div>
      )}
      {final && (
        <div className="lab-check" role="status" data-testid="order-final">
          A teljes kifejezés értéke:{" "}
          <strong>{fractionAndDecimal(final)}</strong>. Nézd végig, melyik lépés
          miért őrizte meg az értéket.
        </div>
      )}
      {replay.ok && replay.history.length > 0 && (
        <div className="fl-history">
          <h4>Az eddigi egyenlőséglánc</h4>
          <ol className="lab-history">
            {replay.history.map((entry, i) => (
              <li key={`${entry.id}-${i}`}>
                <strong>
                  {entry.before} = {entry.after}
                </strong>
                <span>{entry.reason}</span>
                <button
                  type="button"
                  className="lab-button lab-button-text"
                  onClick={() =>
                    patch({
                      steps: steps.slice(0, i + 1),
                      selected: "",
                      answer: "",
                      orderMessage:
                        "Ehhez az állapothoz tértél vissza. Innen újra választhatsz következő részszámítást.",
                    })
                  }
                >
                  Visszatérés a(z) {i + 1}. lépéshez
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="lab-actions">
        <button
          className="lab-button"
          data-testid="order-reset"
          type="button"
          onClick={() => load(source, text(value, "preset", "custom"))}
        >
          Kifejezés újrakezdése
        </button>
        {steps.length > 0 && (
          <button
            className="lab-button"
            type="button"
            onClick={() =>
              patch({
                steps: steps.slice(0, -1),
                selected: "",
                answer: "",
                orderMessage: "Visszaléptél egy részszámítást.",
              })
            }
          >
            Egy lépéssel vissza
          </button>
        )}
      </div>
      <Thought
        value={value}
        onChange={onChange}
        uid={uid}
        question="Miért kezdheted bármelyik szorzással az 5 × 2 + 3 × 4 példát, de miért nem kezdheted a 6 × 2-vel a 24 : 6 × 2-t?"
        checkpoints={[
          "Az első kifejezésben a két szorzat külön operandusa az összeadásnak.",
          "A másodikban az osztás és szorzás balról jobbra kapcsolódik; az első teljes operandus a 24 : 6.",
          "A 6 × 2 előzetes összevonásával a 24 : (6 × 2) kifejezést kapnánk, ami mást jelent.",
        ]}
      />
    </>
  );
}

function ProportionLab({ value, onChange, uid }: Props) {
  const kind: ProportionKind =
    value.model === "work" || value.model === "fare" ? value.model : "cord";
  const model = PROPORTION_MODELS[kind];
  const raw = text(value, "input", model.start);
  const current = proportionValue(kind, raw);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const samples = readProportionSamples(
    kind,
    value.exactSamples,
    value.samples,
  );
  const rows = samples
    .map((x) => proportionValue(kind, x))
    .filter((row) => row.ok)
    .sort((a, b) => {
      const difference = a.x.n * b.x.d - b.x.n * a.x.d;
      return difference < 0n ? -1 : difference > 0n ? 1 : 0;
    });
  const revealed = value.revealed === true && current.ok;
  const prediction = parseRational(text(value, "prediction"));
  const chooseModel = (next: string) => {
    const nextKind: ProportionKind =
      next === "work" || next === "fare" ? next : "cord";
    onChange({
      ...foundationInitialLabState("aranyossag"),
      model: nextKind,
      input: PROPORTION_MODELS[nextKind].start,
      samples: [...PROPORTION_MODELS[nextKind].samples],
    });
  };
  const reveal = () => {
    if (!current.ok) return;
    const added = appendProportionSample(kind, samples, raw);
    patch({
      revealed: true,
      exactSamples: added.exactSamples,
      samplesTrimmed: value.samplesTrimmed === true || added.discarded,
    });
  };
  const classify = () => {
    const chosen = text(value, "classification");
    const correct = chosen === model.type;
    const evidence =
      kind === "cord"
        ? "A megadott szabály y = 400x. Pozitív hossznál az ár/hossz mindig 400 Ft/m; 0 m-hez 0 Ft tartozik."
        : kind === "work"
          ? "A feltételezett teljes munka 24 segítőóra: 3 × 8 = 6 × 4 = 24. Az állandó szorzat fordított arányosságot jelez ebben a modellben."
          : "2 km ára 900 Ft, 4 km ára 1300 Ft. A kétszeres út nem kétszeres teljes díjat jelent; az 500 Ft alapdíj megmarad. A hányados és a szorzat is változik.";
    patch({
      classificationMessage: chosen
        ? `${correct ? "Helyes kapcsolatot választottál." : "Ezt a választ vizsgáld újra a megadott modellel."} ${evidence} Néhány adatpár önmagában még nem bizonyít általános szabályt; a történet feltételeit is használjuk.`
        : "Előbb válassz kapcsolatot, és fogalmazz meg hozzá egy indokot.",
    });
  };
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Arányosság-vizsgáló</span>
        <h3>Mi marad állandó?</h3>
        <p>
          A történet, a táblázat és az ábra ugyanarról a kapcsolatról szól.
          Változtass egy adatot, jósolj, majd gyűjts új pontot a már látható
          három összehasonlítás mellé.
        </p>
      </header>
      <div className="lab-control">
        <label htmlFor={`${uid}-model`} className="lab-label">
          Vizsgált történet
        </label>
        <select
          id={`${uid}-model`}
          data-testid="proportion-model"
          className="lab-number"
          value={kind}
          onChange={(event) => chooseModel(event.currentTarget.value)}
        >
          <option value="cord">Zsinór ára — nincs alapdíj</option>
          <option value="work">Közös munka — rögzített feladat</option>
          <option value="fare">Alapdíjas út — ellenpélda</option>
        </select>
      </div>
      <div className="lab-observation">
        <h4>{model.title}</h4>
        <p>{model.story}</p>
        <p className="lab-equation">{model.formula}</p>
      </div>
      <div className="lab-controls">
        <div>
          <DecimalField
            id={`${uid}-input`}
            testId="proportion-input"
            label={model.xLabel}
            unit={model.xUnit}
            raw={raw}
            onChange={(next) => patch({ input: next, revealed: false })}
            hint={
              kind === "work"
                ? "1–12 fő; csak pozitív egész létszám."
                : `${model.min}–${model.max} ${model.xUnit}; a csúszka lépése ${fmt(model.step)} ${model.xUnit}.`
            }
          />
          <label className="fl-range-label" htmlFor={`${uid}-range`}>
            {model.xLabel} csúszkával
          </label>
          <input
            id={`${uid}-range`}
            type="range"
            min={model.min}
            max={model.max}
            step={model.step}
            value={current.ok ? rNumber(current.x) : model.min}
            aria-valuetext={`${current.ok ? exactHungarian(current.x) : "Érvénytelen kézi érték"} ${model.xUnit}`}
            onInput={(event) =>
              patch({ input: event.currentTarget.value, revealed: false })
            }
          />
        </div>
        <DecimalField
          id={`${uid}-prediction`}
          label={`Jóslat: ${model.yLabel.toLowerCase()}`}
          unit={model.yUnit}
          raw={text(value, "prediction")}
          onChange={(next) => patch({ prediction: next, revealed: false })}
          hint="Előbb gondold át, miért ezt az értéket várod."
        />
      </div>
      {!current.ok && (
        <p role="status" className="fl-feedback">
          {current.message}
        </p>
      )}
      <button
        data-testid="proportion-reveal"
        className="lab-button lab-button-primary"
        type="button"
        disabled={!current.ok}
        onClick={reveal}
      >
        Jóslat ellenőrzése és adatpár hozzáadása
      </button>
      {revealed && current.ok && (
        <div
          className="lab-summary"
          role="status"
          data-testid="proportion-result"
        >
          <p className="lab-equation">
            {exactHungarian(current.x)} {model.xUnit} →{" "}
            <strong>
              {fractionAndDecimal(current.y)} {model.yUnit}
            </strong>
          </p>
          <p>
            {prediction
              ? rEqual(prediction, current.y)
                ? "A jóslatod egyezik az adott modell értékével."
                : "A jóslat eltér az adott modell értékétől. Nézd meg az alapdíjat, az egységárat vagy a teljes munkát, és indokold újra."
              : "Az új adatpár bekerült a táblázatba. Következő alkalommal előbb jósolj, majd ellenőrizd."}
          </p>
          {kind === "work" && (
            <p>
              A nem egész óraszámot pontos törtként adjuk meg; például 24/5 óra
              = 4,8 óra. Ez nem 4 óra 80 perc.
            </p>
          )}
        </div>
      )}
      <div className="lab-actions">
        <button
          type="button"
          data-testid="proportion-ratio-toggle"
          className="lab-button"
          aria-pressed={value.showRatio === true}
          onClick={() => patch({ showRatio: !value.showRatio })}
        >
          Mutasd a hányadost (y/x)
        </button>
        <button
          type="button"
          data-testid="proportion-product-toggle"
          className="lab-button"
          aria-pressed={value.showProduct === true}
          onClick={() => patch({ showProduct: !value.showProduct })}
        >
          Mutasd a szorzatot (x · y)
        </button>
      </div>
      <p className="lab-note">
        A három kiinduló adatpár és a hozzáadott pontok. A sorok pontos
        értékeket mutatnak.
      </p>
      <ScrollHint table />
      <div
        className="lab-table-scroll"
        role="region"
        tabIndex={0}
        aria-label="Legalább három adatpár táblázata"
      >
        <table className="lab-table fl-proportion-table">
          <caption>Adatpárok</caption>
          <thead>
            <tr>
              <th scope="col">
                {model.xLabel} ({model.xUnit})
              </th>
              <th scope="col">
                {model.yLabel} ({model.yUnit})
              </th>
              {value.showRatio === true && <th scope="col">Hányados: y/x</th>}
              {value.showProduct === true && (
                <th scope="col">Szorzat: x · y</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={formatRational(row.x)}
                data-testid="proportion-data-row"
                data-sample-x={formatRational(row.x)}
                className={
                  revealed && current.ok && rEqual(row.x, current.x)
                    ? "lab-row-selected"
                    : undefined
                }
              >
                <th scope="row">{exactHungarian(row.x)}</th>
                <td>{fractionAndDecimal(row.y)}</td>
                {value.showRatio === true && (
                  <td>
                    {row.quotient
                      ? fractionAndDecimal(row.quotient)
                      : "0-val itt nem osztunk"}
                  </td>
                )}
                {value.showProduct === true && (
                  <td>{fractionAndDecimal(row.product)}</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {value.samplesTrimmed === true && (
        <p className="lab-note">
          A három kiinduló adatpár megmarad. A táblázat az újabb hozzáadott
          pontokat őrzi meg; a régebbiek egy része már nincs benne. A látható
          értékeket nem kerekítjük.
        </p>
      )}
      <ScrollHint />
      <div
        className="lab-plot-scroll fl-plot"
        role="region"
        tabIndex={0}
        aria-label="A modell grafikonja; a pontos adatokat a táblázat is tartalmazza"
      >
        {(() => {
          const x = (n: number) => 62 + (n / model.max) * 430;
          const maxY = kind === "work" ? 24 : kind === "cord" ? 2000 : 2500;
          const yIntervals = kind === "fare" ? 5 : 4;
          const xTicks =
            kind === "work"
              ? [0, 2, 4, 6, 8, 10, 12]
              : Array.from({ length: 6 }, (_, i) => (model.max * i) / 5);
          const y = (n: number) => 240 - (n / maxY) * 190;
          const graph =
            kind === "work"
              ? Array.from({ length: 12 }, (_, i) =>
                  proportionValue(kind, String(i + 1)),
                )
              : [];
          return (
            <svg
              className="lab-svg fl-proportion-graph"
              viewBox="0 0 550 320"
              role="img"
              aria-labelledby={`${uid}-graph-title ${uid}-graph-desc`}
            >
              <title id={`${uid}-graph-title`}>
                {model.title}: {model.formula}
              </title>
              <desc id={`${uid}-graph-desc`}>
                {kind === "work"
                  ? "Csak az 1–12 közötti egész segítőszámokhoz rajzolunk pontokat; a pontokat nem kötjük folytonos görbévé."
                  : kind === "cord"
                    ? "Az ár a hosszúsággal egyenes arányos; az egyenes átmegy az origón."
                    : "A teljes díj egyenesen emelkedik, de a függőleges tengelyt 500 forintnál metszi, ezért nem egyenes arányosság."}
              </desc>
              {Array.from({ length: yIntervals + 1 }, (_, i) => {
                const v = (maxY * i) / yIntervals;
                return (
                  <g key={i}>
                    <line
                      x1="62"
                      x2="492"
                      y1={y(v)}
                      y2={y(v)}
                      stroke="#cddbd2"
                    />
                    <text
                      x="53"
                      y={y(v) + 4}
                      text-anchor="end"
                      className="lab-svg-small"
                    >
                      {fmt(v)}
                    </text>
                  </g>
                );
              })}
              <line
                x1="62"
                x2="492"
                y1="240"
                y2="240"
                stroke="#263b36"
                stroke-width="2"
              />
              <line
                x1="62"
                x2="62"
                y1="45"
                y2="240"
                stroke="#263b36"
                stroke-width="2"
              />
              {xTicks.map((v) => (
                <g key={v} data-testid="proportion-x-tick" data-value={v}>
                  <line
                    x1={x(v)}
                    x2={x(v)}
                    y1="240"
                    y2="247"
                    stroke="#263b36"
                  />
                  <text
                    x={x(v)}
                    y="265"
                    text-anchor="middle"
                    className="lab-svg-small"
                  >
                    {fmt(v)}
                  </text>
                </g>
              ))}
              <text x="64" y="24" className="lab-svg-label">
                {model.yLabel} ({model.yUnit})
              </text>
              <text
                x="275"
                y="301"
                text-anchor="middle"
                className="lab-svg-label"
              >
                {model.xLabel} ({model.xUnit})
              </text>
              {kind !== "work" && (
                <line
                  x1={x(0)}
                  y1={y(kind === "fare" ? 500 : 0)}
                  x2={x(model.max)}
                  y2={y(maxY)}
                  stroke="#27766e"
                  stroke-width="3"
                />
              )}
              {graph.map(
                (point, i) =>
                  point.ok && (
                    <circle
                      key={i}
                      cx={x(rNumber(point.x))}
                      cy={y(rNumber(point.y))}
                      r="4.5"
                      fill="#27766e"
                    />
                  ),
              )}
              {rows.map((row) => (
                <circle
                  key={formatRational(row.x)}
                  cx={x(rNumber(row.x))}
                  cy={y(rNumber(row.y))}
                  r="5"
                  fill="#fff"
                  stroke="#27766e"
                  stroke-width="2"
                />
              ))}
              {revealed && current.ok && (
                <g>
                  <line
                    x1={x(rNumber(current.x))}
                    x2={x(rNumber(current.x))}
                    y1={y(rNumber(current.y))}
                    y2="240"
                    stroke="#805e24"
                    stroke-dasharray="4 4"
                  />
                  <circle
                    cx={x(rNumber(current.x))}
                    cy={y(rNumber(current.y))}
                    r="7"
                    fill="#e9bd6f"
                    stroke="#543c16"
                    stroke-width="2"
                  />
                </g>
              )}
            </svg>
          );
        })()}
      </div>
      <p className="lab-note">
        {kind === "work"
          ? "A segítők száma diszkrét: a grafikonon is csak pozitív egész létszámhoz tartoznak megengedett pontok. A valós munka nem mindig osztható szabadon; a következtetés a fenti feltételekhez kötött."
          : kind === "fare"
            ? "Egy egyenes grafikon önmagában nem jelent egyenes arányosságot. Az 500 Ft-os tengelymetszet az alapdíj."
            : "0 m-hez 0 Ft tartozik. Az ár/hossz hányadost viszont csak nem nulla hosszúságnál számolhatjuk ki."}
      </p>
      <div className="lab-control">
        <label htmlFor={`${uid}-classification`} className="lab-label">
          Milyen kapcsolatot mutat a megadott modell?
        </label>
        <select
          id={`${uid}-classification`}
          className="lab-number"
          value={text(value, "classification")}
          onChange={(event) =>
            patch({
              classification: event.currentTarget.value,
              classificationMessage: "",
            })
          }
        >
          <option value="">Válassz, majd indokold</option>
          <option value="direct">Egyenes arányosság</option>
          <option value="inverse">Fordított arányosság</option>
          <option value="neither">Egyik sem</option>
        </select>
        <button type="button" className="lab-button" onClick={classify}>
          Kapcsolat ellenőrzése
        </button>
      </div>
      {text(value, "classificationMessage") && (
        <p className="fl-feedback" role="status">
          {text(value, "classificationMessage")}
        </p>
      )}
      <Thought
        value={value}
        onChange={onChange}
        uid={uid}
        question="Melyik mennyiség marad állandó, és a történet melyik feltétele indokolja ezt?"
        checkpoints={[
          "Legalább három adatpárt hasonlíts össze, de a szabályhoz a történet feltételeit is használd.",
          "Egyenes arányosságnál a megfelelő hányados, fordítottnál a szorzat állandó.",
          "Az alapdíjas ellenpéldában az egyenes grafikon ellenére változik a teljes díj és az út hányadosa.",
        ]}
      />
    </>
  );
}

const UNIT_EXAMPLES = [
  { label: "2,5 m → cm", amount: "2,5", from: "m", to: "cm" },
  { label: "1 dm² → cm²", amount: "1", from: "dm2", to: "cm2" },
  { label: "0,4 m² → cm²", amount: "0,4", from: "m2", to: "cm2" },
  { label: "1 dm³ → L", amount: "1", from: "dm3", to: "l" },
  { label: "750 cm³ → L", amount: "750", from: "cm3", to: "l" },
  { label: "1,25 óra → perc", amount: "1,25", from: "h", to: "min" },
  { label: "2,4 kg → g", amount: "2,4", from: "kg", to: "g" },
  { label: "72 km/h → m/s", amount: "72", from: "kmh", to: "mps" },
] as const;
const DEFAULT_UNIT_TARGET: Record<string, string> = {
  mm: "cm",
  cm: "m",
  dm: "cm",
  m: "cm",
  km: "m",
  mm2: "cm2",
  cm2: "m2",
  dm2: "cm2",
  m2: "cm2",
  mm3: "cm3",
  cm3: "l",
  dm3: "l",
  m3: "l",
  ml: "l",
  cl: "ml",
  dl: "ml",
  l: "cm3",
  mg: "g",
  g: "kg",
  kg: "g",
  t: "kg",
  s: "min",
  min: "h",
  h: "min",
  day: "h",
  mps: "kmh",
  kmh: "mps",
};

function UnitBuilderGraphic({
  dimension,
  scale,
  divided,
  layer,
  displayUnit,
  uid,
}: {
  dimension: 1 | 2 | 3;
  scale: 1 | 2;
  divided: boolean;
  layer: number;
  displayUnit: string;
  uid: string;
}) {
  const model = unitBuilderModel(dimension, scale);
  const baseUnit = dimension === 1 ? "dm" : dimension === 2 ? "dm2" : "dm3";
  const converted = convertModelUnit(
    String(model.measureDm),
    baseUnit,
    displayUnit,
  );
  const label = converted.ok
    ? `${exactHungarian(converted.result)} ${converted.to.label}`
    : `${model.measureDm} ${baseUnit}`;
  const x = 48;
  const y = 306;
  const size = 110 * scale;
  const depth = 30 * scale;
  const indices = Array.from({ length: model.edge + 1 }, (_, i) => i);
  return (
    <>
      <ScrollHint />
      <div
        className="lab-plot-scroll fl-plot"
        role="region"
        tabIndex={0}
        aria-label="Egységépítő ábra, a tárgy egységváltáskor változatlan méretű marad"
      >
        <svg
          className="lab-svg fl-builder-svg"
          data-testid="unit-object"
          viewBox="0 0 500 360"
          role="img"
          aria-labelledby={`${uid}-builder-title ${uid}-builder-desc`}
        >
          <title id={`${uid}-builder-title`}>
            {dimension === 1
              ? "Szakasz"
              : dimension === 2
                ? "Négyzet"
                : "Kocka"}
            : {label}
          </title>
          <desc id={`${uid}-builder-desc`}>
            Egy él {scale} dm, azaz {model.edge} cm.{" "}
            {divided
              ? dimension === 1
                ? `${model.edge} darab centiméteres szakasz.`
                : dimension === 2
                  ? `${model.edge} sor, soronként ${model.edge} egységnégyzet: összesen ${model.smallUnits} négyzetcentiméter.`
                  : `${model.layers} réteg, rétegenként ${model.perLayer} kiskocka: összesen ${model.smallUnits} köbcentiméter. A kijelölt réteg ${layer}.`
              : "Az egységekre bontást a gombbal mutathatod meg, miután megjósoltad a kisebb egységek számát."}{" "}
            A mértékegység felirata nem változtatja meg a tárgy méretét.
          </desc>
          {dimension === 1 ? (
            <g>
              <rect
                data-testid="unit-physical-object"
                x={x}
                y="145"
                width={200 * scale}
                height="42"
                rx="2"
                fill="#d8e9c7"
                stroke="#27695f"
                stroke-width="2"
              />
              {divided &&
                Array.from({ length: model.edge }, (_, i) => (
                  <rect
                    key={i}
                    x={x + i * 20}
                    y="145"
                    width="20"
                    height="42"
                    fill={i % 2 ? "#e9bd6f" : "#d8e9c7"}
                    stroke="#476050"
                  />
                ))}
              <text x={x} y="128" className="lab-svg-label">
                Ugyanaz a szakasz: {label}
              </text>
              <text x={x} y="215" className="lab-svg-label">
                Hossz: {scale} dm = {model.edge} cm
              </text>
              {divided && (
                <text x={x} y="246" className="lab-svg-small">
                  {model.edge} darab, egyenként 1 cm-es szakasz
                </text>
              )}
            </g>
          ) : (
            <g>
              {dimension === 3 && (
                <g>
                  <polygon
                    points={`${x},${y - size} ${x + depth},${y - size - depth} ${x + size + depth},${y - size - depth} ${x + size},${y - size}`}
                    fill="#c4ddb9"
                    stroke="#27695f"
                    stroke-width="2"
                  />
                  <polygon
                    points={`${x + size},${y - size} ${x + size + depth},${y - size - depth} ${x + size + depth},${y - depth} ${x + size},${y}`}
                    fill="#a2c5b8"
                    stroke="#27695f"
                    stroke-width="2"
                  />
                </g>
              )}
              <rect
                data-testid="unit-physical-object"
                x={x}
                y={y - size}
                width={size}
                height={size}
                fill="#e1efd6"
                stroke="#27695f"
                stroke-width="2"
              />
              {divided && (
                <g>
                  {indices.map((i) => (
                    <g key={i}>
                      <line
                        x1={x + (i * size) / model.edge}
                        x2={x + (i * size) / model.edge}
                        y1={y - size}
                        y2={y}
                        stroke="#698775"
                        stroke-width="0.7"
                      />
                      <line
                        x1={x}
                        x2={x + size}
                        y1={y - (i * size) / model.edge}
                        y2={y - (i * size) / model.edge}
                        stroke="#698775"
                        stroke-width="0.7"
                      />
                      {dimension === 3 && (
                        <g>
                          <line
                            x1={x + (i * size) / model.edge}
                            x2={x + depth + (i * size) / model.edge}
                            y1={y - size}
                            y2={y - size - depth}
                            stroke="#698775"
                            stroke-width="0.7"
                          />
                          <line
                            x1={x + (i * depth) / model.edge}
                            x2={x + size + (i * depth) / model.edge}
                            y1={y - size - (i * depth) / model.edge}
                            y2={y - size - (i * depth) / model.edge}
                            stroke="#698775"
                            stroke-width="0.7"
                          />
                        </g>
                      )}
                    </g>
                  ))}
                </g>
              )}
              {dimension === 3 && divided && (
                <g>
                  <rect
                    x={x}
                    y={y - (layer * size) / model.edge}
                    width={size}
                    height={size / model.edge}
                    fill="#e9bd6f"
                    stroke="#7e581a"
                    stroke-width="1.5"
                  />
                  <polygon
                    points={`${x},${y - (layer * size) / model.edge} ${x + depth},${y - (layer * size) / model.edge - depth} ${x + depth + size},${y - (layer * size) / model.edge - depth} ${x + size},${y - (layer * size) / model.edge}`}
                    fill="#e9bd6f"
                    fill-opacity="0.3"
                    stroke="#7e581a"
                    stroke-width="1.5"
                    stroke-dasharray="5 3"
                  />
                </g>
              )}
              <text x={x} y="334" className="lab-svg-label">
                Él: {scale} dm = {model.edge} cm
              </text>
              <text
                x="380"
                y="70"
                text-anchor="middle"
                className="lab-svg-label"
              >
                {label}
              </text>
              {dimension === 3 && divided && (
                <text
                  x="380"
                  y="101"
                  text-anchor="middle"
                  className="lab-svg-small"
                >
                  {layer}. réteg / {model.layers}
                </text>
              )}
            </g>
          )}
        </svg>
      </div>
    </>
  );
}

function UnitsLab({ value, onChange, uid }: Props) {
  const dimension = int(value, "dimension", 2, 1, 3) as 1 | 2 | 3;
  const scale = value.scale === 2 ? 2 : 1;
  const builder = unitBuilderModel(dimension, scale);
  const layer = int(value, "layer", 1, 1, builder.layers);
  const divided = value.divided === true;
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const baseUnit = dimension === 1 ? "dm" : dimension === 2 ? "dm2" : "dm3";
  const smallUnit = dimension === 1 ? "cm" : dimension === 2 ? "cm2" : "cm3";
  const displayChoices = [
    baseUnit,
    smallUnit,
    ...(dimension === 3 ? ["l"] : []),
  ];
  const displayUnit = displayChoices.includes(
    text(value, "displayUnit", baseUnit),
  )
    ? text(value, "displayUnit", baseUnit)
    : baseUnit;
  const from = text(value, "from", "m2");
  const to = text(value, "to", "cm2");
  const amount = text(value, "amount", "0,4");
  const conversion = convertModelUnit(amount, from, to);
  const fromUnit = MODEL_UNITS.find((unit) => unit.id === from);
  const dimensions = Object.keys(UNIT_DIMENSION_LABELS) as UnitDimension[];
  const reveal = () => {
    const estimate = parseRational(text(value, "estimate"));
    patch({
      divided: !divided,
      builderMessage: divided
        ? "Az egységvonalakat elrejtetted; a tárgy mérete nem változott."
        : estimate
          ? rEqual(estimate, rational(BigInt(builder.smallUnits)))
            ? "A jóslat helyes. Kövesd az egy, két vagy három irányban ismétlődő felosztást."
            : "A jóslat eltér. Számold meg az egységeket egy sorban, majd a sorokat, térfogatnál a rétegeket is."
          : "A felosztás látható. A következő nézetnél előbb jósolj, majd hasonlítsd össze az egységek számát.",
    });
  };
  const challenge = text(value, "challenge");
  const challengeResult =
    challenge === "area"
      ? convertModelUnit("1", "m2", "m")
      : challenge === "material"
        ? convertModelUnit("1", "l", "kg")
        : null;
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Egységépítő</span>
        <h3>Ugyanaz a mennyiség, más mérőszám</h3>
        <p>
          Rakd össze az egységet kisebb egységekből. Az egységváltáskor a tárgy
          változatlan; a külön nagyítási gomb viszont a tárgy méretét
          változtatja meg.
        </p>
      </header>
      <div className="lab-controls">
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-dimension`}>
            Hány irányban mérünk?
          </label>
          <select
            id={`${uid}-dimension`}
            data-testid="unit-dimension"
            className="lab-number"
            value={dimension}
            onChange={(event) => {
              const next = Number(event.currentTarget.value);
              patch({
                dimension: next,
                layer: 1,
                divided: false,
                estimate: "",
                builderMessage: "",
                displayUnit: next === 1 ? "dm" : next === 2 ? "dm2" : "dm3",
              });
            }}
          >
            <option value="1">Hossz — szakasz</option>
            <option value="2">Terület — négyzet</option>
            <option value="3">Térfogat — kocka</option>
          </select>
        </div>
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-display-unit`}>
            Ugyanennek a tárgynak a mértékegysége
          </label>
          <select
            id={`${uid}-display-unit`}
            data-testid="unit-display"
            className="lab-number"
            value={displayUnit}
            onChange={(event) =>
              patch({ displayUnit: event.currentTarget.value })
            }
          >
            {displayChoices.map((id) => (
              <option key={id} value={id}>
                {MODEL_UNITS.find((unit) => unit.id === id)!.label}
              </option>
            ))}
          </select>
          <span className="lab-bounds">
            A felirat megváltozik; az ábrázolt tárgy mérete nem.
          </span>
        </div>
      </div>
      <DecimalField
        id={`${uid}-estimate`}
        label={`Jóslat: hány ${dimension === 1 ? "1 cm-es szakasz" : dimension === 2 ? "1 cm²-es négyzet" : "1 cm³-es kiskocka"} alkotja?`}
        raw={text(value, "estimate")}
        onChange={(next) => patch({ estimate: next })}
      />
      <div className="lab-actions">
        <button
          type="button"
          className="lab-button lab-button-primary"
          data-testid="unit-divide"
          aria-pressed={divided}
          onClick={reveal}
        >
          {divided ? "Felosztás elrejtése" : "Mutasd a kisebb egységeket"}
        </button>
        <button
          type="button"
          className="lab-button"
          data-testid="unit-enlarge"
          aria-pressed={scale === 2}
          onClick={() =>
            patch({
              scale: scale === 2 ? 1 : 2,
              layer: 1,
              builderMessage:
                "A tárgy mérete most megváltozott. Ez nagyítás vagy visszakicsinyítés, nem egységváltás.",
            })
          }
        >
          {scale === 2
            ? "Eredeti élméret visszaállítása"
            : "Nagyítsd a tárgy minden élét kétszeresére"}
        </button>
      </div>
      {text(value, "builderMessage") && (
        <p className="fl-feedback" role="status">
          {text(value, "builderMessage")}
        </p>
      )}
      <UnitBuilderGraphic
        dimension={dimension}
        scale={scale}
        divided={divided}
        layer={layer}
        displayUnit={displayUnit}
        uid={uid}
      />
      {dimension === 3 && divided && (
        <div className="lab-control">
          <label className="lab-label" htmlFor={`${uid}-layer`}>
            Kijelölt vízszintes réteg: {layer}. / {builder.layers}
          </label>
          <input
            id={`${uid}-layer`}
            data-testid="unit-layer"
            type="range"
            min="1"
            max={builder.layers}
            step="1"
            value={layer}
            onInput={(event) =>
              patch({ layer: Number(event.currentTarget.value) })
            }
          />
          <div className="fl-stepper">
            <button
              type="button"
              className="lab-button"
              disabled={layer === 1}
              onClick={() => patch({ layer: layer - 1 })}
            >
              Előző réteg
            </button>
            <button
              type="button"
              className="lab-button"
              disabled={layer === builder.layers}
              onClick={() => patch({ layer: layer + 1 })}
            >
              Következő réteg
            </button>
          </div>
          <p>
            Alulról a(z) {layer}. réteget jelöltük. Egy teljes réteg{" "}
            {builder.edge} sor × {builder.edge} oszlop ={" "}
            <strong>{builder.perLayer} kiskocka</strong>; eddig {layer} ×{" "}
            {builder.perLayer} = {layer * builder.perLayer} cm³.
          </p>
        </div>
      )}
      {divided && (
        <div className="lab-summary" data-testid="unit-builder-result">
          <p className="lab-equation">
            {builder.measureDm}{" "}
            {MODEL_UNITS.find((unit) => unit.id === baseUnit)!.label} ={" "}
            {builder.smallUnits}{" "}
            {MODEL_UNITS.find((unit) => unit.id === smallUnit)!.label}
            {dimension === 3 ? ` = ${builder.measureDm} L` : ""}
          </p>
          <p>
            {dimension === 1
              ? `${builder.edge} egymás után elhelyezett szakasz.`
              : dimension === 2
                ? `${builder.edge} sor × ${builder.edge} oszlop = ${builder.smallUnits} egységnégyzet.`
                : `${builder.edge} sor × ${builder.edge} oszlop × ${builder.layers} réteg = ${builder.smallUnits} egységkocka.`}
          </p>
          <p>
            {scale === 1
              ? "Az eredeti tárgy egy éle 1 dm = 10 cm. A 10-es hosszváltó kétszer vagy háromszor szerepel, ha területet vagy térfogatot mérünk."
              : `Az élméret kétszeresére nagyítása ${dimension === 1 ? "kétszeres hosszúságot" : dimension === 2 ? "négyszeres területet" : "nyolcszoros térfogatot"} eredményez. Az egység megválasztása ehhez képest csak a mérőszámot módosítja.`}
          </p>
        </div>
      )}
      {dimension === 3 && divided && <ScrollHint table />}
      {dimension === 3 && divided && (
        <div
          className="lab-table-scroll"
          role="region"
          tabIndex={0}
          aria-label="A kocka rétegeinek szöveges táblázata"
        >
          <table className="lab-table">
            <caption>Rétegek adatai</caption>
            <thead>
              <tr>
                <th scope="col">Mit számolunk?</th>
                <th scope="col">Darabszám</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Egy sorban</th>
                <td>{builder.edge} egységkocka</td>
              </tr>
              <tr>
                <th scope="row">Egy teljes rétegben</th>
                <td>
                  {builder.edge} × {builder.edge} = {builder.perLayer}
                </td>
              </tr>
              <tr>
                <th scope="row">Rétegek száma</th>
                <td>{builder.layers}</td>
              </tr>
              <tr>
                <th scope="row">Teljes térfogat</th>
                <td>
                  {builder.layers} × {builder.perLayer} = {builder.smallUnits}{" "}
                  cm³
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
      <section
        className="fl-converter"
        aria-labelledby={`${uid}-convert-title`}
      >
        <h4 id={`${uid}-convert-title`}>Átváltás ugyanannál a mennyiségnél</h4>
        <p>
          A pontos számítás mellett a váltószámot és a mennyiség fajtáját is
          vizsgáld meg.
        </p>
        <div className="lab-actions fl-examples">
          {UNIT_EXAMPLES.map((example) => (
            <button
              type="button"
              className="lab-button"
              key={example.label}
              onClick={() =>
                patch({
                  amount: example.amount,
                  from: example.from,
                  to: example.to,
                })
              }
            >
              {example.label}
            </button>
          ))}
        </div>
        <div className="lab-controls">
          <DecimalField
            id={`${uid}-amount`}
            testId="unit-amount"
            label="Kiinduló mérőszám"
            raw={amount}
            onChange={(next) => patch({ amount: next })}
            hint="Például 2,5 vagy 3/4. A számítást nem kerekítjük."
          />
          <div className="lab-control">
            <label className="lab-label" htmlFor={`${uid}-from`}>
              Kiinduló mértékegység
            </label>
            <select
              id={`${uid}-from`}
              data-testid="unit-from"
              className="lab-number"
              value={from}
              onChange={(event) =>
                patch({
                  from: event.currentTarget.value,
                  to:
                    DEFAULT_UNIT_TARGET[event.currentTarget.value] ??
                    event.currentTarget.value,
                })
              }
            >
              {dimensions.map((dimension) => (
                <optgroup
                  key={dimension}
                  label={UNIT_DIMENSION_LABELS[dimension]}
                >
                  {MODEL_UNITS.filter(
                    (unit) => unit.dimension === dimension,
                  ).map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="lab-control">
            <label className="lab-label" htmlFor={`${uid}-to`}>
              Kért mértékegység
            </label>
            <select
              id={`${uid}-to`}
              data-testid="unit-to"
              className="lab-number"
              value={to}
              onChange={(event) => patch({ to: event.currentTarget.value })}
            >
              {MODEL_UNITS.filter(
                (unit) => unit.dimension === fromUnit?.dimension,
              ).map((unit) => (
                <option key={unit.id} value={unit.id}>
                  {unit.label}
                </option>
              ))}
            </select>
            <span className="lab-bounds">
              Azonos fajtájú mennyiség egységei közül választhatsz.
            </span>
          </div>
        </div>
        <div
          className={conversion.ok ? "lab-summary" : "fl-feedback"}
          role="status"
          data-testid="unit-result"
        >
          {conversion.ok ? (
            <>
              <p className="lab-equation">
                <strong>
                  {exactHungarian(conversion.amount)} {conversion.from.label} ={" "}
                  {exactHungarian(conversion.result)} {conversion.to.label}
                </strong>
              </p>
              <p>
                1 {conversion.from.label} ={" "}
                {fractionAndDecimal(conversion.factor)} {conversion.to.label};
                ezért a mérőszámot {exactHungarian(conversion.factor)} értékkel
                szorozzuk. Ugyanazt a mennyiséget írjuk le.
              </p>
              {conversion.from.dimension === "length" && (
                <p>
                  Kisebb hosszegységből több fér ugyanarra a szakaszra. A
                  szakaszt az egységváltás nem nyújtja meg.
                </p>
              )}
              {conversion.from.dimension === "area" && (
                <p>
                  Két irányban váltunk: például 1 m² = (100 cm) × (100 cm) = 10
                  000 cm². A hosszváltó négyzete a területváltó.
                </p>
              )}
              {conversion.from.dimension === "volume" && (
                <p>
                  Három irányban váltunk: 1 dm³ = 10 × 10 × 10 cm³ = 1000 cm³.
                  Az űrtartalom kapcsolata: 1 L = 1 dm³; 1 mL = 1 cm³.
                </p>
              )}
              {conversion.from.dimension === "mass" && (
                <p>
                  Itt tömeget mérünk: 1 t = 1000 kg, 1 kg = 1000 g, 1 g = 1000
                  mg. A tömegből térfogat csak anyagadat alapján számítható.
                </p>
              )}
              {conversion.from.dimension === "time" && (
                <p>
                  Az idő váltószáma itt nem tíz: 1 óra = 60 perc, 1 perc = 60
                  másodperc. Az 1,25 óra tizedesrésze 0,25 × 60 = 15 perc; az
                  egész 75 perc.
                </p>
              )}
              {conversion.from.dimension === "speed" && (
                <p>
                  A számláló és a nevező egysége is változik: 1 km/h = 1000 m /
                  3600 s = 5/18 m/s. Ezért km/h-ról m/s-ra 3,6-del osztunk,
                  visszafelé 3,6-del szorzunk.
                </p>
              )}
            </>
          ) : (
            conversion.message
          )}
        </div>
        <div className="lab-extension">
          <h4>Mikor hiányzik még egy adat?</h4>
          <div className="lab-actions">
            <button
              className="lab-button"
              type="button"
              onClick={() => patch({ challenge: "area" })}
            >
              Miért nem váltunk 1 m²-t méterre?
            </button>
            <button
              className="lab-button"
              type="button"
              onClick={() => patch({ challenge: "material" })}
            >
              Miért nem váltunk 1 L-t kilogrammra?
            </button>
          </div>
          {challengeResult && !challengeResult.ok && (
            <p role="status">{challengeResult.message}</p>
          )}
        </div>
      </section>
      <Thought
        value={value}
        onChange={onChange}
        uid={uid}
        question="Miért 100 a dm² és cm² közti váltószám, de 1000 a dm³ és cm³ közti? Mi változik az egységváltáskor, és mi a tárgy nagyításakor?"
        checkpoints={[
          "A területnél két, a térfogatnál három egymásra merőleges irányban számoljuk a kisebb egységeket.",
          "Egységváltáskor ugyanaz a tárgy marad; a mérőszám és az egység együtt változik.",
          "Az élméretek kétszerezése a területet négyszerezi, a térfogatot nyolcszorozza.",
          "Az idő és a sebesség külön egységkapcsolatokat kíván; a literből pedig nem következik tömeg anyagadat nélkül.",
        ]}
      />
    </>
  );
}

/** Inner lab body; the shared Lab component supplies the enclosing .lab-root. */
export function FoundationLab({ topic, value, onChange }: LabProps) {
  const uid = `foundation-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const props: Props = { value, onChange, uid };
  return (
    <div className="foundation-lab">
      {topic === "szamfogalom" && <NumberLineLab {...props} />}
      {topic === "muveleti-sorrend" && <OrderLab {...props} />}
      {topic === "aranyossag" && <ProportionLab {...props} />}
      {topic === "mertekegysegek" && <UnitsLab {...props} />}
    </div>
  );
}

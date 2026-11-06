import { useId } from "preact/hooks";
import type { LabProps, LabState, TopicId } from "../types";
import "./labs.css";
import { FoundationLab, foundationInitialLabState } from "./FoundationLabs.tsx";

const START_SEED = 20261106;
const COLORS = ["#27766e", "#c8ec78", "#edc686", "#acc9df"];
const hu = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 2 });
const huPrecise = new Intl.NumberFormat("hu-HU", { maximumFractionDigits: 3 });
const fmt = (n: number) => hu.format(n);
const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
const gcd = (a: number, b: number): number =>
  b === 0 ? Math.abs(a) : gcd(b, a % b);
const lcm = (a: number, b: number) => (a / gcd(a, b)) * b;

function numberState(
  value: LabState,
  key: string,
  fallback: number,
  min: number,
  max: number,
): number {
  const n = value[key];
  return typeof n === "number" && Number.isFinite(n)
    ? clamp(Math.round(n), min, max)
    : fallback;
}

function fraction(n: number, d: number): string {
  const divisor = gcd(n, d);
  const numerator = n / divisor;
  const denominator = d / divisor;
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
}

export function initialLabState(topic: TopicId): LabState {
  switch (topic) {
    case "szamfogalom":
    case "muveleti-sorrend":
    case "aranyossag":
    case "mertekegysegek":
      return foundationInitialLabState(topic);
    case "tortek":
      return { n1: 1, d1: 2, n2: 1, d2: 3, common: false };
    case "szazalek":
      return {
        price: 10000,
        first: 20,
        second: 20,
        firstDirection: "down",
        secondDirection: "up",
      };
    case "egyenlet":
      return { path: "divide", step: 0, checked: false, zeroShown: false };
    case "grafikon":
      return { base: 500, rate: 200, distance: 4, formulaShown: false };
    case "pitagorasz":
      return { a: 3, b: 4, proofStep: 0, turn: 0, piece: 0 };
    case "valoszinuseg":
      return {
        eventSum: 7,
        seed: START_SEED,
        counts: Array<number>(11).fill(0),
        lastPair: [],
        lastBatch: 0,
      };
  }
}

interface TopicLabProps {
  value: LabState;
  onChange: (next: LabState) => void;
  uid: string;
}

interface NumberControlProps {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  onChange: (value: number) => void;
}

function NumberControl({
  id,
  label,
  value,
  min,
  max,
  unit = "",
  onChange,
}: NumberControlProps) {
  const change = (raw: string) => {
    if (raw.trim() === "") return;
    const n = Number(raw.replace(",", "."));
    if (Number.isFinite(n)) onChange(clamp(Math.round(n), min, max));
  };
  return (
    <div className="lab-control">
      <label className="lab-label" id={`${id}-label`} htmlFor={`${id}-number`}>
        {label}
        {unit && <span className="lab-unit"> · {unit}</span>}
      </label>
      <div className="lab-control-inputs">
        <input
          type="range"
          min={min}
          max={max}
          step="1"
          value={value}
          aria-labelledby={`${id}-label`}
          aria-valuetext={`${fmt(value)} ${unit}`.trim()}
          onInput={(event) => change(event.currentTarget.value)}
        />
        <input
          id={`${id}-number`}
          className="lab-number"
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step="1"
          value={value}
          aria-describedby={`${id}-bounds`}
          onInput={(event) => change(event.currentTarget.value)}
          onBlur={(event) => {
            if (
              event.currentTarget.value.trim() === "" ||
              !Number.isFinite(Number(event.currentTarget.value))
            ) {
              event.currentTarget.value = String(value);
            } else change(event.currentTarget.value);
          }}
        />
      </div>
      <span className="lab-bounds" id={`${id}-bounds`}>
        {fmt(min)}–{fmt(max)}
        {unit ? ` ${unit}` : ""}; egész értékek
      </span>
    </div>
  );
}

function Reflection({ questions }: { questions: string[] }) {
  return (
    <aside className="lab-reflection">
      <h4>Állj meg egy gondolatra</h4>
      <ol>
        {questions.map((question) => (
          <li key={question}>{question}</li>
        ))}
      </ol>
      <p>
        Mondd el a saját szavaiddal. A műhely kipróbálása még nem önálló
        tudáspróba.
      </p>
    </aside>
  );
}

function FractionsLab({ value, onChange, uid }: TopicLabProps) {
  const d1 = numberState(value, "d1", 2, 2, 12);
  const d2 = numberState(value, "d2", 3, 2, 12);
  const n1 = numberState(value, "n1", 1, 0, d1);
  const n2 = numberState(value, "n2", 1, 0, d2);
  const common = value.common === true;
  const denominator = lcm(d1, d2);
  const firstParts = (n1 * denominator) / d1;
  const secondParts = (n2 * denominator) / d2;
  const totalParts = firstParts + secondParts;
  const whole = Math.floor(totalParts / denominator);
  const remaining = totalParts % denominator;
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const left = 40;
  const width = 210;
  const barHeight = 34;
  const ticks = (count: number, y: number, units = 1) =>
    Array.from({ length: count * units + 1 }, (_, i) => (
      <line
        key={i}
        x1={left + (width * i) / count}
        y1={y}
        x2={left + (width * i) / count}
        y2={y + barHeight}
        stroke="#172b32"
        stroke-width={i % count === 0 ? 2 : 0.65}
        opacity={i % count === 0 ? 0.8 : 0.45}
      />
    ));

  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Törtlabor</span>
        <h3>Két tört, ugyanakkora egész</h3>
        <p>
          Először jósolj: az összeg kisebb vagy nagyobb lesz egynél? Mindkét
          felső sáv pontosan ugyanakkora egészt jelent.
        </p>
      </header>
      <div className="lab-controls">
        <NumberControl
          id={`${uid}-n1`}
          label="Első tört számlálója"
          value={n1}
          min={0}
          max={d1}
          onChange={(n) => patch({ n1: n })}
        />
        <NumberControl
          id={`${uid}-d1`}
          label="Első tört nevezője"
          value={d1}
          min={2}
          max={12}
          onChange={(d) => patch({ d1: d, n1: Math.min(n1, d) })}
        />
        <NumberControl
          id={`${uid}-n2`}
          label="Második tört számlálója"
          value={n2}
          min={0}
          max={d2}
          onChange={(n) => patch({ n2: n })}
        />
        <NumberControl
          id={`${uid}-d2`}
          label="Második tört nevezője"
          value={d2}
          min={2}
          max={12}
          onChange={(d) => patch({ d2: d, n2: Math.min(n2, d) })}
        />
      </div>
      <div className="lab-actions">
        <button
          type="button"
          className="lab-button lab-button-primary"
          aria-pressed={common}
          onClick={() => patch({ common: !common })}
        >
          {common ? "Eredeti felosztások" : "Mutasd ugyanakkora részekben"}
        </button>
        <button
          type="button"
          className="lab-button"
          onClick={() => onChange(initialLabState("tortek"))}
        >
          Újrakezdés
        </button>
      </div>
      <div
        className="lab-plot-scroll"
        role="region"
        aria-label="Törtsávok; szükség esetén vízszintesen görgethető ábra"
        tabIndex={0}
      >
        <svg
          className="lab-svg lab-svg-wide"
          viewBox="0 0 500 262"
          role="img"
          aria-labelledby={`${uid}-fractions-title ${uid}-fractions-desc`}
        >
          <title id={`${uid}-fractions-title`}>
            {n1}/{d1} és {n2}/{d2} összeadása azonos egészekkel
          </title>
          <desc id={`${uid}-fractions-desc`}>
            A két felső, egyforma hosszú sáv egy-egy egész. Az alsó sáv két
            ugyanekkora egészt mutat. A színezett összeg{" "}
            {fraction(totalParts, denominator)}.{" "}
            {common
              ? `Minden egész ${denominator} egyenlő részre osztott.`
              : "A felső sávok az eredeti nevezők szerinti részeket mutatják."}
          </desc>
          <defs>
            <pattern
              id={`${uid}-hatch`}
              patternUnits="userSpaceOnUse"
              width="8"
              height="8"
            >
              <rect width="8" height="8" fill="#edc686" />
              <path
                d="M-2 2L2-2 M0 8L8 0 M6 10L10 6"
                stroke="#815f2f"
                stroke-width="0.9"
                opacity="0.55"
              />
            </pattern>
          </defs>
          <text x={left} y="22" className="lab-svg-label">
            Első: {n1}/{d1}
            {common ? ` = ${firstParts}/${denominator}` : ""}
          </text>
          <rect
            x={left}
            y="34"
            width={width}
            height={barHeight}
            rx="2"
            fill="#fff"
            stroke="#172b32"
          />
          <rect
            x={left}
            y="34"
            width={(width * n1) / d1}
            height={barHeight}
            fill="#27766e"
          />
          {ticks(common ? denominator : d1, 34)}
          <text x={left + width + 12} y="56" className="lab-svg-small">
            1 egész
          </text>
          <text x={left} y="101" className="lab-svg-label">
            Második: {n2}/{d2}
            {common ? ` = ${secondParts}/${denominator}` : ""}
          </text>
          <rect
            x={left}
            y="113"
            width={width}
            height={barHeight}
            rx="2"
            fill="#fff"
            stroke="#172b32"
          />
          <rect
            x={left}
            y="113"
            width={(width * n2) / d2}
            height={barHeight}
            fill={`url(#${uid}-hatch)`}
          />
          {ticks(common ? denominator : d2, 113)}
          <text x={left + width + 12} y="135" className="lab-svg-small">
            1 egész
          </text>
          <text x={left} y="180" className="lab-svg-label">
            Összeg: a két mennyiséget egymás mellé tesszük
          </text>
          <rect
            x={left}
            y="194"
            width={2 * width}
            height={barHeight}
            fill="#fff"
            stroke="#172b32"
          />
          <rect
            x={left}
            y="194"
            width={(width * n1) / d1}
            height={barHeight}
            fill="#27766e"
          />
          <rect
            x={left + (width * n1) / d1}
            y="194"
            width={(width * n2) / d2}
            height={barHeight}
            fill={`url(#${uid}-hatch)`}
          />
          {common ? (
            ticks(denominator, 194, 2)
          ) : (
            <line
              x1={left + width}
              x2={left + width}
              y1="194"
              y2="228"
              stroke="#172b32"
              stroke-width="2"
            />
          )}
          {[0, 1, 2].map((n) => (
            <text
              key={n}
              x={left + n * width}
              y="250"
              text-anchor="middle"
              className="lab-svg-small"
            >
              {n}
            </text>
          ))}
        </svg>
      </div>
      <p className="lab-plot-caption">
        Az egység hossza minden sorban változatlan.
      </p>
      <div className="lab-summary">
        <p className="lab-equation">
          {n1}/{d1} + {n2}/{d2} = {firstParts}/{denominator} + {secondParts}/
          {denominator} = <strong>{fraction(totalParts, denominator)}</strong>
        </p>
        <p>
          {totalParts > denominator
            ? `Az összeg ${whole} egész${remaining ? ` és még ${fraction(remaining, denominator)}` : ""}.`
            : totalParts === denominator
              ? "A két rész együtt pontosan egy egész."
              : "A két rész együtt kevesebb mint egy egész."}
        </p>
      </div>
      <div
        className="lab-table-scroll"
        tabIndex={0}
        role="region"
        aria-label="A törtek közös egysége táblázatban"
      >
        <table className="lab-table">
          <caption>Ugyanakkora darabokat számolunk</caption>
          <thead>
            <tr>
              <th scope="col">Mennyiség</th>
              <th scope="col">Eredeti alak</th>
              <th scope="col">Közös egység</th>
              <th scope="col">Darabszám</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Első tört</th>
              <td>
                {n1}/{d1}
              </td>
              <td>1/{denominator}</td>
              <td>{firstParts}</td>
            </tr>
            <tr>
              <th scope="row">Második tört</th>
              <td>
                {n2}/{d2}
              </td>
              <td>1/{denominator}</td>
              <td>{secondParts}</td>
            </tr>
            <tr>
              <th scope="row">Összeg</th>
              <td>{fraction(totalParts, denominator)}</td>
              <td>1/{denominator}</td>
              <td>{totalParts}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="lab-note">
        A közös nevező itt a két nevező legkisebb közös többszöröse:{" "}
        {denominator}. A felosztást finomítjuk, a beszínezett mennyiséget nem
        változtatjuk meg.
      </p>
      <Reflection
        questions={[
          "Miért nem a nevezőket adjuk össze? Mutasd meg a sávokon, mit jelent egy darab.",
          "Keress két olyan törtet, amelyek összege nagyobb egynél. Hol kezdődik a második egész?",
        ]}
      />
    </>
  );
}

function PercentageLab({ value, onChange, uid }: TopicLabProps) {
  const price = numberState(value, "price", 10000, 0, 200000);
  const first = numberState(value, "first", 20, 0, 50);
  const second = numberState(value, "second", 20, 0, 50);
  const firstDirection = value.firstDirection === "up" ? "up" : "down";
  const secondDirection = value.secondDirection === "down" ? "down" : "up";
  const factor1 = 100 + (firstDirection === "up" ? first : -first);
  const factor2 = 100 + (secondDirection === "up" ? second : -second);
  const afterFirst = (price * factor1) / 100;
  const finalPrice = (price * factor1 * factor2) / 10000;
  const totalChange = (factor1 * factor2 - 10000) / 100;
  const difference = finalPrice - price;
  const maxPrice = Math.max(price, afterFirst, finalPrice, 1);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const directionField = (which: "first" | "second", direction: string) => (
    <div className="lab-control">
      <label className="lab-label" htmlFor={`${uid}-${which}-direction`}>
        {which === "first" ? "Első" : "Második"} változás iránya
      </label>
      <select
        id={`${uid}-${which}-direction`}
        value={direction}
        onChange={(event) =>
          patch({ [`${which}Direction`]: event.currentTarget.value })
        }
      >
        <option value="down">Csökkentés (−)</option>
        <option value="up">Növelés (+)</option>
      </select>
    </div>
  );
  const stages = [
    { label: "Kezdet", amount: price, color: "#acc9df" },
    { label: "1. lépés után", amount: afterFirst, color: "#27766e" },
    { label: "2. lépés után", amount: finalPrice, color: "#c8ec78" },
  ];
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Százalékműhely</span>
        <h3>Minek a százaléka?</h3>
        <p>
          Jósolj a számolás előtt: ha csökkentünk, majd ugyanannyi százalékkal
          növelünk, visszakapjuk a kezdőárat?
        </p>
      </header>
      <NumberControl
        id={`${uid}-price`}
        label="Kezdőár"
        value={price}
        min={0}
        max={200000}
        unit="Ft"
        onChange={(n) => patch({ price: n })}
      />
      <div className="lab-controls">
        <NumberControl
          id={`${uid}-first`}
          label="Első változás"
          value={first}
          min={0}
          max={50}
          unit="%"
          onChange={(n) => patch({ first: n })}
        />
        {directionField("first", firstDirection)}
        <NumberControl
          id={`${uid}-second`}
          label="Második változás"
          value={second}
          min={0}
          max={50}
          unit="%"
          onChange={(n) => patch({ second: n })}
        />
        {directionField("second", secondDirection)}
      </div>
      <svg
        className="lab-svg"
        viewBox="0 0 500 235"
        role="img"
        aria-labelledby={`${uid}-percent-title ${uid}-percent-desc`}
      >
        <title id={`${uid}-percent-title`}>
          Kezdőár és a két változás utáni ár
        </title>
        <desc id={`${uid}-percent-desc`}>
          Azonos skálán a kezdőár {fmt(price)} forint, az első lépés után{" "}
          {fmt(afterFirst)} forint, a második után {fmt(finalPrice)} forint. A
          második változás alapja az első lépés utáni ár.
        </desc>
        {stages.map((stage, i) => (
          <g key={stage.label}>
            <text x="16" y={24 + i * 75} className="lab-svg-label">
              {stage.label}: {fmt(stage.amount)} Ft
            </text>
            <rect
              x="16"
              y={35 + i * 75}
              width="466"
              height="24"
              rx="3"
              fill="#e2e6e3"
            />
            <rect
              x="16"
              y={35 + i * 75}
              width={(466 * stage.amount) / maxPrice}
              height="24"
              rx="3"
              fill={stage.color}
              stroke={stage.amount > 0 ? "#172b32" : "none"}
              stroke-width="0.8"
            />
          </g>
        ))}
      </svg>
      <div className="lab-summary">
        <p className="lab-equation">
          Végár: <strong>{fmt(finalPrice)} Ft</strong>
        </p>
        <p>
          {difference === 0
            ? "A végár most megegyezik a kezdőárral."
            : `${fmt(Math.abs(difference))} Ft-tal ${difference > 0 ? "több" : "kevesebb"} a kezdőárnál.`}{" "}
          {price > 0
            ? `Ez összesen ${totalChange > 0 ? "+" : ""}${fmt(totalChange)}% változás.`
            : "A 0 Ft-os kezdőárhoz viszonyított százalékos változás nem számolható osztással."}
        </p>
      </div>
      <div
        className="lab-table-scroll"
        role="region"
        aria-label="A százalékszámítás lépései"
        tabIndex={0}
      >
        <table className="lab-table">
          <caption>Minden lépésnek megvan a saját alapja</caption>
          <thead>
            <tr>
              <th scope="col">Lépés</th>
              <th scope="col">Százalékalap</th>
              <th scope="col">Szorzó</th>
              <th scope="col">Új ár</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">
                1. {firstDirection === "up" ? "+" : "−"}
                {first}%
              </th>
              <td>{fmt(price)} Ft</td>
              <td>{fmt(factor1 / 100)}</td>
              <td>{fmt(afterFirst)} Ft</td>
            </tr>
            <tr>
              <th scope="row">
                2. {secondDirection === "up" ? "+" : "−"}
                {second}%
              </th>
              <td>
                <strong>{fmt(afterFirst)} Ft</strong>
              </td>
              <td>{fmt(factor2 / 100)}</td>
              <td>{fmt(finalPrice)} Ft</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="lab-note">
        A számolás köztes kerekítés nélkül történik; az árakat legfeljebb két
        tizedessel mutatjuk. Például a −20% szorzója 0,8, a +20% szorzója 1,2.
      </p>
      <div className="lab-actions">
        <button
          type="button"
          className="lab-button"
          onClick={() => onChange(initialLabState("szazalek"))}
        >
          Vissza a −20%, majd +20% példához
        </button>
      </div>
      <Reflection
        questions={[
          "A második lépésben melyik mennyiség jelenti a 100%-ot?",
          "Ha az egyik százalékot nullára állítod, mit vársz a végártól? Miért?",
        ]}
      />
    </>
  );
}

type EquationMode = "group3" | "expanded" | "group1" | "x3" | "x1";
interface EquationStage {
  left: string;
  right: number;
  mode: EquationMode;
  move: string;
  why: string;
}
const DIVIDE_STAGES: EquationStage[] = [
  {
    left: "3(x + 2)",
    right: 21,
    mode: "group3",
    move: "Kiinduló egyenlet",
    why: "Három egyforma x + 2 csoport együtt 21. Az x ugyanazt a számot jelenti mindhárom csoportban.",
  },
  {
    left: "x + 2",
    right: 7,
    mode: "group1",
    move: "Mindkét oldalt osztom 3-mal",
    why: "Mindkét oldalon a harmadát vesszük. A 3 nem nulla, ezért a lépés visszafordítható, és ugyanaz marad a megoldás.",
  },
  {
    left: "x",
    right: 5,
    mode: "x1",
    move: "Mindkét oldalból kivonok 2-t",
    why: "Mindkét oldalon ugyanannyit veszünk el. Bal oldalon x marad, jobb oldalon 7 − 2 = 5.",
  },
];
const EXPAND_STAGES: EquationStage[] = [
  DIVIDE_STAGES[0],
  {
    left: "3x + 6",
    right: 21,
    mode: "expanded",
    move: "Felbontom a zárójelet",
    why: "3(x + 2) = 3x + 6: a 3 mindkét tagot szorozza. A bal oldal értéke nem változott, csak más alakban írtuk le.",
  },
  {
    left: "3x",
    right: 15,
    mode: "x3",
    move: "Mindkét oldalból kivonok 6-ot",
    why: "Mindkét oldalon hat egységgel kevesebb lesz. A megoldás megmarad: 3x = 15.",
  },
  {
    left: "x",
    right: 5,
    mode: "x1",
    move: "Mindkét oldalt osztom 3-mal",
    why: "Három egyforma ismeretlen együtt 15; egy ismeretlen értéke 5. A nem nulla 3-mal végzett osztás visszafordítható.",
  },
];

function EquationLeft({ mode }: { mode: EquationMode }) {
  if (mode === "group3" || mode === "group1") {
    const count = mode === "group3" ? 3 : 1;
    const start = count === 3 ? 49 : 106;
    return (
      <>
        {Array.from({ length: count }, (_, i) => (
          <g key={i} transform={`translate(${start + i * 57} 108)`}>
            <rect
              width="48"
              height="49"
              rx="7"
              fill="#e6f1ed"
              stroke="#27766e"
              stroke-width="1.5"
            />
            <text
              x="24"
              y="20"
              text-anchor="middle"
              fill="#172b32"
              font-size="18"
              font-weight="700"
            >
              x
            </text>
            {[0, 1].map((j) => (
              <g key={j}>
                <rect
                  x={10 + j * 17}
                  y="29"
                  width="13"
                  height="14"
                  rx="2"
                  fill="#c8ec78"
                  stroke="#172b32"
                  stroke-width="0.6"
                />
                <text
                  x={16.5 + j * 17}
                  y="40"
                  text-anchor="middle"
                  font-size="10"
                  fill="#172b32"
                >
                  1
                </text>
              </g>
            ))}
          </g>
        ))}
      </>
    );
  }
  const count = mode === "x1" ? 1 : 3;
  const start = mode === "expanded" ? 50 : count === 1 ? 117 : 89;
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <g key={i}>
          <rect
            x={start + i * 28}
            y="129"
            width="24"
            height="25"
            rx="4"
            fill="#27766e"
          />
          <text
            x={start + i * 28 + 12}
            y="148"
            text-anchor="middle"
            font-size="17"
            fill="white"
            font-weight="700"
          >
            x
          </text>
        </g>
      ))}
      {mode === "expanded" &&
        Array.from({ length: 6 }, (_, i) => (
          <g key={`unit-${i}`}>
            <rect
              x={149 + (i % 3) * 17}
              y={119 + Math.floor(i / 3) * 20}
              width="13"
              height="15"
              rx="2"
              fill="#c8ec78"
              stroke="#172b32"
              stroke-width="0.6"
            />
            <text
              x={155.5 + (i % 3) * 17}
              y={130 + Math.floor(i / 3) * 20}
              text-anchor="middle"
              font-size="10"
            >
              1
            </text>
          </g>
        ))}
    </>
  );
}

function EquationLab({ value, onChange, uid }: TopicLabProps) {
  const path = value.path === "expand" ? "expand" : "divide";
  const stages = path === "divide" ? DIVIDE_STAGES : EXPAND_STAGES;
  const step = numberState(value, "step", 0, 0, stages.length - 1);
  const stage = stages[step];
  const final = step === stages.length - 1;
  const checked = final && value.checked === true;
  const patch = (next: LabState) => onChange({ ...value, ...next });
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Egyenletmérleg</span>
        <h3>Mitől marad igaz az egyenlőség?</h3>
        <p>
          A mérleg az egyenlőséget jelképezi. Az x ismeretlen szám: a csoportok
          mérete a rajzon nem a szám értékét méri.
        </p>
      </header>
      <div className="lab-control">
        <label className="lab-label" htmlFor={`${uid}-path`}>
          Válassz megoldási utat
        </label>
        <select
          id={`${uid}-path`}
          value={path}
          onChange={(event) =>
            patch({ path: event.currentTarget.value, step: 0, checked: false })
          }
        >
          <option value="divide">Először elosztom a csoportokat</option>
          <option value="expand">Először felbontom a zárójelet</option>
        </select>
      </div>
      <div className="lab-summary" aria-live="polite" aria-atomic="true">
        <p className="lab-equation">
          <strong>
            {stage.left} = {stage.right}
          </strong>
        </p>
        <p>{stage.why}</p>
      </div>
      <svg
        className="lab-svg"
        viewBox="0 0 520 224"
        role="img"
        aria-labelledby={`${uid}-balance-title ${uid}-balance-desc`}
      >
        <title id={`${uid}-balance-title`}>
          Jelképes mérleg: {stage.left} egyenlő {stage.right}
        </title>
        <desc id={`${uid}-balance-desc`}>
          Bal oldalon az ismeretlen és az egységek, jobb oldalon {stage.right}{" "}
          egység látható. A vízszintes kar az egyenlőség megőrzését jelöli.
        </desc>
        <path
          d="M260 69L239 201H281Z"
          fill="#dce7e2"
          stroke="#172b32"
          stroke-width="2"
        />
        <rect x="216" y="200" width="88" height="9" rx="4" fill="#172b32" />
        <line
          x1="72"
          y1="70"
          x2="448"
          y2="70"
          stroke="#172b32"
          stroke-width="5"
          stroke-linecap="round"
        />
        <circle
          cx="260"
          cy="70"
          r="8"
          fill="#c8ec78"
          stroke="#172b32"
          stroke-width="2"
        />
        <path
          d="M130 71L39 164H221Z M390 71L299 164H481Z"
          fill="none"
          stroke="#778c8c"
          stroke-width="1.5"
        />
        <path
          d="M39 164Q130 184 221 164 M299 164Q390 184 481 164"
          fill="#e8eeeb"
          stroke="#172b32"
          stroke-width="2"
        />
        <EquationLeft mode={stage.mode} />
        {Array.from({ length: stage.right }, (_, i) => (
          <g key={i}>
            <rect
              x={325 + (i % 7) * 19}
              y={103 + Math.floor(i / 7) * 20}
              width="15"
              height="17"
              rx="3"
              fill="#c8ec78"
              stroke="#172b32"
              stroke-width="0.6"
            />
            <text
              x={332.5 + (i % 7) * 19}
              y={115.5 + Math.floor(i / 7) * 20}
              text-anchor="middle"
              font-size="11"
              fill="#172b32"
            >
              1
            </text>
          </g>
        ))}
        <text x="130" y="36" text-anchor="middle" className="lab-svg-label">
          {stage.left}
        </text>
        <text x="390" y="36" text-anchor="middle" className="lab-svg-label">
          {stage.right}
        </text>
      </svg>
      <div className="lab-actions">
        {!final && (
          <button
            type="button"
            className="lab-button lab-button-primary"
            onClick={() => patch({ step: step + 1, checked: false })}
          >
            {stages[step + 1].move}
          </button>
        )}
        {final && (
          <button
            type="button"
            className="lab-button lab-button-primary"
            disabled={checked}
            onClick={() => patch({ checked: true })}
          >
            {checked
              ? "A visszahelyettesítést megnéztük"
              : "Ellenőrzöm az eredeti egyenletben"}
          </button>
        )}
        <button
          type="button"
          className="lab-button"
          disabled={step === 0}
          onClick={() => patch({ step: step - 1, checked: false })}
        >
          Egy lépést vissza
        </button>
        <button
          type="button"
          className="lab-button"
          onClick={() => patch({ step: 0, checked: false })}
        >
          Az út elejére
        </button>
      </div>
      {checked && (
        <p className="lab-check" role="status">
          Visszahelyettesítés: 3 · (5 + 2) = 3 · 7 = 21. Az x = 5 valóban
          megoldja az eredeti egyenletet.
        </p>
      )}
      <ol className="lab-history">
        {stages.slice(0, step + 1).map((item, i) => (
          <li
            key={`${path}-${i}`}
            aria-current={i === step ? "step" : undefined}
          >
            <strong>
              {item.left} = {item.right}
            </strong>
            <span>{item.move}</span>
          </li>
        ))}
      </ol>
      <button
        type="button"
        className="lab-button lab-button-text"
        aria-expanded={value.zeroShown === true}
        onClick={() => patch({ zeroShown: value.zeroShown !== true })}
      >
        Miért fontos, hogy ne nullával osszunk?
      </button>
      {value.zeroShown === true && (
        <p className="lab-note">
          Nullával osztani nem értelmezett művelet. A nullával szorzás pedig
          elveszítheti a megoldásról szóló információt: az x = 5 állításból így
          0 = 0 lenne, amelyből x értéke már nem olvasható ki. Itt ezért a nem
          nulla 3-mal osztunk.
        </p>
      )}
      <Reflection
        questions={[
          "Miért kell a kivonást vagy osztást mindkét oldalon elvégezni?",
          "Próbáld végig a másik utat is. Mi maradt ugyanaz, és melyik út volt rövidebb?",
        ]}
      />
    </>
  );
}

function GraphLab({ value, onChange, uid }: TopicLabProps) {
  const base = numberState(value, "base", 500, 0, 2000);
  const rate = numberState(value, "rate", 200, 0, 500);
  const distance = numberState(value, "distance", 4, 0, 12);
  const cost = base + rate * distance;
  const maxY = 8000; // Fixed axis: changing the starting fee must not appear to change the slope.
  const px = (x: number) => 70 + (x / 12) * 350;
  const py = (y: number) => 270 - (y / maxY) * 235;
  const tableX = Array.from(new Set([0, 1, 2, 4, 8, 12, distance])).sort(
    (a, b) => a - b,
  );
  const patch = (next: LabState) => onChange({ ...value, ...next });
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Grafikonműhely</span>
        <h3>Alapdíj, út, teljes ár</h3>
        <p>
          Egy elképzelt szolgáltatás árát vizsgáljuk. Jósolj: mi változik a
          grafikonon, ha csak az alapdíjat emeled?
        </p>
      </header>
      <div className="lab-controls lab-controls-three">
        <NumberControl
          id={`${uid}-base`}
          label="Alapdíj"
          value={base}
          min={0}
          max={2000}
          unit="Ft"
          onChange={(n) => patch({ base: n })}
        />
        <NumberControl
          id={`${uid}-rate`}
          label="Kilométerenkénti díj"
          value={rate}
          min={0}
          max={500}
          unit="Ft/km"
          onChange={(n) => patch({ rate: n })}
        />
        <NumberControl
          id={`${uid}-distance`}
          label="Megtett út"
          value={distance}
          min={0}
          max={12}
          unit="km"
          onChange={(n) => patch({ distance: n })}
        />
      </div>
      <div className="lab-summary">
        <p>
          Induláskor <strong>{fmt(base)} Ft</strong> az alapdíj; minden
          kilométer további <strong>{fmt(rate)} Ft</strong>.
        </p>
        <p className="lab-equation">
          {fmt(base)} Ft + {fmt(rate)} Ft/km · {distance} km ={" "}
          <strong>{fmt(cost)} Ft</strong>
        </p>
      </div>
      <p className="lab-scroll-hint">
        A széles ábrát és a táblázatot oldalra görgetve is bejárhatod.
      </p>
      <div
        className="lab-plot-scroll"
        tabIndex={0}
        role="region"
        aria-label="Út és ár grafikonja; szükség esetén vízszintesen görgethető"
      >
        <svg
          className="lab-svg lab-svg-wide"
          viewBox="0 0 460 306"
          role="img"
          aria-labelledby={`${uid}-graph-title ${uid}-graph-desc`}
        >
          <title id={`${uid}-graph-title`}>
            Az út hossza és a teljes ár kapcsolata
          </title>
          <desc id={`${uid}-graph-desc`}>
            A vízszintes tengely az utat mutatja 0 és 12 kilométer között. A
            függőleges tengely az árat forintban. Az ár {base} forintról indul,
            kilométerenként {rate} forinttal nő. A kijelölt pont {distance}{" "}
            kilométernél {cost} forint.
          </desc>
          {Array.from({ length: 5 }, (_, i) => {
            const y = (maxY * i) / 4;
            return (
              <g key={`y-${i}`}>
                <line x1="70" y1={py(y)} x2="420" y2={py(y)} stroke="#d8e0db" />
                <text
                  x="60"
                  y={py(y) + 4}
                  text-anchor="end"
                  className="lab-svg-small"
                >
                  {fmt(y)}
                </text>
              </g>
            );
          })}
          {[0, 2, 4, 6, 8, 10, 12].map((x) => (
            <g key={`x-${x}`}>
              <line x1={px(x)} y1="35" x2={px(x)} y2="270" stroke="#e2e7e3" />
              <text
                x={px(x)}
                y="292"
                text-anchor="middle"
                className="lab-svg-small"
              >
                {x}
              </text>
            </g>
          ))}
          <path
            d="M70 25V270H434"
            fill="none"
            stroke="#172b32"
            stroke-width="2"
          />
          <text x="68" y="16" className="lab-svg-label">
            Ft
          </text>
          <text x="432" y="292" className="lab-svg-label">
            km
          </text>
          <line
            x1={px(0)}
            y1={py(base)}
            x2={px(12)}
            y2={py(base + rate * 12)}
            stroke="#27766e"
            stroke-width="4"
          />
          <path
            d={`M${px(distance)} 270V${py(cost)}H70`}
            fill="none"
            stroke="#6e8382"
            stroke-width="1.5"
            stroke-dasharray="5 4"
          />
          <circle
            cx={px(distance)}
            cy={py(cost)}
            r="7"
            fill="#c8ec78"
            stroke="#172b32"
            stroke-width="2"
          />
          <text
            x={px(distance) + (distance > 6 ? -12 : 12)}
            y={Math.max(50, py(cost) - 13)}
            text-anchor={distance > 6 ? "end" : "start"}
            className="lab-svg-label"
            stroke="#f6f5ef"
            stroke-width="4"
            paint-order="stroke"
          >
            ({distance} km; {fmt(cost)} Ft)
          </text>
        </svg>
      </div>
      <p className="lab-plot-caption">
        A vonal az ár kapcsolatát mutatja, nem az út térképét.
      </p>
      <p className="lab-note">
        A tengelyek skálája rögzített: ugyanazon a beosztáson figyelheted meg a
        díjak változását.
      </p>
      <div
        className="lab-table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Út és ár értéktáblázata"
      >
        <table className="lab-table">
          <caption>Ugyanez a kapcsolat számokkal</caption>
          <thead>
            <tr>
              <th scope="col">Út (km)</th>
              <th scope="col">Alapdíj (Ft)</th>
              <th scope="col">Útdíj (Ft)</th>
              <th scope="col">Összesen (Ft)</th>
            </tr>
          </thead>
          <tbody>
            {tableX.map((x) => (
              <tr
                key={x}
                className={x === distance ? "lab-row-selected" : undefined}
              >
                <th scope="row">
                  {x}
                  {x === distance ? " · kijelölt" : ""}
                </th>
                <td>{fmt(base)}</td>
                <td>{fmt(rate * x)}</td>
                <td>{fmt(base + rate * x)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="lab-note">
        {base > 0
          ? "Ez a kapcsolat nem egyenes arányosság: nulla kilométernél is van alapdíj."
          : rate > 0
            ? "Most egyenes arányosságot látunk: nincs alapdíj, az ár és az út hányadosa pozitív útnál állandó."
            : "Most minden út ára 0 Ft: a grafikon a vízszintes tengelyen marad."}
      </p>
      <div className="lab-actions">
        <button
          type="button"
          className="lab-button"
          aria-expanded={value.formulaShown === true}
          onClick={() => patch({ formulaShown: value.formulaShown !== true })}
        >
          Betűs alak · bővítés
        </button>
        <button
          type="button"
          className="lab-button"
          onClick={() => onChange(initialLabState("grafikon"))}
        >
          Újrakezdés
        </button>
      </div>
      {value.formulaShown === true && (
        <div className="lab-extension">
          <p>
            <strong>Bővítés:</strong> ha x az út kilométerben, y pedig az ár
            forintban, akkor{" "}
            <strong>
              y = {rate}x + {base}
            </strong>
            .
          </p>
          <p>
            A kilométerenkénti változás {rate}; a függőleges tengelynél
            leolvasott kezdőérték {base}. A két paraméter más szerepet tölt be.
          </p>
        </div>
      )}
      <Reflection
        questions={[
          "Állítsd az alapdíjat nullára. Mikor lesz a kétszeres úthoz tartozó ár is kétszeres?",
          "Mit jelent a történetben egy vízszintes grafikon? Állíts elő egy ilyet.",
        ]}
      />
    </>
  );
}

type Point = [number, number];
function polygonString(points: Point[]) {
  return points.map((p) => `${p[0]},${p[1]}`).join(" ");
}
function trianglePoints(
  a: number,
  b: number,
  x: number,
  y: number,
  quarter: number,
): Point[] {
  // Rigid rotations of one fixed triangle; no scaling or reflection between arrangements.
  const rotations: Point[][] = [
    [
      [0, 0],
      [a, 0],
      [0, b],
    ],
    [
      [0, 0],
      [0, a],
      [-b, 0],
    ],
    [
      [0, 0],
      [-a, 0],
      [0, -b],
    ],
    [
      [0, 0],
      [0, -a],
      [b, 0],
    ],
  ];
  return rotations[quarter].map(([dx, dy]) => [x + dx, y + dy]);
}

function PythagoreanSquare({
  a,
  b,
  right,
  step,
  piece,
  uid,
}: {
  a: number;
  b: number;
  right: boolean;
  step: number;
  piece: number;
  uid: string;
}) {
  const side = a + b;
  const scale = 220 / side;
  const placements: [number, number, number][] = right
    ? [
        [0, a, 0],
        [side, 0, 1],
        [a, side, 2],
        [a, a, 3],
      ]
    : [
        [0, 0, 0],
        [side, 0, 1],
        [side, side, 2],
        [0, side, 3],
      ];
  const central: Point[] = [
    [a, 0],
    [side, a],
    [b, side],
    [0, b],
  ];
  const label = right
    ? "a négy háromszög és az a², b² négyzetek"
    : "a négy háromszög és a c² négyzet";
  return (
    <svg
      className="lab-svg"
      viewBox="0 0 280 292"
      role="img"
      aria-labelledby={`${uid}-title ${uid}-desc`}
    >
      <title id={`${uid}-title`}>
        {right ? "Második" : "Első"} elrendezés: {label}
      </title>
      <desc id={`${uid}-desc`}>
        A külső négyzet oldala {side}, területe {side * side}. Négy egybevágó,{" "}
        {a} és {b} befogójú derékszögű háromszög összterülete {2 * a * b}.{" "}
        {right
          ? `A két maradó négyzet területe ${a * a} és ${b * b}.`
          : `A középső négyzet minden oldala a háromszög átfogója, területe ${a * a + b * b}.`}{" "}
        A darabok hézag és átfedés nélkül kitöltik a nagy négyzetet.
      </desc>
      <g transform={`translate(30 28) scale(${scale})`}>
        <rect
          width={side}
          height={side}
          fill="#fff"
          stroke="#172b32"
          stroke-width={2 / scale}
        />
        {right ? (
          <>
            <rect
              width={a}
              height={a}
              fill={step >= 2 ? "#e7f0bd" : "#edf1e8"}
              stroke="#172b32"
              stroke-width={1.5 / scale}
            />
            <rect
              x={a}
              y={a}
              width={b}
              height={b}
              fill={step >= 2 ? "#e7f0bd" : "#edf1e8"}
              stroke="#172b32"
              stroke-width={1.5 / scale}
            />
          </>
        ) : (
          <polygon
            points={polygonString(central)}
            fill={step >= 2 ? "#e7f0bd" : "#edf1e8"}
            stroke="#172b32"
            stroke-width={1.5 / scale}
          />
        )}
        {placements.map(([x, y, turn], i) => {
          const points = trianglePoints(a, b, x, y, turn);
          const cx = points.reduce((total, p) => total + p[0], 0) / 3;
          const cy = points.reduce((total, p) => total + p[1], 0) / 3;
          return (
            <g
              key={i}
              opacity={
                piece > 0 && piece !== i + 1
                  ? 0.3
                  : step >= 2 && piece === 0
                    ? 0.55
                    : 1
              }
            >
              <polygon
                points={polygonString(points)}
                fill={COLORS[i]}
                stroke="#172b32"
                stroke-width={(piece === i + 1 ? 3 : 1) / scale}
              />
              <text
                x={cx}
                y={cy}
                dominant-baseline="middle"
                text-anchor="middle"
                fill="#172b32"
                stroke="#f6f5ef"
                stroke-width={2.5 / scale}
                paint-order="stroke"
                font-size={12 / scale}
                font-weight="800"
              >
                {i + 1}
              </text>
            </g>
          );
        })}
        {right ? (
          <>
            <text
              x={a / 2}
              y={a / 2}
              dominant-baseline="middle"
              text-anchor="middle"
              font-size={Math.min(18, a * scale * 0.6) / scale}
              fill="#172b32"
              font-weight="800"
            >
              a²
            </text>
            <text
              x={a + b / 2}
              y={a + b / 2}
              dominant-baseline="middle"
              text-anchor="middle"
              font-size={Math.min(18, b * scale * 0.6) / scale}
              fill="#172b32"
              font-weight="800"
            >
              b²
            </text>
          </>
        ) : (
          <text
            x={side / 2}
            y={side / 2}
            dominant-baseline="middle"
            text-anchor="middle"
            font-size={21 / scale}
            fill="#172b32"
            font-weight="800"
          >
            c²
          </text>
        )}
      </g>
      <text x="140" y="17" text-anchor="middle" className="lab-svg-label">
        Oldal: a + b = {side}
      </text>
      <text x="140" y="270" text-anchor="middle" className="lab-svg-label">
        {right ? `a² + b² = ${a * a} + ${b * b}` : `c² = ${a * a + b * b}`}
      </text>
      <text x="140" y="289" text-anchor="middle" className="lab-svg-small">
        Nagy négyzet: {side * side} területegység
      </text>
    </svg>
  );
}

function PythagorasLab({ value, onChange, uid }: TopicLabProps) {
  const a = numberState(value, "a", 3, 1, 12);
  const b = numberState(value, "b", 4, 1, 12);
  const step = numberState(value, "proofStep", 0, 0, 3);
  const turn = numberState(value, "turn", 0, 0, 3);
  const piece = numberState(value, "piece", 0, 0, 4);
  const cSquared = a * a + b * b;
  const c = Math.sqrt(cSquared);
  const exactC = Number.isInteger(c);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const proof = [
    `A két nagy négyzet egyforma: mindkettő oldala a + b = ${a + b}, területe ${(a + b) ** 2}.`,
    `Mindkettőben ugyanaz a négy egybevágó háromszög van. Egy háromszög területe a · b / 2 = ${fmt((a * b) / 2)}; négyé ${2 * a * b}. A sorszámok ugyanazokat a darabokat jelölik.`,
    `Az egyenlő nagy területekből ugyanakkora háromszögterületet veszünk el. Ezért a maradék is egyenlő: balra c², jobbra a² és b² együtt.`,
    `Így c² = a² + b² = ${a * a} + ${b * b} = ${cSquared}. A bal középső alakzat valóban négyzet: négy oldala c, szögei derékszögek, mert a háromszög két hegyesszöge együtt 90°.`,
  ];
  const sampleScale = 100 / Math.max(a, b);
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Pitagorasz-műhely</span>
        <h3>Ugyanazok a darabok, ugyanakkora maradék</h3>
        <p>
          A befogók merőlegesen találkoznak. A szemközti c oldal az átfogó.
          Jósolj: miért éppen az oldalak négyzetei szerepelnek?
        </p>
      </header>
      <div className="lab-controls">
        <NumberControl
          id={`${uid}-a`}
          label="a befogó"
          value={a}
          min={1}
          max={12}
          unit="hosszúságegység"
          onChange={(n) => patch({ a: n })}
        />
        <NumberControl
          id={`${uid}-b`}
          label="b befogó"
          value={b}
          min={1}
          max={12}
          unit="hosszúságegység"
          onChange={(n) => patch({ b: n })}
        />
      </div>
      <div
        className="lab-actions lab-proof-steps"
        aria-label="A területi indoklás lépései"
      >
        {[
          "Két nagy négyzet",
          "Négy azonos háromszög",
          "Egyenlő maradék",
          "Az összefüggés",
        ].map((label, i) => (
          <button
            type="button"
            key={label}
            className={`lab-button ${step === i ? "lab-button-primary" : ""}`}
            aria-pressed={step === i}
            onClick={() => patch({ proofStep: i })}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>
      <p className="lab-summary" aria-live="polite" aria-atomic="true">
        {proof[step]}
      </p>
      <div className="lab-proof-grid">
        <div className="lab-proof-card">
          <h4>1. elrendezés</h4>
          <PythagoreanSquare
            a={a}
            b={b}
            right={false}
            step={step}
            piece={piece}
            uid={`${uid}-left`}
          />
        </div>
        <div className="lab-proof-card">
          <h4>2. elrendezés</h4>
          <PythagoreanSquare
            a={a}
            b={b}
            right={true}
            step={step}
            piece={piece}
            uid={`${uid}-right`}
          />
        </div>
      </div>
      <div
        className="lab-actions"
        aria-label="Azonos háromszögdarabok kiemelése"
      >
        {[1, 2, 3, 4].map((n) => (
          <button
            type="button"
            key={n}
            className={`lab-button ${piece === n ? "lab-button-primary" : ""}`}
            aria-pressed={piece === n}
            onClick={() => patch({ piece: piece === n ? 0 : n })}
          >
            {n}. darab kiemelése
          </button>
        ))}
      </div>
      <p className="lab-note">
        A darabokat nem nyújtottuk meg. Az 1., 3. és 4. darab eltolódott, a 2.
        helyben maradt. A két végső elrendezésben nincs rés és nincs átfedés.
      </p>
      <div className="lab-grid">
        <div className="lab-sample">
          <h4>Ugyanaz a háromszög elforgatva</h4>
          <svg
            className="lab-svg lab-svg-sample"
            viewBox="0 0 220 200"
            role="img"
            aria-labelledby={`${uid}-rotation-title`}
          >
            <title id={`${uid}-rotation-title`}>
              Az a = {a}, b = {b} befogójú háromszög {turn * 90} fokos
              elforgatása. A hosszak és a terület nem változnak.
            </title>
            <g
              transform={`translate(110 97) rotate(${turn * 90}) scale(${sampleScale}) translate(${-a / 3} ${-b / 3})`}
            >
              <polygon
                points={`0,0 ${a},0 0,${b}`}
                fill="#27766e"
                stroke="#172b32"
                stroke-width={1.5 / sampleScale}
              />
              <path
                d={`M${Math.min(a, b) * 0.18} 0V${Math.min(a, b) * 0.18}H0`}
                fill="none"
                stroke="#f6f5ef"
                stroke-width={2 / sampleScale}
              />
            </g>
            <text
              x="110"
              y="190"
              text-anchor="middle"
              className="lab-svg-small"
            >
              a = {a}; b = {b}; terület = {fmt((a * b) / 2)}
            </text>
          </svg>
          <button
            type="button"
            className="lab-button"
            onClick={() => patch({ turn: (turn + 1) % 4 })}
          >
            Elforgatom 90°-kal
          </button>
        </div>
        <div
          className="lab-table-scroll"
          role="region"
          aria-label="A négyzetek területei számokkal"
          tabIndex={0}
        >
          <table className="lab-table">
            <caption>Oldal és négyzetterület</caption>
            <thead>
              <tr>
                <th scope="col">Oldal</th>
                <th scope="col">Hossz</th>
                <th scope="col">Négyzet területe</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">a</th>
                <td>{a}</td>
                <td>{a * a}</td>
              </tr>
              <tr>
                <th scope="row">b</th>
                <td>{b}</td>
                <td>{b * b}</td>
              </tr>
              <tr>
                <th scope="row">c</th>
                <td>
                  {exactC ? fmt(c) : `√${cSquared} ≈ ${huPrecise.format(c)}`}
                </td>
                <td>{cSquared}</td>
              </tr>
            </tbody>
          </table>
          <p className="lab-note">
            Hossz: hosszúságegység. Terület: területegység.{" "}
            {exactC
              ? "Az átfogó most egész szám."
              : "A gyökjel pontos értéket jelöl; a kiírt tizedes csak közelítés."}
          </p>
        </div>
      </div>
      <div className="lab-summary">
        <p className="lab-equation">
          <strong>
            {a}² + {b}² = {cSquared} = c²
          </strong>
        </p>
        <p>
          Az átfogó hossza:{" "}
          {exactC
            ? `c = ${fmt(c)}`
            : `c = √${cSquared} ≈ ${huPrecise.format(c)}`}
          .
        </p>
      </div>
      <div className="lab-actions">
        <button
          type="button"
          className="lab-button"
          onClick={() => onChange(initialLabState("pitagorasz"))}
        >
          Vissza a 3–4–5 háromszöghöz
        </button>
      </div>
      <Reflection
        questions={[
          "Miért lehet a négy háromszöget mindkét nagy négyzetből elvenni, és mitől egyenlő a két maradék?",
          "Melyik feltételt kellene először ellenőrizned, mielőtt egy másik háromszögre alkalmazod ezt a tételt?",
        ]}
      />
    </>
  );
}

// A full-period 32-bit counter with invertible xor/odd-multiplication mixing.
// Rejection sampling removes modulo bias when converting uint32 values to six faces.
function nextRandom(seed: number): [number, number] {
  const state = (seed + 0x9e3779b9) >>> 0;
  let z = state;
  z = Math.imul(z ^ (z >>> 16), 0x21f0aaad);
  z = Math.imul(z ^ (z >>> 15), 0x735a2d97);
  return [state, (z ^ (z >>> 15)) >>> 0];
}
function die(seed: number): [number, number] {
  let next = seed;
  while (true) {
    const [state, random] = nextRandom(next);
    next = state;
    if (random < 4294967292) return [next, (random % 6) + 1];
  }
}

function ProbabilityLab({ value, onChange, uid }: TopicLabProps) {
  const selected = numberState(value, "eventSum", 7, 2, 12);
  const seed = numberState(value, "seed", START_SEED, 0, 0xffffffff);
  const rawCounts = value.counts;
  const counts =
    Array.isArray(rawCounts) &&
    rawCounts.length === 11 &&
    rawCounts.every((n) => Number.isSafeInteger(n) && n >= 0 && n <= 1000000000)
      ? rawCounts
      : Array<number>(11).fill(0);
  const trials = counts.reduce((total, n) => total + n, 0);
  const favorable = 6 - Math.abs(selected - 7);
  const hits = counts[selected - 2];
  const expected = favorable / 36;
  const observed = trials > 0 ? hits / trials : null;
  const rawPair = value.lastPair;
  const lastPair =
    Array.isArray(rawPair) &&
    rawPair.length === 2 &&
    rawPair.every((n) => Number.isInteger(n) && n >= 1 && n <= 6)
      ? rawPair
      : null;
  const lastBatch = numberState(value, "lastBatch", 0, 0, 1000);
  const patch = (next: LabState) => onChange({ ...value, ...next });
  const simulate = (amount: number) => {
    const nextCounts = [...counts];
    let state = seed;
    let one = 1;
    let two = 1;
    for (let i = 0; i < amount; i++) {
      [state, one] = die(state);
      [state, two] = die(state);
      nextCounts[one + two - 2] += 1;
    }
    onChange({
      ...value,
      seed: state,
      counts: nextCounts,
      lastPair: [one, two],
      lastBatch: amount,
    });
  };
  const maxFrequency = Math.max(
    0.25,
    ...counts.map((n) => (trials > 0 ? n / trials : 0)),
  );
  const maxY = Math.min(1, Math.ceil(maxFrequency * 10) / 10);
  const chartY = (frequency: number) => 224 - (frequency / maxY) * 170;
  return (
    <>
      <header className="lab-heading">
        <span className="lab-eyebrow">Véletlenlabor</span>
        <h3>Két kocka: a párok egyformán esélyesek</h3>
        <p>
          Mindkét kockát szabályosnak, a két dobást egymástól függetlennek
          modellezzük. Jósolj: a 7-es összeg vagy a 12-es összeg gyakoribb?
        </p>
      </header>
      <div className="lab-control">
        <label className="lab-label" htmlFor={`${uid}-sum`}>
          Melyik összeget figyeljük?
        </label>
        <select
          id={`${uid}-sum`}
          value={selected}
          onChange={(event) =>
            patch({ eventSum: Number(event.currentTarget.value) })
          }
        >
          {Array.from({ length: 11 }, (_, i) => (
            <option key={i} value={i + 2}>
              {i + 2}-es összeg
            </option>
          ))}
        </select>
        <span className="lab-bounds">
          A táblázat bármelyik eredményére kattintva is választhatsz.
        </span>
      </div>
      <div
        className="lab-table-scroll"
        role="region"
        aria-label="A két kocka 36 lehetséges dobáspárja"
        tabIndex={0}
      >
        <table className="lab-table lab-dice-table">
          <caption>
            A sor az első kocka, az oszlop a második kocka. A cella a két szám
            összege.
          </caption>
          <thead>
            <tr>
              <th scope="col">
                <span aria-label="Első kocka lefelé, második kocka jobbra">
                  1. ↓ / 2. →
                </span>
              </th>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <th scope="col" key={n}>
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5, 6].map((one) => (
              <tr key={one}>
                <th scope="row">{one}</th>
                {[1, 2, 3, 4, 5, 6].map((two) => (
                  <td key={two}>
                    <button
                      type="button"
                      className={`lab-dice-cell ${one + two === selected ? "lab-dice-cell-selected" : ""}`}
                      aria-pressed={one + two === selected}
                      aria-label={`Első kocka ${one}, második kocka ${two}; összeg ${one + two}. Ezt az összeget választom.`}
                      onClick={() => patch({ eventSum: one + two })}
                    >
                      {one + two}
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="lab-summary">
        <p>
          A{" "}
          <strong>
            {selected}-es összeghez {favorable} dobáspár
          </strong>{" "}
          tartozik a 36-ból.
        </p>
        <p className="lab-equation">
          Elméleti esély:{" "}
          <strong>
            {favorable}/36 = {fraction(favorable, 36)}
          </strong>
          {Number.isInteger(expected * 100)
            ? ` = ${fmt(expected * 100)}%`
            : ` ≈ ${fmt(expected * 100)}%`}
        </p>
      </div>
      <div className="lab-actions" aria-label="Új dobáspárok szimulálása">
        {[10, 100, 1000].map((amount) => (
          <button
            type="button"
            key={amount}
            className="lab-button lab-button-primary"
            onClick={() => simulate(amount)}
          >
            +{fmt(amount)} dobáspár
          </button>
        ))}
        <button
          type="button"
          className="lab-button"
          onClick={() =>
            onChange({ ...initialLabState("valoszinuseg"), eventSum: selected })
          }
        >
          Kísérlet újraindítása
        </button>
      </div>
      <div
        className="lab-observation"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {trials === 0 ? (
          <p>
            Még nem futott kísérlet. A fenti esély a 36 lehetőség
            megszámolásából származik.
          </p>
        ) : (
          <>
            <p>
              <strong>
                {fmt(trials)} dobáspárból {fmt(hits)}
              </strong>{" "}
              adott {selected}-es összeget. Megfigyelt relatív gyakoriság:{" "}
              <strong>{fmt((observed ?? 0) * 100)}%</strong>.
            </p>
            {lastPair && (
              <p>
                Legutóbbi dobáspár: {lastPair[0]} és {lastPair[1]}, összegük{" "}
                {lastPair[0] + lastPair[1]}. A legutóbbi futás {fmt(lastBatch)}{" "}
                új párt adott.
              </p>
            )}
          </>
        )}
      </div>
      <p className="lab-note">
        Újrajátszható számítógépes kísérlet: a rögzített kezdőszám {START_SEED}.
        Újrakezdéskor ugyanaz a sorozat indul; a +10, +100 és +1000 gomb mindig
        új dobáspárokkal folytatja. Az összegek esélye eltér, a 36 rendezett pár
        esélye azonos.
      </p>
      <div className="lab-legend">
        <span>
          <i className="lab-swatch lab-swatch-theory" />
          Elméleti esély
        </span>
        <span>
          <i className="lab-swatch lab-swatch-observed" />
          Megfigyelt relatív gyakoriság
        </span>
      </div>
      <p className="lab-scroll-hint">
        Az összes oszlophoz és táblázatadathoz görgess oldalra. A táblázat az
        ábra pontos számait is megmutatja.
      </p>
      <div
        className="lab-plot-scroll"
        role="region"
        aria-label="Elméleti és megfigyelt eloszlás; szükség esetén vízszintesen görgethető"
        tabIndex={0}
      >
        <svg
          className="lab-svg lab-svg-dice"
          viewBox="0 0 620 280"
          role="img"
          aria-labelledby={`${uid}-prob-title ${uid}-prob-desc`}
        >
          <title id={`${uid}-prob-title`}>
            Elméleti és megfigyelt gyakoriságok összehasonlítása
          </title>
          <desc id={`${uid}-prob-desc`}>
            Az összegek 2-től 12-ig követik egymást. A zöld oszlop az elméleti
            esély, a csíkozott arany oszlop a szimulációban kapott arány. A
            pontos értékek az ábra alatti táblázatban is szerepelnek.{" "}
            {trials === 0
              ? "Még nincs megfigyelt adat."
              : `${trials} dobáspár eredménye látható.`}
          </desc>
          <defs>
            <pattern
              id={`${uid}-observed`}
              patternUnits="userSpaceOnUse"
              width="6"
              height="6"
            >
              <rect width="6" height="6" fill="#e6b668" />
              <path
                d="M-1 1L1-1 M0 6L6 0 M5 7L7 5"
                stroke="#88622d"
                stroke-width="0.8"
              />
            </pattern>
          </defs>
          {Array.from({ length: 5 }, (_, i) => {
            const frequency = (maxY * i) / 4;
            return (
              <g key={i}>
                <line
                  x1="52"
                  x2="600"
                  y1={chartY(frequency)}
                  y2={chartY(frequency)}
                  stroke="#d7dfd9"
                />
                <text
                  x="44"
                  y={chartY(frequency) + 4}
                  text-anchor="end"
                  className="lab-svg-small"
                >
                  {fmt(frequency * 100)}%
                </text>
              </g>
            );
          })}
          {Array.from({ length: 11 }, (_, i) => {
            const sum = i + 2;
            const expectedFrequency = (6 - Math.abs(sum - 7)) / 36;
            const actual = trials > 0 ? counts[i] / trials : 0;
            const x = 70 + i * 48;
            return (
              <g key={sum}>
                {sum === selected && (
                  <rect
                    x={x - 9}
                    y="46"
                    width="42"
                    height="207"
                    rx="5"
                    fill="#172b32"
                    opacity="0.055"
                  />
                )}
                <rect
                  x={x}
                  y={chartY(expectedFrequency)}
                  width="13"
                  height={224 - chartY(expectedFrequency)}
                  fill="#27766e"
                />
                <rect
                  x={x + 15}
                  y={chartY(actual)}
                  width="13"
                  height={224 - chartY(actual)}
                  fill={`url(#${uid}-observed)`}
                />
                <text
                  x={x + 14}
                  y="246"
                  text-anchor="middle"
                  className="lab-svg-label"
                  font-weight={sum === selected ? 800 : 500}
                >
                  {sum}
                </text>
              </g>
            );
          })}
          <line x1="52" y1="224" x2="600" y2="224" stroke="#172b32" />
          <text x="326" y="274" text-anchor="middle" className="lab-svg-small">
            A két dobott szám összege
          </text>
        </svg>
      </div>
      <div
        className="lab-table-scroll"
        role="region"
        aria-label="Az összegek elméleti és megfigyelt gyakorisága"
        tabIndex={0}
      >
        <table className="lab-table">
          <caption>Az elméletet és a megfigyelést külön olvasd</caption>
          <thead>
            <tr>
              <th scope="col">Összeg</th>
              <th scope="col">Elméleti esély</th>
              <th scope="col">Megfigyelt darabszám</th>
              <th scope="col">Relatív gyakoriság</th>
            </tr>
          </thead>
          <tbody>
            {counts.map((count, i) => (
              <tr
                key={i}
                className={selected === i + 2 ? "lab-row-selected" : undefined}
              >
                <th scope="row">
                  {i + 2}
                  {selected === i + 2 ? " · kijelölt" : ""}
                </th>
                <td>{6 - Math.abs(i + 2 - 7)}/36</td>
                <td>{trials > 0 ? fmt(count) : "Még nincs adat"}</td>
                <td>{trials > 0 ? `${fmt((count / trials) * 100)}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="lab-note">
        Több dobás mellett az arányok rendszerint stabilabbá válnak, de egy új
        futás után nem kötelező közelebb kerülniük az elmélethez. Az előző
        eredmények nem írnak elő „kötelező kiegyenlítődést”.
      </p>
      <Reflection
        questions={[
          "Miért nem 1/11 az egyes összegek esélye, ha tizenegy különböző összeget látunk?",
          "Nézz meg egy rövid, majd egy hosszabb kísérletet. Melyik eltérés lepte meg a jóslatodat?",
        ]}
      />
    </>
  );
}

export function Lab({ topic, value, onChange }: LabProps) {
  const uid = `lab-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const props: TopicLabProps = { value, onChange, uid };
  return (
    <section className="lab-root" aria-label="Interaktív matematikaműhely">
      {["szamfogalom", "muveleti-sorrend", "aranyossag", "mertekegysegek"].includes(topic) && <FoundationLab topic={topic} value={value} onChange={onChange} />}
      {topic === "tortek" && <FractionsLab {...props} />}
      {topic === "szazalek" && <PercentageLab {...props} />}
      {topic === "egyenlet" && <EquationLab {...props} />}
      {topic === "grafikon" && <GraphLab {...props} />}
      {topic === "pitagorasz" && <PythagorasLab {...props} />}
      {topic === "valoszinuseg" && <ProbabilityLab {...props} />}
    </section>
  );
}

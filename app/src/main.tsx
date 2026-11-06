import { render } from "preact";
import { useEffect, useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import { lessons } from "./content/lessons.ts";
import { Lab, initialLabState } from "./interactives/Lab.tsx";
import {
  gradeAnswer,
  encodePartResponses,
  decodePartResponses,
} from "./math/engine.ts";
import {
  generateExercise,
  generatorFamilies,
  familiesFor,
} from "./math/generators.ts";
import {
  emptyAttempt,
  emptyProfile,
  loadProfile,
  MAX_ATTEMPTS,
  MAX_IMPORT_BYTES,
  parseImport,
  recordGrade,
  saveProfile,
  serializeProfile,
  STORAGE_KEY,
  TOPICS,
  VERSION,
} from "./progress.ts";
import type { Attempt, Profile, TopicProgress } from "./progress.ts";
import type {
  Exercise,
  Lesson,
  TopicId,
  WorkedExample,
  ScalarAnswerSpec,
  AnswerSpec,
} from "./types.ts";
import { curriculum } from "./content/curriculum.ts";
import { contentStats } from "./content/stats.ts";
import { TARGETED_GENERATOR_FAMILIES } from "./learning/repair-generators.ts";
import {
  unitCoverage,
  lessonsForModule,
  prerequisitesFor,
} from "./content/coverage.ts";
import { LEGACY_TOPICS, V2_TOPICS } from "./topics.ts";
import { getSkillTargets, recordLearningGrade } from "./learning/skills.ts";
import { LearningPanel, RepairPage } from "./learning/LearningUI.tsx";
import "./styles.css";
const stats = contentStats(
  lessons,
  generatorFamilies,
  TARGETED_GENERATOR_FAMILIES,
);
import "./interactives/labs.css";

type Change = (change: (before: Profile) => Profile) => void;
const steps = [
  "Jósolj",
  "Próbáld ki",
  "Értsd meg",
  "Nézd a példát",
  "Gyakorolj",
  "Önálló próba",
];
const icons: Record<string, ComponentChildren> = {
  home: (
    <>
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z" />
    </>
  ),
  map: (
    <>
      <path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Z" />
      <path d="M9 3v16M15 5v16" />
    </>
  ),
  spark: (
    <>
      <path d="m13 2-9 12h7l-1 8 10-13h-8Z" />
    </>
  ),
  chart: (
    <>
      <path d="M4 3v17h17M8 15l4-5 4 2 5-7" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="m10 3 .5 2h3L14 3l3 1-.5 2 2 2 2-.5 1 3-2 .5v3l2 .5-1 3-2-.5-2 2 .5 2-3 1-.5-2h-3L10 21l-3-1 .5-2-2-2-2 .5-1-3 2-.5v-3l-2-.5 1-3 2 .5 2-2L7 4Z" />
    </>
  ),
  arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
  back: <path d="M20 12H5m6-6-6 6 6 6" />,
  check: <path d="m5 12 4 4L19 6" />,
  bulb: (
    <>
      <path d="M8 15c-6-6-2-13 4-13s10 7 4 13l-1 3H9Z" />
      <path d="M9 21h6" />
    </>
  ),
  book: (
    <>
      <path d="M12 5c-3-3-7-3-10-1v15c3-2 7-2 10 1 3-3 7-3 10-1V4c-3-2-7-2-10 1Z" />
      <path d="M12 5v15" />
    </>
  ),
  search: (
    <>
      <circle cx="10" cy="10" r="6" />
      <path d="m15 15 6 6" />
    </>
  ),
  print: (
    <>
      <path d="M6 9V3h12v6M6 18H3v-9h18v9h-3M6 14h12v7H6Z" />
      <path d="M17 12h1" />
    </>
  ),
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V6a4 4 0 0 1 8 0v4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  refresh: (
    <>
      <path d="M20 8a8 8 0 1 0 0 8M20 3v6h-6" />
    </>
  ),
};
function Icon({ name, size = 20 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.7"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      {icons[name] || icons.book}
    </svg>
  );
}
function Button({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
}: {
  children: ComponentChildren;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      class={`button button-${variant} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
const navigate = (path: string) => {
  location.hash = path;
};
const getRoute = () =>
  location.hash.replace(/^#\/?/, "").split("?")[0].split("/");
const byId = (id?: string) => lessons.find((l) => l.id === id);
function completed(lesson: Lesson, profile: Profile) {
  const rounds = new Set(
    Object.keys(profile.attempts)
      .filter((id) => id.startsWith(`exit:${lesson.id}:`))
      .map((id) => id.split(":")[2]),
  );
  return [...rounds].some((r) =>
    lesson.exit
      .map((_, i) => i)
      .every(
        (i) => profile.attempts[`exit:${lesson.id}:${r}:${i}`]?.independent,
      ),
  );
}
function knowledgeAttempts(profile: Profile) {
  const predictionIds = new Set(lessons.map((l) => l.prediction.id));
  return Object.entries(profile.attempts).filter(
    ([id, a]) => !predictionIds.has(id) && a.tries > 0,
  );
}
function TopicArt({
  topic,
  large = false,
}: {
  topic: TopicId;
  large?: boolean;
}) {
  const common = {
    viewBox: "0 0 180 100",
    width: "100%",
    height: large ? "150" : "100",
    "aria-hidden": "true" as const,
  };
  if (topic === "betus-kifejezesek")
    return (
      <svg {...common}>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={26 + i * 28}
            y="18"
            width="22"
            height="36"
            rx="3"
            fill="currentColor"
            opacity=".22"
          />
        ))}
        <text x="117" y="43" font-size="21" fill="currentColor">
          + 2
        </text>
        <text
          x="90"
          y="84"
          text-anchor="middle"
          font-size="23"
          fill="currentColor"
        >
          3a + 2
        </text>
      </svg>
    );
  if (topic === "szoveges-modellek")
    return (
      <svg {...common}>
        <rect
          x="18"
          y="18"
          width="144"
          height="25"
          fill="currentColor"
          opacity=".16"
          rx="3"
        />
        <path
          d="M18 18v25m72-25v25m72-25v25M18 52v5h144v-5"
          stroke="currentColor"
          fill="none"
          stroke-width="2"
        />
        <text x="54" y="36" text-anchor="middle" fill="currentColor">
          x
        </text>
        <text x="126" y="36" text-anchor="middle" fill="currentColor">
          x + 4
        </text>
        <text
          x="90"
          y="86"
          text-anchor="middle"
          font-size="19"
          fill="currentColor"
        >
          x + (x + 4) = 20
        </text>
      </svg>
    );
  if (topic === "hatvanyok")
    return (
      <svg {...common}>
        {Array.from({ length: 8 }, (_, i) => (
          <rect
            key={i}
            x={24 + (i % 4) * 33}
            y={13 + Math.floor(i / 4) * 24}
            width="27"
            height="18"
            rx="2"
            fill="currentColor"
            opacity={i < 4 ? ".2" : ".45"}
          />
        ))}
        <text
          x="90"
          y="87"
          text-anchor="middle"
          font-size="22"
          fill="currentColor"
        >
          2³ = 2 × 2 × 2
        </text>
      </svg>
    );
  if (topic === "negyzetgyok")
    return (
      <svg {...common}>
        <rect
          x="53"
          y="10"
          width="63"
          height="63"
          fill="currentColor"
          opacity=".14"
        />
        <path
          d="M53 10h63v63H53Z"
          stroke="currentColor"
          fill="none"
          stroke-width="2"
        />
        <text
          x="85"
          y="48"
          text-anchor="middle"
          font-size="22"
          fill="currentColor"
        >
          25
        </text>
        <text x="128" y="47" font-size="20" fill="currentColor">
          5
        </text>
        <text
          x="85"
          y="94"
          text-anchor="middle"
          font-size="18"
          fill="currentColor"
        >
          √25 = 5
        </text>
      </svg>
    );
  if (topic === "szamfogalom")
    return (
      <svg {...common}>
        <path
          d="M16 55h148m-8-5 8 5-8 5"
          stroke="currentColor"
          fill="none"
          stroke-width="2"
        />
        {[-3, -2, -1, 0, 1, 2, 3].map((value) => (
          <g>
            <path d={`M${90 + value * 21} 49v12`} stroke="currentColor" />
            <text
              x={90 + value * 21}
              y="78"
              text-anchor="middle"
              fill="currentColor"
              font-size="12"
            >
              {value}
            </text>
          </g>
        ))}
        <path
          d="M48 37q21-25 42 0"
          stroke="currentColor"
          fill="none"
          stroke-width="2"
        />
        <circle cx="48" cy="55" r="6" fill="currentColor" />
        <circle
          cx="132"
          cy="55"
          r="6"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
      </svg>
    );
  if (topic === "muveleti-sorrend")
    return (
      <svg {...common}>
        <text
          x="90"
          y="38"
          text-anchor="middle"
          font-size="24"
          fill="currentColor"
        >
          2 × (3 + 4)
        </text>
        <path d="M97 48h57M121 48v12" stroke="currentColor" stroke-width="2" />
        <text
          x="90"
          y="83"
          text-anchor="middle"
          font-size="23"
          fill="currentColor"
        >
          2 × 7 = 14
        </text>
      </svg>
    );
  if (topic === "aranyossag")
    return (
      <svg {...common}>
        <path
          d="M29 15v63h126M29 78 143 17"
          stroke="currentColor"
          fill="none"
          stroke-width="2"
        />
        {[1, 2, 3].map((i) => (
          <g>
            <circle
              cx={29 + i * 31}
              cy={78 - i * 16.6}
              r="5"
              fill="currentColor"
            />
            <path
              d={`M${29 + i * 31} 78v${-i * 16.6}`}
              stroke="currentColor"
              opacity=".3"
            />
          </g>
        ))}
        <text x="110" y="94" font-size="12" fill="currentColor">
          kétszer → kétszer
        </text>
      </svg>
    );
  if (topic === "mertekegysegek")
    return (
      <svg {...common}>
        {Array.from({ length: 16 }, (_, i) => (
          <rect
            x={32 + (i % 4) * 15}
            y={19 + Math.floor(i / 4) * 15}
            width="13"
            height="13"
            fill="currentColor"
            opacity={i < 4 ? ".8" : ".3"}
          />
        ))}
        <path
          d="M111 67V32l24-14 24 14v35l-24 14-24-14 24-14 24 14M111 32l24 14 24-14M135 46v35"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
        />
        <text
          x="57"
          y="95"
          font-size="13"
          text-anchor="middle"
          fill="currentColor"
        >
          cm²
        </text>
        <text
          x="135"
          y="95"
          font-size="13"
          text-anchor="middle"
          fill="currentColor"
        >
          cm³
        </text>
      </svg>
    );
  if (topic === "tortek")
    return (
      <svg {...common}>
        <g stroke="currentColor" stroke-width="1.4">
          {[0, 1, 2, 3].map((i) => (
            <rect
              x={24 + i * 33}
              y="22"
              width="29"
              height="24"
              rx="3"
              fill={i < 3 ? "currentColor" : "none"}
              opacity={i < 3 ? ".85" : ".4"}
            />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect
              x={24 + i * 22}
              y="57"
              width="19"
              height="19"
              rx="2"
              fill={i < 3 ? "currentColor" : "none"}
              opacity={i < 3 ? ".35" : ".4"}
            />
          ))}
        </g>
      </svg>
    );
  if (topic === "szazalek")
    return (
      <svg {...common}>
        {Array.from({ length: 20 }, (_, i) => (
          <rect
            x={32 + (i % 5) * 24}
            y={10 + Math.floor(i / 5) * 21}
            width="17"
            height="15"
            rx="3"
            fill="currentColor"
            opacity={i < 15 ? ".85" : ".17"}
          />
        ))}
      </svg>
    );
  if (topic === "egyenlet")
    return (
      <svg {...common}>
        <g stroke="currentColor" stroke-width="2" fill="none">
          <path d="M90 22v57m-25 2h50M30 34h120M43 34l-16 29h32Zm94 0-16 29h32Z" />
          <circle cx="90" cy="29" r="5" fill="currentColor" />
        </g>
        <text
          x="43"
          y="55"
          text-anchor="middle"
          font-size="16"
          font-weight="700"
        >
          x
        </text>
        <text
          x="137"
          y="55"
          text-anchor="middle"
          font-size="16"
          font-weight="700"
        >
          5
        </text>
      </svg>
    );
  if (topic === "grafikon")
    return (
      <svg {...common}>
        <g stroke="currentColor" fill="none">
          <path d="M30 12v70h125" stroke-width="2" />
          <path d="M30 58 62 48 94 38 126 28" stroke-width="3" />
          <path
            d="M62 15v67M94 15v67M126 15v67M30 28h125M30 48h125M30 68h125"
            opacity=".15"
          />
        </g>
        {[0, 1, 2, 3].map((i) => (
          <circle cx={30 + 32 * i} cy={58 - 10 * i} r="4" fill="currentColor" />
        ))}
      </svg>
    );
  if (topic === "pitagorasz")
    return (
      <svg {...common}>
        <path
          d="M35 76h80V16Z"
          fill="currentColor"
          fillOpacity=".1"
          stroke="currentColor"
          stroke-width="2.5"
        />
        <path d="M103 76V64h12" fill="none" stroke="currentColor" />
        <text x="72" y="94" font-size="16">
          4
        </text>
        <text x="122" y="50" font-size="16">
          3
        </text>
        <text x="64" y="40" font-size="16">
          5
        </text>
      </svg>
    );
  return (
    <svg {...common}>
      <g fill="none" stroke="currentColor" stroke-width="2">
        <rect
          x="28"
          y="24"
          width="52"
          height="52"
          rx="10"
          transform="rotate(-10 54 50)"
        />
        <rect
          x="101"
          y="24"
          width="52"
          height="52"
          rx="10"
          transform="rotate(10 127 50)"
        />
      </g>
      {[
        [40, 38],
        [54, 50],
        [68, 62],
        [115, 38],
        [139, 38],
        [115, 62],
        [139, 62],
      ].map(([x, y]) => (
        <circle cx={x} cy={y} r="3.5" fill="currentColor" />
      ))}
    </svg>
  );
}

function App() {
  const [initial] = useState(() => {
    try {
      return loadProfile(window.localStorage);
    } catch {
      return {
        profile: emptyProfile(),
        problem:
          "Ebben a böngészőben a tartós helyi mentés nem érhető el. A haladást fájlba mentheted.",
      };
    }
  });
  const [profile, setProfile] = useState<Profile>(initial.profile);
  const [storageProblem, setStorageProblem] = useState(initial.problem);
  const [guest, setGuest] = useState(false);
  const [savedProfile, setSavedProfile] = useState<Profile | null>(null);
  const [route, setRoute] = useState(getRoute);
  const change: Change = (fn) =>
    setProfile((before) => {
      const next = {
        ...fn(before),
        appVersion: VERSION,
        updatedAt: new Date().toISOString(),
      };
      if (Object.keys(next.attempts).length > MAX_ATTEMPTS) {
        setStorageProblem(
          "A haladásnapló elérte a 10 000 feladatot. Az eddigi munkád megmaradt. Töltsd le a mentést; ezután a Beállításokban indíthatsz üres haladást az új feladatokhoz.",
        );
        return before;
      }
      if (!guest && !initial.problem) {
        try {
          const error = saveProfile(next, window.localStorage);
          setStorageProblem(error);
        } catch {
          setStorageProblem(
            "A helyi mentés nem érhető el. Töltsd le a haladásodat a Beállításokban.",
          );
        }
      }
      return next;
    });
  useEffect(() => {
    const onHash = () => {
      setRoute(getRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("calm", profile.settings.calm);
    document.documentElement.classList.toggle(
      "large-text",
      profile.settings.largeText,
    );
  }, [profile.settings]);
  const page = route[0] || "felfedezes";
  const lesson = byId(route[1]);
  const nav = [
    ["felfedezes", "home", "Felfedezés"],
    ["tematerkep", "map", "Tématérkép"],
    ["gyakorlas", "spark", "Gyakorló"],
    ["haladas", "chart", "Haladás"],
  ];
  function toggleGuest() {
    if (!guest) {
      setSavedProfile(profile);
      setProfile(emptyProfile());
      setGuest(true);
    } else {
      setProfile(savedProfile || initial.profile);
      setGuest(false);
      setSavedProfile(null);
    }
    navigate("felfedezes");
  }
  function installProfile(next: Profile) {
    if (!guest) {
      const error = saveProfile(next, window.localStorage);
      if (error) {
        setStorageProblem(error);
        throw new Error(error);
      }
      initial.problem = "";
      setStorageProblem("");
    }
    setProfile(next);
  }
  return (
    <div class="app-shell">
      <a
        class="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main-content")?.focus();
        }}
      >
        Ugrás a tartalomhoz
      </a>
      <aside class="sidebar" aria-label="Fő navigáció">
        <a class="brand" href="#felfedezes">
          <span class="brand-mark">
            m<span>8</span>
            <i />
          </span>
          <span>
            Matek8<small>Értsd is!</small>
          </span>
        </a>
        <div class="sidebar-caption">A TE MATEKMŰHELYED</div>
        <nav>
          {nav.map(([path, icon, title]) => (
            <a
              href={`#${path}`}
              class={`nav-item ${page === path || (path === "felfedezes" && page === "lecke") || (path === "gyakorlas" && page === "javitas") ? "active" : ""}`}
              aria-current={page === path ? "page" : undefined}
            >
              <Icon name={icon} />
              <span>{title}</span>
              {page === path && <span class="nav-dot" />}
            </a>
          ))}
        </nav>
        <div class="sidebar-note">
          <span class="note-symbol">?</span>
          <strong>A „miért” jó kérdés.</strong>
          <p>Itt nyugodtan próbálkozhatsz. A hibából is van tovább.</p>
        </div>
        <a
          class={`nav-item settings-link ${page === "beallitasok" ? "active" : ""}`}
          href="#beallitasok"
          aria-label="Beállítások"
        >
          <Icon name="settings" />
          <span>Beállítások</span>
        </a>
        <div class="sidebar-bottom">
          <span class="status-dot" />
          {guest
            ? "Vendégként tanulsz"
            : storageProblem
              ? "Mentés fájlba ajánlott"
              : "Haladás ezen az eszközön"}
        </div>
      </aside>
      <div class="main-shell">
        <header class="topbar">
          <span>
            8. osztály <span class="separator">/</span> A saját tempódban
          </span>
          <a href="#beallitasok" class="topbar-status">
            <Icon name={guest ? "clock" : "lock"} size={15} />
            {guest ? "Vendégmód" : "Saját műhely"}
          </a>
        </header>
        {storageProblem && (
          <div class="storage-warning" role="status">
            {storageProblem} <a href="#beallitasok">Mentési lehetőségek</a>
          </div>
        )}
        {guest && (
          <div class="guest-banner">
            Vendégmódban dolgozol. A mostani haladás az oldal bezárásakor
            elvész.{" "}
            <button onClick={toggleGuest}>Vissza a saját haladásomhoz</button>
          </div>
        )}
        <main id="main-content" tabIndex={-1}>
          {page === "felfedezes" && <Home profile={profile} />}
          {page === "tematerkep" && <Curriculum />}
          {page === "lecke" &&
            (lesson ? (
              <LessonView
                key={lesson.id}
                lesson={lesson}
                profile={profile}
                change={change}
              />
            ) : (
              <NotFound />
            ))}
          {page === "gyakorlas" && (
            <PracticePage
              topicId={lesson?.id}
              profile={profile}
              change={change}
            />
          )}
          {page === "haladas" && <ProgressPage profile={profile} />}
          {page === "javitas" && (
            <RepairPage
              key={location.hash}
              skillId={route[1]}
              stage={route[2]}
              profile={profile}
              renderExercise={(exercise, label, kindLabel) => (
                <ExerciseCard
                  exercise={exercise}
                  profile={profile}
                  change={change}
                  label={label}
                  kindLabel={kindLabel}
                />
              )}
            />
          )}
          {page === "beallitasok" && (
            <Settings
              profile={profile}
              change={change}
              guest={guest}
              toggleGuest={toggleGuest}
              installProfile={installProfile}
              storageProblem={storageProblem}
            />
          )}
          {page === "nyomtatas" &&
            (lesson ? <PrintLesson lesson={lesson} /> : <NotFound />)}
          {![
            "felfedezes",
            "tematerkep",
            "lecke",
            "gyakorlas",
            "haladas",
            "javitas",
            "beallitasok",
            "nyomtatas",
          ].includes(page) && <NotFound />}
        </main>
        <footer class="site-footer">
          <span>Matek8 · Értsd is!</span>
          <span>Egy jó kérdéssel kezdődik.</span>
          <a href="#beallitasok">Súgó és adatok</a>
        </footer>
      </div>
    </div>
  );
}

function Home({ profile }: { profile: Profile }) {
  const [query, setQuery] = useState("");
  const [quarters, setQuarters] = useState(3);
  const matches = lessons.filter((l) =>
    (
      l.title +
      " " +
      l.description +
      " " +
      l.glossary.map((t) => t.term).join(" ")
    )
      .toLocaleLowerCase("hu")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .includes(
        query
          .toLocaleLowerCase("hu")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, ""),
      ),
  );
  const last = byId(profile.lastTopic);
  const attempts = knowledgeAttempts(profile);
  const independent = attempts.filter(([, a]) => a.independent).length;
  return (
    <div class="page home-page">
      <section class="hero">
        <div class="hero-copy">
          <span class="eyebrow">
            <span />
            MATEMATIKA, AMI ÖSSZEÁLL
          </span>
          <h1>
            Van benne
            <br />
            <em>logika.</em>
          </h1>
          <p>
            Fedezd fel, mi miért működik.
            <br />
            Mozgasd, próbáld ki, aztán oldd meg magad.
          </p>
          <div class="hero-actions">
            <Button onClick={() => navigate(`lecke/${last?.id || TOPICS[0]}`)}>
              {last ? "Folytatom a leckét" : "Kezdjük az alapokkal"}
              <Icon name="arrow" />
            </Button>
            <a class="text-link" href="#tematerkep">
              Megnézem a témákat
            </a>
          </div>
          <div class="hero-meta">
            <span>
              <Icon name="check" size={15} />
              Lépésről lépésre
            </span>
            <span>
              <Icon name="check" size={15} />A saját tempódban
            </span>
          </div>
        </div>
        <div class="hero-lab">
          <div class="mini-label">
            <span class="live-dot" />
            EGY KIS FELFEDEZÉS <span>TÖRTEK</span>
          </div>
          <h2>
            Ugyanaz az egész.
            <br />
            Másképp felosztva.
          </h2>
          <div class="hero-fraction">
            <span>
              {quarters}
              <i />4
            </span>
            <span class="equals">=</span>
            <span>
              {quarters * 25}
              <small>%</small>
            </span>
          </div>
          <div
            class="quarter-grid"
            role="img"
            aria-label={`Az egész ${quarters} negyede színezett`}
          >
            {[1, 2, 3, 4].map((n) => (
              <span class={n <= quarters ? "filled" : ""}>
                {n === quarters ? <Icon name="spark" size={22} /> : null}
              </span>
            ))}
          </div>
          <label class="mini-range-label" for="hero-range">
            Változtasd a kijelölt részt <span>↔</span>
          </label>
          <input
            id="hero-range"
            type="range"
            min="0"
            max="4"
            value={quarters}
            onInput={(e) => setQuarters(Number(e.currentTarget.value))}
          />
          <p class="mini-foot">A rész változik. Az egész mérete marad.</p>
          <span class="hero-deco" aria-hidden="true">
            ×
          </span>
        </div>
      </section>
      <section class="learning-strip" aria-label="A műhely röviden">
        <div>
          <strong>{stats.lessons}</strong>
          <span>bejárható tanulási út</span>
        </div>
        <div>
          <strong>{stats.practice + stats.exit}</strong>
          <span>magyarázott alapfeladat</span>
        </div>
        <div>
          <strong>{independent || stats.generatorFamilies}</strong>
          <span>
            {independent ? "önálló megoldásod" : "generálható feladatcsalád"}
          </span>
        </div>
        <a href="#gyakorlas">
          Csak gyakorolnék
          <Icon name="arrow" />
        </a>
      </section>
      <LearningPanel profile={profile} compact />
      <section class="topics-section">
        <div class="section-heading">
          <div>
            <span class="eyebrow">VÁLASSZ EGY JÓ KÉRDÉST</span>
            <h2>Mire jöjjünk rá ma?</h2>
          </div>
          <label class="search">
            <Icon name="search" size={19} />
            <input
              aria-label="Keresés a témák között"
              placeholder="Téma vagy fogalom keresése"
              value={query}
              onInput={(e) => setQuery(e.currentTarget.value)}
            />
          </label>
        </div>
        <div class="topic-grid">
          {matches.map((l, i) => (
            <a
              href={`#lecke/${l.id}`}
              class="topic-card"
              style={{ "--topic-color": l.color } as any}
            >
              <div class="topic-card-art">
                <span class="topic-number">
                  {String(lessons.indexOf(l) + 1).padStart(2, "0")}
                </span>
                <TopicArt topic={l.id} />
                <span class="topic-arrow">
                  <Icon name="arrow" size={19} />
                </span>
              </div>
              <div class="topic-card-body">
                <div class="topic-meta">
                  <span>
                    {l.layer === "ALAP"
                      ? "Biztos alapok"
                      : "Kapcsolatok és alkalmazás"}
                  </span>
                  {completed(l, profile) && (
                    <span class="done-small">
                      <Icon name="check" size={13} />
                      Próba kész
                    </span>
                  )}
                </div>
                <h3>{l.shortTitle}</h3>
                <p>{l.teaser}</p>
                <div class="topic-bottom">
                  <span>
                    <Icon name="clock" size={14} />
                    {l.estimateMinutes} perc · szakaszolható
                  </span>
                  <span>
                    {l.practice.length + l.exit.length} feladat + műhely
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
        {matches.length === 0 && (
          <div class="empty-state">
            <h3>Erre még nincs találat a megnyitható utakban.</h3>
            <p>Próbáld például: tört, egyenlet, alapdíj vagy kocka.</p>
            <a href="#tematerkep">A teljes tématérkép</a>
          </div>
        )}
      </section>
      <section class="why-strip">
        <Icon name="bulb" size={30} />
        <div>
          <h3>Nem áll össze valamelyik lépés?</h3>
          <p>
            Minden gyakorlófeladat mellett van kapaszkodó. Előbb egy kérdés,
            majd egy részlépés, végül a teljes indoklás.
          </p>
        </div>
        <a href="#gyakorlas">
          Mutass egy feladatot <Icon name="arrow" />
        </a>
      </section>
    </div>
  );
}

function ScalarInput({
  spec,
  value,
  setValue,
  id,
  label = "A válaszod",
}: {
  spec: ScalarAnswerSpec;
  value: string;
  setValue: (value: string) => void;
  id: string;
  label?: string;
}) {
  if (spec.kind === "choice")
    return (
      <fieldset class="choice-list">
        <legend class="sr-only">{label}</legend>
        {spec.options.map((option) => (
          <label class={`choice ${value === option.id ? "selected" : ""}`}>
            <input
              type="radio"
              name={id}
              value={option.id}
              checked={value === option.id}
              onChange={() => setValue(option.id)}
            />
            <span>{option.text}</span>
          </label>
        ))}
      </fieldset>
    );
  const number = spec.kind === "number" ? spec : undefined;
  return (
    <div class="number-answer">
      <label for={`answer-${id}`}>
        {label}
        {number?.unit ? ` (${number.unit})` : ""}
      </label>
      <div class="input-with-unit">
        {number?.variable && <span>{number.variable} =</span>}
        <input
          id={`answer-${id}`}
          type="text"
          inputMode="text"
          autoComplete="off"
          spellcheck={false}
          maxLength={180}
          value={value}
          placeholder={
            spec.kind === "expression"
              ? "Írd ide a kifejezést zárójelekkel"
              : "Írd ide a számot vagy törtet"
          }
          onInput={(event) => setValue(event.currentTarget.value)}
          aria-describedby={`answer-help-${id}`}
        />
        {number?.unit && <span>{number.unit}</span>}
      </div>
      <small id={`answer-help-${id}`}>
        {spec.kind === "expression"
          ? "A zárójelek számítanak. Használhatsz ×, · vagy * szorzásjelet, : vagy / osztásjelet."
          : `Például: 12, 0,75 vagy 3/4.${number?.requireSimplified ? " Egyszerűsített alakot kérünk." : ""}`}
      </small>
    </div>
  );
}

function PaperAnswerFields({ answer }: { answer: AnswerSpec }) {
  if (answer.kind === "parts")
    return (
      <ol class="paper-parts">
        {answer.parts.map((part) => (
          <li>
            <strong>{part.label}</strong>
            <PaperAnswerFields answer={part.answer} />
          </li>
        ))}
      </ol>
    );
  if (answer.kind === "choice")
    return (
      <ol type="a">
        {answer.options.map((option) => (
          <li>{option.text}</li>
        ))}
      </ol>
    );
  return (
    <div class="paper-response">
      Válasz: ____________________ {answer.kind === "number" && answer.unit}
    </div>
  );
}

function ExerciseCard({
  exercise,
  profile,
  change,
  label = "Próbáld meg önállóan",
  kindLabel,
}: {
  exercise: Exercise;
  profile: Profile;
  change: Change;
  label?: string;
  kindLabel?: string;
}) {
  const attempt = profile.attempts[exercise.id] || emptyAttempt(exercise.topic);
  const [reflection, setReflection] = useState(attempt.reflection ?? "");
  const [saveReflection, setSaveReflection] = useState(
    attempt.reflection !== undefined,
  );
  useEffect(() => {
    setReflection(attempt.reflection ?? "");
    setSaveReflection(attempt.reflection !== undefined);
  }, [exercise.id]);
  const responses =
    exercise.answer.kind === "parts"
      ? (decodePartResponses(attempt.input) ?? {})
      : {};

  function update(fn: (a: Attempt) => Attempt) {
    change((p) => ({
      ...p,
      attempts: {
        ...p.attempts,
        [exercise.id]: {
          ...fn(p.attempts[exercise.id] || emptyAttempt(exercise.topic)),
          updatedAt: new Date().toISOString(),
        },
      },
    }));
  }
  function check() {
    change((p) => {
      const before = p.attempts[exercise.id] || emptyAttempt(exercise.topic);
      const result = gradeAnswer(exercise, before.input);
      const at = new Date().toISOString();
      const learned = recordLearningGrade(p, exercise, before, result, at);
      return {
        ...learned,
        attempts: {
          ...p.attempts,
          [exercise.id]: { ...recordGrade(before, result), updatedAt: at },
        },
      };
    });
  }
  const repairTargets = [
    ...new Set(
      getSkillTargets(exercise)
        .filter((target) => {
          const result = target.partId
            ? attempt.result?.parts?.find((part) => part.id === target.partId)
                ?.result
            : attempt.result;
          return result && !result.correct && result.status !== "invalid";
        })
        .map((target) => target.skillId),
    ),
  ];
  return (
    <article class="exercise-card" key={exercise.id}>
      <div class="exercise-top">
        <span class="eyebrow">{label}</span>
        <span class="exercise-kind">
          {kindLabel ??
            (exercise.kind === "reason"
              ? "Gondolkodj és indokolj"
              : exercise.kind === "transfer"
                ? "Új helyzet"
                : "Számolj és ellenőrizz")}
        </span>
      </div>
      {exercise.context && <p class="exercise-context">{exercise.context}</p>}
      <h3 class="exercise-prompt">{exercise.prompt}</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          check();
        }}
      >
        {exercise.answer.kind === "parts" ? (
          <div class="multi-answer">
            <p class="parts-instruction">
              Minden részhez külön választ adj. A visszajelzés megmutatja,
              melyik részen érdemes tovább gondolkodnod.
            </p>
            {exercise.answer.parts.map((part, index) => (
              <fieldset class="answer-part" data-part={part.id}>
                <legend>
                  {index + 1}. {part.label}
                </legend>
                <ScalarInput
                  spec={part.answer}
                  id={`${exercise.id}-${part.id}`}
                  label={part.label}
                  value={responses[part.id] ?? ""}
                  setValue={(input) =>
                    update((a) => ({
                      ...a,
                      input: encodePartResponses({
                        ...decodePartResponses(a.input),
                        [part.id]: input,
                      }),
                      result: undefined,
                    }))
                  }
                />
                {attempt.result?.parts?.find(
                  (result) => result.id === part.id,
                ) && (
                  <p
                    class={`part-feedback ${attempt.result.parts.find((result) => result.id === part.id)?.result.correct ? "correct" : "retry"}`}
                  >
                    {attempt.result.parts.find(
                      (result) => result.id === part.id,
                    )?.result.correct
                      ? "✓ "
                      : "↻ "}
                    {
                      attempt.result.parts.find(
                        (result) => result.id === part.id,
                      )?.result.message
                    }
                  </p>
                )}
              </fieldset>
            ))}
          </div>
        ) : (
          <ScalarInput
            spec={exercise.answer}
            id={exercise.id}
            value={attempt.input}
            setValue={(input) =>
              update((a) => ({ ...a, input, result: undefined }))
            }
          />
        )}
        {exercise.reflection && (
          <section class="own-reasoning" aria-label="Saját indoklás">
            <label for={`reflection-${exercise.id}`}>
              <strong>{exercise.reflection.prompt}</strong>
            </label>
            <textarea
              id={`reflection-${exercise.id}`}
              value={reflection}
              maxLength={2000}
              rows={3}
              onInput={(event) => {
                const value = event.currentTarget.value;
                setReflection(value);
                if (saveReflection)
                  update((a) => ({ ...a, reflection: value }));
              }}
              placeholder="Fogalmazd meg a saját szavaiddal."
            />
            <p class="muted">
              Ezt az indoklást nem minősíti automatikusan a gép. A számválasz
              ellenőrzése után vesd össze a szempontokkal, vagy beszéljétek meg
              egy segítővel.
            </p>
            <label class="reflection-save">
              <input
                type="checkbox"
                checked={saveReflection}
                onChange={(event) => {
                  const save = event.currentTarget.checked;
                  setSaveReflection(save);
                  update((a) => {
                    const { reflection: oldReflection, ...rest } = a;
                    return save ? { ...rest, reflection } : rest;
                  });
                }}
              />
              Az indoklásomat is mentse a haladásba ezen az eszközön
              (vendégmódban csak az oldal bezárásáig).
            </label>
            <details
              onToggle={(event) => {
                if (event.currentTarget.open)
                  update((a) => ({ ...a, assisted: true }));
              }}
            >
              <summary>Szempontok az indokláshoz – segítség</summary>
              <ul>
                {exercise.reflection.checkpoints.map((point) => (
                  <li>{point}</li>
                ))}
              </ul>
            </details>
          </section>
        )}
        <div class="exercise-actions">
          <Button type="submit">
            Ellenőrzöm
            <Icon name="check" size={18} />
          </Button>
          {attempt.independent && (
            <span class="success-meta">Korábban önállóan megoldottad.</span>
          )}
        </div>
      </form>
      {attempt.result && (
        <div
          class={`answer-feedback ${attempt.result.correct ? "correct" : "retry"}`}
          role="status"
        >
          <Icon name={attempt.result.correct ? "check" : "bulb"} />
          <div>
            <strong>
              {attempt.result.correct
                ? "Helyes válasz."
                : attempt.result.status === "invalid"
                  ? "Nézzük a beírást."
                  : attempt.result.status === "form"
                    ? "Az érték már jó."
                    : "Gondold tovább."}
            </strong>
            <p>{attempt.result.message}</p>
            {attempt.result.correct && <p>{exercise.takeaway}</p>}
          </div>
        </div>
      )}
      {repairTargets.length > 0 && (
        <div class="repair-suggestion">
          <strong>Ezt a gondolatot külön is begyakorolhatod.</strong>
          <p>
            A javító út rövid magyarázatot és új feladatot ad. Ide is
            visszatérhetsz.
          </p>
          <a
            class="text-link"
            href={`#javitas/${repairTargets[0]}?vissza=${encodeURIComponent(location.hash.slice(1))}`}
          >
            Megnézem a javító gyakorlást <Icon name="arrow" size={16} />
          </a>
        </div>
      )}
      <div class="help-row">
        <button
          class="text-button"
          onClick={() =>
            update((a) => ({
              ...a,
              hintLevel: Math.min(exercise.hints.length, a.hintLevel + 1),
              assisted: true,
            }))
          }
          disabled={attempt.hintLevel >= exercise.hints.length}
        >
          <Icon name="bulb" size={18} />
          {attempt.hintLevel ? "Következő kapaszkodó" : "Kérek egy kapaszkodót"}
        </button>
        <button
          class="text-button muted"
          onClick={() =>
            update((a) => ({ ...a, revealed: !a.revealed, assisted: true }))
          }
        >
          {attempt.revealed ? "Megoldás összecsukása" : "Teljes magyarázat"}
        </button>
      </div>
      {attempt.hintLevel > 0 && (
        <div class="hints">
          {exercise.hints.slice(0, attempt.hintLevel).map((hint, i) => (
            <div>
              <span>{i + 1}</span>
              <p>{hint}</p>
            </div>
          ))}
          <small>
            Ezt a feladatot segített gyakorlásként jelöljük. Új feladaton
            önállóan is kipróbálhatod.
          </small>
        </div>
      )}
      {attempt.revealed && (
        <div class="solution">
          <h4>Így áll össze a megoldás</h4>
          <ol>
            {exercise.solution.map((s) => (
              <li>
                <strong class="math-expression">{s.expression}</strong>
                <p>{s.why}</p>
              </li>
            ))}
          </ol>
          <p class="takeaway">
            <Icon name="bulb" size={18} />
            {exercise.takeaway}
          </p>
        </div>
      )}
      <details class="exercise-id">
        <summary>Feladat azonosítója</summary>
        <code>{exercise.id}</code>
      </details>
    </article>
  );
}

function Example({
  example,
  shown,
  setShown,
}: {
  example: WorkedExample;
  shown: number;
  setShown: (n: number) => void;
}) {
  return (
    <article class="worked-example">
      <span class="eyebrow">KIDOLGOZOTT PÉLDA</span>
      <h3>{example.title}</h3>
      <p class="example-question">{example.prompt}</p>
      <ol>
        {example.steps.slice(0, shown).map((s, i) => (
          <li>
            <span class="step-no">{i + 1}</span>
            <div>
              <strong class="math-expression">{s.expression}</strong>
              <p>{s.why}</p>
            </div>
          </li>
        ))}
      </ol>
      {shown < example.steps.length ? (
        <Button variant="secondary" onClick={() => setShown(shown + 1)}>
          Mi következik?
          <Icon name="arrow" size={18} />
        </Button>
      ) : (
        <div class="example-check">
          <Icon name="check" />
          <p>
            <strong>Ellenőrzés: </strong>
            {example.check}
          </p>
        </div>
      )}
      {example.alternative && (
        <details class="alternative">
          <summary>Megnézek egy másik utat is</summary>
          {example.alternative.map((s) => (
            <p>
              <strong class="math-expression">{s.expression}</strong>
              <br />
              {s.why}
            </p>
          ))}
        </details>
      )}
    </article>
  );
}

function LessonView({
  lesson,
  profile,
  change,
}: {
  lesson: Lesson;
  profile: Profile;
  change: Change;
}) {
  const p = profile.lessons[lesson.id];
  const current = p.step;
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const lessonParams = new URLSearchParams(location.hash.split("?")[1] || "");
  const returnTopic = lessonParams.get("vissza");
  const requestedStep = lessonParams.get("lepes");
  const repairReturn = lessonParams.get("javitas");
  const validRepairReturn =
    repairReturn &&
    repairReturn.length <= 1200 &&
    /^javitas(?:\/[a-z0-9-]+){0,2}(?:\?.*)?$/.test(repairReturn);
  const setProgress = (fn: (p: TopicProgress) => TopicProgress) =>
    change((state) => ({
      ...state,
      lastTopic: lesson.id,
      lessons: { ...state.lessons, [lesson.id]: fn(state.lessons[lesson.id]) },
    }));
  useEffect(() => {
    const targetStep =
      requestedStep && /^[0-5]$/.test(requestedStep)
        ? Number(requestedStep)
        : undefined;
    setProgress((p) => {
      const step = targetStep ?? p.step;
      return { ...p, step, visited: [...new Set([...p.visited, step])] };
    });
    if (lessonParams.has("lepes")) {
      lessonParams.delete("lepes");
      const query = lessonParams.toString();
      history.replaceState(
        null,
        "",
        `#lecke/${lesson.id}${query ? `?${query}` : ""}`,
      );
    }
  }, [lesson.id]);
  function setStep(n: number) {
    setProgress((p) => ({
      ...p,
      step: n,
      visited: [...new Set([...p.visited, n])],
    }));
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  const exit = lesson.exit.map((e, i) => {
    const source =
      p.exitRound === 0
        ? e
        : generateExercise(lesson.id, 10_000 + p.exitRound * 13 + i, i);
    return {
      ...source,
      id: `exit:${lesson.id}:${p.exitRound}:${i}`,
      learningSource: { exerciseId: source.id },
    };
  });
  const passed = exit.every((e) => profile.attempts[e.id]?.independent);
  return (
    <div class="page lesson-page">
      <div class="lesson-breadcrumb">
        <a href="#felfedezes">
          <Icon name="back" size={16} />
          Vissza a műhelyekhez
        </a>
        <button
          class="text-button"
          onClick={() => setGlossaryOpen(!glossaryOpen)}
        >
          <Icon name="book" size={16} />
          Fogalomtár
        </button>
      </div>
      {returnTopic && byId(returnTopic) && (
        <a class="return-to-lesson" href={`#lecke/${returnTopic}`}>
          Visszatérek: {byId(returnTopic)?.shortTitle}
        </a>
      )}
      {validRepairReturn && (
        <a class="return-to-lesson" href={`#${repairReturn}`}>
          ← Vissza a javító gyakorláshoz
        </a>
      )}
      <header class="lesson-heading">
        <div>
          <span class="eyebrow">
            {lesson.moduleId} ·{" "}
            {lesson.layer === "ALAP"
              ? "BIZTOS ALAPOK"
              : "KAPCSOLATOK ÉS ALKALMAZÁS"}
          </span>
          <h1>{lesson.title}</h1>
          <p>{lesson.question}</p>
        </div>
        <span class="lesson-icon" style={{ background: lesson.color }}>
          <TopicArt topic={lesson.id} />
        </span>
      </header>
      {glossaryOpen && (
        <section class="glossary">
          <h2>Fogalmak, röviden</h2>
          <dl>
            {lesson.glossary.map((g) => (
              <div>
                <dt>{g.term}</dt>
                <dd>{g.definition}</dd>
              </div>
            ))}
          </dl>
          <button class="text-button" onClick={() => setGlossaryOpen(false)}>
            Becsukom a fogalomtárat
          </button>
        </section>
      )}
      <nav class="lesson-steps" aria-label="Lecke lépései">
        {steps.map((label, i) => (
          <button
            class={`${current === i ? "current" : ""} ${p.visited.includes(i) ? "visited" : ""}`}
            aria-current={current === i ? "step" : undefined}
            onClick={() => setStep(i)}
          >
            <span>{i + 1}</span>
            {label}
          </button>
        ))}
      </nav>
      <div class="lesson-content">
        {current === 0 && (
          <>
            <div class="intro-grid">
              <div class="intro-card">
                <h2>Mire fogsz rájönni?</h2>
                <ul class="check-list">
                  {lesson.goals.map((g) => (
                    <li>
                      <Icon name="check" size={17} />
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
              <div class="prerequisite">
                <Icon name="book" size={22} />
                <h3>Amire építünk</h3>
                <ul>
                  {lesson.prerequisites.map((g) => (
                    <li>{g}</li>
                  ))}
                </ul>
                <p>
                  Ha elakadsz, a fogalomtár és a kapaszkodók végig elérhetők.
                </p>
                {prerequisitesFor(lesson).map((id) => (
                  <a
                    class="prerequisite-link"
                    href={`#lecke/${id}?vissza=${lesson.id}`}
                  >
                    {byId(id)?.shortTitle} – rövid visszalépés
                  </a>
                ))}
              </div>
            </div>
            <ExerciseCard
              exercise={lesson.prediction}
              profile={profile}
              change={change}
              label="ELŐSZÖR CSAK JÓSOLJ"
            />
          </>
        )}
        {current === 1 && (
          <>
            <div class="stage-intro">
              <span class="eyebrow">MOZDÍTSD MEG AZ ÖTLETET</span>
              <h2>Mi változik, és mi marad?</h2>
              <p>
                Állíts át egyetlen dolgot. Előbb mondd meg, mire számítasz, majd
                figyeld meg az eredményt.
              </p>
            </div>
            <Lab
              topic={lesson.id}
              value={
                Object.keys(p.lab).length ? p.lab : initialLabState(lesson.id)
              }
              onChange={(lab) => setProgress((p) => ({ ...p, lab }))}
            />
            <div class="reflection">
              <Icon name="bulb" />
              <p>
                <strong>Egy mondat magadnak:</strong> „Amikor … változtattam, …
                történt, mert …”. Ezt nem pontozza gép; a következő rész segít
                ellenőrizni a magyarázatodat.
              </p>
            </div>
          </>
        )}
        {current === 2 && (
          <>
            <div class="stage-intro">
              <span class="eyebrow">A KAPCSOLAT A LÉNYEG</span>
              <h2>Most tegyük össze.</h2>
            </div>
            <div class="explanation-list">
              {lesson.explanation.map((part, i) => (
                <section>
                  <span class="explanation-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{part.heading}</h3>
                    <p>{part.body}</p>
                    {part.formula && (
                      <div class="formula-box">{part.formula}</div>
                    )}
                    {part.bullets && (
                      <ul>
                        {part.bullets.map((b) => (
                          <li>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}
        {current === 3 && (
          <>
            <div class="stage-intro">
              <span class="eyebrow">MINDEN LÉPÉSNEK OKA VAN</span>
              <h2>Kövesd a gondolatmenetet.</h2>
              <p>
                Mielőtt megnyitod a következő lépést, gondold végig, te mit
                tennél.
              </p>
            </div>
            {lesson.examples.map((e, i) => (
              <Example
                example={e}
                shown={p.exampleSteps[i] || 1}
                setShown={(n) =>
                  setProgress((p) => ({
                    ...p,
                    exampleSteps: p.exampleSteps.map((v, j) =>
                      j === i ? n : v,
                    ),
                  }))
                }
              />
            ))}
          </>
        )}
        {current === 4 && (
          <TopicPractice lesson={lesson} profile={profile} change={change} />
        )}
        {current === 5 && (
          <>
            <div class="stage-intro">
              <span class="eyebrow">ÚJ HELYZET, SAJÁT GONDOLAT</span>
              <h2>Próbáld ki, mi állt össze.</h2>
              <p>
                Két feladat, lehetőleg segítség nélkül. Ha kapaszkodóra van
                szükséged, használd nyugodtan, utána kérhetsz új önálló próbát.
              </p>
            </div>
            {exit.map((e, i) => (
              <ExerciseCard
                key={e.id}
                exercise={e}
                profile={profile}
                change={change}
                label={`${i + 1}. ÖNÁLLÓ FELADAT`}
              />
            ))}
            <div class="exit-actions">
              <Button
                variant="secondary"
                onClick={() =>
                  setProgress((p) => ({ ...p, exitRound: p.exitRound + 1 }))
                }
              >
                <Icon name="refresh" />
                Új önálló próba
              </Button>
              <a href={`#nyomtatas/${lesson.id}`} class="text-link">
                <Icon name="print" size={18} />
                Feladatlap papírra
              </a>
            </div>
            {passed && (
              <div class="completion-box">
                <span class="completion-icon">
                  <Icon name="check" size={30} />
                </span>
                <div>
                  <h2>Ez a próba önállóan sikerült.</h2>
                  <p>
                    Később érdemes új feladaton is visszatérni rá. A Haladás
                    oldalon külön látod, mit oldottál meg segítséggel.
                  </p>
                  {lesson.nextTopic && (
                    <Button
                      onClick={() => navigate(`lecke/${lesson.nextTopic}`)}
                    >
                      Jöhet a következő téma
                      <Icon name="arrow" />
                    </Button>
                  )}
                </div>
              </div>
            )}
            <section class="recap">
              <h3>Amit érdemes magaddal vinni</h3>
              <ul>
                {lesson.recap.map((r) => (
                  <li>{r}</li>
                ))}
              </ul>
            </section>
          </>
        )}
      </div>
      <div class="lesson-bottom-nav">
        <Button
          variant="ghost"
          onClick={() => setStep(current - 1)}
          disabled={current === 0}
        >
          <Icon name="back" />
          Előző rész
        </Button>
        <span>{current + 1} / 6</span>
        {current < 5 ? (
          <Button onClick={() => setStep(current + 1)}>
            {steps[current + 1]}
            <Icon name="arrow" />
          </Button>
        ) : (
          <Button onClick={() => navigate("haladas")}>
            Megnézem a haladást
            <Icon name="arrow" />
          </Button>
        )}
      </div>
    </div>
  );
}

function TopicPractice({
  lesson,
  profile,
  change,
}: {
  lesson: Lesson;
  profile: Profile;
  change: Change;
}) {
  const p = profile.lessons[lesson.id];
  const set = (patch: Partial<TopicProgress>) =>
    change((state) => ({
      ...state,
      lastTopic: lesson.id,
      lessons: {
        ...state.lessons,
        [lesson.id]: { ...state.lessons[lesson.id], ...patch },
      },
    }));
  const exercise = p.generatedMode
    ? generateExercise(
        lesson.id,
        p.generatedSeed,
        (p.generatedSeed - 1) % familiesFor(lesson.id).length,
      )
    : lesson.practice[p.practiceIndex % lesson.practice.length];
  return (
    <section class="practice-section">
      <div class="stage-intro">
        <span class="eyebrow">PRÓBÁLKOZNI ÉR</span>
        <h2>Most te következel.</h2>
        <p>Változatos alapfeladatok, aztán új példák ugyanarra a gondolatra.</p>
      </div>
      <div class="practice-toolbar">
        <div class="segmented">
          <button
            class={!p.generatedMode ? "selected" : ""}
            onClick={() => set({ generatedMode: false })}
          >
            Alapfeladatok · {lesson.practice.length}
          </button>
          <button
            class={p.generatedMode ? "selected" : ""}
            onClick={() => set({ generatedMode: true })}
          >
            Új példák
          </button>
        </div>
        {p.generatedMode ? (
          <span class="muted">
            {familiesFor(lesson.id).length} feladatcsalád váltakozik
          </span>
        ) : (
          <div class="exercise-dots" aria-label="Feladat választása">
            {lesson.practice.map((e, i) => (
              <button
                class={`${p.practiceIndex === i ? "selected" : ""} ${profile.attempts[e.id]?.success ? "solved" : ""}`}
                aria-label={`${i + 1}. feladat`}
                aria-current={p.practiceIndex === i ? "true" : undefined}
                onClick={() => set({ practiceIndex: i })}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <ExerciseCard
        key={exercise.id}
        exercise={exercise}
        profile={profile}
        change={change}
      />
      <div class="practice-next">
        {!p.generatedMode && (
          <Button
            variant="ghost"
            disabled={p.practiceIndex === 0}
            onClick={() =>
              set({ practiceIndex: Math.max(0, p.practiceIndex - 1) })
            }
          >
            <Icon name="back" />
            Előző feladat
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={() =>
            p.generatedMode
              ? set({ generatedSeed: p.generatedSeed + 1 })
              : set({
                  practiceIndex: (p.practiceIndex + 1) % lesson.practice.length,
                })
          }
        >
          {p.generatedMode
            ? "Új feladatot kérek"
            : p.practiceIndex === lesson.practice.length - 1
              ? "Vissza az elsőhöz"
              : "Következő feladat"}
          <Icon name="arrow" />
        </Button>
      </div>
    </section>
  );
}

function PracticePage({
  topicId,
  profile,
  change,
}: {
  topicId?: TopicId;
  profile: Profile;
  change: Change;
}) {
  const selected = byId(topicId);
  const mixedTopics =
    profile.legacyReviewSeed === profile.reviewSeed
      ? profile.legacyReviewSchema === 2
        ? V2_TOPICS
        : LEGACY_TOPICS
      : TOPICS;
  const topic = mixedTopics[(profile.reviewSeed - 1) % mixedTopics.length];
  const exercise = generateExercise(
    topic,
    50_000 + profile.reviewSeed,
    Math.floor((profile.reviewSeed - 1) / mixedTopics.length) %
      familiesFor(topic).length,
  );
  return (
    <div class="page practice-page">
      <div class="page-heading">
        <span class="eyebrow">EGY KIS GYAKORLÁS MINDIG BELEFÉR</span>
        <h1>Próbáld meg magad.</h1>
        <p>Válassz témát, vagy keverd a már tanultakat. Időmérő nélkül.</p>
      </div>
      <LearningPanel profile={profile} compact />
      <nav class="topic-pills" aria-label="Gyakorlás témája">
        <a href="#gyakorlas" class={!selected ? "selected" : ""}>
          Vegyes műhely
        </a>
        {lessons.map((l) => (
          <a
            href={`#gyakorlas/${l.id}`}
            class={selected?.id === l.id ? "selected" : ""}
          >
            {l.shortTitle}
          </a>
        ))}
      </nav>
      {selected ? (
        <TopicPractice lesson={selected} profile={profile} change={change} />
      ) : (
        <>
          <div class="mix-context">
            <span class="pill" style={{ background: byId(topic)?.color }}>
              {byId(topic)?.shortTitle}
            </span>
            <a href={`#lecke/${topic}`}>
              Előbb megérteném ezt a témát <Icon name="arrow" size={17} />
            </a>
          </div>
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            profile={profile}
            change={change}
            label="VEGYES GYAKORLÁS"
          />
          <div class="practice-next">
            <Button
              variant="secondary"
              onClick={() =>
                change((p) => {
                  const { legacyReviewSeed, legacyReviewSchema, ...rest } = p;
                  return { ...rest, reviewSeed: p.reviewSeed + 1 };
                })
              }
            >
              Jöhet egy másik téma
              <Icon name="arrow" />
            </Button>
          </div>
          <p class="practice-note">
            A vegyes műhelyben a {lessons.length} megnyitható téma váltakozik.
            Ha még új valamelyik, a hozzá tartozó leckében találsz magyarázatot.
          </p>
        </>
      )}
    </div>
  );
}

function ProgressPage({ profile }: { profile: Profile }) {
  const attempts = knowledgeAttempts(profile);
  const own = attempts.filter(([, a]) => a.independent).length;
  const helped = attempts.filter(([, a]) => a.success && !a.independent).length;
  const finished = lessons.filter((l) => completed(l, profile)).length;
  return (
    <div class="page progress-page">
      <div class="page-heading">
        <span class="eyebrow">A SAJÁT UTAD</span>
        <h1>Ami már összeállt.</h1>
        <p>
          A megoldott feladatok nyomai ezen az eszközön. Ezek tanulási jelzések,
          nem osztályzatok.
        </p>
      </div>
      <div class="stat-grid">
        <div>
          <Icon name="check" />
          <strong>{own}</strong>
          <span>önálló megoldás</span>
        </div>
        <div>
          <Icon name="bulb" />
          <strong>{helped}</strong>
          <span>segítséggel vagy javítva</span>
        </div>
        <div>
          <Icon name="map" />
          <strong>
            {finished}
            <small> / {lessons.length}</small>
          </strong>
          <span>sikeres önálló próba</span>
        </div>
      </div>
      <LearningPanel profile={profile} />
      <section class="progress-list">
        {lessons.map((l) => {
          const rows = attempts.filter(([, a]) => a.topic === l.id);
          const solved = rows.filter(([, a]) => a.independent).length;
          const helped = rows.filter(
            ([, a]) => a.success && !a.independent,
          ).length;
          const visited = profile.lessons[l.id].visited.length;
          return (
            <article>
              <div class="progress-art" style={{ background: l.color }}>
                <TopicArt topic={l.id} />
              </div>
              <div class="progress-topic">
                <h2>{l.shortTitle}</h2>
                <p>
                  {visited
                    ? `${visited} / 6 rész megnyitva · ${solved} önálló · ${helped} segített megoldás`
                    : "Még előtted a felfedezés."}
                </p>
                <div
                  class="progress-track"
                  role="progressbar"
                  aria-label={`${l.shortTitle}: megnyitott leckerészek`}
                  aria-valuemin={0}
                  aria-valuemax={6}
                  aria-valuenow={visited}
                >
                  <span
                    style={{
                      width: `${(visited / 6) * 100}%`,
                      background: l.color,
                    }}
                  />
                </div>
                <small>
                  {completed(l, profile)
                    ? "Két új feladatot egy próbában önállóan megoldottál."
                    : "Az önálló próba még előtted van."}
                </small>
              </div>
              <a href={`#lecke/${l.id}`} class="button button-secondary">
                {visited ? "Folytatom" : "Elkezdem"}
                <Icon name="arrow" size={18} />
              </a>
            </article>
          );
        })}
      </section>
      <div class="reflection">
        <Icon name="clock" />
        <p>
          <strong>Holnap is menne?</strong> Ha most sikerült egy téma, néhány
          nap múlva térj vissza egy új feladathoz. A tartós tudásról ez többet
          mond, mint ugyanannak a válasznak az ismétlése.
        </p>
      </div>
      <a class="text-link" href="#beallitasok">
        <Icon name="download" size={17} />A haladásom mentése fájlba
      </a>
    </div>
  );
}

function Curriculum() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState("");
  const clean = (text: string) =>
    text
      .toLocaleLowerCase("hu")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  const filtered = curriculum.filter((m) =>
    clean(m.title + " " + m.units.join(" ")).includes(clean(query)),
  );
  const units = curriculum.flatMap((module) =>
    module.units.map((_, i) =>
      unitCoverage(`${module.id}.${String(i + 1).padStart(2, "0")}`),
    ),
  );
  const ready = units.filter((unit) => unit.status === "ready").length;
  const partial = units.filter((unit) => unit.status === "partial").length;
  return (
    <div class="page curriculum-page">
      <div class="page-heading">
        <span class="eyebrow">LÁSD AZ ÖSSZEFÜGGÉSEKET</span>
        <h1>A teljes tématérkép.</h1>
        <p>
          {curriculum.length} modul, {units.length} tervezett tanulási egység.
          Most {lessons.length} tanulási út nyitható meg.
        </p>
        <p>
          {ready} egységhez van magyarázat és ellenőrizhető gyakorlás; {partial}{" "}
          egységet részben érintenek a leckék. A teljes évfolyam még nincs kész.
        </p>
      </div>
      <label class="search wide">
        <Icon name="search" />
        <input
          aria-label="Keresés a teljes tématérképen"
          value={query}
          placeholder="Melyik fogalmat keresed?"
          onInput={(e) => setQuery(e.currentTarget.value)}
        />
      </label>
      <div class="curriculum-legend">
        <span>
          <i class="ready-dot" /> Tananyag és gyakorlás elérhető
        </span>
        <span>◐ Részben érintett</span>
        <span>
          <i class="planned-dot" /> Még készül
        </span>
      </div>
      <div class="curriculum-grid">
        {filtered.map((m) => {
          const available = lessonsForModule(m.id);
          const rows = m.units.map((title, i) => ({
            title,
            ...unitCoverage(`${m.id}.${String(i + 1).padStart(2, "0")}`),
          }));
          const count = rows.filter((row) => row.status === "ready").length;
          return (
            <article
              class={`curriculum-card ${available.length ? "available" : ""}`}
            >
              <div class="curriculum-card-top">
                <span>{m.id}</span>
                <span class={`pill ${available.length ? "ready" : "planned"}`}>
                  {available.length
                    ? `${count}/${m.units.length} egységhez tananyag és gyakorlás`
                    : "Még készül"}
                </span>
              </div>
              <h2>{m.title}</h2>
              <p>{m.question}</p>
              {available.length > 0 && (
                <div
                  class="module-lessons"
                  aria-label={`${m.title}: kapcsolódó leckék`}
                >
                  {available.map((lesson) => (
                    <a href={`#lecke/${lesson.id}`}>
                      {lesson.shortTitle} <Icon name="arrow" size={16} />
                    </a>
                  ))}
                </div>
              )}
              <div class="curriculum-card-actions">
                <button
                  class="text-button"
                  aria-expanded={open === m.id}
                  onClick={() => setOpen(open === m.id ? "" : m.id)}
                >
                  {m.units.length} tanulási egység {open === m.id ? "−" : "+"}
                </button>
              </div>
              {open === m.id && (
                <ol class="unit-list">
                  {rows.map((unit) => (
                    <li>
                      <strong>{unit.id}</strong> {unit.title}
                      <span class={`unit-status ${unit.status}`}>
                        {unit.status === "ready"
                          ? "Tananyag és gyakorlás elérhető"
                          : unit.status === "partial"
                            ? "Részben érintett; további tartalom készül"
                            : "Tervezett; még nincs kész"}
                      </span>
                      {[...unit.ready, ...unit.partial].map((lesson) => (
                        <a href={`#lecke/${lesson.id}`}>{lesson.shortTitle}</a>
                      ))}
                    </li>
                  ))}
                </ol>
              )}
            </article>
          );
        })}
      </div>
      {!filtered.length && (
        <p class="empty-state">Nincs ilyen kifejezés a tématérképen.</p>
      )}
      <div class="reflection">
        <Icon name="book" />
        <p>
          Az állapot a tananyag elérhetőségét jelzi, nem a te tudásodat és nem
          tanulókkal igazolt eredményességet. Az előismeret, a törzsanyag és a
          bővítés külön réteg; az iskolai tanmenet sorrendje eltérhet.
        </p>
      </div>
    </div>
  );
}

function Settings({
  profile,
  change,
  guest,
  toggleGuest,
  installProfile,
  storageProblem,
}: {
  profile: Profile;
  change: Change;
  guest: boolean;
  toggleGuest: () => void;
  installProfile: (p: Profile) => void;
  storageProblem: string;
}) {
  const [incoming, setIncoming] = useState<Profile | null>(null);
  const [message, setMessage] = useState("");
  const [resetConfirm, setResetConfirm] = useState(false);
  const [fileName, setFileName] = useState("");
  function download() {
    let serialized: string;
    try {
      serialized = serializeProfile(profile);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "A mentést nem sikerült elkészíteni.",
      );
      return;
    }
    const blob = new Blob([serialized], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Matek8_haladas_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    setMessage(
      "A mentési fájl letöltését elindítottam. Őrizd meg, ha másik eszközön folytatnád.",
    );
  }
  async function importFile(file?: File) {
    setIncoming(null);
    setMessage("");
    if (!file) return;
    try {
      if (file.size > MAX_IMPORT_BYTES)
        throw new Error("A mentés legfeljebb 16 MB lehet.");
      const p = parseImport(await file.text());
      setIncoming(p);
      setFileName(file.name);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "A fájl nem olvasható.");
    }
  }
  return (
    <div class="page settings-page">
      <div class="page-heading">
        <span class="eyebrow">LEGYEN KÉNYELMES</span>
        <h1>A te beállításaid.</h1>
        <p>Nem kell fiók. A saját haladásodat ezen az eszközön őrizzük.</p>
      </div>
      <section class="settings-card">
        <h2>Ahogy neked olvasható</h2>
        <label class="toggle-row">
          <span>
            <strong>Nagyobb betűk</strong>
            <small>Az egész felületen nagyobb szöveg.</small>
          </span>
          <input
            type="checkbox"
            checked={profile.settings.largeText}
            onChange={(e) =>
              change((p) => ({
                ...p,
                settings: { ...p.settings, largeText: e.currentTarget.checked },
              }))
            }
          />
        </label>
        <label class="toggle-row">
          <span>
            <strong>Nyugodt nézet</strong>
            <small>
              Kikapcsolja a felület átmeneti mozgásait. A rendszered
              mozgáscsökkentését is követjük.
            </small>
          </span>
          <input
            type="checkbox"
            checked={profile.settings.calm}
            onChange={(e) =>
              change((p) => ({
                ...p,
                settings: { ...p.settings, calm: e.currentTarget.checked },
              }))
            }
          />
        </label>
      </section>
      <section class="settings-card">
        <h2>A haladásod veled maradhat</h2>
        <p>
          A böngésző helyi adatai törölhetők. Ha fontos a haladásod, tölts le
          róla mentést; másik eszközre is átviheted.
        </p>
        {storageProblem && <p class="inline-warning">{storageProblem}</p>}
        <div class="button-row">
          <Button onClick={download}>
            <Icon name="download" />
            Haladás letöltése
          </Button>
          <label class="button button-secondary file-input">
            Mentés megnyitása
            <input
              type="file"
              accept="application/json,.json"
              aria-label="Haladásmentés megnyitása"
              onChange={(e) => {
                importFile(e.currentTarget.files?.[0]);
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>
        {incoming && (
          <div class="import-preview">
            <h3>Betöltöd ezt a mentést?</h3>
            <p>
              <strong>{fileName}</strong>
              <br />
              {new Date(incoming.updatedAt).toLocaleString("hu-HU")} ·{" "}
              {Object.values(incoming.attempts).filter((a) => a.success).length}{" "}
              megoldott feladatrekord
            </p>
            <p>
              Ez a jelenlegi {guest ? "vendégállapotot" : "helyi haladást"}{" "}
              lecseréli. A mostani állapotot előtte letöltheted.
            </p>
            <div class="button-row">
              <Button
                onClick={() => {
                  try {
                    installProfile(incoming);
                    setIncoming(null);
                    setMessage("A mentés betöltve. Folytathatod a tanulást.");
                  } catch (e) {
                    setMessage(String(e));
                  }
                }}
              >
                Ezt a mentést használom
              </Button>
              <Button variant="ghost" onClick={() => setIncoming(null)}>
                Mégsem
              </Button>
            </div>
          </div>
        )}
        {message && (
          <p role="status" class="settings-message">
            {message}
          </p>
        )}
      </section>
      <section class="settings-card">
        <h2>Közös eszközön tanultok?</h2>
        <p>
          A vendégmód külön, üres állapottal indul, és nem írja felül a saját
          haladásodat. Bezáráskor a vendégmunka elvész; fájlba mentheted.
        </p>
        <Button variant="secondary" onClick={toggleGuest}>
          {guest ? "Vissza a saját haladásomhoz" : "Vendégmód indítása"}
        </Button>
      </section>
      <section class="settings-card">
        <h2>Tiszta lap</h2>
        <p>
          Csak a Matek8 jelenlegi haladása és beállításai törlődnek ezen az
          eszközön.
        </p>
        {!resetConfirm ? (
          <Button variant="danger" onClick={() => setResetConfirm(true)}>
            Haladás törlése…
          </Button>
        ) : (
          <div class="reset-confirm">
            <strong>Biztosan üres haladással folytatod?</strong>
            <div class="button-row">
              <Button
                variant="danger"
                onClick={() => {
                  try {
                    installProfile(emptyProfile());
                    setResetConfirm(false);
                    setMessage("A Matek8 haladása üres állapotra váltott.");
                  } catch (e) {
                    setMessage(String(e));
                  }
                }}
              >
                Igen, törlöm a Matek8-haladást
              </Button>
              <Button variant="ghost" onClick={() => setResetConfirm(false)}>
                Mégsem
              </Button>
            </div>
          </div>
        )}
      </section>
      <section class="settings-card about">
        <h2>Erről a műhelyről</h2>
        <p>
          <strong>Matek8 — Értsd is!</strong> · {VERSION}
        </p>
        <p>
          {lessons.length} bejárható tanulási út, saját magyar magyarázatok és
          feladatok. A teljes tématérkép további részei még készülnek. A sikeres
          feladatmegoldás tanulási jelzés; az oldal nem ad diagnózist vagy
          hivatalos osztályzatot.
        </p>
        <p>
          A felület nem küld tanulói válaszokat külső szolgáltatásnak, és nem
          használ követőkódot. A letöltött, önálló HTML-változat a benne lévő
          tananyaggal internet nélkül is megnyitható. Külső forráshivatkozáshoz
          internet szükséges.
        </p>
        <details>
          <summary>Tantervi és pedagógiai háttér</summary>
          <ul>
            <li>
              <a
                href="https://njt.jog.gov.hu/jogszabaly/2012-110-20-22"
                target="_blank"
                rel="noreferrer"
              >
                Nemzeti alaptanterv
              </a>
            </li>
            <li>
              <a
                href="https://www.oktatas2030.hu/wp-content/uploads/2020/10/utmutato-a-matematika-tantargy-tanitasahoz.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Útmutató a matematika tantárgy tanításához
              </a>
            </li>
            <li>
              <a
                href="https://educationendowmentfoundation.org.uk/education-evidence/guidance-reports/maths-ks-2-3"
                target="_blank"
                rel="noreferrer"
              >
                EEF: matematika tanítása
              </a>
            </li>
          </ul>
          <p>
            A teljes forrásjegyzék és az ellenőrzési korlátok a projekt
            dokumentációjában szerepelnek.
          </p>
        </details>
      </section>
    </div>
  );
}

function PrintLesson({ lesson }: { lesson: Lesson }) {
  const [answers, setAnswers] = useState(false);
  return (
    <div class="page print-page">
      <div class="no-print print-controls">
        <a href={`#lecke/${lesson.id}`} class="text-link">
          <Icon name="back" />
          Vissza a leckéhez
        </a>
        <label>
          <input
            type="checkbox"
            checked={answers}
            onChange={(e) => setAnswers(e.currentTarget.checked)}
          />{" "}
          Megoldókulccsal együtt
        </label>
        <Button onClick={() => window.print()}>
          <Icon name="print" />
          Nyomtatás / PDF
        </Button>
      </div>
      <div class="paper">
        <span class="eyebrow">MATEK8 · NYOMTATHATÓ FELADATLAP</span>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        <div class="paper-name">
          Név: ________________________ Dátum: ______________
        </div>
        <h2>Emlékeztető</h2>
        <ul>
          {lesson.recap.map((r) => (
            <li>{r}</li>
          ))}
        </ul>
        <h2>Próbáld meg önállóan</h2>
        {[...lesson.practice, ...lesson.exit].map((e, i) => {
          const parts = e.answer.kind === "parts" ? e.answer.parts : [];
          return (
            <section
              class={`paper-exercise ${parts.length <= 3 ? "paper-exercise-short" : ""}`}
            >
              <div class="paper-exercise-opening">
                <h3>
                  {i + 1}. {e.prompt}
                </h3>
                {e.context && <p>{e.context}</p>}
                {parts.length ? (
                  <ol class="paper-parts">
                    <li>
                      <strong>{parts[0].label}</strong>
                      <PaperAnswerFields answer={parts[0].answer} />
                    </li>
                  </ol>
                ) : (
                  <PaperAnswerFields answer={e.answer} />
                )}
              </div>
              {parts.length > 1 && (
                <ol class="paper-parts" start={2}>
                  {parts.slice(1).map((part) => (
                    <li>
                      <strong>{part.label}</strong>
                      <PaperAnswerFields answer={part.answer} />
                    </li>
                  ))}
                </ol>
              )}
              <div class="paper-exercise-closing">
                {e.reflection && (
                  <p>
                    <strong>Saját indoklás:</strong> {e.reflection.prompt}
                  </p>
                )}
                <div class="writing-space" />
                <small>{e.id}</small>
              </div>
            </section>
          );
        })}
        {answers && (
          <section class="paper-answers">
            <h2>Megoldókulcs és indoklás</h2>
            {[...lesson.practice, ...lesson.exit].map((e, i) => (
              <section>
                <h3>{i + 1}. feladat</h3>
                {e.solution.map((s) => (
                  <p>
                    <strong>{s.expression}</strong> — {s.why}
                  </p>
                ))}
                <p>{e.takeaway}</p>
                {e.reflection && (
                  <>
                    <h4>Az indoklás önellenőrzése</h4>
                    <ul>
                      {e.reflection.checkpoints.map((point) => (
                        <li>{point}</li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
function NotFound() {
  return (
    <div class="page empty-state">
      <h1>Ezt a részt nem találom.</h1>
      <p>A megnyitható tanulási utakat a kezdőlapon találod.</p>
      <Button onClick={() => navigate("felfedezes")}>
        Vissza a felfedezéshez
      </Button>
    </div>
  );
}

export { contentSnapshot } from "./content/snapshot.ts";
if (typeof document !== "undefined")
  render(<App />, document.getElementById("app")!);

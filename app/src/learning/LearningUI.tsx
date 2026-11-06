import { useState } from "preact/hooks";
import type { ComponentChildren } from "preact";
import type { Exercise } from "../types.ts";
import type { Profile } from "../progress.ts";
import { TOPIC_REGISTRY } from "../topics.ts";
import { SKILLS, skillSummary } from "./skills.ts";
import {
  chooseTargetedExercise,
  practiceRecommendations,
  replayTargetedExercise,
} from "./practice.ts";
import "./learning.css";

function localReturn(value: string | null): string | undefined {
  if (!value || value.length > 1200 || /[\u0000-\u001f]/.test(value)) return;
  return /^(?:felfedezes|tematerkep|haladas|gyakorlas(?:\/[a-z-]+)?|lecke\/[a-z-]+|javitas(?:\/[a-z-]+){0,2})(?:\?.*)?$/.test(
    value,
  )
    ? value
    : undefined;
}
const topicTitle = (id: string) =>
  TOPIC_REGISTRY.find((topic) => topic.id === id)?.title ?? id;

export function LearningPanel({
  profile,
  compact = false,
}: {
  profile: Profile;
  compact?: boolean;
}) {
  const [topic, setTopic] = useState("all");
  const recommendations = practiceRecommendations(profile);
  const rows = skillSummary(profile);
  if (compact)
    return (
      <section
        class="learning-panel learning-panel-compact"
        aria-label="Célzott gyakorlási javaslatok"
      >
        <div>
          <span class="eyebrow">A HIBÁBÓL IS VAN TOVÁBB</span>
          <h2>
            {recommendations.length
              ? "Innen érdemes folytatnod."
              : "Egy gondolatot külön is gyakorolhatsz."}
          </h2>
          <p>
            {recommendations.length
              ? "Az új ellenőrzéseid alapján ezekhez a gondolatokhoz érdemes visszatérned."
              : "Válassz egy készséget. Rövid magyarázat, új gyakorlófeladat és további próba vár."}
          </p>
        </div>
        {recommendations.length > 0 && (
          <ul class="learning-recommendations">
            {recommendations.slice(0, 3).map((item) => (
              <li key={item.skillId}>
                <a href={`#javitas/${item.skillId}`}>
                  <strong>{item.skill.title}</strong>
                  <span>{item.reason}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <a class="button button-secondary" href="#javitas">
          Célzott gyakorlás →
        </a>
      </section>
    );
  return (
    <section class="learning-panel" aria-labelledby="skill-progress-heading">
      <span class="eyebrow">KÉSZSÉGENKÉNTI VISSZAJELZÉS</span>
      <h2 id="skill-progress-heading">Melyik gondolat hogyan ment?</h2>
      <p>
        Csak az ellenőrzött részválaszok számítanak. A megnyitás és a gépelés
        nem tudáspróba; ugyanaz a megoldás ismételt ellenőrzése sem új
        bizonyíték.
      </p>
      {!profile.learning.events.length && (
        <p class="learning-note">
          A korábbi feladateredményeid megmaradtak. Ez a rész az ezután
          elvégzett ellenőrzésekből fog részletesebb visszajelzést adni.
        </p>
      )}
      {profile.learning.droppedEvents > 0 && (
        <p class="learning-note">
          A részletes napló a legutóbbi ellenőrzéseket őrzi.{" "}
          {profile.learning.droppedEvents} régebbi esemény már nincs benne; a
          feladatoknál megőrzött eredményeid ettől megmaradnak.
        </p>
      )}
      <div class="learning-filter">
        <label for="skill-progress-topic">Készségek témája</label>
        <select
          id="skill-progress-topic"
          value={topic}
          onChange={(event) => setTopic(event.currentTarget.value)}
        >
          <option value="all">Minden téma</option>
          {TOPIC_REGISTRY.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>
      <div class="skill-grid">
        {rows
          .filter((row) => topic === "all" || row.skill.topic === topic)
          .map((row) => (
            <article
              key={row.skillId}
              class={`skill-card ${row.needsPractice ? "skill-needs-practice" : ""}`}
              data-skill-id={row.skillId}
            >
              <span class="skill-topic">{topicTitle(row.skill.topic)}</span>
              <h3>{row.skill.title}</h3>
              <p>{row.reason}</p>
              <dl class="skill-counts">
                <div>
                  <dt>Önálló részmegoldás</dt>
                  <dd>{row.independentCount}</dd>
                </div>
                <div>
                  <dt>Segítséggel vagy javítva</dt>
                  <dd>{row.assistedCount}</dd>
                </div>
              </dl>
              {row.lastEvent && (
                <p class="skill-date">
                  Legutóbbi ellenőrzés:{" "}
                  <time dateTime={row.lastEvent.at}>
                    {new Date(row.lastEvent.at).toLocaleDateString("hu-HU")}
                  </time>
                </p>
              )}
              <a class="text-link" href={`#javitas/${row.skillId}`}>
                Ezt gyakorlom →
              </a>
            </article>
          ))}
      </div>
      <p class="learning-note">
        Ezek gyakorlási jelzések. Egy helyes válasz még nem bizonyítja a teljes
        gondolatmenet megértését. A javaslatok közül szabadon választhatsz.
      </p>
    </section>
  );
}

export function RepairPage({
  skillId,
  stage,
  profile,
  renderExercise,
}: {
  skillId?: string;
  stage?: string;
  profile: Profile;
  renderExercise: (
    exercise: Exercise,
    label: string,
    kindLabel?: string,
  ) => ComponentChildren;
}) {
  const [problem, setProblem] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const params = new URLSearchParams(location.hash.split("?")[1] ?? "");
  const back = localReturn(params.get("vissza"));
  const locator = params.get("feladat");
  const roundText = params.get("kor") ?? "0";
  const sequence = /^\d{1,6}$/.test(roundText) ? Number(roundText) : 0;
  const skill = SKILLS.find((item) => item.id === skillId);
  const recommendations = practiceRecommendations(profile);
  const recommendation = recommendations.find(
    (item) => item.skillId === skillId,
  );
  const activeStage = stage === "transfer" ? "transfer" : "repair";
  const selected =
    skill && locator
      ? replayTargetedExercise(skill.id, activeStage, locator)
      : null;
  const validStage =
    stage === undefined || stage === "repair" || stage === "transfer";
  const attempt = selected ? profile.attempts[selected.exercise.id] : undefined;
  // Saved feedback is not trusted after reload. A new explicit check confirms
  // every current field; deduplication prevents it from adding fake evidence.
  const solved = attempt?.result?.correct === true;
  const transferTitle =
    selected && activeStage === "transfer"
      ? selected.applicationKind === "different"
        ? "Másik alkalmazás"
        : "Új adatokkal"
      : "További próba";

  function start(nextStage: "repair" | "transfer") {
    if (!skill) return;
    const next = chooseTargetedExercise(
      profile,
      skill.id,
      nextStage,
      sequence + 1,
      selected?.sourceExerciseId,
    );
    if (!next) {
      setProblem(
        "Ehhez most nem találtam új feladatot. Válassz egy másik készséget, vagy nézd meg a kapcsolódó leckét.",
      );
      return;
    }
    const query = new URLSearchParams({
      feladat: next.locator,
      kor: String((sequence + 1) % 1_000_000),
    });
    if (back) query.set("vissza", back);
    location.hash = `javitas/${skill.id}/${nextStage}?${query}`;
  }
  function lessonLink(href: string) {
    return `${href}&javitas=${encodeURIComponent(location.hash.slice(1))}`;
  }
  if (!skill)
    return (
      <div class="page repair-page">
        <div class="page-heading">
          <span class="eyebrow">ÚJ FELADAT, UGYANAZ A GONDOLAT</span>
          <h1>Célzott gyakorlás.</h1>
          <p>
            Válassz egy javaslatot vagy egy készséget. Megnézheted a
            magyarázatot, majd új feladatokon kipróbálhatod.
          </p>
        </div>
        {skillId && (
          <p role="status" class="learning-note">
            Ez a készségazonosító nem található. Az alábbi listából
            választhatsz.
          </p>
        )}
        {recommendations.length > 0 && (
          <section class="learning-panel">
            <h2>A legutóbbi próbáidból</h2>
            <ul class="learning-recommendations">
              {recommendations.map((item) => (
                <li key={item.skillId}>
                  <a href={`#javitas/${item.skillId}`}>
                    <strong>{item.skill.title}</strong>
                    <span>{item.reason}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section class="learning-panel">
          <h2>Én választok készséget</h2>
          <div class="learning-filter">
            <label for="repair-topic">Téma</label>
            <select
              id="repair-topic"
              value={topicFilter}
              onChange={(event) => setTopicFilter(event.currentTarget.value)}
            >
              <option value="all">Minden téma</option>
              {TOPIC_REGISTRY.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
          <div class="skill-grid">
            {SKILLS.filter(
              (item) => topicFilter === "all" || item.topic === topicFilter,
            ).map((item) => (
              <article class="skill-card" key={item.id}>
                <span class="skill-topic">{topicTitle(item.topic)}</span>
                <h3>{item.title}</h3>
                <p>{item.explanation}</p>
                <a href={`#javitas/${item.id}`} class="text-link">
                  Ezt választom →
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  return (
    <div class="page repair-page" data-repair-skill={skill.id}>
      <a href="#javitas" class="text-link">
        ← Másik készséget választok
      </a>
      <div class="page-heading">
        <span class="eyebrow">
          CÉLZOTT GYAKORLÁS · {topicTitle(skill.topic)}
        </span>
        <h1>{skill.title}</h1>
        <p>
          {recommendation?.reason ??
            "Ezt a készséget te választottad gyakorlásra."}
        </p>
      </div>
      <ol class="repair-stages" aria-label="A javító út részei">
        <li aria-current={!selected ? "step" : undefined}>1. Értsd meg</li>
        <li
          aria-current={
            selected && activeStage === "repair" ? "step" : undefined
          }
        >
          2. Próbáld újra
        </li>
        <li
          aria-current={
            selected && activeStage === "transfer" ? "step" : undefined
          }
        >
          3. {transferTitle}
        </li>
      </ol>
      {!validStage || (locator && !selected) ? (
        <div class="learning-panel" role="status">
          <h2>Ez a feladathivatkozás nem használható.</h2>
          <p>A mentett haladásod megmaradt. Indíts egy új javító feladatot.</p>
          <button class="button button-primary" onClick={() => start("repair")}>
            Új javító feladat
          </button>
        </div>
      ) : (
        <>
          <section class="learning-panel repair-explanation">
            <h2>Mi tartja össze a megoldást?</h2>
            <p>{skill.explanation}</p>
            <ul>
              {skill.checkpoints.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div class="repair-links">
              <a class="text-link" href={lessonLink(skill.labHref)}>
                Kipróbálom a műhelyben →
              </a>
              <a class="text-link" href={lessonLink(skill.lessonHref)}>
                Elolvasom a magyarázatot →
              </a>
            </div>
          </section>
          {!selected ? (
            <button
              class="button button-primary"
              onClick={() => start("repair")}
            >
              Jöhet egy új javító feladat
            </button>
          ) : (
            <>
              <p class="learning-note">
                {selected.reason}
                {selected.targetPartId
                  ? selected.exercise.answer.kind === "parts"
                    ? " Az ellenőrzéshez szükséges összefüggő részeket együtt oldjuk meg."
                    : " Most a megnevezett részválaszra figyelünk; az eredeti helyzet szövegét is látod."
                  : ""}
              </p>
              {renderExercise(
                selected.exercise,
                activeStage === "repair"
                  ? "JAVÍTÓ GYAKORLÁS"
                  : transferTitle.toLocaleUpperCase("hu-HU"),
                selected.applicationKind === "different"
                  ? "Más helyzet vagy szerkezet"
                  : "Ugyanaz a gondolat",
              )}
              <div class="repair-next">
                {activeStage === "repair" ? (
                  <>
                    <button
                      class="button button-primary"
                      onClick={() => start("transfer")}
                      disabled={!solved}
                    >
                      Jöhet a következő próba
                    </button>
                    {!solved && (
                      <p>
                        {attempt?.success
                          ? "Ellenőrizd újra a mentett válaszodat, hogy a jelenlegi mezőkkel folytathasd. Az ismételt ellenőrzés nem számít új sikernek."
                          : "Előbb ellenőrizd ezt a választ. Kapaszkodót és teljes magyarázatot is kérhetsz."}
                      </p>
                    )}
                  </>
                ) : solved ? (
                  <p class="repair-done" role="status">
                    Ezen az új feladaton sikerült alkalmaznod a gondolatot. A
                    haladásnál külön látszik, hogy önállóan vagy segítséggel
                    dolgoztál.
                  </p>
                ) : (
                  <p>
                    A történet változhat, a matematikai kapcsolatot keresd.
                    Ellenőrizd az eredményt is.
                  </p>
                )}
                <button
                  class="button button-secondary"
                  onClick={() => start(activeStage)}
                >
                  Másik feladatot választok
                </button>
              </div>
            </>
          )}
        </>
      )}
      {problem && (
        <p role="status" class="learning-note">
          {problem}
        </p>
      )}
      <div class="repair-links">
        <a href="#haladas" class="text-link">
          Megnézem a haladásom →
        </a>
        {back && (
          <a href={`#${back}`} class="text-link">
            Vissza az eredeti feladathoz →
          </a>
        )}
      </div>
    </div>
  );
}

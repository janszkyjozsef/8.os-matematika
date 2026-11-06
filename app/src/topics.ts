/** The runtime topic registry is also the source of the TopicId type. */
export const TOPIC_REGISTRY = [
  { id: "szamfogalom", title: "Számfogalom és előjelek", introducedSchema: 2 },
  { id: "muveleti-sorrend", title: "Műveleti sorrend", introducedSchema: 2 },
  { id: "aranyossag", title: "Arányosság", introducedSchema: 2 },
  { id: "mertekegysegek", title: "Mértékegységek", introducedSchema: 2 },
  { id: "tortek", title: "Törtek", introducedSchema: 1 },
  { id: "szazalek", title: "Százalékszámítás", introducedSchema: 1 },
  { id: "egyenlet", title: "Egyenletek", introducedSchema: 1 },
  { id: "grafikon", title: "Grafikonok", introducedSchema: 1 },
  { id: "pitagorasz", title: "Pitagorasz-tétel", introducedSchema: 1 },
  { id: "valoszinuseg", title: "Valószínűség", introducedSchema: 1 },
] as const;

export type TopicId = (typeof TOPIC_REGISTRY)[number]["id"];
export const TOPICS: readonly TopicId[] = TOPIC_REGISTRY.map(({ id }) => id);

/** Freeze the schema-1 membership: never add later lessons to this list. */
export const LEGACY_TOPICS = [
  "tortek",
  "szazalek",
  "egyenlet",
  "grafikon",
  "pitagorasz",
  "valoszinuseg",
] as const satisfies readonly TopicId[];

export const SCHEMA_VERSION = 2 as const;

import metadata from "../package.json" with { type: "json" };

/** Application version is independent of the progress schema in topics.ts. */
export const APP_VERSION = metadata.version;

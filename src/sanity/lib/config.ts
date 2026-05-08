function readEnv(value: string | undefined, fallback = "") {
  return value?.trim() ? value.trim() : fallback;
}

export const sanityBasePath = "/studio";
export const sanityStudioTitle = "Olympique Remois TT Studio";
export const sanityProjectId = readEnv(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
);
export const sanityDataset = readEnv(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "production",
);
export const sanityApiVersion = readEnv(
  process.env.SANITY_API_VERSION,
  "2026-05-08",
);
export const isSanityConfigured = Boolean(sanityProjectId);

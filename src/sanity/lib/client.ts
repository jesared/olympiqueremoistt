import "server-only";

import { createClient } from "next-sanity";

import {
  sanityApiVersion,
  sanityDataset,
  sanityProjectId,
} from "~/sanity/lib/config";

export const sanityClient = createClient({
  apiVersion: sanityApiVersion,
  dataset: sanityDataset,
  projectId: sanityProjectId || "missing-project-id",
  token: process.env.SANITY_API_TOKEN,
  useCdn: process.env.NODE_ENV === "production",
});

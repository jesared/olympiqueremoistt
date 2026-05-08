import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "~/sanity/schemaTypes";
import {
  sanityBasePath,
  sanityDataset,
  sanityProjectId,
  sanityStudioTitle,
} from "~/sanity/lib/config";

export const studioConfig = defineConfig({
  name: "default",
  title: sanityStudioTitle,
  basePath: sanityBasePath,
  projectId: sanityProjectId || "missing-project-id",
  dataset: sanityDataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});

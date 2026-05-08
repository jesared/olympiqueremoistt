import { defineCliConfig } from "sanity/cli";

import { sanityDataset, sanityProjectId } from "./src/sanity/lib/config";

export default defineCliConfig({
  api: {
    dataset: sanityDataset,
    projectId: sanityProjectId || "missing-project-id",
  },
});

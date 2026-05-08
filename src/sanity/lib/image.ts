import { createImageUrlBuilder } from "@sanity/image-url";

import { sanityDataset, sanityProjectId } from "~/sanity/lib/config";

const imageBuilder = createImageUrlBuilder({
  dataset: sanityDataset,
  projectId: sanityProjectId || "missing-project-id",
});

type ImageSource = Parameters<typeof imageBuilder.image>[0];

function normalizeImageSource(source: unknown) {
  if (!source || typeof source !== "object") {
    return source;
  }

  const candidate = source as Record<string, unknown>;

  if (!("asset" in candidate)) {
    return source;
  }

  return {
    ...candidate,
    _type: "image",
  };
}

export function getSanityImageUrl(source: unknown) {
  if (!source || !sanityProjectId) {
    return null;
  }

  return imageBuilder
    .image(normalizeImageSource(source) as ImageSource)
    .auto("format")
    .fit("max")
    .url();
}

"use client";

import { NextStudio } from "next-sanity/studio";

import { studioConfig } from "~/sanity/lib/studio-config";

export function StudioShell() {
  return <NextStudio config={studioConfig} />;
}

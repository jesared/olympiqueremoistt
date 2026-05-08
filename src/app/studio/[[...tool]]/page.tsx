import type { Metadata } from "next";

import { isSanityConfigured, sanityBasePath } from "~/sanity/lib/config";

import { StudioShell } from "./StudioShell";

export const metadata: Metadata = {
  title: "Studio | Olympique Remois TT",
};

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <section className="bg-card w-full space-y-4 rounded-2xl border p-6 shadow-sm">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-600">
              Sanity non configure
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Le studio est installe, mais pas encore connecte.
            </h1>
            <p className="text-muted-foreground text-sm leading-6">
              Ajoute les variables d&apos;environnement Sanity dans
              <code className="bg-muted mx-1 rounded px-1.5 py-0.5 text-xs">
                .env
              </code>
              pour activer le studio embarque sur
              <code className="bg-muted mx-1 rounded px-1.5 py-0.5 text-xs">
                {sanityBasePath}
              </code>
              .
            </p>
          </div>

          <div className="bg-muted rounded-xl border p-4">
            <p className="font-medium">Variables attendues</p>
            <pre className="mt-3 overflow-x-auto text-sm leading-6">
{`NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=...
SANITY_API_VERSION=2026-05-08`}
            </pre>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <StudioShell />
    </div>
  );
}

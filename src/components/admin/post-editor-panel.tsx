"use client";

import { useMemo, useState } from "react";

import RichTextEditor from "~/components/RichTextEditor";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type PostEditorPanelProps = {
  title: string;
  image: string;
  content: string;
  onContentChange: (nextContent: string) => void;
  className?: string;
};

const FALLBACK_CONTENT =
  "<p>Commencez à rédiger votre actualité pour voir l’aperçu.</p>";

export function PostEditorPanel({
  title,
  image,
  content,
  onContentChange,
  className,
}: PostEditorPanelProps) {
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const previewDate = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="bg-muted inline-flex rounded-md p-1">
        <Button
          type="button"
          size="sm"
          variant={mode === "edit" ? "default" : "ghost"}
          className="transition-all"
          onClick={() => setMode("edit")}
        >
          Éditer
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === "preview" ? "default" : "ghost"}
          className="transition-all"
          onClick={() => setMode("preview")}
        >
          Aperçu
        </Button>
      </div>

      <div className="relative overflow-hidden rounded-md border">
        <div
          className={cn(
            "transition-all duration-200",
            mode === "edit"
              ? "translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 translate-y-1 opacity-0",
          )}
        >
          <RichTextEditor
            value={content}
            onChange={onContentChange}
            placeholder="Rédigez votre actualité..."
            className="rounded-none"
          />
        </div>

        <div
          className={cn(
            "bg-card min-h-72 p-4 transition-all duration-200 md:p-6",
            mode === "preview"
              ? "relative translate-y-0 opacity-100"
              : "pointer-events-none absolute inset-0 -translate-y-1 opacity-0",
          )}
        >
          <article className="mx-auto w-full max-w-3xl space-y-4">
            <p className="text-muted-foreground text-xs">{previewDate}</p>
            <h2 className="text-3xl font-bold tracking-tight">
              {title.trim() || "Titre de votre actualité"}
            </h2>

            {image.trim() ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt={title.trim() || "Image d’actualité"}
                className="h-60 w-full rounded-lg object-cover"
              />
            ) : null}

            <div
              className="content max-w-none"
              dangerouslySetInnerHTML={{
                __html: content.trim() || FALLBACK_CONTENT,
              }}
            />
          </article>
        </div>
      </div>
    </div>
  );
}

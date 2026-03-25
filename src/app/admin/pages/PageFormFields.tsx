"use client";

import { useMemo, useState } from "react";

import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { slugify } from "~/lib/slug";

type PageFormFieldsProps = {
  initialTitle?: string;
  initialSlug?: string;
  initialContent?: string;
  initialPublished?: boolean;
  autoSlug?: boolean;
};

export function PageFormFields({
  initialTitle = "",
  initialSlug = "",
  initialContent = "",
  initialPublished = false,
  autoSlug = true,
}: PageFormFieldsProps) {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug || slugify(initialTitle));
  const [content, setContent] = useState(initialContent);
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!autoSlug);

  const helperText = useMemo(() => {
    if (autoSlug && !isSlugManuallyEdited) {
      return "Slug généré automatiquement depuis le titre.";
    }

    return "Vous pouvez personnaliser le slug manuellement.";
  }, [autoSlug, isSlugManuallyEdited]);

  return (
    <>
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Titre
        </label>
        <Input
          id="title"
          name="title"
          placeholder="Ex: Présentation du club"
          value={title}
          onChange={(event) => {
            const nextTitle = event.target.value;
            setTitle(nextTitle);

            if (autoSlug && !isSlugManuallyEdited) {
              setSlug(slugify(nextTitle));
            }
          }}
          required
        />
      </div>

      <div className="grid gap-2">
        <label htmlFor="slug" className="text-sm font-medium">
          Slug
        </label>
        <Input
          id="slug"
          name="slug"
          placeholder="Ex: presentation-du-club"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value);
            setIsSlugManuallyEdited(true);
          }}
        />
        <p className="text-muted-foreground text-xs">{helperText}</p>
      </div>

      <div className="grid gap-2">
        <label htmlFor="content" className="text-sm font-medium">
          Contenu (HTML autorisé)
        </label>
        <Textarea
          id="content"
          name="content"
          placeholder="Saisissez le contenu de la page..."
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="min-h-[240px]"
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="published"
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <label htmlFor="published" className="text-sm font-medium">
          Publier la page
        </label>
        <input type="hidden" name="published" value={isPublished ? "on" : ""} />
      </div>
    </>
  );
}

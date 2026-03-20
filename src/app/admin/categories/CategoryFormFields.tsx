"use client";

import { useMemo, useState } from "react";

import { Input } from "~/components/ui/input";
import { slugify } from "~/lib/slug";

type CategoryFormFieldsProps = {
  initialName?: string;
  initialSlug?: string;
  autoSlug?: boolean;
};

export function CategoryFormFields({
  initialName = "",
  initialSlug = "",
  autoSlug = true,
}: CategoryFormFieldsProps) {
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug || slugify(initialName));
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!autoSlug);

  const helperText = useMemo(() => {
    if (autoSlug && !isSlugManuallyEdited) {
      return "Slug généré automatiquement depuis le nom.";
    }

    return "Vous pouvez personnaliser le slug manuellement.";
  }, [autoSlug, isSlugManuallyEdited]);

  return (
    <>
      <div className="grid gap-2">
        <label htmlFor="name" className="text-sm font-medium">
          Nom
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Championnats"
          value={name}
          onChange={(event) => {
            const nextName = event.target.value;
            setName(nextName);

            if (autoSlug && !isSlugManuallyEdited) {
              setSlug(slugify(nextName));
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
          placeholder="Ex: championnats"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value);
            setIsSlugManuallyEdited(true);
          }}
        />
        <p className="text-muted-foreground text-xs">{helperText}</p>
      </div>
    </>
  );
}

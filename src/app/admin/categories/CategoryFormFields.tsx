"use client";

import { useMemo, useState } from "react";

import { Input } from "~/components/ui/input";
import { normalizeHexColor } from "~/lib/color";
import { slugify } from "~/lib/slug";

type CategoryFormFieldsProps = {
  initialName?: string;
  initialSlug?: string;
  initialColor?: string | null;
  autoSlug?: boolean;
};

export function CategoryFormFields({
  initialName = "",
  initialSlug = "",
  initialColor = null,
  autoSlug = true,
}: CategoryFormFieldsProps) {
  const initialNormalizedColor = normalizeHexColor(initialColor);
  const [name, setName] = useState(initialName);
  const [slug, setSlug] = useState(initialSlug || slugify(initialName));
  const [hasColor, setHasColor] = useState(Boolean(initialNormalizedColor));
  const [color, setColor] = useState(initialNormalizedColor ?? "#22C55E");
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

      <div className="grid gap-2">
        <label htmlFor="color" className="text-sm font-medium">
          Couleur du badge
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            id="color"
            type="color"
            value={color}
            onChange={(event) => {
              setColor(event.target.value.toUpperCase());
              setHasColor(true);
            }}
            className="h-10 w-14 p-1"
          />
          <Input
            value={color}
            onChange={(event) => {
              const normalized = normalizeHexColor(event.target.value);

              setColor(normalized ?? event.target.value.toUpperCase());
              setHasColor(Boolean(normalized));
            }}
            placeholder="#22C55E"
            className="w-36"
          />
          <button
            type="button"
            className="text-muted-foreground hover:text-foreground text-xs underline"
            onClick={() => setHasColor(false)}
          >
            Aucune couleur
          </button>
        </div>
        <input type="hidden" name="color" value={hasColor ? color : ""} />
        <p className="text-muted-foreground text-xs">
          Exemple : Tournoi en vert, Stage en bleu, Soirée en violet.
        </p>
      </div>
    </>
  );
}

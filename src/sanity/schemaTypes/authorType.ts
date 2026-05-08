import type { ReactNode } from "react";

import { defineField, defineType } from "sanity";

export const authorType = defineType({
  name: "author",
  title: "Auteurs",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nom d'usage",
      type: "string",
      validation: (rule) => rule.required().min(2),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "role",
      title: "Fonction",
      type: "string",
      description: "Optionnel. Exemple : Communication, Coach, Bénévole.",
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "avatar",
    },
    prepare({
      media,
      subtitle,
      title,
    }: {
      media?: ReactNode;
      subtitle?: string;
      title?: string;
    }) {
      return {
        title: title ?? "Auteur sans nom",
        subtitle: subtitle ?? "Auteur",
        media,
      };
    },
  },
});

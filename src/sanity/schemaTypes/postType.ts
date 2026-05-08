import type { ReactNode } from "react";

import { defineArrayMember, defineField, defineType } from "sanity";

export const postType = defineType({
  name: "post",
  title: "Actualites",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Titre",
      type: "string",
      validation: (rule) => rule.required().min(3),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Extrait",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "author",
      title: "Auteur",
      type: "reference",
      to: [{ type: "author" }],
      description: "Auteur affiché publiquement sur l'article.",
    }),
    defineField({
      name: "authorName",
      title: "Nom d'usage de l'auteur",
      type: "string",
      description: "Nom affiche sur l'article.",
      hidden: true,
    }),
    defineField({
      name: "authorAvatar",
      title: "Avatar de l'auteur",
      type: "image",
      options: {
        hotspot: true,
      },
      hidden: true,
    }),
    defineField({
      name: "coverImage",
      title: "Image principale",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "body",
      title: "Contenu",
      type: "array",
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Paragraphe", value: "normal" },
            { title: "Titre 1", value: "h1" },
            { title: "Titre 2", value: "h2" },
            { title: "Titre 3", value: "h3" },
            { title: "Titre 4", value: "h4" },
            { title: "Titre 5", value: "h5" },
            { title: "Titre 6", value: "h6" },
            { title: "Citation", value: "blockquote" },
          ],
          lists: [
            { title: "Liste a puces", value: "bullet" },
            { title: "Liste numerotee", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Gras", value: "strong" },
              { title: "Italique", value: "em" },
            ],
            annotations: [],
          },
        }),
        defineArrayMember({
          type: "image",
          name: "inlineImage",
          title: "Image dans l'article",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Texte alternatif",
              type: "string",
              description: "Decris l'image pour l'accessibilite.",
            }),
            defineField({
              name: "caption",
              title: "Legende",
              type: "string",
              description: "Optionnel. Affiche un court texte sous l'image.",
            }),
            defineField({
              name: "display",
              title: "Affichage",
              type: "string",
              initialValue: "standard",
              options: {
                list: [
                  { title: "Standard", value: "standard" },
                  { title: "Large", value: "wide" },
                  { title: "Alignee a gauche", value: "left" },
                  { title: "Alignee a droite", value: "right" },
                ],
                layout: "radio",
                direction: "horizontal",
              },
            }),
          ],
        }),
        defineArrayMember({
          name: "imageGallery",
          title: "Galerie 2 images",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Titre interne",
              type: "string",
            }),
            defineField({
              name: "leftImage",
              title: "Image gauche",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  title: "Texte alternatif",
                  type: "string",
                }),
                defineField({
                  name: "caption",
                  title: "Legende de l'image",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "rightImage",
              title: "Image droite",
              type: "image",
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: "alt",
                  title: "Texte alternatif",
                  type: "string",
                }),
                defineField({
                  name: "caption",
                  title: "Legende de l'image",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "caption",
              title: "Legende generale",
              type: "string",
              description: "Optionnel. Texte commun affiche sous la galerie.",
            }),
          ],
          preview: {
            select: {
              leftMedia: "leftImage",
              rightMedia: "rightImage",
              title: "title",
            },
            prepare({
              leftMedia,
              title,
            }: {
              leftMedia?: ReactNode;
              title?: string;
            }) {
              return {
                title: title ?? "Galerie 2 images",
                media: leftMedia,
                subtitle: "Bloc galerie",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Date de publication",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "coverImage",
      slug: "slug.current",
      authorName: "author.name",
    },
    prepare({
      authorName,
      media,
      slug,
      title,
    }: {
      authorName?: string;
      media?: ReactNode;
      slug?: string;
      title?: string;
    }) {
      return {
        title: title ?? "Sans titre",
        media,
        subtitle: slug
          ? authorName
            ? `/actualites/${slug} • ${authorName}`
            : `/actualites/${slug}`
          : "Actualite sans slug",
      };
    },
  },
});

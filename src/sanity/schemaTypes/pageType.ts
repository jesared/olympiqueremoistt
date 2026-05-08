import { defineArrayMember, defineField, defineType } from "sanity";

export const pageType = defineType({
  name: "page",
  title: "Pages",
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
      name: "seoTitle",
      title: "Titre SEO",
      type: "string",
    }),
    defineField({
      name: "seoDescription",
      title: "Description SEO",
      type: "text",
      rows: 3,
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
      slug: "slug.current",
    },
    prepare({
      title,
      slug,
    }: {
      title?: string;
      slug?: string;
    }) {
      return {
        title: title ?? "Sans titre",
        subtitle: slug ? `/p/${slug}` : "Page sans slug",
      };
    },
  },
});

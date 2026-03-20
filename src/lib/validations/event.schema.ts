import { z } from "zod";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const toDate = (value: unknown) => {
  if (!value || typeof value !== "string") {
    return undefined;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return undefined;
  }

  return parsed;
};

const toOptionalString = (value: unknown) => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed === "" ? undefined : trimmed;
};

export const eventSchema = z
  .object({
    title: z.string().trim().min(1, "Le titre est requis."),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(1, "Le slug est requis.")
      .regex(
        slugPattern,
        "Le slug doit contenir uniquement des lettres minuscules, des chiffres et des tirets.",
      ),
    description: z.string().trim().min(1, "La description est requise."),
    location: z.string().trim().min(1, "Le lieu est requis."),
    startDate: z.preprocess(
      toDate,
      z.date({ required_error: "La date de début est requise." }),
    ),
    endDate: z.preprocess(toDate, z.date().optional()),
    categoryId: z.preprocess(toOptionalString, z.string().optional()),
    published: z.boolean().default(false),
  })
  .refine((values) => !values.endDate || values.endDate >= values.startDate, {
    message: "La date de fin doit être postérieure à la date de début.",
    path: ["endDate"],
  });

export type EventSchemaInput = z.infer<typeof eventSchema>;

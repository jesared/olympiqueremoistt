import { z } from "zod";

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

export const createEventSchema = z
  .object({
    title: z.string().trim().min(1, "Le titre est requis."),
    slug: z.string().trim().min(1, "Le slug est requis."),
    description: z.string().trim().min(1, "La description est requise."),
    location: z.string().trim().min(1, "Le lieu est requis."),
    startDate: z.preprocess(
      toDate,
      z.date({ required_error: "La date de début est requise." }),
    ),
    endDate: z.preprocess(toDate, z.date().optional()),
    published: z.boolean().default(false),
  })
  .refine((values) => !values.endDate || values.endDate >= values.startDate, {
    message: "La date de fin doit être postérieure à la date de début.",
    path: ["endDate"],
  });

export type CreateEventSchemaInput = z.infer<typeof createEventSchema>;

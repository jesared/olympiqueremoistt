"use server";

import { redirect } from "next/navigation";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

type CreateEventErrors = Partial<
  Record<
    "title" | "slug" | "description" | "location" | "startDate" | "endDate",
    string
  >
>;

export type CreateEventState = {
  formError?: string;
  fieldErrors?: CreateEventErrors;
};

const defaultState: CreateEventState = {};

function normalize(value: FormDataEntryValue | null) {
  return value?.toString().trim() ?? "";
}

export async function createEvent(
  _previousState: CreateEventState = defaultState,
  data: FormData,
): Promise<CreateEventState> {
  await requireAdmin();

  const title = normalize(data.get("title"));
  const slug = normalize(data.get("slug")).toLowerCase();
  const description = normalize(data.get("description"));
  const location = normalize(data.get("location"));
  const startDateValue = normalize(data.get("startDate"));
  const endDateValue = normalize(data.get("endDate"));
  const published = data.get("published") === "on";

  const fieldErrors: CreateEventErrors = {};

  if (!title) fieldErrors.title = "Le titre est requis.";
  if (!slug) {
    fieldErrors.slug = "Le slug est requis.";
  } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    fieldErrors.slug =
      "Utilisez uniquement des lettres minuscules, chiffres et tirets.";
  }

  if (!description) fieldErrors.description = "La description est requise.";
  if (!location) fieldErrors.location = "Le lieu est requis.";
  if (!startDateValue) fieldErrors.startDate = "La date de début est requise.";

  const startDate = startDateValue ? new Date(startDateValue) : null;
  const endDate = endDateValue ? new Date(endDateValue) : null;

  if (startDateValue && (!startDate || Number.isNaN(startDate.getTime()))) {
    fieldErrors.startDate = "La date de début est invalide.";
  }

  if (endDateValue && (!endDate || Number.isNaN(endDate.getTime()))) {
    fieldErrors.endDate = "La date de fin est invalide.";
  }

  if (startDate && endDate && endDate < startDate) {
    fieldErrors.endDate = "La date de fin doit être après la date de début.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      formError: "Merci de corriger les erreurs du formulaire.",
      fieldErrors,
    };
  }

  try {
    await prisma.event.create({
      data: {
        title,
        slug,
        description,
        location,
        startDate: startDate!,
        endDate,
        published,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return {
        formError: "Ce slug existe déjà.",
        fieldErrors: {
          slug: "Choisissez un slug unique.",
        },
      };
    }

    return {
      formError: "Une erreur est survenue lors de la création de l'événement.",
    };
  }

  redirect("/admin/events");
}

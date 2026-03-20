"use server";

import { revalidatePath } from "next/cache";

import { eventSchema } from "~/lib/validations/event.schema";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

type CreateEventActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
};

export async function createEvent(
  _prevState: CreateEventActionState,
  data: FormData,
): Promise<CreateEventActionState> {
  await requireAdmin();

  const parsed = eventSchema.safeParse({
    title: data.get("title"),
    slug: data.get("slug"),
    description: data.get("description"),
    location: data.get("location"),
    startDate: data.get("startDate"),
    endDate: data.get("endDate"),
    categoryId: data.get("categoryId"),
    published: data.get("published") === "true",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Le formulaire contient des erreurs.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const intent = data.get("intent");
  const shouldPublish = intent === "publish" ? true : parsed.data.published;

  const existingEvent = await prisma.event.findUnique({
    where: { slug: parsed.data.slug },
    select: { id: true },
  });

  if (existingEvent) {
    return {
      status: "error",
      message: "Ce slug est déjà utilisé.",
      errors: { slug: ["Ce slug est déjà utilisé."] },
    };
  }

  await prisma.event.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      location: parsed.data.location,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate ?? null,
      categoryId: parsed.data.categoryId ?? null,
      published: shouldPublish,
    },
  });

  revalidatePath("/events");
  revalidatePath("/admin/events");

  return {
    status: "success",
    message: shouldPublish
      ? "Événement créé et publié avec succès."
      : "Événement créé en brouillon.",
    redirectTo: "/admin/events",
  };
}

export async function deleteEvent(id: string) {
  await requireAdmin();

  if (!id) {
    throw new Error("Événement invalide.");
  }

  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/evenements");

  return { ok: true };
}

export type { CreateEventActionState };

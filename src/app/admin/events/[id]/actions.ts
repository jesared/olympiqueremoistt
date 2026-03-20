"use server";

import { revalidatePath } from "next/cache";

import { eventSchema } from "~/lib/validations/event.schema";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export type UpdateEventActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
};

export async function updateEvent(
  id: string,
  _prevState: UpdateEventActionState,
  data: FormData,
): Promise<UpdateEventActionState> {
  await requireAdmin();

  const existingEvent = await prisma.event.findUnique({
    where: { id },
    select: { id: true, slug: true },
  });

  if (!existingEvent) {
    return {
      status: "error",
      message: "Événement introuvable.",
    };
  }

  const parsed = eventSchema.safeParse({
    title: data.get("title"),
    slug: data.get("slug"),
    description: data.get("description"),
    location: data.get("location"),
    startDate: data.get("startDate"),
    endDate: data.get("endDate"),
    published: data.get("published") === "true",
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Le formulaire contient des erreurs.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const existingSlug = await prisma.event.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: { id },
    },
    select: { id: true },
  });

  if (existingSlug) {
    return {
      status: "error",
      message: "Ce slug est déjà utilisé.",
      errors: { slug: ["Ce slug est déjà utilisé."] },
    };
  }

  await prisma.event.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      location: parsed.data.location,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate ?? null,
      published: parsed.data.published,
    },
  });

  revalidatePath("/admin/events");
  revalidatePath(`/events/${existingEvent.slug}`);
  revalidatePath(`/events/${parsed.data.slug}`);

  return {
    status: "success",
    message: "Événement mis à jour.",
    redirectTo: `/admin/events/${id}/edit`,
  };
}

export type DuplicateEventResult = {
  status: "success" | "error";
  message: string;
  redirectTo?: string;
};

export async function duplicateEvent(id: string): Promise<DuplicateEventResult> {
  await requireAdmin();

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      title: true,
      slug: true,
      description: true,
      location: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!event) {
    return { status: "error", message: "Événement introuvable." };
  }

  const copiedTitle = `Copie - ${event.title}`;
  const copiedSlugBase = event.slug;
  let copiedSlug = copiedSlugBase;
  let suffix = 1;

  while (
    await prisma.event.findUnique({
      where: { slug: copiedSlug },
      select: { id: true },
    })
  ) {
    copiedSlug = `${copiedSlugBase}-${suffix}`;
    suffix += 1;
  }

  const duplicated = await prisma.event.create({
    data: {
      title: copiedTitle,
      slug: copiedSlug,
      description: event.description,
      location: event.location,
      startDate: event.startDate,
      endDate: event.endDate,
      published: false,
    },
    select: { id: true },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");

  return {
    status: "success",
    message: "Événement dupliqué avec succès.",
    redirectTo: `/admin/events/${duplicated.id}/edit`,
  };
}

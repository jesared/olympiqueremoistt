"use server";

import { revalidatePath } from "next/cache";

import { createEventSchema } from "./event.schema";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

type CreateEventActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string[]>;
  redirectTo?: string;
};

export const initialCreateEventState: CreateEventActionState = {
  status: "idle",
};

export async function createEventAction(
  _prevState: CreateEventActionState,
  data: FormData,
): Promise<CreateEventActionState> {
  await requireAdmin();

  const parsed = createEventSchema.safeParse({
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

export type { CreateEventActionState };

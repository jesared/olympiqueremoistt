"use server";

import { revalidatePath } from "next/cache";

import { eventSchema } from "~/lib/validations/event.schema";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

type UpdateEventResult = {
  success: boolean;
  error?:
    | "missing-fields"
    | "invalid-start-date"
    | "invalid-end-date"
    | "end-before-start"
    | "slug-already-used"
    | "unknown";
};

export async function updateEvent(
  id: string,
  data: FormData,
): Promise<UpdateEventResult> {
  await requireAdmin();

  const parsed = eventSchema.safeParse({
    title: data.get("title"),
    slug: data.get("slug"),
    description: data.get("description"),
    location: data.get("location"),
    startDate: data.get("startDate"),
    endDate: data.get("endDate"),
    published: data.get("published") === "on",
  });

  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;

    if (fieldErrors.endDate?.length) {
      return { success: false, error: "end-before-start" };
    }

    if (fieldErrors.startDate?.length) {
      return { success: false, error: "invalid-start-date" };
    }

    if (
      fieldErrors.title ||
      fieldErrors.slug ||
      fieldErrors.description ||
      fieldErrors.location
    ) {
      return { success: false, error: "missing-fields" };
    }

    return { success: false, error: "unknown" };
  }

  const existingSlug = await prisma.event.findFirst({
    where: {
      slug: parsed.data.slug,
      NOT: { id },
    },
    select: { id: true },
  });

  if (existingSlug) {
    return { success: false, error: "slug-already-used" };
  }

  try {
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
  } catch {
    return { success: false, error: "unknown" };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/events/${parsed.data.slug}`);
  revalidatePath(`/admin/events/${id}`);

  return { success: true };
}

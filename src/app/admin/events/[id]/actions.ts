"use server";

import { revalidatePath } from "next/cache";

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

  const title = data.get("title")?.toString().trim() ?? "";
  const slug = data.get("slug")?.toString().trim() ?? "";
  const description = data.get("description")?.toString().trim() ?? "";
  const location = data.get("location")?.toString().trim() ?? "";
  const startDateValue = data.get("startDate")?.toString() ?? "";
  const endDateValue = data.get("endDate")?.toString() ?? "";
  const published = data.get("published") === "on";

  if (!title || !slug || !description || !location || !startDateValue) {
    return { success: false, error: "missing-fields" };
  }

  const startDate = new Date(startDateValue);

  if (Number.isNaN(startDate.getTime())) {
    return { success: false, error: "invalid-start-date" };
  }

  const endDate = endDateValue ? new Date(endDateValue) : null;

  if (endDate && Number.isNaN(endDate.getTime())) {
    return { success: false, error: "invalid-end-date" };
  }

  if (endDate && endDate < startDate) {
    return { success: false, error: "end-before-start" };
  }

  try {
    await prisma.event.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        location,
        startDate,
        endDate,
        published,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { success: false, error: "slug-already-used" };
    }

    return { success: false, error: "unknown" };
  }

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath(`/admin/events/${id}`);

  return { success: true };
}

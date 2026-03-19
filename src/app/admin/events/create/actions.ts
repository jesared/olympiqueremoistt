"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function createEvent(data: FormData) {
  await requireAdmin();

  const title = data.get("title")?.toString().trim() ?? "";
  const slug = data.get("slug")?.toString().trim() ?? "";
  const description = data.get("description")?.toString().trim() ?? "";
  const location = data.get("location")?.toString().trim() ?? "";
  const startDateValue = data.get("startDate")?.toString() ?? "";
  const endDateValue = data.get("endDate")?.toString() ?? "";
  const published = data.get("published") === "on";

  if (!title || !slug || !description || !location || !startDateValue) {
    redirect("/admin/events/create?error=missing-fields");
  }

  const startDate = new Date(startDateValue);

  if (Number.isNaN(startDate.getTime())) {
    redirect("/admin/events/create?error=invalid-start-date");
  }

  const endDate = endDateValue ? new Date(endDateValue) : null;

  if (endDate && Number.isNaN(endDate.getTime())) {
    redirect("/admin/events/create?error=invalid-end-date");
  }

  if (endDate && endDate < startDate) {
    redirect("/admin/events/create?error=end-before-start");
  }

  await prisma.event.create({
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

  revalidatePath("/events");
  redirect("/admin/events");
}

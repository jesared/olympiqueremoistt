"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getString } from "~/lib/form";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function createEvent(data: FormData) {
  await requireAdmin();

  const title = getString(data, "title").trim();
  const slug = getString(data, "slug").trim();
  const description = getString(data, "description").trim();
  const location = getString(data, "location").trim();
  const startDateValue = getString(data, "startDate");
  const endDateValue = getString(data, "endDate");
  const published = getString(data, "published") === "on";

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

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getString } from "~/lib/form";
import { normalizeHexColor } from "~/lib/color";
import { slugify } from "~/lib/slug";
import { requireAdminOrModerator } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function createCategory(data: FormData) {
  await requireAdminOrModerator();

  const name = getString(data, "name").trim();
  const rawSlug = getString(data, "slug").trim();
  const color = normalizeHexColor(getString(data, "color"));
  const slug = slugify(rawSlug || name);

  if (!name || !slug) {
    redirect("/admin/categories/create?error=missing-fields");
  }

  const existingCategory = await prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingCategory) {
    redirect("/admin/categories/create?error=slug-taken");
  }

  await prisma.category.create({
    data: {
      name,
      slug,
      color,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts");

  redirect("/admin/categories");
}

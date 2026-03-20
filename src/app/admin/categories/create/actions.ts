"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { slugify } from "~/lib/slug";
import { requireAdminOrModerator } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function createCategory(data: FormData) {
  await requireAdminOrModerator();

  const name = data.get("name")?.toString().trim() ?? "";
  const rawSlug = data.get("slug")?.toString().trim() ?? "";
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
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts");

  redirect("/admin/categories");
}

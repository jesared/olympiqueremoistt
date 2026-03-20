"use server";

import { revalidatePath } from "next/cache";

import { requireAdminOrModerator } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function deleteCategory(id: string) {
  await requireAdminOrModerator();

  if (!id) {
    throw new Error("Catégorie invalide.");
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/posts");

  return { ok: true };
}

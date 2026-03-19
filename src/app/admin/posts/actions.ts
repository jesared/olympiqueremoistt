"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function deletePost(id: string) {
  await requireAdmin();

  if (!id) {
    throw new Error("Actualité invalide.");
  }

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");

  return { ok: true };
}

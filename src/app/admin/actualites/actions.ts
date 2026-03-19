"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function togglePublish(id: string) {
  await requireAdmin();

  if (!id) {
    throw new Error("Actualité invalide.");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, published: true },
  });

  if (!post) {
    throw new Error("Actualité introuvable.");
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: { published: !post.published },
    select: { id: true, published: true },
  });

  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");

  return updatedPost;
}

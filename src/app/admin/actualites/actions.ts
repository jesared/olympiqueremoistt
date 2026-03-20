"use server";

import { revalidatePath } from "next/cache";

import { requireAdminOrModerator } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function togglePublish(id: string) {
  await requireAdminOrModerator();

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

export async function deletePost(id: string) {
  await requireAdminOrModerator();

  if (!id) {
    throw new Error("Actualité invalide.");
  }

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/admin/actualites");
  revalidatePath("/admin/posts");
  revalidatePath("/actualites");

  return { ok: true };
}

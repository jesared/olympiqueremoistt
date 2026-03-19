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

export async function togglePublishPost(id: string) {
  await requireAdmin();

  if (!id) {
    throw new Error("Actualité invalide.");
  }

  const post = await prisma.post.findUnique({
    where: { id },
    select: { published: true },
  });

  if (!post) {
    throw new Error("Actualité introuvable.");
  }

  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      published: !post.published,
    },
    select: {
      published: true,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");

  return { published: updatedPost.published };
}

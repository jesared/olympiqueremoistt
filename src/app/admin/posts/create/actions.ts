"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function createPost(data: FormData) {
  const session = await requireAdmin();

  const title = data.get("title")?.toString().trim() ?? "";
  const slug = data.get("slug")?.toString().trim() ?? "";
  const content = data.get("content")?.toString().trim() ?? "";
  const image = data.get("image")?.toString().trim() ?? "";
  const published = data.get("published") === "on";

  if (!title || !slug || !content) {
    redirect("/admin/posts/create?error=missing-fields");
  }

  if (image) {
    try {
      // Validation simple pour éviter les URLs invalides.
      new URL(image);
    } catch {
      redirect("/admin/posts/create?error=invalid-image");
    }
  }

  await prisma.post.create({
    data: {
      title,
      content,
      image: image || null,
      published,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");

  redirect("/admin/posts");
}

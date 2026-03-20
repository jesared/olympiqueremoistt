"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { slugify } from "~/lib/slug";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

async function generateUniqueSlug(title: string) {
  const baseSlug = slugify(title) || "actualite";
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const existingPost = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    if (!existingPost) {
      return slug;
    }

    suffix += 1;
    slug = `${baseSlug}-${suffix}`;
  }
}

export async function createPost(data: FormData) {
  const session = await requireAdmin();

  const title = data.get("title")?.toString().trim() ?? "";
  const content = data.get("content")?.toString().trim() ?? "";
  const imageUrl =
    data.get("imageUrl")?.toString().trim() ??
    data.get("image")?.toString().trim() ??
    "";
  const published = data.get("published") === "on";

  if (!title || !content) {
    redirect("/admin/posts/create?error=missing-fields");
  }

  if (imageUrl) {
    try {
      // Validation simple pour éviter les URLs invalides.
      new URL(imageUrl);
    } catch {
      redirect("/admin/posts/create?error=invalid-image");
    }
  }

  const slug = await generateUniqueSlug(title);

  await prisma.post.create({
    data: {
      title,
      slug,
      content,
      imageUrl: imageUrl || null,
      published,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/posts");
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");

  redirect("/admin/posts");
}

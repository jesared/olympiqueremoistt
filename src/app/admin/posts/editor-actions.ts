"use server";

import { revalidatePath } from "next/cache";

import { slugify } from "~/lib/slug";
import { requireAdminOrModerator } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export type SavePostResult = {
  success: boolean;
  error?: "missing-fields" | "invalid-image" | "slug-already-used" | "unknown";
  id?: string;
};

function getStringValue(data: FormData, key: string) {
  const value = data.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

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

function revalidatePostPaths(id: string) {
  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePath(`/admin/posts/${id}/edit`);
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");
}

export async function createPostAction(
  data: FormData,
): Promise<SavePostResult> {
  const session = await requireAdminOrModerator();

  const title = getStringValue(data, "title");
  const content = getStringValue(data, "content");
  const providedSlug = getStringValue(data, "slug");
  const imageUrl =
    getStringValue(data, "imageUrl") || getStringValue(data, "image");
  const categoryId = getStringValue(data, "categoryId");
  const published = data.get("published") === "on";

  if (!title || !content) {
    return { success: false, error: "missing-fields" };
  }

  if (imageUrl) {
    try {
      new URL(imageUrl);
    } catch {
      return { success: false, error: "invalid-image" };
    }
  }

  let nextCategoryId: string | null = null;
  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return { success: false, error: "unknown" };
    }

    nextCategoryId = category.id;
  }

  const slug = providedSlug || (await generateUniqueSlug(title));

  try {
    const createdPost = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        imageUrl: imageUrl || null,
        published,
        authorId: session.user.id,
        categoryId: nextCategoryId,
      },
      select: { id: true },
    });

    revalidatePostPaths(createdPost.id);

    return { success: true, id: createdPost.id };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { success: false, error: "slug-already-used" };
    }

    return { success: false, error: "unknown" };
  }
}

export async function updatePostAction(
  id: string,
  data: FormData,
): Promise<SavePostResult> {
  await requireAdminOrModerator();

  const title = getStringValue(data, "title");
  const slug = getStringValue(data, "slug");
  const content = getStringValue(data, "content");
  const imageUrl =
    getStringValue(data, "imageUrl") || getStringValue(data, "image");
  const categoryId = getStringValue(data, "categoryId");
  const published = data.get("published") === "on";

  if (!title || !slug || !content) {
    return { success: false, error: "missing-fields" };
  }

  if (imageUrl) {
    try {
      new URL(imageUrl);
    } catch {
      return { success: false, error: "invalid-image" };
    }
  }

  let nextCategoryId: string | null = null;
  if (categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    });

    if (!category) {
      return { success: false, error: "unknown" };
    }

    nextCategoryId = category.id;
  }

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        imageUrl: imageUrl || null,
        published,
        categoryId: nextCategoryId,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return { success: false, error: "slug-already-used" };
    }

    return { success: false, error: "unknown" };
  }

  revalidatePostPaths(id);

  return { success: true, id };
}

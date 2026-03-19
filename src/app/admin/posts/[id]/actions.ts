"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

type UpdatePostResult = {
  success: boolean;
  error?: "missing-fields" | "invalid-image" | "slug-already-used" | "unknown";
};

function getStringValue(data: FormData, key: string) {
  const value = data.get(key);

  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function updatePost(
  id: string,
  data: FormData,
): Promise<UpdatePostResult> {
  await requireAdmin();

  const title = getStringValue(data, "title");
  const slug = getStringValue(data, "slug");
  const content = getStringValue(data, "content");
  const image = getStringValue(data, "image");
  const published = data.get("published") === "on";

  if (!title || !slug || !content) {
    return { success: false, error: "missing-fields" };
  }

  if (image) {
    try {
      new URL(image);
    } catch {
      return { success: false, error: "invalid-image" };
    }
  }

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        image: image || null,
        published,
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

  revalidatePath("/admin/posts");
  revalidatePath(`/admin/posts/${id}`);
  revalidatePath("/admin/actualites");
  revalidatePath("/actualites");

  return { success: true };
}

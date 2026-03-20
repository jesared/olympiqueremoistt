"use server";

import { redirect } from "next/navigation";

import { createPostAction } from "~/app/admin/posts/editor-actions";

export async function createPost(data: FormData) {
  const result = await createPostAction(data);

  if (!result.success) {
    redirect(`/admin/posts/create?error=${result.error ?? "unknown"}`);
  }

  redirect("/admin/posts");
}

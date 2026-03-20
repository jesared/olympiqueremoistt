"use server";

import { type SavePostResult } from "~/app/admin/posts/action-types";
import { updatePostAction } from "~/app/admin/posts/editor-actions";

export async function updatePost(id: string, data: FormData): Promise<SavePostResult> {
  return updatePostAction(id, data);
}

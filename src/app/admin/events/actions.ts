"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function deleteEvent(id: string) {
  await requireAdmin();

  if (!id) {
    throw new Error("Événement invalide.");
  }

  await prisma.event.delete({
    where: { id },
  });

  revalidatePath("/admin/events");
  revalidatePath("/events");
  revalidatePath("/evenements");

  return { ok: true };
}

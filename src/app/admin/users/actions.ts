"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export const APP_ROLES = ["USER", "ORGANIZER", "ADMIN"] as const;

export type AppRole = (typeof APP_ROLES)[number];

export async function updateUserRole(userId: string, role: AppRole) {
  await requireAdmin();

  if (!userId) {
    throw new Error("Utilisateur invalide.");
  }

  if (!APP_ROLES.includes(role)) {
    throw new Error("Rôle invalide.");
  }

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin/users");

  return { ok: true };
}

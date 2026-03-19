"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

import { APP_ROLES, type AppRole } from "./roles";

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

export async function deleteUser(userId: string) {
  const session = await requireAdmin();

  if (!userId) {
    throw new Error("Utilisateur invalide.");
  }

  if (session.user.id === userId) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  revalidatePath("/admin/users");

  return { ok: true };
}

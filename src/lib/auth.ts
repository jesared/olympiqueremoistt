import "server-only";

import { redirect } from "next/navigation";

import { auth } from "~/server/auth";

type AdminLikeRole = "ADMIN" | "MODERATOR";

type RequireAdminOptions = {
  loginPath?: string;
  unauthorizedPath?: string;
  allowRoles?: readonly AdminLikeRole[];
  logDeniedAccess?: boolean;
};

const DEFAULT_ALLOWED_ROLES: readonly AdminLikeRole[] = ["ADMIN", "MODERATOR"];

/**
 * Vérifie côté serveur qu'un utilisateur est connecté et qu'il a un rôle admin.
 * Redirige vers login si non connecté, ou vers unauthorized si rôle interdit.
 */
export async function requireAdmin(options: RequireAdminOptions = {}) {
  const {
    loginPath = "/api/auth/signin",
    unauthorizedPath = "/unauthorized",
    allowRoles = DEFAULT_ALLOWED_ROLES,
    logDeniedAccess = true,
  } = options;

  const session = await auth();
  const role = session?.user?.role;

  if (!session?.user) {
    if (logDeniedAccess) {
      console.warn("[auth] Accès admin refusé: utilisateur non connecté.");
    }
    redirect(loginPath);
  }

  if (!role || !allowRoles.includes(role as AdminLikeRole)) {
    if (logDeniedAccess) {
      console.warn(`[auth] Accès admin refusé: rôle insuffisant (${role ?? "NONE"}).`);
    }
    redirect(unauthorizedPath);
  }

  return session;
}

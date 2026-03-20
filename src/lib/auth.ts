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
  const normalizedRole = typeof role === "string" ? role.trim().toUpperCase() : undefined;

  if (process.env.NODE_ENV !== "production") {
    console.log("[auth] SESSION:", session);
    console.log("[auth] ROLE:", role);
    console.log("[auth] ALLOWED:", allowRoles);
    console.log(
      "[auth] INCLUDES:",
      !!normalizedRole && allowRoles.includes(normalizedRole as AdminLikeRole),
    );
  }

  if (!session?.user) {
    if (logDeniedAccess) {
      console.warn("[auth] Accès admin refusé: utilisateur non connecté.");
    }
    redirect(loginPath);
  }

  if (!normalizedRole || !allowRoles.includes(normalizedRole as AdminLikeRole)) {
    if (logDeniedAccess) {
      console.warn(`[auth] Accès admin refusé: rôle insuffisant (${role ?? "NONE"}).`);
    }
    redirect(unauthorizedPath);
  }

  return session;
}

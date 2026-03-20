import "server-only";

import { auth } from "~/server/auth";

/**
 * Session sécurisée (non null + user complet)
 */
type AuthSession = {
  user: {
    id: string;
    role: "ADMIN" | "MODERATOR" | "ORGANIZER" | "USER";
  };
};

/**
 * ADMIN uniquement
 */
export async function requireAdmin(): Promise<AuthSession> {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: admin role required.");
  }

  return session as AuthSession;
}

/**
 * ADMIN ou MODERATOR
 */
export async function requireAdminOrModerator(): Promise<AuthSession> {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "MODERATOR")
  ) {
    throw new Error("Unauthorized: admin or moderator role required.");
  }

  return session as AuthSession;
}

/**
 * ORGANIZER ou ADMIN
 */
export async function requireOrganizer(): Promise<AuthSession> {
  const session = await auth();

  if (
    !session?.user ||
    (session.user.role !== "ORGANIZER" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Unauthorized: organizer role required.");
  }

  return session as AuthSession;
}

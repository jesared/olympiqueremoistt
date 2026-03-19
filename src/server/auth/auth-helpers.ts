import "server-only";

import { auth } from "~/server/auth";

export async function requireAdmin() {
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized: admin role required.");
  }

  return session;
}

export async function requireOrganizer() {
  const session = await auth();
  const role = session?.user?.role;

  if (role !== "ORGANIZER" && role !== "ADMIN") {
    throw new Error("Unauthorized: organizer role required.");
  }

  return session;
}

import type { Session } from "next-auth";

export function getUserInitials(user: Session["user"] | null | undefined) {
  const initialsFromName = user?.name
    ?.split(" ")
    .filter(Boolean)
    .map((chunk) => chunk[0])
    .join("")
    .toUpperCase();

  if (initialsFromName && initialsFromName.length > 0) {
    return initialsFromName.slice(0, 2);
  }

  const emailInitial = user?.email?.trim().charAt(0).toUpperCase();

  return emailInitial || "U";
}

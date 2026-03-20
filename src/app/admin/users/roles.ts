export const APP_ROLES = ["USER", "MODERATOR", "ORGANIZER", "ADMIN"] as const;

export type AppRole = (typeof APP_ROLES)[number];

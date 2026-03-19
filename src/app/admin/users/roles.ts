export const APP_ROLES = ["USER", "ORGANIZER", "ADMIN"] as const;

export type AppRole = (typeof APP_ROLES)[number];

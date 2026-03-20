export type SavePostResult = {
  success: boolean;
  error?: "missing-fields" | "invalid-image" | "slug-already-used" | "unknown";
  id?: string;
};

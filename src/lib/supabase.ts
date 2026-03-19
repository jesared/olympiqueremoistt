import { createClient } from "~/lib/client";

const POSTS_BUCKET = "posts";

export async function uploadImage(file: File): Promise<string> {
  const fileExt = file.name.split(".").pop() ?? "jpg";
  const safeName = file.name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const fileName = `${Date.now()}-${safeName || "image"}.${fileExt}`;

  const supabase = createClient();

  const { error } = await supabase.storage.from(POSTS_BUCKET).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    throw new Error(`Upload Supabase échoué: ${error.message}`);
  }

  const { data } = supabase.storage.from(POSTS_BUCKET).getPublicUrl(fileName);

  if (!data.publicUrl) {
    throw new Error("Impossible de récupérer l'URL publique de l'image.");
  }

  return data.publicUrl;
}

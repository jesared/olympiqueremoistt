import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error("Missing environment variable: SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File): Promise<string> {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("posts")
    .upload(fileName, file);

  if (error) {
    console.error("Supabase upload error:", error.message);
    throw error;
  }

  const { data } = supabase.storage.from("posts").getPublicUrl(fileName);

  return data.publicUrl;
}

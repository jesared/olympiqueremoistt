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
  const uniqueFileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("posts")
    .upload(uniqueFileName, file);

  if (uploadError) {
    throw new Error(`Failed to upload image: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from("posts").getPublicUrl(uniqueFileName);

  return data.publicUrl;
}

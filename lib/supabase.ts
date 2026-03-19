const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
}

if (!supabaseAnonKey) {
  throw new Error(
    "Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}
export async function uploadImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("posts")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("❌ Supabase upload error:", error);
      throw new Error(error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("posts")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error("🔥 Upload failed:", err.message);
      throw err;
    }

    console.error("🔥 Unknown error:", err);
    throw new Error("Upload failed");
  }
}

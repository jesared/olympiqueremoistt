import { env } from "~/env";

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

export async function uploadImage(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Seuls les fichiers image sont autorises.");
  }

  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Configuration Cloudinary manquante: ajoute NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME et NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (env.NEXT_PUBLIC_CLOUDINARY_FOLDER) {
    formData.append("folder", env.NEXT_PUBLIC_CLOUDINARY_FOLDER);
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = (await response.json()) as CloudinaryUploadResponse;

  if (!response.ok || !data.secure_url) {
    throw new Error(
      data.error?.message ?? "Impossible de televerser l'image sur Cloudinary.",
    );
  }

  return data.secure_url;
}

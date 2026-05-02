import { env } from "~/env";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_DIMENSION_PX = 2400;
const MIN_QUALITY = 0.45;
const INITIAL_QUALITY = 0.82;
const MAX_COMPRESSION_ATTEMPTS = 6;
const DIMENSION_REDUCTION_FACTOR = 0.85;

type CloudinaryUploadResponse = {
  secure_url?: string;
  error?: {
    message?: string;
  };
};

function toFriendlyCloudinaryError(message?: string) {
  if (!message) {
    return "Impossible de televerser l'image sur Cloudinary.";
  }

  if (message.includes("Upload preset must be whitelisted for unsigned uploads")) {
    return "Le preset Cloudinary doit etre configure en upload non signe (unsigned).";
  }

  if (message.includes("File size too large")) {
    return "L'image reste trop volumineuse apres compression. Essayez une image plus legere.";
  }

  return message;
}

function changeFileExtension(fileName: string, extension: string) {
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  return `${baseName}.${extension}`;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Impossible de lire l'image avant compression."));
    };

    image.src = objectUrl;
  });
}

function canvasToFile(
  canvas: HTMLCanvasElement,
  quality: number,
  fileName: string,
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Impossible de compresser l'image."));
          return;
        }

        resolve(
          new File([blob], changeFileExtension(fileName, "webp"), {
            type: "image/webp",
          }),
        );
      },
      "image/webp",
      quality,
    );
  });
}

async function compressImageIfNeeded(file: File) {
  if (file.size <= MAX_UPLOAD_BYTES) {
    return file;
  }

  if (file.type === "image/svg+xml" || file.type === "image/gif") {
    throw new Error(
      "Cette image depasse 10 Mo et ne peut pas etre compressee automatiquement. Utilisez un fichier plus leger.",
    );
  }

  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Impossible de preparer la compression de l'image.");
  }

  let width = image.naturalWidth;
  let height = image.naturalHeight;

  const initialScale = Math.min(1, MAX_DIMENSION_PX / Math.max(width, height));
  width = Math.max(1, Math.round(width * initialScale));
  height = Math.max(1, Math.round(height * initialScale));

  for (let attempt = 0; attempt < MAX_COMPRESSION_ATTEMPTS; attempt += 1) {
    const quality = Math.max(MIN_QUALITY, INITIAL_QUALITY - attempt * 0.08);

    canvas.width = width;
    canvas.height = height;
    context.clearRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);

    const compressedFile = await canvasToFile(canvas, quality, file.name);

    if (compressedFile.size <= MAX_UPLOAD_BYTES) {
      return compressedFile;
    }

    width = Math.max(1, Math.round(width * DIMENSION_REDUCTION_FACTOR));
    height = Math.max(1, Math.round(height * DIMENSION_REDUCTION_FACTOR));
  }

  throw new Error(
    "L'image reste trop volumineuse apres compression. Essayez une image plus legere.",
  );
}

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

  const preparedFile = await compressImageIfNeeded(file);

  const formData = new FormData();
  formData.append("file", preparedFile);
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
    throw new Error(toFriendlyCloudinaryError(data.error?.message));
  }

  return data.secure_url;
}

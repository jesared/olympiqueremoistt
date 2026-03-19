"use client";

import { type ChangeEvent, useEffect, useState } from "react";

type ImageUploadProps = {
  uploadImage: (file: File) => Promise<string>;
  onUploaded: (url: string) => void;
  accept?: string;
  className?: string;
};

export function ImageUpload({
  uploadImage,
  onUploaded,
  accept = "image/*",
  className,
}: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((previousPreview) => {
      if (previousPreview) {
        URL.revokeObjectURL(previousPreview);
      }

      return objectUrl;
    });

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImage(file);
      onUploaded(uploadedUrl);
    } catch {
      setError("Échec de l'upload de l'image.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={className}>
      <input type="file" accept={accept} onChange={handleFileChange} />

      {previewUrl ? (
        <img
          src={previewUrl}
          alt="Prévisualisation"
          className="mt-2 h-40 w-auto rounded object-cover"
        />
      ) : null}

      {isUploading ? (
        <p className="mt-2 text-sm text-muted-foreground">Upload en cours...</p>
      ) : null}

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}

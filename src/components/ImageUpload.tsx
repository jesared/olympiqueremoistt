"use client";

import {
  type ChangeEvent,
  type DragEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { ImagePlus, Loader2, Trash2, UploadCloud } from "lucide-react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type ImageUploadProps = {
  value?: string;
  uploadImage: (file: File) => Promise<string>;
  onUploaded: (url: string) => void;
  accept?: string;
  className?: string;
};

export function ImageUpload({
  value,
  uploadImage,
  onUploaded,
  accept = "image/*",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value ?? null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      return;
    }

    setPreviewUrl((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return value;
    });
  }, [value]);

  useEffect(() => {
    if (value === "") {
      setPreviewUrl((previousPreview) => {
        if (previousPreview?.startsWith("blob:")) {
          URL.revokeObjectURL(previousPreview);
        }

        return null;
      });
    }
  }, [value]);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onFileSelected = async (file: File) => {
    setError(null);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl((previousPreview) => {
      if (previousPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(previousPreview);
      }

      return objectUrl;
    });

    try {
      setIsUploading(true);
      const uploadedUrl = await uploadImage(file);
      onUploaded(uploadedUrl);
    } catch {
      setError("Impossible d’uploader l’image. Réessayez dans quelques secondes.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    await onFileSelected(file);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (isUploading) {
      return;
    }

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    await onFileSelected(file);
  };

  const clearImage = () => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    setError(null);
    onUploaded("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />

      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!isUploading) {
            setIsDragging(true);
          }
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "bg-card group border-border relative overflow-hidden rounded-xl border border-dashed p-4 transition-all duration-200 sm:p-5",
          "hover:border-primary/60 hover:bg-muted/40",
          isDragging && "border-primary bg-primary/5 scale-[1.01]",
          isUploading && "pointer-events-none opacity-70",
        )}
      >
        <div className="space-y-3">
          <div className="bg-muted text-muted-foreground flex size-10 items-center justify-center rounded-full">
            <UploadCloud className="size-5" />
          </div>

          <div>
            <p className="text-sm font-medium">Déposez une image ici</p>
            <p className="text-muted-foreground text-xs">
              PNG, JPG, WEBP… ou utilisez le bouton ci-dessous.
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="w-full sm:w-auto"
          >
            <ImagePlus className="mr-2 size-4" />
            {previewUrl ? "Changer l’image" : "Choisir une image"}
          </Button>
        </div>

        <div className="bg-muted/60 mt-4 aspect-video overflow-hidden rounded-lg border">
          {previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Prévisualisation de l’image"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              Aucune image sélectionnée
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {isUploading ? (
          <div className="text-muted-foreground inline-flex items-center gap-2 text-sm">
            <Loader2 className="size-4 animate-spin" />
            Upload en cours…
          </div>
        ) : null}

        {previewUrl ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearImage}
            disabled={isUploading}
          >
            <Trash2 className="mr-2 size-4" />
            Supprimer l’image
          </Button>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      ) : null}
    </div>
  );
}

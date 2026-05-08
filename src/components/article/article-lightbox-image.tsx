"use client";

import Image from "next/image";
import { Expand } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type ArticleLightboxImageProps = {
  alt: string;
  caption?: string;
  className: string;
  dialogDescription?: string;
  dialogTitle: string;
  sizes: string;
  src: string;
};

export function ArticleLightboxImage({
  alt,
  caption,
  className,
  dialogDescription,
  dialogTitle,
  sizes,
  src,
}: ArticleLightboxImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`${className} group block w-full cursor-zoom-in text-left`}
          aria-label={`Ouvrir l'image: ${dialogTitle}`}
        >
          <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
          <div className="bg-background/92 text-foreground pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-sm">
            <Expand className="size-3.5" />
            Agrandir
          </div>
          {caption ? (
            <span className="sr-only">{caption}</span>
          ) : null}
        </button>
      </DialogTrigger>

      <DialogContent className="bg-background/96 max-h-[92vh] max-w-6xl gap-3 border-none p-3 shadow-2xl sm:p-4">
        <DialogTitle className="sr-only">{dialogTitle}</DialogTitle>
        <DialogDescription className="sr-only">
          {dialogDescription ?? caption ?? alt}
        </DialogDescription>
        <div className="relative h-[70vh] overflow-hidden rounded-2xl">
          <Image src={src} alt={alt} fill sizes="100vw" className="object-contain" />
        </div>
        {caption ? (
          <p className="text-muted-foreground px-2 text-center text-sm leading-6">
            {caption}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

type GalleryImage = {
  alt: string;
  caption?: string;
  src: string;
};

type ArticleLightboxGalleryProps = {
  caption?: string;
  images: [GalleryImage, GalleryImage];
};

export function ArticleLightboxGallery({
  caption,
  images,
}: ArticleLightboxGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  const goPrevious = () => {
    setActiveIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goNext = () => {
    setActiveIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group not-prose my-10 grid w-full gap-3 text-left sm:my-12 sm:grid-cols-2"
          aria-label="Ouvrir la galerie d'images"
        >
          {images.map((image, index) => (
            <div
              key={image.src}
              className="bg-card border-border/70 relative aspect-[4/3] overflow-hidden rounded-[24px] border shadow-[0_20px_50px_-34px_hsl(var(--foreground)/0.28)]"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              {index === 0 ? (
                <div className="bg-background/92 text-foreground pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-sm">
                  <Expand className="size-3.5" />
                  Ouvrir la galerie
                </div>
              ) : null}
            </div>
          ))}
          {caption ? (
            <span className="text-muted-foreground sm:col-span-2 text-center text-sm leading-6">
              {caption}
            </span>
          ) : null}
        </button>
      </DialogTrigger>

      <DialogContent className="bg-background/96 max-h-[92vh] max-w-6xl gap-4 border-none p-3 shadow-2xl sm:p-4">
        <DialogTitle className="sr-only">Galerie d&apos;images</DialogTitle>
        <DialogDescription className="sr-only">
          Galerie de deux images de l&apos;article
        </DialogDescription>
        <div className="relative h-[70vh] overflow-hidden rounded-2xl">
          <Image
            src={activeImage.src}
            alt={activeImage.alt}
            fill
            sizes="100vw"
            className="object-contain"
          />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-1/2 left-3 -translate-y-1/2"
            onClick={goPrevious}
            aria-label="Image précédente"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-1/2 right-3 -translate-y-1/2"
            onClick={goNext}
            aria-label="Image suivante"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`border-border/70 relative h-16 w-16 overflow-hidden rounded-xl border transition ${
                activeIndex === index ? "ring-primary ring-2" : "opacity-70 hover:opacity-100"
              }`}
              aria-label={`Voir l'image ${index + 1}`}
            >
              <Image src={image.src} alt={image.alt} fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>

        <div className="space-y-1 px-2 text-center">
          {activeImage.caption ? (
            <p className="text-muted-foreground text-sm leading-6">
              {activeImage.caption}
            </p>
          ) : null}
          {caption ? (
            <p className="text-muted-foreground/80 text-xs leading-5">{caption}</p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import { CalendarDays, Newspaper } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { ArticleLightboxGallery } from "~/components/article/article-lightbox-gallery";
import { ArticleLightboxImage } from "~/components/article/article-lightbox-image";
import { CategoryBadge } from "~/components/category-badge";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { getSanityImageUrl } from "~/sanity/lib/image";
import {
  getLegacyPrismaNewsRedirectSlug,
  getPublishedNewsBySlug,
} from "~/sanity/lib/news";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

type ActualiteDetailPageProps = {
  params: Promise<{ slug: string }>;
};

type LinkMark = {
  _type: "link";
  href?: string;
};

type InlineImageValue = {
  _type: "image";
  alt?: string;
  caption?: string;
  display?: "standard" | "wide" | "left" | "right";
  asset?: unknown;
};

type GalleryImageValue = {
  asset?: unknown;
  alt?: string;
  caption?: string;
};

type InlineGalleryValue = {
  _type: "imageGallery";
  caption?: string;
  leftImage?: GalleryImageValue;
  rightImage?: GalleryImageValue;
  title?: string;
};

function getInitials(name: string) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials.slice(0, 2) || "A";
}

function renderInlineImage(value: InlineImageValue) {
  const imageUrl = getSanityImageUrl(value);

  if (!imageUrl) {
    return null;
  }

  const isWide = value.display === "wide";
  const isLeft = value.display === "left";
  const isRight = value.display === "right";
  const trimmedAlt = value.alt?.trim();
  const trimmedCaption = value.caption?.trim();
  const alt =
    trimmedAlt && trimmedAlt.length > 0
      ? trimmedAlt
      : (trimmedCaption ?? "Image de l'article");

  const figureClassName = isWide
    ? "not-prose my-10 sm:my-12 sm:-mx-4 lg:-mx-8"
    : isLeft
      ? "not-prose my-8 w-full sm:float-left sm:mr-6 sm:mb-6 sm:w-[44%]"
      : isRight
        ? "not-prose my-8 w-full sm:float-right sm:ml-6 sm:mb-6 sm:w-[44%]"
        : "not-prose my-10";

  const frameClassName = isWide
    ? "bg-card border-border/70 relative aspect-[16/9] overflow-hidden rounded-xl border shadow-[0_18px_44px_-34px_hsl(var(--foreground)/0.22)]"
    : "bg-card border-border/70 relative aspect-[4/3] overflow-hidden rounded-xl border shadow-[0_16px_36px_-30px_hsl(var(--foreground)/0.18)]";

  const sizes = isWide
    ? "(min-width: 1280px) 960px, (min-width: 1024px) 85vw, (min-width: 640px) calc(100vw - 5rem), calc(100vw - 3rem)"
    : "(min-width: 1024px) 720px, (min-width: 640px) calc(100vw - 8rem), calc(100vw - 3rem)";

  return (
    <figure className={figureClassName}>
      <ArticleLightboxImage
        src={imageUrl}
        alt={alt}
        caption={value.caption}
        className={frameClassName}
        dialogTitle={value.caption?.trim() ?? "Image de l'article"}
        dialogDescription={alt}
        sizes={sizes}
      />
      {value.caption ? (
        <figcaption className="text-muted-foreground mt-3 text-center text-sm leading-6">
          {value.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-foreground/90 text-[1.02rem] leading-8 sm:text-[1.06rem]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-14 text-2xl font-semibold tracking-tight sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 text-xl font-semibold tracking-tight sm:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-primary/35 bg-primary/5 text-foreground/85 my-10 rounded-xl border-l-4 px-5 py-4 text-lg leading-8 italic">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="marker:text-primary my-6 space-y-3 pl-6">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="marker:text-primary my-6 space-y-3 pl-6 marker:font-semibold">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="pl-1 text-[1.02rem] leading-8 sm:text-[1.06rem]">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="pl-1 text-[1.02rem] leading-8 sm:text-[1.06rem]">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="text-foreground font-semibold">{children}</strong>
    ),
    link: ({ children, value }: PortableTextMarkComponentProps<LinkMark>) => {
      const href = value?.href ?? "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          className="decoration-primary/35 hover:text-primary underline underline-offset-4 transition-colors"
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer" : undefined}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: InlineImageValue }) => renderInlineImage(value),
    inlineImage: ({ value }: { value: InlineImageValue }) =>
      renderInlineImage(value),
    imageGallery: ({ value }: { value: InlineGalleryValue }) => {
      const leftSrc = value.leftImage
        ? getSanityImageUrl(value.leftImage)
        : null;
      const rightSrc = value.rightImage
        ? getSanityImageUrl(value.rightImage)
        : null;

      if (!leftSrc || !rightSrc) {
        return null;
      }

      const leftAlt =
        value.leftImage?.alt?.trim() ?? "Image gauche de la galerie";
      const rightAlt =
        value.rightImage?.alt?.trim() ?? "Image droite de la galerie";

      return (
        <ArticleLightboxGallery
          caption={value.caption}
          images={[
            {
              src: leftSrc,
              alt: leftAlt,
              caption: value.leftImage?.caption,
            },
            {
              src: rightSrc,
              alt: rightAlt,
              caption: value.rightImage?.caption,
            },
          ]}
        />
      );
    },
  },
};

export async function generateMetadata({
  params,
}: ActualiteDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedNewsBySlug(slug);

  if (!post) {
    return {
      title: "Actualité introuvable",
    };
  }

  return {
    title: `${post.title} | Actualités`,
  };
}

export default async function ActualiteDetailPage({
  params,
}: ActualiteDetailPageProps) {
  const { slug } = await params;
  const post = await getPublishedNewsBySlug(slug);

  if (!post) {
    const redirectSlug = await getLegacyPrismaNewsRedirectSlug(slug);

    if (redirectSlug) {
      redirect(`/actualites/${redirectSlug}`);
    }

    notFound();
  }

  const author = post.author ?? {
    name: "Olympique Rémois TT",
    avatarUrl: null,
  };

  return (
    <main>
      <article className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <header className="space-y-6">
          <nav aria-label="Fil d'Ariane">
            <ol className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                /
              </li>
              <li>
                <Link
                  href="/actualites"
                  className="hover:text-primary transition-colors"
                >
                  Actualités
                </Link>
              </li>
              <li aria-hidden="true" className="text-border">
                /
              </li>
              <li
                aria-current="page"
                className="text-foreground max-w-[18rem] truncate sm:max-w-xs"
              >
                {post.title}
              </li>
            </ol>
          </nav>

          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-3 text-center">
              <h1 className="mx-auto max-w-4xl text-center text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[4.25rem]">
                {post.title}
              </h1>
              <p className="text-muted-foreground mx-auto max-w-2xl text-center text-base leading-7">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarDays className="text-primary size-4" />
                  <span>{dateFormatter.format(post.publishedAt)}</span>
                </div>
                <Avatar size="sm" className="size-8">
                  <AvatarImage src={author.avatarUrl ?? ""} alt={author.name} />
                  <AvatarFallback className="text-[11px] font-semibold">
                    {getInitials(author.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-muted-foreground text-xs">
                    Par{" "}
                    <span className="text-foreground font-medium">
                      {author.name}
                    </span>
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className="border-border/70 bg-background rounded-full border px-3 py-1 text-[0.72rem] tracking-[0.14em] uppercase"
                >
                  <Newspaper className="mr-1.5 size-3.5" />
                  Actualité club
                </Badge>
                {post.category?.name ? (
                  <CategoryBadge
                    name={post.category.name}
                    color={post.category.color}
                    className="rounded-full px-3 py-1 text-[0.72rem] tracking-[0.14em] uppercase"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {post.imageUrl ? (
            <figure className="mx-auto w-full max-w-3xl">
              <div className="border-border/70 bg-muted/10 relative mb-4 overflow-hidden rounded-md border">
                <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[18/9]">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1024px) 768px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
                    className="object-cover"
                    style={{ objectPosition: "center 40%" }}
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
                </div>
              </div>
            </figure>
          ) : null}
        </header>

        <div className="mx-auto w-full max-w-3xl lg:-mt-10">
          {post.source === "sanity" && post.body ? (
            <section className="article-content bg-card border-border/70 min-w-0 rounded-xl border px-5 py-6 shadow-[0_18px_40px_-34px_hsl(var(--foreground)/0.22)] sm:px-8 sm:py-8">
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            </section>
          ) : (
            <section
              className="article-content bg-card border-border/70 min-w-0 rounded-xl border px-5 py-6 shadow-[0_18px_40px_-34px_hsl(var(--foreground)/0.22)] sm:px-8 sm:py-8"
              dangerouslySetInnerHTML={{ __html: post.contentHtml ?? "" }}
            />
          )}

          <div className="border-border mt-12 flex items-center justify-between gap-4 border-t pt-6">
            <p className="text-muted-foreground text-sm">
              Retrouvez toutes les publications du club dans les actualités.
            </p>
            <Link
              href="/actualites"
              className="border-border bg-background text-foreground hover:bg-secondary inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium transition-colors"
            >
              Voir toutes les actualités
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}

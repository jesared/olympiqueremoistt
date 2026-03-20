import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";

import { slugify } from "~/lib/slug";
import { db as prisma } from "~/server/db";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

type ActualiteDetailPageProps = {
  params: Promise<{ slug: string }>;
};

async function getPostBySlug(slug: string) {
  return prisma.post.findFirst({
    where: {
      slug,
      published: true,
    },
    select: {
      title: true,
      imageUrl: true,
      content: true,
      createdAt: true,
      slug: true,
    },
  });
}

export async function generateMetadata({
  params,
}: ActualiteDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

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
  const requestedSlug = decodeURIComponent(slug);
  const post = await getPostBySlug(requestedSlug);

  if (!post) {
    const postByTitle = await prisma.post.findFirst({
      where: {
        title: requestedSlug,
        published: true,
      },
      select: {
        slug: true,
      },
    });

    if (postByTitle) {
      redirect(`/actualites/${postByTitle.slug}`);
    }

    const normalizedSlug = slugify(requestedSlug);

    if (normalizedSlug && normalizedSlug !== requestedSlug) {
      const normalizedPost = await getPostBySlug(normalizedSlug);

      if (normalizedPost) {
        redirect(`/actualites/${normalizedPost.slug}`);
      }
    }

    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <article className="space-y-6">
        <header className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium uppercase">
            {dateFormatter.format(post.createdAt)}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
        </header>

        <div className="bg-muted border-border/70 relative h-[260px] w-full overflow-hidden rounded-xl border sm:h-[320px] lg:h-[420px]">
          {post.imageUrl ? (
            <>
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 896px, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            </>
          ) : (
            <div className="text-muted-foreground/90 flex h-full items-center justify-center text-sm">
              Image indisponible
            </div>
          )}
        </div>

        <section
          className="content max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}

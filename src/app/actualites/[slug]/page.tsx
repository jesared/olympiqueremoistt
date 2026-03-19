import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

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
      image: true,
      content: true,
      createdAt: true,
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
  const post = await getPostBySlug(slug);

  if (!post) {
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

        <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden rounded-lg border border-border/70">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 896px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="text-muted-foreground/90 flex h-full items-center justify-center text-sm">
              Image indisponible
            </div>
          )}
        </div>

        <section className="prose prose-zinc max-w-none whitespace-pre-line dark:prose-invert">
          {post.content}
        </section>
      </article>
    </main>
  );
}

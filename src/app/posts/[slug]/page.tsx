import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { db as prisma } from "~/server/db";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

type PostDetailPageProps = {
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
      content: true,
      imageUrl: true,
      createdAt: true,
    },
  });
}

export async function generateMetadata({
  params,
}: PostDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article introuvable",
    };
  }

  return {
    title: `${post.title} | Actualités`,
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
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

          <div className="bg-muted border-border/70 relative mt-4 aspect-[16/9] w-full overflow-hidden rounded-xl border shadow-sm transition-all duration-300">
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.imageUrl}
                alt={post.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                Aucune image pour cet article
              </div>
            )}
          </div>
        </header>

        <section
          className="content max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </main>
  );
}

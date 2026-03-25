import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { db as prisma } from "~/server/db";

type PageDetailProps = {
  params: Promise<{ slug: string }>;
};

async function getPageBySlug(slug: string) {
  return prisma.page.findFirst({
    where: {
      slug,
      published: true,
    },
    select: {
      title: true,
      content: true,
      updatedAt: true,
    },
  });
}

export async function generateMetadata({
  params,
}: PageDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page introuvable",
    };
  }

  return {
    title: page.title,
  };
}

export default async function PageDetail({ params }: PageDetailProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {page.title}
        </h1>
        <p className="text-muted-foreground text-xs">
          Mise à jour le{" "}
          {page.updatedAt.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      <section
        className="content max-w-none"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  );
}

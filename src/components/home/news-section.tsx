import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import SectionHeading from "~/components/home/section-heading";
import { db as prisma } from "~/server/db";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function toExcerpt(content: string, maxLength = 140) {
  const plainText = content
    .replace(/&nbsp;|Â /g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_`\-\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}…`;
}

export default async function NewsSection() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      createdAt: true,
    },
  });

  return (
    <section aria-labelledby="actualites-title" className="space-y-6 sm:space-y-8">
      <SectionHeading
        id="actualites-title"
        eyebrow="Actualités"
        title="Les dernières nouvelles du club"
        description="Résultats, vie associative et annonces importantes : tout ce qu'il faut savoir cette semaine à l'ORTT."
      />

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Aucune actualité publiée pour le moment.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.id} className="h-full">
              <CardHeader className="space-y-2">
                <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
                  {dateFormatter.format(post.createdAt)}
                </p>
                <CardTitle className="text-lg leading-snug">
                  <Link href={`/actualites/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {toExcerpt(post.content)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

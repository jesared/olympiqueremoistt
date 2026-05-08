import Link from "next/link";

import SectionHeading from "~/components/home/section-heading";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { getPublishedNewsItems } from "~/sanity/lib/news";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function NewsSection() {
  const posts = await getPublishedNewsItems(3);

  return (
    <section
      aria-labelledby="actualites-title"
      className="space-y-6 sm:space-y-8"
    >
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
                  {dateFormatter.format(post.publishedAt)}
                </p>
                <CardTitle className="text-lg leading-snug">
                  <Link
                    href={`/actualites/${post.slug}`}
                    className="hover:underline"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { db as prisma } from "~/server/db";
import { auth } from "~/server/auth";
import { Pencil } from "lucide-react";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

function toExcerpt(content: string, maxLength = 160) {
  const plainText = content
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_`\-\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}…`;
}

export default async function ActualitesPage() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      content: true,
      createdAt: true,
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Actualités
        </h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed sm:text-base">
          Retrouvez les dernières publications du club : annonces, résultats et
          vie associative.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="text-muted-foreground text-sm sm:text-base">
          Aucune actualité publiée pour le moment.
        </p>
      ) : (
        <section className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="group border-border/70 relative h-full overflow-hidden p-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              {isAdmin ? (
                <div className="absolute top-3 right-3 z-10">
                  <Button asChild size="icon-xs" variant="outline">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      aria-label={`Editer ${post.title}`}
                    >
                      <Pencil className="size-3.5" />
                    </Link>
                  </Button>
                </div>
              ) : null}

              <Link
                href={`/actualites/${post.slug}`}
                className="flex h-full flex-col gap-3 p-3 sm:p-4"
              >
                {post.imageUrl ? (
                  <div className="bg-muted relative aspect-[16/10] overflow-hidden rounded-lg">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  </div>
                ) : null}

                <CardHeader className="space-y-1 p-0">
                  <p className="text-muted-foreground/80 text-xs font-medium tracking-wide uppercase">
                    {dateFormatter.format(post.createdAt)}
                  </p>
                  <CardTitle className="text-base leading-snug sm:text-lg">
                    {post.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="mt-auto p-0">
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {toExcerpt(post.content)}
                  </p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}

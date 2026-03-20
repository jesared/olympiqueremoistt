import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db as prisma } from "~/server/db";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "long",
  timeStyle: "short",
});

type EventsPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const params = await searchParams;
  const categorySlug = params?.category?.trim();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const activeCategory = categorySlug
    ? await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: {
          id: true,
          name: true,
          slug: true,
        },
      })
    : null;

  const events = await prisma.event.findMany({
    where: {
      published: true,
      ...(categorySlug
        ? activeCategory
          ? { category: { slug: activeCategory.slug } }
          : { id: "__unknown_category__" }
        : {}),
    },
    orderBy: { startDate: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      startDate: true,
      location: true,
      description: true,
      category: {
        select: {
          name: true,
          slug: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Events</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Découvrez les prochains événements publics du club.
        </p>
        {categorySlug ? (
          <p className="text-sm">
            Catégorie active :{" "}
            <span className="font-medium">
              {activeCategory?.name ?? "Inconnue"}
            </span>
          </p>
        ) : null}
      </header>

      <section className="flex flex-wrap gap-2">
        <Button asChild variant={categorySlug ? "outline" : "default"} size="sm">
          <Link href="/events">Toutes</Link>
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            asChild
            variant={categorySlug === category.slug ? "default" : "outline"}
            size="sm"
          >
            <Link href={`/events?category=${category.slug}`}>{category.name}</Link>
          </Button>
        ))}
      </section>

      {events.length === 0 ? (
        <p className="text-muted-foreground">
          Aucun événement publié pour le moment.
        </p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.slug}`}
              className="block h-full"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>
                    <span className="font-medium">Date :</span>{" "}
                    {dateFormatter.format(event.startDate)}
                  </p>
                  <p>
                    <span className="font-medium">Lieu :</span> {event.location}
                  </p>
                  {event.category?.name ? (
                    <p>
                      <span className="font-medium">Catégorie :</span>{" "}
                      {event.category.name}
                    </p>
                  ) : null}
                  <p className="text-muted-foreground line-clamp-4 leading-relaxed">
                    {event.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

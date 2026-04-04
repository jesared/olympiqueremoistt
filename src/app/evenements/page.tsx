import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CategoryBadge } from "~/components/category-badge";
import { db as prisma } from "~/server/db";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeStyle: "short",
});

const truncateDescription = (description: string, maxLength = 140) => {
  if (description.length <= maxLength) {
    return description;
  }

  return `${description.slice(0, maxLength).trimEnd()}…`;
};

export default async function EvenementsPage() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      published: true,
      startDate: {
        gte: startOfToday,
      },
    },
    orderBy: {
      startDate: "asc",
    },
    select: {
      id: true,
      title: true,
      startDate: true,
      location: true,
      description: true,
      category: {
        select: {
          name: true,
          color: true,
        },
      },
    },
  });

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Événements</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Découvrez les prochains rendez-vous publics du club.
        </p>
      </header>

      {events.length === 0 ? (
        <p className="text-muted-foreground text-sm sm:text-base">
          Aucun événement à venir
        </p>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <Card
              key={event.id}
              className="h-full border-border/70 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {dateFormatter.format(event.startDate)}
                </p>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <p>
                  <span className="font-medium">Lieu :</span> {event.location}
                </p>
                {event.category ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Catégorie :</span>
                    <CategoryBadge
                      name={event.category.name}
                      color={event.category.color}
                    />
                  </div>
                ) : null}
                <p className="text-muted-foreground leading-relaxed">
                  {truncateDescription(event.description)}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </main>
  );
}

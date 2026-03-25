import { CalendarClock, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import SectionHeading from "~/components/home/section-heading";
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

export default async function EventsSection() {
  const today = new Date();
  const events = await prisma.event.findMany({
    where: {
      published: true,
      startDate: {
        gte: today,
      },
    },
    orderBy: {
      startDate: "asc",
    },
    take: 2,
    select: {
      id: true,
      title: true,
      startDate: true,
      location: true,
      description: true,
    },
  });

  return (
    <section aria-labelledby="evenements-title" className="space-y-6 sm:space-y-8">
      <SectionHeading
        id="evenements-title"
        eyebrow="Événements"
        title="Les prochains rendez-vous ORTT"
        description="Des rencontres sportives aux temps forts associatifs : vivez le club au-delà des entraînements."
      />

      {events.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Aucun événement à venir pour le moment.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id} className="h-full border-border/70">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <CalendarClock className="text-primary size-4" aria-hidden="true" />
                  <span>{dateFormatter.format(event.startDate)}</span>
                </p>
                <p className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MapPin className="text-primary size-4" aria-hidden="true" />
                  <span>{event.location}</span>
                </p>
                <p className="text-sm leading-relaxed">
                  {truncateDescription(event.description)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

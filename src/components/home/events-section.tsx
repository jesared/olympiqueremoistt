import { CalendarClock, MapPin } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import SectionHeading from "~/components/home/section-heading";

const events = [
  {
    title: "Soirée portes ouvertes",
    date: "Vendredi 5 avril 2026",
    location: "Salle Jean Armand, Reims",
    description:
      "Initiations gratuites, rencontres avec les entraîneurs et démonstrations des équipes régionales.",
  },
  {
    title: "Journée championnat - Nationale 3",
    date: "Dimanche 21 avril 2026",
    location: "Complexe René Tys",
    description:
      "Supportez l'équipe fanion dans une journée clé pour la montée avec animations et buvette sur place.",
  },
];

export default function EventsSection() {
  return (
    <section aria-labelledby="evenements-title" className="space-y-6 sm:space-y-8">
      <SectionHeading
        id="evenements-title"
        eyebrow="Événements"
        title="Les prochains rendez-vous ORTT"
        description="Des rencontres sportives aux temps forts associatifs : vivez le club au-delà des entraînements."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {events.map((event) => (
          <Card key={event.title} className="h-full border-border/70">
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">{event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <CalendarClock className="text-primary size-4" aria-hidden="true" />
                <span>{event.date}</span>
              </p>
              <p className="text-muted-foreground flex items-center gap-2 text-sm">
                <MapPin className="text-primary size-4" aria-hidden="true" />
                <span>{event.location}</span>
              </p>
              <p className="text-sm leading-relaxed">{event.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

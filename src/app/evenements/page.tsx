import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PageHeader } from "~/components/page/page-header";
import { events } from "~/data/content";

export default function EvenementsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Événements"
        description="Ne manquez aucun rendez-vous du club : animations, tournois conviviaux et rencontres associatives."
        actions={<Button>S'inscrire à un événement</Button>}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <Card key={event.id} className="h-full">
            <CardHeader>
              <CardTitle className="text-xl">{event.title}</CardTitle>
              <CardDescription>
                {new Date(event.date).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p>
                <span className="font-medium">Lieu :</span> {event.location}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
              <p className="text-xs font-medium">
                {event.registrationRequired
                  ? "Inscription requise"
                  : "Accès libre"}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

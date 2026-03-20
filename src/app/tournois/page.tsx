import { CalendarDays, MapPin, Trophy, Users } from "lucide-react";

import { TournamentRegistrationForm } from "~/components/tournaments/tournament-registration-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { featuredTournament } from "~/data/tournaments";

const keyInfos = [
  {
    title: "Date",
    value: new Date(featuredTournament.date).toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    icon: CalendarDays,
  },
  {
    title: "Lieu",
    value: `${featuredTournament.venue}, ${featuredTournament.city}`,
    icon: MapPin,
  },
  {
    title: "Organisateur",
    value: featuredTournament.organizer,
    icon: Trophy,
  },
  {
    title: "Capacité",
    value: `${featuredTournament.categories.reduce(
      (sum, category) => sum + category.slotsLeft,
      0,
    )} places restantes`,
    icon: Users,
  },
];

const schedule = [
  "08h15 · Accueil des joueurs et pointage",
  "09h00 · Début Tableau Senior A",
  "11h00 · Début Tableau Senior B",
  "14h00 · Début Tableau Loisir",
  "16h30 · Lancement du tableau Double",
  "19h00 · Finales et remise des récompenses",
];

export default function TournoisPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-4 py-8 sm:px-6 lg:px-8">
      <section className="from-primary/15 to-primary/5 rounded-2xl bg-gradient-to-r p-8 sm:p-10">
        <Badge className="mb-4" variant="secondary">
          Tournoi annuel du club
        </Badge>
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
          {featuredTournament.name}
        </h1>
        <p className="text-muted-foreground mt-4 max-w-2xl text-base sm:text-lg">
          Une journée de compétition, de convivialité et de performance ouverte
          aux licenciés et passionnés de tennis de table.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <a href="#inscriptions">Je m&apos;inscris</a>
          </Button>
          <Button asChild variant="outline">
            <a href="#programme">Voir le programme</a>
          </Button>
        </div>
      </section>

      <section id="infos-cles" className="space-y-4">
        <h2 className="text-2xl font-semibold">Infos clés</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {keyInfos.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold">{item.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="inscriptions" className="space-y-4">
        <h2 className="text-2xl font-semibold">Inscriptions</h2>
        <p className="text-muted-foreground text-sm">
          Choisissez vos tableaux, validez votre participation et recevez une
          confirmation de l&apos;équipe organisatrice.
        </p>
        <TournamentRegistrationForm tournament={featuredTournament} />
      </section>

      <section id="programme" className="space-y-4">
        <h2 className="text-2xl font-semibold">Programme</h2>
        <Card>
          <CardContent className="space-y-3 pt-6">
            {schedule.map((item) => (
              <p key={item} className="border-border text-sm not-last:pb-3 not-last:border-b">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section id="infos-pratiques" className="space-y-4">
        <h2 className="text-2xl font-semibold">Infos pratiques</h2>
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            <p>• Buvette et petite restauration disponibles toute la journée.</p>
            <p>
              • Parking gratuit à proximité du complexe et accès PMR à
              l&apos;entrée principale.
            </p>
            <p>
              • Clôture des inscriptions le{" "}
              {new Date(featuredTournament.registrationDeadline).toLocaleDateString(
                "fr-FR",
                {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                },
              )}
              .
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

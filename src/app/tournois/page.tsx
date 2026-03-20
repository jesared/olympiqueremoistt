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
    <main className="pb-12">
      <section className="px-4 py-12 sm:py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <Badge
              className="mb-4 border-sky-200 bg-sky-100 text-sky-800 hover:bg-sky-200"
              variant="outline"
            >
              Tournoi annuel du club
            </Badge>

            <p className="text-sm font-semibold tracking-wide text-slate-600 uppercase">
              Grand Prix de la Ville de Reims
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
              Tournoi National de Pâques
            </h1>

            <div className="mt-6 space-y-3 text-slate-700">
              <p className="text-base font-medium">📅 14 mai 2026</p>
              <p className="text-base font-medium">📍 Complexe René Tys</p>
              <p className="text-base font-medium">🏓 60 tables</p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="bg-emerald-600 text-white hover:bg-emerald-500"
              >
                <a href="#inscriptions">S&apos;inscrire</a>
              </Button>
              <Button
                asChild
                className="bg-blue-600 text-white hover:bg-blue-500"
              >
                <a href="#inscrits">Voir les inscrits</a>
              </Button>
            </div>
          </div>

          <div className="relative h-64 overflow-hidden rounded-2xl shadow-sm sm:h-80">
            <div
              className="h-full w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1534158914592-062992fbe900?auto=format&fit=crop&w=1200&q=80')",
              }}
              role="img"
              aria-label="Photo ambiance tournoi de tennis de table"
            />
          </div>
        </div>
      </section>

      <section
        id="inscrits"
        className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-semibold">Inscrits</h2>
        <Card>
          <CardContent className="pt-6 text-sm">
            La liste des inscrits sera publiée ici et mise à jour en temps réel
            par l&apos;organisation.
          </CardContent>
        </Card>
      </section>

      <section
        id="infos-cles"
        className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6 lg:px-8"
      >
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

      <section
        id="inscriptions"
        className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-semibold">Inscriptions</h2>
        <p className="text-muted-foreground text-sm">
          Choisissez vos tableaux, validez votre participation et recevez une
          confirmation de l&apos;équipe organisatrice.
        </p>
        <TournamentRegistrationForm tournament={featuredTournament} />
      </section>

      <section
        id="programme"
        className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-semibold">Programme</h2>
        <Card>
          <CardContent className="space-y-3 pt-6">
            {schedule.map((item) => (
              <p
                key={item}
                className="border-border text-sm not-last:border-b not-last:pb-3"
              >
                {item}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section
        id="infos-pratiques"
        className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-semibold">Infos pratiques</h2>
        <Card>
          <CardContent className="space-y-2 pt-6 text-sm">
            <p>
              • Buvette et petite restauration disponibles toute la journée.
            </p>
            <p>
              • Parking gratuit à proximité du complexe et accès PMR à
              l&apos;entrée principale.
            </p>
            <p>
              • Clôture des inscriptions le{" "}
              {new Date(
                featuredTournament.registrationDeadline,
              ).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
              .
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

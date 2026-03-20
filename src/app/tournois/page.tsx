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
    <main className="space-y-12 pb-12">
      <section
        className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 text-white"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1518112166137-85f9979a43d5?auto=format&fit=crop&w=1920&q=80')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
          <Badge className="mb-6 bg-white/15 text-white hover:bg-white/20" variant="outline">
            Tournoi annuel du club
          </Badge>

          <h1 className="text-4xl font-black tracking-[0.08em] uppercase sm:text-6xl lg:text-7xl">
            Grand Prix de la Ville de Reims
          </h1>

          <p className="mt-4 text-xl font-semibold tracking-[0.22em] uppercase text-white/90 sm:text-2xl">
            34e Tournoi National
          </p>

          <div className="mt-8 grid w-full max-w-3xl gap-3 text-left sm:grid-cols-3">
            <p className="rounded-lg bg-black/35 px-4 py-3 text-sm font-medium backdrop-blur-sm sm:text-base">
              📅 Jeudi 14 mai 2026
            </p>
            <p className="rounded-lg bg-black/35 px-4 py-3 text-sm font-medium backdrop-blur-sm sm:text-base">
              📍 Complexe sportif René Tys, Reims
            </p>
            <p className="rounded-lg bg-black/35 px-4 py-3 text-sm font-medium backdrop-blur-sm sm:text-base">
              🏓 60 tables
            </p>
          </div>

          <p className="mt-4 text-sm text-white/85 sm:text-base">
            (près du parc Léo Lagrange)
          </p>

          <div className="mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild className="w-full bg-blue-600 text-white hover:bg-blue-500 sm:w-auto">
              <a href="#inscrits">Voir les inscrits</a>
            </Button>
            <Button asChild className="w-full bg-emerald-600 text-white hover:bg-emerald-500 sm:w-auto">
              <a href="#inscriptions">S&apos;inscrire au tournoi</a>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm sm:text-sm">
              Ville de Reims
            </span>
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm sm:text-sm">
              Grand Est
            </span>
            <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-semibold tracking-wide uppercase backdrop-blur-sm sm:text-sm">
              Département Marne
            </span>
          </div>
        </div>
      </section>

      <section id="inscrits" className="mx-auto w-full max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Inscrits</h2>
        <Card>
          <CardContent className="pt-6 text-sm">
            La liste des inscrits sera publiée ici et mise à jour en temps réel
            par l&apos;organisation.
          </CardContent>
        </Card>
      </section>

      <section id="infos-cles" className="mx-auto w-full max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8">
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

      <section id="inscriptions" className="mx-auto w-full max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Inscriptions</h2>
        <p className="text-muted-foreground text-sm">
          Choisissez vos tableaux, validez votre participation et recevez une
          confirmation de l&apos;équipe organisatrice.
        </p>
        <TournamentRegistrationForm tournament={featuredTournament} />
      </section>

      <section id="programme" className="mx-auto w-full max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Programme</h2>
        <Card>
          <CardContent className="space-y-3 pt-6">
            {schedule.map((item) => (
              <p key={item} className="border-border text-sm not-last:border-b not-last:pb-3">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>
      </section>

      <section
        id="infos-pratiques"
        className="mx-auto w-full max-w-6xl space-y-4 px-4 sm:px-6 lg:px-8"
      >
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

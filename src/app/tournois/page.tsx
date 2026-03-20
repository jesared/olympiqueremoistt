import { CalendarDays, CircleDollarSign, MapPin, TableProperties } from "lucide-react";

import { TournamentRegistrationForm } from "~/components/tournaments/tournament-registration-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { featuredTournament } from "~/data/tournaments";

const keyInfos = [
  {
    title: "Date",
    value: new Date(featuredTournament.date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    icon: CalendarDays,
  },
  {
    title: "Lieu",
    value: `${featuredTournament.venue} · ${featuredTournament.city}`,
    icon: MapPin,
  },
  {
    title: "Tables",
    value: "60 tables",
    icon: TableProperties,
  },
  {
    title: "Tarifs",
    value: `${Math.min(...featuredTournament.categories.map((category) => category.feeEuro))}€ à ${Math.max(...featuredTournament.categories.map((category) => category.feeEuro))}€`,
    icon: CircleDollarSign,
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

const regulationTables = [
  {
    id: "tableau-a",
    title: "A - < 900 points",
    startTime: "8h",
    fee: "10€",
    levelGroup: "Débutant",
  },
  {
    id: "tableau-b",
    title: "B - 900 à 1299 points",
    startTime: "10h30",
    fee: "12€",
    levelGroup: "Confirmé",
  },
  {
    id: "tableau-c",
    title: "C - 1300 à 1699 points",
    startTime: "13h30",
    fee: "14€",
    levelGroup: "Confirmé",
  },
  {
    id: "tableau-open",
    title: "Open - Toutes séries",
    startTime: "16h",
    fee: "15€",
    levelGroup: "Open",
  },
];

const groupedRegulationTables = regulationTables.reduce<
  Record<string, typeof regulationTables>
>((accumulator, table) => {
  const group = accumulator[table.levelGroup] ?? [];
  group.push(table);
  accumulator[table.levelGroup] = group;
  return accumulator;
}, {});

export default function TournoisPage() {
  return (
    <main className="bg-slate-50 pb-12">
      <section className="bg-gradient-to-br from-white via-sky-50 to-slate-100 px-4 py-12 sm:py-16">
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
              <Button asChild className="bg-emerald-600 text-white hover:bg-emerald-500">
                <a href="#inscriptions">S&apos;inscrire</a>
              </Button>
              <Button asChild className="bg-blue-600 text-white hover:bg-blue-500">
                <a href="#inscrits">Voir les inscrits</a>
              </Button>
            </div>
          </div>

          <div className="relative h-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:h-80">
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
        className="mx-auto w-full max-w-6xl space-y-4 bg-white px-4 py-10 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-semibold">Inscrits</h2>
        <Card>
          <CardContent className="pt-6 text-sm">
            La liste des inscrits sera publiée ici et mise à jour en temps réel
            par l&apos;organisation.
          </CardContent>
        </Card>
      </section>

      <section id="infos-cles" className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold">Infos importantes</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {keyInfos.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="rounded-2xl border-slate-200 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Icon className="text-sky-700 size-4" />
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
        className="mx-auto w-full max-w-6xl space-y-4 bg-white px-4 py-10 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl font-semibold">Inscriptions</h2>
        <p className="text-muted-foreground text-sm">
          Choisissez vos tableaux, validez votre participation et recevez une
          confirmation de l&apos;équipe organisatrice.
        </p>

        <Card className="rounded-2xl border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Règlement (résumé)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="list-disc space-y-1 pl-5">
              <li>Matchs en 5 manches</li>
              <li>Poules + élimination directe</li>
              <li>2 tableaux max</li>
              <li>Pointage 15 min avant</li>
            </ul>
            <a
              href="/reglement-tournoi.pdf"
              className="text-blue-700 underline underline-offset-4 hover:text-blue-600"
            >
              Voir le règlement complet (PDF)
            </a>
          </CardContent>
        </Card>

        <div className="space-y-5">
          {Object.entries(groupedRegulationTables).map(([group, tables]) => (
            <div key={group} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold">{group}</h3>
                <Badge
                  className="border-slate-200 bg-slate-100 text-slate-700"
                  variant="outline"
                >
                  {group}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {tables.map((table) => (
                  <Card key={table.id} className="rounded-2xl border-slate-200 shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{table.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1 text-sm">
                      <p>⏰ {table.startTime}</p>
                      <p>💰 {table.fee}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        <TournamentRegistrationForm tournament={featuredTournament} />
      </section>

      <section id="programme" className="mx-auto w-full max-w-6xl space-y-4 px-4 py-10 sm:px-6 lg:px-8">
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
        className="mx-auto w-full max-w-6xl space-y-4 bg-white px-4 py-10 sm:px-6 lg:px-8"
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

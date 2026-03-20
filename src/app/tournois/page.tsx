import {
  Calendar,
  Clock,
  Euro,
  Hotel,
  MapPin,
  ParkingSquare,
  Route,
  TableProperties,
  Trophy,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { TournamentRegistrationForm } from "~/components/tournaments/tournament-registration-form";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { featuredTournament } from "~/data/tournaments";

const tournamentDate = new Date(featuredTournament.date).toLocaleDateString(
  "fr-FR",
  {
    day: "2-digit",
    month: "long",
    year: "numeric",
  },
);

const keyInfos = [
  {
    title: "Date",
    value: tournamentDate,
    icon: Calendar,
  },
  {
    title: "Lieu",
    value: "Complexe René Tys · Reims",
    icon: MapPin,
  },
  {
    title: "Nombre de tables",
    value: "60 tables disponibles",
    icon: TableProperties,
  },
  {
    title: "Type de tournoi",
    value: "Tournoi national homologué FFTT",
    icon: Trophy,
  },
];

const categories = [
  {
    id: "tableau-a",
    title: "A - < 900 points",
    schedule: "08h30",
    fee: "10€",
    badge: "Débutant",
  },
  {
    id: "tableau-b",
    title: "B - < 1200 points",
    schedule: "10h30",
    fee: "12€",
    badge: "Intermédiaire",
  },
  {
    id: "tableau-c",
    title: "C - < 1600 points",
    schedule: "13h30",
    fee: "14€",
    badge: "Intermédiaire",
  },
  {
    id: "tableau-open",
    title: "Open - Toutes séries",
    schedule: "16h00",
    fee: "15€",
    badge: "Open",
  },
];

const practicalInfos = [
  {
    title: "Parking",
    description: "Stationnement gratuit à proximité immédiate du complexe.",
    icon: ParkingSquare,
  },
  {
    title: "Buvette",
    description:
      "Restauration rapide et boissons disponibles toute la journée.",
    icon: UtensilsCrossed,
  },
  {
    title: "Accès",
    description:
      "Entrée PMR et accès direct depuis les axes principaux de Reims.",
    icon: Route,
  },
  {
    title: "Hébergement",
    description: "Hôtels partenaires à moins de 10 minutes du site.",
    icon: Hotel,
  },
];

export default function TournoisPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <section className="bg-muted/30 rounded-2xl border px-6 py-10 text-center sm:px-10 sm:py-14">
        <div className="mx-auto max-w-3xl space-y-4">
          <Badge variant="outline" className="bg-background">
            34e édition
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tournoi National de Pâques
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Grand Prix de la Ville de Reims
          </p>
          <p className="text-muted-foreground text-sm sm:text-base">
            Un des plus grands tournois de la région Grand Est.
          </p>

          <div className="text-muted-foreground mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <span>Jeudi 14 mai 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="size-4" />
              <span>Complexe René Tys</span>
            </div>
            <div className="flex items-center gap-2">
              <TableProperties className="size-4" />
              <span>60 tables</span>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
            <Button asChild>
              <a href="#inscriptions">S&apos;inscrire</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#inscrits">Voir les inscrits</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="infos-cles" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Infos clés</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {keyInfos.map((info) => {
            const Icon = info.icon;

            return (
              <Card key={info.title} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                    <Icon className="size-4" />
                    {info.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-semibold">{info.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="tableaux" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Tableaux</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <Card key={category.id} className="shadow-sm">
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-base">{category.title}</CardTitle>
                  <Badge variant="secondary">{category.badge}</Badge>
                </div>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Trophy className="size-4" />
                  <span>Niveau adapté à la catégorie</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-4" />
                  <span>{category.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="size-4" />
                  <span>{category.fee}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="reglement" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Règlement simplifié
        </h2>
        <Card className="shadow-sm">
          <CardContent className="space-y-4 pt-6 text-sm">
            <ul className="list-disc space-y-2 pl-5">
              <li>Matchs en 5 manches.</li>
              <li>Poules + élimination directe.</li>
              <li>2 tableaux maximum par joueur.</li>
              <li>Pointage obligatoire 15 minutes avant le début.</li>
            </ul>
            <Button asChild variant="outline" size="sm">
              <a href="/reglement-tournoi.pdf">Voir le règlement complet</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section id="infos-pratiques" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Infos pratiques
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {practicalInfos.map((item) => {
            const Icon = item.icon;

            return (
              <Card key={item.title} className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="size-4" />
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section id="inscrits" className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Inscrits</h2>
        <Card className="shadow-sm">
          <CardContent className="text-muted-foreground pt-6 text-sm">
            La liste des inscrits sera publiée ici et mise à jour en temps réel
            par l&apos;organisation.
          </CardContent>
        </Card>
      </section>

      <section
        id="inscriptions"
        className="bg-primary/5 rounded-2xl border px-6 py-8 text-center sm:px-10"
      >
        <div className="mx-auto max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Participez au tournoi
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Finalisez votre inscription en quelques clics et rejoignez une
            journée de compétition conviviale.
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild>
              <a href="#formulaire-inscription">S&apos;inscrire</a>
            </Button>
            <Button asChild variant="outline">
              <a href="#inscrits">Voir les inscrits</a>
            </Button>
          </div>
        </div>
      </section>

      <section id="formulaire-inscription" className="space-y-4">
        <h3 className="text-xl font-semibold tracking-tight">
          Formulaire d&apos;inscription
        </h3>
        <p className="text-muted-foreground flex items-center gap-2 text-sm">
          <Users className="size-4" />
          Les places sont limitées, pensez à vous inscrire rapidement.
        </p>
        <TournamentRegistrationForm tournament={featuredTournament} />
      </section>
    </main>
  );
}

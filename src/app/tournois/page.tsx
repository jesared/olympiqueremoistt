import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PageHeader } from "~/components/page/page-header";
import { competitions } from "~/data/content";

export default function TournoisPage() {
  const today = new Date();
  const upcomingTournaments = competitions.filter(
    (competition) => new Date(competition.date) >= today,
  );
  const pastTournaments = competitions.filter(
    (competition) => new Date(competition.date) < today,
  );

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Tournois"
        description="Retrouvez les prochains tournois ORTT, suivez les inscriptions et accédez rapidement aux informations importantes."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Voir les inscrits</Button>
            <Button>S&apos;inscrire</Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>📅 Tournois à venir</CardTitle>
          <CardDescription>
            Inscriptions ouvertes, dates de compétition et lieux d’accueil.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingTournaments.map((competition) => (
              <article
                key={competition.id}
                className="bg-card ring-border/50 hover:ring-primary/40 group relative flex h-full flex-col justify-between rounded-xl border p-5 ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base leading-tight font-semibold">
                      {competition.name}
                    </h3>
                    <Badge className="shrink-0">Tournoi</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {new Date(competition.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm">{competition.location}</p>
                </div>
                <Button className="mt-5 w-full">Voir le tournoi</Button>
              </article>
            ))}
          </div>

          {upcomingTournaments.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Aucun tournoi à venir pour le moment.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📊 Tournois passés</CardTitle>
          <CardDescription>
            Historique des tournois récemment joués par le club.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {pastTournaments.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {pastTournaments.map((competition) => (
                <li
                  key={competition.id}
                  className="border-border rounded-md border p-3"
                >
                  <p className="font-medium">{competition.name}</p>
                  <p className="text-muted-foreground">
                    {new Date(competition.date).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}{" "}
                    · {competition.location}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground text-sm">
              Aucun tournoi passé n&apos;est disponible.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📍 Infos pratiques</CardTitle>
          <CardDescription>
            Tout ce qu’il faut savoir avant votre inscription.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            • Les inscriptions ferment généralement 72h avant la date du
            tournoi.
          </p>
          <p>
            • Merci de vérifier votre licence et votre certificat avant de
            valider votre participation.
          </p>
          <p>
            • Pour toute question logistique, contactez l&apos;équipe ORTT via
            l&apos;espace club.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

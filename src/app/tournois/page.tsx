import { Button } from "~/components/ui/button";
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
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-border text-muted-foreground border-b">
                  <th className="py-3 pr-4 font-medium">Compétition</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Lieu</th>
                  <th className="px-4 py-3 font-medium">Catégorie</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {upcomingTournaments.map((competition) => (
                  <tr
                    key={competition.id}
                    className="border-border/70 border-b last:border-b-0"
                  >
                    <td className="py-3 pr-4 font-medium">
                      {competition.name}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(competition.date).toLocaleDateString("fr-FR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">{competition.location}</td>
                    <td className="px-4 py-3">{competition.category}</td>
                    <td className="px-4 py-3">
                      <span className="bg-muted inline-flex rounded-full px-2 py-1 text-xs">
                        {competition.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {upcomingTournaments.length === 0 && (
                  <tr>
                    <td className="text-muted-foreground py-4" colSpan={5}>
                      Aucun tournoi à venir pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                <li key={competition.id} className="border-border rounded-md border p-3">
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

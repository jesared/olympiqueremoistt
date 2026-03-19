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

export default function CompetitionsPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Compétitions"
        description="Consultez les prochaines compétitions ORTT et suivez les rendez-vous officiels de la saison."
        actions={<Button>Exporter le calendrier</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>Calendrier des compétitions</CardTitle>
          <CardDescription>
            Préparation API FFTT : structure prête pour des données dynamiques.
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
                {competitions.map((competition) => (
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
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

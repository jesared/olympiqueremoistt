import { PageHeader } from "~/components/page/page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const locations = [
  {
    title: "Complexe Sportif Géo André",
    description:
      "Rue François Mauriac, face au Creps, et à côté de la patinoire Jacques Barot. Pour les matches de championnat par équipes uniquement.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Complexe%20Sportif%20G%C3%A9o%20Andr%C3%A9%20Reims",
  },
  {
    title: "Complexe Sportif René Tys",
    description:
      "5 impasse Léo Lagrange à Reims, à côté du parc Léo Lagrange. Pour les matches de tournoi uniquement. Pour la salle d'entraînement, accès sur le petit parking côté rue de Courlancy.",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Complexe%20Sportif%20Ren%C3%A9%20Tys%20Reims",
  },
];

export default function PlanAccesPage() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Plan d'accès"
        description="Retrouvez les lieux d'entraînement et de compétition de l'ORTT."
      />

      <section className="grid gap-4">
        {locations.map((location) => (
          <Card key={location.title}>
            <CardHeader>
              <CardTitle>{location.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>{location.description}</p>
              <Button asChild variant="outline" className="w-fit">
                <a href={location.mapUrl} target="_blank" rel="noreferrer">
                  Ouvrir sur Google Maps
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

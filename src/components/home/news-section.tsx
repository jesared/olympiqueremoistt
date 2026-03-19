import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import SectionHeading from "~/components/home/section-heading";

const newsItems = [
  {
    title: "Trois podiums au tournoi régional de Reims",
    excerpt:
      "Les catégories jeunes et seniors confirment leur progression avec des performances solides sur l'ensemble du week-end.",
    date: "16 mars 2026",
  },
  {
    title: "Ouverture d'un créneau compétition le mercredi soir",
    excerpt:
      "Un entraînement encadré supplémentaire est lancé pour renforcer la préparation tactique avant les rencontres.",
    date: "12 mars 2026",
  },
  {
    title: "Stage de printemps : inscriptions en cours",
    excerpt:
      "Quatre journées intensives autour du service, du démarrage revers et du jeu de transition pour tous les niveaux.",
    date: "8 mars 2026",
  },
];

export default function NewsSection() {
  return (
    <section aria-labelledby="actualites-title" className="space-y-6 sm:space-y-8">
      <SectionHeading
        id="actualites-title"
        eyebrow="Actualités"
        title="Les dernières nouvelles du club"
        description="Résultats, vie associative et annonces importantes : tout ce qu'il faut savoir cette semaine à l'ORTT."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item) => (
          <Card key={item.title} className="h-full">
            <CardHeader className="space-y-2">
              <p className="text-primary text-xs font-semibold tracking-[0.14em] uppercase">
                {item.date}
              </p>
              <CardTitle className="text-lg leading-snug">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {item.excerpt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

const newsItems = [
  {
    title: "Tournoi régional : 3 podiums pour l'ORTT",
    description:
      "Nos équipes jeunes et seniors ont brillé ce week-end à Reims avec trois places sur le podium.",
    date: "16 mars 2026",
  },
  {
    title: "Nouveaux créneaux d'entraînement",
    description:
      "À partir du 1er avril, une séance supplémentaire est ouverte le mercredi soir pour les compétiteurs.",
    date: "12 mars 2026",
  },
  {
    title: "Stage vacances de printemps",
    description:
      "Le club organise un stage intensif sur 4 jours pour perfectionner le service, la régularité et le jeu court.",
    date: "8 mars 2026",
  },
];

export default function NewsSection() {
  return (
    <section aria-labelledby="news-heading" className="py-12 sm:py-16">
      <div className="mb-8 sm:mb-10">
        <h2
          id="news-heading"
          className="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          Actualités
        </h2>
        <p className="text-muted-foreground mt-3 max-w-2xl text-sm sm:text-base">
          Retrouvez les dernières informations du club, les résultats et les
          prochains rendez-vous.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {newsItems.map((item) => (
          <Card key={item.title} className="h-full">
            <CardHeader>
              <p className="text-primary text-xs font-semibold tracking-wide uppercase">
                {item.date}
              </p>
              <CardTitle className="text-lg leading-snug">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm leading-relaxed">
                {item.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

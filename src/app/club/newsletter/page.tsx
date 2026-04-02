import { PageHeader } from "~/components/page/page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const highlights = [
  "Résultats des équipes et moments forts du club",
  "Calendrier des compétitions et événements",
  "Coulisses, portraits et vie associative",
  "Infos pratiques et rendez-vous de la semaine",
];

const latestNewsletters = [
  {
    title: "La bulle du ping — Octobre",
    date: "Octobre",
    href: "https://www.ortt.fr/wp-content/uploads/2026/04/LA-BULLE-DU-PING-EDITION-OCTOBRE-1.pdf",
  },
  {
    title: "La bulle du ping — Décembre",
    date: "Décembre",
    href: "https://www.ortt.fr/wp-content/uploads/2026/04/LA-BULLE-DU-PING-EDITION-DECEMBRE.pdf",
  },
];

export default function NewsletterPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Newsletter - La bulle du ping"
        description="Recevez l’essentiel de la vie ORTT : actus, événements et moments forts du club."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Un résumé clair et utile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              La bulle du ping est la newsletter officielle de l’ORTT. Chaque édition
              vous propose un condensé des actualités du club, des résultats marquants
              et des rendez-vous à ne pas manquer.
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
              {highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>S’inscrire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Pour recevoir la newsletter, contactez le club et indiquez votre e-mail.
            </p>
            <Button asChild className="w-full">
              <a href="/contact">Contacter le club</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Dernières newsletters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Retrouvez ici les derniers numéros pour les relire à tout moment.
              Les archives sont mises à jour régulièrement.
            </p>
            <ul className="space-y-3">
              {latestNewsletters.map((item) => (
                <li
                  key={item.title}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/70 px-3 py-2"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-muted-foreground text-xs">{item.date}</p>
                  </div>
                  {item.href ? (
                    <Button asChild size="sm" variant="outline">
                      <a href={item.href} target="_blank" rel="noreferrer">
                        Lire
                      </a>
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      Lien à venir
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>S’inscrire</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Inscrivez-vous pour recevoir les prochaines éditions.
            </p>
            <Button asChild className="w-full">
              <a href="/contact">S’inscrire</a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Rythme d’envoi</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            La newsletter est envoyée régulièrement pendant la saison sportive, en fonction
            de l’actualité du club.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PageHeader } from "~/components/page/page-header";
import { newsArticles } from "~/data/content";

export default function ActualitesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Actualités"
        description="Retrouvez les dernières informations du club ORTT : résultats sportifs, vie associative et annonces importantes."
        actions={<Button>Voir toutes les archives</Button>}
      />

      <section className="grid gap-4 md:grid-cols-2">
        {newsArticles.map((article) => (
          <Card key={article.id} className="h-full">
            <CardHeader className="space-y-3">
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {article.category}
              </div>
              <CardTitle className="text-xl leading-tight">
                {article.title}
              </CardTitle>
              <CardDescription>
                {new Date(article.date).toLocaleDateString("fr-FR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {article.excerpt}
              </p>
              <Button variant="outline">Lire l'article</Button>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

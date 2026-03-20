import { AlertTriangle, CheckCircle2, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";

import { ReanalyzeButton } from "~/app/admin/audit/reanalyze-button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { generateAuditReport } from "~/lib/audit";
import { requireAdmin } from "~/lib/auth";

function scoreVariant(score: number): "success" | "warning" | "destructive" {
  if (score >= 80) return "success";
  if (score >= 60) return "warning";
  return "destructive";
}

export default async function AdminAuditPage() {
  await requireAdmin();
  const report = await generateAuditReport();

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <ShieldCheck className="text-primary size-6" />
              Audit automatique du projet
            </CardTitle>
            <CardDescription>
              Analyse générée côté serveur le {new Date(report.generatedAt).toLocaleString("fr-FR")}
            </CardDescription>
          </div>
          <ReanalyzeButton />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={scoreVariant(report.globalScore)} className="px-3 py-1 text-sm">
              Score global : {report.globalScore} / 100
            </Badge>
            <Badge variant="outline">{report.summary.totalPages} pages détectées</Badge>
            <Badge variant="outline">{report.summary.adminPages} pages admin</Badge>
            <Badge variant="outline">{report.summary.apiRoutes} API routes</Badge>
            <Badge variant="outline">{report.summary.prismaModels} modèles Prisma</Badge>
          </div>
          <Progress value={report.globalScore} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {report.categories.map((category) => (
          <Card key={category.key}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{category.title}</CardTitle>
                <Badge variant={scoreVariant(category.score)}>{category.score}%</Badge>
              </div>
              <Progress value={category.score} />
            </CardHeader>
            <CardContent className="space-y-5">
              <section className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                  Points OK
                </p>
                <ul className="space-y-1 text-sm">
                  {category.ok.length > 0 ? (
                    category.ok.map((item) => <li key={item.label}>✅ {item.label}</li>)
                  ) : (
                    <li className="text-muted-foreground">Aucun point fort détecté automatiquement.</li>
                  )}
                </ul>
              </section>

              <section className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <AlertTriangle className="size-4 text-amber-600" />
                  Problèmes
                </p>
                <ul className="space-y-1 text-sm">
                  {category.issues.length > 0 ? (
                    category.issues.map((item) => <li key={item.label}>⚠️ {item.label}</li>)
                  ) : (
                    <li className="text-muted-foreground">Aucun problème critique détecté.</li>
                  )}
                </ul>
              </section>

              <section className="space-y-2">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <Lightbulb className="size-4 text-blue-600" />
                  Recommandations
                </p>
                <ul className="space-y-1 text-sm">
                  {category.recommendations.length > 0 ? (
                    category.recommendations.map((item) => <li key={item.label}>💡 {item.label}</li>)
                  ) : (
                    <li className="text-muted-foreground">Rien à prioriser dans cette catégorie.</li>
                  )}
                </ul>
              </section>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="size-5 text-violet-500" />
            Notes d&apos;interprétation
          </CardTitle>
          <CardDescription>
            L&apos;analyse est semi-automatique : certains points sont déduits à partir de la structure du code.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

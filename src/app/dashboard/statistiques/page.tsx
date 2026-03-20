import { ChartLine, TimerReset } from "lucide-react";

import { DashboardHeading } from "~/components/dashboard/dashboard-heading";
import { StatCard } from "~/components/dashboard/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { dashboardStats, participations } from "~/data/dashboard";

export default function DashboardStatsPage() {
  const averagePoints = Math.round(
    dashboardStats.totalPoints / Math.max(participations.length, 1),
  );

  return (
    <div className="space-y-4">
      <DashboardHeading
        title="Statistiques"
        description="KPIs simples prêts pour une future API FFTT."
        action={{ label: "Actualiser", icon: <TimerReset className="mr-1 size-4" /> }}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard
          title="Total points gagnés"
          value={dashboardStats.totalPoints}
          hint="Sur vos dernières participations"
          icon={<ChartLine className="text-muted-foreground size-4" />}
        />
        <StatCard
          title="Moyenne / match"
          value={averagePoints}
          hint="Base de calcul mock"
          icon={<ChartLine className="text-muted-foreground size-4" />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Évolutions suggérées</CardTitle>
          <CardDescription>Préparer l&apos;ouverture vers un dashboard admin et FFTT.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="bg-muted/40 rounded-lg p-3">Connexion FFTT API pour importer classement officiel.</p>
          <p className="bg-muted/40 rounded-lg p-3">Module admin pour gérer les convocations d&apos;équipe.</p>
          <p className="bg-muted/40 rounded-lg p-3">Comparateur saison N / N-1 (points, victoires, assiduité).</p>
          <p className="bg-muted/40 rounded-lg p-3">Alertes automatiques de changement de planning.</p>
        </CardContent>
      </Card>
    </div>
  );
}

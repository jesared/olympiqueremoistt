import { Trophy } from "lucide-react";

import { DashboardHeading } from "~/components/dashboard/dashboard-heading";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { participations } from "~/data/dashboard";

export default function DashboardParticipationsPage() {
  return (
    <div className="space-y-4">
      <DashboardHeading
        title="Mes participations"
        description="Historique de vos matchs récents."
        action={{ label: "Voir mon palmarès", icon: <Trophy className="mr-1 size-4" /> }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Historique</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {participations.map((participation) => (
            <div key={participation.id} className="bg-muted/40 rounded-lg p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{participation.event}</p>
                <p className="text-sm font-semibold">+{participation.pointsEarned} pts</p>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                {participation.date} • {participation.result}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

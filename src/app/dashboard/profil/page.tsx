import { Pencil } from "lucide-react";

import { DashboardHeading } from "~/components/dashboard/dashboard-heading";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { dashboardUser } from "~/data/dashboard";

export default function DashboardProfilePage() {
  return (
    <div className="space-y-4">
      <DashboardHeading
        title="Mon profil"
        description="Informations de licence et suivi joueur."
        action={{ label: "Modifier", icon: <Pencil className="mr-1 size-4" /> }}
      />

      <Card>
        <CardHeader>
          <CardTitle>{dashboardUser.name}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="bg-muted/40 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Email</p>
            <p className="text-sm font-medium">{dashboardUser.email}</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Niveau équipe</p>
            <p className="text-sm font-medium">{dashboardUser.level}</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Classement FFTT</p>
            <div className="mt-1">
              <Badge>{dashboardUser.ranking}</Badge>
            </div>
          </div>
          <div className="bg-muted/40 rounded-lg p-3">
            <p className="text-muted-foreground text-xs">Licence</p>
            <p className="text-sm font-medium">{dashboardUser.licenseId}</p>
          </div>
          <div className="bg-muted/40 rounded-lg p-3 sm:col-span-2">
            <p className="text-muted-foreground text-xs">Groupe d'entraînement</p>
            <p className="text-sm font-medium">{dashboardUser.trainingGroup}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

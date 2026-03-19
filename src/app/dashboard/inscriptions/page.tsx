import { Plus } from "lucide-react";

import { DashboardHeading } from "~/components/dashboard/dashboard-heading";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { registrations } from "~/data/dashboard";

export default function DashboardRegistrationsPage() {
  return (
    <div className="space-y-4">
      <DashboardHeading
        title="Mes inscriptions"
        description="Tournois et événements avec statut."
        action={{ label: "S'inscrire", icon: <Plus className="mr-1 size-4" /> }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Inscriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {registrations.map((registration) => (
            <div
              key={registration.id}
              className="bg-muted/40 flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium">{registration.name}</p>
                <p className="text-muted-foreground text-xs">
                  {registration.type} • {registration.date} • {registration.city}
                </p>
              </div>
              <Badge
                variant={
                  registration.status === "Confirmée"
                    ? "success"
                    : registration.status === "En attente"
                      ? "warning"
                      : "destructive"
                }
              >
                {registration.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

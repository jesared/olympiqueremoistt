import { Plus } from "lucide-react";

import { DashboardHeading } from "~/components/dashboard/dashboard-heading";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { tournamentRegistrations } from "~/data/tournaments";

export default function DashboardRegistrationsPage() {
  return (
    <div className="space-y-4">
      <DashboardHeading
        title="Mes inscriptions"
        description="Retrouvez tous vos tournois, tableaux sélectionnés et statuts de validation."
        action={{
          label: "Nouvelle inscription",
          icon: <Plus className="mr-1 size-4" />,
          href: "/dashboard/inscriptions/nouvelle",
        }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Inscriptions en cours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tournamentRegistrations.map((registration) => (
            <div
              key={registration.id}
              className="bg-muted/40 flex flex-col gap-3 rounded-lg p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {registration.tournamentName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {registration.date} • {registration.city}
                </p>
                <p className="text-muted-foreground text-xs">
                  Tableaux : {registration.selectedCategories.join(" • ")}
                </p>
              </div>
              <Badge
                variant={
                  registration.status === "Validé" ? "success" : "warning"
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

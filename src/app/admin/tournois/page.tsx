import { CalendarClock, Plus } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { tournaments } from "~/data/admin";

export default function AdminTournoisPage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <div>
            <CardTitle>Créer un tournoi</CardTitle>
            <CardDescription>
              UI prête pour branchement API / base de données.
            </CardDescription>
          </div>
          <Button>
            <Plus className="size-4" />
            Nouveau tournoi
          </Button>
        </CardHeader>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tournaments.map((tournament) => (
          <Card key={tournament.id}>
            <CardHeader>
              <CardTitle className="text-base">{tournament.name}</CardTitle>
              <CardDescription className="inline-flex items-center gap-2">
                <CalendarClock className="size-4" />
                {tournament.date} • {tournament.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground text-sm">
                {tournament.registrations} inscrits sur ce tournoi.
              </p>
              <div className="flex flex-wrap gap-2">
                {tournament.brackets.map((bracket) => (
                  <Badge key={bracket} variant="secondary">
                    {bracket}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

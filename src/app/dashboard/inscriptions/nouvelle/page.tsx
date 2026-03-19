import { ChevronLeft } from "lucide-react";

import Link from "next/link";

import { DashboardHeading } from "~/components/dashboard/dashboard-heading";
import { TournamentRegistrationForm } from "~/components/tournaments/tournament-registration-form";
import { Button } from "~/components/ui/button";
import { featuredTournament } from "~/data/tournaments";

export default function NewTournamentRegistrationPage() {
  return (
    <div className="space-y-4">
      <div>
        <Button variant="ghost" asChild>
          <Link href="/dashboard/inscriptions">
            <ChevronLeft className="mr-1 size-4" />
            Retour à mes inscriptions
          </Link>
        </Button>
      </div>

      <DashboardHeading
        title="Inscription tournoi"
        description="Choisissez vos tableaux et validez votre pré-inscription en moins d'une minute."
      />

      <TournamentRegistrationForm tournament={featuredTournament} />
    </div>
  );
}

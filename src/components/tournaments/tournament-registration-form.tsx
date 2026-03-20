"use client";

import { useMemo, useState } from "react";

import { CheckCircle2, CreditCard, Timer } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { type Tournament } from "~/data/tournaments";

type TournamentRegistrationFormProps = {
  tournament: Tournament;
};

export function TournamentRegistrationForm({
  tournament,
}: TournamentRegistrationFormProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalAmount = useMemo(() => {
    return tournament.categories
      .filter((category) => selectedCategories.includes(category.id))
      .reduce((sum, category) => sum + category.feeEuro, 0);
  }, [selectedCategories, tournament.categories]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId],
    );
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
      <Card>
        <CardHeader>
          <CardTitle>{tournament.name}</CardTitle>
          <CardDescription>
            {tournament.city} • {tournament.venue} • {tournament.date}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {tournament.categories.map((category) => {
            const checked = selectedCategories.includes(category.id);

            return (
              <label
                key={category.id}
                className="hover:border-primary/50 bg-muted/40 flex cursor-pointer items-start gap-3 rounded-lg border border-transparent p-3 transition"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleCategory(category.id)}
                  aria-label={`Sélectionner ${category.name}`}
                  className="mt-0.5"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium">{category.name}</p>
                    <Badge variant="secondary">{category.feeEuro}€</Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {category.level} • Début {category.startTime}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {category.slotsLeft} places restantes
                  </p>
                </div>
              </label>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Validation de l&apos;inscription</CardTitle>
          <CardDescription>
            Inscription rapide et paiement intégré prochainement.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/40 rounded-lg p-3 text-sm">
            <p className="mb-2 font-medium">Récapitulatif</p>
            <p className="text-muted-foreground">
              Tableaux sélectionnés : {selectedCategories.length}
            </p>
            <p className="text-muted-foreground">
              Montant estimé : {totalAmount}€
            </p>
          </div>

          <div className="text-muted-foreground space-y-2 text-xs">
            <p className="flex items-center gap-2">
              <Timer className="size-3.5" />
              Clôture des inscriptions : {tournament.registrationDeadline}
            </p>
            <p className="flex items-center gap-2">
              <CreditCard className="size-3.5" />
              {tournament.paymentPolicy}
            </p>
          </div>

          <Button
            className="w-full"
            disabled={selectedCategories.length === 0}
            onClick={() => setIsSubmitted(true)}
          >
            Enregistrer mon inscription
          </Button>

          {isSubmitted ? (
            <div className="bg-primary/10 text-primary rounded-lg p-3 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <CheckCircle2 className="size-4" />
                Inscription enregistrée (mock)
              </p>
              <p className="text-muted-foreground mt-1 text-xs">
                Statut initial : En attente de validation
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

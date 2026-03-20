import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

import { createCategory } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "Veuillez renseigner le nom (et un slug valide).",
  "slug-taken": "Ce slug existe déjà. Choisissez-en un autre.",
};

export default async function AdminCreateCategoryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const error = params.error ? ERROR_MESSAGES[params.error] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une catégorie</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={createCategory} className="space-y-4">
            {error ? (
              <p className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
                {error}
              </p>
            ) : null}

            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nom
              </label>
              <Input id="name" name="name" placeholder="Ex: Championnats" required />
            </div>

            <div className="grid gap-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug
              </label>
              <Input id="slug" name="slug" placeholder="Ex: championnats" />
              <p className="text-muted-foreground text-xs">
                Optionnel : généré automatiquement depuis le nom si vide.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit">Créer</Button>
              <Button asChild variant="outline">
                <Link href="/admin/categories">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { createEvent } from "./actions";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "Veuillez remplir tous les champs obligatoires.",
  "invalid-start-date": "La date de début est invalide.",
  "invalid-end-date": "La date de fin est invalide.",
  "end-before-start": "La date de fin doit être après la date de début.",
};

export default async function AdminCreateEventPage({
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
          <CardTitle>Créer un événement</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={createEvent} className="space-y-4">
            {error ? (
              <p className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
                {error}
              </p>
            ) : null}

            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">
                Titre
              </label>
              <Input id="title" name="title" required />
            </div>

            <div className="grid gap-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug
              </label>
              <Input id="slug" name="slug" required />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea id="description" name="description" required />
            </div>

            <div className="grid gap-2">
              <label htmlFor="location" className="text-sm font-medium">
                Lieu
              </label>
              <Input id="location" name="location" required />
            </div>

            <div className="grid gap-2">
              <label htmlFor="startDate" className="text-sm font-medium">
                Date de début
              </label>
              <Input
                id="startDate"
                name="startDate"
                type="datetime-local"
                required
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="endDate" className="text-sm font-medium">
                Date de fin
              </label>
              <Input id="endDate" name="endDate" type="datetime-local" />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="published"
                name="published"
                type="checkbox"
                className="border-input h-4 w-4 rounded border"
              />
              <label htmlFor="published" className="text-sm font-medium">
                Publier maintenant
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Créer</Button>
              <Button asChild variant="outline">
                <Link href="/admin/events">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

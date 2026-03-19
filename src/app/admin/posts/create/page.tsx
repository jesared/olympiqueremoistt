import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

import { createPost } from "./actions";
import { PostCreateFormContentField } from "./PostCreateForm";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "Veuillez remplir les champs obligatoires.",
  "invalid-image": "L'URL de l'image est invalide.",
};

export default async function AdminCreatePostPage({
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
          <CardTitle>Créer une actualité</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={createPost} className="space-y-4">
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

            <p className="text-muted-foreground text-xs">
              Le slug est généré automatiquement à partir du titre.
            </p>

            <PostCreateFormContentField />

            <div className="grid gap-2">
              <label htmlFor="image" className="text-sm font-medium">
                Image (URL)
              </label>
              <Input id="image" name="image" type="url" />
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
                <Link href="/admin/posts">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

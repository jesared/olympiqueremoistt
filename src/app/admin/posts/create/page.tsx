import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { createPost } from "./actions";
import { PostCreateForm } from "./PostCreateForm";

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
          {error ? (
            <p className="border-destructive/50 bg-destructive/10 text-destructive mb-4 rounded-md border p-3 text-sm">
              {error}
            </p>
          ) : null}

          <PostCreateForm action={createPost} />
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { PageFormFields } from "~/app/admin/pages/PageFormFields";
import { db as prisma } from "~/server/db";

import { updatePage } from "../../actions";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "Veuillez renseigner le titre (et un slug valide).",
  "slug-taken": "Ce slug existe déjà. Choisissez-en un autre.",
};

export default async function AdminEditPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const { error } = await searchParams;

  const page = await prisma.page.findUnique({
    where: { id },
  });

  if (!page) {
    notFound();
  }

  const errorMessage = error ? ERROR_MESSAGES[error] : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Éditer la page</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={updatePage.bind(null, page.id)} className="space-y-4">
            {errorMessage ? (
              <p className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
                {errorMessage}
              </p>
            ) : null}

            <PageFormFields
              initialTitle={page.title}
              initialSlug={page.slug}
              initialContent={page.content}
              initialPublished={page.published}
              autoSlug={false}
            />

            <div className="flex flex-wrap gap-2">
              <Button type="submit">Enregistrer</Button>
              <Button asChild variant="outline">
                <Link href="/admin/pages">Annuler</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

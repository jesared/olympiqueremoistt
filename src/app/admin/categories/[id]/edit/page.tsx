import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CategoryFormFields } from "~/app/admin/categories/CategoryFormFields";
import { db as prisma } from "~/server/db";

import { updateCategory } from "../actions";

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "Veuillez renseigner le nom (et un slug valide).",
  "slug-taken": "Ce slug existe déjà. Choisissez-en un autre.",
};

export default async function AdminEditCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
    },
  });

  if (!category) {
    notFound();
  }

  const error = resolvedSearchParams.error
    ? ERROR_MESSAGES[resolvedSearchParams.error]
    : null;

  const updateCategoryWithId = updateCategory.bind(null, category.id);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier la catégorie</CardTitle>
        </CardHeader>

        <CardContent>
          <form action={updateCategoryWithId} className="space-y-4">
            {error ? (
              <p className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
                {error}
              </p>
            ) : null}

            <CategoryFormFields
              initialName={category.name}
              initialSlug={category.slug}
              initialColor={category.color}
              autoSlug={false}
            />

            <div className="flex flex-wrap gap-2">
              <Button type="submit">Enregistrer</Button>
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

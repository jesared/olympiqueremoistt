import Link from "next/link";

import { seedPresentationPage } from "~/app/admin/pages/actions";
import { PageDeleteButton } from "~/app/admin/pages/PageDeleteButton";
import { PagePublishToggleButton } from "~/app/admin/pages/PagePublishToggleButton";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { db as prisma } from "~/server/db";

export default async function AdminPagesPage({
  searchParams,
}: {
  searchParams: Promise<{ seed?: string }>;
}) {
  const { seed } = await searchParams;
  const pages = await prisma.page.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      updatedAt: true,
    },
  });

  const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
  });
  const hasPresentation = pages.some(
    (page) => page.slug === "presentation-du-club",
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Pages du site</CardTitle>
          <div className="flex flex-wrap gap-2">
            {!hasPresentation ? (
              <form action={seedPresentationPage}>
                <Button type="submit" variant="outline">
                  Importer Présentation
                </Button>
              </form>
            ) : null}
            <Button asChild>
              <Link href="/admin/pages/create">Créer une page</Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {seed === "done" ? (
            <p className="border-emerald-200 bg-emerald-50 text-emerald-700 mb-4 rounded-md border px-3 py-2 text-sm">
              Présentation importée avec succès. Vous pouvez la modifier si besoin.
            </p>
          ) : null}
          {seed === "exists" ? (
            <p className="border-amber-200 bg-amber-50 text-amber-700 mb-4 rounded-md border px-3 py-2 text-sm">
              La page Présentation existe déjà.
            </p>
          ) : null}
          {pages.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune page trouvée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Publication</TableHead>
                  <TableHead>MAJ</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.title}</TableCell>
                    <TableCell>/p/{page.slug}</TableCell>
                    <TableCell className="text-right">
                      <PagePublishToggleButton
                        pageId={page.id}
                        initialPublished={page.published}
                      />
                    </TableCell>
                    <TableCell>{dateFormatter.format(page.updatedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/pages/${page.id}/edit`}>Modifier</Link>
                        </Button>
                        <PageDeleteButton pageId={page.id} pageTitle={page.title} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

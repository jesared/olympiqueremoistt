import Link from "next/link";

import { CategoryDeleteButton } from "~/app/admin/categories/CategoryDeleteButton";
import { CategoryBadge } from "~/components/category-badge";
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

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Catégories</CardTitle>
          <Button asChild>
            <Link href="/admin/categories/create">Créer une catégorie</Link>
          </Button>
        </CardHeader>

        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucune catégorie trouvée.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Aperçu</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>
                      <CategoryBadge name={category.name} color={category.color} />
                    </TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/categories/${category.id}/edit`}>Modifier</Link>
                        </Button>
                        <CategoryDeleteButton
                          categoryId={category.id}
                          categoryName={category.name}
                        />
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

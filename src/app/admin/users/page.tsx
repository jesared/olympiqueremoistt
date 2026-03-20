import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { requireAdmin } from "~/lib/auth";
import { db as prisma } from "~/server/db";

import { type AppRole } from "./roles";
import { UsersTableWithFilters } from "./UsersTableWithFilters";

type UserListItem = {
  id: string;
  name: string | null;
  email: string | null;
  role: AppRole;
  createdAt?: string | null;
};

type AdminUsersPageProps = {
  searchParams?: Promise<{ page?: string }> | { page?: string };
};

const PAGE_SIZE = 10;

export default async function AdminUsersPage({ searchParams }: AdminUsersPageProps) {
  const session = await requireAdmin();

  const resolvedSearchParams = await Promise.resolve(searchParams);
  const requestedPage = Number.parseInt(resolvedSearchParams?.page ?? "1", 10);
  const currentPage = Number.isNaN(requestedPage) || requestedPage < 1 ? 1 : requestedPage;

  const skip = (currentPage - 1) * PAGE_SIZE;
  const usersPage = (await prisma.user.findMany({
    orderBy: { name: "asc" },
    take: PAGE_SIZE + 1,
    skip,
  })) as UserListItem[];

  const hasNextPage = usersPage.length > PAGE_SIZE;
  const users = hasNextPage ? usersPage.slice(0, PAGE_SIZE) : usersPage;

  const previousPageHref = `/admin/users?page=${currentPage - 1}`;
  const nextPageHref = `/admin/users?page=${currentPage + 1}`;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">Aucun utilisateur trouvé.</p>
          ) : (
            <UsersTableWithFilters users={users} currentUserId={session.user.id} />
          )}

          <div className="flex items-center justify-between gap-2 border-t pt-4">
            {currentPage > 1 ? (
              <Button asChild variant="outline" size="sm">
                <Link href={previousPageHref}>Précédent</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Précédent
              </Button>
            )}

            <p className="text-muted-foreground text-sm">Page {currentPage}</p>

            {hasNextPage ? (
              <Button asChild variant="outline" size="sm">
                <Link href={nextPageHref}>Suivant</Link>
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                Suivant
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { requireAdmin } from "~/server/auth/auth-helpers";
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

export default async function AdminUsersPage() {
  const session = await requireAdmin();

  const users = (await prisma.user.findMany({
    orderBy: { name: "asc" },
  })) as UserListItem[];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs</CardTitle>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Aucun utilisateur trouvé.
            </p>
          ) : (
            <UsersTableWithFilters users={users} currentUserId={session.user.id} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

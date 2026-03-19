import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

import { type AppRole } from "./roles";
import { UserDeleteButton } from "./UserDeleteButton";
import { UserRoleSelect } from "./UserRoleSelect";

type UserListItem = {
  id: string;
  name: string | null;
  email: string | null;
  role: AppRole;
  createdAt?: Date | null;
};

const formatCreatedAt = (date: Date | null | undefined) => {
  if (!date) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name ?? "—"}
                    </TableCell>
                    <TableCell>{user.email ?? "—"}</TableCell>
                    <TableCell>
                      <UserRoleSelect userId={user.id} role={user.role} />
                    </TableCell>
                    <TableCell>{formatCreatedAt(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <UserDeleteButton
                        userId={user.id}
                        userLabel={user.name ?? user.email ?? "cet utilisateur"}
                        disabled={session.user.id === user.id}
                      />
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

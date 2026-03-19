import { Badge } from "~/components/ui/badge";
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

type AppRole = "ADMIN" | "ORGANIZER" | "USER";

type UserWithOptionalCreatedAt = {
  id: string;
  name: string | null;
  email: string | null;
  role: AppRole;
  createdAt?: Date | null;
};

const roleBadgeClasses: Record<AppRole, string> = {
  ADMIN:
    "border-violet-200 bg-violet-100 text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300",
  ORGANIZER:
    "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  USER: "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300",
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
  const users = (await prisma.user.findMany()) as UserWithOptionalCreatedAt[];

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
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                    <TableCell>{user.email ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={roleBadgeClasses[user.role]}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCreatedAt(user.createdAt)}</TableCell>
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

"use client";

import { useEffect, useMemo, useState } from "react";

import { Input } from "~/components/ui/input";
import { Select, SelectItem } from "~/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

import { UserDeleteButton } from "./UserDeleteButton";
import { UserRoleSelect } from "./UserRoleSelect";
import { APP_ROLES, type AppRole } from "./roles";

type RoleFilter = "ALL" | AppRole;

type UserListItem = {
  id: string;
  name: string | null;
  email: string | null;
  role: AppRole;
  createdAt?: string | null;
};

type UsersTableWithFiltersProps = {
  users: UserListItem[];
  currentUserId: string;
};

const formatCreatedAt = (isoDate: string | null | undefined) => {
  if (!isoDate) return "—";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
};

export function UsersTableWithFilters({
  users,
  currentUserId,
}: UsersTableWithFiltersProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("ALL");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim().toLowerCase());
    }, 200);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

      if (!matchesRole) {
        return false;
      }

      if (debouncedSearchQuery.length === 0) {
        return true;
      }

      const name = user.name?.toLowerCase() ?? "";
      const email = user.email?.toLowerCase() ?? "";

      return (
        name.includes(debouncedSearchQuery) ||
        email.includes(debouncedSearchQuery)
      );
    });
  }, [debouncedSearchQuery, roleFilter, users]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <Input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Rechercher un utilisateur..."
          className="md:max-w-sm"
          aria-label="Rechercher un utilisateur"
        />

        <Select
          value={roleFilter}
          onChange={(event) => setRoleFilter(event.target.value as RoleFilter)}
          className="w-full md:w-[180px]"
          aria-label="Filtrer par rôle"
        >
          <SelectItem value="ALL">ALL</SelectItem>
          {APP_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {role}
            </SelectItem>
          ))}
        </Select>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Aucun utilisateur ne correspond à votre recherche.
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
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name ?? "—"}</TableCell>
                <TableCell>{user.email ?? "—"}</TableCell>
                <TableCell>
                  <UserRoleSelect userId={user.id} role={user.role} />
                </TableCell>
                <TableCell>{formatCreatedAt(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <UserDeleteButton
                    userId={user.id}
                    userLabel={user.name ?? user.email ?? "cet utilisateur"}
                    disabled={currentUserId === user.id}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

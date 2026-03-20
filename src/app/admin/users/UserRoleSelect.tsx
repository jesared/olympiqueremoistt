"use client";

import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

import { updateUserRole } from "~/app/admin/users/actions";
import { APP_ROLES, type AppRole } from "~/app/admin/users/roles";
import { Badge } from "~/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
type ToastState = {
  message: string;
  kind: "success" | "error";
} | null;

const roleBadgeClasses: Record<AppRole, string> = {
  ADMIN:
    "border-red-200 bg-red-100 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  MODERATOR:
    "border-sky-200 bg-sky-100 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300",
  ORGANIZER:
    "border-blue-200 bg-blue-100 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300",
  USER: "border-zinc-200 bg-zinc-100 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300",
};

type UserRoleSelectProps = {
  userId: string;
  role: AppRole;
};

export function UserRoleSelect({ userId, role }: UserRoleSelectProps) {
  const [selectedRole, setSelectedRole] = useState<AppRole>(role);
  const [toast, setToast] = useState<ToastState>(null);
  const [isPending, startTransition] = useTransition();

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className={roleBadgeClasses[selectedRole]}>
        {selectedRole}
      </Badge>

      <Select
        value={selectedRole}
        onValueChange={(value) => {
          const previousRole = selectedRole;
          const safeRole = value as AppRole;

          setSelectedRole(safeRole);

          startTransition(async () => {
            try {
              await updateUserRole(userId, safeRole);
              showToast({ message: "Rôle mis à jour.", kind: "success" });
            } catch {
              setSelectedRole(previousRole);
              showToast({
                message: "Impossible de mettre à jour le rôle.",
                kind: "error",
              });
            }
          });
        }}
        disabled={isPending}
      >
        <SelectTrigger className="w-[160px]">
          <SelectValue placeholder="Choisir un rôle" />
        </SelectTrigger>

        <SelectContent>
          {APP_ROLES.map((appRole) => (
            <SelectItem key={appRole} value={appRole}>
              {appRole}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isPending ? (
        <Loader2 className="text-muted-foreground size-4 animate-spin" />
      ) : null}

      {toast ? (
        <div
          role="status"
          className={`fixed right-4 bottom-4 z-50 rounded-md border px-4 py-2 text-sm shadow-lg ${
            toast.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}

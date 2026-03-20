"use client";

import { LayoutDashboard, LogOut, Shield, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import type { Session } from "next-auth";

import { getUserInitials } from "./user-initials";

type UserMenuProps = {
  user?: Session["user"] | null;
};

export function UserMenu({ user }: UserMenuProps) {
  if (!user) {
    return (
      <Button asChild size="sm">
        <Link href="/login">Connexion</Link>
      </Button>
    );
  }

  const initials = getUserInitials(user);

  const isAdmin = user.role === "ADMIN";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="focus:ring-ring rounded-full focus:ring-2 focus:outline-none"
          aria-label="Ouvrir le menu utilisateur"
        >
          <Avatar className="size-9 shrink-0 cursor-pointer">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback className="text-xs font-semibold">{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground truncate text-xs">
            {user.email}
          </span>
          {isAdmin ? (
            <Badge variant="secondary" className="gap-1 text-[10px] uppercase">
              <Shield className="size-3" aria-hidden="true" />
              Admin
            </Badge>
          ) : null}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link
              href="/admin"
              aria-label="Accéder à l'administration"
              className="flex cursor-pointer items-center gap-2"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Administration
            </Link>
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex cursor-pointer items-center gap-2"
            aria-label="Accéder au profil"
          >
            <User className="size-4" aria-hidden="true" />
            Profil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex cursor-pointer items-center gap-2"
          aria-label="Se déconnecter"
        >
          <LogOut className="size-4" aria-hidden="true" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

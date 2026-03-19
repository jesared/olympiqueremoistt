"use client";

import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import type { Session } from "next-auth";

type UserMenuProps = {
  user?: Session["user"] | null;
};

export function UserMenu({ user }: UserMenuProps) {
  // 👉 pas connecté → bouton login
  if (!user) {
    return (
      <Button asChild size="sm">
        <Link href="/api/auth/signin">Connexion</Link>
      </Button>
    );
  }

  // 👉 initials fallback
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ??
    user.email?.charAt(0).toUpperCase() ??
    "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="focus:ring-ring rounded-full focus:ring-2 focus:outline-none">
          <Avatar className="size-9 cursor-pointer">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48 space-y-2">
        <div className="text-muted-foreground px-2 py-1.5 text-xs">
          {user.email}
        </div>

        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex cursor-pointer items-center gap-2"
          >
            <User className="size-4" />
            Profil
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="text-destructive flex cursor-pointer items-center gap-2"
        >
          <LogOut className="size-4" />
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

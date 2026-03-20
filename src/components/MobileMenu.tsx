"use client";

import type { Session } from "next-auth";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Shield,
  User as UserIcon,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";

import { getUserInitials } from "./user-initials";

type NavChild = {
  label: string;
  href: string;
};

export type MobileNavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  children?: NavChild[];
};

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
  navItems: MobileNavItem[];
  user?: Session["user"] | null;
};

export function MobileMenu({
  open,
  onOpenChange,
  pathname,
  navItems,
  user,
}: MobileMenuProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setOpenSubmenu(null);
    }
  }, [open]);

  const closeMenu = () => {
    onOpenChange(false);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "left-0 top-0 z-[100] h-dvh w-screen max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none border-0 p-0",
          "duration-300 data-[state=open]:slide-in-from-left-full data-[state=closed]:slide-out-to-left-full",
          "md:hidden",
        )}
      >
        <DialogTitle className="sr-only">Navigation mobile</DialogTitle>

        <div className="border-border/60 bg-background/95 sticky top-0 z-10 flex min-h-16 items-center border-b px-4 pr-14 backdrop-blur-xl">
          <span className="text-lg font-semibold tracking-tight">Menu</span>
        </div>

        <nav id="mobile-navigation" aria-label="Navigation mobile" className="px-4 py-4">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const isSubmenuOpen = openSubmenu === item.href;
              const submenuId = `mobile-submenu-${item.href.replaceAll("/", "-")}`;

              return (
                <li key={item.href} className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "focus-visible:ring-primary/60 flex min-h-12 flex-1 items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {item.icon ? (
                        <item.icon className="size-5 shrink-0" aria-hidden="true" />
                      ) : null}
                      <span>{item.label}</span>
                    </Link>

                    {item.children ? (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-lg"
                        className="shrink-0"
                        onClick={() =>
                          setOpenSubmenu((prev) =>
                            prev === item.href ? null : item.href,
                          )
                        }
                        aria-expanded={isSubmenuOpen}
                        aria-controls={submenuId}
                        aria-label={`Afficher le sous-menu ${item.label}`}
                      >
                        <ChevronDown
                          className={cn(
                            "size-5 transition-transform duration-200",
                            isSubmenuOpen ? "rotate-180" : "rotate-0",
                          )}
                          aria-hidden="true"
                        />
                      </Button>
                    ) : null}
                  </div>

                  {item.children ? (
                    <div
                      id={submenuId}
                      className={cn(
                        "grid overflow-hidden pl-4 transition-all duration-200",
                        isSubmenuOpen ? "mt-2 grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="border-border/70 flex min-h-0 flex-col gap-1 border-l py-1 pl-3">
                        {item.children.map((sub) => {
                          const isSubActive = pathname.startsWith(sub.href);

                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={closeMenu}
                              className={cn(
                                "focus-visible:ring-primary/60 text-muted-foreground hover:bg-muted hover:text-foreground block min-h-11 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                                isSubActive && "bg-muted text-foreground",
                              )}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-border/60 mt-auto border-t px-4 py-4">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border p-3">
                <Avatar className="size-10 shrink-0">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? user.email ?? "Utilisateur"} />
                  <AvatarFallback className="text-xs font-semibold">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{user.name ?? "Utilisateur"}</p>
                  <p className="text-muted-foreground truncate text-xs">{user.email}</p>
                </div>
                {isAdmin ? (
                  <Badge variant="secondary" className="gap-1 text-[10px] uppercase">
                    <Shield className="size-3" aria-hidden="true" />
                    Admin
                  </Badge>
                ) : null}
              </div>

              <div className="grid gap-2">
                {isAdmin ? (
                  <Button asChild variant="outline" className="min-h-11 justify-start gap-2">
                    <Link href="/admin" onClick={closeMenu}>
                      <LayoutDashboard className="size-4" aria-hidden="true" />
                      Administration
                    </Link>
                  </Button>
                ) : null}

                <Button asChild variant="outline" className="min-h-11 justify-start gap-2">
                  <Link href="/dashboard" onClick={closeMenu}>
                    <UserIcon className="size-4" aria-hidden="true" />
                    Profil
                  </Link>
                </Button>

                <Button
                  variant="ghost"
                  className="min-h-11 justify-start gap-2"
                  onClick={() => {
                    closeMenu();
                    void signOut({ callbackUrl: "/" });
                  }}
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  Déconnexion
                </Button>
              </div>
            </div>
          ) : (
            <Button asChild className="w-full min-h-11">
              <Link href="/login" onClick={closeMenu}>
                Connexion
              </Link>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

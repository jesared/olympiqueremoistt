"use client";

import type { Session } from "next-auth";

import {
  CalendarDays,
  Handshake,
  Home,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Shield,
  User as UserIcon,
  Users,
  type LucideIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  Sheet,
  SheetClose,
  SheetCloseButton,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import { cn } from "~/lib/utils";

import { getUserInitials } from "./user-initials";

type NavChild = {
  label: string;
  href: string;
  icon?: LucideIcon;
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

const iconMap: Record<string, LucideIcon> = {
  "/": Home,
  "/actualites": Newspaper,
  "/tournois": CalendarDays,
  "/club": Users,
  "/club/benevolat": Handshake,
  "/club/sponsoring": Handshake,
  "/club/joueur": UserIcon,
  "/evenements": CalendarDays,
};

export function MobileMenu({
  open,
  onOpenChange,
  pathname,
  navItems,
  user,
}: MobileMenuProps) {
  const isAdmin = user?.role === "ADMIN";

  const closeMenu = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="z-[100] flex h-dvh w-[88vw] max-w-sm flex-col overflow-hidden border-r border-white/10 bg-background/95 p-0 backdrop-blur-2xl md:hidden"
        aria-describedby={undefined}
      >
        <SheetHeader className="border-border/60 flex-row items-center justify-between border-b px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-8 items-center justify-center rounded-lg border border-white/10 text-sm font-semibold">
              OR
            </div>
            <div>
              <SheetTitle className="text-base tracking-tight">Olympique Rémois TT</SheetTitle>
              <p className="text-muted-foreground text-xs">Navigation</p>
            </div>
          </div>
          <SheetCloseButton aria-label="Fermer la navigation mobile" />
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          <nav aria-label="Navigation mobile principale" id="mobile-navigation">
            <ul className="space-y-1.5">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                const ItemIcon = item.icon ?? iconMap[item.href];

                if (!item.children?.length) {
                  return (
                    <li key={item.href}>
                      <SheetClose asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            "focus-visible:ring-primary/60 hover:bg-muted flex min-h-[44px] items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                            isActive
                              ? "border-primary/30 bg-primary/10 text-foreground"
                              : "border-transparent text-muted-foreground",
                          )}
                        >
                          {ItemIcon ? <ItemIcon className="size-4" aria-hidden="true" /> : null}
                          <span>{item.label}</span>
                        </Link>
                      </SheetClose>
                    </li>
                  );
                }

                const childActive = item.children.some((sub) => pathname.startsWith(sub.href));

                return (
                  <li key={item.href} className="rounded-xl border border-white/10 px-3">
                    <Accordion type="single" collapsible defaultValue={childActive ? item.href : undefined}>
                      <AccordionItem value={item.href} className="border-b-0">
                        <div className="flex min-h-[44px] items-center gap-2">
                          <SheetClose asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "focus-visible:ring-primary/60 hover:bg-muted flex min-h-[44px] flex-1 items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                                isActive || childActive
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {ItemIcon ? (
                                <ItemIcon className="size-4" aria-hidden="true" />
                              ) : null}
                              <span>{item.label}</span>
                            </Link>
                          </SheetClose>

                          <AccordionTrigger
                            aria-label={`Ouvrir le sous-menu ${item.label}`}
                            className="w-auto min-w-9 flex-none justify-end py-0"
                          >
                            <span className="sr-only">Basculer le sous-menu</span>
                          </AccordionTrigger>
                        </div>

                        <AccordionContent>
                          <div className="border-border/60 ml-2 space-y-1 border-l pl-2">
                            {item.children.map((sub) => {
                              const isSubActive = pathname.startsWith(sub.href);
                              const SubIcon = sub.icon ?? iconMap[sub.href];

                              return (
                                <SheetClose asChild key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className={cn(
                                      "focus-visible:ring-primary/60 hover:bg-muted flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                                      isSubActive
                                        ? "bg-muted text-foreground"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {SubIcon ? (
                                      <SubIcon className="size-4" aria-hidden="true" />
                                    ) : null}
                                    {sub.label}
                                  </Link>
                                </SheetClose>
                              );
                            })}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="border-border/60 bg-background/85 mt-auto border-t p-3 backdrop-blur-xl">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 p-3">
                <Avatar className="size-8 shrink-0">
                  <AvatarImage src={user.image ?? ""} alt={user.name ?? user.email ?? "Utilisateur"} />
                  <AvatarFallback className="text-[11px] font-semibold">
                    {getUserInitials(user)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user.name ?? "Utilisateur"}</p>
                  <p className="text-muted-foreground truncate text-xs">{user.email ?? "Pas d'e-mail"}</p>
                </div>

                {isAdmin ? (
                  <Badge variant="secondary" className="gap-1 text-[10px] uppercase">
                    <Shield className="size-3" aria-hidden="true" />
                    Admin
                  </Badge>
                ) : null}
              </div>

              <div className="grid gap-2">
                <SheetClose asChild>
                  <Button asChild variant="outline" className="min-h-[44px] justify-start gap-2">
                    <Link href="/dashboard/profil" aria-label="Ouvrir mon compte">
                      <UserIcon className="size-4" aria-hidden="true" />
                      Mon compte
                    </Link>
                  </Button>
                </SheetClose>

                {isAdmin ? (
                  <SheetClose asChild>
                    <Button asChild variant="outline" className="min-h-[44px] justify-start gap-2">
                      <Link href="/admin" aria-label="Accéder à l'administration">
                        <LayoutDashboard className="size-4" aria-hidden="true" />
                        Admin
                      </Link>
                    </Button>
                  </SheetClose>
                ) : null}

                <Button
                  variant="ghost"
                  className="min-h-[44px] justify-start gap-2"
                  aria-label="Se déconnecter"
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
            <SheetClose asChild>
              <Button asChild className="min-h-[44px] w-full">
                <Link href="/login">Connexion</Link>
              </Button>
            </SheetClose>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import {
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Menu,
  Newspaper,
  Settings,
  Trophy,
  UserCog,
  Users,
  FileText,
  CalendarDays,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ComponentType, useState } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type AdminNavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type AdminNavSection = {
  label: string;
  items: AdminNavItem[];
};

const adminNavSections: AdminNavSection[] = [
  {
    label: "Tournoi",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      {
        href: "/admin/inscriptions",
        label: "Inscriptions",
        icon: ClipboardList,
      },
      { href: "/admin/joueurs", label: "Joueurs", icon: Users },
      { href: "/admin/tournois", label: "Tournois", icon: Trophy },
      { href: "/admin/paiements", label: "Paiements", icon: CreditCard },
      { href: "/admin/parametres", label: "Paramètres", icon: Settings },
    ],
  },
  {
    label: "Site",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/actualites", label: "Actualités", icon: Newspaper },
      { href: "/admin/posts", label: "Posts", icon: Newspaper },
      { href: "/admin/events", label: "Événements", icon: CalendarDays },
      { href: "/admin/users", label: "Users", icon: UserCog },
    ],
  },
];

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-5" aria-label="Navigation administration">
      {adminNavSections.map((section) => (
        <div key={section.label} className="space-y-1">
          <p className="text-muted-foreground px-3 text-xs font-semibold tracking-wide uppercase">
            {section.label}
          </p>
          {section.items.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border p-3 lg:hidden">
        <div>
          <p className="text-sm font-semibold">Administration</p>
          <p className="text-muted-foreground text-xs">Gestion tournoi</p>
        </div>
        <Button size="icon-sm" variant="outline" onClick={() => setOpen(true)}>
          <Menu className="size-4" />
          <span className="sr-only">Ouvrir le menu admin</span>
        </Button>
      </div>

      <aside className="bg-card border-border/70 hidden h-screen w-64 border-r p-4 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col">
        <div className="mb-6 px-2">
          <p className="text-sm font-semibold">Administration</p>
          <p className="text-muted-foreground text-xs">Olympique Remois TT</p>
        </div>
        <AdminNav />
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            className="bg-background/80 w-full backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Fermer le menu"
          />
          <aside className="bg-card border-border h-full w-72 border-l p-4 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Administration</p>
                <p className="text-muted-foreground text-xs">
                  Navigation rapide
                </p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                <X className="size-4" />
                <span className="sr-only">Fermer</span>
              </Button>
            </div>
            <AdminNav onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      ) : null}
    </>
  );
}

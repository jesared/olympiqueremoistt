"use client";

import {
  Bell,
  ChartNoAxesCombined,
  ClipboardList,
  LayoutDashboard,
  Trophy,
  UserRound,
} from "lucide-react";
import type { ComponentType } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";

type DashboardNavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const dashboardNavItems: DashboardNavItem[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/profil", label: "Profil", icon: UserRound },
  { href: "/dashboard/inscriptions", label: "Mes inscriptions", icon: ClipboardList },
  { href: "/dashboard/participations", label: "Mes participations", icon: Trophy },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/statistiques", label: "Statistiques", icon: ChartNoAxesCombined },
];

export function DashboardSidebarNav() {
  const pathname = usePathname();

  return (
    <aside className="bg-card border-border/70 h-fit rounded-2xl border p-4 shadow-sm lg:sticky lg:top-24">
      <div className="mb-4 px-2">
        <p className="text-sm font-semibold">Espace joueur</p>
        <p className="text-muted-foreground text-xs">ORTT • Dashboard</p>
      </div>

      <nav aria-label="Navigation dashboard">
        <ul className="space-y-1">
          {dashboardNavItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

"use client";
import type { Session } from "next-auth";
type HeaderProps = {
  user?: Session["user"] | null;
};

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./UserMenu";

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Actualités", href: "/actualites" },
  { label: "Compétitions", href: "/competitions" },
  {
    label: "Club",
    href: "/club",
    children: [
      { label: "Bénévolat", href: "/club/benevolat" },
      { label: "Joueurs", href: "/club/joueurs" },
    ],
  },
  { label: "Événements", href: "/evenements" },
];

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="border-border/60 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="text-foreground text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          ORTT
        </Link>

        {/* NAV DESKTOP */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  {item.children && (
                    <span className="text-muted-foreground group-hover:text-foreground transition">
                      ▾
                    </span>
                  )}
                </Link>

                {/* SUBMENU */}
                {item.children && (
                  <div
                    className={cn(
                      "bg-popover absolute top-full left-0 z-50 mt-1 w-48 rounded-md border p-1 shadow-md",
                      "invisible translate-y-1 opacity-0 transition-all duration-150",
                      "group-hover:visible group-hover:translate-y-0 group-hover:opacity-100",
                      "group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100",
                    )}
                  >
                    {item.children.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-muted-foreground hover:bg-muted hover:text-foreground block rounded-md px-3 py-2 text-sm"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserMenu user={user} />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* MOBILE */}
      <div
        className={cn(
          "grid transition-all duration-200 ease-out md:hidden",
          isMobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav className="border-border/60 bg-background/95 overflow-hidden border-t px-4 pt-3 pb-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className="hover:bg-muted block rounded-md px-3 py-2 text-sm font-medium"
                >
                  {item.label}
                </Link>

                {/* SUBMENU MOBILE */}
                {item.children && (
                  <div className="ml-4 flex flex-col gap-1">
                    {item.children.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="text-muted-foreground hover:bg-muted block rounded-md px-3 py-2 text-sm"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

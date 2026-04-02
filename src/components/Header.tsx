"use client";

import type { Session } from "next-auth";

import {
  CalendarDays,
  ChevronDown,
  History,
  Home,
  Menu,
  Newspaper,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import Image from "next/image";
import { MobileMenu, type MobileNavItem } from "./MobileMenu";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./UserMenu";

type HeaderProps = {
  user?: Session["user"] | null;
};

const navItems: MobileNavItem[] = [
  { label: "Accueil", href: "/", icon: Home },
  { label: "Actualités", href: "/actualites", icon: Newspaper },
  { label: "Tournois", href: "/tournois", icon: Trophy },
  {
    label: "Club",
    href: "/club",
    icon: Users,
    children: [
      {
        label: "Présentation",
        href: "/club/presentation-du-club",
        icon: Users,
      },
      {
        label: "Inscriptions",
        href: "/club/inscriptions",
        icon: Users,
      },
      {
        label: "Newsletter",
        href: "/club/newsletter",
        icon: Users,
      },
      {
        label: "L'équipe dirigeante",
        href: "/club/lequipe-dirigeante",
        icon: Users,
      },
      {
        label: "Historique du club",
        href: "/club/lhistorique-du-club",
        icon: History,
      },
      {
        label: "FAQ",
        href: "/faq",
        icon: Users,
      },
      {
        label: "Plan d'accès",
        href: "/plan-dacces",
        icon: Users,
      },
    ],
  },
  { label: "Événements", href: "/evenements", icon: CalendarDays },
];

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDesktopMenu(null);
  }, [pathname]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const clearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  const handleDesktopOpen = (href: string) => {
    clearCloseTimeout();
    setOpenDesktopMenu(href);
  };

  const handleDesktopClose = () => {
    clearCloseTimeout();
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDesktopMenu(null);
    }, 120);
  };

  return (
    <header className="border-border/60 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-foreground flex items-center gap-3 text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          <span className="bg-muted/60 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm">
            <Image
              src="/logo.jpg"
              alt="Logo Olympique Rémois Tennis de Table"
              width={44}
              height={44}
              className="h-11 w-11 rounded-lg object-contain"
              priority
            />
          </span>
          <span className="hidden md:inline">ORTT</span>
        </Link>

        <nav className="hidden md:block" aria-label="Navigation principale">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const isOpen = openDesktopMenu === item.href;
              const submenuId = `desktop-submenu-${item.href.replaceAll("/", "-")}`;

              return (
                <li
                  key={item.href}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && handleDesktopOpen(item.href)
                  }
                  onMouseLeave={() => item.children && handleDesktopClose()}
                  onFocus={() => item.children && handleDesktopOpen(item.href)}
                  onBlur={(event) => {
                    if (
                      item.children &&
                      !event.currentTarget.contains(
                        event.relatedTarget as Node | null,
                      )
                    ) {
                      handleDesktopClose();
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setOpenDesktopMenu(null);
                    }}
                    aria-haspopup={item.children ? "menu" : undefined}
                    aria-expanded={item.children ? isOpen : undefined}
                    aria-controls={item.children ? submenuId : undefined}
                    className={cn(
                      "focus-visible:ring-primary/60 flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.icon && (
                      <item.icon className="size-4" aria-hidden="true" />
                    )}
                    <span>{item.label}</span>
                    {item.children && (
                      <ChevronDown
                        className={cn(
                          "size-4 transition-transform duration-200",
                          isOpen ? "rotate-180" : "rotate-0",
                        )}
                        aria-hidden="true"
                      />
                    )}
                  </Link>

                  {item.children && (
                    <div
                      className={cn(
                        "absolute top-full left-0 z-[70] pt-2",
                        "transition-all duration-200",
                        isOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1 opacity-0",
                      )}
                    >
                      <div
                        id={submenuId}
                        role="menu"
                        aria-label={`Sous-menu ${item.label}`}
                        className="bg-popover min-w-52 rounded-lg border p-1.5 shadow-lg"
                      >
                        {item.children.map((sub) => {
                          const isSubActive = pathname.startsWith(sub.href);

                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              role="menuitem"
                              className={cn(
                                "focus-visible:ring-primary/60 block rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                                isSubActive
                                  ? "bg-muted text-foreground"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                              )}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenDesktopMenu(null);
                              }}
                            >
                              {sub.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <UserMenu user={user} />

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            <Menu aria-hidden="true" />
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <MobileMenu
        open={isMobileMenuOpen}
        onOpenChange={setIsMobileMenuOpen}
        pathname={pathname}
        navItems={navItems}
        user={user}
      />
    </header>
  );
}

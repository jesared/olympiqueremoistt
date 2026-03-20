"use client";

import type { Session } from "next-auth";

import { ChevronDown, Menu, Trophy, X, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./UserMenu";

type HeaderProps = {
  user?: Session["user"] | null;
};

type NavItem = {
  label: string;
  href: string;
  icon?: LucideIcon;
  children?: Array<{ label: string; href: string }>;
};

const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Actualités", href: "/actualites" },
  { label: "Tournois", href: "/tournois", icon: Trophy },
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
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(
    null,
  );
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenMobileSubmenu(null);
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
          className="text-foreground text-lg font-semibold tracking-tight transition-opacity hover:opacity-80"
        >
          ORTT
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
                    {item.icon && <item.icon className="size-4" aria-hidden="true" />}
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
            {isMobileMenuOpen ? (
              <X aria-hidden="true" />
            ) : (
              <Menu aria-hidden="true" />
            )}
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div
        className={cn(
          "grid transition-all duration-200 ease-out md:hidden",
          isMobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav
          id="mobile-navigation"
          aria-label="Navigation mobile"
          className="border-border/60 bg-background/95 overflow-hidden border-t px-4 pt-3 pb-4"
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const isSubmenuOpen = openMobileSubmenu === item.href;
              const mobileSubmenuId = `mobile-submenu-${item.href.replaceAll("/", "-")}`;

              return (
                <li key={item.href} className="rounded-md">
                  <div className="flex items-center gap-1">
                    <Link
                      href={item.href}
                      className={cn(
                        "focus-visible:ring-primary/60 block flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted",
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {item.icon && (
                          <item.icon className="size-4" aria-hidden="true" />
                        )}
                        <span>{item.label}</span>
                      </span>
                    </Link>

                    {item.children && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-9"
                        onClick={() =>
                          setOpenMobileSubmenu((prev) =>
                            prev === item.href ? null : item.href,
                          )
                        }
                        aria-expanded={isSubmenuOpen}
                        aria-controls={mobileSubmenuId}
                        aria-label={`Afficher le sous-menu ${item.label}`}
                      >
                        <ChevronDown
                          className={cn(
                            "size-4 transition-transform duration-200",
                            isSubmenuOpen ? "rotate-180" : "rotate-0",
                          )}
                          aria-hidden="true"
                        />
                      </Button>
                    )}
                  </div>

                  {item.children && (
                    <div
                      id={mobileSubmenuId}
                      className={cn(
                        "grid overflow-hidden pl-3 transition-all duration-200",
                        isSubmenuOpen
                          ? "mt-1 grid-rows-[1fr]"
                          : "grid-rows-[0fr]",
                      )}
                    >
                      <div className="border-border/70 flex min-h-0 flex-col gap-1 border-l py-1">
                        {item.children.map((sub) => {
                          const isSubActive = pathname.startsWith(sub.href);

                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-primary/60 block rounded-md px-3 py-2 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                                isSubActive && "bg-muted text-foreground",
                              )}
                              onClick={() => setIsMobileMenuOpen(false)}
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
      </div>
    </header>
  );
}

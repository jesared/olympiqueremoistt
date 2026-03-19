"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

const navItems = [
  { label: "Accueil", href: "/" },
  { label: "Actualités", href: "/actualites" },
  { label: "Compétitions", href: "/competitions" },
  { label: "Club", href: "/club" },
  { label: "Événements", href: "/evenements" },
]

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
        >
          Olympique Remois
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </div>

      <div
        className={cn(
          "grid transition-all duration-200 ease-out md:hidden",
          isMobileMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <nav className="overflow-hidden border-t border-border/60 bg-background/95 px-4 pb-4 pt-3 sm:px-6">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </header>
  )
}

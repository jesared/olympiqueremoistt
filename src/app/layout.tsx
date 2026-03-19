import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";

import { ThemeProvider } from "~/components/theme-provider";
import { ThemeToggle } from "~/components/theme-toggle";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Club Sportif Olympique",
  description: "Site officiel du club sportif Olympique",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/equipes", label: "Équipes" },
  { href: "/calendrier", label: "Calendrier" },
  { href: "/contact", label: "Contact" },
];

const noFlashScript = `(() => {
  try {
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = stored === 'light' || stored === 'dark' ? stored : (systemDark ? 'dark' : 'light');
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  } catch (_) {}
})();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={geist.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />

        <a
          href="#main-content"
          className="bg-card text-card-foreground focus:ring-ring border-border sr-only z-50 rounded-md border px-4 py-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:ring-2 focus:outline-none"
        >
          Aller au contenu principal
        </a>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <div className="flex min-h-screen flex-col">
              <header className="border-border/70 bg-background/90 border-b backdrop-blur">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                  <Link
                    href="/"
                    className="focus:ring-ring hover:text-primary inline-flex items-center rounded-md text-lg font-semibold tracking-tight transition focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    aria-label="Aller à la page d'accueil"
                  >
                    Olympique Club
                  </Link>

                  <div className="flex items-center gap-2 sm:gap-4">
                    <nav aria-label="Navigation principale">
                      <ul className="flex flex-wrap items-center gap-2 sm:gap-4">
                        {navItems.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="focus:ring-ring hover:bg-muted hover:text-foreground text-muted-foreground inline-flex rounded-md px-3 py-2 text-sm font-medium transition focus:ring-2 focus:ring-offset-2 focus:outline-none"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                    <ThemeToggle />
                  </div>
                </div>
              </header>

              <main
                id="main-content"
                className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
                tabIndex={-1}
              >
                {children}
              </main>

              <footer className="border-border/70 bg-background/95 border-t">
                <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                  <p>
                    &copy; {new Date().getFullYear()} Olympique Club. Tous
                    droits réservés.
                  </p>
                  <div className="flex items-center gap-4">
                    <Link
                      href="/mentions-legales"
                      className="focus:ring-ring hover:text-foreground rounded-md transition focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                      Mentions légales
                    </Link>
                    <Link
                      href="/politique-confidentialite"
                      className="focus:ring-ring hover:text-foreground rounded-md transition focus:ring-2 focus:ring-offset-2 focus:outline-none"
                    >
                      Confidentialité
                    </Link>
                  </div>
                </div>
              </footer>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import "~/styles/globals.css";

import { type Metadata } from "next";
import Link from "next/link";
import { Geist } from "next/font/google";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={geist.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">
        <a
          href="#main-content"
          className="sr-only z-50 rounded-md bg-white px-4 py-2 text-slate-950 focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          Aller au contenu principal
        </a>

        <TRPCReactProvider>
          <div className="flex min-h-screen flex-col">
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <Link
                  href="/"
                  className="inline-flex items-center rounded-md text-lg font-semibold tracking-tight text-white transition hover:text-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  aria-label="Aller à la page d'accueil"
                >
                  Olympique Club
                </Link>

                <nav aria-label="Navigation principale">
                  <ul className="flex flex-wrap items-center gap-2 sm:gap-4">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className="inline-flex rounded-md px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </header>

            <main
              id="main-content"
              className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
              tabIndex={-1}
            >
              {children}
            </main>

            <footer className="border-t border-slate-800 bg-slate-900">
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <p>&copy; {new Date().getFullYear()} Olympique Club. Tous droits réservés.</p>
                <div className="flex items-center gap-4">
                  <Link
                    href="/mentions-legales"
                    className="rounded-md transition hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Mentions légales
                  </Link>
                  <Link
                    href="/politique-confidentialite"
                    className="rounded-md transition hover:text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                  >
                    Confidentialité
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </TRPCReactProvider>
      </body>
    </html>
  );
}

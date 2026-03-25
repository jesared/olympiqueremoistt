import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { ThemeProvider } from "~/components/theme-provider";
import { auth } from "~/server/auth";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Olympique Rémois Tennis de Table",
  description: "Site officiel du club sportif Olympique Rémois Tennis de Table",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  return (
    <html lang="fr" className={geist.variable} suppressHydrationWarning>
      <body className="bg-background text-foreground min-h-screen antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <div className="flex min-h-screen flex-col">
              <Header user={session?.user} />

              <main
                id="main-content"
                className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 lg:px-8"
                tabIndex={-1}
              >
                {children}
              </main>
              <Footer />
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

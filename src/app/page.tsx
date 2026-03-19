import Link from "next/link";
import { LogoutButton } from "~/components/logout-button";

import { auth } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <main className="bg-background flex min-h-screen items-center justify-center">
        <div className="bg-card flex w-full max-w-sm flex-col items-center gap-6 rounded-xl border p-8 shadow-sm">
          {/* TITRE */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Olympique Rémois TT</h1>

            {session?.user ? (
              <p className="text-muted-foreground text-sm">
                Bienvenue {session.user.name ?? "joueur"} 👋
              </p>
            ) : (
              <p className="text-muted-foreground text-sm">
                Connexion à l&apos;espace
              </p>
            )}
          </div>

          {/* ACTION */}
          {session?.user ? (
            <>
              <Link
                href="/admin" // ou /user
                className="bg-primary text-primary-foreground w-full rounded-md px-4 py-2 text-center text-sm font-medium transition hover:opacity-90"
              >
                Accéder au dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="bg-primary text-primary-foreground w-full rounded-md px-4 py-2 text-center text-sm font-medium transition hover:opacity-90"
            >
              Se connecter avec Google
            </Link>
          )}
        </div>
      </main>
    </HydrateClient>
  );
}

import Link from "next/link";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <main className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Accès non autorisé</CardTitle>
          <CardDescription>
            Vous êtes connecté, mais vous n&apos;avez pas les permissions nécessaires pour accéder à
            cette page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/">Retour à l&apos;accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

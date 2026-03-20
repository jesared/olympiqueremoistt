"use client";

import { Loader2, Mail } from "lucide-react";
import { getProviders, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const searchParams = useSearchParams();
  const callbackUrl = useMemo(
    () => searchParams.get("callbackUrl") ?? "/dashboard",
    [searchParams],
  );

  const [email, setEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      const providers = await getProviders();
      setEmailEnabled(Boolean(providers?.email));
    })();
  }, []);

  async function handleEmailSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      setSuccessMessage(null);
      setErrorMessage("Merci de saisir une adresse email valide.");
      return;
    }

    setLoadingEmail(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await signIn("email", {
        email: normalizedEmail,
        callbackUrl,
        redirect: false,
      });

      if (!result || result.error) {
        setErrorMessage(
          "Impossible d'envoyer le lien de connexion pour le moment. Réessayez dans quelques instants.",
        );
        return;
      }

      setSuccessMessage(
        "Un lien de connexion vous a été envoyé. Vérifiez votre boîte mail et vos spams.",
      );
      setEmail("");
    } catch {
      setErrorMessage("Une erreur inattendue est survenue. Réessayez.");
    } finally {
      setLoadingEmail(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoadingGoogle(true);
    await signIn("google", { callbackUrl });
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Connexion</CardTitle>
          <p className="text-muted-foreground text-sm">
            Connectez-vous avec Google ou recevez un lien magique par email.
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {emailEnabled ? (
            <form onSubmit={handleEmailSignIn} className="space-y-3" noValidate>
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <Button type="submit" className="w-full" disabled={loadingEmail}>
                {loadingEmail ? (
                  <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Mail className="mr-2 size-4" aria-hidden="true" />
                )}
                Se connecter avec email
              </Button>
            </form>
          ) : (
            <p className="text-muted-foreground text-sm">
              La connexion par email est momentanément indisponible.
            </p>
          )}

          <div className="bg-border h-px" />

          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={loadingGoogle}
            onClick={handleGoogleSignIn}
          >
            {loadingGoogle ? (
              <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Continuer avec Google
          </Button>

          {successMessage ? (
            <p className="rounded-md border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-700 dark:text-emerald-300">
              {successMessage}
            </p>
          ) : null}

          {errorMessage ? (
            <p className="rounded-md border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-700 dark:text-red-300">
              {errorMessage}
            </p>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}

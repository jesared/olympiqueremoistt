import { PageHeader } from "~/components/page/page-header";
import { ContactForm } from "~/components/contact/ContactForm";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Contact"
        description="Écrivez-nous pour toute demande : inscriptions, essais, stages ou newsletter."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Nous contacter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Pour recevoir la newsletter <strong>La bulle du ping</strong>, indiquez simplement
              votre e‑mail dans votre message.
            </p>
            <ContactForm />
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline">
                <a href="mailto:contact@ortt.fr">contact@ortt.fr</a>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:henrion-stephane-ortt@sfr.fr">henrion-stephane-ortt@sfr.fr</a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Complexe René Tys, 5 impasse Léo Lagrange, 51100 Reims
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Recevoir la newsletter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Envoyez un e‑mail avec l’objet <strong>Newsletter</strong> et votre adresse
              à ajouter à la liste de diffusion.
            </p>
            <Button asChild>
              <a href="mailto:contact@ortt.fr?subject=Newsletter">Recevoir la newsletter</a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

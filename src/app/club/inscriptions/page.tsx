import { PageHeader } from "~/components/page/page-header";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const practiceTypes = [
  "Loisirs adultes",
  "Baby Ping à partir de 4/5 ans",
  "Débutant, perfectionnement jeune",
  "Compétition jeune et adulte",
  "Valides et handicapés (moteurs et psychiques, maladie de Parkinson)",
];

const documents = [
  {
    label: "Bordereau d'adhésion 2025-26",
    href: "https://www.ortt.fr/wp-content/uploads/2025/07/Bordereau_adhesion_2025-26.pdf",
  },
  {
    label: "Licence 25-2",
    href: "https://www.ortt.fr/wp-content/uploads/2025/07/25-2-licence.pdf",
  },
  {
    label: "Certificat médical 25-9",
    href: "https://www.ortt.fr/wp-content/uploads/2025/07/25-9-certificat.pdf",
  },
  {
    label: "Auto-questionnaire médical majeur",
    href: "https://www.ortt.fr/wp-content/uploads/2025/07/25-10-1-autoquestionnaire-medical-majeur.pdf",
  },
  {
    label: "Auto-questionnaire médical mineur",
    href: "https://www.ortt.fr/wp-content/uploads/2025/07/25-10-2-autoquestionnaire-medical-mineur.pdf",
  },
];

const membershipSteps = [
  {
    title: "Télécharger les documents",
    description:
      "Téléchargez le bordereau d'adhésion et le formulaire de licence, puis lisez attentivement les consignes (cotisations, modes de paiement, etc.).",
  },
  {
    title: "Compléter le dossier",
    description:
      "Une adresse e-mail est requise même pour les mineurs. Ajoutez un certificat médical ou l'auto-questionnaire adapté.",
  },
  {
    title: "Déposer ou envoyer",
    description:
      "Envoyez le dossier complet à ORTT, 5 impasse Léo Lagrange, 51100 Reims, ou remettez-le directement à la salle de René Tys.",
  },
];

const dematerializedItems = [
  "Une attestation de licence individuelle (reçue par mail ou téléchargeable dans l'espace licencié / mon club).",
  "Une attestation de licence collective (dans l'espace mon club).",
  "Votre smartphone pour accéder à la licence sur fftt.com/licence (ou SPID).",
  "L'application Smartping pour attester de votre licenciation.",
];

export default function ClubInscriptionsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Inscriptions 2025-2026"
        description="Bordereaux d&apos;adhésion, documents et planning des entraînements pour rejoindre l&apos;ORTT."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pratiquer le tennis de table à l&apos;ORTT</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              L&apos;Olympique Rémois Tennis de Table vous accueille toute l&apos;année pour pratiquer le tennis de table sous toutes ses formes.
            </p>
            <ul className="list-disc space-y-1.5 pl-5">
              {practiceTypes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Planning des entraînements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Le planning 2025-2026 est disponible en PDF.
            </p>
            <Button asChild variant="outline" className="w-full">
              <a
                href="https://www.ortt.fr/wp-content/uploads/2025/07/planning-entrainement-ORTT-2025-2026.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Télécharger le planning
              </a>
            </Button>
            <div className="text-muted-foreground space-y-1 text-xs">
              <p>Contact : Stéphane HENRION, entraîneur</p>
              <p>06 67 43 96 34</p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Comment nous rejoindre ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-relaxed">
            {membershipSteps.map((step) => (
              <div key={step.title}>
                <p className="font-medium">{step.title}</p>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
            <p className="text-muted-foreground text-xs">
              Merci de remettre un dossier complet et correctement rempli.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents à fournir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {documents.map((doc) => (
              <Button key={doc.href} asChild variant="outline" className="w-full justify-start">
                <a href={doc.href} target="_blank" rel="noreferrer">
                  {doc.label}
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Les salles d&apos;entraînement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Salle d&apos;entraînement : Complexe René Tys, 5 impasse Léo Lagrange, 51100 Reims.
            </p>
            <p>
              Championnat par équipes : Gymnase Géo André, rue François Mauriac, 51100 Reims.
            </p>
            <Button asChild variant="outline" className="w-fit">
              <a href="/plan-dacces">Plan d&apos;accès</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Licence dématérialisée</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm leading-relaxed">
            <p className="text-muted-foreground">
              Depuis 2015, les licences ne sont plus imprimées. Vous pouvez attester de votre licenciation via :
            </p>
            <ul className="list-disc space-y-1.5 pl-5 text-muted-foreground">
              {dematerializedItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

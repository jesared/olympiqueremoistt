import { PageHeader } from "~/components/page/page-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Card, CardContent } from "~/components/ui/card";

const faqs = [
  {
    id: "seance-essai-enfant",
    question: "Mon enfant (12-14 ans) peut-il faire une séance d’essai ?",
    answer:
      "Oui, c’est possible. Les essais se font généralement le mercredi et/ou le vendredi. Exemple de créneaux évoqués : mercredi 13h30-15h00 ou 17h30-19h00, et vendredi 17h30-19h00 ou 19h00-20h30. Les horaires peuvent varier selon l’âge et la période.",
  },
  {
    id: "lieu-entrainement",
    question: "Où ont lieu les entraînements d’essai ?",
    answer:
      "Les entraînements ont lieu au complexe sportif René Tys à Reims.",
  },
  {
    id: "stages-vacances",
    question: "Proposez-vous des stages pendant les vacances ?",
    answer:
      "Oui, des stages sont proposés pendant certaines vacances scolaires. Exemple : un stage jeunes du 24 au 27 février. Le contenu et les dates peuvent évoluer d’une saison à l’autre.",
  },
  {
    id: "loisirs-adultes",
    question: "Avez-vous un groupe loisirs adultes ?",
    answer:
      "Oui, un groupe loisirs existe. Pour les tarifs et les jours d’entraînement, contactez le club afin d’obtenir les détails à jour.",
  },
  {
    id: "parent-enfant",
    question: "Puis-je venir jouer avec ma fille (adulte + enfant) ?",
    answer:
      "Oui, c’est possible. Un créneau cité pour ce type de pratique est le vendredi 19h00-20h30.",
  },
  {
    id: "contact",
    question: "Comment obtenir une réponse précise et personnalisée ?",
    answer:
      "Le club peut vous répondre par e-mail avec les informations adaptées à votre situation (âge, niveau, période).",
  },
];

export default function FaqPage() {
  return (
    <main className="mx-auto w-full max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="FAQ"
        description="Questions fréquentes sur les séances d’essai, les stages et les créneaux d’entraînement."
      />

      <Card>
        <CardContent className="pt-6">
          <Accordion type="single" collapsible>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </main>
  );
}

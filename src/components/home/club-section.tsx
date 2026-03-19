import { CheckCircle2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import SectionHeading from "~/components/home/section-heading";

const strengths = [
  "Encadrement diplômé pour jeunes et adultes",
  "Parcours progression loisir, formation et compétition",
  "Infrastructure rénovée et matériel de qualité",
  "Vie de club active portée par les bénévoles",
];

export default function ClubSection() {
  return (
    <section
      aria-labelledby="club-title"
      className="bg-card/50 rounded-3xl border border-border/70 p-6 sm:p-8 lg:p-10"
    >
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <SectionHeading
          id="club-title"
          eyebrow="Le club"
          title="Une structure pensée pour progresser durablement"
          description="À l'ORTT, chaque adhérent bénéficie d'un accompagnement adapté à ses objectifs, du premier échange à la performance en compétition."
        />

        <div className="space-y-5">
          <ul className="space-y-3" aria-label="Atouts du club ORTT">
            {strengths.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm sm:text-base">
                <CheckCircle2
                  className="text-primary mt-0.5 size-5 shrink-0"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Button asChild className="w-full sm:w-auto">
            <a href="/club">Découvrir le projet sportif</a>
          </Button>
        </div>
      </div>
    </section>
  );
}

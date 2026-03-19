import { ArrowRight, CalendarDays, Trophy, Users } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { Card } from "../ui/card";

const highlights = [
  { label: "Licenciés", value: "220+", icon: Users },
  { label: "Équipes engagées", value: "14", icon: Trophy },
  { label: "Événements annuels", value: "30+", icon: CalendarDays },
];

export default function HeroSection() {
  return (
    <Card className="bg-muted relative isolate overflow-hidden rounded-3xl border p-6 text-center backdrop-blur-xl sm:p-10 sm:py-16">
      <div className="from-primary/10 to-primary/5 absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
        {/* LEFT */}
        <div className="space-y-6 text-left">
          <p className="bg-muted/40 text-muted-foreground inline-flex items-center rounded-full border px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
            Olympique Rémois Tennis de Table
          </p>

          <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Club formateur, <span className="text-primary">passion locale</span>
            , ambition nationale.
          </h1>

          <p className="text-muted-foreground max-w-2xl text-base sm:text-lg">
            Suivez la vie du club, les résultats, les événements et les actions
            qui font grandir la communauté ORTT.
          </p>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="gap-2">
              <Link href="/club">
                Rejoindre le club
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/evenements">Voir les événements</Link>
            </Button>
          </div>
        </div>

        {/* RIGHT STATS */}
        <dl
          className="grid w-full gap-3 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1"
          aria-label="Chiffres clés du club"
        >
          {highlights.map((highlight) => {
            const Icon = highlight.icon;

            return (
              <div
                key={highlight.label}
                className={cn(
                  "group rounded-2xl border p-4 transition-all",
                  "bg-card/60 hover:bg-card hover:shadow-md",
                )}
              >
                <dt className="text-muted-foreground flex items-center gap-2 text-xs font-medium uppercase">
                  <Icon className="text-primary size-4" />
                  {highlight.label}
                </dt>

                <dd className="mt-2 text-2xl font-bold tracking-tight">
                  {highlight.value}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </Card>
  );
}

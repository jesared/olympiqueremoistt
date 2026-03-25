import { ArrowRight, CalendarDays, Trophy, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { TypingText } from "~/components/ui/typing-text";
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
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.012]">
        <svg
          className="h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <pattern id="hero-lines" width="1" height="14" patternUnits="userSpaceOnUse">
              <path
                d="M0 0 H1"
                className="stroke-foreground"
                strokeWidth="0.4"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#hero-lines)" />
        </svg>
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_auto] lg:items-end">
        {/* LEFT */}
        <div className="space-y-6 text-left">
          <div className="bg-background/70 relative overflow-hidden rounded-2xl border p-4 shadow-sm">
            <div className="from-primary/10 to-primary/10 pointer-events-none absolute -inset-6 bg-gradient-to-r via-transparent opacity-70 blur-2xl motion-safe:animate-pulse" />
            <div className="relative flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center border shadow-sm">
                <Image
                  src="/logo.jpg"
                  alt="Logo Olympique Rémois Tennis de Table"
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-lg object-contain"
                  priority
                />
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] font-semibold tracking-[0.28em] uppercase">
                  Identité du club
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-base font-semibold">
                    Olympique Rémois Tennis de Table
                  </p>
                  <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-[0.2em] uppercase">
                    Depuis 1946
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Convivialité, formation et ambition sportive
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Club formateur,{" "}
            <TypingText
              words={["passion locale", "ambition nationale"]}
              className="text-primary"
              speed={70}
              deleteSpeed={40}
              cycleDelay={1400}
            />
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

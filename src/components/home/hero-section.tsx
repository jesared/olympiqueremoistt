import Link from "next/link";
import { ArrowRight, CalendarDays, Trophy, Users } from "lucide-react";

import { Button } from "~/components/ui/button";

const highlights = [
  { label: "Licenciés", value: "220+", icon: Users },
  { label: "Équipes engagées", value: "14", icon: Trophy },
  { label: "Événements annuels", value: "30+", icon: CalendarDays },
];

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-white/15 bg-[radial-gradient(circle_at_top_left,oklch(0.75_0.17_240/.38),transparent_45%),radial-gradient(circle_at_80%_10%,oklch(0.7_0.2_25/.3),transparent_45%),linear-gradient(to_bottom,oklch(0.19_0.03_260),oklch(0.12_0.02_260))] px-5 py-14 text-white shadow-2xl sm:px-10 sm:py-16">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent_0%,oklch(1_0_0/.08)_50%,transparent_100%)]" />

      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] uppercase">
            Olympique Rémois Tennis de Table
          </p>

          <h1 className="text-balance text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Club formateur, passion locale, ambition nationale.
          </h1>

          <p className="max-w-2xl text-base text-white/85 sm:text-lg">
            Découvrez une structure moderne pour suivre la vie du club, nos
            résultats, les rendez-vous à venir et les actions qui font grandir
            la communauté ORTT.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-10 px-5 text-sm">
              <Link href="/club">
                Rejoindre le club
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-10 border-white/35 bg-white/5 px-5 text-sm text-white hover:bg-white/15 hover:text-white"
            >
              <Link href="/evenements">Voir les événements</Link>
            </Button>
          </div>
        </div>

        <dl className="grid w-full gap-3 sm:grid-cols-3 lg:w-[340px] lg:grid-cols-1" aria-label="Chiffres clés du club">
          {highlights.map((highlight) => (
            <div
              key={highlight.label}
              className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur"
            >
              <dt className="flex items-center gap-2 text-xs font-medium text-white/80 uppercase">
                <highlight.icon className="size-3.5" aria-hidden="true" />
                {highlight.label}
              </dt>
              <dd className="mt-2 text-2xl font-bold">{highlight.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

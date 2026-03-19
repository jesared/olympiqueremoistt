import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,oklch(0.75_0.19_240/.35),transparent_45%),radial-gradient(circle_at_bottom_right,oklch(0.68_0.21_28/.26),transparent_50%),linear-gradient(to_bottom,oklch(0.17_0.03_260),oklch(0.11_0.02_260))]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,transparent_0%,oklch(1_0_0/.06)_50%,transparent_100%)]" />

      <div className="mx-auto w-full max-w-3xl rounded-3xl border border-white/15 bg-white/8 p-8 text-center shadow-2xl backdrop-blur-xl sm:p-12">
        <p className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90">
          Olympique Rémois Tennis de Table
        </p>

        <h1 className="text-balance text-4xl font-black tracking-tight text-white drop-shadow-sm sm:text-5xl lg:text-6xl">
          Dominez la table, vivez l&apos;esprit de la compétition.
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-pretty text-base text-white/80 sm:text-lg">
          Rejoignez un club passionné, progressez avec des entraîneurs engagés et
          participez aux tournois qui font vibrer la région.
        </p>

        <div className="mt-10">
          <Link
            href="/competitions"
            className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-semibold text-slate-950 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-white/95"
          >
            Voir les compétitions
          </Link>
        </div>
      </div>
    </section>
  )
}

import Image from "next/image";

type ClubHistoryItem = {
  year: string;
  title: string;
  description: string;
};

const clubCreationYear = 1987;

const history: ClubHistoryItem[] = [
  {
    year: "1987",
    title: "Création du club",
    description: "Le club est fondé à Reims avec une ambition simple : jouer et progresser ensemble.",
  },
  {
    year: "1998",
    title: "Première montée en division régionale",
    description: "L’équipe fanion franchit un cap sportif et atteint le niveau régional.",
  },
  {
    year: "2009",
    title: "Événements marquants et ouverture locale",
    description: "Tournois, stages jeunes et actions locales renforcent la présence du club.",
  },
  {
    year: "2018",
    title: "Développement structuré du club",
    description: "Le club professionnalise l’encadrement et consolide sa filière jeunes.",
  },
  {
    year: "2024",
    title: "Nouvelle dynamique sportive",
    description: "Le projet sportif continue de grandir avec une vie associative dynamique.",
  },
];

const timelineImages = [
  {
    src: "/images/club-history/ancienne-photo.svg",
    alt: "Photo ancienne du club lors des premières années",
    caption: "Archives du club : les débuts.",
    afterItemIndex: 1,
  },
  {
    src: "/images/club-history/photo-evenement.svg",
    alt: "Photo d'un événement marquant organisé par le club",
    caption: "Événements marquants et vie associative.",
    afterItemIndex: 3,
  },
] as const;

export default function ClubHistoryPage() {
  return (
    <section className="mx-auto w-full max-w-5xl space-y-14">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          L&apos;historique du club
        </h1>
        <p className="text-muted-foreground max-w-3xl text-sm leading-relaxed sm:text-base">
          Les moments clés de l&apos;Olympique Rémois Tennis de Table, de sa
          création à aujourd&apos;hui.
        </p>
      </header>

      <section
        aria-labelledby="introduction"
        className="bg-card rounded-2xl border p-6 shadow-sm sm:p-8"
      >
        <h2 id="introduction" className="text-2xl font-semibold tracking-tight">
          Introduction
        </h2>
        <div className="mt-4 max-w-3xl space-y-3">
          <p className="text-muted-foreground leading-relaxed">
            Un club ouvert à tous, axé sur la progression et la convivialité.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Créé en <span className="text-foreground font-medium">{clubCreationYear}</span>,
            il grandit avec ses licenciés, ses bénévoles et ses résultats.
          </p>
        </div>
      </section>

      <section aria-labelledby="timeline" className="space-y-6">
        <h2 id="timeline" className="text-2xl font-semibold tracking-tight">
          Timeline
        </h2>
        <ol className="relative space-y-6">
          <span
            aria-hidden
            className="bg-border absolute bottom-0 left-20 top-0 hidden w-px md:block"
          />
          {history.map((item, index) => {
            const image = timelineImages.find((entry) => entry.afterItemIndex === index);

            return (
              <li key={item.year} className="space-y-4">
                <article className="grid gap-3 md:grid-cols-[70px_1fr] md:gap-6">
                  <p className="text-primary text-sm font-semibold md:pt-1">
                    {item.year}
                  </p>
                  <div className="relative">
                    <span
                      aria-hidden
                      className="bg-primary absolute -left-5 top-5 hidden h-3.5 w-3.5 rounded-full md:block"
                    />
                    <div className="bg-card max-w-3xl rounded-xl border p-4 sm:p-5">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>

                {image ? (
                  <div className="md:ml-[94px]">
                    <figure className="overflow-hidden rounded-2xl border shadow-sm">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        width={1200}
                        height={675}
                        className="h-auto w-full object-cover"
                      />
                      <figcaption className="text-muted-foreground bg-card px-4 py-3 text-sm">
                        {image.caption}
                      </figcaption>
                    </figure>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ol>
      </section>

      <section
        aria-labelledby="aujourdhui"
        className="bg-muted/40 rounded-2xl border p-6 sm:p-8"
      >
        <h2 id="aujourdhui" className="text-2xl font-semibold tracking-tight">
          Aujourd&apos;hui
        </h2>
        <p className="text-muted-foreground mt-4 max-w-3xl leading-relaxed">
          Le club accueille tous les niveaux, propose des créneaux jeunes et
          adultes, et poursuit un projet sportif ambitieux.
        </p>
      </section>
    </section>
  );
}

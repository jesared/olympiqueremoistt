import Image from "next/image";

import { Card, CardContent, CardHeader } from "~/components/ui/card";

const placeholderAvatar =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
      <rect width="240" height="240" fill="#e5e7eb"/>
      <circle cx="120" cy="88" r="42" fill="#cbd5e1"/>
      <rect x="46" y="148" width="148" height="72" rx="36" fill="#cbd5e1"/>
    </svg>`,
  );

type Member = {
  name: string;
  role: string;
  info?: string;
  imageSrc: string;
};

const bureauMembers: Member[] = [
  {
    name: "Nom à compléter",
    role: "Président",
    info: "presidence@ortt.fr",
    imageSrc: placeholderAvatar,
  },
  {
    name: "Nom à compléter",
    role: "Vice-président",
    info: "contact@ortt.fr",
    imageSrc: placeholderAvatar,
  },
  {
    name: "Nom à compléter",
    role: "Trésorier",
    info: "tresorerie@ortt.fr",
    imageSrc: placeholderAvatar,
  },
  {
    name: "Nom à compléter",
    role: "Secrétaire",
    info: "secretariat@ortt.fr",
    imageSrc: placeholderAvatar,
  },
];

const extendedTeamMembers: Member[] = [
  {
    name: "Nom à compléter",
    role: "Encadrant",
    info: "Entraînement jeunes",
    imageSrc: placeholderAvatar,
  },
  {
    name: "Nom à compléter",
    role: "Bénévole",
    info: "Organisation événements",
    imageSrc: placeholderAvatar,
  },
  {
    name: "Nom à compléter",
    role: "Membre actif",
    info: "Support compétitions",
    imageSrc: placeholderAvatar,
  },
];

function MemberCard({ name, role, info, imageSrc }: Member) {
  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      <CardHeader className="items-center pb-4">
        <Image
          src={imageSrc}
          alt={`Photo de ${name}`}
          width={88}
          height={88}
          className="h-24 w-24 rounded-full border object-cover"
        />
      </CardHeader>
      <CardContent className="space-y-1 text-center">
        <p className="font-semibold">{name}</p>
        <p className="text-muted-foreground text-sm">{role}</p>
        {info ? <p className="text-muted-foreground text-xs">{info}</p> : null}
      </CardContent>
    </Card>
  );
}

export default function ClubLeadershipPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          L&apos;équipe dirigeante
        </h1>
        <p className="text-muted-foreground max-w-3xl text-sm sm:text-base">
          L&apos;Olympique Rémois Tennis de Table s&apos;appuie sur une équipe
          engagée qui fait vivre le club au quotidien, sur et en dehors des
          tables.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">Introduction</h2>
        <p className="text-muted-foreground leading-relaxed">
          Notre bureau et nos bénévoles œuvrent ensemble pour proposer un cadre
          sportif convivial, structuré et accessible à tous les publics :
          loisirs, compétition, jeunes et adultes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Le bureau</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {bureauMembers.map((member) => (
            <MemberCard key={member.role} {...member} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight">
          L&apos;équipe élargie
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Au-delà du bureau, le club peut compter sur ses membres actifs,
          bénévoles et encadrants qui participent à l&apos;organisation des
          entraînements, compétitions, événements et actions de la vie
          associative.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {extendedTeamMembers.map((member, index) => (
            <MemberCard key={`${member.role}-${index}`} {...member} />
          ))}
        </div>
      </section>
    </section>
  );
}

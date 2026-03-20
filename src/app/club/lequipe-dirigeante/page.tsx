import Image from "next/image";

import { Card, CardContent, CardHeader } from "~/components/ui/card";

type Member = {
  name: string;
  role: string;
  info?: string;
  image: string;
  group: "bureau" | "equipe_elargie";
};

const members: Member[] = [
  {
    name: "Nom à compléter",
    role: "Président",
    info: "presidence@ortt.fr",
    image: "/images/members/placeholder.svg",
    group: "bureau",
  },
  {
    name: "Nom à compléter",
    role: "Vice-président",
    info: "contact@ortt.fr",
    image: "/images/members/placeholder.svg",
    group: "bureau",
  },
  {
    name: "Nom à compléter",
    role: "Trésorier",
    info: "tresorerie@ortt.fr",
    image: "/images/members/placeholder.svg",
    group: "bureau",
  },
  {
    name: "Nom à compléter",
    role: "Secrétaire",
    info: "secretariat@ortt.fr",
    image: "/images/members/placeholder.svg",
    group: "bureau",
  },
  {
    name: "Nom à compléter",
    role: "Encadrant",
    info: "Entraînement jeunes",
    image: "/images/members/placeholder.svg",
    group: "equipe_elargie",
  },
  {
    name: "Nom à compléter",
    role: "Bénévole",
    info: "Organisation événements",
    image: "/images/members/placeholder.svg",
    group: "equipe_elargie",
  },
  {
    name: "Nom à compléter",
    role: "Membre actif",
    info: "Support compétitions",
    image: "/images/members/placeholder.svg",
    group: "equipe_elargie",
  },
];

const bureauMembers = members.filter((member) => member.group === "bureau");
const extendedTeamMembers = members.filter(
  (member) => member.group === "equipe_elargie",
);

function MemberCard({ name, role, info, image }: Omit<Member, "group">) {
  return (
    <Card className="h-full border-border/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <CardHeader className="items-center pb-4">
        <Image
          src={image}
          alt={`Photo de ${name}`}
          width={88}
          height={88}
          className="h-20 w-20 rounded-full border object-cover sm:h-24 sm:w-24"
          sizes="(max-width: 640px) 80px, 96px"
        />
      </CardHeader>
      <CardContent className="space-y-1 text-center">
        <p className="text-base font-semibold">{name}</p>
        <p className="text-muted-foreground text-sm sm:text-base">{role}</p>
        {info ? (
          <p className="text-muted-foreground text-sm leading-relaxed">{info}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function ClubLeadershipPage() {
  return (
    <section className="mx-auto w-full max-w-6xl space-y-12">
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

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">Introduction</h2>
        <p className="text-muted-foreground leading-relaxed">
          Notre bureau et nos bénévoles œuvrent ensemble pour proposer un cadre
          sportif convivial, structuré et accessible à tous les publics :
          loisirs, compétition, jeunes et adultes.
        </p>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">Le bureau</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bureauMembers.map((member) => (
            <MemberCard
              key={member.role}
              name={member.name}
              role={member.role}
              info={member.info}
              image={member.image}
            />
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="text-2xl font-semibold tracking-tight">L&apos;équipe</h2>
        <p className="text-muted-foreground leading-relaxed">
          Au-delà du bureau, le club peut compter sur ses membres actifs,
          bénévoles et encadrants qui participent à l&apos;organisation des
          entraînements, compétitions, événements et actions de la vie
          associative.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {extendedTeamMembers.map((member, index) => (
            <MemberCard
              key={`${member.role}-${index}`}
              name={member.name}
              role={member.role}
              info={member.info}
              image={member.image}
            />
          ))}
        </div>
      </section>
    </section>
  );
}

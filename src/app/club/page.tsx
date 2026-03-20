import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PageHeader } from "~/components/page/page-header";
import { volunteerMissions } from "~/data/content";

const clubInfos = [
  { label: "Adresse", value: "14 rue des Sports, 45000 Orléans" },
  { label: "Créneaux adultes", value: "Lundi, jeudi et vendredi de 19h à 22h" },
  {
    label: "Créneaux jeunes",
    value: "Mercredi de 14h à 19h et samedi de 10h à 12h",
  },
  { label: "Encadrement", value: "2 entraîneurs diplômés + équipe bénévole" },
];

export default function ClubPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Le club ORTT"
        description="L&apos;Olympique Rémois Tennis de Table est un club familial et ambitieux qui accompagne les joueurs loisir et compétition toute l&apos;année."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Présentation</CardTitle>
            <CardDescription>
              Un club structuré pour la progression sportive et la convivialité.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              ORTT propose des entraînements adaptés à tous les niveaux :
              découverte, perfectionnement technique, préparation physique et
              suivi en compétition.
            </p>
            <p>
              La saison s&apos;articule autour de séances encadrées, de stages
              pendant les vacances et d&apos;actions locales en lien avec les écoles
              et associations sportives de la ville.
            </p>
            <Button variant="outline">Découvrir les adhésions</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              {clubInfos.map((info) => (
                <li key={info.label} className="space-y-1">
                  <p className="font-medium">{info.label}</p>
                  <p className="text-muted-foreground">{info.value}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Bénévolat</CardTitle>
            <CardDescription>
              Le club se développe grâce à l&apos;engagement de ses bénévoles.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {volunteerMissions.map((mission) => (
              <div
                key={mission.id}
                className="bg-muted/40 space-y-2 rounded-lg border p-4"
              >
                <h3 className="font-medium">{mission.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {mission.description}
                </p>
                <p className="text-xs font-medium">
                  Disponibilité : {mission.schedule}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

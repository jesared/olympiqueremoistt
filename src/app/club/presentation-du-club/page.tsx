import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PageHeader } from "~/components/page/page-header";

export default function ClubPresentationPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Présentation du club"
        description="Sport à Reims : bienvenue sur le site de l’Olympique Rémois Tennis de Table."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Découvrez ici le club de l’ORTT</CardTitle>
            <CardDescription>
              Convivialité et formation : une ambition qui anime le club depuis
              sa création.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              Après un site internet mis en place le 30 décembre 2008, une
              nouvelle version est ouverte depuis janvier 2015. Plus de 250
              visiteurs viennent chaque jour sur le site, parfois jusqu’à plus
              de 400 lors des événements majeurs.
            </p>
            <p>
              Le club a été fondé en 1946 par Charles ARTAUD (1924-2018).
              Albert GAUVIN, longtemps vice-président, puis président de 2003 à
              2006, est à nouveau président de l’ORTT depuis juin 2017.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Button asChild variant="outline" size="sm">
                <a
                  href="https://www.ortt.fr/wp-content/uploads/2015/10/Statuts-ORTT-02-10-15.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Statuts ORTT
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href="https://www.ortt.fr/wp-content/uploads/2018/07/R%C3%A8glement-Int%C3%A9rieur-01-07-18.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Règlement intérieur
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href="https://www.ortt.fr/wp-content/uploads/2026/01/DOSSIER-SPONSORING-20252026-1.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Plaquette 2025/2026
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chiffres clés</CardTitle>
            <CardDescription>Un club ancré à Reims.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-medium">230 licenciés</p>
              <p className="text-muted-foreground">
                Une communauté qui grandit chaque saison.
              </p>
            </div>
            <div>
              <p className="font-medium">Club labellisé</p>
              <p className="text-muted-foreground">
                FFTT 3 étoiles en 2006 et 4 étoiles en 2008. Label club FFH en
                2021 et 2022.
              </p>
            </div>
            <div>
              <p className="font-medium">Encadrement</p>
              <p className="text-muted-foreground">
                Stéphane HENRION (entraîneur principal) et Théo HENRION
                (éducateur).
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Un club formateur</CardTitle>
            <CardDescription>
              Des parcours qui rayonnent en France et à l’international.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Dienouma COULIBALY, ex-n°77 française, formée au club et passée
                par la Pro B et la Pro A dames jusqu’au début 2010.
              </li>
              <li>
                Abdel-Kader SALIFOU, n°106 mondial, formé à l’ORTT, joue
                désormais en Pro B dans le championnat français.
              </li>
              <li>
                Lucas CREANGE, plusieurs fois champion du monde (sport adapté),
                n°3 mondial, médaillé de bronze aux Jeux Paralympiques Tokyo
                2020 (août 2021), triple champion de France 2022, formé au club
                et évolue en N1 par équipes.
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vie du club</CardTitle>
            <CardDescription>
              Une dynamique locale tournée vers tous les publics.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Créneau Handisport ouvert depuis septembre 2006, affilié à la
                FFH et à la FFSA.
              </li>
              <li>
                Les créneaux Loisirs confirment la vitalité du club, avec des
                profils variés.
              </li>
              <li>
                Actions dans les écoles de Reims et Reims Vital Eté.
              </li>
              <li>
                Deux créneaux Baby-ping (5-10 ans) le mercredi matin et une
                école de tennis de table d’environ 50 jeunes le mercredi
                après-midi.
              </li>
              <li>
                Organisation depuis 1992 du GRAND PRIX DE LA VILLE DE REIMS
                (trophée Philippe GEORGELIN) à l’Ascension.
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Nous contacter</CardTitle>
            <CardDescription>
              Besoin d’un renseignement ou envie de rejoindre une équipe ?
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <a href="https://www.ortt.fr/contact" target="_blank" rel="noreferrer">
                Contactez-nous
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a
                href="https://www.ortt.fr/club/donsponsoring/"
                target="_blank"
                rel="noreferrer"
              >
                Appel aux sponsors
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href="https://www.ortt.fr/plan-dacces/" target="_blank" rel="noreferrer">
                Plan d’accès
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

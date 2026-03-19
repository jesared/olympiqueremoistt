import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { PageHeader } from "~/components/page/page-header";

const mockUser = {
  firstName: "Camille",
  lastName: "Martin",
  email: "camille.martin@ortt.fr",
  licenseNumber: "FFTT-4501-2026",
  ranking: "11",
  role: "Joueuse & bénévole",
};

export default function ProfilPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Profil"
        description="Gérez vos informations personnelles, votre licence et vos préférences club."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div className="space-y-1.5">
              <CardTitle>Informations utilisateur</CardTitle>
              <CardDescription>
                Données mock prêtes pour une future connexion session/API FFTT.
              </CardDescription>
            </div>
            <Avatar className="size-12 border">
              <AvatarFallback>
                {mockUser.firstName[0]}
                {mockUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Prénom</p>
              <p className="font-medium">{mockUser.firstName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Nom</p>
              <p className="font-medium">{mockUser.lastName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase">Email</p>
              <p className="font-medium">{mockUser.email}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-xs uppercase">
                Licence FFTT
              </p>
              <p className="font-medium">{mockUser.licenseNumber}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Résumé sportif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="font-medium">Classement :</span>{" "}
              {mockUser.ranking}
            </p>
            <p>
              <span className="font-medium">Statut :</span> {mockUser.role}
            </p>
            <Button className="w-full">Modifier le profil</Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

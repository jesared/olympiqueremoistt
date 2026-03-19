import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function AdminParametresPage() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Paramètres tournoi</CardTitle>
          <CardDescription>
            Préparation des règles globales et des quotas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Configurer les tableaux
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Délais d&apos;inscription
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Automatisations</CardTitle>
          <CardDescription>
            Préparer les exports et les notifications futures.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            Connecter export CSV
          </Button>
          <Button variant="outline" className="w-full justify-start">
            Relances automatiques
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

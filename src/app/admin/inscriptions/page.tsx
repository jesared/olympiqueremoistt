import { Check, Trash2 } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { registrations } from "~/data/admin";

export default function AdminInscriptionsPage() {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Tableaux</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell className="font-medium">
                  {registration.name}
                </TableCell>
                <TableCell>{registration.club}</TableCell>
                <TableCell>{registration.brackets.join(", ")}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      registration.status === "validated"
                        ? "success"
                        : "warning"
                    }
                  >
                    {registration.status === "validated"
                      ? "Validé"
                      : "En attente"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Check className="size-4" />
                      Valider
                    </Button>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="size-4" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

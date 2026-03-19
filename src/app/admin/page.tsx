import { AlertCircle, CheckCircle2, Hourglass } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { adminStats, registrations } from "~/data/admin";

const icons = [CheckCircle2, Hourglass, AlertCircle];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {adminStats.map((stat, index) => {
          const Icon = icons[index] ?? CheckCircle2;

          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.label}
                </CardTitle>
                <Icon className="text-muted-foreground size-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{stat.value}</div>
                <p className="text-muted-foreground text-xs">{stat.trend}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Dernières inscriptions</CardTitle>
          <CardDescription>
            Workflow rapide organisateur : valider puis encaisser.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Joueur</TableHead>
                <TableHead>Club</TableHead>
                <TableHead>Tableaux</TableHead>
                <TableHead>Statut</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

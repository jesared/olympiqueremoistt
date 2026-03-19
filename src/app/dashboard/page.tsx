import { Bell, CalendarCheck2, Plus, Trophy, UsersRound } from "lucide-react";

import { DashboardHeading } from "~/components/dashboard/dashboard-heading";
import { StatCard } from "~/components/dashboard/stat-card";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  dashboardStats,
  dashboardUser,
  notifications,
  participations,
  playerFeatures,
} from "~/data/dashboard";
import { tournamentRegistrations } from "~/data/tournaments";

export default function DashboardPage() {
  return (
    <div className="space-y-4">
      <DashboardHeading
        title={`Bonjour ${dashboardUser.name.split(" ")[0]} 👋`}
        description="Suivez vos matchs, inscriptions et progrès FFTT en un coup d'œil."
        action={{
          label: "Nouvelle inscription",
          icon: <Plus className="mr-1 size-4" />,
          href: "/dashboard/inscriptions/nouvelle",
        }}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Participations"
          value={dashboardStats.totalParticipations}
          hint="Sur la saison actuelle"
          icon={<Trophy className="text-muted-foreground size-4" />}
        />
        <StatCard
          title="Événements à venir"
          value={dashboardStats.upcomingEvents}
          hint="Tournois et stages"
          icon={<CalendarCheck2 className="text-muted-foreground size-4" />}
        />
        <StatCard
          title="Points gagnés"
          value={dashboardStats.totalPoints}
          hint="Total cumulé"
          icon={<UsersRound className="text-muted-foreground size-4" />}
        />
        <StatCard
          title="Notifications"
          value={dashboardStats.unreadNotifications}
          hint="Non lues"
          icon={<Bell className="text-muted-foreground size-4" />}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Mes prochaines inscriptions</CardTitle>
            <CardDescription>
              Vue rapide des événements à venir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tournamentRegistrations.slice(0, 3).map((registration) => (
              <div
                key={registration.id}
                className="bg-muted/40 flex items-center justify-between rounded-lg p-3"
              >
                <div>
                  <p className="text-sm font-medium">
                    {registration.tournamentName}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {registration.date} • {registration.city}
                  </p>
                </div>
                <Badge
                  variant={
                    registration.status === "Validé" ? "success" : "warning"
                  }
                >
                  {registration.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Fonctionnalités recommandées</CardTitle>
            <CardDescription>
              Roadmap utile pour un joueur ORTT.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {playerFeatures.slice(0, 5).map((feature) => (
              <div key={feature} className="bg-muted/40 rounded-lg p-3 text-sm">
                {feature}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Dernières participations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {participations.slice(0, 3).map((participation) => (
              <div
                key={participation.id}
                className="bg-muted/40 rounded-lg p-3"
              >
                <p className="text-sm font-medium">{participation.event}</p>
                <p className="text-muted-foreground text-xs">
                  {participation.date} • {participation.result}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader>
            <CardTitle>Messages récents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.slice(0, 3).map((notification) => (
              <div key={notification.id} className="bg-muted/40 rounded-lg p-3">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{notification.title}</p>
                  {notification.unread && (
                    <Badge variant="secondary">Nouveau</Badge>
                  )}
                </div>
                <p className="text-muted-foreground text-xs">
                  {notification.message}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

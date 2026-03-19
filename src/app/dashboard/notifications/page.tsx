import { Bell } from "lucide-react";

import { DashboardHeading } from "~/components/dashboard/dashboard-heading";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { notifications } from "~/data/dashboard";

export default function DashboardNotificationsPage() {
  return (
    <div className="space-y-4">
      <DashboardHeading
        title="Notifications"
        description="Messages du club et rappels importants."
        action={{ label: "Tout marquer lu", icon: <Bell className="mr-1 size-4" /> }}
      />

      <Card>
        <CardHeader>
          <CardTitle>Centre de notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="bg-muted/40 rounded-lg p-3">
              <div className="mb-1 flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{notification.title}</p>
                <div className="flex items-center gap-1">
                  <Badge variant="outline">{notification.type}</Badge>
                  {notification.unread ? <Badge variant="secondary">Nouveau</Badge> : null}
                </div>
              </div>
              <p className="text-muted-foreground text-xs">{notification.message}</p>
              <p className="text-muted-foreground mt-2 text-[11px]">{notification.date}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

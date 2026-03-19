import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { EventCreateForm } from "./event-create-form";

export default function AdminCreateEventPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Créer un événement</CardTitle>
        </CardHeader>

        <CardContent>
          <EventCreateForm />
        </CardContent>
      </Card>
    </div>
  );
}

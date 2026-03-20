import { EventForm } from "./EventForm";

export default function AdminCreateEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Créer un événement
        </h1>
        <p className="text-muted-foreground text-sm">
          Construisez une fiche claire, complète et prête à publier.
        </p>
      </div>

      <EventForm />
    </div>
  );
}

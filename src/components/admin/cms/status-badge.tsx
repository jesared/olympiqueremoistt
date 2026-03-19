import { Badge } from "~/components/ui/badge";
import type { PublicationStatus } from "~/data/cms";

export function StatusBadge({ status }: { status: PublicationStatus }) {
  return (
    <Badge variant={status === "published" ? "success" : "warning"}>
      {status === "published" ? "Publié" : "Brouillon"}
    </Badge>
  );
}

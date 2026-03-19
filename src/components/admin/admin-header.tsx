"use client";

import { Download, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import { Button } from "~/components/ui/button";

type HeaderConfig = {
  title: string;
  description: string;
  primaryAction?: string;
};

const headerConfigByPath: Record<string, HeaderConfig> = {
  "/admin": {
    title: "Dashboard admin",
    description: "Pilotage global des tournois et inscriptions.",
    primaryAction: "Nouveau tournoi",
  },
  "/admin/inscriptions": {
    title: "Inscriptions",
    description: "Validez rapidement les demandes et nettoyez les doublons.",
    primaryAction: "Exporter CSV",
  },
  "/admin/joueurs": {
    title: "Joueurs",
    description: "Annuaire joueurs prêt pour synchronisation API.",
    primaryAction: "Ajouter joueur",
  },
  "/admin/tournois": {
    title: "Tournois",
    description: "Créez vos événements et suivez les tableaux.",
    primaryAction: "Créer un tournoi",
  },
  "/admin/paiements": {
    title: "Paiements",
    description: "Suivi des règlements et des encaissements en attente.",
    primaryAction: "Relancer les retards",
  },
  "/admin/parametres": {
    title: "Paramètres",
    description: "Configuration de la plateforme organisateur.",
  },
};

export function AdminHeader() {
  const pathname = usePathname();
  const config = headerConfigByPath[pathname] ?? headerConfigByPath["/admin"]!;

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-30 mb-5 border-b py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            {config.title}
          </h1>
          <p className="text-muted-foreground text-sm">{config.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-4" />
            Export CSV
          </Button>
          {config.primaryAction ? (
            <Button size="sm">
              <Plus className="size-4" />
              {config.primaryAction}
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}

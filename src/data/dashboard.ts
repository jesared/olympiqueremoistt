export type DashboardUser = {
  name: string;
  email: string;
  level: string;
  ranking: string;
  licenseId: string;
  trainingGroup: string;
};

export type Registration = {
  id: string;
  name: string;
  date: string;
  type: "Tournoi" | "Événement";
  status: "Confirmée" | "En attente" | "Annulée";
  city: string;
};

export type Participation = {
  id: string;
  event: string;
  date: string;
  result: string;
  pointsEarned: number;
};

export type PlayerNotification = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "Info" | "Important" | "Rappel";
  unread: boolean;
};

export const dashboardUser: DashboardUser = {
  name: "Lucas Martin",
  email: "lucas.martin@ortt.fr",
  level: "Régionale 2",
  ranking: "11",
  licenseId: "FFTT-5129384",
  trainingGroup: "Groupe Compétition",
};

export const registrations: Registration[] = [
  {
    id: "reg-1",
    name: "Tournoi régional de Reims",
    date: "2026-04-12",
    type: "Tournoi",
    status: "Confirmée",
    city: "Reims",
  },
  {
    id: "reg-2",
    name: "Stage intensif ORTT",
    date: "2026-05-03",
    type: "Événement",
    status: "En attente",
    city: "Reims",
  },
  {
    id: "reg-3",
    name: "Open de Champagne",
    date: "2026-03-02",
    type: "Tournoi",
    status: "Annulée",
    city: "Épernay",
  },
];

export const participations: Participation[] = [
  {
    id: "part-1",
    event: "Championnat départemental J5",
    date: "2026-02-21",
    result: "Victoire 3-1",
    pointsEarned: 12,
  },
  {
    id: "part-2",
    event: "Tournoi interclubs ORTT",
    date: "2026-01-30",
    result: "Demi-finale",
    pointsEarned: 8,
  },
  {
    id: "part-3",
    event: "Critérium fédéral T2",
    date: "2026-01-12",
    result: "Top 8",
    pointsEarned: 5,
  },
  {
    id: "part-4",
    event: "Coupe locale",
    date: "2025-12-11",
    result: "Victoire 3-0",
    pointsEarned: 10,
  },
];

export const notifications: PlayerNotification[] = [
  {
    id: "not-1",
    title: "Convocation équipe",
    message: "Présence confirmée avant vendredi 18h pour la J6.",
    date: "2026-03-16",
    type: "Important",
    unread: true,
  },
  {
    id: "not-2",
    title: "Changement d'horaire",
    message: "L'entraînement de jeudi commence à 19h30.",
    date: "2026-03-14",
    type: "Info",
    unread: true,
  },
  {
    id: "not-3",
    title: "Rappel inscription",
    message: "Les inscriptions au tournoi interne ferment demain.",
    date: "2026-03-11",
    type: "Rappel",
    unread: false,
  },
];

export const playerFeatures = [
  "Disponibilités hebdomadaires pour faciliter la composition d'équipe",
  "Suivi progression ELO/points FFTT mois par mois",
  "Carnet d'objectifs personnels (service, remise, régularité)",
  "Historique des matchs avec filtre par adversaire",
  "Réservation de créneaux d'entraînement libre",
  "Export calendrier (Google/Apple) pour tournois et matchs",
];

export const dashboardStats = {
  totalParticipations: participations.length,
  upcomingEvents: registrations.filter((item) => item.status !== "Annulée").length,
  totalPoints: participations.reduce((sum, item) => sum + item.pointsEarned, 0),
  unreadNotifications: notifications.filter((item) => item.unread).length,
};

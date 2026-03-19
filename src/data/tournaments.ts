export type TournamentCategory = {
  id: string;
  name: string;
  level: string;
  startTime: string;
  feeEuro: number;
  slotsLeft: number;
};

export type Tournament = {
  id: string;
  name: string;
  city: string;
  venue: string;
  date: string;
  registrationDeadline: string;
  organizer: string;
  paymentPolicy: string;
  categories: TournamentCategory[];
};

export type RegistrationStatus = "En attente" | "Validé";

export type TournamentRegistration = {
  id: string;
  tournamentId: string;
  tournamentName: string;
  date: string;
  city: string;
  selectedCategories: string[];
  status: RegistrationStatus;
  paymentStatus: "Paiement à venir" | "Payé";
};

export const featuredTournament: Tournament = {
  id: "tournoi-reims-printemps-2026",
  name: "Tournoi National ORTT - Printemps 2026",
  city: "Reims",
  venue: "Complexe René Tys",
  date: "2026-04-26",
  registrationDeadline: "2026-04-20",
  organizer: "Olympique Rémois Tennis de Table",
  paymentPolicy:
    "Paiement en ligne bientôt disponible - règlement sur place pour le moment.",
  categories: [
    {
      id: "tab-senior-a",
      name: "Tableau Senior A",
      level: "Classement 14 à 19",
      startTime: "09:00",
      feeEuro: 12,
      slotsLeft: 18,
    },
    {
      id: "tab-senior-b",
      name: "Tableau Senior B",
      level: "Classement 9 à 13",
      startTime: "11:00",
      feeEuro: 10,
      slotsLeft: 23,
    },
    {
      id: "tab-loisir",
      name: "Tableau Loisir",
      level: "Classement 5 à 8",
      startTime: "14:00",
      feeEuro: 8,
      slotsLeft: 28,
    },
    {
      id: "tab-double",
      name: "Tableau Double",
      level: "Toutes séries",
      startTime: "16:30",
      feeEuro: 6,
      slotsLeft: 12,
    },
  ],
};

export const tournamentRegistrations: TournamentRegistration[] = [
  {
    id: "insc-001",
    tournamentId: featuredTournament.id,
    tournamentName: featuredTournament.name,
    date: featuredTournament.date,
    city: featuredTournament.city,
    selectedCategories: ["Tableau Senior B", "Tableau Double"],
    status: "En attente",
    paymentStatus: "Paiement à venir",
  },
  {
    id: "insc-002",
    tournamentId: "open-champagne-2026",
    tournamentName: "Open de Champagne 2026",
    date: "2026-03-29",
    city: "Épernay",
    selectedCategories: ["Tableau Senior A"],
    status: "Validé",
    paymentStatus: "Payé",
  },
];

export type AdminStat = {
  label: string;
  value: string;
  trend: string;
};

export type RegistrationStatus = "validated" | "pending";

export type Registration = {
  id: string;
  name: string;
  club: string;
  brackets: string[];
  status: RegistrationStatus;
  createdAt: string;
};

export type Player = {
  id: string;
  name: string;
  club: string;
  ranking: string;
  category: string;
  license: string;
};

export type Tournament = {
  id: string;
  name: string;
  date: string;
  location: string;
  brackets: string[];
  registrations: number;
};

export type Payment = {
  id: string;
  player: string;
  amount: string;
  method: string;
  status: "pending" | "paid";
};

export const adminStats: AdminStat[] = [
  { label: "Inscrits", value: "128", trend: "+14 cette semaine" },
  { label: "Tournois actifs", value: "6", trend: "2 à venir" },
  { label: "Paiements en attente", value: "19", trend: "Relance recommandée" },
];

export const registrations: Registration[] = [
  {
    id: "reg_001",
    name: "Lucas Martin",
    club: "TT Reims",
    brackets: ["Simple A", "Double"],
    status: "validated",
    createdAt: "2026-03-15",
  },
  {
    id: "reg_002",
    name: "Emma Petit",
    club: "AS Charleville",
    brackets: ["Simple B"],
    status: "pending",
    createdAt: "2026-03-16",
  },
  {
    id: "reg_003",
    name: "Nolan Dubois",
    club: "CTT Troyes",
    brackets: ["Simple A", "Simple B"],
    status: "pending",
    createdAt: "2026-03-17",
  },
  {
    id: "reg_004",
    name: "Lina Bernard",
    club: "Olympique Remois TT",
    brackets: ["Simple Féminin"],
    status: "validated",
    createdAt: "2026-03-17",
  },
];

export const players: Player[] = [
  {
    id: "pl_001",
    name: "Lucas Martin",
    club: "TT Reims",
    ranking: "13",
    category: "Senior",
    license: "LIC-009281",
  },
  {
    id: "pl_002",
    name: "Emma Petit",
    club: "AS Charleville",
    ranking: "11",
    category: "Senior",
    license: "LIC-009651",
  },
  {
    id: "pl_003",
    name: "Nolan Dubois",
    club: "CTT Troyes",
    ranking: "9",
    category: "Junior",
    license: "LIC-008219",
  },
  {
    id: "pl_004",
    name: "Lina Bernard",
    club: "Olympique Remois TT",
    ranking: "14",
    category: "Senior",
    license: "LIC-010441",
  },
  {
    id: "pl_005",
    name: "Hugo Renault",
    club: "US Épernay",
    ranking: "10",
    category: "Cadet",
    license: "LIC-010112",
  },
];

export const tournaments: Tournament[] = [
  {
    id: "tr_001",
    name: "Open de Printemps",
    date: "2026-04-06",
    location: "Reims",
    brackets: ["Simple A", "Simple B", "Double"],
    registrations: 68,
  },
  {
    id: "tr_002",
    name: "Challenge Jeunes",
    date: "2026-04-18",
    location: "Tinqueux",
    brackets: ["Benjamins", "Minimes", "Cadets"],
    registrations: 42,
  },
  {
    id: "tr_003",
    name: "Tournoi Nocturne",
    date: "2026-05-09",
    location: "Reims",
    brackets: ["Simple A", "Simple C"],
    registrations: 31,
  },
];

export const payments: Payment[] = [
  {
    id: "pay_001",
    player: "Emma Petit",
    amount: "12 €",
    method: "Carte",
    status: "pending",
  },
  {
    id: "pay_002",
    player: "Nolan Dubois",
    amount: "10 €",
    method: "Virement",
    status: "pending",
  },
  {
    id: "pay_003",
    player: "Lucas Martin",
    amount: "18 €",
    method: "Carte",
    status: "paid",
  },
];

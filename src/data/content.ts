export type NewsArticle = {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  category: "Club" | "Jeunes" | "Compétition" | "Partenariat";
};

export type Competition = {
  id: string;
  name: string;
  date: string;
  location: string;
  category: "Départementale" | "Régionale" | "Nationale" | "Loisir";
  status: "Inscription ouverte" | "Complet" | "À venir";
};

export type ClubEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  registrationRequired: boolean;
};

export type ClubVolunteerMission = {
  id: string;
  title: string;
  description: string;
  schedule: string;
};

export const newsArticles: NewsArticle[] = [
  {
    id: "news-1",
    title: "ORTT décroche la montée en Régionale 2",
    date: "2026-03-10",
    excerpt:
      "Après une phase retour maîtrisée, l'équipe première valide sa montée avec une dernière victoire à domicile.",
    category: "Compétition",
  },
  {
    id: "news-2",
    title: "Stage jeunes pendant les vacances de printemps",
    date: "2026-03-06",
    excerpt:
      "Le club organise trois demi-journées de perfectionnement pour les catégories benjamins à juniors.",
    category: "Jeunes",
  },
  {
    id: "news-3",
    title: "Nouveau partenariat avec le magasin Sport Horizon",
    date: "2026-02-25",
    excerpt:
      "Les adhérents ORTT bénéficient désormais de remises sur les équipements textiles et les revêtements.",
    category: "Partenariat",
  },
  {
    id: "news-4",
    title: "Travaux terminés dans la salle principale",
    date: "2026-02-18",
    excerpt:
      "Éclairage LED et séparation mobile installés pour améliorer le confort d'entraînement et l'accueil des compétitions.",
    category: "Club",
  },
];

export const competitions: Competition[] = [
  {
    id: "comp-1",
    name: "Critérium Fédéral - Tour 4",
    date: "2026-04-04",
    location: "Gymnase Jean Moulin, Orléans",
    category: "Départementale",
    status: "Inscription ouverte",
  },
  {
    id: "comp-2",
    name: "Championnat par équipes - Journée 7",
    date: "2026-04-12",
    location: "Complexe des Sports, Fleury-les-Aubrais",
    category: "Régionale",
    status: "À venir",
  },
  {
    id: "comp-3",
    name: "Tournoi National ORTT Open",
    date: "2026-05-09",
    location: "Palais des Sports, Orléans",
    category: "Nationale",
    status: "Inscription ouverte",
  },
  {
    id: "comp-4",
    name: "Challenge Interclubs Loisir",
    date: "2026-05-23",
    location: "Salle Pierre de Coubertin, Saran",
    category: "Loisir",
    status: "Complet",
  },
];

export const events: ClubEvent[] = [
  {
    id: "event-1",
    title: "Soirée portes ouvertes ORTT",
    date: "2026-04-18",
    location: "Salle ORTT, 14 rue des Sports, Orléans",
    description:
      "Démonstrations, ateliers découverte et rencontre avec les entraîneurs pour les nouveaux adhérents.",
    registrationRequired: false,
  },
  {
    id: "event-2",
    title: "Tournoi parents-enfants",
    date: "2026-05-02",
    location: "Gymnase Marcel Proust, Orléans",
    description:
      "Un tournoi convivial en double pour partager un moment en famille autour du tennis de table.",
    registrationRequired: true,
  },
  {
    id: "event-3",
    title: "Assemblée générale du club",
    date: "2026-06-06",
    location: "Maison des Associations, Orléans",
    description:
      "Bilan sportif et financier, présentation de la saison à venir et élection du bureau.",
    registrationRequired: true,
  },
];

export const volunteerMissions: ClubVolunteerMission[] = [
  {
    id: "vol-1",
    title: "Accueil lors des compétitions à domicile",
    description:
      "Orientation des équipes, gestion de la buvette et accompagnement logistique le jour J.",
    schedule: "1 samedi par mois",
  },
  {
    id: "vol-2",
    title: "Aide à l'encadrement des jeunes",
    description:
      "Soutien des entraîneurs pendant les créneaux d'initiation et d'échauffement.",
    schedule: "Mercredi 17h30 - 19h",
  },
  {
    id: "vol-3",
    title: "Communication & médias du club",
    description:
      "Création de contenus photo/vidéo et publication des résultats sur les canaux ORTT.",
    schedule: "Flexible, 2 à 4h par semaine",
  },
];

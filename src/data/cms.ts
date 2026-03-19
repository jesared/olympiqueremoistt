export type PublicationStatus = "draft" | "published";

export type SitePage = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: PublicationStatus;
  updatedAt: string;
};

export type NewsArticle = {
  id: string;
  title: string;
  content: string;
  date: string;
  image: string;
  status: PublicationStatus;
};

export type SiteEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  status: PublicationStatus;
};

export type UserRole = "admin" | "organisateur" | "membre";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export const sitePagesMock: SitePage[] = [
  {
    id: "page-1",
    title: "Accueil",
    slug: "accueil",
    content: "Présentation rapide du club et des prochains tournois.",
    status: "published",
    updatedAt: "2026-03-10",
  },
  {
    id: "page-2",
    title: "Club",
    slug: "club",
    content: "Historique, valeurs et équipes de l'Olympique Remois TT.",
    status: "draft",
    updatedAt: "2026-03-14",
  },
];

export const actualitesMock: NewsArticle[] = [
  {
    id: "news-1",
    title: "Ouverture des inscriptions - Tournoi de Printemps",
    content: "Les inscriptions sont ouvertes jusqu'au 5 avril.",
    date: "2026-03-12",
    image: "/mock/news-printemps.jpg",
    status: "published",
  },
  {
    id: "news-2",
    title: "Nouveau partenariat équipement",
    content: "Le club annonce un partenariat avec un équipementier local.",
    date: "2026-03-15",
    image: "/mock/news-partenariat.jpg",
    status: "draft",
  },
];

export const evenementsMock: SiteEvent[] = [
  {
    id: "event-1",
    title: "Stage jeunes vacances",
    date: "2026-04-18",
    location: "Gymnase Jean Jaurès",
    description: "Stage intensif pour les catégories benjamins à juniors.",
    status: "published",
  },
  {
    id: "event-2",
    title: "Journée portes ouvertes",
    date: "2026-05-09",
    location: "Salle principale",
    description: "Initiation, matchs amicaux et présentation des entraîneurs.",
    status: "draft",
  },
];

export const adminUsersMock: AdminUser[] = [
  {
    id: "user-1",
    name: "Camille Dupont",
    email: "camille.dupont@or-tt.fr",
    role: "admin",
  },
  {
    id: "user-2",
    name: "Léo Martin",
    email: "leo.martin@or-tt.fr",
    role: "organisateur",
  },
  {
    id: "user-3",
    name: "Sophie Bernard",
    email: "sophie.bernard@or-tt.fr",
    role: "membre",
  },
];

# 🏓 Olympique Rémois TT — Plateforme SaaS de gestion club

Application web **Next.js + Prisma** pour la gestion d’un club de tennis de table :
- publication d’actualités,
- gestion d’événements,
- administration des utilisateurs,
- et base de travail pour la gestion des tournois/inscriptions.

> ⚠️ Ce README décrit l’**état réel actuel du code** (fonctionnalités terminées, partielles, et zones encore en mock).

---

## 1) Présentation du projet

Ce projet vise à centraliser les opérations d’un club de tennis de table dans une interface moderne :
- **espace public** (home, actualités, événements, pages vitrines),
- **back-office admin** (CRUD contenu, utilisateurs, catégories),
- **espace dashboard utilisateur** (navigation connectée, modules d’inscription en cours de finalisation).

Le socle technique est issu d’un bootstrap T3 (Next.js App Router + Prisma + NextAuth + tRPC), puis adapté au contexte métier ORTT.

---

## 2) Stack technique utilisée

### Framework & langage
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**

### UI / Front
- **Tailwind CSS v4**
- **shadcn/ui** (composants UI)
- **Lucide React** (icônes)
- **Lexical** (éditeur riche pour le contenu)

### Authentification & sécurité
- **NextAuth v5 (beta)**
- Provider OAuth : **Google**
- **Prisma Adapter** pour persistance session/utilisateur
- Middleware de contrôle d’accès par rôle

### Données
- **Prisma ORM**
- **PostgreSQL**
- Schéma avec rôles, actualités, catégories, événements, tournois et inscriptions

### APIs / data layer
- **Server Actions** (principalement pour le back-office)
- **tRPC** présent mais encore partiellement scaffold (cf. section “Notes techniques”)

### Stockage média
- **Supabase Storage** (bucket `posts`) pour upload d’images d’actualités

---

## 3) Structure du projet

```txt
.
├── prisma/
│   └── schema.prisma
├── generated/prisma/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── actualites/
│   │   ├── evenements/
│   │   ├── tournois/
│   │   ├── club/
│   │   └── api/
│   ├── components/
│   │   ├── admin/
│   │   ├── dashboard/
│   │   ├── home/
│   │   ├── tournaments/
│   │   └── ui/
│   ├── data/
│   ├── lib/
│   ├── server/
│   │   ├── api/
│   │   └── auth/
│   ├── styles/
│   └── trpc/
├── start-database.sh
└── package.json
```

---

## 4) Fonctionnalités actuellement implémentées ✅

## Public
- Homepage modulaire (hero, actualités, événements, club).
- Page **Actualités** alimentée par la DB (`Post` publiés), avec mise en avant + grille.
- Page détail d’actualité par slug (`/actualites/[slug]`) avec rendu HTML riche.
- Page **Événements** (`/evenements`) alimentée par la DB (`Event` publiés à venir).
- Variante `/events` (anglaise) également branchée DB.

## Admin (fonctionnel sur plusieurs modules)
- **Gestion des actualités** : listing, création, édition, suppression, publication/dépublication.
- **Upload d’image** pour actualités via Supabase Storage (URL publique enregistrée).
- **Gestion des catégories** : création, édition, suppression.
- **Gestion des événements** : création, édition, suppression, statut publié/brouillon.
- **Gestion des utilisateurs** : listing paginé, filtrage UI, changement de rôle, suppression (avec protection auto-suppression).

## Auth / contrôle d’accès
- Authentification Google OAuth.
- Session enrichie avec `user.id` + `user.role`.
- Rôles Prisma : `USER`, `MODERATOR`, `ORGANIZER`, `ADMIN`.
- Protection de routes via middleware (`/admin`, `/organizer`) + garde côté serveur dans les Server Actions.

---

## 5) Fonctionnalités en cours / partielles 🧩

- **Dashboard utilisateur** : structure en place, mais plusieurs écrans utilisent encore des données mock (`src/data/*`).
- **Inscriptions tournois côté utilisateur** : formulaire UI avancé, mais soumission actuellement mock (pas d’écriture DB).
- **Admin tournois** : modèle Prisma prêt + action d’update d’exemple, mais parcours CRUD incomplet côté UI.
- **CMS pages / news / events dans `components/admin/cms`** : composants fonctionnels en local state, non branchés à Prisma.
- **tRPC** : infrastructure présente, mais route d’exemple héritée du scaffold et non alignée avec le schéma Prisma actuel.

---

## 6) Roadmap (prochaines étapes) 🚀

### Priorité haute
1. **Finaliser le module tournoi/inscription** de bout en bout :
   - création tournoi + tableaux,
   - inscription utilisateur réelle,
   - workflow validation/refus.
2. **Remplacer les mocks dashboard/admin restants** par des requêtes Prisma.
3. **Harmoniser les routes doublons** (`/events` vs `/evenements`, `/posts/[slug]` vs `/actualites/[slug]`) et clarifier la stratégie i18n/URL.

### Priorité moyenne
4. **Refondre/compléter la couche tRPC** ou la retirer si stratégie full Server Actions.
5. **Renforcer la validation serveur** (Zod sur Server Actions) et normaliser la gestion d’erreurs.
6. **Ajouter tests** (unitaires + intégration + e2e).

### Priorité long terme
7. Paiements en ligne pour inscriptions.
8. Notifications (email/in-app) pour statuts d’inscription.
9. Observabilité (logs structurés, monitoring erreurs, métriques).

---

## 7) Installation & setup

### Prérequis
- Node.js 20+
- pnpm 10+
- PostgreSQL (local ou distant)

### Étapes
```bash
pnpm install
cp .env.example .env   # si absent, créer .env manuellement
```

Renseigner les variables d’environnement (voir section suivante), puis :

```bash
# Option A: générer/appliquer les migrations existantes
pnpm db:migrate

# Option B: push du schéma (dev)
pnpm db:push

# Générer client Prisma si nécessaire
pnpm postinstall

# Lancer en développement
pnpm dev
```

### Base locale rapide
Le script `start-database.sh` permet de démarrer un conteneur PostgreSQL local à partir de `DATABASE_URL`.

```bash
./start-database.sh
```

---

## 8) Configuration (variables d’environnement)

Variables validées dans `src/env.js` :

```env
AUTH_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
DATABASE_URL=
SUPABASE_URL=
SUPABASE_ANON_KEY=
NODE_ENV=development
```

### Notes
- `AUTH_SECRET` est requis en production.
- `SUPABASE_URL` + `SUPABASE_ANON_KEY` sont nécessaires pour l’upload d’images.
- Le bucket Supabase attendu est `posts` (public).

---

## 9) Scripts disponibles

```bash
pnpm dev            # Next.js dev (turbo)
pnpm build          # build production
pnpm start          # run production server
pnpm preview        # build + start

pnpm lint           # eslint
pnpm lint:fix       # eslint --fix
pnpm typecheck      # tsc --noEmit
pnpm check          # lint + typecheck

pnpm format:check   # prettier check
pnpm format:write   # prettier write

pnpm db:generate    # prisma migrate dev
pnpm db:migrate     # prisma migrate deploy
pnpm db:push        # prisma db push
pnpm db:studio      # prisma studio
```

---

## 10) Organisation du code (architecture & bonnes pratiques)

### Architecture actuelle
- **App Router** avec séparation claire public / dashboard / admin.
- **Server Actions** utilisées pour les mutations admin (create/update/delete).
- **Prisma** comme source de vérité pour les entités métier principales.
- **Composants UI réutilisables** via `src/components/ui`.
- **Helpers auth/permissions** centralisés dans `src/server/auth` et `src/lib/permissions.ts`.

### Bonnes pratiques déjà visibles
- Guards de rôles côté serveur sur actions sensibles.
- Revalidation ciblée (`revalidatePath`) après mutations.
- Validation minimum des formulaires serveur (présence/champs/date/slug unique).
- Typage TS globalement propre et structuré.

### Axes d’amélioration architecture
- Uniformiser la stratégie data fetching (Server Actions vs tRPC vs mocks).
- Introduire une couche “services/domain” pour isoler la logique métier.
- Centraliser la validation via schémas Zod partagés client/serveur.

---

## 11) Système d’authentification & rôles

### Auth
- NextAuth avec provider Google.
- Session JWT enrichie avec rôle utilisateur.
- Adapter Prisma pour persister utilisateurs/comptes/sessions.

### Rôles supportés
- `USER`
- `MODERATOR`
- `ORGANIZER`
- `ADMIN`

### Contrôles d’accès observés
- `/admin/*` : accès `ADMIN` ou `MODERATOR` via middleware, avec actions serveur parfois strictement `ADMIN`.
- `/organizer/*` : accès `ORGANIZER` ou `ADMIN` via middleware.
- Helpers serveur dédiés : `requireAdmin`, `requireAdminOrModerator`, `requireOrganizer`.

---

## 12) Partie admin

Le panel admin contient déjà des sections concrètes :

- **Dashboard admin** (indicateurs + tableau inscriptions en données mock).
- **Actualités** (CRUD + publication + image + catégorie).
- **Événements** (CRUD + publication).
- **Catégories** (CRUD).
- **Utilisateurs** (pagination, rôles, suppression).
- **Tournois / paiements / joueurs / pages CMS** : plusieurs écrans existent mais restent partiellement mock ou incomplets côté persistance.

---

## 13) Notes techniques importantes

- Le projet contient du **code héritage de scaffold T3** (notamment tRPC `postRouter`) qui n’est plus aligné avec le schéma Prisma actuel et mérite nettoyage.
- Certaines pages existent en double (`/events` et `/evenements`, `/posts/[slug]` et `/actualites/[slug]`) : utile de définir une convention unique.
- Des `console.log` de debug sont présents dans la couche auth/middleware.
- Le dossier `generated/prisma/` est versionné : à maintenir synchronisé avec le schéma Prisma et les versions d’engine.

---

## Bonus — Review rapide qualité du code 🧠

### Points positifs
- Base technique moderne et cohérente pour un SaaS.
- UI globalement propre, composants réutilisables, DX correcte.
- Découpage des responsabilités plutôt lisible (app/components/server/lib/data).

### Manques identifiés
1. **Tests absents** (unitaires/intégration/e2e).
2. **Validation hétérogène** des entrées (pas encore uniformisée Zod partout).
3. **Mélange mock + DB** qui ralentit la mise en production.
4. **Incohérences de couche API** (tRPC encore scaffold + Server Actions déjà majoritaires).
5. **Observabilité limitée** (logs de debug, pas de stratégie structurée).

### Recommandations concrètes
- Ajouter une CI simple : `lint + typecheck + tests`.
- Mettre en place Playwright pour les flows critiques (auth, création post, gestion utilisateurs).
- Standardiser les erreurs serveur (codes + messages normalisés).
- Introduire des policies RBAC plus explicites (par feature, pas seulement par route).
- Ajouter seed data + environnements `dev/staging/prod` plus stricts.

---

## Licence

Aucune licence explicite détectée dans l’état actuel du repository.

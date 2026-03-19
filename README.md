# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

# olympiqueremoistt

## Configuration Supabase Storage (upload d’images)

### 1) Créer le bucket `posts` (public)

Dans **Supabase Dashboard**:

1. Ouvrir **Storage**.
2. Cliquer **New bucket**.
3. Nommer le bucket: `posts`.
4. Activer **Public bucket**.
5. Valider la création.

Option SQL (éditeur SQL Supabase):

```sql
insert into storage.buckets (id, name, public)
values ('posts', 'posts', true)
on conflict (id) do update
set public = excluded.public;
```

### 2) Vérifier l’accès public

Une image uploadée dans `posts` doit être accessible via l’URL publique suivante :

```
https://<project-ref>.supabase.co/storage/v1/object/public/posts/<path/fichier.ext>
```

Exemple de vérification rapide :

```bash
curl -I "https://<project-ref>.supabase.co/storage/v1/object/public/posts/test.jpg"
```

Résultat attendu :

- `HTTP/2 200` si le fichier existe et est public.
- `HTTP/2 404` si le fichier n’existe pas (mais le bucket public est bien exposé).
- `HTTP/2 401/403` indique que la ressource n’est pas publiquement accessible.

### 3) Variables d’environnement

Renseigner dans `.env` :

```env
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

Le schéma d’environnement du projet inclut maintenant ces variables dans `src/env.js`.

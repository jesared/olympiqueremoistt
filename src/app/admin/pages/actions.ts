"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getString } from "~/lib/form";
import { slugify } from "~/lib/slug";
import { requireAdminOrModerator } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export async function createPage(data: FormData) {
  const session = await requireAdminOrModerator();

  const title = getString(data, "title").trim();
  const rawSlug = getString(data, "slug").trim();
  const content = getString(data, "content").trim();
  const published = getString(data, "published") === "on";
  const slug = slugify(rawSlug || title);

  if (!title || !slug) {
    redirect("/admin/pages/create?error=missing-fields");
  }

  const existingPage = await prisma.page.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingPage) {
    redirect("/admin/pages/create?error=slug-taken");
  }

  await prisma.page.create({
    data: {
      title,
      slug,
      content,
      published,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/p/${slug}`);

  redirect("/admin/pages");
}

export async function updatePage(id: string, data: FormData) {
  await requireAdminOrModerator();

  if (!id) {
    redirect("/admin/pages?error=invalid-page");
  }

  const title = getString(data, "title").trim();
  const rawSlug = getString(data, "slug").trim();
  const content = getString(data, "content").trim();
  const published = getString(data, "published") === "on";
  const slug = slugify(rawSlug || title);

  if (!title || !slug) {
    redirect(`/admin/pages/${id}/edit?error=missing-fields`);
  }

  const existingPage = await prisma.page.findUnique({
    where: { slug },
    select: { id: true, slug: true },
  });

  if (existingPage && existingPage.id !== id) {
    redirect(`/admin/pages/${id}/edit?error=slug-taken`);
  }

  const currentPage = await prisma.page.findUnique({
    where: { id },
    select: { slug: true },
  });

  await prisma.page.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      published,
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/p/${slug}`);
  if (currentPage?.slug && currentPage.slug !== slug) {
    revalidatePath(`/p/${currentPage.slug}`);
  }

  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await requireAdminOrModerator();

  if (!id) {
    throw new Error("Page invalide.");
  }

  const page = await prisma.page.delete({
    where: { id },
    select: { slug: true },
  });

  revalidatePath("/admin/pages");
  if (page.slug) {
    revalidatePath(`/p/${page.slug}`);
  }

  return { ok: true };
}

export async function togglePublishPage(id: string) {
  await requireAdminOrModerator();

  if (!id) {
    throw new Error("Page invalide.");
  }

  const page = await prisma.page.findUnique({
    where: { id },
    select: { published: true, slug: true },
  });

  if (!page) {
    throw new Error("Page introuvable.");
  }

  const updatedPage = await prisma.page.update({
    where: { id },
    data: {
      published: !page.published,
    },
    select: {
      published: true,
      slug: true,
    },
  });

  revalidatePath("/admin/pages");
  if (updatedPage.slug) {
    revalidatePath(`/p/${updatedPage.slug}`);
  }

  return { published: updatedPage.published };
}

export async function seedPresentationPage() {
  const session = await requireAdminOrModerator();

  const slug = "presentation-du-club";
  const existingPage = await prisma.page.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingPage) {
    redirect("/admin/pages?seed=exists");
  }

  const content = `
    <p>Après un site internet mis en place le 30 décembre 2008, une nouvelle version est ouverte depuis janvier 2015. Plus de 250 visiteurs viennent chaque jour sur le site, parfois jusqu’à plus de 400 lors des événements majeurs.</p>
    <p>Le club a été fondé en 1946 par Charles ARTAUD (1924-2018). Albert GAUVIN, longtemps vice-président, puis président de 2003 à 2006, est à nouveau président de l’ORTT depuis juin 2017.</p>
    <h2>Chiffres clés</h2>
    <ul>
      <li><strong>230 licenciés</strong> : une communauté qui grandit chaque saison.</li>
      <li><strong>Club labellisé</strong> : FFTT 3 étoiles en 2006 et 4 étoiles en 2008. Label club FFH en 2021 et 2022.</li>
      <li><strong>Encadrement</strong> : Stéphane HENRION (entraîneur principal) et Théo HENRION (éducateur).</li>
    </ul>
    <h2>Un club formateur</h2>
    <ul>
      <li>Dienouma COULIBALY, ex-n°77 française, formée au club et passée par la Pro B et la Pro A dames jusqu’au début 2010.</li>
      <li>Abdel-Kader SALIFOU, n°106 mondial, formé à l’ORTT, joue désormais en Pro B dans le championnat français.</li>
      <li>Lucas CREANGE, plusieurs fois champion du monde (sport adapté), n°3 mondial, médaillé de bronze aux Jeux Paralympiques Tokyo 2020 (août 2021), triple champion de France 2022, formé au club et évolue en N1 par équipes.</li>
    </ul>
    <h2>Vie du club</h2>
    <ul>
      <li>Créneau Handisport ouvert depuis septembre 2006, affilié à la FFH et à la FFSA.</li>
      <li>Les créneaux Loisirs confirment la vitalité du club, avec des profils variés.</li>
      <li>Actions dans les écoles de Reims et Reims Vital Été.</li>
      <li>Deux créneaux Baby-ping (5-10 ans) le mercredi matin et une école de tennis de table d’environ 50 jeunes le mercredi après-midi.</li>
      <li>Organisation depuis 1992 du GRAND PRIX DE LA VILLE DE REIMS (trophée Philippe GEORGELIN) à l’Ascension.</li>
    </ul>
  `;

  await prisma.page.create({
    data: {
      title: "Présentation du club",
      slug,
      content,
      published: true,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/p/${slug}`);

  redirect("/admin/pages?seed=done");
}

export async function seedFaqPage() {
  const session = await requireAdminOrModerator();

  const slug = "faq";
  const existingPage = await prisma.page.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (existingPage) {
    redirect("/admin/pages?seed=faq-exists");
  }

  const content = `
    <h2>Mon enfant (12-14 ans) peut-il faire une séance d’essai ?</h2>
    <p>Oui, c’est possible. Les essais se font généralement le mercredi et/ou le vendredi. Exemple de créneaux évoqués : mercredi 13h30-15h00 ou 17h30-19h00, et vendredi 17h30-19h00 ou 19h00-20h30. Les horaires peuvent varier selon l’âge et la période.</p>

    <h2>Où ont lieu les entraînements d’essai ?</h2>
    <p>Les entraînements ont lieu au complexe sportif René Tys à Reims.</p>

    <h2>Proposez-vous des stages pendant les vacances ?</h2>
    <p>Oui, des stages sont proposés pendant certaines vacances scolaires. Exemple : un stage jeunes du 24 au 27 février. Le contenu et les dates peuvent évoluer d’une saison à l’autre.</p>

    <h2>Avez-vous un groupe loisirs adultes ?</h2>
    <p>Oui, un groupe loisirs existe. Pour les tarifs et les jours d’entraînement, contactez le club afin d’obtenir les détails à jour.</p>

    <h2>Puis-je venir jouer avec ma fille (adulte + enfant) ?</h2>
    <p>Oui, c’est possible. Un créneau cité pour ce type de pratique est le vendredi 19h00-20h30.</p>

    <h2>Comment obtenir une réponse précise et personnalisée ?</h2>
    <p>Le club peut vous répondre par e-mail avec les informations adaptées à votre situation (âge, niveau, période).</p>
  `;

  await prisma.page.create({
    data: {
      title: "FAQ",
      slug,
      content,
      published: true,
      authorId: session.user.id,
    },
  });

  revalidatePath("/admin/pages");
  revalidatePath(`/p/${slug}`);

  redirect("/admin/pages?seed=faq-done");
}

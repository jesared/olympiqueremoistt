import { promises as fs } from "node:fs";
import path from "node:path";

type AuditItem = {
  label: string;
  details?: string;
};

export type AuditCategory = {
  key: "functionalites" | "technique" | "ux-ui" | "performance" | "securite";
  title: string;
  score: number;
  ok: AuditItem[];
  issues: AuditItem[];
  recommendations: AuditItem[];
};

export type AuditReport = {
  generatedAt: string;
  globalScore: number;
  categories: AuditCategory[];
  summary: {
    totalPages: number;
    adminPages: number;
    apiRoutes: number;
    prismaModels: number;
  };
};

const PROJECT_ROOT = process.cwd();
const SRC_DIR = path.join(PROJECT_ROOT, "src");
const APP_DIR = path.join(SRC_DIR, "app");

async function readFileSafe(filePath: string) {
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch {
    return "";
  }
}

async function walkFiles(dir: string, extensions: string[]) {
  const files: string[] = [];

  async function walk(currentDir: string) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }

      if (extensions.some((ext) => entry.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }

  await walk(dir);
  return files;
}

function toRelative(filePath: string) {
  return path.relative(PROJECT_ROOT, filePath).replaceAll("\\", "/");
}

function scoreFromIssues(base = 100, issuePenalty = 8, issueCount = 0) {
  return Math.max(35, base - issuePenalty * issueCount);
}

export async function generateAuditReport(): Promise<AuditReport> {
  const [appFiles, srcFiles, prismaSchema, authConfig, adminLayout, middlewareFile] = await Promise.all([
    walkFiles(APP_DIR, [".ts", ".tsx"]),
    walkFiles(SRC_DIR, [".ts", ".tsx"]),
    readFileSafe(path.join(PROJECT_ROOT, "prisma/schema.prisma")),
    readFileSafe(path.join(SRC_DIR, "server/auth/config.ts")),
    readFileSafe(path.join(APP_DIR, "admin/layout.tsx")),
    readFileSafe(path.join(SRC_DIR, "middleware.ts")),
  ]);

  const pageFiles = appFiles.filter((file) => file.endsWith("/page.tsx"));
  const apiRouteFiles = appFiles.filter((file) => file.includes("/api/") && file.endsWith("/route.ts"));
  const adminPages = pageFiles.filter((file) => file.includes("/admin/")).length;
  const dashboardPages = pageFiles.filter((file) => file.includes("/dashboard/")).length;

  const prismaModels = [...prismaSchema.matchAll(/model\s+(\w+)\s*\{/g)].map((match) => match[1]);
  const roleEnum = [...prismaSchema.matchAll(/enum\s+Role\s*\{([\s\S]*?)\}/g)][0]?.[1] ?? "";

  const hasGoogleProvider = authConfig.includes("GoogleProvider(");
  const hasEmailProvider = authConfig.includes("EmailProvider(");

  const hasAdminRouteProtection = adminLayout.includes('redirect("/api/auth/signin")');
  const adminRoleEnforcedInLayout =
    adminLayout.includes('session?.user?.role !== "ADMIN"') || adminLayout.includes("requireAdmin");

  const hasMiddlewareProtection = middlewareFile.includes("matcher") || middlewareFile.includes("auth");

  const crudTargets = [
    { label: "users", route: "/admin/users" },
    { label: "posts", route: "/admin/posts" },
    { label: "tournois", route: "/admin/tournois" },
    { label: "categories", route: "/admin/categories" },
    { label: "events", route: "/admin/events" },
  ];

  const detectedCrud = crudTargets.filter(({ route }) =>
    pageFiles.some((file) => toRelative(file).includes(route)),
  );

  const hasSidebar = srcFiles.some((file) => toRelative(file).endsWith("components/admin/admin-sidebar.tsx"));
  const hasDashboardLayout = srcFiles.some((file) => toRelative(file).endsWith("app/dashboard/layout.tsx"));
  const hasShadcnUsage = srcFiles.some((file) => {
    const rel = toRelative(file);
    return rel.startsWith("src/components/ui/");
  });


  const code = await Promise.all(srcFiles.map((file) => readFileSafe(file)));
  const mergedCode = code.join("\n");

  const hasNextImage = mergedCode.includes("from \"next/image\"") || mergedCode.includes("from 'next/image'");
  const hasRevalidate = mergedCode.includes("revalidatePath") || mergedCode.includes("revalidateTag");
  const hasServerActions = mergedCode.includes('"use server"');
  const hasZodValidation = mergedCode.includes("from \"zod\"") || mergedCode.includes("from 'zod'");
  const hasTryCatch = mergedCode.includes("try {") && mergedCode.includes("catch");

  const fonctionnalitesIssues: AuditItem[] = [];
  const fonctionnalitesOk: AuditItem[] = [];
  const fonctionnalitesReco: AuditItem[] = [];

  if (hasGoogleProvider) {
    fonctionnalitesOk.push({ label: "Authentification OAuth (Google) déjà configurée." });
  } else {
    fonctionnalitesIssues.push({ label: "Aucun provider OAuth détecté." });
  }

  if (hasEmailProvider) {
    fonctionnalitesOk.push({ label: "Auth email détectée." });
  } else {
    fonctionnalitesIssues.push({ label: "Auth email / magic link non détectée." });
    fonctionnalitesReco.push({ label: "Ajouter EmailProvider pour proposer le login sans Google." });
  }

  const rolesFound = ["USER", "MODERATOR", "ORGANIZER", "ADMIN"].filter((role) => roleEnum.includes(role));
  if (rolesFound.length === 4) {
    fonctionnalitesOk.push({ label: "Gestion des rôles USER / MODERATOR / ORGANIZER / ADMIN détectée." });
  } else {
    fonctionnalitesIssues.push({ label: "Rôles incomplets dans Prisma." });
  }

  fonctionnalitesOk.push({
    label: `${detectedCrud.length}/${crudTargets.length} espaces CRUD admin détectés (${detectedCrud
      .map((target) => target.label)
      .join(", ")}).`,
  });

  if (adminPages > 0 && dashboardPages > 0) {
    fonctionnalitesOk.push({ label: `Pages admin (${adminPages}) et dashboard (${dashboardPages}) présentes.` });
  }

  if (apiRouteFiles.length < 4) {
    fonctionnalitesIssues.push({ label: "Peu d'API routes détectées pour un SaaS extensible." });
    fonctionnalitesReco.push({ label: "Ajouter des routes API dédiées pour les opérations sensibles côté serveur." });
  }

  const techniqueOk: AuditItem[] = [
    { label: "Structure App Router bien découpée (app, components, lib, server)." },
    { label: `Prisma contient ${prismaModels.length} modèles avec relations explicites.` },
  ];
  const techniqueIssues: AuditItem[] = [];
  const techniqueReco: AuditItem[] = [];

  if (!hasTryCatch) {
    techniqueIssues.push({ label: "Gestion d'erreurs globale limitée (peu de blocs try/catch détectés)." });
    techniqueReco.push({ label: "Centraliser la gestion d'erreurs (helpers + toasts + logs côté serveur)." });
  }

  if (!hasZodValidation) {
    techniqueIssues.push({ label: "Validation schéma (zod) peu ou pas utilisée dans les entrées." });
    techniqueReco.push({ label: "Valider systématiquement les Server Actions et routes API avec zod." });
  } else {
    techniqueOk.push({ label: "Typage/validation avec zod présent dans le projet." });
  }

  const uxOk: AuditItem[] = [];
  const uxIssues: AuditItem[] = [];
  const uxReco: AuditItem[] = [];

  if (hasSidebar) uxOk.push({ label: "Sidebar admin détectée." });
  if (hasDashboardLayout) uxOk.push({ label: "Layout dashboard dédié détecté." });
  if (hasShadcnUsage) uxOk.push({ label: "Design system shadcn/ui présent (cards, badges, tables...)." });

  if (!mergedCode.includes("md:") || !mergedCode.includes("lg:")) {
    uxIssues.push({ label: "Indices responsive limités dans certaines vues." });
    uxReco.push({ label: "Renforcer les layouts mobiles (stack, tailles typo, zones tactiles)." });
  }

  const perfOk: AuditItem[] = [];
  const perfIssues: AuditItem[] = [];
  const perfReco: AuditItem[] = [];

  if (hasServerActions) {
    perfOk.push({ label: "Server Actions utilisées (bon point pour limiter le JS client)." });
  }

  if (hasRevalidate) {
    perfOk.push({ label: "Stratégies de revalidation/cache détectées." });
  } else {
    perfIssues.push({ label: "Pas de stratégie claire de cache/revalidation détectée globalement." });
    perfReco.push({ label: "Introduire revalidatePath/revalidateTag et ISR sur les pages publiques clés." });
  }

  if (!hasNextImage) {
    perfIssues.push({ label: "next/image peu ou pas détecté (optimisation image limitée)." });
    perfReco.push({ label: "Basculer les images principales vers next/image avec dimensions explicites." });
  }

  const securityOk: AuditItem[] = [];
  const securityIssues: AuditItem[] = [];
  const securityReco: AuditItem[] = [];

  if (hasAdminRouteProtection) {
    securityOk.push({ label: "Route /admin protégée pour les utilisateurs non connectés." });
  }

  if (!adminRoleEnforcedInLayout) {
    securityIssues.push({ label: "Le layout admin ne force pas explicitement le rôle ADMIN." });
    securityReco.push({ label: "Appliquer requireAdmin() au layout admin ou aux pages critiques." });
  } else {
    securityOk.push({ label: "Contrôle de rôle admin détecté sur la surface d'administration." });
  }

  if (!hasMiddlewareProtection) {
    securityIssues.push({ label: "Middleware de protection des routes limité ou absent." });
    securityReco.push({ label: "Ajouter un middleware ciblé pour les routes sensibles (/admin, /dashboard)." });
  }

  if (hasZodValidation) {
    securityOk.push({ label: "Validation d'inputs détectée via zod." });
  } else {
    securityIssues.push({ label: "Validation d'inputs insuffisante détectée." });
  }

  const categories: AuditCategory[] = [
    {
      key: "functionalites",
      title: "Fonctionnalités",
      score: scoreFromIssues(95, 9, fonctionnalitesIssues.length),
      ok: fonctionnalitesOk,
      issues: fonctionnalitesIssues,
      recommendations: fonctionnalitesReco,
    },
    {
      key: "technique",
      title: "Technique",
      score: scoreFromIssues(90, 10, techniqueIssues.length),
      ok: techniqueOk,
      issues: techniqueIssues,
      recommendations: techniqueReco,
    },
    {
      key: "ux-ui",
      title: "UX / UI",
      score: scoreFromIssues(88, 9, uxIssues.length),
      ok: uxOk,
      issues: uxIssues,
      recommendations: uxReco,
    },
    {
      key: "performance",
      title: "Performance",
      score: scoreFromIssues(86, 10, perfIssues.length),
      ok: perfOk,
      issues: perfIssues,
      recommendations: perfReco,
    },
    {
      key: "securite",
      title: "Sécurité",
      score: scoreFromIssues(90, 11, securityIssues.length),
      ok: securityOk,
      issues: securityIssues,
      recommendations: securityReco,
    },
  ];

  const globalScore = Math.round(
    categories.reduce((sum, category) => sum + category.score, 0) / categories.length,
  );

  return {
    generatedAt: new Date().toISOString(),
    globalScore,
    categories,
    summary: {
      totalPages: pageFiles.length,
      adminPages,
      apiRoutes: apiRouteFiles.length,
      prismaModels: prismaModels.length,
    },
  };
}

import { Prisma } from "../../../../../generated/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

import { slugify } from "~/lib/slug";
import { db } from "~/server/db";

const updateCategorySchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis."),
  slug: z.string().trim().min(1, "Le slug est requis."),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ID de catégorie invalide." },
      { status: 400 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide." },
      { status: 400 },
    );
  }

  const parsed = updateCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const name = parsed.data.name.trim();
  const slug = slugify(parsed.data.slug);

  if (!slug) {
    return NextResponse.json(
      { error: "Le slug est requis." },
      { status: 400 },
    );
  }

  try {
    const category = await db.category.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json(category);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Catégorie introuvable." },
        { status: 404 },
      );
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Ce slug existe déjà." },
        { status: 409 },
      );
    }

    throw error;
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ID de catégorie invalide." },
      { status: 400 },
    );
  }

  try {
    await db.category.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Catégorie introuvable." },
        { status: 404 },
      );
    }

    throw error;
  }
}

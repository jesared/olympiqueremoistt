import { Prisma } from "../../../../generated/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

import { slugify } from "~/lib/slug";
import { db } from "~/server/db";

const createCategorySchema = z.object({
  name: z.string().trim().min(1, "Le nom est requis."),
  slug: z.string().trim().optional(),
});

export async function GET() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Corps de requête JSON invalide." },
      { status: 400 },
    );
  }

  const parsed = createCategorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const name = parsed.data.name.trim();
  const slug = slugify(parsed.data.slug?.trim() || name);

  if (!slug) {
    return NextResponse.json(
      { error: "Le nom est requis." },
      { status: 400 },
    );
  }

  try {
    const category = await db.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
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

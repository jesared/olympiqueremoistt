import { notFound } from "next/navigation";

import { EventForm } from "~/components/admin/events/EventForm";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

import { duplicateEvent, updateEvent } from "../actions";

export default async function AdminEventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      location: true,
      startDate: true,
      endDate: true,
      published: true,
      categoryId: true,
    },
  });

  if (!event) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <EventForm
        mode="edit"
        initialData={event}
        categories={categories}
        submitAction={updateEvent.bind(null, id)}
        duplicateAction={duplicateEvent.bind(null, id)}
      />
    </div>
  );
}

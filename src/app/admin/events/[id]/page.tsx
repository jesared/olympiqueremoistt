import { notFound } from "next/navigation";

import { Card, CardHeader, CardTitle } from "~/components/ui/card";
import { db as prisma } from "~/server/db";

import { EventEditForm } from "./EventEditForm";

export default async function AdminEventEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier un événement</CardTitle>
        </CardHeader>

        <EventEditForm event={event} />
      </Card>
    </div>
  );
}

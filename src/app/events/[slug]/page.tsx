import { type Metadata } from "next";
import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { db as prisma } from "~/server/db";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "full",
  timeStyle: "short",
});

type EventDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    select: { title: true, description: true, published: true },
  });

  if (!event || !event.published) {
    return {
      title: "Événement introuvable",
    };
  }

  return {
    title: event.title,
    description: event.description.slice(0, 160),
  };
}

export default async function EventDetailPage({
  params,
}: EventDetailPageProps) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug },
    select: {
      title: true,
      description: true,
      location: true,
      startDate: true,
      endDate: true,
      published: true,
    },
  });

  if (!event || !event.published) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl">{event.title}</CardTitle>
          <p className="text-muted-foreground text-sm">{event.location}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">Début :</span>{" "}
            {dateFormatter.format(event.startDate)}
          </p>
          {event.endDate ? (
            <p className="text-sm">
              <span className="font-medium">Fin :</span>{" "}
              {dateFormatter.format(event.endDate)}
            </p>
          ) : null}
          <p className="leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

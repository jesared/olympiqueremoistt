import { EventForm } from "~/components/admin/events/EventForm";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db as prisma } from "~/server/db";

export default async function AdminCreateEventPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="space-y-6">
      <EventForm categories={categories} />
    </div>
  );
}

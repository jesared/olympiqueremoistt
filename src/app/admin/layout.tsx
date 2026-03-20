import type { ReactNode } from "react";

import { AdminHeader } from "~/components/admin/admin-header";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import { requireAdmin } from "~/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="w-full lg:pl-64">
      <AdminSidebar />
      <div className="min-h-[calc(100vh-8rem)]">
        <AdminHeader />
        <section className="space-y-6 pb-6">{children}</section>
      </div>
    </div>
  );
}

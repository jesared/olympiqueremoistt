import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { AdminHeader } from "~/components/admin/admin-header";
import { AdminSidebar } from "~/components/admin/admin-sidebar";
import { auth } from "~/server/auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

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

import { type ReactNode } from "react";

import { redirect } from "next/navigation";

import { DashboardSidebarNav } from "~/components/dashboard/sidebar-nav";
import { auth } from "~/server/auth";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[250px_1fr] lg:gap-6">
      <DashboardSidebarNav />
      <section className="space-y-4">{children}</section>
    </div>
  );
}

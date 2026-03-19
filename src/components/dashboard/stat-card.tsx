import { type ReactNode } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

type StatCardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  hint: string;
};

export function StatCard({ title, value, icon, hint }: StatCardProps) {
  return (
    <Card className="gap-0 py-0">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-1 pb-4">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-muted-foreground text-xs">{hint}</p>
      </CardContent>
    </Card>
  );
}

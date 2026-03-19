import { type ReactNode } from "react";

import Link from "next/link";

import { Button } from "~/components/ui/button";

type DashboardHeadingProps = {
  title: string;
  description: string;
  action?: {
    label: string;
    icon?: ReactNode;
    href?: string;
  };
};

export function DashboardHeading({
  title,
  description,
  action,
}: DashboardHeadingProps) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>

      {action ? (
        <Button className="w-full sm:w-auto" asChild={Boolean(action.href)}>
          {action.href ? (
            <Link href={action.href}>
              {action.icon}
              {action.label}
            </Link>
          ) : (
            <>
              {action.icon}
              {action.label}
            </>
          )}
        </Button>
      ) : null}
    </div>
  );
}

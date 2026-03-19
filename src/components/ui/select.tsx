"use client";

import * as React from "react";

import { cn } from "~/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "border-input bg-background ring-offset-background focus-visible:ring-ring h-9 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

function SelectItem({
  className,
  ...props
}: React.OptionHTMLAttributes<HTMLOptionElement>) {
  return <option className={className} {...props} />;
}

export { Select, SelectItem };

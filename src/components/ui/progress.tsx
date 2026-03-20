import { cn } from "~/lib/utils";

type ProgressProps = {
  className?: string;
  value: number;
};

export function Progress({ className, value }: ProgressProps) {
  const width = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("bg-muted h-2 w-full overflow-hidden rounded-full", className)}>
      <div
        className="bg-primary h-full rounded-full transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

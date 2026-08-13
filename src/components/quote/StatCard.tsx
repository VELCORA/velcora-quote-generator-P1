import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent,
  className,
}: {
  title: string;
  value: ReactNode;
  hint?: string;
  icon?: React.ComponentType<{ className?: string }>;
  accent?: boolean;
  className?: string;
}) {
  return (
    <Card className={cn("shadow-sm", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="label-caps">{title}</p>
          {Icon && (
            <Icon className={cn("h-4 w-4", accent ? "text-accent" : "text-ink-soft")} />
          )}
        </div>
        <p className="mt-3 font-display text-3xl leading-none">{value}</p>
        {hint && <p className="mt-2 text-xs text-ink-soft">{hint}</p>}
      </CardContent>
    </Card>
  );
}

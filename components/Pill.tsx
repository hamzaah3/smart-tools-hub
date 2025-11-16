import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PillProps {
  label: string;
  icon?: ReactNode;
  variant?: "solid" | "outline";
  className?: string;
}

export function Pill({ label, icon, variant = "solid", className }: PillProps) {
  const baseClasses =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold tracking-wide";

  const variantClasses =
    variant === "solid"
      ? "bg-slate-900 text-slate-50 border border-slate-700"
      : "bg-transparent text-slate-200 border border-slate-700";

  return (
    <span className={cn(baseClasses, variantClasses, className)}>
      {icon && <span className="flex h-4 w-4 items-center justify-center">{icon}</span>}
      <span>{label}</span>
    </span>
  );
}



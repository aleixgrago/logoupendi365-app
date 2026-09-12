import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-100 bg-white p-5 shadow-sm shadow-ink-900/[0.03]",
        className
      )}
      {...props}
    />
  );
}

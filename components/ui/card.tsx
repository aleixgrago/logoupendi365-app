import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border-2 border-fun-100 bg-white p-5 shadow-sm shadow-fun-500/[0.06]",
        className
      )}
      {...props}
    />
  );
}

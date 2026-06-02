"use client";

import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChange: (v: string) => void;
  items: { value: string; label: string; icon?: React.ReactNode }[];
}

function Tabs({
  className,
  value,
  onValueChange,
  items,
  ...props
}: TabsProps) {
  return (
    <div
      className={cn("flex border-b border-border", className)}
      role="tablist"
      {...props}
    >
      {items.map((item) => (
        <button
          key={item.value}
          role="tab"
          aria-selected={value === item.value}
          onClick={() => onValueChange(item.value)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors duration-150",
            value === item.value
              ? "border-accent text-accent"
              : "border-transparent text-text-muted hover:text-text hover:border-border"
          )}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </div>
  );
}

export { Tabs };
export type { TabsProps };

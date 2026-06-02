"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect, type ReactNode } from "react";

interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  trigger?: ReactNode;
}

function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className,
  trigger,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text transition-colors duration-150",
          "hover:border-text-muted focus:outline-none focus:ring-2 focus:ring-accent"
        )}
      >
        {trigger || (
          <span className={!selected ? "text-text-subtle" : ""}>
            {selected?.label || placeholder}
          </span>
        )}
        <ChevronDown
          size={14}
          className={cn(
            "text-text-muted transition-transform duration-150 shrink-0 ml-2",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-surface shadow-lg animate-fade-in overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={cn(
                "w-full px-3 py-2 text-sm text-left transition-colors duration-150",
                opt.value === value
                  ? "bg-accent-muted text-accent"
                  : "text-text hover:bg-bg-alt"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { Select };
export type { SelectProps };

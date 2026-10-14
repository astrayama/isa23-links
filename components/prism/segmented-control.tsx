"use client";

import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** iOS segmented control with a springy thumb. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  const k = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("pg-seg pg-glass pg-glass--thin", className)}
      style={{ "--n": options.length, "--k": k } as CSSProperties}
    >
      <span className="pg-seg__thumb" aria-hidden="true" />
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

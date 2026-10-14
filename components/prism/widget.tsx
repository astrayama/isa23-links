import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Glass } from "./glass";

/** Home-screen widget. Place in a `pg-widgets` grid: medium spans both columns, small is a square. */
export function Widget({
  i,
  size = "small",
  variant,
  eyebrow,
  title,
  subtitle,
  href,
  external,
  ariaLabel,
  className,
  children,
}: {
  i?: number;
  size?: "small" | "medium";
  variant?: "thin" | "regular" | "thick";
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  external?: boolean;
  ariaLabel?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <Glass
      as="section"
      href={href}
      external={external}
      variant={variant}
      i={i}
      ariaLabel={ariaLabel}
      className={cn("pg-widget", `pg-widget--${size}`, className)}
    >
      {eyebrow && <p className="pg-widget__eyebrow eyebrow">{eyebrow}</p>}
      {title && <p className={cn("pg-widget__title", size === "small" ? "title-3" : "title-2")}>{title}</p>}
      {subtitle && <p className="pg-widget__sub subheadline">{subtitle}</p>}
      {children}
    </Glass>
  );
}

import Link from "next/link";
import type { CSSProperties, MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Glyph, type GlyphName } from "./glyph";

/** Class + style for the staggered launch spring; `i` is the section's position. */
export function launch(i: number | undefined, style?: CSSProperties) {
  if (typeof i !== "number") return { className: undefined, style };
  return { className: "pg-launch", style: { "--i": i, ...style } as CSSProperties };
}

/**
 * An anchor that picks the right element: next/link for routes on this site,
 * a plain <a> for in-page hashes, and a new tab for everything external.
 */
export function SmartLink({
  href,
  external,
  className,
  style,
  children,
  ...rest
}: {
  href: string;
  external?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
  "aria-label"?: string;
}) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style} {...rest}>
        {children}
      </a>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} style={style} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} style={style} {...rest}>
      {children}
    </a>
  );
}

type GlassProps = {
  variant?: "thin" | "regular" | "thick";
  as?: "div" | "section" | "header" | "span";
  href?: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Press spring + pointer specular without a link or handler (e.g. a wrapper around one). */
  interactive?: boolean;
  i?: number;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Liquid-glass material. Interactive glass (href / onClick / interactive) gets
 * the press spring; the pointer specular is wired up once by <GlassLight />.
 */
export function Glass({
  variant = "regular",
  as: Tag = "div",
  href,
  external,
  onClick,
  interactive,
  i,
  ariaLabel,
  className,
  style,
  children,
}: GlassProps) {
  const l = launch(i, style);
  const cls = cn(
    "pg-glass",
    variant !== "regular" && `pg-glass--${variant}`,
    (interactive || href || onClick) && "pg-press",
    l.className,
    className,
  );

  if (href) {
    return (
      <SmartLink href={href} external={external} className={cls} style={l.style} aria-label={ariaLabel}>
        {children}
      </SmartLink>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls} style={l.style} aria-label={ariaLabel}>
        {children}
      </button>
    );
  }
  return (
    <Tag className={cls} style={l.style} aria-label={ariaLabel}>
      {children}
    </Tag>
  );
}

type ButtonProps = {
  variant?: "filled" | "tinted" | "mint" | "glass";
  small?: boolean;
  icon?: GlyphName;
  href?: string;
  external?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  children: ReactNode;
};

/** iOS capsule button. Glass is the default; the one main action is `filled`. */
export function Button({
  variant = "glass",
  small,
  icon,
  href,
  external,
  onClick,
  type = "button",
  disabled,
  className,
  children,
}: ButtonProps) {
  const content = (
    <>
      {icon && <Glyph name={icon} />}
      {children}
    </>
  );
  const cls = cn(
    "pg-btn pg-press",
    variant === "glass" ? "pg-glass pg-glass--thin" : `pg-btn--${variant}`,
    small && "pg-btn--small",
    className,
  );

  if (href) {
    return (
      <SmartLink href={href} external={external} className={cls}>
        {content}
      </SmartLink>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {content}
    </button>
  );
}

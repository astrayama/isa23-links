import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { SheetTrigger, type SheetRequest } from "../sheets";
import { Glass, SmartLink, launch } from "./glass";
import { Glyph, iconColor, type GlyphName, type IconColor } from "./glyph";

/** iOS inset grouped list: uppercase header, glass body, footnote footer. */
export function ListGroup({
  i,
  id,
  header,
  footer,
  children,
}: {
  i?: number;
  id?: string;
  header?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  const l = launch(i);
  return (
    <section id={id} className={cn("pg-group", l.className)} style={l.style} aria-label={header}>
      {header && <h2 className="pg-group__header footnote">{header}</h2>}
      <Glass className="pg-group__body">{children}</Glass>
      {footer && <p className="pg-group__footer footnote">{footer}</p>}
    </section>
  );
}

/**
 * One list row. `locked` keeps full-contrast text and shows "Ask" + a lock;
 * pair it with `sheet` to open the access sheet.
 */
export function ListRow({
  title,
  subtitle,
  glyph,
  color,
  href,
  external,
  sheet,
  locked,
}: {
  title: string;
  subtitle?: ReactNode;
  glyph?: GlyphName;
  color?: IconColor;
  href?: string;
  external?: boolean;
  sheet?: SheetRequest;
  locked?: boolean;
}) {
  const cls = cn("pg-row", locked && "pg-row--locked", !glyph && "pg-row--plain");
  const end = locked ? (
    <>
      <span className="pg-row__ask">Ask</span>
      <Glyph name="lock" className="pg-lock" />
    </>
  ) : href || sheet ? (
    <Glyph name={external ? "out" : "chevron"} />
  ) : null;

  const content = (
    <>
      {glyph && (
        <span className="pg-row__tile" style={iconColor(color)} aria-hidden="true">
          <Glyph name={glyph} />
        </span>
      )}
      <span className="pg-row__text">
        <span className="pg-row__title headline">{title}</span>
        {subtitle && <span className="pg-row__sub subheadline">{subtitle}</span>}
      </span>
      {end && <span className="pg-row__end">{end}</span>}
    </>
  );

  if (sheet) {
    return (
      <SheetTrigger sheet={sheet} className={cls} ariaLabel={locked ? `${title}, locked. Ask for access` : undefined}>
        {content}
      </SheetTrigger>
    );
  }
  if (href) {
    return (
      <SmartLink href={href} external={external} className={cls}>
        {content}
      </SmartLink>
    );
  }
  return <div className={cls}>{content}</div>;
}

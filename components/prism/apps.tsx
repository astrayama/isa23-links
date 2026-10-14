import Image from "next/image";
import { cn } from "@/lib/utils";
import { SheetTrigger, type SheetRequest } from "../sheets";
import { Glass, SmartLink, launch } from "./glass";
import { Glyph, iconColor, type GlyphName, type IconColor } from "./glyph";

export type AppIconProps = {
  label: string;
  glyph: GlyphName;
  color?: IconColor;
  href?: string;
  external?: boolean;
  /** Open a sheet instead of following a link. */
  sheet?: SheetRequest;
};

/** 62px iOS app icon: a white glyph on a glossy gradient tile, with its label below. */
export function AppIcon({ label, glyph, color, href, external, sheet, i }: AppIconProps & { i?: number }) {
  const l = launch(i);
  const cls = cn("pg-app pg-press", l.className);
  const content = (
    <>
      <span className="pg-app__icon" style={iconColor(color)} aria-hidden="true">
        <Glyph name={glyph} weight={2.2} />
      </span>
      <span className="pg-app__label" aria-hidden="true">
        {label}
      </span>
    </>
  );

  if (sheet) {
    return (
      <SheetTrigger sheet={sheet} className={cls} ariaLabel={label}>
        {content}
      </SheetTrigger>
    );
  }
  return (
    <SmartLink href={href ?? "#"} external={external} className={cls} style={l.style} aria-label={label}>
      {content}
    </SmartLink>
  );
}

/** Glass shelf with a header and a 4-column icon grid. */
export function AppShelf({
  i,
  title,
  subtitle,
  image,
  apps,
}: {
  i?: number;
  title: string;
  subtitle?: string;
  image?: string;
  apps: AppIconProps[];
}) {
  return (
    <Glass as="section" i={i} className="pg-shelf" ariaLabel={title}>
      <div className="pg-shelf__head">
        {image && <Image src={image} alt="" width={72} height={72} sizes="36px" />}
        <div>
          <h2 className="title-3 m-0 text-label">{title}</h2>
          {subtitle && <p className="footnote m-0 text-label-2">{subtitle}</p>}
        </div>
      </div>
      <div className="pg-apps">
        {apps.map((app) => (
          <AppIcon key={app.label} {...app} />
        ))}
      </div>
    </Glass>
  );
}

/** The dock: a thin-glass shelf fixed to the bottom of the screen; labels become accessible names. */
export function Dock({ apps, label = "Quick links" }: { apps: AppIconProps[]; label?: string }) {
  return (
    <nav className="pg-dock-wrap" aria-label={label}>
      <Glass variant="thin" className="pg-dock">
        {apps.map((app) => (
          <AppIcon key={app.label} {...app} />
        ))}
      </Glass>
    </nav>
  );
}

"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { apps, appTags, type AppEntry, type AppTag } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { Button, Glass } from "./prism/glass";
import { Glyph, iconColor } from "./prism/glyph";

type Filter = AppTag | "all";

// The design's --pg-bounce, close enough for cards reflowing between filters.
const SPRING = { type: "spring", duration: 0.55, bounce: 0.25 } as const;

export function AppGallery() {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");

  // only show tag chips that actually appear on an app
  const usedTags = useMemo(() => {
    const present = new Set<AppTag>();
    apps.forEach((a) => a.tags.forEach((t) => present.add(t)));
    return appTags.filter((t) => present.has(t.id));
  }, []);

  const visible = filter === "all" ? apps : apps.filter((a) => a.tags.includes(filter));

  return (
    <div className="flex flex-col gap-5">
      <div role="group" aria-label="Filter apps" className="pg-chips pg-launch justify-center" style={{ "--i": 1 } as CSSProperties}>
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {usedTags.map((t) => (
          <FilterChip key={t.id} active={filter === t.id} onClick={() => setFilter(t.id)}>
            {t.label}
          </FilterChip>
        ))}
      </div>

      <motion.div layout={!reduce} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {visible.map((app, n) => (
          <motion.div
            key={app.slug}
            layout={!reduce}
            initial={reduce ? false : { opacity: 0, scale: 0.94, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            transition={{ ...SPRING, delay: reduce ? 0 : 0.11 + n * 0.055 }}
          >
            <AppCard app={app} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "pg-btn pg-btn--small pg-press",
        active ? "pg-btn--tinted" : "pg-glass pg-glass--thin",
      )}
    >
      {children}
    </button>
  );
}

function AppCard({ app }: { app: AppEntry }) {
  return (
    <Glass as="section" ariaLabel={app.name} className="flex h-full flex-col gap-3 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <span className="pg-app__icon !h-14 !w-14 shrink-0" style={iconColor(app.color)} aria-hidden="true">
          <Glyph name={app.glyph} weight={2.2} />
        </span>
        <div className="min-w-0">
          <h2 className="title-3 text-label">{app.name}</h2>
          <p className="eyebrow mt-0.5 text-accent">{app.descriptor}</p>
        </div>
      </div>
      <p className="subheadline text-label-2">{app.blurb}</p>

      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        {app.href && (
          <Button href={app.href} external variant="tinted" small icon="out">
            Open
          </Button>
        )}
        {app.links?.map((link, i) => (
          <Button key={link.href} href={link.href} external variant={i === 0 && !app.href ? "tinted" : "glass"} small>
            {link.label}
          </Button>
        ))}
      </div>
    </Glass>
  );
}

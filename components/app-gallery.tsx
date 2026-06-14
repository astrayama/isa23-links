"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { apps, appTags, type AppEntry, type AppTag } from "@/lib/apps";
import { cn } from "@/lib/utils";

type Filter = AppTag | "all";

export function AppGallery() {
  const [filter, setFilter] = useState<Filter>("all");

  // only show tag chips that actually appear on an app
  const usedTags = useMemo(() => {
    const present = new Set<AppTag>();
    apps.forEach((a) => a.tags.forEach((t) => present.add(t)));
    return appTags.filter((t) => present.has(t.id));
  }, []);

  const visible = filter === "all" ? apps : apps.filter((a) => a.tags.includes(filter));

  return (
    <div>
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {usedTags.map((t) => (
          <FilterChip key={t.id} active={filter === t.id} onClick={() => setFilter(t.id)}>
            {t.label}
          </FilterChip>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {visible.map((app) => (
          <motion.div
            key={app.slug}
            layout
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
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
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-1.5 text-sm font-fredoka transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
        active
          ? "border-primary bg-primary/30 text-foreground glow-border"
          : "border-primary/30 bg-card/40 text-foreground/70 hover:border-primary/60 hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function AppCard({ app }: { app: AppEntry }) {
  const Icon = app.icon;
  return (
    <a
      href={app.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/30 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-primary/60 hover:shadow-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
    >
      <div
        className="relative flex h-28 items-center justify-center"
        style={{ background: app.gradient }}
      >
        <div className="absolute inset-0 bg-background/10" />
        <Icon className="relative h-10 w-10 text-foreground drop-shadow-[0_0_12px_rgba(0,0,0,0.5)]" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-fredoka text-lg font-medium text-foreground transition-all group-hover:glow-text">
            {app.name}
          </h3>
          <ExternalLink className="h-4 w-4 shrink-0 text-primary/60 transition-colors group-hover:text-primary" />
        </div>
        <p className="text-xs font-fredoka uppercase tracking-wide text-primary/70">
          {app.descriptor}
        </p>
        <p className="text-sm font-quicksand leading-relaxed text-foreground/70">{app.blurb}</p>
      </div>
    </a>
  );
}

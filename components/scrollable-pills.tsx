"use client";

import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/** Horizontally scrollable pill row with a fading chevron hint on overflow. */
export function ScrollablePills({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [showChevron, setShowChevron] = useState(false);

  const update = () => {
    const el = ref.current;
    if (!el) return;
    setShowChevron(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative">
      <div
        ref={ref}
        onScroll={update}
        className="flex gap-1.5 overflow-x-auto pr-6 scrollbar-hide"
      >
        {children}
      </div>
      <div
        aria-hidden={!showChevron}
        className={`pointer-events-none absolute top-0 right-0 flex h-full w-8 items-center justify-end pr-1 bg-gradient-to-l from-card/90 to-transparent transition-opacity ${
          showChevron ? "opacity-100" : "opacity-0"
        }`}
      >
        <ChevronRight className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
      </div>
    </div>
  );
}

const pillClass =
  "shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-primary/20 hover:bg-primary/40 border border-primary/30 text-xs font-fredoka text-foreground/90 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-1";

export function PillLink({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={pillClass}
    >
      <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
      {label}
    </a>
  );
}

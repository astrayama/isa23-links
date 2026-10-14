import { cn } from "@/lib/utils";

// The Prism Glass glyph set: 24px grid, 2px rounded strokes in currentColor.
// `eye`, `compass`, `back`, `close`, `trend`, `checklist` and `tree` are additions in the same style.
const GLYPHS = {
  globe: ["M12 3a9 9 0 100 18 9 9 0 000-18z", "M3 12h18", "M12 3c2.8 3 2.8 15 0 18", "M12 3c-2.8 3-2.8 15 0 18"],
  cup: ["M5 8h11v5a5 5 0 01-5 5h-1a5 5 0 01-5-5z", "M16 9h1.5a2.5 2.5 0 010 5H16", "M9.2 11.2c.6-.9 1.9-.6 1.8.4 0 .9-1.8 1.9-1.8 1.9s-1.8-1-1.8-1.9c0-1 1.2-1.3 1.8-.4z"],
  play: ["M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5z", "M10 9l5 3-5 3z"],
  note: ["M9 18V6l10-2v12", "M9 18a3 3 0 11-6 0 3 3 0 016 0z", "M19 16a3 3 0 11-6 0 3 3 0 016 0z"],
  camera: ["M4 8.5A2.5 2.5 0 016.5 6h1.8l1.4-2h4.6l1.4 2h1.8A2.5 2.5 0 0120 8.5v8a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 16.5z", "M12 9.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"],
  sparkles: ["M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z", "M18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z", "M5.5 15l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4L3.5 17l1.4-.6z"],
  photo: ["M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v11a2.5 2.5 0 01-2.5 2.5h-11A2.5 2.5 0 014 17.5z", "M4 16l4.5-4.5 3.5 3.5 2.5-2.5L20 18", "M15.5 8.5h.01"],
  book: ["M4 5.5A1.5 1.5 0 015.5 4H11v16H5.5A1.5 1.5 0 014 18.5z", "M20 5.5A1.5 1.5 0 0018.5 4H13v16h5.5a1.5 1.5 0 001.5-1.5z"],
  bag: ["M5 8h14l-1 12H6z", "M9 8V6.5a3 3 0 016 0V8"],
  mail: ["M3.5 6.5h17v11h-17z", "M4 7l8 6 8-6"],
  chat: ["M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v7a2.5 2.5 0 01-2.5 2.5H10l-4 4v-4h0A2.5 2.5 0 014 13.5z", "M9 10h.01", "M12 10h.01", "M15 10h.01"],
  mic: ["M12 3a3 3 0 00-3 3v5a3 3 0 006 0V6a3 3 0 00-3-3z", "M5.5 11a6.5 6.5 0 0013 0", "M12 17.5V21"],
  infinity: ["M7 9c-2 0-3.5 1.4-3.5 3S5 15 7 15c3 0 7-6 10-6 2 0 3.5 1.4 3.5 3S19 15 17 15c-3 0-7-6-10-6z"],
  send: ["M21 3L10 14", "M21 3l-7 18-4-7-7-4z"],
  lock: ["M6 11h12v9H6z", "M8.5 11V8a3.5 3.5 0 017 0v3"],
  chevron: ["M9 5l7 7-7 7"],
  back: ["M15 5l-7 7 7 7"],
  close: ["M6 6l12 12", "M18 6L6 18"],
  out: ["M7 17L17 7", "M9 7h8v8"],
  moon: ["M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z"],
  sun: ["M12 8a4 4 0 100 8 4 4 0 000-8z", "M12 2v2", "M12 20v2", "M4.9 4.9l1.4 1.4", "M17.7 17.7l1.4 1.4", "M2 12h2", "M20 12h2", "M4.9 19.1l1.4-1.4", "M17.7 6.3l1.4-1.4"],
  wand: ["M4 20L15 9", "M15 4v2", "M15 12v2", "M11 8h2", "M17 8h2", "M19 4l-1.2 1.2", "M19 12l-1.2-1.2"],
  eye: ["M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z", "M12 9a3 3 0 100 6 3 3 0 000-6z"],
  compass: ["M12 3a9 9 0 100 18 9 9 0 000-18z", "M15.5 8.5l-2 5-5 2 2-5z"],
  trend: ["M3.5 17l5.5-5.5 4 4 7.5-7.5", "M15 8h5.5v5.5"],
  checklist: ["M10 6.5h10", "M10 12h10", "M10 17.5h10", "M4 6.5l1.3 1.3L7.8 5.3", "M4 12l1.3 1.3 2.5-2.5", "M4 17.5l1.3 1.3 2.5-2.5"],
  tree: ["M12 21v-7", "M12 14c-4.5 0-7-2.2-7-5.5C5 5.5 8 3 12 3s7 2.5 7 5.5c0 3.3-2.5 5.5-7 5.5z", "M12 14l-3-3", "M12 12l3-3"],
} as const;

export type GlyphName = keyof typeof GLYPHS;

export function Glyph({ name, weight = 2, className }: { name: GlyphName; weight?: number; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={weight}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[name].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

/** The four-point star: the system's only decorative mark. */
export function Sparkle({ twinkle, color, className }: { twinkle?: boolean; color?: string; className?: string }) {
  return (
    <svg
      className={cn("pg-sparkle", twinkle && "pg-sparkle--twinkle", className)}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M12 2c.6 5.2 4.8 9.4 10 10-5.2.6-9.4 4.8-10 10-.6-5.2-4.8-9.4-10-10 5.2-.6 9.4-4.8 10-10z"
        style={color ? { fill: color } : undefined}
      />
    </svg>
  );
}

export type IconColor = "violet" | "pink" | "sky" | "mint" | "peach" | "indigo";

/** CSS custom property that tints an app icon or list-row tile. */
export const iconColor = (color: IconColor = "violet") =>
  ({ "--ic": `var(--icon-${color})` }) as React.CSSProperties;

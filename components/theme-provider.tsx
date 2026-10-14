"use client";

import { createContext, useCallback, useContext, useSyncExternalStore } from "react";

// Dawn is Prism Glass's light theme, Dusk its dark one. With nothing saved the
// page follows prefers-color-scheme; picking one saves it and overrides that.
export type Mood = "dawn" | "dusk";

export const MOODS: { id: Mood; label: string }[] = [
  { id: "dawn", label: "Dawn" },
  { id: "dusk", label: "Dusk" },
];

const STORAGE_KEY = "isa-mood";

/** Saved choice, with the retired Twilight and Cosmos moods mapped to Dusk. */
export function parseMood(value: string | null): Mood | null {
  if (value === "dawn") return "dawn";
  if (value === "dusk" || value === "twilight" || value === "cosmos") return "dusk";
  return null;
}

// Runs before paint (see app/layout.tsx) so a saved choice never flashes the other theme.
export const themeInitScript = `(function(){try{var m=localStorage.getItem('${STORAGE_KEY}');if(m==='twilight'||m==='cosmos')m='dusk';if(m==='dawn'||m==='dusk')document.documentElement.setAttribute('data-theme',m);}catch(e){}})();`;

// Saved choice, as an external store (memory fallback when storage is blocked).
let memoryMood: Mood | null = null;
const listeners = new Set<() => void>();
function readSaved(): Mood | null {
  try {
    return parseMood(localStorage.getItem(STORAGE_KEY));
  } catch {
    return memoryMood;
  }
}
function subscribeSaved(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

// The device's light/dark setting.
const DARK = "(prefers-color-scheme: dark)";
function subscribeScheme(cb: () => void) {
  const mq = window.matchMedia(DARK);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const systemMood = (): Mood => (window.matchMedia(DARK).matches ? "dusk" : "dawn");

type ThemeCtx = { mood: Mood; setMood: (m: Mood) => void };
const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const saved = useSyncExternalStore(subscribeSaved, readSaved, () => null);
  const system = useSyncExternalStore(subscribeScheme, systemMood, () => "dawn" as Mood);
  const mood = saved ?? system;

  const setMood = useCallback((m: Mood) => {
    memoryMood = m;
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
    listeners.forEach((l) => l());
  }, []);

  return <ThemeContext.Provider value={{ mood, setMood }}>{children}</ThemeContext.Provider>;
}

export function useMood() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useMood must be used within ThemeProvider");
  return ctx;
}

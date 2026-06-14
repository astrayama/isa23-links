"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Mood = "dawn" | "dusk" | "twilight" | "cosmos";

export const MOODS: { id: Mood; label: string; swatch: string }[] = [
  { id: "dawn", label: "Dawn", swatch: "hsl(330 70% 75%)" },
  { id: "dusk", label: "Dusk", swatch: "hsl(25 85% 72%)" },
  { id: "twilight", label: "Twilight", swatch: "hsl(285 75% 78%)" },
  { id: "cosmos", label: "Cosmos", swatch: "hsl(210 80% 76%)" },
];

const STORAGE_KEY = "isa-mood";

type ThemeCtx = { mood: Mood; setMood: (m: Mood) => void };
const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mood, setMoodState] = useState<Mood>("dawn");

  useEffect(() => {
    const saved = (typeof localStorage !== "undefined" &&
      localStorage.getItem(STORAGE_KEY)) as Mood | null;
    if (saved && MOODS.some((m) => m.id === saved)) {
      // one-time sync of React state from the persisted store on mount
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMoodState(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const setMood = useCallback((m: Mood) => {
    setMoodState(m);
    document.documentElement.classList.add("theme-transition");
    document.documentElement.setAttribute("data-theme", m);
    try {
      localStorage.setItem(STORAGE_KEY, m);
    } catch {
      /* ignore */
    }
  }, []);

  return <ThemeContext.Provider value={{ mood, setMood }}>{children}</ThemeContext.Provider>;
}

export function useMood() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useMood must be used within ThemeProvider");
  return ctx;
}

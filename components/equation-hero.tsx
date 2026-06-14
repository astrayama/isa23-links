"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const TOKENS = ["0", "=", "1", "=", "∞"];
const SYMBOL_INDICES = [0, 2, 4]; // positions of 0, 1, ∞

export function EquationHero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setActive((a) => (a + 1) % SYMBOL_INDICES.length), 1800);
    return () => clearInterval(id);
  }, [reduce]);

  const activeIndex = SYMBOL_INDICES[active];

  return (
    <Link
      href="/equation"
      aria-label="0 equals 1 equals infinity — read the essay"
      className="group block text-center float focus:outline-none"
    >
      <h1 className="mb-2 flex items-center justify-center gap-2 font-fredoka text-6xl font-bold text-primary glow-text transition-transform group-hover:scale-105 md:text-7xl">
        {TOKENS.map((t, i) => {
          const isSymbol = SYMBOL_INDICES.includes(i);
          const isActive = i === activeIndex && isSymbol;
          return (
            <motion.span
              key={i}
              animate={
                reduce
                  ? undefined
                  : {
                      scale: isActive ? 1.18 : 1,
                      opacity: isSymbol ? (isActive ? 1 : 0.75) : 0.5,
                    }
              }
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className={isActive ? "drop-shadow-[0_0_18px_hsl(var(--glow-pink)/0.8)]" : ""}
            >
              {t}
            </motion.span>
          );
        })}
      </h1>
      <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-60" />
      <span className="mt-2 inline-block text-xs font-quicksand text-foreground/0 transition-colors group-hover:text-foreground/60">
        tap to read the essay →
      </span>
    </Link>
  );
}

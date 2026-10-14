"use client";

import { useEffect } from "react";

/**
 * The pointer-following specular on interactive glass, wired up once for the
 * whole page so <Glass> can stay a server component. Fine pointers only: on
 * touch the press spring is feedback enough.
 */
export function GlassLight() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let lit: HTMLElement | null = null;

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>(".pg-glass.pg-press") ?? null;
      if (lit && lit !== el) lit.classList.remove("is-lit");
      lit = el;
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      el.classList.add("is-lit");
    };
    const onLeave = () => {
      lit?.classList.remove("is-lit");
      lit = null;
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return null;
}

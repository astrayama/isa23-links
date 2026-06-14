"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { SparkleField } from "./sparkle";

/**
 * Fixed, full-bleed cosmic background with a gentle pointer/scroll parallax.
 * The overlay tint is theme-driven (CSS vars), so it shifts with the mood
 * switcher. Parallax is disabled under prefers-reduced-motion.
 */
export function CosmicBackground({ overlayClassName }: { overlayClassName?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      tx = nx * -18;
      ty = ny * -18;
      schedule();
    };
    const onScroll = () => {
      ty = -18 - window.scrollY * 0.03;
      schedule();
    };
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        cx += (tx - cx) * 0.08;
        cy += (ty - cy) * 0.08;
        el.style.transform = `scale(1.12) translate3d(${cx}px, ${cy}px, 0)`;
        if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) schedule();
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div ref={ref} className="absolute inset-0 will-change-transform" style={{ transform: "scale(1.12)" }}>
        <Image
          src="/img/cosmic-background.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div
        className={
          overlayClassName ??
          "absolute inset-0 bg-gradient-to-b from-[hsl(var(--overlay-from)/var(--overlay-opacity))] via-[hsl(var(--overlay-via)/var(--overlay-opacity))] to-[hsl(var(--overlay-to)/var(--overlay-opacity))]"
        }
      />
      <SparkleField />
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";

/**
 * The Prism Glass wallpaper: the clouds image under a theme veil (`wall-dim`)
 * and a twinkling star field, fixed behind the page. The image breathes slowly
 * and drifts with the pointer and scroll; all of it stops under reduced motion.
 */
export function CosmicBackground() {
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
    <>
      <div className="pg-wall__layer" aria-hidden="true">
        <div ref={ref} className="pg-wall__parallax">
          <div className="pg-wall__img" style={{ backgroundImage: 'url("/img/cosmic-background.jpg")' }} />
        </div>
        <div className="pg-wall__dim" />
        <div className="pg-wall__stars" />
      </div>
      <div className="pg-scroll-edge" aria-hidden="true" />
    </>
  );
}

"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { collections, type Photo } from "@/lib/photos";
import { Glyph, type GlyphName } from "./prism/glyph";

// flatten for lightbox navigation while keeping section grouping for display
const flat: Photo[] = collections.flatMap((c) => c.photos);

export function PhotoGallery() {
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // SSR-safe: only render the portal after mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + flat.length) % flat.length)),
    [],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % flat.length)),
    [],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return (
    <>
      <div className="flex flex-col gap-10">
        {collections.map((c, ci) => {
          const base = collections.slice(0, ci).reduce((sum, cc) => sum + cc.photos.length, 0);
          return (
            <section key={c.id} className="pg-launch" style={{ "--i": ci + 1 } as CSSProperties}>
              <div className="mb-4 text-center">
                <h2 className="title-2 text-label">{c.title}</h2>
                <p className="subheadline mt-1 text-label-2">{c.subtitle}</p>
              </div>
              <div className="gap-3 [column-fill:_balance] sm:columns-2 lg:columns-3">
                {c.photos.map((photo, pj) => {
                  const gi = base + pj;
                  return (
                    <button
                      key={photo.src}
                      type="button"
                      onClick={() => setIndex(gi)}
                      aria-label={`${photo.alt}: ${photo.caption}`}
                      className="group pg-press relative mb-3 block w-full overflow-hidden rounded-lg shadow-[0_0_0_.5px_var(--glass-outline),var(--shadow-glass)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
                    >
                      <Image
                        src={photo.src}
                        alt=""
                        width={photo.width}
                        height={photo.height}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="w-full transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="footnote pg-glass pg-glass--thin pointer-events-none absolute bottom-3 left-3 rounded-full px-3 py-1 text-label opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        {photo.caption}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {mounted && index !== null && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0618cc] backdrop-blur-xl"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <ViewerButton glyph="close" label="Close" onClick={close} className="right-4 top-4" />
          <ViewerButton
            glyph="back"
            label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="left-2 sm:left-6"
          />
          <ViewerButton
            glyph="chevron"
            label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="right-2 sm:right-6"
          />

          <figure
            className="flex max-h-[88vh] max-w-[92vw] flex-col items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={flat[index].src}
              alt={flat[index].alt}
              width={flat[index].width}
              height={flat[index].height}
              sizes="92vw"
              className="max-h-[80vh] w-auto rounded-lg object-contain shadow-[var(--shadow-lift)]"
              priority
            />
            <figcaption className="subheadline text-[#fbf8ff]">{flat[index].caption}</figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}

function ViewerButton({
  glyph,
  label,
  onClick,
  className,
}: {
  glyph: GlyphName;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  className: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`pg-press absolute z-10 grid h-11 w-11 place-items-center rounded-full bg-[#ffffff24] text-white backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${className}`}
    >
      <Glyph name={glyph} className="h-5 w-5" />
    </button>
  );
}

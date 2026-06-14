"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { collections, type Photo } from "@/lib/photos";

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
      <div className="space-y-16">
        {collections.map((c, ci) => {
          const base = collections.slice(0, ci).reduce((sum, cc) => sum + cc.photos.length, 0);
          return (
          <section key={c.id}>
            <div className="mb-2 text-center">
              <h2
                className={`font-fredoka text-3xl font-bold ${
                  c.accent === "primary" ? "text-primary" : "text-secondary"
                }`}
              >
                {c.title}
              </h2>
              <p className="mt-1 text-sm font-quicksand text-foreground/55">{c.subtitle}</p>
            </div>
            <div className="mt-6 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
              {c.photos.map((photo, pj) => {
                const gi = base + pj;
                return (
                  <button
                    key={photo.src}
                    onClick={() => setIndex(gi)}
                    className={`group relative mb-4 block w-full overflow-hidden rounded-3xl border-2 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${
                      c.accent === "primary"
                        ? "border-primary/30 hover:border-primary/60"
                        : "border-secondary/30 hover:border-secondary/60"
                    }`}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      width={photo.width}
                      height={photo.height}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="w-full transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-background/80 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="font-quicksand text-sm text-foreground/90">
                        {photo.caption}
                      </span>
                    </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md animate-fade-in"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
        >
          <button
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full border border-primary/30 bg-card/60 p-2 text-foreground/80 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous photo"
            className="absolute left-2 rounded-full border border-primary/30 bg-card/60 p-2 text-foreground/80 hover:text-foreground sm:left-6"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next photo"
            className="absolute right-2 rounded-full border border-primary/30 bg-card/60 p-2 text-foreground/80 hover:text-foreground sm:right-6"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

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
              className="max-h-[80vh] w-auto rounded-2xl border-2 border-primary/30 object-contain"
              priority
            />
            <figcaption className="font-quicksand text-sm text-foreground/70">
              {flat[index].caption}
            </figcaption>
          </figure>
        </div>,
        document.body,
      )}
    </>
  );
}

"use client";

import { useState, type CSSProperties } from "react";
import { getDailyCard, type OracleCard as Card } from "@/lib/oracle";
import { Sparkle } from "./prism/glyph";

/**
 * The Daily Oracle as a medium widget that flips like a tarot card. The back is
 * a holographic card whose colours slowly cycle; tap it and it turns on the
 * bouncy spring to reveal today's card. Tapping again turns it back over.
 */
export function OracleCard({ i }: { i?: number }) {
  const [revealed, setRevealed] = useState(false);
  // Drawn on tap, in the visitor's own timezone, so it's their card for today.
  const [card, setCard] = useState<Card | null>(null);

  const toggle = () => {
    if (!card) setCard(getDailyCard());
    setRevealed((r) => !r);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={revealed}
      aria-label={
        revealed && card
          ? `${card.name}. ${card.message} Tap to draw again.`
          : "Daily Oracle. Tap to draw your card for today"
      }
      className={`pg-oracle pg-press${revealed ? " is-revealed" : ""}${typeof i === "number" ? " pg-launch" : ""}`}
      style={typeof i === "number" ? ({ "--i": i } as CSSProperties) : undefined}
    >
      <span className="pg-oracle__inner">
        <span className="pg-oracle__face pg-oracle__back pg-glass" aria-hidden="true">
          <span className="pg-oracle__sigil">
            <Sparkle color="#ffffff" />
          </span>
          <span>
            <span className="pg-widget__eyebrow eyebrow">Daily Oracle</span>
            <span className="pg-widget__title title-2 block">Draw your card</span>
            <span className="pg-oracle__hint footnote block">tap to draw your card for today</span>
          </span>
        </span>
        <span className="pg-oracle__face pg-oracle__front pg-glass pg-glass--thick" aria-hidden="true">
          <span className="pg-widget__eyebrow eyebrow">
            {card?.glyph} Daily Oracle
          </span>
          <span className="pg-widget__title title-2 block">{card?.name}</span>
          <span className="pg-oracle__msg serif-italic block">{card?.message}</span>
          <span className="pg-oracle__hint footnote block">tap to draw again</span>
        </span>
      </span>
      <span aria-live="polite" className="sr-only">
        {revealed && card ? `${card.name}. ${card.message}` : ""}
      </span>
    </button>
  );
}

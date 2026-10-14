"use client";

/* eslint-disable @next/next/no-img-element -- Discord CDN avatar, already sized by the CDN */
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Sparkle } from "./glyph";
import { activePlatforms, platformText, STATUS, usePresence } from "./presence";

/**
 * Discord presence as an iOS Live Activity. Compact, it's a true-black capsule
 * with avatar, status and a twinkle (or a sound wave while listening on
 * Spotify). Tap and it morphs on the bouncy spring into the expanded island
 * with Message / Join server. Escape or a tap outside closes it.
 */
export function DynamicIsland({
  name,
  avatar,
  messageHref,
  joinHref,
}: {
  name: string;
  avatar: string;
  messageHref: string;
  joinHref: string;
}) {
  const presence = usePresence();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const status = presence ? STATUS[presence.discord_status] : null;
  const platform = platformText(activePlatforms(presence));
  const listening = presence?.listening_to_spotify ? presence.spotify?.song : undefined;
  const custom = presence?.activities.find((a) => a.type === 4)?.state;
  const word = status ? status.label.toLowerCase() : "on discord";
  const line = status
    ? custom || `${status.label}${platform ? ` on Discord ${platform}` : ""}`
    : "Find me on Discord";

  return (
    <div className="pg-island-wrap">
      <div
        ref={ref}
        className={`pg-island${open ? " is-open" : ""}`}
        style={{ "--sc": status?.color ?? "var(--status-offline)" } as CSSProperties}
      >
        <button
          type="button"
          className="pg-island__hit"
          aria-expanded={open}
          aria-label={`${name}, ${listening ? `listening to ${listening}` : line}. ${open ? "Collapse" : "Expand"}`}
          onClick={() => setOpen((o) => !o)}
        />

        <span className="pg-island__compact" aria-hidden="true">
          <span className="pg-island__av">
            <img src={avatar} alt="" />
            {status && <i className="pg-island__dot" />}
          </span>
          <span className="pg-island__text">
            <b>{name}</b>
            <span> · {listening ?? word}</span>
          </span>
          {listening ? (
            <span className="pg-island__wave">
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : (
            <span className="pg-island__end">
              <Sparkle twinkle color="currentColor" />
            </span>
          )}
        </span>

        <span className="pg-island__full" inert={!open}>
          <span className="pg-island__av" aria-hidden="true">
            <img src={avatar} alt="" />
            {status && <i className="pg-island__dot" />}
          </span>
          <span className="pg-island__name" aria-hidden="true">
            {name}
          </span>
          <span className="pg-island__sub" aria-hidden="true">
            {listening ? `Listening to ${listening}` : line}
          </span>
          <span className="pg-island__actions">
            <a href={messageHref} target="_blank" rel="noopener noreferrer">
              Message
            </a>
            <a href={joinHref} target="_blank" rel="noopener noreferrer">
              Join server
            </a>
          </span>
        </span>
      </div>
    </div>
  );
}

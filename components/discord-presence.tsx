"use client";

/* eslint-disable @next/next/no-img-element -- Discord CDN emoji, album art and nameplate */
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import type { AnimatedAsset } from "@/lib/discord";
import { activePlatforms, platformText, STATUS, usePresence } from "./prism/presence";

const ACTIVITY_VERB: Record<number, string> = {
  0: "Playing",
  2: "Listening to",
  3: "Watching",
  5: "Competing in",
};

/**
 * The name row, styled like a Discord member-list row with the nameplate
 * behind it. Like Discord, the nameplate is a still that animates on hover/focus.
 */
export function NamePlate({
  href,
  nameplate,
  children,
}: {
  href: string;
  nameplate?: AnimatedAsset;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const plateRef = useRef<HTMLVideoElement>(null);
  const play = () => void plateRef.current?.play().catch(() => {});
  const pause = () => plateRef.current?.pause();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={play}
      onMouseLeave={pause}
      onFocus={play}
      onBlur={pause}
      className="pg-discord__plate pg-press"
    >
      {nameplate && (
        <>
          <img src={nameplate.still} alt="" className="pg-plate" />
          {!reduceMotion && (
            <video
              ref={plateRef}
              src={nameplate.src}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="pg-plate"
            />
          )}
        </>
      )}
      {children}
    </a>
  );
}

/** Live status, custom status and what she's doing right now, from Lanyard. */
export function PresenceMeta() {
  const presence = usePresence();
  if (!presence) return null;

  const status = STATUS[presence.discord_status];
  const platform = platformText(activePlatforms(presence));
  const custom = presence.activities.find((a) => a.type === 4);
  const activity = presence.activities.find((a) => a.type in ACTIVITY_VERB);
  const spotify = presence.listening_to_spotify ? presence.spotify : null;

  return (
    <div className="pg-discord__meta">
      <span className="pg-discord__status" style={{ "--sc": status.color } as CSSProperties}>
        <i aria-hidden="true" />
        {status.label}
        {platform && ` · on ${platform}`}
      </span>

      {custom && (custom.state || custom.emoji) && (
        <span className="pg-discord__activity">
          {custom.emoji?.id ? (
            <img
              src={`https://cdn.discordapp.com/emojis/${custom.emoji.id}.webp?size=32${custom.emoji.animated ? "&animated=true" : ""}`}
              alt={custom.emoji.name}
              className="!h-4 !w-4 !rounded-none"
            />
          ) : (
            custom.emoji && <span aria-hidden="true">{custom.emoji.name}</span>
          )}
          {custom.state && <span>{custom.state}</span>}
        </span>
      )}

      {spotify ? (
        <span className="pg-discord__activity">
          {spotify.album_art_url && <img src={spotify.album_art_url} alt="" />}
          <span>
            Listening to <b className="font-semibold text-label">{spotify.song}</b> by {spotify.artist}
          </span>
        </span>
      ) : (
        activity && (
          <span className="pg-discord__activity">
            <span>
              {ACTIVITY_VERB[activity.type]} <b className="font-semibold text-label">{activity.name}</b>
              {activity.details && ` · ${activity.details}`}
            </span>
          </span>
        )
      )}
    </div>
  );
}

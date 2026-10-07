"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import type { DiscordNameStyle, DiscordProfile } from "@/lib/discord";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DiscordIcon } from "./brand-icons";

// ---------------------------------------------------------------------------
// Live presence via Lanyard (https://github.com/Phineas/lanyard)
// ---------------------------------------------------------------------------

type Status = "online" | "idle" | "dnd" | "offline";

type LanyardActivity = {
  type: number;
  name: string;
  state?: string;
  details?: string;
  emoji?: { name: string; id?: string; animated?: boolean };
};

type LanyardPresence = {
  discord_status: Status;
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: { song: string; artist: string; album_art_url: string | null } | null;
};

const STATUS: Record<Status, { color: string; label: string }> = {
  online: { color: "#23a55a", label: "Online" },
  idle: { color: "#f0b232", label: "Idle" },
  dnd: { color: "#f23f43", label: "Do not disturb" },
  offline: { color: "#80848e", label: "Offline" },
};

const ACTIVITY_VERB: Record<number, string> = {
  0: "Playing",
  2: "Listening to",
  3: "Watching",
  5: "Competing in",
};

const POLL_MS = 30_000;

function useLanyard(userId: string) {
  const [presence, setPresence] = useState<LanyardPresence | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setInterval> | undefined;

    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        // success:false means Lanyard isn't tracking this user — hide presence.
        if (!cancelled) setPresence(json.success ? json.data : null);
      } catch {
        // Transient network error: keep whatever we last showed.
      }
    };

    const stop = () => clearInterval(timer);
    const start = () => {
      stop();
      timer = setInterval(load, POLL_MS);
    };
    // Load once up front, but only keep polling while the tab is visible.
    const onVisibility = () => {
      if (document.hidden) return stop();
      load();
      start();
    };

    load();
    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [userId]);

  return presence;
}

// ---------------------------------------------------------------------------
// Display name, rendered with the profile's Display Name Style.
// IDs: https://docs.discord.food/resources/user (display name font / effect)
// ---------------------------------------------------------------------------

// Only fonts we actually load in app/layout.tsx; anything else falls back.
const NAME_FONTS: Record<number, string> = {
  13: "font-playpen", // PLAYPEN_SANS — "Monkey Bars"
};

const EFFECT = { SOLID: 1, GRADIENT: 2, GLOW: 6, PRISM: 7, GUMMY: 8 } as const;

function DiscordDisplayName({ name, style }: { name: string; style?: DiscordNameStyle }) {
  if (!style) {
    return <span className="font-fredoka text-foreground glow-text">{name}</span>;
  }

  const font = NAME_FONTS[style.fontId] ?? "font-fredoka";
  const { effectId, colors } = style;

  // Gummy: four-colour pattern, letters squash and stretch.
  if (effectId === EFFECT.GUMMY) {
    return (
      <span className={cn(font, "inline-flex font-semibold")}>
        <span className="sr-only">{name}</span>
        {Array.from(name).map((ch, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block origin-bottom animate-gummy"
            style={{
              color: colors[i % colors.length],
              animationDelay: `${i * 90}ms`,
              textShadow: "0 2px 0 rgb(0 0 0 / 0.3)",
            }}
          >
            {ch}
          </span>
        ))}
      </span>
    );
  }

  const gradient =
    colors.length > 1 &&
    (effectId === EFFECT.GRADIENT || effectId === EFFECT.GLOW || effectId === EFFECT.PRISM);
  if (gradient) {
    return (
      <span
        className={cn(
          font,
          "bg-clip-text font-semibold text-transparent",
          effectId === EFFECT.PRISM && "animate-shimmer",
        )}
        style={{
          backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})`,
          backgroundSize: effectId === EFFECT.PRISM ? "200% 100%" : undefined,
        }}
      >
        {name}
      </span>
    );
  }

  return (
    <span className={cn(font, "font-semibold")} style={{ color: colors[0] }}>
      {name}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Presence lines (custom status + current activity)
// ---------------------------------------------------------------------------

function PresenceLines({ presence }: { presence: LanyardPresence }) {
  const custom = presence.activities.find((a) => a.type === 4);
  const activity = presence.activities.find((a) => a.type in ACTIVITY_VERB);
  const spotify = presence.listening_to_spotify ? presence.spotify : null;

  if (!custom?.state && !custom?.emoji && !spotify && !activity) return null;

  return (
    <div className="mt-3 space-y-2 text-sm font-quicksand text-foreground/70">
      {custom && (custom.state || custom.emoji) && (
        <p className="flex items-center gap-1.5 truncate">
          {custom.emoji?.id ? (
            <Image
              src={`https://cdn.discordapp.com/emojis/${custom.emoji.id}.webp?size=32${custom.emoji.animated ? "&animated=true" : ""}`}
              alt={custom.emoji.name}
              width={16}
              height={16}
              unoptimized
              className="h-4 w-4 shrink-0"
            />
          ) : (
            custom.emoji && <span aria-hidden="true">{custom.emoji.name}</span>
          )}
          {custom.state && <span className="truncate">{custom.state}</span>}
        </p>
      )}

      {spotify ? (
        <div className="flex items-center gap-2.5">
          {spotify.album_art_url && (
            <Image
              src={spotify.album_art_url}
              alt=""
              width={36}
              height={36}
              unoptimized
              className="h-9 w-9 shrink-0 rounded-lg"
            />
          )}
          <div className="min-w-0 leading-tight">
            <p className="truncate">
              <span className="text-foreground/50">Listening to </span>
              <span className="font-semibold text-foreground/85">{spotify.song}</span>
            </p>
            <p className="truncate text-xs text-foreground/50">by {spotify.artist}</p>
          </div>
        </div>
      ) : (
        activity && (
          <div className="min-w-0 leading-tight">
            <p className="truncate">
              <span className="text-foreground/50">{ACTIVITY_VERB[activity.type]} </span>
              <span className="font-semibold text-foreground/85">{activity.name}</span>
            </p>
            {activity.details && (
              <p className="truncate text-xs text-foreground/50">{activity.details}</p>
            )}
          </div>
        )
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Card
// ---------------------------------------------------------------------------

export function DiscordProfileCard({
  profile,
  userId,
}: {
  profile: DiscordProfile;
  userId: string;
}) {
  const presence = useLanyard(userId);
  const reduceMotion = useReducedMotion();
  const plateRef = useRef<HTMLVideoElement>(null);
  const playPlate = () => void plateRef.current?.play().catch(() => {});
  const pausePlate = () => plateRef.current?.pause();
  const pick = (asset: { src: string; still: string }) => (reduceMotion ? asset.still : asset.src);
  const status = presence ? STATUS[presence.discord_status] : null;
  const { server } = profile;

  return (
    <div className="w-full overflow-hidden rounded-3xl border-2 border-primary/30 bg-card/50 backdrop-blur-sm">
      {/* Banner */}
      <div
        className="relative aspect-[3/1] w-full bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40"
        style={profile.bannerColor ? { background: profile.bannerColor } : undefined}
      >
        {profile.banner && (
          <Image
            src={pick(profile.banner)}
            alt=""
            fill
            unoptimized
            sizes="448px"
            className="object-cover"
          />
        )}
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-background/60 px-2.5 py-1 text-xs font-fredoka text-foreground/80 backdrop-blur-sm">
          <DiscordIcon className="h-3.5 w-3.5" />
          Discord
        </span>
      </div>

      <div className="px-4 pb-4">
        {/* Avatar + decoration + status */}
        <div className="relative -mt-10 h-20 w-20">
          <Image
            src={pick(profile.avatar)}
            alt={`${profile.displayName}'s Discord avatar`}
            width={80}
            height={80}
            unoptimized
            className="h-20 w-20 rounded-full object-cover ring-4 ring-card"
          />
          {profile.decoration && (
            <Image
              src={pick(profile.decoration)}
              alt=""
              width={96}
              height={96}
              unoptimized
              className="pointer-events-none absolute -left-2 -top-2 h-24 w-24 max-w-none"
            />
          )}
          {status && (
            <span
              className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-card"
              title={status.label}
            >
              <span className="relative flex h-3.5 w-3.5">
                {presence?.discord_status === "online" && (
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ backgroundColor: status.color }}
                  />
                )}
                <span
                  className="relative inline-flex h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: status.color }}
                />
              </span>
              <span className="sr-only">{status.label}</span>
            </span>
          )}
        </div>

        {/* Name row, styled like a Discord member-list row with the nameplate behind it.
            Like Discord, the nameplate is a still that animates on hover/focus. */}
        <a
          href={profile.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={playPlate}
          onMouseLeave={pausePlate}
          onFocus={playPlate}
          onBlur={pausePlate}
          className="group relative mt-3 flex h-12 items-center gap-2 overflow-hidden rounded-xl px-3 transition-colors hover:bg-primary/10"
        >
          {profile.nameplate && (
            <>
              <Image
                src={profile.nameplate.still}
                alt=""
                fill
                unoptimized
                sizes="448px"
                className="object-cover object-right"
              />
              {!reduceMotion && (
                <video
                  ref={plateRef}
                  src={profile.nameplate.src}
                  muted
                  loop
                  playsInline
                  preload="none"
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover object-right opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              )}
            </>
          )}
          <span className="relative text-xl">
            <DiscordDisplayName name={profile.displayName} style={profile.nameStyle} />
          </span>
          {profile.tag && (
            <span className="relative flex items-center gap-1 rounded-md bg-background/60 px-1.5 py-0.5 text-xs font-semibold text-foreground/85 backdrop-blur-sm">
              {profile.tag.badgeUrl && (
                <Image
                  src={profile.tag.badgeUrl}
                  alt=""
                  width={14}
                  height={14}
                  unoptimized
                  className="h-3.5 w-3.5"
                />
              )}
              {profile.tag.text}
            </span>
          )}
        </a>

        {presence && <PresenceLines presence={presence} />}

        {/* Server invite */}
        <div className="mt-4 flex items-center gap-2.5 rounded-2xl border border-primary/20 bg-background/30 p-3">
          {server.iconUrl ? (
            <Image
              src={server.iconUrl}
              alt=""
              width={40}
              height={40}
              unoptimized
              className="h-10 w-10 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15">
              <DiscordIcon className="h-5 w-5 text-primary" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 font-fredoka text-sm font-medium leading-tight text-foreground">{server.name}</p>
            {server.memberCount != null && (
              <p className="flex items-center gap-1.5 text-xs font-quicksand text-foreground/50">
                {server.onlineCount != null && (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#23a55a]" />
                )}
                <span className="truncate">
                  {server.onlineCount != null && `${server.onlineCount} online · `}
                  {server.memberCount} {server.memberCount === 1 ? "member" : "members"}
                </span>
              </p>
            )}
          </div>
          <Button asChild size="sm" className="h-8 shrink-0 gap-1.5 rounded-full px-3 font-fredoka">
            <a href={server.inviteUrl} target="_blank" rel="noopener noreferrer">
              <DiscordIcon />
              Join
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

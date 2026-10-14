/* eslint-disable @next/next/no-img-element -- Discord CDN art (banner, badge, server icon) */
import type { CSSProperties } from "react";
import type { DiscordNameStyle, DiscordProfile } from "@/lib/discord";
import { cn } from "@/lib/utils";
import { AnimatedImg, Avatar } from "./prism/avatar";
import { Button, Glass } from "./prism/glass";
import { NamePlate, PresenceMeta } from "./discord-presence";

// ---------------------------------------------------------------------------
// Display name, rendered with the profile's Display Name Style.
// IDs: https://docs.discord.food/resources/user (display name font / effect)
// ---------------------------------------------------------------------------

// Only fonts we actually load in app/layout.tsx; anything else falls back.
const NAME_FONTS: Record<number, string> = {
  13: "font-gummy", // PLAYPEN_SANS — "Monkey Bars"
};

const EFFECT = { SOLID: 1, GRADIENT: 2, GLOW: 6, PRISM: 7, GUMMY: 8 } as const;

function DiscordDisplayName({ name, style }: { name: string; style?: DiscordNameStyle }) {
  if (!style) {
    return <span className="title-2 text-label">{name}</span>;
  }

  const font = NAME_FONTS[style.fontId] ?? "font-rounded";
  const { effectId, colors } = style;

  // Gummy: four-colour pattern, letters squash and stretch, outlined so pastels read anywhere.
  if (effectId === EFFECT.GUMMY) {
    return (
      <span className={cn("pg-gummy", font)}>
        <span className="sr-only">{name}</span>
        {Array.from(name).map((ch, i) => (
          <span key={i} aria-hidden="true" style={{ color: colors[i % colors.length], animationDelay: `${i * 90}ms` }}>
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
        className={cn(font, "bg-clip-text text-2xl font-bold text-transparent", effectId === EFFECT.PRISM && "pg-name-shimmer")}
        style={{ backgroundImage: `linear-gradient(90deg, ${colors.join(", ")})` }}
      >
        {name}
      </span>
    );
  }

  return (
    <span className={cn(font, "text-2xl font-bold")} style={{ color: colors[0] }}>
      {name}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Card: animated banner, decorated avatar, nameplate + name + server tag, live
// presence, and the server invite.
// ---------------------------------------------------------------------------

export function DiscordProfileCard({ profile, i }: { profile: DiscordProfile; i?: number }) {
  const { server } = profile;

  return (
    <Glass as="section" i={i} className="pg-discord" ariaLabel="Discord profile">
      <div
        className="pg-discord__banner"
        style={profile.bannerColor ? ({ "--banner-color": profile.bannerColor } as CSSProperties) : undefined}
      >
        {profile.banner && <AnimatedImg asset={profile.banner} alt="" />}
        <span className="pg-discord__badge">Discord</span>
      </div>

      <div className="pg-discord__body">
        <Avatar
          className="pg-discord__avatar"
          avatar={profile.avatar}
          decoration={profile.decoration}
          alt={`${profile.displayName}'s Discord avatar`}
          size={92}
        />

        <NamePlate href={profile.profileUrl} nameplate={profile.nameplate}>
          <DiscordDisplayName name={profile.displayName} style={profile.nameStyle} />
          {profile.tag && (
            <span className="pg-tag">
              {profile.tag.badgeUrl && <img src={profile.tag.badgeUrl} alt="" />}
              <span className="sr-only">server tag </span>
              {profile.tag.text}
            </span>
          )}
        </NamePlate>

        <PresenceMeta />

        <Glass variant="thick" className="pg-discord__server">
          {server.iconUrl && <img src={server.iconUrl} alt="" />}
          <div className="pg-discord__server-text">
            <p className="pg-discord__server-name headline">{server.name}</p>
            {server.memberCount != null && (
              <p className="pg-discord__server-count footnote">
                {server.onlineCount != null && <i aria-hidden="true" />}
                {server.onlineCount != null && `${server.onlineCount} online · `}
                {server.memberCount} {server.memberCount === 1 ? "member" : "members"}
              </p>
            )}
          </div>
          <Button href={server.inviteUrl} external variant="mint" small>
            Join
          </Button>
        </Glass>
      </div>
    </Glass>
  );
}

import { site } from "./site";

// Discord's public invite endpoint returns the guild *and* the inviter's full
// user object (avatar, decoration, banner, nameplate, name style, server tag),
// so one unauthenticated request covers the whole profile card. No bot token.

const CDN = "https://cdn.discordapp.com";

export type DiscordNameStyle = { fontId: number; effectId: number; colors: string[] };

// Animated cosmetics carry a still frame for prefers-reduced-motion.
export type AnimatedAsset = { src: string; still: string };

export type DiscordProfile = {
  displayName: string;
  profileUrl: string;
  avatar: AnimatedAsset;
  decoration?: AnimatedAsset;
  banner?: AnimatedAsset;
  bannerColor?: string;
  nameplate?: AnimatedAsset; // src is a webm, still is a png
  nameStyle?: DiscordNameStyle;
  tag?: { text: string; badgeUrl?: string };
  server: {
    name: string;
    iconUrl?: string;
    memberCount?: number;
    onlineCount?: number;
    inviteUrl: string;
  };
};

// Only the fields we read from GET /invites/{code}?with_counts=true.
type InviteResponse = {
  guild?: { id: string; name: string; icon: string | null };
  approximate_member_count?: number;
  approximate_presence_count?: number;
  inviter?: {
    id: string;
    username: string;
    global_name: string | null;
    avatar: string | null;
    banner?: string | null;
    banner_color?: string | null;
    avatar_decoration_data?: { asset: string } | null;
    collectibles?: { nameplate?: { asset: string } | null } | null;
    display_name_styles?: { font_id: number; effect_id: number; colors: number[] } | null;
    primary_guild?: {
      identity_guild_id: string | null;
      identity_enabled: boolean | null;
      tag: string | null;
      badge: string | null;
    } | null;
  };
};

const isAnimated = (hash: string) => hash.startsWith("a_");
const toHex = (n: number) => `#${n.toString(16).padStart(6, "0")}`;

const avatar = (userId: string, hash: string): AnimatedAsset => {
  const still = `${CDN}/avatars/${userId}/${hash}.png?size=160`;
  return isAnimated(hash)
    ? { src: `${CDN}/avatars/${userId}/${hash}.webp?size=160&animated=true`, still }
    : { src: still, still };
};

// Animated banners as webp are ~4x smaller than the gif.
const banner = (userId: string, hash: string): AnimatedAsset => {
  const still = `${CDN}/banners/${userId}/${hash}.webp?size=600`;
  return { src: isAnimated(hash) ? `${still}&animated=true` : still, still };
};

// passthrough=true keeps the APNG animation; without it the CDN serves a still.
const decoration = (asset: string): AnimatedAsset => {
  const still = `${CDN}/avatar-decoration-presets/${asset}.png?size=160`;
  return { src: `${still}&passthrough=true`, still };
};

const nameplate = (asset: string): AnimatedAsset => ({
  src: `${CDN}/assets/collectibles/${asset}asset.webm`,
  still: `${CDN}/assets/collectibles/${asset}static.png`,
});

const fallbackProfile = (): DiscordProfile => ({
  displayName: site.discord.username,
  profileUrl: site.discord.profile,
  avatar: { src: "/img/avatar.jpg", still: "/img/avatar.jpg" },
  server: { name: site.discord.serverName, inviteUrl: site.discord.invite },
});

export async function getDiscordProfile(): Promise<DiscordProfile> {
  const fallback = fallbackProfile();
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${site.discord.inviteCode}?with_counts=true`,
      { next: { revalidate: 3600 } },
    );
    if (!res.ok) return fallback;
    const data = (await res.json()) as InviteResponse;

    const server: DiscordProfile["server"] = {
      name: data.guild?.name ?? fallback.server.name,
      iconUrl: data.guild?.icon
        ? `${CDN}/icons/${data.guild.id}/${data.guild.icon}.png?size=128`
        : undefined,
      memberCount: data.approximate_member_count,
      onlineCount: data.approximate_presence_count,
      inviteUrl: site.discord.invite,
    };

    // Only trust the inviter if it's actually me (invites can be re-created by others).
    const user = data.inviter;
    if (!user || user.id !== site.discord.userId) return { ...fallback, server };

    const plate = user.collectibles?.nameplate?.asset;
    const styles = user.display_name_styles;
    const guildTag = user.primary_guild;

    return {
      displayName: user.global_name ?? user.username,
      profileUrl: site.discord.profile,
      avatar: user.avatar ? avatar(user.id, user.avatar) : fallback.avatar,
      decoration: user.avatar_decoration_data
        ? decoration(user.avatar_decoration_data.asset)
        : undefined,
      banner: user.banner ? banner(user.id, user.banner) : undefined,
      bannerColor: user.banner_color ?? undefined,
      nameplate: plate ? nameplate(plate) : undefined,
      nameStyle: styles?.colors?.length
        ? { fontId: styles.font_id, effectId: styles.effect_id, colors: styles.colors.map(toHex) }
        : undefined,
      tag:
        guildTag?.identity_enabled && guildTag.tag
          ? {
              text: guildTag.tag,
              badgeUrl:
                guildTag.badge && guildTag.identity_guild_id
                  ? `${CDN}/clan-badges/${guildTag.identity_guild_id}/${guildTag.badge}.png?size=32`
                  : undefined,
            }
          : undefined,
      server,
    };
  } catch {
    return fallback;
  }
}

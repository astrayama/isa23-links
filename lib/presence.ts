// Live Discord presence from Lanyard (https://github.com/Phineas/lanyard):
// the shapes it sends and how the site words them. Pure, so it's unit-tested.

export type Status = "online" | "idle" | "dnd" | "offline";

export type LanyardActivity = {
  type: number;
  name: string;
  state?: string;
  details?: string;
  emoji?: { name: string; id?: string; animated?: boolean };
};

export type LanyardPresence = {
  discord_status: Status;
  activities: LanyardActivity[];
  listening_to_spotify: boolean;
  spotify: { song: string; artist: string; album_art_url: string | null } | null;
  active_on_discord_desktop?: boolean;
  active_on_discord_web?: boolean;
  active_on_discord_mobile?: boolean;
  active_on_discord_vr?: boolean;
  /** Discord's "embedded" client: consoles (Xbox, PlayStation). */
  active_on_discord_embedded?: boolean;
};

export const LANYARD_SOCKET = "wss://api.lanyard.rest/socket";
export const lanyardUserUrl = (userId: string) => `https://api.lanyard.rest/v1/users/${userId}`;

export const STATUS: Record<Status, { label: string; color: string }> = {
  online: { label: "Online", color: "var(--status-online)" },
  idle: { label: "Idle", color: "var(--status-idle)" },
  dnd: { label: "Do not disturb", color: "var(--status-dnd)" },
  offline: { label: "Offline", color: "var(--status-offline)" },
};

const PLATFORMS = [
  ["active_on_discord_desktop", "desktop"],
  ["active_on_discord_web", "web"],
  ["active_on_discord_mobile", "mobile"],
  ["active_on_discord_vr", "VR"],
  ["active_on_discord_embedded", "console"],
] as const;

/** Every client she's connected on right now, e.g. ["web", "mobile"]; none when offline. */
export function activePlatforms(p: LanyardPresence | null): string[] {
  if (!p || p.discord_status === "offline") return [];
  return PLATFORMS.filter(([key]) => p[key]).map(([, label]) => label);
}

/** "web", "web & mobile", "desktop, web & mobile" */
export function platformText(platforms: string[]): string {
  if (platforms.length <= 1) return platforms[0] ?? "";
  return `${platforms.slice(0, -1).join(", ")} & ${platforms.at(-1)}`;
}

/**
 * A Lanyard payload (REST `data`, or a socket INIT_STATE / PRESENCE_UPDATE),
 * or null when Lanyard isn't tracking the user.
 */
export function toPresence(data: unknown): LanyardPresence | null {
  const p = data as Partial<LanyardPresence> | null;
  if (!p || typeof p.discord_status !== "string" || !(p.discord_status in STATUS)) return null;
  return { ...p, activities: p.activities ?? [] } as LanyardPresence;
}

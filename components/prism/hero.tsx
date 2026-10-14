/* eslint-disable @next/next/no-img-element -- 16px pixel-art server-tag badge from Discord's CDN */
import type { DiscordProfile } from "@/lib/discord";
import { Avatar } from "./avatar";
import { Glass, launch } from "./glass";

/** Top of the page: decorated avatar, Large Title name, handle + server tag, serif tagline, bio, meta chips. */
export function ProfileHero({
  i,
  name,
  profile,
  tagline,
  bio,
  meta,
}: {
  i?: number;
  name: string;
  profile: DiscordProfile;
  tagline: string;
  bio: string;
  meta: readonly string[];
}) {
  const l = launch(i);
  return (
    <header className={`pg-hero ${l.className ?? ""}`} style={l.style}>
      <Avatar avatar={profile.avatar} decoration={profile.decoration} alt={`Portrait of ${name}`} size={120} />
      <h1 className="pg-hero__name large-title">{name}</h1>
      <div className="pg-hero__handle subheadline">
        <span>@{profile.username}</span>
        {profile.tag && (
          <Glass variant="thin" as="span" className="pg-tag">
            {profile.tag.badgeUrl && <img src={profile.tag.badgeUrl} alt="" />}
            <span className="sr-only">server tag </span>
            {profile.tag.text}
          </Glass>
        )}
      </div>
      <p className="pg-hero__tagline serif-italic">{tagline}</p>
      <p className="pg-hero__bio body">{bio}</p>
      <div className="pg-chips pg-hero__meta">
        {meta.map((m) => (
          <Glass key={m} variant="thin" as="span" className="pg-chip">
            {m}
          </Glass>
        ))}
      </div>
    </header>
  );
}

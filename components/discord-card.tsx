import { site } from "@/lib/site";
import { getDiscordProfile } from "@/lib/discord";
import { DiscordProfileCard } from "./discord-profile-card";

// Fetches the profile on the server (cached for an hour); presence is live on the client.
export async function DiscordCard() {
  const profile = await getDiscordProfile();
  return <DiscordProfileCard profile={profile} userId={site.discord.userId} />;
}

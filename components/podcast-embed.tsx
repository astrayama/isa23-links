"use client";

import { Mic } from "lucide-react";
import { site } from "@/lib/site";
import { podcastPills } from "@/lib/links";
import { ScrollablePills, PillLink } from "./scrollable-pills";

export function PodcastEmbed() {
  const src = `https://open.spotify.com/embed/show/${site.podcast.spotifyShowId}?utm_source=generator&theme=0`;

  return (
    <div className="w-full rounded-3xl border-2 border-primary/30 bg-card/50 p-4 backdrop-blur-sm pulse-glow">
      <div className="mb-3 flex items-center gap-2">
        <Mic className="h-5 w-5 text-primary" />
        <h2 className="font-fredoka text-lg font-medium text-foreground glow-text">
          {site.podcast.name}
        </h2>
        <span className="ml-auto text-xs font-quicksand text-foreground/50">latest episodes</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-primary/20">
        <iframe
          title={`${site.podcast.name} on Spotify`}
          src={src}
          width="100%"
          height={232}
          loading="lazy"
          frameBorder={0}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          style={{ display: "block" }}
        />
      </div>

      <div className="mt-3">
        <ScrollablePills>
          {podcastPills.map((p) => (
            <PillLink key={p.label} href={p.href} label={p.label} icon={p.icon} />
          ))}
        </ScrollablePills>
      </div>
    </div>
  );
}

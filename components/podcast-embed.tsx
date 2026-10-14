import Image from "next/image";
import { site } from "@/lib/site";
import { podcastPills } from "@/lib/links";
import { Glass } from "./prism/glass";
import { SheetTrigger } from "./sheets";

/**
 * The podcast as a medium "Now Playing" widget: cover art, the show, a round
 * play button (opens the Spotify player in a sheet) and platform chips.
 */
export function PodcastEmbed({ i }: { i?: number }) {
  return (
    <Glass as="section" i={i} className="pg-widget pg-widget--medium pg-podcast" ariaLabel={site.podcast.name}>
      <Image
        src="/img/podcast-art.webp"
        alt={`${site.podcast.name} cover art`}
        width={276}
        height={276}
        sizes="138px"
        priority
        className="pg-podcast__art"
      />
      <div className="pg-podcast__body">
        <p className="pg-widget__eyebrow eyebrow">Podcast</p>
        <p className="pg-widget__title title-2">{site.podcast.name}</p>
        <p className="pg-widget__sub subheadline">latest episodes</p>
        <div className="pg-podcast__row">
          <SheetTrigger sheet={{ name: "podcast" }} className="pg-play pg-press" ariaLabel={`Play ${site.podcast.name}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 4.5v15l12.5-7.5z" fill="currentColor" />
            </svg>
          </SheetTrigger>
          {podcastPills.map((p) => (
            <Glass key={p.label} variant="thin" href={p.href} external className="pg-chip">
              {p.label}
            </Glass>
          ))}
        </div>
      </div>
    </Glass>
  );
}

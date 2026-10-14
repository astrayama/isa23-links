import { site, sameAs } from "@/lib/site";
import { lockedLinks, primaryLinks, screenSageApps } from "@/lib/links";
import { getDiscordProfile } from "@/lib/discord";
import { getActiveQuests } from "@/lib/side-quests/fetch";
import { getNowUpdated } from "@/lib/now-updated";
import { ProfileHero } from "@/components/prism/hero";
import { AppShelf } from "@/components/prism/apps";
import { ListGroup, ListRow } from "@/components/prism/list";
import { PodcastEmbed } from "@/components/podcast-embed";
import { OracleCard } from "@/components/oracle-card";
import { NowList, NowNotes, NowWidget, WritingWidget } from "@/components/now-strip";
import { DiscordProfileCard } from "@/components/discord-profile-card";
import { PageSettings } from "@/components/page-settings";

// Re-render at most hourly so the Now list picks up side-quest edits without a redeploy.
export const revalidate = 3600;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "isa23",
  alternateName: ["Screen Sage", "Omniversal Seeker"],
  url: site.url,
  sameAs,
};

export default async function Home() {
  const [quests, profile, nowUpdated] = await Promise.all([
    getActiveQuests(),
    getDiscordProfile(),
    getNowUpdated(),
  ]);

  return (
    <main className="pg-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <ProfileHero
        i={0}
        name={site.name}
        profile={profile}
        tagline={site.heroTagline}
        bio={site.bio}
        meta={site.meta}
      />

      <div className="pg-widgets">
        <PodcastEmbed i={1} />
        <NowWidget i={2} quests={quests} />
        <WritingWidget i={3} />
        <OracleCard i={4} />
      </div>

      <AppShelf
        i={5}
        title="Screen Sage"
        subtitle="videos, apps & the shop"
        image="/img/screen-sage-avatar.jpg"
        apps={screenSageApps}
      />

      <DiscordProfileCard i={6} profile={profile} />

      <NowList i={7} quests={quests} />
      <NowNotes i={8} updated={nowUpdated} />

      <ListGroup i={9} header="Explore">
        {primaryLinks.map((link) => (
          <ListRow
            key={link.href}
            title={link.label}
            subtitle={link.description}
            glyph={link.glyph}
            color={link.color}
            href={link.href}
            external={link.external}
          />
        ))}
      </ListGroup>

      <ListGroup
        i={10}
        header="Private"
        footer="Some links are locked for privacy and safety. Feel free to ask me for access!"
      >
        {lockedLinks.map((link) => (
          <ListRow
            key={link.key}
            title={link.label}
            subtitle={link.hint}
            glyph={link.glyph}
            color={link.color}
            locked
            sheet={{ name: "access", link: { key: link.key, label: link.label } }}
          />
        ))}
      </ListGroup>

      <ListGroup i={11} header="Connect">
        <ListRow
          title="Contact"
          subtitle="say hello, collaborate, or ask for access"
          glyph="mail"
          color="mint"
          sheet={{ name: "contact" }}
        />
        <ListRow
          title="Join the journey"
          subtitle="new episodes, software & reflections"
          glyph="send"
          color="violet"
          sheet={{ name: "journey" }}
        />
      </ListGroup>

      <PageSettings />

      <p className="pg-footnote footnote">⟡ made with cosmic energy by isa23 ⟡</p>
    </main>
  );
}

import Image from "next/image";
import { site, sameAs } from "@/lib/site";
import { primaryLinks } from "@/lib/links";
import { EquationHero } from "@/components/equation-hero";
import { OracleCard } from "@/components/oracle-card";
import { PodcastEmbed } from "@/components/podcast-embed";
import { NowStrip } from "@/components/now-strip";
import { ScreenSageCard } from "@/components/screen-sage-card";
import { LinkButton } from "@/components/link-button";
import { LockedLinks } from "@/components/locked-links";
import { ContactDialog } from "@/components/contact-dialog";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { Footer } from "@/components/footer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "isa23",
  alternateName: ["Screen Sage", "Omniversal Seeker"],
  url: site.url,
  sameAs,
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 px-1">
      <span className="text-xs font-fredoka uppercase tracking-[0.2em] text-foreground/40">
        {children}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Hero */}
        <EquationHero />

        <div className="flex justify-center animate-scale-in">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-50 blur-xl pulse-glow" />
            <Image
              src="/img/avatar.jpg"
              alt="Portrait of isa23"
              width={128}
              height={128}
              priority
              className="relative h-32 w-32 rounded-full border-4 border-primary/50 object-cover shadow-2xl"
            />
          </div>
        </div>

        <div className="space-y-3 text-center">
          <p className="font-fredoka text-xl font-medium text-foreground/80">{site.emojiTagline}</p>
          <div className="h-px mx-8 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <p className="px-4 font-quicksand text-base font-semibold leading-snug text-foreground/90">{site.bio}</p>
          <p className="font-quicksand text-xs tracking-wider uppercase text-foreground/45">{site.descriptor}</p>
        </div>

        {/* Featured: listen + draw a card + now */}
        <section className="space-y-4">
          <SectionLabel>Featured</SectionLabel>
          <PodcastEmbed />
          <OracleCard />
          <NowStrip />
        </section>

        {/* Screen Sage social cluster */}
        <section className="space-y-4">
          <SectionLabel>Screen Sage</SectionLabel>
          <ScreenSageCard />
        </section>

        {/* Primary links */}
        <section className="space-y-4">
          <SectionLabel>Explore</SectionLabel>
          {primaryLinks.map((link) => (
            <LinkButton
              key={link.label}
              href={link.href}
              icon={link.icon}
              label={link.label}
              description={link.description}
              external={link.external}
            />
          ))}
        </section>

        {/* Private / locked */}
        <section className="space-y-4">
          <SectionLabel>Private</SectionLabel>
          <LockedLinks />
          <p className="px-2 text-center text-xs text-muted-foreground">
            🔒 Some links are locked for privacy and safety. Feel free to ask me for access!
          </p>
        </section>

        {/* Connect */}
        <section className="space-y-4">
          <SectionLabel>Connect</SectionLabel>
          <ContactDialog />
          <NewsletterSignup />
        </section>

        <Footer />
      </div>
    </main>
  );
}

import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { AppGallery } from "@/components/app-gallery";

export const metadata: Metadata = {
  title: "Software — apps for mind, mood & meaning",
  description:
    "Web apps built by isa23: Yggdrasil journaling, Anicca mood tracking, Arcana tarot & astrology, Spoonful Steps, and more.",
  alternates: { canonical: "/software" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Software by isa23",
  description: "Collection of web apps built by isa23.",
};

export default function SoftwarePage() {
  return (
    <main className="pg-page pg-page--wide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BackLink />
      <header className="pg-page-head pg-launch">
        <p className="eyebrow text-accent">Apps for mind, mood & meaning</p>
        <h1 className="large-title">Software</h1>
        <p className="body">
          Tools I&apos;ve built for journaling, self-reflection, goal-setting, and personal growth, each
          one made with intention. Filter by what you&apos;re looking for and explore the ones that
          resonate.
        </p>
      </header>
      <AppGallery />
    </main>
  );
}

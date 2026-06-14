import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { AppGallery } from "@/components/app-gallery";

export const metadata: Metadata = {
  title: "Software — apps for mind, mood & meaning",
  description:
    "Web apps built by isa23: Yggdrasil journaling, Anicca mood tracking, Equilibrium goal balance, Mystic Ledger tarot journal, Spoonful Steps, and more.",
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
    <main className="relative z-10 flex min-h-screen flex-col items-center px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="w-full max-w-3xl space-y-8 animate-fade-in">
        <BackLink />
        <header className="space-y-3 text-center">
          <h1 className="font-fredoka text-4xl font-bold text-primary glow-text md:text-5xl">
            Software
          </h1>
          <p className="mx-auto max-w-2xl font-quicksand text-base leading-relaxed text-foreground/70 md:text-lg">
            Tools I&apos;ve built for journaling, self-reflection, goal-setting, and personal growth
            — each one made with intention. Filter by what you&apos;re looking for and explore the
            ones that resonate.
          </p>
        </header>
        <AppGallery />
      </div>
    </main>
  );
}

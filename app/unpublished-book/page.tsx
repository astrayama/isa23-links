import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "The Architecture of Life — a book",
  description:
    "A book reimagining society through the seven chakras: weaving spiritual wisdom, neuroscience, and systems theory into a blueprint for collective transformation.",
  alternates: { canonical: "/unpublished-book" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Book",
  name: "The Architecture of Life",
  author: { "@type": "Person", name: "isa23" },
  description:
    "Reimagining society through the seven chakras — a blueprint for collective transformation drawing on spiritual wisdom, neuroscience, and systems theory.",
};

const paragraphs = [
  "What if the key to healing our fractured world lies not in another policy or protest, but in reimagining the very architecture of life itself?",
  "In this bold, illuminating book, you'll journey through the seven chakras—not just as symbols of personal growth, but as a living map for collective transformation. Drawing on spiritual wisdom, neuroscience, systems theory, and courageous real-world reforms, the author weaves a new vision for humanity—one where ending suffering and unlocking human potential go hand in hand.",
  "Each chapter tackles the deepest imbalances and toughest wounds of modern civilization, from economic insecurity and cultural trauma to the crises of powerlessness, disconnection, and meaning. With clarity and practical hope, you'll discover how these challenges mirror the energy centers within us—and how the tools for healing ourselves are also the tools for healing society.",
  "You won't find empty platitudes or impossible utopias here. Instead, you'll find a pragmatic blueprint for change—rooted in Universal Basic Services, trauma-informed communities, radical participatory governance, and a reawakening of empathy and agency at every level. Along the way, you'll meet the thinkers, reformers, and everyday heroes already forging this path.",
];

export default function UnpublishedBookPage() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="w-full max-w-3xl space-y-8 animate-fade-in">
        <BackLink />

        <Reveal className="rounded-3xl border-2 border-primary/30 bg-card/50 p-8 shadow-2xl backdrop-blur-xl pulse-glow md:p-12">
          <h1 className="mb-8 text-center font-fredoka text-4xl font-bold text-primary glow-text md:text-5xl">
            The Architecture of Life
          </h1>
          <div className="space-y-6 text-justify text-lg font-light italic leading-relaxed text-foreground/80">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              <span className="font-semibold not-italic text-primary">
                The Architecture of Life
              </span>{" "}
              is a passionate call to action and an invitation to possibility. It is a book for
              seekers, builders, dreamers, and doers—anyone willing to imagine a world where dignity,
              creativity, and compassion are not the exception, but the rule. This is the handbook
              for those ready to become the architects of a flourishing future. Will you answer the
              call?
            </p>
          </div>
        </Reveal>

        <a
          href="https://life-architecture-labs.lovable.app"
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-3xl border-2 border-primary/30 bg-card/50 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-primary/60"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/20 transition-colors group-hover:bg-primary/30">
              <ExternalLink className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-fredoka text-lg font-medium text-foreground transition-all group-hover:glow-text">
                Reimagining the Architecture of Life
              </h2>
              <p className="truncate font-quicksand text-sm text-foreground/60">
                life-architecture-labs.lovable.app
              </p>
            </div>
            <span className="hidden font-fredoka text-sm text-primary/80 sm:block">Visit →</span>
          </div>
        </a>
      </div>
    </main>
  );
}

import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { Glass } from "@/components/prism/glass";
import { Glyph, iconColor } from "@/components/prism/glyph";
import { ListGroup, ListRow } from "@/components/prism/list";

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

const lead =
  "What if the key to healing our fractured world lies not in another policy or protest, but in reimagining the very architecture of life itself?";

const paragraphs = [
  "In this bold, illuminating book, you'll journey through the seven chakras—not just as symbols of personal growth, but as a living map for collective transformation. Drawing on spiritual wisdom, neuroscience, systems theory, and courageous real-world reforms, the author weaves a new vision for humanity—one where ending suffering and unlocking human potential go hand in hand.",
  "Each chapter tackles the deepest imbalances and toughest wounds of modern civilization, from economic insecurity and cultural trauma to the crises of powerlessness, disconnection, and meaning. With clarity and practical hope, you'll discover how these challenges mirror the energy centers within us—and how the tools for healing ourselves are also the tools for healing society.",
  "You won't find empty platitudes or impossible utopias here. Instead, you'll find a pragmatic blueprint for change—rooted in Universal Basic Services, trauma-informed communities, radical participatory governance, and a reawakening of empathy and agency at every level. Along the way, you'll meet the thinkers, reformers, and everyday heroes already forging this path.",
];

export default function UnpublishedBookPage() {
  return (
    <main className="pg-page pg-page--read">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BackLink />

      <header className="pg-page-head pg-launch">
        <span className="pg-app__icon !h-14 !w-14" style={iconColor("peach")} aria-hidden="true">
          <Glyph name="book" weight={2.2} />
        </span>
        <p className="eyebrow mt-2 text-accent">The book I&apos;m writing</p>
        <h1 className="large-title">The Architecture of Life</h1>
      </header>

      <Glass variant="thick" i={1} className="pg-prose">
        <p className="serif-italic">{lead}</p>
        {paragraphs.map((p, i) => (
          <p key={i} className="body">
            {p}
          </p>
        ))}
        <p className="body">
          <span className="font-semibold text-accent">The Architecture of Life</span> is a passionate
          call to action and an invitation to possibility. It is a book for seekers, builders,
          dreamers, and doers—anyone willing to imagine a world where dignity, creativity, and
          compassion are not the exception, but the rule. This is the handbook for those ready to
          become the architects of a flourishing future. Will you answer the call?
        </p>
      </Glass>

      <div className="pg-launch" style={{ "--i": 2 } as CSSProperties}>
        <ListGroup header="The companion lab">
          <ListRow
            title="Reimagining the Architecture of Life"
            subtitle="life-architecture-labs.lovable.app"
            glyph="globe"
            color="peach"
            href="https://life-architecture-labs.lovable.app"
            external
          />
        </ListGroup>
      </div>
    </main>
  );
}

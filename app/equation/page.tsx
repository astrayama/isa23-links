import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { Glass } from "@/components/prism/glass";
import { Glyph, Sparkle, iconColor } from "@/components/prism/glyph";

export const metadata: Metadata = {
  title: "0 = 1 = ∞ — an essay",
  description:
    "An essay on the philosophy and science behind the equation 0 = 1 = ∞ — emptiness, unity, and infinity as one.",
  alternates: { canonical: "/equation" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "0 = 1 = ∞",
  author: { "@type": "Person", name: "isa23" },
};

export default function EquationPage() {
  return (
    <main className="pg-page pg-page--read">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BackLink label="Home" />

      <header className="pg-page-head pg-launch">
        <span className="pg-app__icon !h-14 !w-14" style={iconColor("indigo")} aria-hidden="true">
          <Glyph name="infinity" weight={2.2} />
        </span>
        <h1 className="large-title mt-2 flex items-center gap-2">
          0 = 1 = ∞ <Sparkle twinkle className="text-2xl" />
        </h1>
        <p className="serif-italic">an essay</p>
      </header>

      <Glass as="section" variant="thick" i={1} className="pg-prose body">
        <p>
          The equation &ldquo;0 = 1 = ∞&rdquo; captures a powerful and timeless insight: at the
          deepest level, everything is interconnected, and the boundaries we perceive—between
          nothingness, individuality, and infinity—are ultimately illusions shaped by our limited
          perspectives. This idea is echoed by spiritual thinkers and supported by the language of
          physics, Eastern philosophy, and even modern psychology.
        </p>

        <h2 className="title-3">Nothingness, Unity, and Infinity</h2>
        <ul>
          <li>
            In Eastern philosophies such as Buddhism and Advaita Vedanta, &ldquo;zero&rdquo; (0) is
            not mere emptiness, but a dynamic void—pregnant with possibility, the original source or
            fertile ground from which all creation arises. It is the unmanifest potential of the
            universe.
          </li>
          <li>
            The &ldquo;one&rdquo; (1) represents unity or oneness: the idea that every perceivable
            thing is an expression of a single, infinite consciousness. This vision was championed by
            mystics, as well as physicists like Niels Bohr, who highlighted that quantum entanglement
            and observer-participation reveal the universe as a seamless, indivisible whole.
          </li>
          <li>
            &ldquo;Infinity&rdquo; (∞) stands for limitless potential and boundless existence. The
            universe, in both science and spirituality, is seen as inherently infinite: immeasurable,
            ever-expanding, and perpetually unfolding.
          </li>
        </ul>

        <h2 className="title-3">Where Science Meets Spirit</h2>
        <p>
          Quantum physics has shown that beneath everyday reality, there are no truly separate,
          isolated entities. Instead, everything emerges from (and dissolves into) a unified quantum
          field, echoing ancient spiritual ideas of oneness. The apparent duality between nothing and
          everything, the finite and the infinite, collapses when viewed through this lens:
          nothingness is not absence, but the wellspring of infinite creative power.
        </p>

        <h2 className="title-3">Psychological and Metaphysical Meaning</h2>
        <p>
          Psychologically, this equation reflects the human journey: we often feel separate (one) and
          fear both nothingness (0) and the infinite (∞), but deep growth and fulfillment come from
          embracing all aspects: recognizing that our separate sense of self is ultimately just one
          wave in the infinite ocean of consciousness. Spiritual practices across cultures guide us
          toward the realization that our inner emptiness is itself fullness; our individuality is
          inseparable from wholeness.
        </p>

        <h2 className="title-3">A Relatable Synthesis</h2>
        <p>
          So, &ldquo;0 = 1 = ∞&rdquo; is not a formula to crunch, but a profound invitation to
          experience life more fully. It says: You are not just your struggles, not just your story,
          and not even just a single mind or body; you are also the limitless potential before birth,
          the infinite self beyond the mind, and the living truth at the heart of all existence. This
          insight has been spoken by spiritual sages, echoed by quantum physicists, and recognized in
          modern psychology as the source of authentic well-being and connection.
        </p>
      </Glass>
    </main>
  );
}

import type { Metadata } from "next";
import { BackLink } from "@/components/back-link";
import { Reveal } from "@/components/reveal";

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
    <main className="relative z-10 px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 animate-fade-in">
          <BackLink label="Back to Home" />
        </div>

        <div className="mb-12 text-center animate-fade-in">
          <h1 className="mb-4 font-fredoka text-5xl font-bold text-primary glow-text md:text-6xl float">
            0 = 1 = ∞
          </h1>
          <div className="mx-auto h-1 w-32 rounded-full bg-gradient-to-r from-primary via-secondary to-accent opacity-60" />
        </div>

        <Reveal className="rounded-3xl border border-primary/20 bg-background/40 p-8 shadow-2xl backdrop-blur-sm md:p-12">
          <div className="space-y-6">
            <p className="leading-relaxed text-foreground/90">
              The equation &ldquo;0 = 1 = ∞&rdquo; captures a powerful and timeless insight: at the
              deepest level, everything is interconnected, and the boundaries we perceive—between
              nothingness, individuality, and infinity—are ultimately illusions shaped by our
              limited perspectives. This idea is echoed by spiritual thinkers and supported by the
              language of physics, Eastern philosophy, and even modern psychology.
            </p>

            <h2 className="mt-8 font-fredoka text-3xl font-bold text-primary">
              Nothingness, Unity, and Infinity
            </h2>
            <ul className="space-y-4 text-foreground/90">
              <li className="leading-relaxed">
                In Eastern philosophies such as Buddhism and Advaita Vedanta, &ldquo;zero&rdquo; (0)
                is not mere emptiness, but a dynamic void—pregnant with possibility, the original
                source or fertile ground from which all creation arises. It is the unmanifest
                potential of the universe.
              </li>
              <li className="leading-relaxed">
                The &ldquo;one&rdquo; (1) represents unity or oneness: the idea that every
                perceivable thing is an expression of a single, infinite consciousness. This vision
                was championed by mystics, as well as physicists like Niels Bohr, who highlighted
                that quantum entanglement and observer-participation reveal the universe as a
                seamless, indivisible whole.
              </li>
              <li className="leading-relaxed">
                &ldquo;Infinity&rdquo; (∞) stands for limitless potential and boundless existence.
                The universe, in both science and spirituality, is seen as inherently infinite:
                immeasurable, ever-expanding, and perpetually unfolding.
              </li>
            </ul>

            <h2 className="mt-8 font-fredoka text-3xl font-bold text-primary">
              Where Science Meets Spirit
            </h2>
            <p className="leading-relaxed text-foreground/90">
              Quantum physics has shown that beneath everyday reality, there are no truly separate,
              isolated entities. Instead, everything emerges from (and dissolves into) a unified
              quantum field, echoing ancient spiritual ideas of oneness. The apparent duality
              between nothing and everything, the finite and the infinite, collapses when viewed
              through this lens: nothingness is not absence, but the wellspring of infinite creative
              power.
            </p>

            <h2 className="mt-8 font-fredoka text-3xl font-bold text-primary">
              Psychological and Metaphysical Meaning
            </h2>
            <p className="leading-relaxed text-foreground/90">
              Psychologically, this equation reflects the human journey: we often feel separate
              (one) and fear both nothingness (0) and the infinite (∞), but deep growth and
              fulfillment come from embracing all aspects: recognizing that our separate sense of
              self is ultimately just one wave in the infinite ocean of consciousness. Spiritual
              practices across cultures guide us toward the realization that our inner emptiness is
              itself fullness; our individuality is inseparable from wholeness.
            </p>

            <h2 className="mt-8 font-fredoka text-3xl font-bold text-primary">
              A Relatable Synthesis
            </h2>
            <p className="leading-relaxed text-foreground/90">
              So, &ldquo;0 = 1 = ∞&rdquo; is not a formula to crunch, but a profound invitation to
              experience life more fully. It says: You are not just your struggles, not just your
              story, and not even just a single mind or body; you are also the limitless potential
              before birth, the infinite self beyond the mind, and the living truth at the heart of
              all existence. This insight has been spoken by spiritual sages, echoed by quantum
              physicists, and recognized in modern psychology as the source of authentic well-being
              and connection.
            </p>
          </div>
        </Reveal>
      </div>
    </main>
  );
}

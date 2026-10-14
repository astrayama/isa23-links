import { Button, Glass } from "@/components/prism/glass";
import { Sparkle } from "@/components/prism/glyph";

export default function NotFound() {
  return (
    <main className="pg-page pg-page--read min-h-screen justify-center">
      <Glass variant="thick" i={0} className="flex flex-col items-center gap-3 rounded-lg px-5 py-6 text-center">
        <p className="large-title flex items-center gap-2">
          ∞ ≠ 404 <Sparkle twinkle className="text-2xl" />
        </p>
        <h1 className="title-2">You&apos;ve wandered off the map</h1>
        <p className="body max-w-sm text-label-2">
          This corner of the cosmos doesn&apos;t exist (yet). Let&apos;s find your way back.
        </p>
        <Button href="/" variant="filled" icon="back" className="mt-2">
          Back to Home
        </Button>
      </Glass>
    </main>
  );
}

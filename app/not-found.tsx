import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <div className="space-y-6 animate-fade-in">
        <p className="font-fredoka text-6xl font-bold text-primary glow-text float">∞ ≠ 404</p>
        <h1 className="font-fredoka text-2xl font-medium text-foreground">
          You&apos;ve wandered off the map
        </h1>
        <p className="mx-auto max-w-sm font-quicksand text-foreground/60">
          This corner of the cosmos doesn&apos;t exist (yet). Let&apos;s find your way back.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-3xl border-2 border-primary/40 bg-card/50 px-6 py-3 font-fredoka text-foreground backdrop-blur-sm transition-all hover:scale-105 hover:border-primary/70"
        >
          <ArrowLeft className="h-5 w-5 text-primary" />
          Back to Home
        </Link>
      </div>
    </main>
  );
}

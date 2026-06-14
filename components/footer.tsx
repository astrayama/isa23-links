import Link from "next/link";

export function Footer() {
  return (
    <footer className="pt-8 text-center">
      <div className="mx-auto mb-4 h-px w-48 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <Link
        href="/equation"
        className="font-fredoka text-sm font-bold text-primary/80 transition-colors hover:text-primary glow-text"
      >
        0 = 1 = ∞
      </Link>
      <p className="mt-2 text-xs font-quicksand text-muted-foreground">
        ⟡ made with cosmic energy by isa23 ⟡
      </p>
    </footer>
  );
}

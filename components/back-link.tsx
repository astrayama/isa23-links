import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ label = "Back" }: { label?: string }) {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 font-fredoka text-foreground/70 transition-colors hover:text-primary"
    >
      <ArrowLeft className="h-5 w-5" />
      {label}
    </Link>
  );
}

import Link from "next/link";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IconType } from "@/lib/links";

interface LinkButtonProps {
  href?: string;
  icon: IconType;
  label: string;
  description?: string;
  onClick?: () => void;
  showLock?: boolean;
  external?: boolean;
}

const base =
  "group flex w-full items-center gap-3 rounded-3xl border-2 border-primary/30 bg-card/50 px-5 py-4 text-left backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:bg-card/70 pulse-glow focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function Inner({
  Icon,
  label,
  description,
  showLock,
}: {
  Icon: IconType;
  label: string;
  description?: string;
  showLock?: boolean;
}) {
  return (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/15 transition-colors group-hover:bg-primary/25">
        <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-accent" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-fredoka text-base font-medium text-foreground transition-all group-hover:glow-text">
          {label}
        </span>
        {description && (
          <span className="truncate text-xs font-quicksand text-foreground/55">{description}</span>
        )}
      </span>
      {showLock && <Lock className="ml-auto h-4 w-4 shrink-0 text-primary/70" />}
    </>
  );
}

export function LinkButton({
  href,
  icon,
  label,
  description,
  onClick,
  showLock,
  external,
}: LinkButtonProps) {
  const content = <Inner Icon={icon} label={label} description={description} showLock={showLock} />;

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cn(base)}>
        {content}
      </button>
    );
  }
  if (href?.startsWith("/")) {
    return (
      <Link href={href} className={cn(base)}>
        {content}
      </Link>
    );
  }
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(base)}
    >
      {content}
    </a>
  );
}

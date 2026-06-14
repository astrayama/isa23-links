import { now } from "@/lib/now";

export function NowStrip() {
  return (
    <div className="w-full rounded-3xl border-2 border-primary/30 bg-card/40 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        <h2 className="font-fredoka text-sm font-medium text-foreground">
          Now
          <span className="ml-2 font-quicksand text-xs font-normal text-foreground/40">
            {now.updated}
          </span>
        </h2>
      </div>
      <ul className="space-y-1.5">
        {now.items.map((item) => (
          <li key={item.label} className="flex gap-2 text-sm font-quicksand">
            <span className="shrink-0 font-fredoka text-primary/90">{item.label}</span>
            <span className="text-foreground/70">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

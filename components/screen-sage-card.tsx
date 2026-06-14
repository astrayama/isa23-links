"use client";

import Image from "next/image";
import { screenSagePills } from "@/lib/links";
import { ScrollablePills, PillLink } from "./scrollable-pills";

export function ScreenSageCard() {
  return (
    <div className="w-full rounded-3xl border-2 border-primary/30 bg-card/50 p-4 backdrop-blur-sm pulse-glow">
      <div className="flex items-center gap-4">
        <Image
          src="/img/screen-sage-avatar.jpg"
          alt="Screen Sage avatar"
          width={64}
          height={64}
          className="h-16 w-16 shrink-0 rounded-full border-2 border-primary/50 object-cover"
        />
        <div className="min-w-0 flex-1">
          <h2 className="mb-2 font-fredoka text-lg font-medium text-foreground glow-text">
            Screen Sage
          </h2>
          <ScrollablePills>
            {screenSagePills.map((p) => (
              <PillLink key={p.label} href={p.href} label={p.label} icon={p.icon} />
            ))}
          </ScrollablePills>
        </div>
      </div>
    </div>
  );
}

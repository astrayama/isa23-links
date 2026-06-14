"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getDailyCard } from "@/lib/oracle";

export function OracleCard() {
  const [revealed, setRevealed] = useState(false);
  const card = getDailyCard();

  return (
    <div className="[perspective:1200px]">
      <button
        onClick={() => setRevealed(true)}
        aria-label={revealed ? `Today's card: ${card.name}` : "Draw your card for today"}
        className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-3xl"
      >
        <motion.div
          className="relative h-44 w-full [transform-style:preserve-3d]"
          animate={{ rotateY: revealed ? 180 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* face down */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-3xl border-2 border-primary/40 bg-card/60 p-5 text-center backdrop-blur-sm pulse-glow [backface-visibility:hidden]">
            <Sparkles className="h-7 w-7 text-primary" />
            <p className="font-fredoka text-base font-medium text-foreground glow-text">
              Daily Oracle
            </p>
            <p className="text-xs font-quicksand text-foreground/60">
              tap to draw your card for today
            </p>
          </div>

          {/* revealed */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-3xl border-2 border-primary/50 bg-gradient-to-br from-card/80 to-secondary/20 p-5 text-center backdrop-blur-sm [transform:rotateY(180deg)] [backface-visibility:hidden]">
            <span className="text-3xl" aria-hidden="true">
              {card.glyph}
            </span>
            <p className="font-fredoka text-sm font-semibold text-primary glow-text">{card.name}</p>
            <p className="text-xs font-quicksand leading-snug text-foreground/80">{card.message}</p>
          </div>
        </motion.div>
      </button>
    </div>
  );
}

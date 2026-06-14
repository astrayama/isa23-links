"use client";

import { useEffect, useRef, useState } from "react";
import { Palette, Volume2, VolumeX, Sparkles, X } from "lucide-react";
import { MOODS, useMood } from "./theme-provider";
import { cn } from "@/lib/utils";

/* ----------------------------- ambient sound ----------------------------- */
// A soft, evolving cosmic drone synthesized with the Web Audio API — no audio
// file required. Starts muted; the toggle is the user gesture that unlocks it.
function useAmbientSound() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ master: GainNode; oscs: OscillatorNode[]; lfo: OscillatorNode } | null>(
    null,
  );

  const stop = () => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (ctx && nodes) {
      const now = ctx.currentTime;
      nodes.master.gain.cancelScheduledValues(now);
      nodes.master.gain.setValueAtTime(nodes.master.gain.value, now);
      nodes.master.gain.linearRampToValueAtTime(0, now + 1.2);
      window.setTimeout(() => {
        nodes.oscs.forEach((o) => o.stop());
        nodes.lfo.stop();
        ctx.close().catch(() => {});
        ctxRef.current = null;
        nodesRef.current = null;
      }, 1300);
    }
    setOn(false);
  };

  const start = () => {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    // a gentle, open chord (A2 · E3 · A3 · C#4)
    const freqs = [110, 164.81, 220, 277.18];
    const oscs = freqs.map((f, i) => {
      const osc = ctx.createOscillator();
      osc.type = i % 2 === 0 ? "sine" : "triangle";
      osc.frequency.value = f;
      osc.detune.value = (i - 1.5) * 4;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.5 : 0.28 / i;
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900;
      osc.connect(g).connect(lp).connect(master);
      osc.start();
      return osc;
    });

    // slow breathing tremolo
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain).connect(master.gain);
    lfo.start();

    master.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 3);

    ctxRef.current = ctx;
    nodesRef.current = { master, oscs, lfo };
    setOn(true);
  };

  useEffect(() => {
    return () => {
      nodesRef.current?.oscs.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* noop */
        }
      });
      ctxRef.current?.close().catch(() => {});
    };
  }, []);

  return { on, toggle: () => (on ? stop() : start()) };
}

/* ------------------------------ control dock ------------------------------ */
export function ControlDock() {
  const { mood, setMood } = useMood();
  const [open, setOpen] = useState(false);
  const ambient = useAmbientSound();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 font-quicksand">
      {open && (
        <div className="animate-scale-in origin-bottom-right rounded-3xl border-2 border-primary/30 bg-card/80 p-4 shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between gap-6">
            <span className="text-xs font-fredoka font-medium text-foreground/80">Sky mood</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close controls"
              className="text-foreground/50 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mb-4 flex gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMood(m.id)}
                aria-label={`${m.label} mood`}
                aria-pressed={mood === m.id}
                title={m.label}
                className={cn(
                  "h-8 w-8 rounded-full border-2 transition-all hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
                  mood === m.id ? "border-foreground scale-110" : "border-white/20",
                )}
                style={{ background: m.swatch }}
              />
            ))}
          </div>
          <button
            onClick={ambient.toggle}
            aria-pressed={ambient.on}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-primary/30 bg-primary/15 px-3 py-2 text-xs font-fredoka text-foreground/90 transition-colors hover:bg-primary/30"
          >
            {ambient.on ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-primary" />}
            {ambient.on ? "Ambience on" : "Play ambience"}
          </button>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open mood & ambience controls"
        aria-expanded={open}
        className="group relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary/40 bg-card/70 text-primary shadow-xl backdrop-blur-md transition-all hover:scale-105 hover:border-primary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {ambient.on && (
          <span className="absolute inset-0 rounded-full pulse-glow" aria-hidden="true" />
        )}
        {open ? <Palette className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </button>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { MOODS, useMood } from "./theme-provider";
import { SegmentedControl } from "./prism/segmented-control";
import { Glyph } from "./prism/glyph";

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

/** The Dawn/Dusk switch and the ambience toggle, side by side under the lists. */
export function PageSettings() {
  const { mood, setMood } = useMood();
  const ambient = useAmbientSound();

  return (
    <div className="pg-settings">
      <SegmentedControl
        label="Theme"
        options={MOODS.map((m) => ({ value: m.id, label: m.label }))}
        value={mood}
        onChange={setMood}
      />
      <button
        type="button"
        onClick={ambient.toggle}
        aria-pressed={ambient.on}
        className="pg-btn pg-press pg-glass pg-glass--thin pg-ambience"
      >
        {ambient.on ? (
          <span className="pg-island__wave" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <Glyph name="note" />
        )}
        Ambience
      </button>
    </div>
  );
}

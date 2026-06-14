interface SparkleProps {
  delay?: number;
  size?: number;
  left?: string;
  top?: string;
}

export function Sparkle({ delay = 0, size = 4, left = "50%", top = "50%" }: SparkleProps) {
  return (
    <div
      className="absolute sparkle pointer-events-none"
      style={{ left, top, width: `${size}px`, height: `${size}px`, animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      <div className="w-full h-full bg-highlight rounded-full blur-[1px]" />
    </div>
  );
}

// Deterministic positions so server + client markup match (no hydration mismatch).
const FIELD = [
  { delay: 0, size: 6, left: "10%", top: "15%" },
  { delay: 0.5, size: 4, left: "85%", top: "20%" },
  { delay: 1, size: 5, left: "15%", top: "60%" },
  { delay: 1.5, size: 7, left: "90%", top: "70%" },
  { delay: 2, size: 4, left: "50%", top: "10%" },
  { delay: 2.5, size: 6, left: "25%", top: "85%" },
  { delay: 3, size: 5, left: "75%", top: "40%" },
  { delay: 1.2, size: 3, left: "40%", top: "30%" },
  { delay: 2.2, size: 5, left: "60%", top: "80%" },
  { delay: 0.8, size: 4, left: "5%", top: "45%" },
];

export function SparkleField() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
      {FIELD.map((s, i) => (
        <Sparkle key={i} {...s} />
      ))}
    </div>
  );
}

import { ImageResponse } from "next/og";

export const alt = "isa23 — where spirituality, science, and story collide";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #2a1d4d 0%, #4a2d63 45%, #6b3a73 70%, #9a5a9e 100%)",
          color: "#fbeefb",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontWeight: 700,
            letterSpacing: "0.05em",
            textShadow: "0 0 60px rgba(245,180,230,0.7)",
          }}
        >
          0 = 1 = ∞
        </div>
        <div style={{ fontSize: 52, fontWeight: 600, marginTop: 12 }}>isa23</div>
        <div style={{ fontSize: 30, opacity: 0.85, marginTop: 16 }}>
          where spirituality, science &amp; story collide
        </div>
      </div>
    ),
    { ...size },
  );
}

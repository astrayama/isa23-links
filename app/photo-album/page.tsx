import type { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";
import { BackLink } from "@/components/back-link";
import { PhotoGallery } from "@/components/photo-gallery";

export const metadata: Metadata = {
  title: "Photo Album — photography by isa23",
  description:
    "A photography album by isa23: sky canvases and arbitrary captures from everyday wandering.",
  alternates: { canonical: "/photo-album" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Photo Album by isa23",
};

export default function PhotoAlbumPage() {
  return (
    <main className="relative z-10 min-h-screen px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-6xl space-y-10 animate-fade-in">
        <div className="flex items-center gap-4">
          <BackLink label="" />
          <div className="flex items-center gap-3">
            <ImageIcon className="h-8 w-8 text-primary" />
            <h1 className="font-fredoka text-4xl font-bold text-foreground glow-text md:text-5xl">
              Photo Album
            </h1>
          </div>
        </div>
        <PhotoGallery />
      </div>
    </main>
  );
}

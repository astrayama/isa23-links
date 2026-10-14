import type { Metadata } from "next";
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
    <main className="pg-page pg-page--wide">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BackLink />
      <header className="pg-page-head pg-launch">
        <p className="eyebrow text-accent">Photography</p>
        <h1 className="large-title">Photo Album</h1>
      </header>
      <PhotoGallery />
    </main>
  );
}

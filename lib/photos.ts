// Photo album data. Captions are editable placeholders — swap in your own.

export type Photo = { src: string; caption: string; alt: string; width: number; height: number };

export type PhotoCollection = {
  id: string;
  title: string;
  subtitle: string;
  accent: "primary" | "secondary";
  photos: Photo[];
};

export const collections: PhotoCollection[] = [
  {
    id: "sky",
    title: "the sky is my canvas.",
    subtitle: "skies I stopped for, because they refused to be ignored",
    accent: "primary",
    photos: [
      { src: "/img/sky1.jpeg", caption: "cotton-candy hour", alt: "Pastel sky at dusk", width: 864, height: 1920 },
      { src: "/img/sky2.jpeg", caption: "the light got generous", alt: "Glowing clouds", width: 1824, height: 1368 },
      { src: "/img/sky3.jpeg", caption: "a quiet kind of gold", alt: "Golden sky", width: 1920, height: 961 },
      { src: "/img/sky4.jpeg", caption: "before the stars arrived", alt: "Twilight sky", width: 864, height: 1920 },
    ],
  },
  {
    id: "arbitrarily",
    title: "arbitrarily.",
    subtitle: "small things that asked to be remembered",
    accent: "secondary",
    photos: [
      { src: "/img/arbitrarily1.jpeg", caption: "found, not arranged", alt: "Arbitrary capture", width: 1440, height: 1920 },
      { src: "/img/arbitrarily2.jpeg", caption: "a moment, off-guard", alt: "Arbitrary capture", width: 1440, height: 1920 },
    ],
  },
];

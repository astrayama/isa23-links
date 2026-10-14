import type { GlyphName, IconColor } from "@/components/prism/glyph";

export type AppTag =
  | "journaling"
  | "mood"
  | "tarot"
  | "goals"
  | "neurodiversity"
  | "forecasting"
  | "writing";

export type AppEntry = {
  slug: string;
  name: string;
  descriptor: string; // short "category" shown next to the name
  blurb: string; // what it's for / the problem it solves
  href?: string;
  links?: { label: string; href: string }[];
  // the app icon: a Prism Glass glyph on a coloured tile
  glyph: GlyphName;
  color: IconColor;
  tags: AppTag[];
  // optional real preview image in /public/img
  image?: string;
};

export const appTags: { id: AppTag; label: string }[] = [
  { id: "journaling", label: "Journaling" },
  { id: "mood", label: "Mood" },
  { id: "tarot", label: "Tarot" },
  { id: "goals", label: "Goals" },
  { id: "neurodiversity", label: "Neurodiversity" },
  { id: "forecasting", label: "Forecasting" },
  { id: "writing", label: "Writing" },
];

export const apps: AppEntry[] = [
  {
    slug: "yggdrasil",
    name: "Yggdrasil",
    descriptor: "insightful journaling",
    blurb:
      "Journaling that reflects your entries back to you — surfacing the patterns and roots beneath what you write.",
    href: "https://yggdrasil-dev-168739896450.us-central1.run.app",
    glyph: "tree",
    color: "mint",
    tags: ["journaling"],
    image: "/img/yggi-preview.png",
  },
  {
    slug: "anicca",
    name: "Anicca",
    descriptor: "mood & energy tracking",
    blurb:
      "Track how your mood and energy shift through the day, and start to notice what quietly moves them.",
    href: "https://anicca.lovable.app/",
    glyph: "sparkles",
    color: "sky",
    tags: ["mood", "journaling"],
  },
  {
    slug: "arcana",
    name: "Arcana",
    descriptor: "tarot & astrology app",
    blurb:
      "A gorgeous, atmospheric tarot and astrology app to track your daily cosmic energy and personal spreads.",
    links: [
      { label: "Download", href: "https://testflight.apple.com/join/FZTcG7YT" },
      { label: "More Info", href: "https://screenseiji.vercel.app/apps/arcana" },
    ],
    glyph: "moon",
    color: "violet",
    tags: ["tarot", "journaling"],
  },
  {
    slug: "predict-the-edge",
    name: "Predict the Edge",
    descriptor: "future forecast",
    blurb:
      "Sharpen your intuition by forecasting what's coming and scoring yourself against how it actually plays out.",
    href: "https://predict-the-edge.lovable.app/",
    glyph: "trend",
    color: "indigo",
    tags: ["forecasting"],
  },
  {
    slug: "spoonful-steps",
    name: "Spoonful Steps",
    descriptor: "neurodiverse task management",
    blurb:
      "Gentle, spoon-aware task management built for neurodivergent minds — momentum without the burnout.",
    href: "https://spoonful-steps.lovable.app/",
    glyph: "checklist",
    color: "pink",
    tags: ["neurodiversity", "goals"],
  },
  {
    slug: "life-architecture-labs",
    name: "The Architecture of Life",
    descriptor: "my future book",
    blurb:
      "The companion lab for the book — reimagining society through the seven chakras as a map for change.",
    href: "https://life-architecture-labs.lovable.app/",
    glyph: "book",
    color: "peach",
    tags: ["writing"],
  },
];

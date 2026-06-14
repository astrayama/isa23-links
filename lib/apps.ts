import {
  BookOpen,
  Sparkles,
  Target,
  Moon,
  TrendingUp,
  ListChecks,
  BookText,
  type LucideIcon,
} from "lucide-react";

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
  href: string;
  icon: LucideIcon;
  tags: AppTag[];
  // a CSS gradient (using hsl theme tokens) used as the card's art
  gradient: string;
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
    href: "https://yggdrasil-journal.lovable.app/",
    icon: BookOpen,
    tags: ["journaling"],
    gradient: "linear-gradient(135deg, hsl(140 50% 30% / 0.55), hsl(270 60% 35% / 0.55))",
    image: "/img/yggi-preview.png",
  },
  {
    slug: "anicca",
    name: "Anicca",
    descriptor: "mood & energy tracking",
    blurb:
      "Track how your mood and energy shift through the day, and start to notice what quietly moves them.",
    href: "https://anicca.lovable.app/",
    icon: Sparkles,
    tags: ["mood", "journaling"],
    gradient: "linear-gradient(135deg, hsl(200 70% 45% / 0.55), hsl(330 70% 45% / 0.55))",
  },
  {
    slug: "equilibrium",
    name: "Equilibrium",
    descriptor: "balance your goals",
    blurb:
      "Hold your competing goals in view at once so no single part of your life quietly gets neglected.",
    href: "https://my-equilibrium.lovable.app/",
    icon: Target,
    tags: ["goals"],
    gradient: "linear-gradient(135deg, hsl(50 80% 50% / 0.5), hsl(200 70% 45% / 0.55))",
  },
  {
    slug: "mystic-ledger",
    name: "Mystic Ledger",
    descriptor: "tarot journal",
    blurb:
      "A tarot journal for logging your spreads and watching the story your cards tell unfold over time.",
    href: "https://mystic-ledger.lovable.app/",
    icon: Moon,
    tags: ["tarot", "journaling"],
    gradient: "linear-gradient(135deg, hsl(265 60% 35% / 0.6), hsl(315 65% 40% / 0.55))",
  },
  {
    slug: "predict-the-edge",
    name: "Predict the Edge",
    descriptor: "future forecast",
    blurb:
      "Sharpen your intuition by forecasting what's coming and scoring yourself against how it actually plays out.",
    href: "https://predict-the-edge.lovable.app/",
    icon: TrendingUp,
    tags: ["forecasting"],
    gradient: "linear-gradient(135deg, hsl(230 70% 40% / 0.6), hsl(190 75% 45% / 0.5))",
  },
  {
    slug: "spoonful-steps",
    name: "Spoonful Steps",
    descriptor: "neurodiverse task management",
    blurb:
      "Gentle, spoon-aware task management built for neurodivergent minds — momentum without the burnout.",
    href: "https://spoonful-steps.lovable.app/",
    icon: ListChecks,
    tags: ["neurodiversity", "goals"],
    gradient: "linear-gradient(135deg, hsl(330 70% 45% / 0.55), hsl(50 80% 50% / 0.45))",
  },
  {
    slug: "life-architecture-labs",
    name: "The Architecture of Life",
    descriptor: "my future book",
    blurb:
      "The companion lab for the book — reimagining society through the seven chakras as a map for change.",
    href: "https://life-architecture-labs.lovable.app/",
    icon: BookText,
    tags: ["writing"],
    gradient: "linear-gradient(135deg, hsl(270 60% 35% / 0.6), hsl(330 70% 45% / 0.5))",
  },
];

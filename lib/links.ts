import type { ComponentType } from "react";
import {
  ShoppingBag,
  Code2,
  Image as ImageIcon,
  BookText,
  Folder,
  Globe,
  Podcast as PodcastIcon,
} from "lucide-react";
import {
  YoutubeIcon,
  InstagramIcon,
  TiktokIcon,
  SpotifyIcon,
} from "@/components/brand-icons";
import { site } from "./site";

// Works for both lucide icons and our custom brand SVGs.
export type IconType = ComponentType<{ className?: string }>;

export type PrimaryLink = {
  label: string;
  href: string;
  icon: IconType;
  external?: boolean;
  description?: string;
};

export const primaryLinks: PrimaryLink[] = [
  {
    label: "Online Store",
    href: site.store,
    icon: ShoppingBag,
    external: true,
    description: "Screen Seiji shop",
  },
  { label: "Software", href: "/software", icon: Code2, description: "Apps for mind, mood & meaning" },
  {
    label: "Photography Album",
    href: "/photo-album",
    icon: ImageIcon,
    description: "The sky is my canvas",
  },
  {
    label: "The Book I'm Writing",
    href: "/unpublished-book",
    icon: BookText,
    description: "The Architecture of Life",
  },
];

export type LockedLink = { key: string; label: string; icon: IconType; hint: string };
export const lockedLinks: LockedLink[] = [
  { key: "instagram", label: "Personal Instagram", icon: InstagramIcon, hint: "my private account" },
  { key: "projects", label: "Projects", icon: Folder, hint: "hackathons & devpost" },
  { key: "personal-website", label: "Personal Website", icon: Globe, hint: "portfolio" },
];

export type Pill = { label: string; href: string; icon: IconType };

export const screenSagePills: Pill[] = [
  { label: "YouTube", href: site.screenSage.youtube, icon: YoutubeIcon },
  { label: "TikTok", href: site.screenSage.tiktok, icon: TiktokIcon },
  { label: "Instagram", href: site.screenSage.instagram, icon: InstagramIcon },
  { label: "Website", href: site.screenSage.website, icon: Globe },
];

export const podcastPills: Pill[] = [
  { label: "Spotify", href: site.podcast.spotify, icon: SpotifyIcon },
  { label: "Apple", href: site.podcast.apple, icon: PodcastIcon },
  { label: "YouTube", href: site.podcast.youtube, icon: YoutubeIcon },
];

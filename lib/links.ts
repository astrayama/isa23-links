import type { GlyphName, IconColor } from "@/components/prism/glyph";
import type { AppIconProps } from "@/components/prism/apps";
import { site } from "./site";

// Prism Glass names platforms in words and gives every link a generic glyph on
// a coloured tile; no platform logos.
export type GlyphLink = {
  label: string;
  href: string;
  glyph: GlyphName;
  color: IconColor;
  external?: boolean;
  description?: string;
};

export const primaryLinks: GlyphLink[] = [
  { label: "Software", href: "/software", glyph: "sparkles", color: "violet", description: "Apps for mind, mood & meaning" },
  { label: "Photography Album", href: "/photo-album", glyph: "photo", color: "sky", description: "The sky is my canvas" },
  { label: "The Book I'm Writing", href: "/unpublished-book", glyph: "book", color: "peach", description: "The Architecture of Life" },
  { label: site.equation, href: "/equation", glyph: "infinity", color: "indigo", description: "tap to read the essay" },
];

export type LockedLink = { key: string; label: string; glyph: GlyphName; color: IconColor; hint: string };
export const lockedLinks: LockedLink[] = [
  { key: "instagram", label: "Personal Instagram", glyph: "camera", color: "pink", hint: "my private account" },
  { key: "projects", label: "Projects", glyph: "sparkles", color: "indigo", hint: "hackathons & devpost" },
  { key: "personal-website", label: "Personal Website", glyph: "globe", color: "sky", hint: "portfolio" },
];

/** The Screen Sage app shelf: socials, support, the shop and this site's own pages. */
export const screenSageApps: AppIconProps[] = [
  { label: "Website", href: site.screenSage.website, glyph: "globe", color: "sky", external: true },
  { label: "YouTube", href: site.screenSage.youtube, glyph: "play", color: "pink", external: true },
  { label: "TikTok", href: site.screenSage.tiktok, glyph: "note", color: "indigo", external: true },
  { label: "Instagram", href: site.screenSage.instagram, glyph: "camera", color: "peach", external: true },
  { label: "Ko-fi", href: "https://ko-fi.com/screenseiji", glyph: "cup", color: "mint", external: true },
  // The shop is moving to Shopify; until it opens, Shop shows a "coming soon" sheet.
  { label: "Shop", glyph: "bag", color: "violet", sheet: { name: "shop" } },
  { label: "Software", href: "/software", glyph: "sparkles", color: "indigo" },
  { label: "Photos", href: "/photo-album", glyph: "photo", color: "sky" },
];

export type Pill = { label: string; href: string };

export const podcastPills: Pill[] = [
  { label: "Spotify", href: site.podcast.spotify },
  { label: "Apple", href: site.podcast.apple },
  { label: "YouTube", href: site.podcast.youtube },
];

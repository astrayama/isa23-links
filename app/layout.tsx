import type { Metadata } from "next";
import { Figtree, Fraunces, Nunito, Playpen_Sans } from "next/font/google";
// prism.css first so Tailwind utilities (in globals.css) can adjust glass components.
import "./prism.css";
import "./globals.css";
import { site } from "@/lib/site";
import { getDiscordProfile } from "@/lib/discord";
import { ThemeProvider, themeInitScript } from "@/components/theme-provider";
import { CosmicBackground } from "@/components/cosmic-background";
import { PresenceProvider } from "@/components/prism/presence";
import { DynamicIsland } from "@/components/prism/dynamic-island";
import { GlassLight } from "@/components/prism/glass-light";
import { SheetsProvider } from "@/components/sheets";
import { SiteDock } from "@/components/site-dock";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

// Prism Glass type: SF Pro / SF Pro Rounded / New York on Apple devices,
// these Google fonts everywhere else (see the font stacks in globals.css).
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], style: "italic", variable: "--font-fraunces", display: "swap" });
// Discord display-name font ("Monkey Bars") used by the Discord card.
const playpen = Playpen_Sans({ subsets: ["latin"], variable: "--font-playpen", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "isa23's link hub — spirituality, science & story",
    template: "%s · isa23",
  },
  description:
    "Link hub for isa23 (Screen Sage, Omniversal Seeker): podcast, software, photography, book, and social profiles. Where spirituality, science, and story collide.",
  keywords: ["isa23", "Screen Sage", "Omniversal Seeker", "Seeker's Soliloquy"],
  authors: [{ name: "isa23" }],
  openGraph: {
    type: "website",
    title: "isa23's link hub",
    description:
      "Where spirituality, science, and story collide. Podcast, software, photography, and more.",
    url: site.url,
    siteName: "isa23",
  },
  twitter: {
    card: "summary_large_image",
    title: "isa23's link hub",
    description: "Where spirituality, science, and story collide.",
  },
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // Cached for an hour; the home page reads the same profile.
  const profile = await getDiscordProfile();

  return (
    <html
      lang="en"
      className={`${figtree.variable} ${nunito.variable} ${fraunces.variable} ${playpen.variable}`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <ThemeProvider>
          <PresenceProvider userId={site.discord.userId}>
            <SheetsProvider>
              <CosmicBackground />
              <DynamicIsland
                name={site.name}
                avatar={profile.avatar.still}
                messageHref={site.discord.profile}
                joinHref={site.discord.invite}
              />
              {children}
              <SiteDock />
              <Toaster />
              <GlassLight />
            </SheetsProvider>
          </PresenceProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

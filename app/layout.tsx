import type { Metadata } from "next";
import { Quicksand, Fredoka } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CosmicBackground } from "@/components/cosmic-background";
import { StickyHeader } from "@/components/sticky-header";
import { ControlDock } from "@/components/control-dock";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});
const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

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

const themeInit = `(function(){try{var m=localStorage.getItem('isa-mood');if(m){document.documentElement.setAttribute('data-theme',m);}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dawn" className={`${quicksand.variable} ${fredoka.variable}`} suppressHydrationWarning>
      <body className="min-h-screen font-quicksand antialiased" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            <CosmicBackground />
            <StickyHeader />
            {children}
            <ControlDock />
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

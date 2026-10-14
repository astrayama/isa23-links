import { site } from "@/lib/site";
import { Dock } from "./prism/apps";

/** The dock on every page: listen, Discord, get in touch, shop. */
export function SiteDock() {
  return (
    <Dock
      apps={[
        { label: "Podcast", glyph: "mic", color: "violet", sheet: { name: "podcast" } },
        { label: "Discord", glyph: "chat", color: "indigo", href: site.discord.invite, external: true },
        { label: "Contact", glyph: "mail", color: "sky", sheet: { name: "contact" } },
        { label: "Shop", glyph: "bag", color: "pink", sheet: { name: "shop" } },
      ]}
    />
  );
}

"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { site } from "@/lib/site";
import { Sheet } from "./prism/sheet";
import { ContactForm } from "./contact-form";
import { JourneyForm } from "./journey-form";
import { AccessActions } from "./access-actions";
import { Button } from "./prism/glass";

// Every bottom sheet on the site, opened from rows, widgets and the dock.
export type SheetRequest =
  | { name: "podcast" }
  | { name: "contact"; purpose?: string }
  | { name: "journey" }
  | { name: "shop" }
  | { name: "access"; link: { key: string; label: string } };

type SheetsCtx = { open: (req: SheetRequest) => void; close: () => void };
const SheetsContext = createContext<SheetsCtx | null>(null);

export function useSheets() {
  const ctx = useContext(SheetsContext);
  if (!ctx) throw new Error("useSheets must be used within SheetsProvider");
  return ctx;
}

export function SheetsProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<SheetRequest["name"] | null>(null);
  // Kept after closing so a sheet's content stays put while it slides away.
  const [accessLink, setAccessLink] = useState({ key: "", label: "" });
  const [purpose, setPurpose] = useState<string | undefined>();

  const open = useCallback((req: SheetRequest) => {
    if (req.name === "access") setAccessLink(req.link);
    if (req.name === "contact") setPurpose(req.purpose);
    setCurrent(req.name);
  }, []);
  const close = useCallback(() => setCurrent(null), []);
  const ctx = useMemo(() => ({ open, close }), [open, close]);
  const onOpenChange = (isOpen: boolean) => !isOpen && close();

  return (
    <SheetsContext.Provider value={ctx}>
      {children}

      <Sheet
        open={current === "podcast"}
        onOpenChange={onOpenChange}
        title={site.podcast.name}
        text="latest episodes"
      >
        <iframe
          title={`${site.podcast.name} on Spotify`}
          src={`https://open.spotify.com/embed/show/${site.podcast.spotifyShowId}?utm_source=generator&theme=0`}
          width="100%"
          height={352}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="block rounded-sm border-0 shadow-[var(--shadow-icon)]"
        />
      </Sheet>

      <Sheet
        open={current === "contact"}
        onOpenChange={onOpenChange}
        title="Contact"
        text="say hello, collaborate, or ask for access"
      >
        <ContactForm purpose={purpose} onSent={close} />
      </Sheet>

      <Sheet
        open={current === "journey"}
        onOpenChange={onOpenChange}
        title="Join the journey"
        text="Occasional dispatches from the seeker: new episodes, software, and stray thoughts on science & spirit."
      >
        <JourneyForm />
      </Sheet>

      <Sheet
        open={current === "shop"}
        onOpenChange={onOpenChange}
        title="Coming soon on Shopify"
        text="The Screen Sage shop is moving to Shopify. Join the journey to hear when it opens."
      >
        <div className="pg-sheet__actions">
          <Button variant="filled" icon="send" onClick={() => open({ name: "journey" })}>
            Get notified
          </Button>
          <Button onClick={close}>Not now</Button>
        </div>
      </Sheet>

      <Sheet
        open={current === "access"}
        onOpenChange={onOpenChange}
        title="Ask for access"
        text="Some links are locked for privacy and safety. Feel free to ask me for access!"
      >
        <AccessActions
          link={accessLink}
          onEmail={() => open({ name: "contact", purpose: "access" })}
          onClose={close}
        />
      </Sheet>
    </SheetsContext.Provider>
  );
}

/** A button that opens one of the sheets; styled entirely by its caller. */
export function SheetTrigger({
  sheet,
  className,
  ariaLabel,
  children,
}: {
  sheet: SheetRequest;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const { open } = useSheets();
  return (
    <button type="button" className={className} aria-label={ariaLabel} onClick={() => open(sheet)}>
      {children}
    </button>
  );
}

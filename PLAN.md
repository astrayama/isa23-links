# Plan: `isa23-links` — Next.js rebuild of the link hub

## Context

Isa (isa23 / Screen Sage / Omniversal Seeker) has a link hub live at `isa23.lovable.app`, currently a **Vite + React + shadcn/ui + Tailwind + Supabase** app (source extracted to `/tmp/isa23-extract`). It's a single-column "cosmic pastel" hub linking her podcast, software, book, photography, store, and socials, with passcode-locked private links and a contact form.

This rebuilds it as a **self-contained Next.js (App Router) app** in `/Users/isa/isa23-links` — keeping the brand and content, but with real improvements to **flow/layout, interactivity, and content**, plus tailored new features. No Supabase: the contact form and passcode unlock become Next.js Route Handlers; app previews become static images.

> Folder note: I read `/isa23-links` as `~/isa23-links` → **`/Users/isa/isa23-links`** (creating a literal root-level `/isa23-links` would need sudo and isn't intended). Say the word if you actually want it elsewhere.

---

## Stack

- **Next.js 15** (App Router, TypeScript) + **React 18**
- **Tailwind CSS v3** + **shadcn/ui** (port only the primitives actually used) — keeps fidelity with the original design tokens
- **lucide-react** (icons, already used), **framer-motion** (equation morph + smooth transitions), **zod** (contact validation)
- **next/font** for Fredoka (display) + Quicksand (body); **next/image** for all images
- Backend = **Next.js Route Handlers** only. Email via **Resend** (key provided, stored in gitignored `.env.local` + Vercel env vars — never committed).
- **Deploy target: Vercel.**

---

## Design system (ported 1:1, then extended)

- Port the HSL cosmic palette + `--glow-*` / `--shadow-*` vars from `src/index.css` into `app/globals.css`.
- Port `tailwind.config.ts` extend: `quicksand`/`fredoka` fonts, the color tokens, and `float` / `sparkle` / `pulse-glow` keyframes + `glow-text` / `glow-border` utilities.
- **Add `prefers-reduced-motion` guards** so float/sparkle/glow/pulse animations respect accessibility settings (the original ignores this).
- Copy all assets from `src/assets/` (cosmic bg, avatar, podcast covers, screen-sage avatar, sky1–4, arbitrarily1–2, app previews) + favicon.

---

## Pages (App Router routes)

| Route | Source | What changes |
|---|---|---|
| `/` | `Index.tsx` | Faithful hub, restructured (see "Home" below) + new interactive elements |
| `/equation` | `EquationExplanation.tsx` | Same essay, upgraded into an animated reading experience |
| `/software` | `Software.tsx` | Flat grid → filterable, tagged **app gallery** |
| `/photo-album` | `PhotoAlbum.tsx` | Static grid → masonry + **lightbox** |
| `/unpublished-book` | `UnpublishedBook.tsx` | Faithful, polished typography + animated entrance |
| `not-found` | `NotFound.tsx` | Themed 404 |

Drop the vestigial `/instagram` and `/projects` placeholder pages — in the live site those are passcode-gated **external** links (open in a new tab after unlock), not real pages.

---

## Improvements to flow / layout / content (baseline polish)

- **Home reflow:** clearer vertical rhythm and grouping — Hero (equation + avatar + bio) → "Featured" row (latest podcast episode + Daily Oracle) → primary links (Store, Software, Photography, Book) → Screen Sage social cluster → locked/private links (clearly sectioned) → Contact → footer. A sticky mini-header (small avatar + name) fades in on scroll for orientation.
- **SEO/sharing:** Next.js Metadata API per route + **dynamic OG images** (`opengraph-image` route) instead of one hardcoded Lovable image; keep the Person/Article/Book JSON-LD.
- **Accessibility:** real focus-visible rings, aria labels, reduced-motion, sufficient contrast on glass cards.
- **Performance:** `next/image` (sizing, lazy below-fold), `next/font`, route-level code splitting.
- **Content fixes:** replace the "Made with love(able)" footer with her own sign-off (tasteful, optional credit); fill the empty "protected area" copy; tidy the locked-links explainer.

---

## Tailored feature suggestions (the "5+")

**Recommended for v1 (I'll build these unless you cut any):**

1. **Daily Oracle card** — a glowing, tappable card on the home page that draws a card from a small hand-authored cosmic/tarot deck (`lib/oracle.ts`), seeded by the date so it's the same all day. Flips with a shimmer to reveal a short message. Ties straight to **Arcana Assistant** + her tarot-reading offering. Pure client-side.
2. **Living `0 = 1 = ∞` hero** — the signature equation becomes the animated anchor: symbols cross-fade/morph `0 ↔ 1 ↔ ∞` with a constellation shimmer (framer-motion, reduced-motion aware); tap still opens the essay. Makes her motif the centerpiece instead of a static title.
3. **Latest podcast episode + "Now" strip** — inline **Spotify embed** of the latest *Seeker's Soliloquy* episode so visitors listen without leaving, plus a small editable "currently seeking / building / reading" strip (`lib/now.ts`, one file to edit).
4. **Software as a filterable app constellation** — replace the 2-col grid with a tagged, filterable gallery (tags: journaling · mood · tarot · goals · neurodiversity · forecasting). Each card expands to show *what it's for / the problem it solves*. Showcases the breadth of her 7 apps.
   - **Content update:** the old "Arcana Assistant" is now **Mystic Ledger** (`https://mystic-ledger.lovable.app/`). Display it as **"Mystic Ledger · tarot journal"** — real current name as the title, descriptor for recognizability.
5. **Chakra / sky "mood" theme switcher** — a subtle control cycling the palette through sky moods (dawn / dusk / night) or the 7 chakra colors, persisted in `localStorage`. Reinforces both "the sky is my canvas" and the chakra book.
6. **Photo album → interactive gallery** — masonry/justified layout + a real lightbox (keyboard nav, captions, swipe), replacing the static grid.
7. **Ambient mode** ✅ *(approved)* — parallax clouds that drift with cursor/scroll + a muted-by-default ambient soundscape toggle, for meditative immersion.
8. **"Join the journey" capture** ✅ *(approved)* — a gentle email signup to unify her scattered audiences; posts to `/api/subscribe` → adds the subscriber to a Resend audience (and/or emails Isa).

**Still optional (say yes and I'll fold it in):**

9. **Command palette (⌘K) "Seeker's Index"** — quick-jump to any link / app / page; fits her multi-project, tech-savvy nature.

---

## Backend (self-contained Route Handlers)

- **`POST /api/contact`** — Zod-validate (reuse the schema shape from `ContactDialog.tsx`), honeypot + simple in-memory rate limit, then **email Isa via Resend** (key provided). Same purposes dropdown (inquiry / collab / job / speaking / tarot / mentorship / other). Falls back to logging if the key is ever missing.
- **`POST /api/subscribe`** — newsletter signup; validates email, then adds the contact to a **Resend audience** (`RESEND_AUDIENCE_ID`) and/or emails Isa a heads-up.
- **`POST /api/unlock`** — server-side passcode→URL map kept out of the client bundle. **Timing-safe compare** + per-IP lockout (port the `timingSafeEqual` + 5-attempt / 15-min lockout logic from `supabase/functions/validate-passcode/index.ts`, using an in-memory store). Returns `{ url }` on success; client opens it in a new tab.
- **Secrets handling:** real values (incl. the **Resend API key**) go in `.env.local` (gitignored) locally and **Vercel env vars** in prod. The committed **`.env.example`** ships only placeholders + docs for: `UNLOCK_PASSCODE`, `LINK_INSTAGRAM`, `LINK_PROJECTS`, `LINK_PERSONAL_SITE`, `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `RESEND_AUDIENCE_ID`. Link defaults = current real URLs (`instagram.com/astrayama`, `devpost.com/isabiiil`, `isabel-abonitalla.vercel.app`).

---

## Components & data

- **Ported/adapted:** `Sparkle`, `LinkButton`, `LinkCard`, `ScrollablePills` (already in `Index.tsx`), `ContactDialog` → `/api/contact`, `PasscodeDialog` → `/api/unlock`, plus the shadcn primitives actually used (button, dialog, input, label, textarea, select, tooltip, sonner/toast, aspect-ratio).
- **New:** `OracleCard`, `EquationHero`, `PodcastEmbed`, `NowStrip`, `AppGallery` + `AppCard`, `Lightbox`, `ThemeSwitcher`, `StickyHeader`.
- **Data files:** `lib/links.ts`, `lib/apps.ts` (tags + blurbs), `lib/oracle.ts`, `lib/now.ts`, `lib/photos.ts` — so content edits don't touch component code.

## Proposed structure

```
isa23-links/
  app/
    layout.tsx              # fonts, metadata, providers, sticky header, theme
    page.tsx                # home
    globals.css             # ported design tokens
    equation/page.tsx
    software/page.tsx
    photo-album/page.tsx
    unpublished-book/page.tsx
    not-found.tsx
    opengraph-image.tsx     # dynamic OG
    api/contact/route.ts
    api/unlock/route.ts
  components/  (ui/ + the components above)
  lib/        (links, apps, oracle, now, photos, utils, rate-limit)
  public/     (assets copied from src/assets + favicon)
  .env.example  README.md  PLAN.md
```

After approval I'll also write `PLAN.md` into the repo so we can follow it step by step.

---

## Verification

1. `npm install` then `npm run dev` → open `http://localhost:3000`; click every link, open Contact + a locked link, draw the Oracle, switch theme, open the Lightbox, filter the app gallery.
2. Test route handlers: submit contact (with and without `RESEND_API_KEY`), unlock with right/wrong passcode (confirm lockout after 5 tries).
3. `npm run build` → confirm a clean production build (no type errors).
4. Check `prefers-reduced-motion` (animations calm) and a mobile viewport.
5. Screenshot key pages via the Preview MCP to confirm the cosmic aesthetic carried over.
6. Send a real test through `/api/contact` + `/api/subscribe` to confirm Resend delivers.

## Deployment (Vercel)

After local verification: initialize git, push, and deploy to **Vercel** (via the Vercel CLI or a GitHub repo). Set env vars in the Vercel dashboard (Resend key, unlock passcode, link targets, audience id). I'll confirm the production URL works end-to-end. *Note: I'll need you to complete the Vercel auth/login step when prompted — I can't log into your Vercel account for you.*

## Out of scope (unless you ask)

The ⌘K command palette (#9 above), wiring a custom email domain in Resend, and authoring final podcast/photo captions — I'll use sensible placeholders you can edit in the `lib/*` data files.

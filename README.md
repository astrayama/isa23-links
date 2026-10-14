# isa23 · link hub

A self-contained **Next.js (App Router)** rebuild of [isa23.lovable.app](https://isa23.lovable.app) — the cosmic-pastel link hub for **isa23** (Screen Sage / Omniversal Seeker). Where spirituality, science, and story collide. 🕉️⚛️💟

## What's inside

Designed in **Prism Glass** ([design system](https://claude.ai/artifact/QAoJXae3nZWo93FC2p8idv)): iOS liquid glass over the clouds wallpaper, with springy motion.

- **Home** — like an iPhone home screen: live Discord presence in a **Dynamic Island**, a profile hero, widgets (podcast, Now, Writing, a flippable **Daily Oracle**), the Screen Sage app shelf, the Discord card, Settings-style lists (Now, Explore, Private, Connect) and a dock. Private links open an "Ask for access" sheet (with a passcode option); the podcast, contact form, newsletter signup and the Shop (coming soon on Shopify) open in bottom sheets.
- **/software** — a filterable, tag-based gallery of the apps (journaling · mood · tarot · goals · neurodiversity · forecasting · writing).
- **/photo-album** — masonry gallery with a keyboard-navigable lightbox.
- **/equation** — the essay behind the equation.
- **/unpublished-book** — *The Architecture of Life*.
- **Dawn / Dusk** (light / dark) follows the device until a visitor picks one, plus an asset-free **ambient soundscape** (Web Audio), both under the lists.

## Tech

Next.js 16 · React 19 · TypeScript · Tailwind CSS v3 · Radix Dialog · framer-motion · Resend · Zod. Fully accessible (focus states, `prefers-reduced-motion`) and SEO-ready (per-route metadata, JSON-LD, dynamic OG image).

## Develop

```bash
npm install
cp .env.example .env.local   # then fill in your values
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Environment variables

See `.env.example`. Summary:

| Var | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Email for the contact form + newsletter (https://resend.com) |
| `CONTACT_TO_EMAIL` | Where contact messages are delivered |
| `RESEND_AUDIENCE_ID` | _(optional)_ Resend Audience to collect subscribers |
| `CONTACT_FROM` | _(optional)_ verified sender address |
| `UNLOCK_PASSCODE` | Passcode that unlocks the private links — **change this** |
| `LINK_INSTAGRAM` / `LINK_PROJECTS` / `LINK_PERSONAL_SITE` | Targets for the gated links (kept server-side) |
| `GITHUB_TOKEN` | _(optional)_ lifts GitHub's rate limit for the "As of" date lookup |

`.env.local` is gitignored. On Vercel, set these in **Project → Settings → Environment Variables**.

## Editing content

Almost everything lives in `lib/` so you rarely touch components:

- `lib/site.ts` — name, tagline, podcast, social URLs
- `lib/links.ts` — Explore, Private and Screen Sage shelf links (each with a glyph and tile colour)
- `lib/apps.ts` — the software gallery (names, blurbs, tags)
- `lib/oracle.ts` — the Daily Oracle deck
- `lib/now.ts` — the Writing widget and the Watching / Seeking rows. Their "As of" date is this file's last commit, read from GitHub (`lib/now-updated.ts`), so there's no date to edit. The quests above them come live from screenseiji's side quests file.
- `lib/photos.ts` — photo album collections + captions

## Notes

- Prism Glass names platforms in words and uses generic glyphs (`components/prism/glyph.tsx`), so there are no brand logos.
- Glass components live in `components/prism/` and `app/prism.css`; the tokens (colours, type, radii) are in `app/globals.css`.
- Discord presence (the island, hero dot and Discord card) is live from Lanyard's WebSocket, so status and platforms (desktop, web, mobile, VR, console) change the moment Discord reports them; it falls back to polling the REST API if the socket drops. Profile art and server counts come from Discord's public invite endpoint, cached for an hour.
- The passcode unlock uses a timing-safe compare with per-IP lockout (`lib/rate-limit.ts`). The target URLs never reach the client bundle.

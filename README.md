# isa23 · link hub

A self-contained **Next.js (App Router)** rebuild of [isa23.lovable.app](https://isa23.lovable.app) — the cosmic-pastel link hub for **isa23** (Screen Sage / Omniversal Seeker). Where spirituality, science, and story collide. 🕉️⚛️💟

## What's inside

- **Home** — animated `0 = 1 = ∞` hero, profile, latest podcast embed, a **Daily Oracle** card draw, a "Now" strip, the Screen Sage social cluster, primary + passcode-locked links, contact, and a newsletter signup.
- **/software** — a filterable, tag-based gallery of the apps (journaling · mood · tarot · goals · neurodiversity · forecasting · writing).
- **/photo-album** — masonry gallery with a keyboard-navigable lightbox.
- **/equation** — the essay behind the equation, with scroll reveals.
- **/unpublished-book** — *The Architecture of Life*.
- **Sky-mood theme switcher** (Dawn / Dusk / Twilight / Cosmos) + an asset-free **ambient soundscape** (Web Audio), both in the floating control dock.

## Tech

Next.js 16 · React 19 · TypeScript · Tailwind CSS v3 · shadcn/ui · framer-motion · Resend · Zod. Fully accessible (focus states, `prefers-reduced-motion`) and SEO-ready (per-route metadata, JSON-LD, dynamic OG image).

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

`.env.local` is gitignored. On Vercel, set these in **Project → Settings → Environment Variables**.

## Editing content

Almost everything lives in `lib/` so you rarely touch components:

- `lib/site.ts` — name, tagline, podcast, social URLs
- `lib/links.ts` — primary, locked, and social pill links
- `lib/apps.ts` — the software gallery (names, blurbs, tags)
- `lib/oracle.ts` — the Daily Oracle deck
- `lib/now.ts` — the "Now" strip
- `lib/photos.ts` — photo album collections + captions

## Notes

- lucide removed brand/logo icons, so the social glyphs (YouTube, TikTok, Instagram, Spotify) live in `components/brand-icons.tsx`.
- The passcode unlock uses a timing-safe compare with per-IP lockout (`lib/rate-limit.ts`). The target URLs never reach the client bundle.

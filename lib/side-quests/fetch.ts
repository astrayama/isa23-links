import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { activeByRecency, parseSideQuests, type LogEntry } from "./parse";

// Side quests live in ONE file in the screenseiji repo; this site only reads it.
// Never copy quest text into this repo — edit content/side-quests.md there.
export const SIDE_QUESTS_RAW_URL =
  "https://raw.githubusercontent.com/astrayama/screenseiji/main/content/side-quests.md";
export const SIDE_QUESTS_PAGE_URL = "https://screenseiji.vercel.app/side-quests";
/** The strip stays compact: the most recently logged active quests, then "View all quests →". */
export const MAX_QUESTS = 4;

export type ActiveQuest = {
  title: string;
  color: string;
  link?: string;
  latest?: LogEntry;
};

/**
 * The most recently logged active quests from the shared file, refreshed hourly (ISR).
 *
 * - During `next build` (and in `next dev`) a failure returns null, so nothing
 *   breaks and the strip shows a fallback message. A hung request gives up
 *   after `timeoutMs` instead of stalling the build.
 * - In production at runtime a failure throws: Next.js then keeps serving the
 *   last good page and retries on the next request, instead of caching the fallback.
 */
export async function getActiveQuests({ timeoutMs = 10_000 } = {}): Promise<ActiveQuest[] | null> {
  try {
    const res = await fetch(SIDE_QUESTS_RAW_URL, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new Error(`Fetching side quests failed: ${res.status} ${res.statusText}`);
    const { quests } = parseSideQuests(await res.text());
    return activeByRecency(quests)
      .slice(0, MAX_QUESTS)
      .map(({ title, color, link, latest }) => ({ title, color, link, latest }));
  } catch (err) {
    const building = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
    if (!building && process.env.NODE_ENV === "production") throw err;
    console.warn(`[side-quests] Using the fallback message: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

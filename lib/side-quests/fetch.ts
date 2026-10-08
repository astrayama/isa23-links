import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { parseSideQuests, type LogEntry } from "./parse";

// Side quests live in ONE file in the screenseiji repo; this site only reads it.
// Never copy quest text into this repo — edit content/side-quests.md there.
export const SIDE_QUESTS_RAW_URL =
  "https://raw.githubusercontent.com/astrayama/screenseiji/main/content/side-quests.md";
export const SIDE_QUESTS_PAGE_URL = "https://screenseiji.vercel.app/side-quests";

export type ActiveQuest = {
  title: string;
  color: string;
  link?: string;
  latest?: LogEntry;
};

/**
 * Active quests from the shared file, refreshed hourly (ISR).
 *
 * - During `next build` a failure returns null, so the build never breaks and
 *   the strip shows a fallback message.
 * - At runtime a failure throws: Next.js then keeps serving the last good page
 *   and retries on the next request, instead of caching the fallback.
 */
export async function getActiveQuests(): Promise<ActiveQuest[] | null> {
  try {
    const res = await fetch(SIDE_QUESTS_RAW_URL, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Fetching side quests failed: ${res.status} ${res.statusText}`);
    const { quests } = parseSideQuests(await res.text());
    return quests
      .filter((quest) => quest.status === "active")
      .map(({ title, color, link, latest }) => ({ title, color, link, latest }));
  } catch (err) {
    if (process.env.NEXT_PHASE !== PHASE_PRODUCTION_BUILD) throw err;
    console.warn(`[side-quests] Using the fallback message: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

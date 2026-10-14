import { PHASE_PRODUCTION_BUILD } from "next/constants";

// The "As of" date under the hand-edited Now rows is the date lib/now.ts last
// changed, read from GitHub's commit history so nobody has to type it.
export const NOW_FILE = "lib/now.ts";
export const REPO = "astrayama/isa23-links";
/** Dates are shown as calendar days where Isa lives. */
export const NOW_TIME_ZONE = "America/New_York";

/**
 * The commit to look back from: the deployed one on Vercel (so a new deploy
 * never shows a stale date, and a branch preview shows its own), else main.
 */
export function nowCommitsUrl(sha = process.env.VERCEL_GIT_COMMIT_SHA || "main") {
  const params = new URLSearchParams({ path: NOW_FILE, sha, per_page: "1" });
  return `https://api.github.com/repos/${REPO}/commits?${params}`;
}

/**
 * When lib/now.ts last changed, or null if that couldn't be read.
 *
 * Mirrors getActiveQuests: during `next build` (and in `next dev`) a failure
 * returns null and the date is simply left off; in production at runtime it
 * throws so Next.js keeps serving the last good page and retries later.
 */
export async function getNowUpdated({ timeoutMs = 10_000 } = {}): Promise<Date | null> {
  const pinned = Boolean(process.env.VERCEL_GIT_COMMIT_SHA);
  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    // Optional: lifts GitHub's 60 requests/hour limit for unauthenticated calls.
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(nowCommitsUrl(), {
      headers,
      // History up to a fixed commit never changes; main moves, so recheck it hourly.
      ...(pinned ? { cache: "force-cache" as const } : { next: { revalidate: 3600 } }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) throw new Error(`Fetching ${NOW_FILE} history failed: ${res.status} ${res.statusText}`);
    const commits = (await res.json()) as { commit?: { committer?: { date?: string } } }[];
    const iso = commits[0]?.commit?.committer?.date;
    if (!iso) throw new Error(`No commits found for ${NOW_FILE}`);
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) throw new Error(`Unreadable commit date: ${iso}`);
    return date;
  } catch (err) {
    const building = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;
    if (!building && process.env.NODE_ENV === "production") throw err;
    console.warn(`[now] Leaving the "As of" date off: ${err instanceof Error ? err.message : err}`);
    return null;
  }
}

/** "October 8, 2026" */
export function formatAsOf(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: NOW_TIME_ZONE,
  });
}

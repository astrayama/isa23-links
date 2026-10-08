// A small, editable "currently" snapshot. Update the strings whenever life shifts.
// What I'm *building* isn't here: the Now strip reads it live from the side quests
// file in the screenseiji repo (see lib/side-quests/fetch.ts).

export type NowItem = { label: string; value: string };

// `updated` dates these hand-edited items only (shown under them as "As of …").
export const now: { updated: string; items: NowItem[] } = {
  updated: "September 2026",
  items: [
    { label: "Writing", value: "The Architecture of Life — the heart-chakra chapter" },
    { label: "Watching", value: "Jaadugar | Inept Villainess | Reno 911 | MCU/DCAU" },
    { label: "Seeking", value: "kindred spirits + collaborators"},
  ],
};

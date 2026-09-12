// A small, editable "currently" snapshot. Update the strings whenever life shifts.

export type NowItem = { label: string; value: string };

export const now: { updated: string; items: NowItem[] } = {
  updated: "September 2026",
  items: [
    { label: "Building", value: "Pantheon 👥 | Duality ☯️" },
    { label: "Writing", value: "The Architecture of Life — the heart-chakra chapter" },
    { label: "Watching", value: "Jaadugar | Inept Villainess | Reno 911 | MCU/DCAU shows" },
    { label: "Seeking", value: "kindred spirits + collaborators"},
  ],
};

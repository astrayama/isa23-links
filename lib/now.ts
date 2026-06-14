// A small, editable "currently" snapshot. Update the strings whenever life shifts.

export type NowItem = { label: string; value: string };

export const now: { updated: string; items: NowItem[] } = {
  updated: "June 2026",
  items: [
    { label: "Building", value: "Yggdrasil 🌱 | Anicca ⚡ | Pantheon 👥" },
    { label: "Writing", value: "The Architecture of Life — the heart-chakra chapter" },
    { label: "Watching", value: "Baki | Witch Hat Atelier | Rick & Morty | King of Queens" },
    { label: "Seeking", value: "kindred spirits living at the edge of science & spirit" },
  ],
};

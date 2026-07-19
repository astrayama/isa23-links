// A small, editable "currently" snapshot. Update the strings whenever life shifts.

export type NowItem = { label: string; value: string };

export const now: { updated: string; items: NowItem[] } = {
  updated: "July 2026",
  items: [
    { label: "Building", value: "Yggdrasil 🌱 | Arcana 🃏 | Pantheon 👥" },
    { label: "Writing", value: "The Architecture of Life — the heart-chakra chapter" },
    { label: "Watching", value: "Jaadugar | A ton of other airing anime | Rick & Morty" },
    { label: "Seeking", value: "kindred spirits + collaborators"},
  ],
};

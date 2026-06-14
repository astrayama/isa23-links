// A small, editable "currently" snapshot. Update the strings whenever life shifts.

export type NowItem = { label: string; value: string };

export const now: { updated: string; items: NowItem[] } = {
  updated: "June 2026",
  items: [
    { label: "Building", value: "Spoonful Steps — gentler task flows for spoonie brains" },
    { label: "Writing", value: "The Architecture of Life — the heart-chakra chapter" },
    { label: "Reading", value: "anything where physics and mysticism start to rhyme" },
    { label: "Seeking", value: "kindred spirits living at the edge of science & spirit" },
  ],
};

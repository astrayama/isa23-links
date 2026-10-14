// A small, editable "currently" snapshot. Update the strings whenever life shifts.
// What I'm *building* isn't here: the Now list reads it live from the side quests
// file in the screenseiji repo (see lib/side-quests/fetch.ts).
//
// No date to keep up to date: the home page shows "As of <date>" from this
// file's last commit (see lib/now-updated.ts).

export type NowItem = { label: string; value: string };

export const now: { writing: { title: string; detail: string }; items: NowItem[] } = {
  // The Writing widget on the home page.
  writing: { title: "The Architecture of Life", detail: "heart-chakra chapter" },
  // Listed under the live quests.
  items: [
    { label: "Watching", value: "Jaadugar | Inept Villainess | Reno 911 | MCU/DCAU" },
    { label: "Seeking", value: "kindred spirits + collaborators" },
  ],
};

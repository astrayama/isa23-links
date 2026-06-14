// A small hand-authored "cosmic oracle" deck. The home page draws one card,
// seeded by the date, so everyone sees the same card for a given day.

export type OracleCard = {
  name: string;
  glyph: string;
  message: string;
};

export const oracleDeck: OracleCard[] = [
  {
    name: "The Void",
    glyph: "0",
    message:
      "Before form, there is fertile emptiness. Rest in the not-yet — it is pregnant with everything.",
  },
  {
    name: "Unity",
    glyph: "1",
    message:
      "The separation you feel is a trick of the light. You are one wave in an endless ocean.",
  },
  {
    name: "Infinity",
    glyph: "∞",
    message: "There is no edge to you. What you are seeking is quietly seeking you too.",
  },
  {
    name: "The Seeker",
    glyph: "🧭",
    message: "Today the question matters more than the answer. Stay curious; wander on purpose.",
  },
  {
    name: "Anicca",
    glyph: "🌊",
    message: "This feeling is weather, not climate. Let it move through you and keep moving.",
  },
  {
    name: "The Lotus",
    glyph: "🪷",
    message: "Growth roots in the mud. Don't despise the place you are rising from.",
  },
  {
    name: "The Mirror",
    glyph: "🪞",
    message: "What stings you in others is a letter addressed to you. Read it gently.",
  },
  {
    name: "The Threshold",
    glyph: "🚪",
    message:
      "A door is open that wasn't before. You don't have to know where it leads to step through.",
  },
  {
    name: "Stillness",
    glyph: "🕯️",
    message: "The answer is quiet. Make a little less noise and it will find you.",
  },
  {
    name: "The Architect",
    glyph: "🏛️",
    message: "You may redesign the life you were handed. Start with one small beam.",
  },
  {
    name: "Synchronicity",
    glyph: "✨",
    message: "That 'coincidence' is a nudge. Follow the thread and see where it pulls.",
  },
  {
    name: "The Shadow",
    glyph: "🌑",
    message: "The part of you that you hide has the most to give. Invite it to the table.",
  },
  {
    name: "The Star",
    glyph: "⭐",
    message: "Hope isn't naïve; it's a discipline. Tend it like a small, stubborn flame.",
  },
  {
    name: "Flow",
    glyph: "🌀",
    message: "Stop forcing the river. Aim the boat and let the current carry the rest.",
  },
  {
    name: "The Offering",
    glyph: "🤲",
    message: "Give the thing you most want to receive. It returns to you by a hidden route.",
  },
  {
    name: "Rebirth",
    glyph: "🦋",
    message: "Something is ending so something truer can begin. Let it end well.",
  },
];

// Deterministic day-seed so the card is stable for a calendar day.
export function getDailyCard(date = new Date()): OracleCard {
  const seed =
    date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  return oracleDeck[seed % oracleDeck.length];
}

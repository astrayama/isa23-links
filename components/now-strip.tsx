import { Fragment, type CSSProperties } from "react";
import { now } from "@/lib/now";
import { formatAsOf } from "@/lib/now-updated";
import { SIDE_QUESTS_PAGE_URL, type ActiveQuest } from "@/lib/side-quests/fetch";
import { parseInline } from "@/lib/side-quests/parse";
import { Widget } from "./prism/widget";
import { ListGroup, ListRow } from "./prism/list";
import { Glyph, iconColor, type GlyphName, type IconColor } from "./prism/glyph";

// Quests take the design's palette by position rather than their own colours,
// so every tile keeps enough contrast for its white glyph.
const QUEST_COLORS: { tile: IconColor; dot: string }[] = [
  { tile: "violet", dot: "var(--prism-lavender)" },
  { tile: "pink", dot: "var(--prism-pink)" },
  { tile: "sky", dot: "var(--prism-sky)" },
  { tile: "mint", dot: "var(--prism-mint)" },
];
const questColor = (i: number) => QUEST_COLORS[i % QUEST_COLORS.length];

// Presentation only (the quests themselves live in screenseiji's side-quests.md);
// any quest not named here gets sparkles.
const QUEST_GLYPHS: Record<string, GlyphName> = { "Carta Luna": "moon", Heed: "wand" };

const questCount = (n: number) => `${n} ${n === 1 ? "quest" : "quests"}`;

/** Small widget: how many quests are active, with a dot for each. Jumps to the Now list. */
export function NowWidget({ i, quests }: { i?: number; quests: ActiveQuest[] | null }) {
  return (
    <Widget
      i={i}
      eyebrow="Now"
      title={quests ? questCount(quests.length) : "Quest log"}
      href="#now"
      ariaLabel={quests ? `Now: ${questCount(quests.length)}. Jump to the list` : "Now: jump to the quest log"}
    >
      {quests ? (
        <ul className="pg-now-mini__list">
          {quests.map((q, n) => (
            <li key={q.title}>
              <i style={{ background: questColor(n).dot }} aria-hidden="true" />
              {q.title}
            </li>
          ))}
        </ul>
      ) : (
        <p className="footnote mt-auto text-label-2">updating soon</p>
      )}
    </Widget>
  );
}

/** Small widget: the book chapter I'm in. */
export function WritingWidget({ i }: { i?: number }) {
  return (
    <Widget i={i} eyebrow="Writing" href="/unpublished-book" ariaLabel={`Writing: ${now.writing.title}, ${now.writing.detail}`}>
      <span
        className="pg-row__tile"
        style={{ ...iconColor("peach"), width: 40, height: 40, borderRadius: 12, margin: "10px 0 auto" } as CSSProperties}
        aria-hidden="true"
      >
        <Glyph name="book" />
      </span>
      <p className="headline m-0 text-label">{now.writing.title}</p>
      <p className="footnote m-0 mt-0.5 text-label-2">{now.writing.detail}</p>
    </Widget>
  );
}

/** The live quests (from screenseiji's side quests file), newest log first. */
export function NowList({ i, quests }: { i?: number; quests: ActiveQuest[] | null }) {
  return (
    <ListGroup i={i} id="now" header="Now">
      {quests === null ? (
        <ListRow title="Quest log updating" subtitle="check back soon" />
      ) : (
        quests.map((quest, n) => <QuestRow key={quest.title} quest={quest} color={questColor(n).tile} />)
      )}
      <ListRow title="View all quests" href={SIDE_QUESTS_PAGE_URL} external />
    </ListGroup>
  );
}

function QuestRow({ quest, color }: { quest: ActiveQuest; color: IconColor }) {
  const segments = quest.latest ? parseInline(quest.latest.text) : [];
  // The whole row links to the quest when it has a link, so inline links stay plain text.
  const subtitle = quest.link
    ? segments.map((s) => s.text).join("")
    : segments.map((segment, i) =>
        segment.href ? (
          <a key={i} href={segment.href} target="_blank" rel="noopener noreferrer">
            {segment.text}
          </a>
        ) : (
          <Fragment key={i}>{segment.text}</Fragment>
        ),
      );

  return (
    <ListRow
      title={quest.title}
      subtitle={segments.length ? subtitle : undefined}
      glyph={QUEST_GLYPHS[quest.title] ?? "sparkles"}
      color={color}
      href={quest.link}
      external
    />
  );
}

const ITEM_GLYPHS: Record<string, { glyph: GlyphName; color: IconColor }> = {
  Watching: { glyph: "eye", color: "peach" },
  Seeking: { glyph: "compass", color: "indigo" },
};

/** The hand-edited rows from lib/now.ts, dated by that file's last commit. */
export function NowNotes({ i, updated }: { i?: number; updated: Date | null }) {
  return (
    <ListGroup i={i} footer={updated ? `As of ${formatAsOf(updated)}` : undefined}>
      {now.items.map((item) => (
        <ListRow
          key={item.label}
          title={item.label}
          subtitle={item.value}
          glyph={ITEM_GLYPHS[item.label]?.glyph ?? "sparkles"}
          color={ITEM_GLYPHS[item.label]?.color ?? "violet"}
        />
      ))}
    </ListGroup>
  );
}

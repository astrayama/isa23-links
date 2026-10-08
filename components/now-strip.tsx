import { Fragment } from "react";
import { ArrowUpRight } from "lucide-react";
import { now } from "@/lib/now";
import { getActiveQuests, SIDE_QUESTS_PAGE_URL, type ActiveQuest } from "@/lib/side-quests/fetch";
import { parseInline } from "@/lib/side-quests/parse";

export async function NowStrip() {
  // Live from screenseiji's side quests file (null if it couldn't be read at build time).
  const quests = await getActiveQuests();

  return (
    <div className="w-full rounded-3xl border-2 border-primary/30 bg-card/40 p-4 backdrop-blur-sm">
      <div className="mb-2 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/70" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-primary" />
        </span>
        <h2 className="font-fredoka text-sm font-medium text-foreground">
          Now
          <span className="ml-2 font-quicksand text-xs font-normal text-foreground/40">
            {now.updated}
          </span>
        </h2>
      </div>

      <div className="mb-3 border-b border-primary/15 pb-3">
        {quests === null ? (
          <p className="text-sm font-quicksand text-foreground/60">Quest log updating — check back soon.</p>
        ) : (
          quests.length > 0 && (
            <ul className="space-y-1.5">
              {quests.map((quest) => <QuestRow key={quest.title} quest={quest} />)}
            </ul>
          )
        )}
        <a
          href={SIDE_QUESTS_PAGE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block font-fredoka text-xs text-primary/90 underline-offset-2 transition-colors hover:text-primary hover:underline"
        >
          View all quests →
        </a>
      </div>

      <ul className="space-y-1.5">
        {now.items.map((item) => (
          <li key={item.label} className="flex gap-2 text-sm font-quicksand">
            <span className="shrink-0 font-fredoka text-primary/90">{item.label}</span>
            <span className="text-foreground/70">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuestRow({ quest }: { quest: ActiveQuest }) {
  const segments = quest.latest ? parseInline(quest.latest.text) : [];

  return (
    <li className="flex items-center gap-2 text-sm font-quicksand">
      <span aria-hidden className="h-2 w-2 shrink-0 rotate-45 rounded-[1px]" style={{ background: quest.color }} />
      <span className="shrink-0 font-fredoka text-foreground/90">{quest.title}</span>
      {/* One line; the full log lives on the Side Quests page. */}
      <span className="min-w-0 flex-1 truncate text-foreground/70" title={segments.map((s) => s.text).join("")}>
        {segments.map((segment, i) =>
          segment.href ? (
            <a
              key={i}
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-current/40 underline-offset-2 hover:decoration-current"
            >
              {segment.text}
            </a>
          ) : (
            <Fragment key={i}>{segment.text}</Fragment>
          ),
        )}
      </span>
      {quest.link && (
        <a
          href={quest.link}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${quest.title}`}
          className="shrink-0 text-primary/60 transition-colors hover:text-primary"
        >
          <ArrowUpRight className="h-4 w-4" />
        </a>
      )}
    </li>
  );
}

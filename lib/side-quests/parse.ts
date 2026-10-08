// Parser for content/side-quests.md, the single source of truth for Side Quests.
//
// This file is shared VERBATIM between two repos: screenseiji (reads the file at
// build time) and isa23-links (fetches it from GitHub). Edit both copies
// together and keep them byte-identical so both sites apply the same rules.
//
// Pure and import-free, written in erasable-only TypeScript, so Node can run
// it directly (`npm test`). It is deliberately strict: anything it doesn't
// understand throws a SideQuestsParseError naming the line, so a typo fails
// loudly instead of silently dropping a quest or a log entry.

export type QuestStatus = 'active' | 'paused' | 'complete'

export interface LogEntry {
  /** Calendar date, YYYY-MM-DD. Keep it a string: `new Date()` would shift it a day west of UTC. */
  date: string
  text: string
}

export interface Quest {
  title: string
  status: QuestStatus
  question: string
  milestone?: string
  link?: string
  color: string
  /** Oldest first; entries on the same day keep their order in the file. */
  log: LogEntry[]
  /** The most recent entry (the last one in `log`). */
  latest?: LogEntry
}

export interface DayEntry {
  quest: string
  color: string
  text: string
}

export interface SideQuests {
  tagline: string
  /** Sorted active → paused → complete, then by order in the file. */
  quests: Quest[]
  /** Every quest's color, pinned or fallback. */
  colors: Record<string, string>
  /** Every log entry by date, keys ascending; each day in quest order, then file order. */
  entriesByDate: Record<string, DayEntry[]>
  /** Non-fatal problems worth fixing, e.g. a quest without a pinned color. */
  warnings: string[]
}

export interface InlineSegment {
  text: string
  href?: string
}

export class SideQuestsParseError extends Error {
  line: number

  constructor(line: number, message: string) {
    super(`Line ${line}: ${message}`)
    this.name = 'SideQuestsParseError'
    this.line = line
  }
}

/** Allowed statuses, in display order. */
export const STATUSES: readonly QuestStatus[] = ['active', 'paused', 'complete']

/** Colors for quests missing from the `<!-- colors: -->` line, picked by a hash of the title. */
export const FALLBACK_PALETTE: readonly string[] = [
  '#24bfb2', '#e8b860', '#60a5fa', '#f472b6', '#a3e635', '#fb923c', '#c084fc', '#f87171',
]

const FIELDS: Record<string, 'status' | 'question' | 'milestone' | 'link'> = {
  'status': 'status',
  'question': 'question',
  'next milestone': 'milestone',
  'link': 'link',
}
const FIELD_NAMES = 'Status, Question, Next milestone, Link'

const ITEM = /^[-*]\s+\*\*(.+?):\*\*\s*(.*)$/
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/
const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i
const HTTP_URL = /^https?:\/\/\S+$/i
// [text](url) — the url may hold one level of balanced parentheses — or a bare URL.
const INLINE = /\[([^\]\n]+)\]\(((?:[^()\s]|\([^()\s]*\))*)\)|(https?:\/\/[^\s<>"]+)/g

interface Located {
  value: string
  line: number
}

interface DraftQuest {
  title: string
  line: number
  fields: Partial<Record<'status' | 'question' | 'milestone' | 'link', Located>>
  log: { date: string; text: string; line: number }[]
  hasLog: boolean
}

export function parseSideQuests(markdown: string): SideQuests {
  const { text, colorsComment } = stripComments(markdown.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n'))
  const lines = text.split('\n')

  let tagline: Located | undefined
  const drafts: DraftQuest[] = []
  let current: DraftQuest | undefined
  // What an indented continuation line appends to.
  let continues: Located | undefined

  lines.forEach((raw, index) => {
    const line = index + 1
    const trimmed = raw.trim()

    if (trimmed === '') {
      continues = undefined
      return
    }

    if (/^\s{2,}\S/.test(raw)) {
      if (!continues) throw new SideQuestsParseError(line, `Unexpected indented line: "${trimmed}"`)
      if (ITEM.test(trimmed)) {
        throw new SideQuestsParseError(line, 'Fields and log entries must start at the beginning of the line, not indented.')
      }
      continues.value = continues.value ? `${continues.value} ${trimmed}` : trimmed
      return
    }
    continues = undefined

    if (/^#\s/.test(raw)) {
      if (current || tagline) throw new SideQuestsParseError(line, 'The "# Side Quests" title belongs on the first line only.')
      return
    }

    if (raw.startsWith('>')) {
      if (current) throw new SideQuestsParseError(line, 'The "> " tagline must come before the first quest.')
      const part = raw.replace(/^>\s?/, '').trim()
      tagline = tagline ? { value: `${tagline.value} ${part}`, line: tagline.line } : { value: part, line }
      return
    }

    if (/^##\s/.test(raw)) {
      if (!tagline || !tagline.value) {
        throw new SideQuestsParseError(line, 'Missing tagline: add a "> Main quest: …" line before the first quest.')
      }
      const title = raw.replace(/^##\s+/, '').trim()
      if (!title) throw new SideQuestsParseError(line, 'Quest title is empty.')
      if (title.includes(',')) {
        throw new SideQuestsParseError(line, `Quest titles can't contain commas (the colors line uses them as separators): "${title}"`)
      }
      if (drafts.some(d => d.title.toLowerCase() === title.toLowerCase())) {
        throw new SideQuestsParseError(line, `Duplicate quest title "${title}".`)
      }
      current = { title, line, fields: {}, log: [], hasLog: false }
      drafts.push(current)
      return
    }

    if (/^###\s/.test(raw)) {
      const heading = raw.replace(/^###\s+/, '').trim()
      if (!current) throw new SideQuestsParseError(line, `"${raw.trim()}" must sit inside a "## Quest".`)
      if (heading.toLowerCase() !== 'log') {
        throw new SideQuestsParseError(line, `Only "### Log" is allowed inside a quest, got "${raw.trim()}".`)
      }
      if (current.hasLog) throw new SideQuestsParseError(line, `Quest "${current.title}" has two "### Log" sections.`)
      current.hasLog = true
      return
    }

    const item = ITEM.exec(trimmed)
    if (item) {
      if (!current) throw new SideQuestsParseError(line, 'Fields and log entries must sit inside a "## Quest".')
      const key = item[1].trim()
      const value = item[2].trim()
      const field = FIELDS[key.toLowerCase()]

      if (current.hasLog) {
        if (field) throw new SideQuestsParseError(line, `Fields go before "### Log": move "${key}" up.`)
        if (!ISO_DATE.test(key)) {
          throw new SideQuestsParseError(line, `Log entries start with a date like **2026-10-07:** (YYYY-MM-DD), got "${key}".`)
        }
        if (!isRealDate(key)) throw new SideQuestsParseError(line, `${key} is not a real date.`)
        const entry = { date: key, text: value, line }
        current.log.push(entry)
        continues = {
          get value() { return entry.text },
          set value(v: string) { entry.text = v },
          line,
        }
        return
      }

      if (ISO_DATE.test(key)) throw new SideQuestsParseError(line, 'Log entries go under a "### Log" heading.')
      if (!field) throw new SideQuestsParseError(line, `Unknown field "${key}" (expected ${FIELD_NAMES}).`)
      if (current.fields[field]) throw new SideQuestsParseError(line, `Duplicate field "${key}" in quest "${current.title}".`)
      const located = { value, line }
      current.fields[field] = located
      continues = located
      return
    }

    if (/^[-*]\s+\*\*[^*]+\*\*:/.test(trimmed)) {
      throw new SideQuestsParseError(line, `Put the colon inside the bold, like "- **Status:** active": "${trimmed}"`)
    }
    throw new SideQuestsParseError(line, `Unexpected line: "${trimmed}"`)
  })

  if (!tagline || !tagline.value) {
    throw new SideQuestsParseError(1, 'Missing tagline: add a "> Main quest: …" line under the title.')
  }

  const quests = drafts.map(finishQuest)
  const warnings: string[] = []
  const pinned = colorsComment ? parseColors(colorsComment, drafts) : new Map<string, string>()

  for (const quest of quests) {
    const color = pinned.get(quest.title)
    if (color) {
      quest.color = color
    } else {
      quest.color = fallbackColor(quest.title)
      warnings.push(
        `Quest "${quest.title}" has no pinned color, so it uses ${quest.color}. Add it to the <!-- colors: --> line to pin it.`,
      )
    }
  }

  quests.sort((a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status))

  const colors: Record<string, string> = {}
  const byDate: Record<string, DayEntry[]> = {}
  for (const quest of quests) {
    colors[quest.title] = quest.color
    for (const entry of quest.log) {
      byDate[entry.date] ??= []
      byDate[entry.date].push({ quest: quest.title, color: quest.color, text: entry.text })
    }
  }
  const entriesByDate: Record<string, DayEntry[]> = {}
  for (const date of Object.keys(byDate).sort()) entriesByDate[date] = byDate[date]

  return { tagline: tagline.value, quests, colors, entriesByDate, warnings }
}

/** Splits log text into plain text and links ([text](url) or a bare http(s) URL). */
export function parseInline(text: string): InlineSegment[] {
  const segments: InlineSegment[] = []
  const pushText = (value: string) => {
    if (!value) return
    const last = segments[segments.length - 1]
    if (last && last.href === undefined) last.text += value
    else segments.push({ text: value })
  }

  const pattern = new RegExp(INLINE.source, 'g')
  let cursor = 0
  let match: RegExpExecArray | null
  while ((match = pattern.exec(text))) {
    pushText(text.slice(cursor, match.index))
    if (match[3] !== undefined) {
      const url = trimUrl(match[3])
      segments.push({ text: url, href: url })
      cursor = match.index + url.length
      pattern.lastIndex = cursor
    } else {
      const [, label, href] = match
      if (HTTP_URL.test(href)) segments.push({ text: label, href })
      else pushText(label)
      cursor = match.index + match[0].length
    }
  }
  pushText(text.slice(cursor))
  return segments
}

function finishQuest(draft: DraftQuest): Quest {
  const { status, question, milestone, link } = draft.fields

  if (!status) throw new SideQuestsParseError(draft.line, `Quest "${draft.title}" is missing "- **Status:**".`)
  if (!STATUSES.includes(status.value as QuestStatus)) {
    throw new SideQuestsParseError(status.line, `Status must be active, paused or complete (lowercase), got "${status.value}".`)
  }
  if (!question) throw new SideQuestsParseError(draft.line, `Quest "${draft.title}" is missing "- **Question:**".`)
  if (!question.value) throw new SideQuestsParseError(question.line, `Quest "${draft.title}" has an empty Question.`)
  if (link && link.value && !HTTP_URL.test(link.value)) {
    throw new SideQuestsParseError(link.line, `Link must be an http(s) URL, got "${link.value}".`)
  }

  for (const entry of draft.log) {
    if (!entry.text) throw new SideQuestsParseError(entry.line, `The log entry for ${entry.date} is empty.`)
    for (const match of entry.text.matchAll(new RegExp(INLINE.source, 'g'))) {
      if (match[2] !== undefined && !HTTP_URL.test(match[2])) {
        throw new SideQuestsParseError(entry.line, `Links in log entries must be http(s) URLs, got "${match[2]}".`)
      }
    }
  }

  // Array.prototype.sort is stable, so same-day entries keep their file order.
  const log = draft.log
    .map(({ date, text }) => ({ date, text }))
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))

  return {
    title: draft.title,
    status: status.value as QuestStatus,
    question: question.value,
    milestone: milestone?.value || undefined,
    link: link?.value || undefined,
    color: '',
    log,
    latest: log[log.length - 1],
  }
}

/**
 * Removes HTML comments, keeping their line breaks so line numbers still match
 * the file. Returns the `<!-- colors: … -->` comment's content separately.
 */
function stripComments(text: string): { text: string; colorsComment?: Located } {
  let colorsComment: Located | undefined
  let out = ''
  let cursor = 0
  while (true) {
    const start = text.indexOf('<!--', cursor)
    if (start === -1) break
    const line = lineAt(text, start)
    const end = text.indexOf('-->', start + 4)
    if (end === -1) throw new SideQuestsParseError(line, 'Unclosed "<!--" comment.')
    const body = text.slice(start + 4, end)
    const colors = /^\s*colors\s*:([\s\S]*)$/i.exec(body)
    // A near-miss would otherwise be ignored as a plain comment and silently unpin every color.
    if (!colors && (/^\s*colou?rs?\b/i.test(body) || /:\s*#[0-9a-f]{3,6}\b/i.test(body))) {
      throw new SideQuestsParseError(line, 'Write the colors line exactly as <!-- colors: Quest: #hex, Other quest: #hex -->.')
    }
    if (colors) {
      if (colorsComment) throw new SideQuestsParseError(line, 'Only one <!-- colors: --> line is allowed.')
      colorsComment = { value: colors[1], line }
    }
    out += text.slice(cursor, start) + '\n'.repeat(body.split('\n').length - 1)
    cursor = end + 3
  }
  return { text: out + text.slice(cursor), colorsComment }
}

function parseColors(comment: Located, drafts: DraftQuest[]): Map<string, string> {
  const pinned = new Map<string, string>()
  for (const part of comment.value.split(',')) {
    const pair = part.trim()
    if (!pair) continue
    const colon = pair.lastIndexOf(':')
    if (colon === -1) throw new SideQuestsParseError(comment.line, `Colors must look like "Quest: #hex", got "${pair}".`)
    const name = pair.slice(0, colon).trim()
    const hex = pair.slice(colon + 1).trim()
    if (!HEX.test(hex)) throw new SideQuestsParseError(comment.line, `Invalid color "${hex}" for "${name}" (use #rgb or #rrggbb).`)
    const quest = drafts.find(d => d.title.toLowerCase() === name.toLowerCase())
    if (!quest) throw new SideQuestsParseError(comment.line, `The colors line names "${name}", but there's no "## ${name}" quest.`)
    if (pinned.has(quest.title)) throw new SideQuestsParseError(comment.line, `"${name}" is pinned twice on the colors line.`)
    pinned.set(quest.title, hex.toLowerCase())
  }
  return pinned
}

function fallbackColor(title: string): string {
  // FNV-1a: stable per title, so adding or reordering quests never shifts a color.
  let hash = 0x811c9dc5
  for (const char of title.toLowerCase()) {
    hash ^= char.codePointAt(0)!
    hash = Math.imul(hash, 0x01000193)
  }
  return FALLBACK_PALETTE[(hash >>> 0) % FALLBACK_PALETTE.length]
}

function isRealDate(iso: string): boolean {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(y, m - 1, d))
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d
}

/** Drops trailing punctuation, and a closing paren the URL never opened. */
function trimUrl(url: string): string {
  let end = url.length
  while (end > 0) {
    const char = url[end - 1]
    if ('.,;:!?\'"'.includes(char)) {
      end--
    } else if (char === ')') {
      const head = url.slice(0, end)
      if (head.split('(').length >= head.split(')').length) break
      end--
    } else {
      break
    }
  }
  return url.slice(0, end)
}

function lineAt(text: string, index: number): number {
  return text.slice(0, index).split('\n').length
}

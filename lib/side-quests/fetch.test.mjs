// Run with `npm test`.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { getActiveQuests, SIDE_QUESTS_RAW_URL } from "./fetch.ts";
import { FALLBACK_PALETTE } from "./parse.ts";

const FILE = `# Side Quests
> Main quest: self-mastery and self-expression.
<!-- colors: Lumenwright: #7c5cff, Resting: #e8a2c8 -->

## Resting
- **Status:** paused
- **Question:** Later?

## Lumenwright
- **Status:** active
- **Question:** Can willpower be a game mechanic?
- **Link:** https://lumenwright-nu.vercel.app

### Log
- **2026-10-07:** Newest.
- **2026-10-04:** Older.

## Quiet
- **Status:** active
- **Question:** No log yet?
`;

const realFetch = globalThis.fetch;
const realWarn = console.warn;
let calls;
let warnings;

function respond(status, body = "") {
  globalThis.fetch = async (...args) => {
    calls.push(args);
    return new Response(body, { status });
  };
}

const realNodeEnv = process.env.NODE_ENV;

beforeEach(() => {
  calls = [];
  warnings = [];
  console.warn = (message) => warnings.push(message);
  delete process.env.NEXT_PHASE;
  process.env.NODE_ENV = "production";
});
afterEach(() => {
  globalThis.fetch = realFetch;
  console.warn = realWarn;
  delete process.env.NEXT_PHASE;
  process.env.NODE_ENV = realNodeEnv;
});

test("fetches the raw file from main with hourly revalidation", async () => {
  respond(200, FILE);
  await getActiveQuests();
  assert.equal(SIDE_QUESTS_RAW_URL, "https://raw.githubusercontent.com/astrayama/screenseiji/main/content/side-quests.md");
  assert.equal(calls[0][0], SIDE_QUESTS_RAW_URL);
  assert.deepEqual(calls[0][1].next, { revalidate: 3600 });
  assert.ok(calls[0][1].signal instanceof AbortSignal);
});

test("returns only active quests, in file order, with their latest entry", async () => {
  respond(200, FILE);
  const [lumen, quiet, ...rest] = await getActiveQuests();
  assert.deepEqual(lumen, {
    title: "Lumenwright",
    color: "#7c5cff",
    link: "https://lumenwright-nu.vercel.app",
    latest: { date: "2026-10-07", text: "Newest." },
  });
  assert.equal(quiet.title, "Quiet");
  assert.ok(FALLBACK_PALETTE.includes(quiet.color));
  assert.equal(quiet.link, undefined);
  assert.equal(quiet.latest, undefined);
  assert.deepEqual(rest, []);
});

test("during the build, a missing file falls back to null", async () => {
  process.env.NEXT_PHASE = "phase-production-build";
  respond(404, "404: Not Found");
  assert.equal(await getActiveQuests(), null);
  assert.match(warnings[0], /fallback message: .*404/);
});

test("during the build, a malformed file falls back to null", async () => {
  process.env.NEXT_PHASE = "phase-production-build";
  respond(200, FILE.replace("active", "Active"));
  assert.equal(await getActiveQuests(), null);
  assert.match(warnings[0], /Line 10/);
});

test("at runtime, a failed fetch throws so ISR keeps the last good page", async () => {
  respond(500, "boom");
  await assert.rejects(getActiveQuests(), /500/);
});

test("at runtime, a malformed file throws too", async () => {
  respond(200, FILE.replace("active", "Active"));
  await assert.rejects(getActiveQuests(), /Line 10/);
});

test("during the build, a hung fetch times out and falls back", { timeout: 2000 }, async () => {
  process.env.NEXT_PHASE = "phase-production-build";
  // Never answers; only an abort signal can end it.
  globalThis.fetch = (url, init) => {
    calls.push([url, init]);
    return new Promise((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(init.signal.reason)));
  };
  assert.equal(await getActiveQuests({ timeoutMs: 20 }), null);
  assert.match(warnings[0], /fallback message/);
});

test("in development, a failed fetch falls back instead of crashing the page", async () => {
  process.env.NODE_ENV = "development";
  respond(404, "404: Not Found");
  assert.equal(await getActiveQuests(), null);
});

test("shows at most the 4 most recently logged active quests", async () => {
  const block = (title, date) =>
    `## ${title}\n- **Status:** active\n- **Question:** Why?\n\n### Log\n- **${date}:** x\n`;
  respond(200, [
    "# Side Quests\n> Main quest: test.\n",
    block("Oldest", "2026-05-01"),
    block("Newest", "2026-10-08"),
    block("Middle", "2026-09-01"),
    block("Recent", "2026-10-01"),
    block("Older", "2026-08-01"),
  ].join("\n"));
  const quests = await getActiveQuests();
  assert.deepEqual(quests.map((q) => q.title), ["Newest", "Recent", "Middle", "Older"]);
});

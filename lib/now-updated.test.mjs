// Run with `npm test`.
import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { formatAsOf, getNowUpdated, nowCommitsUrl } from "./now-updated.ts";

const COMMITS = JSON.stringify([{ commit: { committer: { date: "2026-10-08T05:10:58Z" } } }]);

const realFetch = globalThis.fetch;
const realWarn = console.warn;
const realNodeEnv = process.env.NODE_ENV;
let calls;
let warnings;

function respond(status, body = "") {
  globalThis.fetch = async (...args) => {
    calls.push(args);
    return new Response(body, { status });
  };
}

beforeEach(() => {
  calls = [];
  warnings = [];
  console.warn = (message) => warnings.push(message);
  delete process.env.NEXT_PHASE;
  delete process.env.VERCEL_GIT_COMMIT_SHA;
  delete process.env.GITHUB_TOKEN;
  process.env.NODE_ENV = "production";
});
afterEach(() => {
  globalThis.fetch = realFetch;
  console.warn = realWarn;
  delete process.env.NEXT_PHASE;
  delete process.env.VERCEL_GIT_COMMIT_SHA;
  delete process.env.GITHUB_TOKEN;
  process.env.NODE_ENV = realNodeEnv;
});

test("asks GitHub for the last commit that touched lib/now.ts on main, rechecked hourly", async () => {
  respond(200, COMMITS);
  await getNowUpdated();
  assert.equal(
    calls[0][0],
    "https://api.github.com/repos/astrayama/isa23-links/commits?path=lib%2Fnow.ts&sha=main&per_page=1",
  );
  assert.deepEqual(calls[0][1].next, { revalidate: 3600 });
  assert.equal(calls[0][1].headers.Authorization, undefined);
  assert.ok(calls[0][1].signal instanceof AbortSignal);
});

test("on Vercel, looks back from the deployed commit and caches for good", async () => {
  process.env.VERCEL_GIT_COMMIT_SHA = "abc123";
  respond(200, COMMITS);
  await getNowUpdated();
  assert.equal(calls[0][0], nowCommitsUrl("abc123"));
  assert.match(calls[0][0], /sha=abc123/);
  assert.equal(calls[0][1].cache, "force-cache");
  assert.equal(calls[0][1].next, undefined);
});

test("sends GITHUB_TOKEN when it is set", async () => {
  process.env.GITHUB_TOKEN = "t0ken";
  respond(200, COMMITS);
  await getNowUpdated();
  assert.equal(calls[0][1].headers.Authorization, "Bearer t0ken");
});

test("returns the commit date", async () => {
  respond(200, COMMITS);
  const date = await getNowUpdated();
  assert.equal(date.toISOString(), "2026-10-08T05:10:58.000Z");
});

test("formats the date as a calendar day in New York", () => {
  // 03:10 UTC on the 8th is still the evening of the 7th in New York.
  assert.equal(formatAsOf(new Date("2026-10-08T03:10:00Z")), "October 7, 2026");
  assert.equal(formatAsOf(new Date("2026-10-08T16:00:00Z")), "October 8, 2026");
});

test("during the build, a failed request leaves the date off", async () => {
  process.env.NEXT_PHASE = "phase-production-build";
  respond(403, '{"message":"API rate limit exceeded"}');
  assert.equal(await getNowUpdated(), null);
  assert.match(warnings[0], /"As of" date off: .*403/);
});

test("during the build, an empty history leaves the date off", async () => {
  process.env.NEXT_PHASE = "phase-production-build";
  respond(200, "[]");
  assert.equal(await getNowUpdated(), null);
  assert.match(warnings[0], /No commits found/);
});

test("at runtime, a failed request throws so ISR keeps the last good page", async () => {
  respond(500, "boom");
  await assert.rejects(getNowUpdated(), /500/);
});

test("in development, a failed request leaves the date off instead of crashing", async () => {
  process.env.NODE_ENV = "development";
  respond(404, "Not Found");
  assert.equal(await getNowUpdated(), null);
});

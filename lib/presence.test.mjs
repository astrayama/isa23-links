// Run with `npm test`.
import { test } from "node:test";
import assert from "node:assert/strict";
import { activePlatforms, platformText, toPresence } from "./presence.ts";

const online = (flags) => ({ discord_status: "online", activities: [], listening_to_spotify: false, spotify: null, ...flags });

test("lists every client she's connected on, in a fixed order", () => {
  assert.deepEqual(activePlatforms(online({ active_on_discord_web: true })), ["web"]);
  assert.deepEqual(
    activePlatforms(online({ active_on_discord_mobile: true, active_on_discord_web: true, active_on_discord_desktop: true })),
    ["desktop", "web", "mobile"],
  );
  assert.deepEqual(activePlatforms(online({ active_on_discord_vr: true, active_on_discord_embedded: true })), ["VR", "console"]);
});

test("shows no platform when offline or unknown", () => {
  assert.deepEqual(activePlatforms(null), []);
  assert.deepEqual(activePlatforms({ ...online({ active_on_discord_web: true }), discord_status: "offline" }), []);
  assert.deepEqual(activePlatforms(online({})), []);
});

test("words the platforms like a sentence", () => {
  assert.equal(platformText([]), "");
  assert.equal(platformText(["web"]), "web");
  assert.equal(platformText(["web", "mobile"]), "web & mobile");
  assert.equal(platformText(["desktop", "web", "mobile"]), "desktop, web & mobile");
});

test("reads a Lanyard payload, and treats an untracked user as no presence", () => {
  assert.equal(toPresence(null), null);
  assert.equal(toPresence({}), null);
  assert.equal(toPresence({ discord_status: "sleepy" }), null);
  const p = toPresence({ discord_status: "idle", active_on_discord_web: true });
  assert.equal(p.discord_status, "idle");
  assert.deepEqual(p.activities, []);
});

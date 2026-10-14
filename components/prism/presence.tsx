"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LANYARD_SOCKET, STATUS, lanyardUserUrl, toPresence, type LanyardPresence } from "@/lib/presence";

// ---------------------------------------------------------------------------
// Live Discord presence via Lanyard's WebSocket, shared by the island, hero
// and card. Changes arrive the moment Discord reports them; if the socket
// drops, the REST endpoint is polled until it reconnects.
// ---------------------------------------------------------------------------

export { STATUS, activePlatforms, platformText } from "@/lib/presence";
export type { LanyardActivity, LanyardPresence, Status } from "@/lib/presence";

const POLL_MS = 30_000;
const MAX_RETRY_MS = 30_000;
/** A socket that opens but never sends state (a proxy eating it) falls back to polling. */
const STATE_TIMEOUT_MS = 8_000;

const PresenceContext = createContext<LanyardPresence | null>(null);

export function PresenceProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [presence, setPresence] = useState<LanyardPresence | null>(null);

  useEffect(() => {
    let socket: WebSocket | null = null;
    let heartbeat: ReturnType<typeof setInterval> | undefined;
    let poll: ReturnType<typeof setInterval> | undefined;
    let retry: ReturnType<typeof setTimeout> | undefined;
    let stateTimeout: ReturnType<typeof setTimeout> | undefined;
    let attempts = 0;
    let stopped = false;

    const loadRest = async () => {
      try {
        const res = await fetch(lanyardUserUrl(userId));
        const json = await res.json();
        // success:false means Lanyard isn't tracking this user — hide presence.
        if (!stopped) setPresence(json.success ? toPresence(json.data) : null);
      } catch {
        // Transient network error: keep whatever we last showed.
      }
    };

    const startPolling = () => {
      if (poll) return;
      loadRest();
      poll = setInterval(loadRest, POLL_MS);
    };
    const stopPolling = () => {
      clearInterval(poll);
      poll = undefined;
    };

    const disconnect = () => {
      clearTimeout(retry);
      clearTimeout(stateTimeout);
      clearInterval(heartbeat);
      stopPolling();
      if (socket) {
        socket.onclose = null;
        socket.close();
        socket = null;
      }
    };

    // Protocol: Hello (op 1) → Initialize (op 2) → INIT_STATE / PRESENCE_UPDATE (op 0),
    // with a heartbeat (op 3) at the interval Hello asks for.
    const connect = () => {
      if (stopped || document.hidden || socket) return;
      try {
        socket = new WebSocket(LANYARD_SOCKET);
      } catch {
        startPolling();
        return;
      }
      const ws = socket;
      clearTimeout(stateTimeout);
      stateTimeout = setTimeout(startPolling, STATE_TIMEOUT_MS);
      ws.onmessage = (event) => {
        let msg: { op: number; t?: string; d?: { heartbeat_interval?: number } };
        try {
          msg = JSON.parse(event.data);
        } catch {
          return;
        }
        if (msg.op === 1) {
          ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
          clearInterval(heartbeat);
          heartbeat = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ op: 3 }));
          }, msg.d?.heartbeat_interval ?? POLL_MS);
        } else if (msg.op === 0 && (msg.t === "INIT_STATE" || msg.t === "PRESENCE_UPDATE")) {
          attempts = 0;
          clearTimeout(stateTimeout);
          stopPolling();
          setPresence(toPresence(msg.d));
        }
      };
      ws.onclose = () => {
        clearInterval(heartbeat);
        clearTimeout(stateTimeout);
        socket = null;
        if (stopped || document.hidden) return;
        // Stay accurate while it's down, then reconnect with backoff.
        startPolling();
        retry = setTimeout(connect, Math.min(MAX_RETRY_MS, 1000 * 2 ** attempts++));
      };
    };

    // Only hold the connection while the tab is visible; coming back gets a fresh INIT_STATE.
    const onVisibility = () => {
      if (document.hidden) return disconnect();
      attempts = 0;
      connect();
    };

    connect();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stopped = true;
      disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [userId]);

  return <PresenceContext.Provider value={presence}>{children}</PresenceContext.Provider>;
}

export function usePresence() {
  return useContext(PresenceContext);
}

/** The status dot on an avatar; renders nothing until presence is known. */
export function StatusDot() {
  const presence = usePresence();
  if (!presence) return null;
  const s = STATUS[presence.discord_status];
  return (
    <span
      className={`pg-avatar__status${presence.discord_status === "online" ? " pg-avatar__status--live" : ""}`}
      style={{ "--sc": s.color } as React.CSSProperties}
      role="img"
      aria-label={s.label}
      title={s.label}
    />
  );
}

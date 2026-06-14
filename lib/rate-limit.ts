// In-memory passcode rate limiting + timing-safe comparison.
// Ported from the original Supabase edge function. State is per server
// instance (fine for a personal site); resets on redeploy.

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

type Attempt = { count: number; lockedUntil: number | null };
const attempts = new Map<string, Attempt>();

export function checkLock(ip: string): { locked: boolean; remainingMin: number } {
  const a = attempts.get(ip);
  if (a?.lockedUntil && a.lockedUntil > Date.now()) {
    return {
      locked: true,
      remainingMin: Math.ceil((a.lockedUntil - Date.now()) / 60000),
    };
  }
  return { locked: false, remainingMin: 0 };
}

export function recordFailure(ip: string): void {
  const a = attempts.get(ip) ?? { count: 0, lockedUntil: null };
  a.count += 1;
  a.lockedUntil = a.count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null;
  attempts.set(ip, a);
}

export function resetAttempts(ip: string): void {
  attempts.delete(ip);
}

export function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const bufA = enc.encode(a);
  const bufB = enc.encode(b);
  const len = Math.max(bufA.byteLength, bufB.byteLength);
  let mismatch = bufA.byteLength !== bufB.byteLength ? 1 : 0;
  for (let i = 0; i < len; i++) {
    mismatch |= (bufA[i] ?? 0) ^ (bufB[i] ?? 0);
  }
  return mismatch === 0;
}

export function getClientIp(req: Request): string {
  const h = req.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown"
  );
}

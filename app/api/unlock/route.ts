import {
  checkLock,
  recordFailure,
  resetAttempts,
  timingSafeEqual,
  getClientIp,
} from "@/lib/rate-limit";

// Server-side passcode → URL map. URLs default to the real targets but can be
// overridden by env vars. Kept out of the client bundle.
function protectedLinks(): Record<string, string> {
  return {
    instagram: process.env.LINK_INSTAGRAM || "https://www.instagram.com/astrayama",
    projects: process.env.LINK_PROJECTS || "https://devpost.com/isabiiil",
    "personal-website":
      process.env.LINK_PERSONAL_SITE || "https://isabel-abonitalla.vercel.app/",
  };
}

export async function POST(req: Request) {
  let body: { passcode?: string; key?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const { passcode, key } = body;
  if (!passcode || !key) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }

  const ip = getClientIp(req);
  const lock = checkLock(ip);
  if (lock.locked) {
    return Response.json(
      { error: `Too many attempts. Try again in ${lock.remainingMin} minute${lock.remainingMin !== 1 ? "s" : ""}.` },
      { status: 429 },
    );
  }

  const secret = process.env.UNLOCK_PASSCODE;
  if (!secret || !timingSafeEqual(passcode, secret)) {
    recordFailure(ip);
    return Response.json({ error: "Incorrect passcode" }, { status: 401 });
  }

  resetAttempts(ip);
  const url = protectedLinks()[key];
  if (!url) return Response.json({ error: "Invalid link" }, { status: 400 });

  return Response.json({ url });
}

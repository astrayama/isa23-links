import { z } from "zod";
import { getResend, CONTACT_TO, CONTACT_FROM } from "@/lib/email";
import { getClientIp } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  purpose: z.string().min(1).max(50),
  message: z.string().trim().min(1).max(1000),
  company: z.string().optional(), // honeypot
});

// light per-IP throttle (10s between submissions)
const lastSubmit = new Map<string, number>();

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { name, email, purpose, message, company } = parsed.data;

  // honeypot — pretend success, do nothing
  if (company && company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const ip = getClientIp(req);
  const now = Date.now();
  if (now - (lastSubmit.get(ip) ?? 0) < 10_000) {
    return Response.json({ error: "Please wait a moment before sending again." }, { status: 429 });
  }
  lastSubmit.set(ip, now);

  const resend = getResend();
  const subject = `🕉️ isa23 hub — ${purpose} from ${name}`;
  const html = `
    <h2 style="font-family:sans-serif">New message from your link hub</h2>
    <p style="font-family:sans-serif"><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p style="font-family:sans-serif"><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p style="font-family:sans-serif"><strong>Purpose:</strong> ${escapeHtml(purpose)}</p>
    <p style="font-family:sans-serif"><strong>Message:</strong></p>
    <p style="font-family:sans-serif;white-space:pre-wrap">${escapeHtml(message)}</p>
  `;

  try {
    if (resend) {
      const { error } = await resend.emails.send({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        replyTo: email,
        subject,
        html,
      });
      if (error) throw error;
    } else if (process.env.NODE_ENV !== "production") {
      const { promises: fs } = await import("node:fs");
      const path = await import("node:path");
      const dir = path.join(process.cwd(), "data");
      await fs.mkdir(dir, { recursive: true });
      await fs.appendFile(
        path.join(dir, "contact-submissions.json"),
        JSON.stringify({ name, email, purpose, message, at: new Date().toISOString() }) + "\n",
      );
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("contact error:", err);
    return Response.json({ error: "Failed to send message." }, { status: 500 });
  }
}

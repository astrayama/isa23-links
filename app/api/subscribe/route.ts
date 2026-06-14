import { z } from "zod";
import { getResend, CONTACT_TO, CONTACT_FROM } from "@/lib/email";

const schema = z.object({
  email: z.string().trim().email().max(255),
  company: z.string().optional(), // honeypot
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  }
  const { email, company } = parsed.data;
  if (company && company.trim() !== "") return Response.json({ ok: true }); // honeypot

  const resend = getResend();
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  try {
    if (resend && audienceId) {
      const { error } = await resend.contacts.create({ email, audienceId, unsubscribed: false });
      if (error) throw error;
    } else if (resend) {
      // no audience configured — notify Isa so the address isn't lost
      const { error } = await resend.emails.send({
        from: CONTACT_FROM,
        to: CONTACT_TO,
        subject: "✨ New newsletter subscriber",
        html: `<p style="font-family:sans-serif">New subscriber: <strong>${email}</strong></p>`,
      });
      if (error) throw error;
    } else if (process.env.NODE_ENV !== "production") {
      const { promises: fs } = await import("node:fs");
      const path = await import("node:path");
      const dir = path.join(process.cwd(), "data");
      await fs.mkdir(dir, { recursive: true });
      await fs.appendFile(path.join(dir, "subscribers.txt"), email + "\n");
    }
    return Response.json({ ok: true });
  } catch (err) {
    console.error("subscribe error:", err);
    return Response.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}

import { Resend } from "resend";

let cached: Resend | null = null;

/** Returns a Resend client if a key is configured, otherwise null. */
export function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!cached) cached = new Resend(key);
  return cached;
}

export const CONTACT_TO = process.env.CONTACT_TO_EMAIL || "isabelabonitalla@gmail.com";
// Until a custom domain is verified in Resend, the onboarding sender works
// for delivering to your own account email.
export const CONTACT_FROM = process.env.CONTACT_FROM || "isa23 hub <onboarding@resend.dev>";

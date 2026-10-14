"use client";

import { useId, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "./prism/glass";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  purpose: z.string().min(1, "Please select a purpose"),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

const PURPOSES = [
  { value: "inquiry", label: "General Inquiry" },
  { value: "access", label: "Access to a private link" },
  { value: "collab", label: "Collaboration Opportunity" },
  { value: "job", label: "Job Opportunity" },
  { value: "speaking", label: "Speaking Engagement" },
  { value: "tarot", label: "Tarot Reading Inquiry" },
  { value: "mentorship", label: "Mentorship Request" },
  { value: "other", label: "Other" },
];

/** The contact form, shown in the Contact sheet. `purpose` preselects the dropdown. */
export function ContactForm({ purpose = "", onSent }: { purpose?: string; onSent: () => void }) {
  const id = useId();
  const [form, setForm] = useState({ name: "", email: "", purpose, message: "", company: "" });
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...parsed.data, company: form.company }),
      });
      if (!res.ok) throw new Error("failed");
      toast.success("Message sent!", { description: "Thank you for reaching out — I'll get back to you soon." });
      setForm({ name: "", email: "", purpose: "", message: "", company: "" });
      onSent();
    } catch {
      toast.error("Something went wrong", { description: "Please try again in a moment." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="pg-form">
      {/* honeypot */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        className="pg-hp"
        aria-hidden="true"
      />
      <label className="pg-field" htmlFor={`${id}-name`}>
        <span className="pg-field__label footnote">Name</span>
        <input id={`${id}-name`} className="pg-input" placeholder="Your name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </label>
      <label className="pg-field" htmlFor={`${id}-email`}>
        <span className="pg-field__label footnote">Email</span>
        <input id={`${id}-email`} className="pg-input" type="email" placeholder="your@email.com" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </label>
      <label className="pg-field" htmlFor={`${id}-purpose`}>
        <span className="pg-field__label footnote">Purpose</span>
        <select id={`${id}-purpose`} className="pg-input" value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required>
          <option value="" disabled>
            Select a purpose
          </option>
          {PURPOSES.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </label>
      <label className="pg-field" htmlFor={`${id}-message`}>
        <span className="pg-field__label footnote">Message</span>
        <textarea id={`${id}-message`} className="pg-input" placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
      </label>
      <Button type="submit" variant="filled" icon="send" disabled={submitting} className="mt-1 min-h-[50px] text-[17px]">
        {submitting ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "./prism/glass";
import { Sparkle } from "./prism/glyph";

const emailSchema = z.string().trim().email();

/** The "Join the journey" newsletter signup, shown in its sheet. */
export function JourneyForm() {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(email).success) {
      toast.error("Please enter a valid email.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: hp }),
      });
      if (!res.ok) throw new Error("failed");
      setDone(true);
      toast.success("You're on the list ✨", { description: "Dispatches from the seeker, now and then." });
      setEmail("");
    } catch {
      toast.error("Something went wrong", { description: "Please try again in a moment." });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <p className="headline flex items-center justify-center gap-2 py-3 text-center text-accent">
        <Sparkle twinkle />
        Thank you for joining
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="pg-form">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={hp}
        onChange={(e) => setHp(e.target.value)}
        className="pg-hp"
        aria-hidden="true"
      />
      <input
        type="email"
        placeholder="you@email.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="pg-input"
        aria-label="Email address"
        required
      />
      <Button type="submit" variant="filled" icon="send" disabled={submitting} className="min-h-[50px] text-[17px]">
        {submitting ? "Joining..." : "Subscribe"}
      </Button>
    </form>
  );
}

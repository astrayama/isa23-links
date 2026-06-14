"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const emailSchema = z.string().trim().email();

export function NewsletterSignup() {
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

  return (
    <div className="w-full rounded-3xl border-2 border-primary/30 bg-card/50 p-6 text-center backdrop-blur-sm">
      <Sparkles className="mx-auto mb-2 h-6 w-6 text-primary" />
      <h2 className="font-fredoka text-lg font-medium text-foreground glow-text">Join the journey</h2>
      <p className="mx-auto mt-1 max-w-xs text-sm font-quicksand text-foreground/60">
        Occasional dispatches from the seeker — new episodes, software, and stray thoughts on
        science &amp; spirit.
      </p>
      {done ? (
        <p className="mt-4 font-fredoka text-sm text-primary">Thank you for joining ✨</p>
      ) : (
        <form onSubmit={submit} className="mx-auto mt-4 flex max-w-sm gap-2">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            className="hidden"
            aria-hidden="true"
          />
          <Input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-primary/30 bg-background/50 focus:border-primary"
            aria-label="Email address"
            required
          />
          <Button type="submit" disabled={submitting} className="shrink-0 font-fredoka" aria-label="Subscribe">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}

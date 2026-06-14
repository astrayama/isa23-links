"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LinkButton } from "./link-button";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  purpose: z.string().min(1, "Please select a purpose"),
  message: z.string().trim().min(1, "Message is required").max(1000),
});

const PURPOSES = [
  { value: "inquiry", label: "General Inquiry" },
  { value: "collab", label: "Collaboration Opportunity" },
  { value: "job", label: "Job Opportunity" },
  { value: "speaking", label: "Speaking Engagement" },
  { value: "tarot", label: "Tarot Reading Inquiry" },
  { value: "mentorship", label: "Mentorship Request" },
  { value: "other", label: "Other" },
];

export function ContactDialog() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", purpose: "", message: "", company: "" });
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
      setOpen(false);
    } catch {
      toast.error("Something went wrong", { description: "Please try again in a moment." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <LinkButton icon={Mail} label="Contact" description="say hello, collaborate, or ask for access" onClick={() => setOpen(true)} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg border-primary/30 bg-card/90 backdrop-blur-md font-quicksand">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-fredoka text-foreground">
              <Mail className="h-5 w-5 text-primary" />
              Contact
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Let&apos;s connect! Fill out the form below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            {/* honeypot */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="hidden"
              aria-hidden="true"
            />
            <div className="space-y-2">
              <Label htmlFor="name" className="font-fredoka">Name</Label>
              <Input id="name" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border-primary/30 bg-background/50 focus:border-primary" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-fredoka">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border-primary/30 bg-background/50 focus:border-primary" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose" className="font-fredoka">Purpose</Label>
              <Select value={form.purpose} onValueChange={(v) => setForm({ ...form, purpose: v })}>
                <SelectTrigger className="border-primary/30 bg-background/50 focus:border-primary font-fredoka">
                  <SelectValue placeholder="Select a purpose" />
                </SelectTrigger>
                <SelectContent className="border-primary/30 bg-card/95 backdrop-blur-md">
                  {PURPOSES.map((p) => (
                    <SelectItem key={p.value} value={p.value} className="font-fredoka">
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message" className="font-fredoka">Message</Label>
              <Textarea id="message" placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="min-h-[120px] border-primary/30 bg-background/50 focus:border-primary" required />
            </div>
            <Button type="submit" className="w-full font-fredoka" disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

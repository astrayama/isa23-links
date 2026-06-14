"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";
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
import { LinkButton } from "./link-button";
import { lockedLinks } from "@/lib/links";

export function LockedLinks() {
  const [target, setTarget] = useState<{ key: string; label: string } | null>(null);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  const open = (key: string, label: string) => {
    setTarget({ key, label });
    setPasscode("");
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || !passcode) return;
    setLoading(true);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, key: target.key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        toast.error(data?.error || "Incorrect passcode", { description: "Please try again." });
        setPasscode("");
      } else {
        window.open(data.url, "_blank", "noopener,noreferrer");
        setTarget(null);
        setPasscode("");
      }
    } catch {
      toast.error("Something went wrong", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {lockedLinks.map((link) => (
          <LinkButton
            key={link.key}
            icon={link.icon}
            label={link.label}
            description={link.hint}
            showLock
            onClick={() => open(link.key, link.label)}
          />
        ))}
      </div>

      <Dialog open={target !== null} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent className="border-primary/30 bg-card/90 backdrop-blur-md font-quicksand">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-fredoka text-foreground">
              <Lock className="h-5 w-5 text-primary" />
              {target?.label}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter the passcode to continue
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter passcode"
              aria-label="Passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="border-primary/30 bg-background/50 focus:border-primary"
              autoFocus
              disabled={loading}
            />
            <Button type="submit" className="w-full font-fredoka" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Validating..." : "Unlock"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

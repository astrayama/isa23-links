"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
import { site } from "@/lib/site";
import { Button } from "./prism/glass";

/**
 * The "Ask for access" sheet's actions: message on Discord, send an email or
 * not now, plus a quiet "Have a passcode?" for people who already have one.
 */
export function AccessActions({
  link,
  onEmail,
  onClose,
}: {
  link: { key: string; label: string };
  onEmail: () => void;
  onClose: () => void;
}) {
  const id = useId();
  const [showPasscode, setShowPasscode] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    setLoading(true);
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode, key: link.key }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.url) {
        toast.error(data?.error || "Incorrect passcode", { description: "Please try again." });
        setPasscode("");
      } else {
        window.open(data.url, "_blank", "noopener,noreferrer");
        setPasscode("");
        onClose();
      }
    } catch {
      toast.error("Something went wrong", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="pg-sheet__actions">
        <Button variant="filled" icon="chat" href={site.discord.profile} external>
          Message on Discord
        </Button>
        <Button icon="mail" onClick={onEmail}>
          Send an email
        </Button>
        <Button onClick={onClose}>Not now</Button>
      </div>

      {showPasscode ? (
        <form onSubmit={unlock} className="pg-form mt-4">
          <label className="pg-field" htmlFor={`${id}-passcode`}>
            <span className="pg-field__label footnote">Passcode for {link.label}</span>
            <input
              id={`${id}-passcode`}
              type="password"
              className="pg-input"
              placeholder="Enter passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </label>
          <Button type="submit" variant="tinted" icon="lock" disabled={loading || !passcode}>
            {loading ? "Checking..." : "Unlock"}
          </Button>
        </form>
      ) : (
        <p className="pg-sheet__more footnote">
          <button type="button" className="pg-link" aria-expanded={false} onClick={() => setShowPasscode(true)}>
            Have a passcode?
          </button>
        </p>
      )}
    </>
  );
}

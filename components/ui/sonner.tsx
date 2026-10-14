"use client";

import type { CSSProperties } from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import { useMood } from "@/components/theme-provider";

/** Toasts on thick Prism Glass, following Dawn/Dusk. */
const Toaster = ({ ...props }: ToasterProps) => {
  const { mood } = useMood();
  return (
    <Sonner
      theme={mood === "dusk" ? "dark" : "light"}
      position="top-center"
      offset={60}
      style={
        {
          "--normal-bg": "var(--glass-thick)",
          "--normal-border": "var(--glass-outline)",
          "--normal-text": "var(--label)",
          "--border-radius": "var(--radius-md)",
        } as CSSProperties
      }
      toastOptions={{
        className: "font-sans !backdrop-blur-[36px] !backdrop-saturate-[1.8] !shadow-[var(--shadow-lift)]",
        classNames: { description: "!text-[var(--label-2)]" },
      }}
      {...props}
    />
  );
};

export { Toaster };

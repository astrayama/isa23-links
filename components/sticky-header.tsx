"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function StickyHeader() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > 260);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        shown ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="border-b border-primary/20 bg-background/70 backdrop-blur-md">
        <Link
          href="/"
          className="mx-auto flex max-w-3xl items-center gap-3 px-5 py-2.5 font-fredoka focus:outline-none"
        >
          <Image
            src="/img/avatar.jpg"
            alt="isa23"
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border border-primary/50 object-cover"
          />
          <span className="text-sm font-medium text-foreground/90">isa23</span>
          <span className="ml-auto text-sm font-bold text-primary glow-text">0 = 1 = ∞</span>
        </Link>
      </div>
    </header>
  );
}

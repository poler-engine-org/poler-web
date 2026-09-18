"use client";

import { useEffect, useState } from "react";
import { Hexagon } from "lucide-react";

const links = [
  { href: "#experiment", label: "Експеримент" },
  { href: "#triune", label: "Ядро" },
  { href: "#jit-demo", label: "Демо" },
  { href: "#benchmarks", label: "Бенчмарки" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled
          ? "border-zinc-800 bg-zinc-950/90 backdrop-blur"
          : "border-transparent bg-zinc-950"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5" aria-label="POLER Engine — на початок">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10">
            <Hexagon className="h-4.5 w-4.5 h-[18px] w-[18px] text-emerald-400" aria-hidden />
          </span>
          <span className="font-mono text-base font-bold tracking-tight text-zinc-50">
            POLER<span className="text-emerald-400">·</span>ENGINE
          </span>
        </a>
        <nav aria-label="Основна навігація" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 font-mono text-xs text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-emerald-300"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="https://github.com/poler-engine-org/poler-engine"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2 font-mono text-xs text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-300"
        >
          v0.22 · GitHub ↗
        </a>
      </div>
    </header>
  );
}

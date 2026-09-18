"use client";

import { useEffect, useState } from "react";
import { Hexagon, Activity, Radio } from "lucide-react";
import { checkEngineHealth, EngineHealth } from "@/lib/engine-client";

const links = [
  { href: "#triune", label: "Триєдине Ядро" },
  { href: "#jit-demo", label: "JIT-Пластичність" },
  { href: "#ingest-demo", label: "Інгестія & Пам'ять" },
  { href: "#benchmarks", label: "Бенчмарки" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [health, setHealth] = useState<EngineHealth>({ online: false });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    const pollHealth = async () => {
      const res = await checkEngineHealth();
      if (mounted) setHealth(res);
    };
    pollHealth();
    const timer = setInterval(pollHealth, 5000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-200 ${
        scrolled
          ? "border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md shadow-lg shadow-black/20"
          : "border-transparent bg-zinc-950"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5 group" aria-label="POLER Engine — на початок">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/40 bg-emerald-500/10 transition-colors group-hover:border-emerald-400 group-hover:bg-emerald-500/20">
            <Hexagon className="h-4.5 w-4.5 text-emerald-400" aria-hidden />
          </span>
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold tracking-tight text-zinc-50 flex items-center gap-1.5">
              POLER<span className="text-emerald-400">·</span>ENGINE
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                v0.36
              </span>
            </span>
          </div>
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

        <div className="flex items-center gap-3">
          {/* Engine Status Indicator */}
          <div
            className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full text-[11px] font-mono border transition-all ${
              health.online
                ? "bg-emerald-950/40 border-emerald-800/60 text-emerald-300"
                : "bg-zinc-900/60 border-zinc-800 text-zinc-400"
            }`}
            title={health.online ? `Connected to ${health.bind} (${health.latencyMs}ms)` : "Running in client simulation mode"}
          >
            <span className="relative flex h-2 w-2">
              {health.online && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  health.online ? "bg-emerald-400" : "bg-zinc-500"
                }`}
              ></span>
            </span>
            <span>{health.online ? `LIVE ENGINE (${health.latencyMs}ms)` : "SIMULATION"}</span>
          </div>

          <a
            href="https://github.com/poler-engine-org/poler-engine"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 font-mono text-xs text-zinc-300 transition-colors hover:border-emerald-500/50 hover:text-emerald-300"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </header>
  );
}

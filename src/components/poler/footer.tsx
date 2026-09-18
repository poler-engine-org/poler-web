"use client";

import { Github, Database, Terminal, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const milestones = [
  { hash: "cf0f0fd", text: "docs: стратегічний перехід до JIT-контуру" },
  { hash: "9d79322", text: "chore: скрипт докачки .pqw з HF" },
  { hash: "84d59fc", text: "fix: GLM half-rotary RoPE — кореневий баг" },
  { hash: "6ee2193", text: "feat: jit_loop — ваги вшиті в машинний код" },
  { hash: "6d07520", text: "feat: graph_asm — граф → x86_64" },
  { hash: "b2eae0a", text: "feat: CLI --jit-loop" },
];

export function Footer() {
  return (
    <footer className="bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <Terminal className="h-5 w-5 text-emerald-400" aria-hidden />
              <span className="font-mono text-lg font-bold text-zinc-50">
                POLER ENGINE
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-zinc-500">
              AI-Native топографічний резонансний пошуковий двигун на Rust.
              Нативні формати .pqw / .t5q, триєдине ядро пластичності,
              JIT-компіляція ваг у машинний код x86_64.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://github.com/poler-engine-org/poler-engine"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-emerald-300"
              >
                <Github className="h-4 w-4" aria-hidden />
                poler-engine-org/poler-engine
              </a>
              <a
                href="https://huggingface.co/VitalijKotok/poler-70b-t5q"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2 font-mono text-xs text-zinc-300 transition-colors hover:border-zinc-600 hover:text-amber-300"
              >
                <Database className="h-4 w-4" aria-hidden />
                VitalijKotok/poler-70b-t5q
              </a>
            </div>
          </div>

          <div>
            <div className="mb-3 font-mono text-xs uppercase tracking-widest text-zinc-500">
              Хронологія віх
            </div>
            <ul className="space-y-2">
              {milestones.map((m) => (
                <li
                  key={m.hash}
                  className="flex items-center gap-3 font-mono text-xs text-zinc-400"
                >
                  <span className="shrink-0 rounded bg-zinc-800/80 px-1.5 py-0.5 text-emerald-300">
                    {m.hash}
                  </span>
                  <span className="truncate">{m.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-zinc-800" />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-zinc-600" aria-hidden />
            POLER Custom Source-Available License v1.0
          </div>
          <div className="font-mono text-xs text-zinc-600">
            Rust 1.98 · 1265 тестів · 0 clippy-попереджень
          </div>
        </div>
      </div>
    </footer>
  );
}

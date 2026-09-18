"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, GitBranch, Database, ArrowDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    icon: Database,
    value: "6.2 млрд",
    label: "параметрів ChatGLM3-6B портовано на чистий Rust",
    accent: "text-emerald-400",
  },
  {
    icon: Zap,
    value: "0.987",
    label: "косинусна схожість квантування Int4 / Trit5",
    accent: "text-amber-400",
  },
  {
    icon: Cpu,
    value: "×3000",
    label: "швидше: JIT-контур проти статичного декодера",
    accent: "text-emerald-400",
  },
  {
    icon: GitBranch,
    value: "100%",
    label: "пластичність: Hebbian STDP + ротор J = A − Aᵀ",
    accent: "text-amber-400",
  },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-800">
      {/* фонова сітка */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #3f3f46 1px, transparent 1px), linear-gradient(to bottom, #3f3f46 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-emerald-500/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-40 right-0 h-[320px] w-[320px] rounded-full bg-amber-500/10 blur-[100px]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-16 pt-20 text-center sm:px-6 md:pb-24 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Badge
            variant="outline"
            className="mb-6 max-w-full flex-wrap justify-center gap-2 border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-center font-mono text-[11px] text-emerald-300 sm:text-xs"
          >
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            18 вересня 2026 · стратегічний перехід зафіксовано
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl bg-gradient-to-br from-zinc-50 via-zinc-200 to-zinc-500 bg-clip-text font-sans text-4xl font-bold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl"
        >
          Ваги — це{" "}
          <span className="bg-gradient-to-r from-emerald-300 to-amber-300 bg-clip-text text-transparent">
            машинний код
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 max-w-2xl text-balance text-base leading-relaxed text-zinc-400 sm:text-lg"
        >
          Ми довели, що 6.2-мільярдна модель живе в нативному форматі{" "}
          <code className="rounded bg-zinc-800/80 px-1.5 py-0.5 font-mono text-sm text-emerald-300">
            .pqw
          </code>{" "}
          без Python, PyTorch і GPU. Але справжнє майбутнє — не повільний
          перебір 28 шарів, а JIT-контур, де кожна вага — пряма інструкція
          процесора, що самопереписується.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((s, i) => (
            <motion.div
              key={s.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 text-left backdrop-blur transition-colors hover:border-zinc-600"
            >
              <s.icon className={`mb-3 h-6 w-6 ${s.accent}`} aria-hidden />
              <div className="font-mono text-2xl font-bold text-zinc-50">
                {s.value}
              </div>
              <div className="mt-1 text-sm leading-snug text-zinc-400">
                {s.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.a
          href="#experiment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-14 flex flex-col items-center gap-2 text-zinc-500 transition-colors hover:text-emerald-300"
          aria-label="Прокрутити до експерименту"
        >
          <span className="font-mono text-xs uppercase tracking-widest">
            як це було
          </span>
          <ArrowDown className="h-5 w-5 animate-bounce" aria-hidden />
        </motion.a>
      </div>
    </section>
  );
}

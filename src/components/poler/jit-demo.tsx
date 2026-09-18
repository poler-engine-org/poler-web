"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  Cpu,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

/* ---------- Детермінований PRNG (однаково на SSR і клієнті) ---------- */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Параметри симуляції ---------- */
const COLS = 64;
const ROWS = 12;
const N = COLS * ROWS; // 768 тритів
const ETA = 0.042;
const THRESH = 0.12; // поріг тритизації (однаковий для ініціалізації та кроків)

type Phase = "idle" | "forward" | "hebb" | "trits" | "commit" | "recompile";

const PHASES: { id: Phase; label: string; detail: string }[] = [
  { id: "forward", label: "Forward", detail: "y = W·x — прямі інструкції x86_64" },
  { id: "hebb", label: "Hebb STDP", detail: "Δw = η·y·xᵀ — ваги-fire разом" },
  { id: "trits", label: "Трити", detail: "квантування {−1, 0, +1} in-place" },
  { id: "commit", label: "Commit", detail: "SHA-256 стану ваг" },
  { id: "recompile", label: "Ре-JIT", detail: "перекомпіляція машинного коду" },
];

const ASM_SNIPPET = [
  "mov    eax, 0x3f000000",
  "movd   xmm0, eax",
  "addss  xmm1, xmm0",
  "mov    eax, 0xbf000000",
  "movd   xmm2, eax",
  "subss  xmm3, xmm2",
];

/* ---------- Хеш стану (демо-FNV) ---------- */
function fnv1a(bytes: Int8Array): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < bytes.length; i++) {
    h ^= bytes[i] & 0xff;
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

type LogEntry = {
  cycle: number;
  ynorm: number;
  changed: number;
  hash: string;
};

type State = {
  w: Float32Array; // внутрішні ваги
  trits: Int8Array; // показові трити
  x: Float32Array;
};

function initState(seed: number): State {
  const rnd = mulberry32(seed);
  const w = new Float32Array(N);
  const trits = new Int8Array(N);
  for (let i = 0; i < N; i++) {
    const v = (rnd() * 2 - 1) * 0.25;
    w[i] = v;
    trits[i] = v > THRESH ? 1 : v < -THRESH ? -1 : 0;
  }
  const x = new Float32Array(COLS);
  for (let j = 0; j < COLS; j++) x[j] = rnd() * 2 - 1;
  return { w, trits, x };
}

function step(s: State): {
  ynorm: number;
  changed: number;
  hash: string;
  changedIdx: number[];
} {
  const { w, trits, x } = s;
  // Forward по тритах (як у Trit5): y = T·x, T ∈ {−1, 0, +1}
  let y2 = 0;
  const y = new Float32Array(ROWS);
  for (let r = 0; r < ROWS; r++) {
    let acc = 0;
    for (let c = 0; c < COLS; c++) acc += trits[r * COLS + c] * x[c];
    y[r] = acc;
    y2 += acc * acc;
  }
  const ynorm = Math.sqrt(y2);
  // Hebb: Δw = η·y·xᵀ (внутрішні ваги — без обмежень)
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      w[r * COLS + c] += ETA * y[r] * x[c];
  // Тритизація: ефективні ваги = трити (кліп природно обмежує ріст)
  const changedIdx: number[] = [];
  for (let i = 0; i < N; i++) {
    const v = w[i];
    const t = v > THRESH ? 1 : v < -THRESH ? -1 : 0;
    if (t !== trits[i]) {
      trits[i] = t;
      changedIdx.push(i);
    }
  }
  const hash = fnv1a(trits);
  return { ynorm, changed: changedIdx.length, hash, changedIdx };
}

/* ---------- Кольори тритів ---------- */
function tritClass(t: number, fresh: boolean): string {
  const base = fresh ? "animate-pulse " : "";
  if (t > 0) return `${base}bg-emerald-400`;
  if (t < 0) return `${base}bg-rose-400`;
  return `${base}bg-zinc-700`;
}

export function JitDemo() {
  const [state, setState] = useState<State>(() => initState(20260918));
  const [cycle, setCycle] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [running, setRunning] = useState(false);
  const [fresh, setFresh] = useState<Set<number>>(new Set());
  const [log, setLog] = useState<LogEntry[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const stateRef = useRef(state);
  stateRef.current = state;

  const runCycle = useCallback(() => {
    // Послідовна анімація фаз
    const seq: Phase[] = ["forward", "hebb", "trits", "commit", "recompile"];
    let idx = 0;
    const tick = () => {
      if (idx >= seq.length) {
        // Застосувати мутацію
        const s = stateRef.current;
        const res = step(s);
        setFresh(new Set(res.changedIdx));
        setState({ ...s });
        setCycle((c) => c + 1);
        setLog((l) =>
          [{ cycle: (l[0]?.cycle ?? 0) + 1, ...res }, ...l].slice(0, 24),
        );
        setHistory((h) => [...h, res.ynorm].slice(-120));
        setPhase("idle");
        return;
      }
      const p = seq[idx];
      setPhase(p);
      idx++;
      setTimeout(tick, 170);
    };
    tick();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (cycle >= 40) {
      setRunning(false);
      return;
    }
    const t = setTimeout(runCycle, 260);
    return () => clearTimeout(t);
  }, [running, cycle, runCycle]);

  const lastY = history.length ? history[history.length - 1] : 0;
  const maxY = Math.max(1, ...history);

  const spark = useMemo(() => {
    if (history.length < 2) return "";
    const w = 280;
    const h = 56;
    return history
      .map((v, i) => {
        const x = (i / (history.length - 1)) * w;
        const y = h - (v / maxY) * (h - 6) - 3;
        return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");
  }, [history, maxY]);

  const phaseIdx = PHASES.findIndex((p) => p.id === phase);

  return (
    <section id="jit-demo" className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <Cpu className="h-4 w-4" aria-hidden />
            Живе демо
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            JIT-контур у дії
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            Симуляція циклу пластичності на клієнті: кожен крок — це реальні
            арифметичні операції (forward, Hebbian STDP, тритизація), які в
            poler-engine виконуються згенерованим машинним кодом. Спостерігайте,
            як норма виходу росте, а трити перебудовуються.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Ліва колонка: керування + конвеєр */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="h-full border-zinc-800 bg-zinc-900/40">
              <CardHeader>
                <CardTitle className="font-mono text-base text-zinc-100">
                  Конвеєр пластичності
                </CardTitle>
                <CardDescription className="font-mono text-xs text-zinc-500">
                  cycle #{cycle} · {running ? "виконання" : "пауза"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ol className="space-y-2">
                  {PHASES.map((p, i) => {
                    const active = phase === p.id;
                    const done =
                      phaseIdx > i || (phase === "idle" && cycle > 0 && i < 5);
                    return (
                      <li
                        key={p.id}
                        className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                          active
                            ? "border-emerald-500/60 bg-emerald-500/10"
                            : done
                              ? "border-zinc-800 bg-zinc-950/60"
                              : "border-zinc-800/60 bg-zinc-950/30"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                            active
                              ? "bg-emerald-400 text-zinc-950"
                              : done
                                ? "bg-zinc-700 text-zinc-300"
                                : "bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <div
                            className={`font-mono text-sm font-semibold ${
                              active ? "text-emerald-300" : "text-zinc-300"
                            }`}
                          >
                            {p.label}
                          </div>
                          <div className="truncate text-xs text-zinc-500">
                            {p.detail}
                          </div>
                        </div>
                        {i < PHASES.length - 1 && (
                          <ArrowRight
                            className="ml-auto h-4 w-4 shrink-0 text-zinc-700"
                            aria-hidden
                          />
                        )}
                      </li>
                    );
                  })}
                </ol>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => setRunning((r) => !r)}
                    disabled={cycle >= 40}
                    className={`font-mono ${
                      running
                        ? "bg-amber-500 text-zinc-950 hover:bg-amber-400"
                        : "bg-emerald-400 text-zinc-950 hover:bg-emerald-300"
                    }`}
                  >
                    {running ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" aria-hidden /> Пауза
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" aria-hidden /> Запустити
                        40 циклів
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={runCycle}
                    disabled={running || cycle >= 40}
                    className="border-zinc-700 font-mono text-zinc-200 hover:bg-zinc-800"
                  >
                    <StepForward className="mr-2 h-4 w-4" aria-hidden /> Крок
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setRunning(false);
                      setState(initState(20260918));
                      setCycle(0);
                      setPhase("idle");
                      setLog([]);
                      setHistory([]);
                      setFresh(new Set());
                    }}
                    className="border-zinc-700 font-mono text-zinc-200 hover:bg-zinc-800"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" aria-hidden /> Скинути
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      ‖y‖ вихід
                    </div>
                    <div className="font-mono text-2xl font-bold text-emerald-300">
                      {lastY.toFixed(3)}
                    </div>
                    <svg
                      viewBox="0 0 280 56"
                      className="mt-1 h-12 w-full"
                      aria-label="Графік росту норми виходу"
                      role="img"
                    >
                      <path
                        d={spark}
                        fill="none"
                        stroke="#34d399"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <div className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-3">
                    <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      змінено тритів
                    </div>
                    <div className="font-mono text-2xl font-bold text-amber-300">
                      {log[0]?.changed ?? 0}
                    </div>
                    <div className="mt-3 truncate font-mono text-[10px] text-zinc-500">
                      sha: {log[0]?.hash ?? "—"}
                    </div>
                    <div className="mt-1 font-mono text-[10px] text-zinc-600">
                      768 тритів · η={ETA}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Права колонка: сітка тритів + лог + асм */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="h-full border-zinc-800 bg-zinc-900/40">
              <CardHeader>
                <CardTitle className="font-mono text-base text-zinc-100">
                  Тритова матриця W (768 ваг)
                </CardTitle>
                <CardDescription className="font-mono text-xs text-zinc-500">
                  <span className="mr-3 inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-emerald-400" />
                    +1
                  </span>
                  <span className="mr-3 inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-rose-400" />
                    −1
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm bg-zinc-700" />
                    0
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-3">
                  <div
                    className="grid gap-[3px]"
                    style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
                    role="img"
                    aria-label="Візуалізація тритових ваг"
                  >
                    {Array.from(state.trits).map((t, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-[2px] ${tritClass(
                          t,
                          fresh.has(i),
                        )}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Згенерований код (фрагмент)
                    </div>
                    <div className="rounded-lg border border-zinc-800 bg-black/60 p-3 font-mono text-[11px] leading-relaxed">
                      {ASM_SNIPPET.map((l) => (
                        <div key={l} className="text-zinc-400">
                          <span className="text-emerald-500/80">{"› "}</span>
                          {l}
                        </div>
                      ))}
                      <div className="text-zinc-600">
                        {"› "}…{N} ваг × 6 інструкцій
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                      Журнал циклів
                    </div>
                    <ScrollArea className="h-[168px] rounded-lg border border-zinc-800 bg-black/60">
                      <div className="p-3 font-mono text-[11px] leading-relaxed">
                        <AnimatePresence initial={false}>
                          {log.length === 0 && (
                            <div className="text-zinc-600">
                              очікування запуску…
                            </div>
                          )}
                          {log.map((e) => (
                            <motion.div
                              key={e.cycle}
                              initial={{ opacity: 0, y: -8 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="text-zinc-400"
                            >
                              <span className="text-zinc-600">
                                cycle {String(e.cycle).padStart(2, "0")}
                              </span>{" "}
                              ‖y‖={e.ynorm.toFixed(2)}{" "}
                              <span className="text-amber-400/90">
                                Δ{e.changed}
                              </span>{" "}
                              <span className="text-zinc-600">
                                {e.hash}
                              </span>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

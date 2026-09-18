"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Gem,
  Tornado,
  Bug,
  Boxes,
  Send,
  Sparkles,
  Zap,
  Activity,
  Compass,
  Cpu,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { callTriuneSpeak, TriuneSpeakResponse } from "@/lib/engine-client";

const triuneCards = [
  {
    icon: Gem,
    name: "Trit5-Кристал",
    subtitle: "Cerebellum · ваги в машинному коді",
    accent: "text-emerald-400",
    badge: "No-Mul SIMD",
    ring: "border-emerald-900/40 bg-emerald-950/10",
    points: [
      "Трити {−1, 0, +1}: обчислення без жодного множення — тільки додавання і віднімання",
      "Dense matvec компілюється в прямі інструкції x86_64: вага вшита як immediate",
      "1024 ваги = 22.8 КБ чистого машинного коду, біт-в-біт детермінізм",
    ],
  },
  {
    icon: Tornado,
    name: "SSN-Вихор",
    subtitle: "Synaptic Storm · пластичність",
    accent: "text-amber-400",
    badge: "Гомеостаз 5%",
    ring: "border-amber-900/40 bg-amber-950/10",
    points: [
      "Hebbian STDP: ваги мутують in-place між тактaми за правилом співзбудження",
      "Ротор антисиметрії J = A − Aᵀ гарантує циркуляцію фаз без згасання",
      "Нейромедіатори DA / 5HT / NE регулюють температуру генерації [0.6, 1.8]",
    ],
  },
  {
    icon: Bug,
    name: "Мозок мухи FLYCSR1",
    subtitle: "Картридж · швидкість",
    accent: "text-rose-400",
    badge: "140k нейронів",
    ring: "border-rose-900/40 bg-rose-950/10",
    points: [
      "140 000 нейронів дрозофіли: локальний картридж-мапінг без глобальних матриць",
      "Пульс і драйв γ запобігають зацикленню думок і розводять лексику",
      "Реакція на рівні тактів процесора (4 ГГц) без оверхеду пам'яті",
    ],
  },
];

const PRESETS = [
  "Привіт, як справи?",
  "Хто ти і як влаштоване твоє ядро?",
  "Поясни квантовий ротор антисиметрії",
  "Синтезуй детерміновану думку",
];

export function Triune() {
  const [prompt, setPrompt] = useState("Привіт, як справи?");
  const [tokensCount, setTokensCount] = useState(24);
  const [seed, setSeed] = useState(777);
  const [gamma, setGamma] = useState(0.8);
  const [isPending, startTransition] = useTransition();
  const [response, setResponse] = useState<TriuneSpeakResponse | null>(null);

  const handleSpeak = (targetPrompt?: string) => {
    const textToSpeak = targetPrompt || prompt;
    startTransition(async () => {
      const res = await callTriuneSpeak(textToSpeak, tokensCount, seed, gamma);
      setResponse(res);
    });
  };

  return (
    <section id="triune" className="border-b border-zinc-800 bg-zinc-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <Boxes className="h-4 w-4" aria-hidden />
            Триєдине Ядро (Triune Architecture)
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Мозок мухи + Синаптичний вихор + Кристал знань
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            Поєднання трьох доведених підсистем у єдину мовну цілісність: Кристал (.t5c)
            зберігає No-Mul трити, SSN-вихор підтримує гомеостаз і критичність, а коннектом
            мухи задає ритм і розриває когнітивні петлі.
          </p>
        </motion.div>

        {/* 3 Core Pillars Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mb-12">
          {triuneCards.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className={`h-full border ${t.ring} relative overflow-hidden group`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                      <t.icon className={`h-5 w-5 ${t.accent}`} />
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900/80 border border-zinc-800 text-zinc-400">
                      {t.badge}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-zinc-100">{t.name}</CardTitle>
                  <CardDescription className="text-xs font-mono text-zinc-400">
                    {t.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    {t.points.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Interactive Live Speech Console */}
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 backdrop-blur-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-400" />
              <h3 className="font-mono text-sm font-semibold text-zinc-100 uppercase tracking-wide">
                Живий Триєдиний Діалог & Телеметрія
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Порт 127.0.0.1:8765
              </span>
            </div>
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs text-zinc-500 self-center mr-1 font-mono">Промпти:</span>
            {PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p);
                  handleSpeak(p);
                }}
                className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800/70 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Prompt input row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Введіть запитання або сенсорний промпт..."
              className="flex-1 bg-zinc-950 border-zinc-800 font-mono text-sm focus-visible:ring-emerald-500/50"
              onKeyDown={(e) => e.key === "Enter" && handleSpeak()}
            />
            <Button
              onClick={() => handleSpeak()}
              disabled={isPending}
              className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono font-medium px-6 gap-2"
            >
              {isPending ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Генерація...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Синтез Мови
                </>
              )}
            </Button>
          </div>

          {/* Controls row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-xs font-mono mb-6">
            <div>
              <span className="text-zinc-500 block mb-1">Токени: {tokensCount}</span>
              <input
                type="range"
                min="8"
                max="64"
                step="4"
                value={tokensCount}
                onChange={(e) => setTokensCount(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Драйв мухи γ: {gamma}</span>
              <input
                type="range"
                min="0.0"
                max="2.0"
                step="0.1"
                value={gamma}
                onChange={(e) => setGamma(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Seed: {seed}</span>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-200"
              />
            </div>
            <div>
              <span className="text-zinc-500 block mb-1">Режим зв&apos;язку:</span>
              <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/60 text-emerald-300 font-mono text-[11px]">
                {response?.simulated ? "Локальна емуляція" : "Прямий MCP HTTP"}
              </span>
            </div>
          </div>

          {/* Results Output */}
          <AnimatePresence mode="wait">
            {response ? (
              <motion.div
                key={response.session}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Spoken Text Box */}
                <div className="rounded-lg border border-emerald-900/40 bg-emerald-950/20 p-5">
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5" />
                      Синтезована відповідь:
                    </span>
                    <span className="text-zinc-500">{response.tokens_count} токенів</span>
                  </div>
                  <p className="text-lg font-mono text-zinc-100 leading-relaxed">
                    «{response.text}»
                  </p>
                </div>

                {/* Neuromodulator Telemetry Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-500">Дофамін (DA)</div>
                    <div className="text-base font-mono font-bold text-amber-400 mt-1">
                      {response.telemetry.dopamine.toFixed(2)}
                    </div>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full"
                        style={{ width: `${response.telemetry.dopamine * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-500">Серотонін (5HT)</div>
                    <div className="text-base font-mono font-bold text-emerald-400 mt-1">
                      {response.telemetry.serotonin.toFixed(2)}
                    </div>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${response.telemetry.serotonin * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-500">Норадреналін (NE)</div>
                    <div className="text-base font-mono font-bold text-rose-400 mt-1">
                      {response.telemetry.norepinephrine.toFixed(2)}
                    </div>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-rose-400 h-full rounded-full"
                        style={{ width: `${response.telemetry.norepinephrine * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                    <div className="text-[11px] font-mono text-zinc-500">Критичність</div>
                    <div className="text-base font-mono font-bold text-cyan-400 mt-1">
                      {response.telemetry.criticality.toFixed(3)}
                    </div>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${Math.min(response.telemetry.criticality, 1) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 col-span-2 sm:col-span-1">
                    <div className="text-[11px] font-mono text-zinc-500">Гомеостаз (S)</div>
                    <div className="text-base font-mono font-bold text-violet-400 mt-1">
                      {(response.telemetry.activity * 100).toFixed(1)}%
                    </div>
                    <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-violet-400 h-full rounded-full"
                        style={{ width: `${response.telemetry.activity * 500}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Token Trace Table */}
                {response.trace && response.trace.length > 0 && (
                  <div className="rounded-lg border border-zinc-800 overflow-x-auto bg-zinc-950">
                    <table className="w-full text-left font-mono text-xs text-zinc-400">
                      <thead className="border-b border-zinc-800 bg-zinc-900/60 text-zinc-300">
                        <tr>
                          <th className="p-2.5">Токен</th>
                          <th className="p-2.5">Sem (CSE)</th>
                          <th className="p-2.5">NMDA Gate</th>
                          <th className="p-2.5">Syn (Trit)</th>
                          <th className="p-2.5">Fly Pulse</th>
                          <th className="p-2.5">Score</th>
                          <th className="p-2.5">Tau</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900">
                        {response.trace.slice(0, 8).map((t, idx) => (
                          <tr key={idx} className="hover:bg-zinc-900/30">
                            <td className="p-2.5 font-bold text-zinc-200">{t.token}</td>
                            <td className="p-2.5 text-emerald-400">{t.sem.toFixed(3)}</td>
                            <td className="p-2.5 text-amber-400">{t.gate.toFixed(3)}</td>
                            <td className="p-2.5 text-cyan-400">{t.syn > 0 ? "+1" : t.syn < 0 ? "-1" : "0"}</td>
                            <td className="p-2.5 text-rose-400">{t.fly.toFixed(3)}</td>
                            <td className="p-2.5 text-zinc-300">{t.score.toFixed(3)}</td>
                            <td className="p-2.5 text-zinc-400">{t.tau.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="py-8 text-center text-xs font-mono text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                Натисніть «Синтез Мови» або виберіть готовий промпт вище для запуску контуру.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

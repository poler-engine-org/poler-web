"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Globe,
  FileText,
  Binary,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { callCrystalIngest, IngestResponse } from "@/lib/engine-client";

const SAMPLE_TEXTS = [
  {
    title: "Триєдина Архітектура (UA)",
    text: "Триєдина архітектура об'єднує мозок мухи, синаптичний вихор та кристалізовану пам'ять знань. Трити No-Mul забезпечують адитивні обчислення без множення.",
  },
  {
    title: "Quantum Causal Dynamics (EN)",
    text: "POLER causal dynamics operates through antisymmetric rotor phase space. State vectors undergo continuous unitary evolution without discrete transformer backprop.",
  },
  {
    title: "x86_64 JIT Self-Rewriting (Code)",
    text: "Graph-to-machine-code compilation emits pure x86_64 opcodes directly. Immediate 32-bit floats mutate in place during STDP learning cycles at sub-millisecond latency.",
  },
];

export function IngestDemo() {
  const [corpusText, setCorpusText] = useState(SAMPLE_TEXTS[0].text);
  const [vocabLimit, setVocabLimit] = useState(384);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<IngestResponse | null>(null);

  const handleIngest = (textOverride?: string) => {
    const text = textOverride || corpusText;
    startTransition(async () => {
      const res = await callCrystalIngest(text, vocabLimit);
      setResult(res);
    });
  };

  return (
    <section id="ingest-demo" className="border-b border-zinc-800 bg-zinc-950 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <Database className="h-4 w-4" aria-hidden />
            Постійна Пам&apos;ять & Динамічне Навчання
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Потокова Інгестія в Кристал (.t5c / .t5q)
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            Навчання без утримання всього інтернету в оперативній пам&apos;яті.
            Текст і веб-сторінки квантуються на льоту в трійкову решітку {"{−1, 0, +1}"} (Trit5, 5 тритів/байт)
            та одразу компілюються в x86_64 машинний код.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input & Preset Panel */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="border-zinc-800 bg-zinc-900/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-mono text-zinc-200 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-emerald-400" />
                  Корпус або Веб-Текст для Інгестії
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Виберіть шаблон або введіть довільний текст
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Presets */}
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_TEXTS.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCorpusText(s.text);
                        handleIngest(s.text);
                      }}
                      className="text-xs font-mono px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                    >
                      {s.title}
                    </button>
                  ))}
                </div>

                <Textarea
                  value={corpusText}
                  onChange={(e) => setCorpusText(e.target.value)}
                  rows={6}
                  placeholder="Вставте текст статей, коду або документації..."
                  className="bg-zinc-950 border-zinc-800 font-mono text-xs text-zinc-200 resize-none focus-visible:ring-emerald-500/50"
                />

                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="text-xs font-mono text-zinc-500">
                    Ліміт словника: <span className="text-zinc-300">{vocabLimit}</span>
                  </div>
                  <Button
                    onClick={() => handleIngest()}
                    disabled={isPending}
                    className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-mono text-xs font-semibold px-5 gap-2"
                  >
                    {isPending ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Квантування...
                      </>
                    ) : (
                      <>
                        <Binary className="h-3.5 w-3.5" />
                        Інгестувати в Кристал
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compilation Output & Metrics */}
          <div className="lg:col-span-6">
            <Card className="h-full border-zinc-800 bg-zinc-900/40">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-mono text-zinc-200 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-emerald-400" />
                  Метрики Кристалізованого Артефакту
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  Результат потокової збірки в формат .t5c
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {result ? (
                    <motion.div
                      key={result.sha256_hex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs">
                        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                          <span className="text-zinc-500 block">Всього слів</span>
                          <span className="text-base font-bold text-zinc-100 mt-1 block">
                            {result.total_words}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                          <span className="text-zinc-500 block">Унікальних токенів</span>
                          <span className="text-base font-bold text-emerald-400 mt-1 block">
                            {result.unique_tokens}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                          <span className="text-zinc-500 block">Словник (.t5c)</span>
                          <span className="text-base font-bold text-amber-400 mt-1 block">
                            {result.crystal_vocab}
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                          <span className="text-zinc-500 block">Розмір файлу</span>
                          <span className="text-base font-bold text-cyan-400 mt-1 block">
                            {(result.crystal_bytes / 1024).toFixed(2)} KB
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                          <span className="text-zinc-500 block">Стиснення Trit5</span>
                          <span className="text-base font-bold text-rose-400 mt-1 block">
                            1.58 біт/трит
                          </span>
                        </div>
                        <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                          <span className="text-zinc-500 block">Множення (MUL)</span>
                          <span className="text-base font-bold text-emerald-300 mt-1 block">
                            0 (No-Mul)
                          </span>
                        </div>
                      </div>

                      {/* SHA-256 Hash Box */}
                      <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800">
                        <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 mb-1">
                          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                          Детермінований SHA-256 хеш кристалу:
                        </div>
                        <div className="font-mono text-[11px] text-emerald-300 break-all bg-zinc-900/80 p-2 rounded border border-zinc-800">
                          {result.sha256_hex}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="py-12 text-center text-xs font-mono text-zinc-500 border border-dashed border-zinc-800 rounded-lg">
                      Натисніть «Інгестувати в Кристал» для початку аналізу.
                    </div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}

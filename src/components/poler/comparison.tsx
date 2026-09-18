"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const rows = [
  {
    criterion: "Затримка (Latency)",
    oldWay: "25 000 – 30 000 мс",
    newWay: "0.1 – 10 мс",
    highlight: "×3000",
  },
  {
    criterion: "Принцип роботи",
    oldWay: "Послідовний перебір 28 шарів матриць",
    newWay: "Прямі апаратні інструкції x86_64",
    highlight: null,
  },
  {
    criterion: "Множення",
    oldWay: "Мільярди операцій FP/INT MAC",
    newWay: "No-Mul: тільки + та − для Trit5",
    highlight: "0 mul",
  },
  {
    criterion: "Пластичність",
    oldWay: "0% — ваги застиглі",
    newWay: "100% Hebbian STDP + ротор J = A − Aᵀ",
    highlight: "жива",
  },
  {
    criterion: "Самомодифікація",
    oldWay: "Неможлива без GPU-кластера",
    newWay: "Код сам перекомпілює власні біти на льоту",
    highlight: null,
  },
];

export function Comparison() {
  return (
    <section className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <ArrowRightLeft className="h-4 w-4" aria-hidden />
            Стратегічне рішення
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Статичний декодер → JIT-контур навчання
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            Замість того, щоб ганяти гігабайти статичних матриць через
            повільні цикли декодера — пряме машинне навчання: вага вшита в код
            як immediate, що його сам рухає.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-x-auto rounded-xl border border-zinc-800"
        >
          <Table className="min-w-[560px]">
            <TableHeader>
              <TableRow className="border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900/60">
                <TableHead className="w-[22%] font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Критерій
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-amber-400/90">
                  Статичний LLM-декодер (6B)
                </TableHead>
                <TableHead className="font-mono text-xs uppercase tracking-wider text-emerald-400">
                  Навчальний JIT-контур
                </TableHead>
                <TableHead className="w-[10%] text-right font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Δ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r, i) => (
                <motion.tr
                  key={r.criterion}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.07 }}
                  className="border-zinc-800/70 bg-zinc-950/40"
                >
                  <TableCell className="font-medium text-zinc-300">
                    {r.criterion}
                  </TableCell>
                  <TableCell className="text-zinc-500">{r.oldWay}</TableCell>
                  <TableCell className="text-zinc-100">
                    <span className="font-medium">{r.newWay}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {r.highlight && (
                      <Badge
                        variant="outline"
                        className="border-emerald-500/40 bg-emerald-500/10 font-mono text-emerald-300"
                      >
                        {r.highlight}
                      </Badge>
                    )}
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </section>
  );
}

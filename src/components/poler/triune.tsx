"use client";

import { motion } from "framer-motion";
import { Gem, Tornado, Bug, Boxes } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const triune = [
  {
    icon: Gem,
    name: "Trit5-кристал",
    subtitle: "Cerebellum · ваги = машинний код",
    accent: "text-emerald-300",
    ring: "border-emerald-900/50",
    glow: "bg-emerald-500/5",
    points: [
      "Трити {−1, 0, +1}: обчислення без жодного множення — тільки додавання і віднімання",
      "Dense matvec компілюється в прямі інструкції x86_64: вага вшита як immediate (mov eax, <біти f32> → movd → mulss)",
      "1024 ваги = 22.8 КБ чистого машинного коду; виконання біт-в-біт дорівнює Rust-циклу (IEEE-754)",
      "Граф → машинний код: graph_asm.rs емітує ELF-подібний блок даних",
    ],
  },
  {
    icon: Tornado,
    name: "SSN-вихор",
    subtitle: "Synaptic Storm Network · пластичність",
    accent: "text-amber-300",
    ring: "border-amber-900/50",
    glow: "bg-amber-500/5",
    points: [
      "Hebbian STDP: ваги змінюються за правилом співпрацівництва пре/постсинаптичних активацій",
      "Ротор антисиметрії J = A − Aᵀ гарантує нульовий слід — циркуляція, а не дифузія",
      "In-place мутація тритів: 4 КБ коду самопереписується між тактами",
      "Commit SHA-256 ваг після кожного циклу — детермінована історія еволюції",
    ],
  },
  {
    icon: Bug,
    name: "Мозок мухи FLYCSR1",
    subtitle: "Cartridge-архітектура · швидкість",
    accent: "text-rose-300",
    ring: "border-rose-900/50",
    glow: "bg-rose-500/5",
    points: [
      "Натхнення: 140 000 нейронів дрозофіли, де кожен нейрон рахує на тактовій частоті",
      "Каратрид-мапінг замість шарів: локальні обчислення без глобальних матриць",
      "Компіляція у власний машинний код — жодного виклику вузького місця пам'яті",
      "Ціль: реакція на рівні тактів процесора (4 ГГц), а не пропускної здатності RAM",
    ],
  },
];

export function Triune() {
  return (
    <section id="triune" className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <Boxes className="h-4 w-4" aria-hidden />
            Триєдине ядро
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Три органи, один контур
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            Архітектура поєднує кристал детермінованих обчислень, вихор
            синаптичної пластичності та картриджну швидкість мозку мухи —
            три модулі, що замикають цикл «обчислення → навчання →
            перекомпіляція» за мілісекунди.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {triune.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card
                className={`group relative h-full overflow-hidden border ${t.ring} bg-zinc-900/40 transition-colors hover:border-zinc-600`}
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-0 ${t.glow}`}
                />
                <CardHeader className="relative">
                  <div
                    className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/80`}
                  >
                    <t.icon className={`h-6 w-6 ${t.accent}`} aria-hidden />
                  </div>
                  <CardTitle className={`text-lg ${t.accent}`}>{t.name}</CardTitle>
                  <CardDescription className="font-mono text-xs text-zinc-500">
                    {t.subtitle}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-3">
                    {t.points.map((p) => (
                      <li key={p.slice(0, 24)} className="flex gap-2.5">
                        <span
                          className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                            t.accent.replace("text-", "bg-")
                          }`}
                          aria-hidden
                        />
                        <span className="text-sm leading-relaxed text-zinc-400">
                          {p}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

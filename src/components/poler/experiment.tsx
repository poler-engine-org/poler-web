"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, FlaskConical, HardDrive } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const wins = [
  {
    title: "Квантування без втрат сенсу",
    detail:
      "6.2 млрд параметрів → Int4 / Trit5, косинусна схожість 0.987. Файл 3.0 ГБ повністю відтворює семантику оригіналу.",
  },
  {
    title: "Half-Rotary RoPE відновлено",
    detail:
      "Кореневий баг знайдено читанням еталона: обертаються лише перші 64 зі 128 вимірів голови (x_pass проходить напряму). Після фіксу 84d59fc модель видає осмислений текст замість сміття «✅»×128.",
  },
  {
    title: "Нуль Python-залежностей",
    detail:
      "Повний інференс — квантування, GQA, SwiGLU, RoPE, softmax — на чистому Rust. Один бінарник 16 МБ, 1265 зелених тестів.",
  },
  {
    title: "Артефакт збережено",
    detail:
      "chatglm3-6b-int4.pqw (md5 верифіковано) законсервовано у Hugging Face VitalijKotok/poler-70b-t5q як доведений етап.",
  },
];

const losses = [
  {
    title: "Memory Wall на CPU",
    detail:
      "28 шарів матриць послідовно для кожного токена. Intel Core i7 видає ~1.6 токена/с — 25–30 секунд на коротке речення. Інтерактивність неможлива.",
  },
  {
    title: "Ваги — застигла пам'ять",
    detail:
      "Класичний трансформер не здатен еволюціонувати в реальному часі: потрібні гігабайти градієнтів і бекпропагейшн на GPU-кластері.",
  },
];

export function Experiment() {
  return (
    <section id="experiment" className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-amber-400">
            <FlaskConical className="h-4 w-4" aria-hidden />
            Експеримент GLM6B-EXP
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Що ми довели — і чому зупинились
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
            Експеримент{" "}
            <span className="text-zinc-200">
              «переписати ChatGLM3-6B у нативний формат .pqw»
            </span>{" "}
            завершено успішно: якість збережено, генерація працює. Але сам
            підхід статичного інференсу на CPU виявився глухим кутом для
            реального часу — і це головний висновок, а не поразка.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full border-emerald-900/50 bg-zinc-900/40">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden />
                  <CardTitle className="text-lg text-emerald-300">
                    Доказано: нативний інференс можливий
                  </CardTitle>
                </div>
                <CardDescription className="text-zinc-400">
                  Кожен пункт верифіковано виконанням, а не на словах
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {wins.map((w, i) => (
                  <motion.div
                    key={w.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-4"
                  >
                    <div className="mb-1 font-mono text-sm font-semibold text-emerald-200">
                      {i + 1}. {w.title}
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {w.detail}
                    </p>
                  </motion.div>
                ))}
                <div className="flex items-center gap-2 rounded-lg bg-zinc-950/60 p-3 font-mono text-xs text-zinc-500">
                  <HardDrive className="h-4 w-4 shrink-0 text-zinc-500" aria-hidden />
                  <span className="break-all">
                    md5 dedf407d6d4529446528c4ae84a129be · 3 130 642 823 байт
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
          >
            <Card className="h-full border-amber-900/40 bg-zinc-900/40">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-amber-400" aria-hidden />
                  <CardTitle className="text-lg text-amber-300">
                    Тупик: статичний декодер на CPU
                  </CardTitle>
                </div>
                <CardDescription className="text-zinc-400">
                  Фізика, а не невдалий код: далі розганяти нема сенсу
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {losses.map((l, i) => (
                  <motion.div
                    key={l.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="rounded-lg border border-zinc-800/80 bg-zinc-950/60 p-4"
                  >
                    <div className="mb-1 font-mono text-sm font-semibold text-amber-200">
                      {l.title}
                    </div>
                    <p className="text-sm leading-relaxed text-zinc-400">
                      {l.detail}
                    </p>
                  </motion.div>
                ))}
                <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4">
                  <div className="mb-2 font-mono text-xs uppercase tracking-widest text-amber-400">
                    Виміряно на реальному залізі
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="font-mono text-2xl font-bold text-amber-300">
                        1.6
                      </div>
                      <div className="text-xs text-zinc-500">токенів/с</div>
                    </div>
                    <div>
                      <div className="font-mono text-2xl font-bold text-amber-300">
                        25–30 с
                      </div>
                      <div className="text-xs text-zinc-500">на речення</div>
                    </div>
                    <div>
                      <div className="font-mono text-2xl font-bold text-amber-300">
                        28
                      </div>
                      <div className="text-xs text-zinc-500">
                        шарів × кожен токен
                      </div>
                    </div>
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

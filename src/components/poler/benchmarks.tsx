"use client";

import { motion } from "framer-motion";
import { Gauge, Layers, FileArchive, TestTube2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const search = [
  { metric: "Teddy vs Aho-Corasick", value: "2.66×", note: "0.97 мс, 1.55 ГБ/с сканування" },
  { metric: "Кирилиця (UTF-8)", value: "2.14×", note: "рідний scanner без розкладки на кодпойнти" },
  { metric: "POLER grep vs ripgrep", value: "2.9 мс", note: "проти 5.8 мс, повнота 195/195" },
  { metric: "BM25 + WebRank", value: "golden ✓", note: "відтворення еталона ранжування" },
];

const vectors = [
  { metric: "Щільність RaBitQ-кодування", value: "24×", note: "проти fp32; 21.3× усього індексу" },
  { metric: "HNSW p50 (ef=96)", value: "308 мкс", note: "40K×768, 1600 кластерів" },
  { metric: "Скан кодів", value: "8.4 ГБ/с", note: "popcnt-детект на такті" },
  { metric: "Recall графу", value: "100%", note: "від потолку ADC-оцінювача" },
];

const compression = [
  { metric: "Doc store (zstd)", value: "26×", note: "сирі документи корпусу" },
  { metric: "Пер-файлові словники", value: "8.0×", note: "домінанта на 65K+ файлах" },
  { metric: "Глобальний словник", value: "4.1×", note: "FSST-вендор без декомпресії при лукапах" },
  { metric: "Blob термів (FSST)", value: "3.05×", note: "стабільні ID через рескани" },
];

const groups = [
  { id: "search", label: "Пошук", icon: Gauge, data: search },
  { id: "vectors", label: "Вектори", icon: Layers, data: vectors },
  { id: "compression", label: "Стиснення", icon: FileArchive, data: compression },
];

export function Benchmarks() {
  return (
    <section id="benchmarks" className="border-b border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <div className="mb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-emerald-400">
              <TestTube2 className="h-4 w-4" aria-hidden />
              Вимірювання, не маркетинг
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
              Ядро двигуна вже швидке
            </h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-zinc-400">
              Пошуковий шар, векторний субстрат і стиснення — три контури, що
              вже сьогодні обходять класичні рішення. JIT-пластичність
              додається зверху без перебудови фундаменту.
            </p>
          </div>
          <Badge
            variant="outline"
            className="w-fit shrink-0 border-emerald-500/40 bg-emerald-500/10 font-mono text-xs text-emerald-300"
          >
            1265 зелених тестів · бінарник 16 МБ
          </Badge>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-3 bg-zinc-900/80">
              {groups.map((g) => (
                <TabsTrigger
                  key={g.id}
                  value={g.id}
                  className="font-mono text-xs data-[state=active]:bg-zinc-800 data-[state=active]:text-emerald-300 sm:text-sm"
                >
                  <g.icon className="mr-1.5 h-4 w-4" aria-hidden />
                  {g.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {groups.map((g) => (
              <TabsContent key={g.id} value={g.id} className="mt-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {g.data.map((d, i) => (
                    <motion.div
                      key={d.metric}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                    >
                      <Card className="border-zinc-800 bg-zinc-900/40 transition-colors hover:border-zinc-600">
                        <CardHeader className="pb-2">
                          <CardDescription className="font-mono text-xs text-zinc-500">
                            {d.metric}
                          </CardDescription>
                          <CardTitle className="font-mono text-3xl font-bold text-zinc-50">
                            {d.value}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-zinc-400">{d.note}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </section>
  );
}

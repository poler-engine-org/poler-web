"use client";

import { Header } from "@/components/poler/header";
import { Hero } from "@/components/poler/hero";
import { Experiment } from "@/components/poler/experiment";
import { Comparison } from "@/components/poler/comparison";
import { Triune } from "@/components/poler/triune";
import { JitDemo } from "@/components/poler/jit-demo";
import { Benchmarks } from "@/components/poler/benchmarks";
import { Footer } from "@/components/poler/footer";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-zinc-950 text-zinc-100">
      <Header />
      <main className="flex-1">
        <Hero />
        <Experiment />
        <Comparison />
        <Triune />
        <JitDemo />
        <Benchmarks />
      </main>
      <footer className="mt-auto">
        <Footer />
      </footer>
    </div>
  );
}

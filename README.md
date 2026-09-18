# POLER Web — вітрина движка

Веб-превью стратегічного переходу **POLER Engine**: від статичних Transformer-ваг
(ChatGLM3-6B Int4/Trit5) до динамічного JIT-контуру пластичності.

## Що всередині

- **Hero** — «Ваги — це машинний код»: 6.2 млрд параметрів, косинус 0.987, ×3000 швидше
- **Експеримент GLM6B-EXP** — що довели (half-rotary RoPE, нативний інференс) і чому зупинились (memory wall, 1.6 ток/с)
- **Порівняння** — статичний LLM-декодер vs навчальний JIT-контур
- **Триєдине ядро** — Trit5-кристал, SSN-вихор (Hebbian STDP, J = A − Aᵀ), мозок мухи FLYCSR1
- **Живе демо JIT-циклу** — конвеєр forward → Hebb → трити → commit → ре-JIT, 768 тритів, спарклайн ‖y‖
- **Бенчмарки** — пошук (Teddy 2.66×, grep 2.9 мс), вектори (RaBitQ 24×, HNSW 308 мкс), стиснення (zstd 26×)

## Стек

Next.js 16 (App Router) · TypeScript 5 · Tailwind CSS 4 · shadcn/ui · framer-motion · lucide-react

## Запуск

```bash
bun install
bun run dev        # http://localhost:3000
bun run lint       # ESLint
```

## Пов'язані проєкти

- Ядро: https://github.com/poler-engine-org/poler-engine (Rust)
- Артефакт моделі: https://huggingface.co/VitalijKotok/poler-70b-t5q

## Ліцензія

POLER Custom Source-Available & Modification Disclosure License v1.0 (як у ядрі).

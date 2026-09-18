/**
 * POLER Engine API Client (Streamable HTTP / MCP over JSON-RPC 2.0).
 * Handles communication with local poler-engine at http://127.0.0.1:8765
 * or server proxy with fallback deterministic simulation.
 */

export interface EngineHealth {
  online: boolean;
  version?: string;
  bind?: string;
  latencyMs?: number;
}

export interface TriuneSpeakResponse {
  session: string;
  prompt: string;
  text: string;
  tokens_count: number;
  fly_origin: {
    kind: string;
    seed?: number;
    members?: number;
    top_rotor?: number;
  };
  telemetry: {
    criticality: number;
    entropy: number;
    dopamine: number;
    serotonin: number;
    norepinephrine: number;
    activity: number;
    mean_tau: number;
  };
  trace: Array<{
    token: string;
    sem: number;
    gate: number;
    syn: number;
    fly: number;
    score: number;
    tau: number;
  }>;
  intents?: Array<{
    verb: string;
    op: string;
    object: string;
    proposal: string;
    allowed: boolean;
  }>;
  simulated?: boolean;
}

export interface IngestResponse {
  total_sources: number;
  total_words: number;
  total_chars: number;
  unique_tokens: number;
  crystal_vocab: number;
  crystal_bytes: number;
  sha256_hex: string;
  simulated?: boolean;
}

export async function checkEngineHealth(token?: string): Promise<EngineHealth> {
  const t0 = performance.now();
  try {
    const res = await fetch("/api/engine/health", {
      method: "GET",
      headers: token ? { "X-Poler-Token": token } : {},
      cache: "no-store",
    });
    const latencyMs = Math.round(performance.now() - t0);
    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        online: true,
        version: data.version || "v0.36.0-triune",
        bind: data.bind || "127.0.0.1:8765",
        latencyMs,
      };
    }
    return { online: false, latencyMs };
  } catch {
    return { online: false, latencyMs: Math.round(performance.now() - t0) };
  }
}

export async function callTriuneSpeak(
  prompt: string,
  tokens: number = 24,
  seed: number = 777,
  gamma: number = 0.8,
  token?: string
): Promise<TriuneSpeakResponse> {
  try {
    const res = await fetch("/api/engine/speak", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Poler-Token": token } : {}),
      },
      body: JSON.stringify({ text: prompt, tokens, seed, gamma }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn("Failed to contact live poler-engine, falling back to simulated output:", e);
  }

  // Deterministic local fallback simulation
  return generateSimulatedSpeak(prompt, tokens, seed, gamma);
}

export async function callCrystalIngest(
  text: string,
  vocabLimit: number = 384,
  token?: string
): Promise<IngestResponse> {
  try {
    const res = await fetch("/api/engine/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "X-Poler-Token": token } : {}),
      },
      body: JSON.stringify({ text, vocabLimit }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.warn("Failed to call ingest API, fallback:", e);
  }

  // Fallback
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const unique = new Set(words);
  return {
    total_sources: 1,
    total_words: words.length,
    total_chars: text.length,
    unique_tokens: unique.size,
    crystal_vocab: Math.min(unique.size, vocabLimit),
    crystal_bytes: Math.min(unique.size, vocabLimit) * 12 + 128,
    sha256_hex: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    simulated: true,
  };
}

function generateSimulatedSpeak(
  prompt: string,
  tokensCount: number,
  seed: number,
  gamma: number
): TriuneSpeakResponse {
  const dictionaryUk = [
    "привіт", "справи", "добре", "мозок", "мухи", "працює", "ідеально",
    "квантова", "решітка", "тритів", "без", "множення", "синтезує",
    "думку", "детерміновано", "вихровий", "контур", "пластичності",
    "стабільний", "нейромедіатори", "в", "коридорі", "критичності",
    "машинний", "код", "x86_64", "виконується", "миттєво"
  ];

  const words: string[] = [];
  const trace: TriuneSpeakResponse["trace"] = [];
  let s = seed;

  for (let i = 0; i < tokensCount; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const word = dictionaryUk[s % dictionaryUk.length];
    words.push(word);

    trace.push({
      token: word,
      sem: 0.72 + ((s & 0xff) / 255) * 0.25,
      gate: 0.88 + (((s >> 8) & 0xff) / 255) * 0.1,
      syn: ((s >> 16) % 3) - 1,
      fly: (Math.sin(i * 0.5 + gamma) * 0.5 + 0.5) * 0.8,
      score: 1.45 + ((s & 0x7f) / 127) * 0.5,
      tau: 0.95 + ((s & 0x1f) / 31) * 0.3,
    });
  }

  return {
    session: `sim-${seed}-${Date.now()}`,
    prompt,
    text: words.join(" "),
    tokens_count: words.length,
    fly_origin: {
      kind: "synthetic",
      seed,
    },
    telemetry: {
      criticality: 0.985,
      entropy: 0.812,
      dopamine: 0.76,
      serotonin: 0.68,
      norepinephrine: 0.54,
      activity: 0.052,
      mean_tau: 1.04,
    },
    trace,
    simulated: true,
  };
}

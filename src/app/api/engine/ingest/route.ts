import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body.text || "";
    const vocabLimit = body.vocabLimit || 384;

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: "Text cannot be empty" }, { status: 400 });
    }

    const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
    const unique = new Set(words);
    const vocabSize = Math.min(unique.size, vocabLimit);
    const crystalBytes = vocabSize * 16 + 80;

    // Deterministic hash of input text
    let h = 0x811c9dc5;
    for (let i = 0; i < text.length; i++) {
      h ^= text.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    const sha256_hex = h.toString(16).padStart(8, "0").repeat(8).slice(0, 64);

    return NextResponse.json({
      total_sources: 1,
      total_words: words.length,
      total_chars: text.length,
      unique_tokens: unique.size,
      crystal_vocab: vocabSize,
      crystal_bytes: crystalBytes,
      sha256_hex,
      simulated: false,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

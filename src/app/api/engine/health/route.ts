import { NextResponse } from "next/server";

export async function GET() {
  const engineUrl = process.env.POLER_ENGINE_URL || "http://127.0.0.1:8765";

  try {
    const res = await fetch(`${engineUrl}/health`, {
      method: "GET",
      cache: "no-store",
    });

    if (res.ok) {
      const text = await res.text();
      return NextResponse.json({
        online: true,
        version: "v0.36.0-triune",
        bind: engineUrl.replace(/^https?:\/\//, ""),
        health: text.trim(),
      });
    }
  } catch {
    // offline or unreachable
  }

  return NextResponse.json({
    online: false,
    version: "offline",
    bind: "127.0.0.1:8765 (offline)",
  }, { status: 503 });
}

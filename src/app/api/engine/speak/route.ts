import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const engineUrl = process.env.POLER_ENGINE_URL || "http://127.0.0.1:8765";
  const token = process.env.POLER_MCP_TOKEN || req.headers.get("x-poler-token") || "";

  try {
    const body = await req.json();
    const prompt = body.text || "Привіт, як справи?";
    const tokens = body.tokens || 24;
    const seed = body.seed || 777;
    const gamma = body.gamma ?? 0.8;

    const rpcPayload = {
      jsonrpc: "2.0",
      id: Date.now(),
      method: "tools/call",
      params: {
        name: "poler_triune_speak",
        arguments: {
          text: prompt,
          tokens,
          seed,
          gamma,
        },
      },
    };

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      headers["X-Poler-Token"] = token;
    }

    const res = await fetch(`${engineUrl}/mcp`, {
      method: "POST",
      headers,
      body: JSON.stringify(rpcPayload),
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result && data.result.content && data.result.content[0]) {
        try {
          const parsed = JSON.parse(data.result.content[0].text);
          return NextResponse.json(parsed);
        } catch {
          return NextResponse.json({
            session: "live-session",
            prompt,
            text: data.result.content[0].text,
            tokens_count: tokens,
            telemetry: {
              criticality: 0.98,
              entropy: 0.8,
              dopamine: 0.7,
              serotonin: 0.7,
              norepinephrine: 0.5,
              activity: 0.05,
              mean_tau: 1.0,
            },
            trace: [],
          });
        }
      }
    }
  } catch (err) {
    console.error("Engine speak proxy error:", err);
  }

  return NextResponse.json({ error: "Failed to communicate with engine" }, { status: 502 });
}

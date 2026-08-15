export const config = { runtime: "nodejs22.x", regions: ["iad1"], maxDuration: 45 };

const MODEL = "gemini-3.7-flash";

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return Response.json(
      { error: "GEMINI_API_KEY environment variable is not set on Vercel." },
      { status: 500 },
    );
  }

  let body: { brief?: string; profile?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const brief = (body.brief || "").toString().slice(0, 4000);
  if (!brief.trim()) {
    return Response.json({ error: "Brief is required" }, { status: 400 });
  }
  const profile = body.profile || {};

  const system = `You are a senior proposals writer for a professional agency. Turn the client's project brief into a structured, persuasive quotation. Respond with ONLY valid JSON (no markdown, no code fences) matching this exact TypeScript type:

{
  "clientName": string,
  "projectTitle": string,
  "executiveSummary": string,
  "currency": string,
  "scope": string[],
  "outOfScope": string[],
  "deliverables": { "title": string, "description": string }[],
  "timeline": { "phase": string, "duration": string, "details": string }[],
  "pricing": { "item": string, "description": string, "amount": number }[],
  "taxLabel"?: string,
  "taxRate"?: number,
  "paymentSchedule": { "milestone": string, "due": string, "percentage": number }[],
  "validityDays": number,
  "terms": string[]
}

Rules: amounts are numbers (no currency symbols). paymentSchedule percentages must sum to 100. Be realistic with pricing and timelines. Keep copy concise and professional. Emit 2-5 concise payment/legal terms (e.g. "50% deposit required to begin", "Final invoice due net 14", "Revisions beyond scope billed at standard rate").`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${key}`;
  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `${system}\n\nAgency profile: ${JSON.stringify(profile)}\n\nBrief:\n${brief}`,
          },
        ],
      },
    ],
    generationConfig: { responseMimeType: "application/json", temperature: 0.4 },
  };

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 40000);
    let r: Response;
    try {
      r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } catch (e) {
      clearTimeout(timer);
      return Response.json(
        { error: e instanceof Error && e.name === "AbortError" ? "Gemini request timed out" : "Gemini request failed" },
        { status: 502 },
      );
    }
    clearTimeout(timer);
    const data = await r.json();
    if (!r.ok) {
      return Response.json(
        { error: (data?.error?.message as string) || "Gemini request failed" },
        { status: 502 },
      );
    }
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
    if (!text) {
      return Response.json({ error: "Empty AI response" }, { status: 502 });
    }
    const parsed = JSON.parse(text);
    return Response.json(parsed);
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "AI request failed" },
      { status: 502 },
    );
  }
}

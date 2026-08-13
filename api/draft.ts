export const config = { runtime: "nodejs" };

const MODEL = "gemini-2.0-flash";

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
  "validityDays": number
}

Rules: amounts are numbers (no currency symbols). paymentSchedule percentages must sum to 100. Be realistic with pricing and timelines. Keep copy concise and professional.`;

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
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
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

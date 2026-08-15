export const config = { runtime: "nodejs22.x", regions: ["iad1"] };

export default async function handler(): Promise<Response> {
  return Response.json({ ok: true, time: Date.now() });
}
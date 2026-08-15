// Vercel serverless function — reports whether the Supabase backend is configured.
// Returns { backed: true } with 200 when both env vars are present, otherwise
// { backed: false } with 503. The client uses this to decide between the server
// and localStorage store. Never throws.

export const config = { runtime: "nodejs22.x", region: "iad1" };

export default async function handler(): Promise<Response> {
  const backed = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE);
  return Response.json({ backed }, { status: backed ? 200 : 503 });
}

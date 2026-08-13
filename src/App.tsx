import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuoteSheet } from "@/components/QuoteSheet";
import {
  draftQuote,
  emptyQuotation,
  type Quotation,
} from "@/lib/quotation";
import {
  loadProfile,
  saveProfile,
  loadHistory,
  saveQuote,
  type CompanyProfile,
} from "@/lib/quote-store";

export default function App() {
  const [profile, setProfile] = useState<CompanyProfile>(() => loadProfile());
  const [brief, setBrief] = useState("");
  const [quote, setQuote] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Quotation[]>(() => loadHistory<Quotation>());
  const [showProfile, setShowProfile] = useState(false);
  const [saved, setSaved] = useState(false);

  async function generate() {
    if (!brief.trim()) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const q = await draftQuote(brief, profile);
      setQuote(q);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate quote");
    } finally {
      setLoading(false);
    }
  }

  function onProfileChange(patch: Partial<CompanyProfile>) {
    const next = { ...profile, ...patch };
    setProfile(next);
    saveProfile(next);
  }

  function persist() {
    if (!quote) return;
    setHistory(saveQuote(quote) as Quotation[]);
    setSaved(true);
  }

  function shareWhatsApp() {
    if (!quote) return;
    const text = `${profile.companyName} — Quotation: ${quote.projectTitle}\nTotal: ${quote.total}\n\n${quote.executiveSummary}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  function shareEmail() {
    if (!quote) return;
    const subject = `Quotation — ${quote.projectTitle}`;
    const body = `${quote.executiveSummary}\n\nTotal: ${quote.total}\nValid for ${quote.validityDays} days.`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="no-print border-b border-paper-line">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            {profile.logo && (
              <img src={profile.logo} alt="logo" className="h-9 w-auto object-contain" />
            )}
            <div>
              <p className="font-display text-xl leading-tight">
                {profile.companyName || "Velcora"}
              </p>
              <p className="text-xs text-ink-soft">Quote Generator</p>
            </div>
          </div>
          <Button variant="ghost" onClick={() => setShowProfile((s) => !s)}>
            Company profile
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        {showProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Company profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <Label>Company name</Label>
                <Input
                  value={profile.companyName}
                  onChange={(e) => onProfileChange({ companyName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  value={profile.email ?? ""}
                  onChange={(e) => onProfileChange({ email: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  value={profile.phone ?? ""}
                  onChange={(e) => onProfileChange({ phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Logo URL</Label>
                <Input
                  value={profile.logo ?? ""}
                  onChange={(e) => onProfileChange({ logo: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Currency</Label>
                <Input
                  value={profile.currency}
                  onChange={(e) => onProfileChange({ currency: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Tax label</Label>
                <Input
                  value={profile.taxLabel ?? "Tax"}
                  onChange={(e) => onProfileChange({ taxLabel: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Tax rate %</Label>
                <Input
                  type="number"
                  value={profile.taxRate ?? 0}
                  onChange={(e) => onProfileChange({ taxRate: Number(e.target.value) })}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Describe the project</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              rows={5}
              placeholder="One-line brief, e.g. 'Build a 5-page marketing site for a coffee roaster, $3k budget, 3-week timeline, includes copywriting and SEO'"
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
            />
            <div className="flex flex-wrap gap-3">
              <Button onClick={generate} disabled={loading}>
                {loading ? "Generating…" : "Generate quote"}
              </Button>
              {quote && (
                <Button variant="secondary" onClick={persist}>
                  {saved ? "Saved ✓" : "Save"}
                </Button>
              )}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </CardContent>
        </Card>

        {quote && (
          <div className="space-y-4">
            <div className="no-print flex flex-wrap gap-3">
              <Button onClick={() => window.print()}>Download / Print PDF</Button>
              <Button variant="outline" onClick={shareWhatsApp}>
                Share WhatsApp
              </Button>
              <Button variant="outline" onClick={shareEmail}>
                Share Email
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setQuote(emptyQuotation());
                  setBrief("");
                }}
              >
                New quote
              </Button>
            </div>
            <QuoteSheet
              quote={quote}
              profile={profile}
              number={`Q-${Date.now().toString().slice(-6)}`}
              editable
              onChange={setQuote}
            />
          </div>
        )}

        {history.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Saved quotes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {history.map((h, i) => (
                <button
                  key={i}
                  className="block w-full rounded border border-paper-line p-3 text-left hover:bg-accent/10"
                  onClick={() => {
                    setQuote(h);
                    setSaved(true);
                  }}
                >
                  <span className="font-medium">{h.projectTitle || "Untitled"}</span> —{" "}
                  <span className="text-ink-soft">{h.clientName || "No client"}</span>
                </button>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

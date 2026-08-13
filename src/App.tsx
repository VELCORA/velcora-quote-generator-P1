import { useState } from "react";
import {
  Sparkles,
  FileText,
  History,
  Building2,
  Printer,
  MessageCircle,
  Mail,
  Save,
  Plus,
  Wand2,
  Check,
  Loader2,
  Quote as QuoteIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const EXAMPLES = [
  "5-page marketing website for a coffee roaster, $3k budget, 3-week timeline, includes copywriting and on-page SEO",
  "Brand identity package: logo, color system, brand guidelines for a fintech startup, fixed $4.5k",
  "Monthly SEO retainer for a law firm — 8 articles/mo, technical audits, $1.2k/month",
  "E-commerce store on Shopify for a jewelry brand, 40 products, $5k + 15% monthly maintenance",
];

type Phase = "compose" | "loading" | "result";

export default function App() {
  const [phase, setPhase] = useState<Phase>("compose");
  const [brief, setBrief] = useState("");
  const [quote, setQuote] = useState<Quotation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<CompanyProfile>(() => loadProfile());
  const [history, setHistory] = useState<Quotation[]>(() => loadHistory<Quotation>());
  const [profileOpen, setProfileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  async function generate() {
    if (!brief.trim() || phase === "loading") return;
    setPhase("loading");
    setError(null);
    setSaved(false);
    try {
      const q = await draftQuote(brief, profile);
      setQuote(q);
      setPhase("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate quote");
      setPhase("compose");
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

  function newQuote() {
    setQuote(null);
    setBrief("");
    setError(null);
    setSaved(false);
    setPhase("compose");
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

  const initials = (profile.companyName || "V")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="no-print hidden w-64 shrink-0 flex-col border-r border-paper-line bg-paper/60 p-5 md:flex">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-xl">
            {profile.logo ? <AvatarImage src={profile.logo} alt="" /> : null}
            <AvatarFallback className="rounded-xl bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight">
              {profile.companyName || "Velcora"}
            </p>
            <p className="text-xs text-ink-soft">Quote Generator</p>
          </div>
        </div>

        <nav className="mt-8 flex flex-col gap-1">
          <button
            onClick={newQuote}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent/10"
          >
            <FileText className="h-4 w-4 text-accent" /> New quote
          </button>
          <button
            onClick={() => {
              setHistory(loadHistory<Quotation>());
              setHistoryOpen(true);
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent/10"
          >
            <History className="h-4 w-4 text-accent" /> Saved quotes
            {history.length > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {history.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setProfileOpen(true)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors hover:bg-accent/10"
          >
            <Building2 className="h-4 w-4 text-accent" /> Company profile
          </button>
        </nav>

        <div className="mt-auto rounded-xl border border-paper-line bg-background p-4">
          <p className="label-caps">Tip</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-soft">
            Be specific about deliverables, timeline and budget — the AI drafts a
            tighter quote.
          </p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1">
        {/* Top bar */}
        <header className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-paper-line bg-background/80 px-5 py-3 backdrop-blur">
          <div className="flex items-center gap-2 md:hidden">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="font-display">{profile.companyName || "Velcora"}</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setProfileOpen(true)}>
              <Building2 className="h-4 w-4" /> Profile
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setHistoryOpen(true)}>
              <History className="h-4 w-4" /> Saved
            </Button>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-8">
          {phase === "compose" && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mb-6 text-center">
                <Badge variant="outline" className="mb-3 gap-1 border-accent/40 text-accent">
                  <Sparkles className="h-3 w-3" /> AI powered
                </Badge>
                <h1 className="font-display text-4xl leading-tight md:text-5xl">
                  Craft a client quote in seconds
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-ink-soft">
                  Describe the project in plain language. Get a branded, print-ready
                  quotation with scope, pricing and payment schedule.
                </p>
              </div>

              <Card className="overflow-hidden">
                <CardHeader className="bg-gradient-to-b from-paper to-background">
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="h-5 w-5 text-accent" /> Project brief
                  </CardTitle>
                  <CardDescription>
                    The more detail, the sharper the quote.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    rows={6}
                    placeholder="e.g. Build a 5-page marketing site for a coffee roaster, $3k budget, 3-week timeline, includes copywriting and SEO…"
                    value={brief}
                    onChange={(e) => setBrief(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate();
                    }}
                  />
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLES.map((ex) => (
                      <button
                        key={ex}
                        onClick={() => setBrief(ex)}
                        className="rounded-full border border-paper-line px-3 py-1 text-xs text-ink-soft transition-colors hover:border-accent hover:text-foreground"
                      >
                        {ex.split(":")[0].slice(0, 28)}…
                      </button>
                    ))}
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-ink-soft">
                      Tip: press ⌘/Ctrl + Enter to generate
                    </p>
                    <Button onClick={generate} disabled={!brief.trim()}>
                      <Sparkles className="h-4 w-4" /> Generate quote
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["AI drafting", "One-line brief → full quote"],
                  ["Print-ready", "Export a clean PDF instantly"],
                  ["Branded", "Your logo, tax & terms reused"],
                ].map(([t, d]) => (
                  <div key={t} className="rounded-xl border border-paper-line p-4">
                    <p className="font-medium">{t}</p>
                    <p className="mt-1 text-sm text-ink-soft">{d}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {phase === "loading" && (
            <section className="animate-in fade-in duration-300">
              <div className="mb-6 flex items-center justify-center gap-3 text-ink-soft">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                Drafting your quotation…
              </div>
              <div className="mx-auto max-w-3xl space-y-4 rounded-xl border border-paper-line bg-paper p-8 shadow-sheet">
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-3/4" />
                <Separator />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </section>
          )}

          {phase === "result" && quote && (
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="no-print sticky top-14 z-10 mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-paper-line bg-background/90 p-3 backdrop-blur">
                <Button onClick={() => window.print()}>
                  <Printer className="h-4 w-4" /> Print / PDF
                </Button>
                <Button variant="outline" onClick={shareWhatsApp}>
                  <MessageCircle className="h-4 w-4" /> WhatsApp
                </Button>
                <Button variant="outline" onClick={shareEmail}>
                  <Mail className="h-4 w-4" /> Email
                </Button>
                <Button variant="outline" onClick={persist}>
                  {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {saved ? "Saved" : "Save"}
                </Button>
                <Button variant="ghost" onClick={newQuote} className="ml-auto">
                  <Plus className="h-4 w-4" /> New
                </Button>
                <span className="w-full text-center text-xs text-ink-soft sm:w-auto sm:text-right">
                  Click any text on the sheet to edit it.
                </span>
              </div>

              <div className="mx-auto max-w-3xl">
                <QuoteSheet
                  quote={quote}
                  profile={profile}
                  number={`Q-${Date.now().toString().slice(-6)}`}
                  editable
                  onChange={setQuote}
                />
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Profile dialog */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-accent" /> Company profile
            </DialogTitle>
            <DialogDescription>
              Saved to this browser and reused on every quote.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="company" className="mt-2">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="tax">Tax &amp; currency</TabsTrigger>
              <TabsTrigger value="brand">Branding</TabsTrigger>
            </TabsList>
            <TabsContent value="company" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Company name</Label>
                  <Input
                    value={profile.companyName}
                    onChange={(e) => onProfileChange({ companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Tagline</Label>
                  <Input
                    value={profile.tagline ?? ""}
                    onChange={(e) => onProfileChange({ tagline: e.target.value })}
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
              </div>
              <div className="space-y-1">
                <Label>Address</Label>
                <Input
                  value={profile.address ?? ""}
                  onChange={(e) => onProfileChange({ address: e.target.value })}
                />
              </div>
            </TabsContent>
            <TabsContent value="tax" className="space-y-4 pt-4">
              <div className="grid gap-4 sm:grid-cols-3">
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
              </div>
            </TabsContent>
            <TabsContent value="brand" className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 rounded-xl">
                  {profile.logo ? <AvatarImage src={profile.logo} alt="" /> : null}
                  <AvatarFallback className="rounded-xl bg-primary text-primary-foreground text-xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <Label>Logo URL</Label>
                  <Input
                    value={profile.logo ?? ""}
                    onChange={(e) => onProfileChange({ logo: e.target.value })}
                    placeholder="https://…/logo.png"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Footer note</Label>
                <Input
                  value={profile.footerNote ?? ""}
                  onChange={(e) => onProfileChange({ footerNote: e.target.value })}
                  placeholder="Thank you for the opportunity…"
                />
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* History dialog */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-accent" /> Saved quotes
            </DialogTitle>
            <DialogDescription>Stored in this browser.</DialogDescription>
          </DialogHeader>
          {history.length === 0 ? (
            <p className="py-8 text-center text-sm text-ink-soft">
              No saved quotes yet.
            </p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-auto">
              {history.map((h, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuote(h);
                    setSaved(true);
                    setPhase("result");
                    setHistoryOpen(false);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg border border-paper-line p-3 text-left transition-colors hover:bg-accent/10"
                >
                  <QuoteIcon className="h-4 w-4 shrink-0 text-accent" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">
                      {h.projectTitle || "Untitled"}
                    </p>
                    <p className="truncate text-xs text-ink-soft">
                      {h.clientName || "No client"}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{h.total}</span>
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

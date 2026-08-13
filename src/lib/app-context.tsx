import * as React from "react";
import { getQuoteStore } from "@/lib/store-provider";
import { loadProfile, saveProfile, type CompanyProfile } from "@/lib/quote-store";
import type { Quotation } from "@/lib/quotation";
import type { SavedQuote } from "@/lib/storage-types";
import { useToast } from "@/components/ui/Toast";
import { useTheme } from "@/lib/theme";
import type { Client } from "@/lib/clients-store";

export type View = "dashboard" | "new" | "quotes" | "templates" | "clients" | "settings";

interface WizardState {
  seed?: Quotation;
  edit?: SavedQuote;
}

interface AppContextValue {
  view: View;
  setView: (v: View) => void;
  profile: CompanyProfile;
  setProfile: (p: CompanyProfile) => void;
  quotes: SavedQuote[];
  refreshQuotes: () => Promise<void>;
  startNew: (seed?: Quotation) => void;
  startNewFromClient: (client: Client) => void;
  editQuote: (q: SavedQuote) => void;
  wizard: WizardState | null;
  clearWizard: () => void;
  toast: (message: string) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  accent: string;
  setAccent: (c: string) => void;
}

const AppContext = React.createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const { theme, toggleTheme, accent, setAccent } = useTheme();

  const [view, setView] = React.useState<View>("dashboard");
  const [profile, setProfileState] = React.useState<CompanyProfile>(() => loadProfile());
  const [quotes, setQuotes] = React.useState<SavedQuote[]>([]);
  const [wizard, setWizard] = React.useState<WizardState | null>(null);

  const store = getQuoteStore();

  const refreshQuotes = React.useCallback(async () => {
    try {
      const list = await store.list();
      setQuotes(list);
    } catch {
      setQuotes([]);
    }
  }, [store]);

  React.useEffect(() => {
    void refreshQuotes();
  }, [refreshQuotes]);

  const setProfile = React.useCallback((p: CompanyProfile) => {
    saveProfile(p);
    setProfileState(p);
  }, []);

  const startNew = React.useCallback((seed?: Quotation) => {
    setWizard({ seed });
    setView("new");
  }, []);

  const startNewFromClient = React.useCallback(
    (client: Client) => {
      const seed: Quotation = {
        clientName: client.name,
        projectTitle: "",
        executiveSummary: client.company
          ? `Proposal prepared for ${client.company} (${client.name}).`
          : `Proposal prepared for ${client.name}.`,
        currency: profile.currency || "USD",
        scope: [],
        outOfScope: [],
        deliverables: [],
        timeline: [],
        pricing: [],
        subtotal: 0,
        taxLabel: profile.taxLabel,
        taxRate: profile.taxRate,
        taxAmount: 0,
        total: 0,
        paymentSchedule: [],
        validityDays: 14,
        terms: [],
      };
      setWizard({ seed });
      setView("new");
    },
    [profile],
  );

  const editQuote = React.useCallback((q: SavedQuote) => {
    setWizard({ edit: q });
    setView("new");
  }, []);

  const clearWizard = React.useCallback(() => setWizard(null), []);

  const value: AppContextValue = {
    view,
    setView,
    profile,
    setProfile,
    quotes,
    refreshQuotes,
    startNew,
    startNewFromClient,
    editQuote,
    wizard,
    clearWizard,
    toast,
    theme,
    toggleTheme,
    accent,
    setAccent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = React.useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

import * as React from "react";
import { cn } from "@/lib/utils";
import { useApp, type View } from "@/lib/app-context";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  LayoutTemplate,
  Users,
  Settings,
  ChevronLeft,
} from "lucide-react";

const NAV: { view: View; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { view: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { view: "new", label: "New Quote", icon: PlusCircle },
  { view: "quotes", label: "Quotes", icon: FileText },
  { view: "templates", label: "Templates", icon: LayoutTemplate },
  { view: "clients", label: "Clients", icon: Users },
  { view: "settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const { view, setView, profile } = useApp();

  const initials = (profile.companyName || "V")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const content = (
    <div className="flex h-full flex-col p-4">
      <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
          {initials}
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate font-display text-lg leading-tight">
              {profile.companyName || "Velcora"}
            </p>
            <p className="text-xs text-ink-soft">Quote Generator</p>
          </div>
        )}
      </div>

      <nav className="mt-8 flex flex-col gap-1">
        {NAV.map(({ view: v, label, icon: Icon }) => {
          const active = view === v;
          return (
            <button
              key={v}
              onClick={() => {
                setView(v);
                onCloseMobile();
              }}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                collapsed && "justify-center",
                active
                  ? "bg-accent/15 text-accent"
                  : "text-ink-soft hover:bg-accent/10 hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-xl border border-paper-line bg-secondary/60 p-4">
        {!collapsed && (
          <>
            <p className="label-caps">Tip</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              Start from a template to draft a polished quote in under a minute.
            </p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside
        className={cn(
          "no-print hidden shrink-0 flex-col border-r border-paper-line bg-paper/60 transition-[width] duration-200 md:flex",
          collapsed ? "w-20" : "w-64",
        )}
      >
        {content}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="no-print fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onCloseMobile} />
          <aside className="absolute left-0 top-0 h-full w-64 border-r border-paper-line bg-paper shadow-sheet">
            <button
              onClick={onCloseMobile}
              className="absolute right-3 top-3 rounded-md p-1 text-ink-soft hover:bg-accent/10"
              aria-label="Close menu"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}

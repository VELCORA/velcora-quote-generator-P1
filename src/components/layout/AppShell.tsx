import * as React from "react";
import { useApp } from "@/lib/app-context";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Dashboard } from "@/components/views/Dashboard";
import { NewQuote } from "@/components/views/NewQuote";
import { QuotesList } from "@/components/views/QuotesList";
import { Templates } from "@/components/views/Templates";
import { Clients } from "@/components/views/Clients";
import { Settings } from "@/components/views/Settings";

function renderView(view: string) {
  switch (view) {
    case "dashboard":
      return <Dashboard />;
    case "new":
      return <NewQuote />;
    case "quotes":
      return <QuotesList />;
    case "templates":
      return <Templates />;
    case "clients":
      return <Clients />;
    case "settings":
      return <Settings />;
    default:
      return <Dashboard />;
  }
}

export function AppShell() {
  const { view } = useApp();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onToggleMobile={() => setMobileOpen((o) => !o)}
        />
        <main className="flex-1">
          <div
            key={view}
            className="mx-auto w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 px-4 py-8 duration-500 sm:px-6 lg:px-8"
          >
            {renderView(view)}
          </div>
        </main>
      </div>
    </div>
  );
}

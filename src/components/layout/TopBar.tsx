import * as React from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, Menu, Sun, Moon, PanelLeftClose, PanelLeft } from "lucide-react";
import { BRAND_LOGO, BRAND_NAME } from "@/lib/brand";

export function TopBar({
  collapsed,
  onToggleCollapse,
  onToggleMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onToggleMobile: () => void;
}) {
  const { setView, startNew, profile, theme, toggleTheme } = useApp();

  const initials = (profile.companyName || "V")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="no-print sticky top-0 z-30 flex items-center gap-2 border-b border-paper-line bg-background/80 px-4 py-3 backdrop-blur">
      <button
        onClick={onToggleMobile}
        className="rounded-md p-2 text-ink-soft hover:bg-accent/10 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        onClick={onToggleCollapse}
        className="hidden rounded-md p-2 text-ink-soft hover:bg-accent/10 md:block"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
        <img
          src={BRAND_LOGO}
          alt={BRAND_NAME}
          className="hidden h-8 w-8 rounded-lg bg-white p-1 shadow-sm md:block"
        />

      <div className="ml-auto flex items-center gap-2">
        <Button onClick={() => startNew()} size="sm">
          <PlusCircle className="h-4 w-4" /> New Quote
        </Button>
        <button
          onClick={toggleTheme}
          className="hidden rounded-md p-2 text-ink-soft hover:bg-accent/10 sm:block"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setView("settings")}
          className="rounded-full"
          aria-label="Profile"
        >
          <Avatar className="h-9 w-9 rounded-xl">
            {profile.logo ? <AvatarImage src={profile.logo} alt="" /> : null}
            <AvatarFallback className="rounded-xl bg-primary text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}

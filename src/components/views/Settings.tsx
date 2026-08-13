import * as React from "react";
import { useApp } from "@/lib/app-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon, Upload } from "lucide-react";

export function Settings() {
  const { profile, setProfile, theme, toggleTheme, accent, setAccent, toast } = useApp();

  const initials = (profile.companyName || "V")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function onLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setProfile({ ...profile, logo: String(reader.result) });
      toast("Logo updated");
    };
    reader.readAsDataURL(file);
  }

  function onAccent(color: string) {
    setAccent(color);
    setProfile({ ...profile, accent: color });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="label-caps">Preferences</p>
        <h1 className="mt-1 font-display text-4xl">Settings</h1>
        <p className="mt-2 text-ink-soft">
          These details are reused on every quote you create.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Branding</CardTitle>
          <CardDescription>Logo, name and accent color.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 rounded-xl">
              {profile.logo ? <AvatarImage src={profile.logo} alt="" /> : null}
              <AvatarFallback className="rounded-xl bg-primary text-primary-foreground text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <Label>Logo</Label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  accept="image/*"
                  id="logo-upload"
                  className="hidden"
                  onChange={onLogo}
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4" /> Upload logo
                  </label>
                </Button>
                {profile.logo && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setProfile({ ...profile, logo: undefined });
                      toast("Logo removed");
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-ink-soft">PNG, JPG or SVG (stored locally).</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label>Company name</Label>
              <Input
                value={profile.companyName}
                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Tagline</Label>
              <Input
                value={profile.tagline ?? ""}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Accent color</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={accent}
                onChange={(e) => onAccent(e.target.value)}
                className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent"
                aria-label="Accent color"
              />
              <span className="text-sm text-ink-soft">{accent}</span>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-paper-line p-4">
            <div>
              <p className="text-sm font-medium">Appearance</p>
              <p className="text-xs text-ink-soft">
                {theme === "dark" ? "Dark mode on" : "Light mode on"}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme}>
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {theme === "dark" ? "Light" : "Dark"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label>Email</Label>
            <Input
              value={profile.email ?? ""}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Phone</Label>
            <Input
              value={profile.phone ?? ""}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Address</Label>
            <Input
              value={profile.address ?? ""}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Footer note</Label>
            <Input
              value={profile.footerNote ?? ""}
              onChange={(e) => setProfile({ ...profile, footerNote: e.target.value })}
              placeholder="Thank you for the opportunity…"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Tax &amp; currency</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <Label>Currency</Label>
            <Input
              value={profile.currency}
              onChange={(e) => setProfile({ ...profile, currency: e.target.value })}
              placeholder="USD"
            />
          </div>
          <div className="space-y-1">
            <Label>Tax label</Label>
            <Input
              value={profile.taxLabel ?? "Tax"}
              onChange={(e) => setProfile({ ...profile, taxLabel: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label>Tax rate %</Label>
            <Input
              type="number"
              value={profile.taxRate ?? 0}
              onChange={(e) => setProfile({ ...profile, taxRate: Number(e.target.value) })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import * as React from "react";
import { useApp } from "@/lib/app-context";
import {
  loadClients,
  upsertClient,
  deleteClient,
  uid,
  type Client,
} from "@/lib/clients-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/views/EmptyState";
import { PlusCircle, Users, Trash2, Pencil, FileText, Mail } from "lucide-react";

export function Clients() {
  const { startNewFromClient, toast } = useApp();
  const [clients, setClients] = React.useState<Client[]>([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Client | null>(null);
  const [form, setForm] = React.useState<Client>(blank());

  React.useEffect(() => {
    setClients(loadClients());
  }, []);

  function blank(): Client {
    return { id: "", name: "", email: "", company: "" };
  }

  function openNew() {
    setEditing(null);
    setForm(blank());
    setOpen(true);
  }

  function openEdit(c: Client) {
    setEditing(c);
    setForm({ ...c });
    setOpen(true);
  }

  function save() {
    if (!form.name.trim()) {
      toast("Client name is required");
      return;
    }
    const record: Client = { ...form, id: form.id || uid() };
    const next = upsertClient(record);
    setClients(next);
    setOpen(false);
    toast(editing ? "Client updated" : "Client added");
  }

  function remove(c: Client) {
    setClients(deleteClient(c.id));
    toast("Client removed");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-caps">Contacts</p>
          <h1 className="mt-1 font-display text-4xl">Clients</h1>
          <p className="mt-2 text-ink-soft">
            Keep client details handy and spin up quotes in one click.
          </p>
        </div>
        <Button onClick={openNew}>
          <PlusCircle className="h-4 w-4" /> Add client
        </Button>
      </div>

      {clients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No clients yet"
          description="Add a client to quickly pre-fill quotes with their details."
          action={
            <Button onClick={openNew}>
              <PlusCircle className="h-4 w-4" /> Add client
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 font-semibold text-accent">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    {c.company && (
                      <p className="truncate text-xs text-ink-soft">{c.company}</p>
                    )}
                  </div>
                </div>
                {c.email && (
                  <p className="mt-3 flex items-center gap-2 text-sm text-ink-soft">
                    <Mail className="h-3.5 w-3.5" /> {c.email}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => startNewFromClient(c)}
                  >
                    <FileText className="h-4 w-4" /> New quote
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => remove(c)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit client" : "Add client"}</DialogTitle>
            <DialogDescription>Stored locally in this browser.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-1">
              <Label>Company</Label>
              <Input
                value={form.company ?? ""}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="jane@acme.com"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={save}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
}

const KEY = "velcora.clients";

function read(): Client[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Client[]) : [];
  } catch {
    return [];
  }
}

function write(list: Client[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function loadClients(): Client[] {
  return read();
}

export function saveClients(list: Client[]): void {
  write(list);
}

export function upsertClient(c: Client): Client[] {
  const list = read();
  const idx = list.findIndex((x) => x.id === c.id);
  if (idx >= 0) list[idx] = c;
  else list.unshift(c);
  write(list);
  return list;
}

export function deleteClient(id: string): Client[] {
  const list = read().filter((x) => x.id !== id);
  write(list);
  return list;
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface Bin {
  id: string;
  label: string;
  icon?: string;
}

export interface SortItem {
  id: string;
  label: string;
  bin: string;
  wrong: string;
}

export interface Choice {
  id: string;
  label: string;
  ok: boolean;
  wrong: string;
}

export interface Placed {
  id: string;
  bin: string;
}

export function cleanName(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 20);
}

export function validName(name: string): boolean {
  return /^[A-Za-z][A-Za-z .'-]{0,19}$/.test(name);
}

export function cleanNote(raw: string): string {
  return raw.replace(/\s+/g, " ").trim().slice(0, 80);
}

export function placeItem(items: SortItem[], placed: Placed[], id: string, bin: string): { placed: Placed[]; wrong: string | null } {
  const item = items.find((entry) => entry.id === id);
  if (!item) return { placed, wrong: null };
  if (placed.some((entry) => entry.id === id)) return { placed, wrong: null };
  if (item.bin !== bin) return { placed, wrong: item.wrong };
  return { placed: placed.concat({ id, bin }), wrong: null };
}

export function sortDone(items: SortItem[], placed: Placed[]): boolean {
  return items.every((item) => placed.some((entry) => entry.id === item.id && entry.bin === item.bin));
}

export function gradeChoice(options: Choice[], id: string): { ok: boolean; wrong: string | null } {
  const option = options.find((entry) => entry.id === id);
  if (!option) return { ok: false, wrong: null };
  if (option.ok) return { ok: true, wrong: null };
  return { ok: false, wrong: option.wrong };
}

export type PostTry = "empty" | "look" | "remove" | "add";

export function gradePost(method: string, note: string): PostTry {
  if (method === "POST" && cleanNote(note) === "") return "empty";
  if (method === "GET") return "look";
  if (method === "DELETE") return "remove";
  return "add";
}

export interface Note {
  key: string;
  name: string;
  text: string;
  welcome: boolean;
  likes: number;
}

export function likeKey(key: string, notePrefix: string, likePrefix: string, welcomeKey: string): string | null {
  if (key === welcomeKey) return `${likePrefix}welcome`;
  if (!key.startsWith(notePrefix)) return null;
  const id = key.slice(notePrefix.length);
  return id ? `${likePrefix}${id}` : null;
}

export function notesFrom(data: unknown, prefix: string, welcomeKey: string, likePrefix = "win-k-"): Note[] {
  const record = asRecord(data);
  if (!record) return [];
  const notes: Note[] = [];
  for (const [key, value] of Object.entries(record)) {
    if (key === welcomeKey && typeof value === "string") {
      notes.push({ key, name: "", text: value, welcome: true, likes: likesOn(record, key, prefix, likePrefix, welcomeKey) });
      continue;
    }
    if (!key.startsWith(prefix) || !value || typeof value !== "object" || Array.isArray(value)) continue;
    const name = (value as { name?: unknown }).name;
    const text = (value as { text?: unknown }).text;
    if (typeof name !== "string" || typeof text !== "string") continue;
    notes.push({ key, name, text, welcome: false, likes: likesOn(record, key, prefix, likePrefix, welcomeKey) });
  }
  notes.sort((a, b) => Number(b.welcome) - Number(a.welcome) || a.name.localeCompare(b.name) || a.key.localeCompare(b.key));
  return notes;
}

function likesOn(record: Record<string, unknown>, key: string, notePrefix: string, likePrefix: string, welcomeKey: string): number {
  const id = likeKey(key, notePrefix, likePrefix, welcomeKey);
  const value = id ? record[id] : 0;
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function fivesFrom(data: unknown, key: string): number {
  const record = asRecord(data);
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function asRecord(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  return data as Record<string, unknown>;
}

export function noteKey(prefix: string): string {
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  let id = "";
  for (const byte of bytes) id += byte.toString(16).padStart(2, "0");
  return `${prefix}${id}`;
}

export function statusHint(status: number): string {
  if (status === 200) return "200 means OK.";
  if (status === 201) return "201 means created. Your note was added.";
  if (status === 400) return "400 means the window could not read the request.";
  if (status === 404) return "404 means that address is not there.";
  return `Status ${status}.`;
}

export function showResponse(status: number, json: unknown, text: string): string {
  if (status === 404) return "Not Found";
  if (json !== null) {
    const pretty = JSON.stringify(json, null, 2);
    if (pretty.length > 900) return `${pretty.slice(0, 900)}\n…`;
    return pretty;
  }
  const clean = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return clean.slice(0, 300) || "(empty)";
}

export function maskSecret(value: string, secret: string): string {
  return value.split(secret).join("••••");
}

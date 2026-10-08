import type { Exchange } from "./api";
import { LEVELS, type Step } from "./lesson";
import type { Note, Placed } from "./rules";

const PROGRESS = "the-window-v2";
const MINE = "the-window-mine";

export interface Seen {
  empty: boolean;
  address: boolean;
  body: boolean;
}

export interface State {
  phase: "name" | "lesson" | "done";
  name: string;
  level: number;
  beat: number;
  placed: Placed[];
  selected: string | null;
  note: string;
  wrong: string | null;
  badId: string | null;
  success: string | null;
  chose: boolean;
  gets: number;
  posted: boolean;
  patched: boolean;
  removed: boolean;
  seen: Seen;
  mine: string[];
  board: Note[];
  fives: number | null;
  exchange: Exchange | null;
  busy: boolean;
  bootError: string | null;
  confirmReset: boolean;
  confirmClear: boolean;
}

export function emptySeen(): Seen {
  return { empty: false, address: false, body: false };
}

export function fresh(): State {
  return {
    phase: "name",
    name: "",
    level: 0,
    beat: 0,
    placed: [],
    selected: null,
    note: "",
    wrong: null,
    badId: null,
    success: null,
    chose: false,
    gets: 0,
    posted: false,
    patched: false,
    removed: false,
    seen: emptySeen(),
    mine: loadMine(),
    board: [],
    fives: null,
    exchange: null,
    busy: false,
    bootError: null,
    confirmReset: false,
    confirmClear: false,
  };
}

export function load(): State {
  const saved = read(PROGRESS);
  if (!saved || (saved.phase !== "name" && saved.phase !== "lesson" && saved.phase !== "done")) return fresh();
  const next = fresh();
  next.phase = saved.phase;
  next.name = typeof saved.name === "string" ? saved.name : "";
  next.level = clamp(saved.level, LEVELS.length - 1);
  next.beat = clamp(saved.beat, 12);
  next.placed = Array.isArray(saved.placed) ? saved.placed.filter(isPlaced) : [];
  next.selected = typeof saved.selected === "string" ? saved.selected : null;
  next.note = typeof saved.note === "string" ? saved.note : "";
  next.success = typeof saved.success === "string" ? saved.success : null;
  next.chose = saved.chose === true;
  next.gets = typeof saved.gets === "number" ? saved.gets : 0;
  next.posted = saved.posted === true;
  next.patched = saved.patched === true;
  next.removed = saved.removed === true;
  next.seen = isSeen(saved.seen) ? saved.seen : emptySeen();
  next.mine = loadMine();
  next.fives = typeof saved.fives === "number" ? saved.fives : null;
  next.exchange = isExchange(saved.exchange) ? saved.exchange : null;
  if (!stepAt(next.level, next.beat)) {
    next.level = 0;
    next.beat = 0;
  }
  return next;
}

export function save(state: State): void {
  const { busy, board, confirmReset, confirmClear, bootError, wrong, badId, ...rest } = state;
  write(PROGRESS, rest);
  saveMine(state.mine);
}

export function clearProgress(): void {
  localStorage.removeItem(PROGRESS);
}

export function loadMine(): string[] {
  const saved = read(MINE);
  if (!Array.isArray(saved)) return [];
  return saved.filter((key) => typeof key === "string");
}

export function saveMine(keys: string[]): void {
  write(MINE, keys);
}

export function clearMine(): void {
  localStorage.removeItem(MINE);
}

export function currentStep(state: State): Step | null {
  if (state.phase !== "lesson") return null;
  return stepAt(state.level, state.beat);
}

function stepAt(level: number, beat: number): Step | null {
  return LEVELS[level]?.steps[beat] ?? null;
}

function clamp(value: unknown, max: number): number {
  const n = typeof value === "number" && Number.isFinite(value) ? Math.floor(value) : 0;
  return Math.min(max, Math.max(0, n));
}

function isPlaced(value: unknown): value is Placed {
  if (!value || typeof value !== "object") return false;
  const placed = value as Placed;
  return typeof placed.id === "string" && typeof placed.bin === "string";
}

function isSeen(value: unknown): value is Seen {
  if (!value || typeof value !== "object") return false;
  const seen = value as Seen;
  return typeof seen.empty === "boolean" && typeof seen.address === "boolean" && typeof seen.body === "boolean";
}

function isExchange(value: unknown): value is Exchange {
  if (!value || typeof value !== "object") return false;
  const exchange = value as Exchange;
  return typeof exchange.method === "string" && typeof exchange.url === "string" && typeof exchange.status === "number" && typeof exchange.response === "string";
}

function read(key: string): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed as Record<string, unknown>;
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Private mode can refuse storage. The lesson still runs.
  }
}

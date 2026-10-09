import { FIVES_KEY, MISSING_KEY, RECORDS_PATH, STORE_ORIGIN, STORE_SECRET, WELCOME_KEY, WELCOME_TEXT } from "./config";
import { asRecord, maskSecret, showResponse } from "./rules";

export interface Exchange {
  method: string;
  url: string;
  body: string | null;
  status: number;
  response: string;
}

export interface CallResult {
  status: number;
  json: unknown;
  exchange: Exchange;
}

interface CallOpts {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string>;
  body?: unknown;
  rawBody?: string;
  secret?: boolean;
}

export async function call(opts: CallOpts): Promise<CallResult> {
  const params = new URLSearchParams();
  if (opts.secret !== false) params.set("secret", STORE_SECRET);
  for (const [key, value] of Object.entries(opts.query ?? {})) params.set(key, value);
  const query = params.toString();
  const real = `${STORE_ORIGIN}${opts.path}${query ? `?${query}` : ""}`;
  const shownQuery = maskSecret(query, STORE_SECRET);
  const url = `${STORE_ORIGIN}${opts.path}${shownQuery ? `?${shownQuery}` : ""}`;
  const raw = opts.rawBody !== undefined ? opts.rawBody : opts.body !== undefined ? JSON.stringify(opts.body) : undefined;
  const response = await fetch(real, {
    method: opts.method,
    cache: "no-store",
    headers: raw !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: raw,
  });
  const text = await response.text();
  let json: unknown = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  const displayBody = opts.rawBody !== undefined ? opts.rawBody : opts.body !== undefined ? JSON.stringify(opts.body, null, 2) : null;
  return {
    status: response.status,
    json,
    exchange: {
      method: opts.method,
      url: maskSecret(url, STORE_SECRET),
      body: displayBody === null ? null : maskSecret(displayBody, STORE_SECRET),
      status: response.status,
      response: showResponse(response.status, json, text),
    },
  };
}

export function getAll(): Promise<CallResult> {
  return call({ method: "GET", path: RECORDS_PATH });
}

export function postRecords(body: unknown): Promise<CallResult> {
  return call({ method: "POST", path: RECORDS_PATH, body });
}

export function deleteKey(key: string): Promise<CallResult> {
  return call({ method: "DELETE", path: RECORDS_PATH, query: { key } });
}

export function deleteKeys(keys: string[]): Promise<CallResult> {
  return call({ method: "PATCH", path: RECORDS_PATH, body: { action: "delete", data: keys } });
}

export function incrementKey(key: string): Promise<CallResult> {
  return call({
    method: "PATCH",
    path: RECORDS_PATH,
    body: { action: "increment_by", data: { key, amount: 1 } },
  });
}

export function incrementFives(): Promise<CallResult> {
  return incrementKey(FIVES_KEY);
}

export function getMissing(): Promise<CallResult> {
  return call({ method: "GET", path: RECORDS_PATH, query: { key: MISSING_KEY } });
}

export function getBadAddress(): Promise<CallResult> {
  return call({ method: "GET", path: "/api/no-such-window", secret: false });
}

export function postBroken(): Promise<CallResult> {
  return call({ method: "POST", path: RECORDS_PATH, rawBody: "not-json" });
}

export async function ensureWelcome(): Promise<void> {
  const got = await getAll();
  const data = asRecord(got.json);
  if (data && typeof data[WELCOME_KEY] === "string") return;
  await postRecords({ [WELCOME_KEY]: WELCOME_TEXT });
}

export async function clearLesson(): Promise<CallResult> {
  const got = await getAll();
  const data = asRecord(got.json) ?? {};
  let last = got;
  for (const key of Object.keys(data)) {
    if (!key.startsWith("win-")) continue;
    last = await deleteKey(key);
  }
  last = await postRecords({ [WELCOME_KEY]: WELCOME_TEXT });
  return last;
}

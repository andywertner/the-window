import "./style.css";
import { clearLesson, deleteKey, ensureWelcome, getAll, getBadAddress, getMissing, incrementFives, postBroken, postRecords } from "./api";
import { LEVELS } from "./lesson";
import { asRecord, cleanName, cleanNote, fivesFrom, gradeChoice, gradePost, noteKey, notesFrom, placeItem, sortDone, validName } from "./rules";
import { GATE_MS, render } from "./render";
import { clearMine, clearProgress, currentStep, fresh, load, save, type State } from "./state";
import { FIVES_KEY, NOTE_PREFIX, WELCOME_KEY, WELCOME_TEXT } from "./config";

const teacher = new URLSearchParams(location.search).get("teacher") === "1";
const app = document.querySelector<HTMLElement>("#app");
if (!app) throw new Error("Missing #app");

let state: State = load();
let ticket = 0;
let zoom = 1;
let boardDirty = false;
let gateKey = "";
let gateStart = 0;
let gateTimer = 0;

function gateElapsed(): number | null {
  const step = currentStep(state);
  if (teacher || state.phase !== "lesson" || step?.kind !== "card") return null;
  const key = `${state.level}.${state.beat}`;
  if (key !== gateKey) {
    gateKey = key;
    gateStart = Date.now();
    window.clearTimeout(gateTimer);
    gateTimer = window.setTimeout(draw, GATE_MS + 50);
  }
  const elapsed = Date.now() - gateStart;
  return elapsed >= GATE_MS ? null : elapsed;
}

function draw(): void {
  boardDirty = false;
  const note = document.activeElement instanceof HTMLTextAreaElement && document.activeElement.id === "note" ? document.activeElement : null;
  const caret = note ? note.selectionStart : null;
  app!.innerHTML = render(state, teacher, gateElapsed());
  app!.dataset.phase = state.phase;
  app!.classList.toggle("full", state.phase === "name");
  save(state);
  if (caret !== null) {
    const field = document.querySelector<HTMLTextAreaElement>("#note");
    if (field) {
      field.focus();
      field.setSelectionRange(caret, caret);
    }
  }
}

function advance(): void {
  const level = LEVELS[state.level];
  if (!level) return;
  state.success = null;
  state.wrong = null;
  state.badId = null;
  state.selected = null;
  state.placed = [];
  state.chose = false;
  state.gets = 0;
  state.posted = false;
  state.patched = false;
  state.removed = false;
  state.note = "";
  if (state.beat < level.steps.length - 1) {
    state.beat += 1;
    const step = currentStep(state);
    if (step?.kind === "probe") state.seen = { empty: false, address: false, body: false };
    draw();
    afterEnter();
    return;
  }
  if (state.level < LEVELS.length - 1) {
    state.level += 1;
    state.beat = 0;
    draw();
    afterEnter();
    return;
  }
  state.phase = "done";
  draw();
}

function ready(): boolean {
  const step = currentStep(state);
  if (!step) return false;
  if (step.kind === "card") return gateElapsed() === null;
  if (step.kind === "sort") return sortDone(step.items, state.placed);
  if (step.kind === "get") return state.gets >= 2;
  if (step.kind === "post") return state.posted;
  if (step.kind === "patch") return state.patched;
  if (step.kind === "remove") return state.removed;
  if (step.kind === "probe") return state.seen.empty && state.seen.address && state.seen.body;
  if (step.kind === "choose") return state.chose;
  return false;
}

function afterEnter(): void {
  const step = currentStep(state);
  if (step?.kind === "post" || step?.kind === "remove" || step?.kind === "patch" || (step?.kind === "get" && state.gets > 0)) {
    void refreshQuiet();
  }
}

function applyBoard(data: unknown): void {
  state.board = notesFrom(data, NOTE_PREFIX, WELCOME_KEY);
  state.fives = fivesFrom(data, FIVES_KEY);
  const live = new Set(state.board.map((note) => note.key));
  state.mine = state.mine.filter((key) => live.has(key));
}

async function refreshQuiet(): Promise<void> {
  const id = ticket;
  try {
    const got = await getAll();
    if (id !== ticket) return;
    const data = asRecord(got.json);
    if (!data || typeof data[WELCOME_KEY] !== "string") {
      await postRecords({ [WELCOME_KEY]: WELCOME_TEXT });
      if (id !== ticket) return;
      const again = await getAll();
      if (id !== ticket) return;
      applyBoard(again.json);
    } else {
      applyBoard(got.json);
    }
    const step = currentStep(state);
    if (step?.kind === "remove" && state.mine.length === 0) {
      state.removed = true;
      state.success = step.empty;
    }
    const typing = document.activeElement instanceof HTMLTextAreaElement && document.activeElement.id === "note";
    if (typing) {
      boardDirty = true;
      return;
    }
    draw();
  } catch {
    // The activity can still try its own request.
  }
}

async function run(work: (id: number) => Promise<void>): Promise<void> {
  const id = ++ticket;
  state.busy = true;
  state.wrong = null;
  state.badId = null;
  draw();
  try {
    await work(id);
  } catch {
    if (id !== ticket) return;
    state.wrong = "The window did not answer. Check the connection and try again.";
  } finally {
    if (id === ticket) {
      state.busy = false;
      draw();
    }
  }
}

function begin(): void {
  const input = document.querySelector<HTMLInputElement>("#name");
  const name = cleanName(input?.value ?? state.name);
  if (!validName(name)) {
    state.name = name;
    state.wrong = "Type your first name to begin.";
    draw();
    return;
  }
  state = fresh();
  state.name = name;
  state.phase = "lesson";
  gateKey = "";
  draw();
  void warmup();
}

function resetAll(): void {
  ticket += 1;
  clearProgress();
  const mine = state.mine.slice();
  state = fresh();
  state.mine = mine;
  draw();
}

async function warmup(): Promise<void> {
  try {
    await ensureWelcome();
    if (state.bootError) {
      state.bootError = null;
      draw();
    }
  } catch {
    state.bootError = "The window is not answering yet. You can read the cards, then try the buttons again.";
    draw();
  }
}

function noteField(): string {
  const field = document.querySelector<HTMLTextAreaElement>("#note");
  return field?.value ?? state.note;
}

async function onGet(): Promise<void> {
  const step = currentStep(state);
  if (step?.kind !== "get" || state.gets >= 2) return;
  await run(async (id) => {
    let got = await getAll();
    if (id !== ticket) return;
    const data = asRecord(got.json);
    if (!data || typeof data[WELCOME_KEY] !== "string") {
      await postRecords({ [WELCOME_KEY]: WELCOME_TEXT });
      if (id !== ticket) return;
      got = await getAll();
      if (id !== ticket) return;
    }
    state.exchange = got.exchange;
    applyBoard(got.json);
    state.gets += 1;
    if (state.gets >= 2) {
      const now = currentStep(state);
      if (now?.kind === "get") state.success = now.success;
    }
  });
}

async function onVerb(method: string): Promise<void> {
  const step = currentStep(state);
  if (step?.kind !== "post" || state.posted) return;
  const note = cleanNote(noteField());
  state.note = noteField();
  const grade = gradePost(method, note);
  if (grade === "empty") {
    state.wrong = "The body is empty. A window often answers 400 Bad Request for that. We stopped this one before sending.";
    state.badId = "POST";
    draw();
    return;
  }
  if (grade === "look") {
    state.wrong = "GET looks. Your note is still on this computer.";
    state.badId = "GET";
    draw();
    return;
  }
  if (grade === "remove") {
    state.wrong = "DELETE takes a note down. Pinning a new note takes POST.";
    state.badId = "DELETE";
    draw();
    return;
  }
  await run(async (id) => {
    const key = noteKey(NOTE_PREFIX);
    const posted = await postRecords({ [key]: { name: state.name, text: note } });
    if (id !== ticket) return;
    state.exchange = posted.exchange;
    if (posted.status >= 400) {
      state.wrong = "The window answered, and it did not take the note.";
      return;
    }
    state.mine = state.mine.concat(key);
    const got = await getAll();
    if (id !== ticket) return;
    applyBoard(got.json);
    state.posted = true;
    state.note = "";
    const now = currentStep(state);
    if (now?.kind === "post") state.success = now.success;
  });
}

async function onPatch(): Promise<void> {
  const step = currentStep(state);
  if (step?.kind !== "patch" || state.patched) return;
  await run(async (id) => {
    const patched = await incrementFives();
    if (id !== ticket) return;
    state.exchange = patched.exchange;
    if (patched.status >= 400) {
      state.wrong = "The window answered, and the count did not change.";
      return;
    }
    if (typeof patched.json === "number") state.fives = patched.json;
    const got = await getAll();
    if (id !== ticket) return;
    applyBoard(got.json);
    if (typeof patched.json === "number") state.fives = patched.json;
    state.patched = true;
    const now = currentStep(state);
    if (now?.kind === "patch") state.success = now.success;
  });
}

async function onDelete(): Promise<void> {
  const step = currentStep(state);
  if (step?.kind !== "remove" || state.removed || state.mine.length === 0) return;
  const keys = state.mine.slice();
  const first = keys[0];
  if (!first) return;
  await run(async (id) => {
    let last = await deleteKey(first);
    if (id !== ticket) return;
    for (const key of keys.slice(1)) {
      last = await deleteKey(key);
      if (id !== ticket) return;
    }
    state.exchange = last.exchange;
    applyBoard(last.json);
    state.removed = true;
    const now = currentStep(state);
    if (now?.kind === "remove") state.success = now.success;
  });
}

async function onProbe(which: "empty" | "address" | "body"): Promise<void> {
  const step = currentStep(state);
  if (step?.kind !== "probe") return;
  await run(async (id) => {
    const got = which === "empty" ? await getMissing() : which === "address" ? await getBadAddress() : await postBroken();
    if (id !== ticket) return;
    state.exchange = got.exchange;
    const expect = which === "empty" ? 200 : which === "address" ? 404 : 400;
    if (got.status !== expect) {
      state.wrong = `That came back as ${got.status}. Try that button again.`;
      return;
    }
    state.seen[which] = true;
    if (state.seen.empty && state.seen.address && state.seen.body) state.success = "You have all three answers.";
  });
}

async function onClear(): Promise<void> {
  state.confirmClear = false;
  await run(async (id) => {
    const cleared = await clearLesson();
    if (id !== ticket) return;
    state.exchange = cleared.exchange;
    clearMine();
    state.mine = [];
    applyBoard(cleared.json);
    state.success = "Class board cleared. The welcome note is back.";
    const step = currentStep(state);
    if (step?.kind === "remove") state.removed = true;
  });
}

function onClick(event: MouseEvent): void {
  const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-act]");
  if (!target || target.hasAttribute("disabled")) return;
  const act = target.dataset.act;
  if (act === "new") {
    if (state.confirmReset) return;
    state.confirmClear = false;
    state.confirmReset = true;
    draw();
    return;
  }
  if (act === "new-no") {
    state.confirmReset = false;
    draw();
    return;
  }
  if (act === "new-yes") {
    state.confirmReset = false;
    resetAll();
    return;
  }
  if (act === "zoom") {
    setZoom(zoom + (target.dataset.dir === "in" ? 0.1 : -0.1));
    return;
  }
  if (act === "teacher") {
    state.confirmReset = false;
    state.confirmClear = true;
    draw();
    return;
  }
  if (act === "clear-no") {
    state.confirmClear = false;
    draw();
    return;
  }
  if (act === "clear-yes") {
    void onClear();
    return;
  }
  if (state.confirmReset || state.confirmClear || state.busy) return;
  if (act === "next") {
    if (ready()) advance();
    return;
  }
  if (act === "item") {
    const step = currentStep(state);
    const id = target.dataset.item;
    if (step?.kind !== "sort" || !id || sortDone(step.items, state.placed)) return;
    state.selected = state.selected === id ? null : id;
    state.badId = null;
    state.wrong = null;
    draw();
    return;
  }
  if (act === "zone") {
    const step = currentStep(state);
    const zone = target.dataset.zone;
    if (step?.kind !== "sort" || !zone) return;
    if (!state.selected) {
      state.wrong = "Tap a card first.";
      draw();
      return;
    }
    const result = placeItem(step.items, state.placed, state.selected, zone);
    state.placed = result.placed;
    state.wrong = result.wrong;
    state.badId = result.wrong ? state.selected : null;
    if (!result.wrong) state.selected = null;
    if (sortDone(step.items, state.placed)) state.success = step.success;
    draw();
    return;
  }
  if (act === "choose") {
    const step = currentStep(state);
    const id = target.dataset.id;
    if (step?.kind !== "choose" || !id || state.chose) return;
    const graded = gradeChoice(step.options, id);
    if (graded.ok) {
      state.chose = true;
      state.success = step.success;
      state.wrong = null;
      state.badId = null;
    } else {
      state.wrong = graded.wrong;
      state.badId = id;
    }
    draw();
    return;
  }
  if (act === "send-get") void onGet();
  if (act === "verb") void onVerb(target.dataset.method ?? "");
  if (act === "send-patch") void onPatch();
  if (act === "send-delete") void onDelete();
  if (act === "probe") {
    const which = target.dataset.probe;
    if (which === "empty" || which === "address" || which === "body") void onProbe(which);
  }
}

function onInput(event: Event): void {
  const target = event.target;
  if (!(target instanceof HTMLTextAreaElement) || target.id !== "note") return;
  state.note = target.value;
  const count = document.querySelector("#count");
  if (count) count.textContent = `${cleanNote(state.note).length}/80`;
}

function setZoom(next: number): void {
  zoom = Math.round(Math.min(1.6, Math.max(0.7, next)) * 10) / 10;
  document.documentElement.style.setProperty("--z", String(zoom));
  const label = document.querySelector("#zoom-level");
  if (label) label.textContent = `${Math.round(zoom * 100)}%`;
  try {
    localStorage.setItem("the-window-zoom", String(zoom));
  } catch {
    // Ignore storage failures.
  }
}

document.addEventListener("click", onClick);
document.addEventListener("input", onInput);
document.addEventListener("focusout", () => {
  window.setTimeout(() => {
    if (!boardDirty) return;
    if (document.activeElement instanceof HTMLTextAreaElement && document.activeElement.id === "note") return;
    draw();
  }, 0);
});
document.addEventListener("submit", (event) => {
  if (!(event.target instanceof HTMLFormElement) || event.target.id !== "name-form") return;
  event.preventDefault();
  begin();
});

const savedZoom = Number(localStorage.getItem("the-window-zoom"));
if (savedZoom) setZoom(savedZoom);
draw();
if (state.phase !== "name") {
  void warmup();
  afterEnter();
}

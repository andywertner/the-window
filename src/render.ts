import { LEVELS, PART_COUNT, type Step } from "./lesson";
import { cleanNote, sortDone, statusHint, type Bin, type Note, type Placed, type SortItem } from "./rules";
import { currentStep, type State } from "./state";

export function render(state: State, teacher: boolean): string {
  const page = state.phase === "name" ? nameScreen(state) : shell(state, teacher, state.phase === "done" ? doneView() : stepView(state));
  return page + overlay(state);
}

function nameScreen(state: State): string {
  return `<main class="name">
    <div class="panes" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <h1>The Window</h1>
    <p>A lesson about APIs. About 30 minutes.</p>
    <form id="name-form">
      <label for="name">Your first name</label>
      <input id="name" maxlength="20" autocomplete="given-name" value="${escape(state.name)}" />
      ${state.wrong ? `<p class="banner bad" aria-live="polite">${escape(state.wrong)}</p>` : ""}
      <button type="submit" class="go">Start</button>
    </form>
  </main>`;
}

function shell(state: State, teacher: boolean, main: string): string {
  const title = state.phase === "done" ? "You did it" : LEVELS[state.level]?.title ?? "";
  const part = state.phase === "done" ? PART_COUNT : state.level + 1;
  return `<header>
      <div class="titles">
        <h1>The Window</h1>
        <p class="part">Part ${part} of ${PART_COUNT} · ${escape(title)}</p>
      </div>
      ${teacher ? `<button type="button" class="teacher" data-act="teacher">Clear class board</button>` : ""}
      <div class="pips" aria-hidden="true">${LEVELS.map((_, index) => `<i class="${pipClass(state, index)}"></i>`).join("")}</div>
    </header>
    <div class="stage">
      <section class="lesson">${main}</section>
      ${panel(state)}
    </div>`;
}

function stepView(state: State): string {
  const step = currentStep(state);
  if (!step) return "";
  if (step.kind === "card") return card(step.lines, step.button);
  if (step.kind === "sort") return sortView(state, step);
  if (step.kind === "get") return getView(state, step.prompt, step.success);
  if (step.kind === "post") return postView(state, step.prompt);
  if (step.kind === "patch") return patchView(state, step.prompt);
  if (step.kind === "remove") return removeView(state, step.prompt);
  if (step.kind === "probe") return probeView(state, step.prompt);
  return chooseView(state, step.prompt, step.options);
}

function card(lines: string[], button: string): string {
  return `<div class="card">${lines.map((line) => `<p>${escape(line)}</p>`).join("")}
    <button type="button" class="go" data-act="next">${escape(button)}</button>
  </div>`;
}

function sortView(state: State, step: Extract<Step, { kind: "sort" }>): string {
  const done = sortDone(step.items, state.placed);
  const long = step.items.some((item) => item.label.length > 24);
  const unplaced = step.items.filter((item) => !state.placed.some((placed) => placed.id === item.id));
  return `<h2>${escape(step.prompt)}</h2>
    ${banner(state)}
    ${step.recap ? `<p class="recap">You saw 200, 404, and 400.</p>` : ""}
    <div class="pile${long ? " long" : ""}">${unplaced.map((item) => slip(item, state)).join("") || `<p class="empty">Every slip is in a bin.</p>`}</div>
    <div class="bins" data-n="${step.bins.length}">${step.bins.map((bin) => binView(bin, step.items, state.placed)).join("")}</div>
    ${done ? "" : `<p class="hint">${escape(step.hint)}</p>`}
    ${next("Next", done)}`;
}

function slip(item: SortItem, state: State): string {
  const cls = ["slip", state.selected === item.id ? "sel" : "", state.badId === item.id ? "bad" : ""].filter(Boolean).join(" ");
  return `<button type="button" class="${cls}" data-act="item" data-item="${escape(item.id)}" aria-pressed="${state.selected === item.id}">${escape(item.label)}</button>`;
}

function binView(bin: Bin, items: SortItem[], placed: Placed[]): string {
  const inside = placed
    .filter((entry) => entry.bin === bin.id)
    .map((entry) => items.find((item) => item.id === entry.id)?.label ?? "")
    .filter(Boolean);
  return `<button type="button" class="bin bin-${escape(bin.id)}" data-act="zone" data-zone="${escape(bin.id)}">
    <b>${escape(bin.label)}</b>
    <span>${inside.map((label) => `<em>${escape(label)}</em>`).join("")}</span>
  </button>`;
}

function getView(state: State, prompt: string, _success: string): string {
  const ready = state.gets >= 2;
  const label = state.gets === 0 ? "Send GET" : "Send GET again";
  return `<h2>${escape(prompt)}</h2>
    ${banner(state)}
    ${board(state)}
    ${ready ? "" : send("send-get", label, state.busy, "get")}
    ${next("Next", ready)}`;
}

function postView(state: State, prompt: string): string {
  return `<h2>${escape(prompt)}</h2>
    ${banner(state)}
    ${state.posted ? "" : `<p class="signed">Signed as ${escape(state.name)}</p>
    <textarea id="note" maxlength="80" placeholder="One sentence for the class." ${state.busy ? "disabled" : ""}>${escape(state.note)}</textarea>
    <p class="count" id="count">${cleanNote(state.note).length}/80</p>
    <div class="methods">
      ${verb("GET", state)}
      ${verb("POST", state)}
      ${verb("DELETE", state)}
    </div>`}
    ${board(state)}
    ${next("Next", state.posted)}`;
}

function patchView(state: State, prompt: string): string {
  const total = state.fives === null ? "…" : String(state.fives);
  return `<h2>${escape(prompt)}</h2>
    ${banner(state)}
    <p class="total">Class high fives: <strong>${escape(total)}</strong></p>
    ${state.patched ? "" : send("send-patch", "Add 1 high five", state.busy, "patch")}
    ${next("Next", state.patched)}`;
}

function removeView(state: State, prompt: string): string {
  const ready = state.removed;
  return `<h2>${escape(prompt)}</h2>
    ${banner(state)}
    ${board(state)}
    ${ready || state.mine.length === 0 ? "" : send("send-delete", state.mine.length > 1 ? "Take my notes down" : "Take my note down", state.busy, "delete")}
    ${next("Next", ready)}`;
}

function probeView(state: State, prompt: string): string {
  const ready = state.seen.empty && state.seen.address && state.seen.body;
  return `<h2>${escape(prompt)}</h2>
    ${banner(state)}
    <ul class="checks">
      ${check("Empty locker", state.seen.empty, "200")}
      ${check("Bad address", state.seen.address, "404")}
      ${check("Broken body", state.seen.body, "400")}
    </ul>
    <div class="methods stack">
      ${probeButton("empty", "Look in an empty locker", state)}
      ${probeButton("address", "Open a bad address", state)}
      ${probeButton("body", "Send a broken body", state)}
    </div>
    ${next("Match the codes", ready)}`;
}

function chooseView(state: State, prompt: string, options: { id: string; label: string; ok: boolean }[]): string {
  return `<h2>${escape(prompt)}</h2>
    ${banner(state)}
    <div class="methods">
      ${options.map((option) => {
        const cls = ["verb", option.id.toLowerCase(), state.badId === option.id ? "bad" : "", state.chose && option.ok ? "picked" : ""].filter(Boolean).join(" ");
        return `<button type="button" class="${cls}" data-act="choose" data-id="${escape(option.id)}" ${state.chose || state.busy ? "disabled" : ""}>${escape(option.label)}</button>`;
      }).join("")}
    </div>
    ${next("Next", state.chose)}`;
}

function doneView(): string {
  return `<div class="card done">
    <p>You sent real requests to a real API.</p>
    <ul class="recap-verbs">
      <li><b>GET</b> looks.</li>
      <li><b>POST</b> adds.</li>
      <li><b>PUT</b> replaces the whole thing.</li>
      <li><b>PATCH</b> changes a little.</li>
      <li><b>DELETE</b> removes.</li>
    </ul>
    <p>That is how apps share work, without sharing the whole room.</p>
  </div>`;
}

function panel(state: State): string {
  const exchange = state.exchange;
  const quiet = `<p class="quiet">No request yet. The pass stays hidden.</p>`;
  const body = !exchange
    ? quiet
    : `<p class="method ${exchange.method.toLowerCase()}">${escape(exchange.method)}</p>
      <p class="url">${escape(exchange.url)}</p>
      <h3>Body</h3>
      <pre>${escape(exchange.body === null ? (exchange.method === "GET" ? "No body. A GET does not send one." : "No body.") : exchange.body)}</pre>
      <h3>Response</h3>
      <p class="status ${exchange.status >= 200 && exchange.status < 300 ? "ok" : "bad"}">${exchange.status}</p>
      <p class="hint">${escape(statusHint(exchange.status))}</p>
      <pre>${escape(exchange.response)}</pre>`;
  return `<aside class="window" aria-live="polite">
    <div class="window-bar"><i></i><i></i><i></i><span>The window</span></div>
    <div class="pane">
      ${state.busy ? `<p class="wait">Waiting for the window…</p>` : ""}
      ${state.bootError ? `<p class="banner bad">${escape(state.bootError)}</p>` : ""}
      ${body}
    </div>
  </aside>`;
}

function board(state: State): string {
  if (state.board.length === 0) return `<p class="empty">The board shows up here after you reach the window.</p>`;
  return `<ul class="board">${state.board.map((note) => noteView(note, state.mine.includes(note.key))).join("")}</ul>`;
}

function noteView(note: Note, mine: boolean): string {
  const cls = note.welcome ? "welcome" : mine ? "mine" : "";
  const who = note.welcome ? "Already here" : escape(note.name);
  return `<li class="${cls}"><b>${who}</b><span>${escape(note.text)}</span></li>`;
}

function banner(state: State): string {
  if (state.wrong) return `<p class="banner bad" aria-live="polite">${escape(state.wrong)}</p>`;
  if (state.success) return `<p class="banner good" aria-live="polite">${escape(state.success)}</p>`;
  return "";
}

function next(label: string, show: boolean): string {
  if (!show) return "";
  return `<button type="button" class="go" data-act="next">${escape(label)}</button>`;
}

function send(act: string, label: string, busy: boolean, tone: string): string {
  return `<button type="button" class="go ${tone}" data-act="${act}" ${busy ? "disabled" : ""}>${escape(label)}</button>`;
}

function verb(method: string, state: State): string {
  const cls = ["verb", method.toLowerCase(), state.badId === method ? "bad" : ""].filter(Boolean).join(" ");
  return `<button type="button" class="${cls}" data-act="verb" data-method="${method}" ${state.busy ? "disabled" : ""}>${method}</button>`;
}

function probeButton(id: string, label: string, state: State): string {
  const seen = state.seen[id as keyof State["seen"]];
  return `<button type="button" class="go quiet-btn ${seen ? "picked" : ""}" data-act="probe" data-probe="${id}" ${state.busy ? "disabled" : ""}>${escape(label)}</button>`;
}

function check(label: string, on: boolean, code: string): string {
  return `<li class="${on ? "on" : ""}">${escape(label)}${on ? ` · ${code}` : ""}</li>`;
}

function pipClass(state: State, index: number): string {
  if (state.phase === "done" || index < state.level) return "done";
  if (index === state.level) return "now";
  return "";
}

function overlay(state: State): string {
  if (state.confirmReset) {
    return `<div class="veil"><div class="ask">
      <p>Start the lesson over on this computer?</p>
      <div class="methods">
        <button type="button" class="go quiet-btn" data-act="new-no">Keep going</button>
        <button type="button" class="go" data-act="new-yes">Yes, start over</button>
      </div>
    </div></div>`;
  }
  if (state.confirmClear) {
    return `<div class="veil"><div class="ask">
      <p>Clear every class note and reset the high-five count?</p>
      <div class="methods">
        <button type="button" class="go quiet-btn" data-act="clear-no">Keep the board</button>
        <button type="button" class="go delete" data-act="clear-yes">Yes, clear it</button>
      </div>
    </div></div>`;
  }
  return "";
}

function escape(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === '"') return "&quot;";
    return "&#39;";
  });
}

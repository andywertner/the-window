import { LEVELS, PART_COUNT, VERB_ICONS, type Slide, type Step } from "./lesson";
import { cleanNote, sortDone, statusHint, type Bin, type Note, type Placed, type SortItem } from "./rules";
import { currentStep, type State } from "./state";

export const GATE_MS = 10000;
const GATE_PANES = 10;
const GATE_WORDS = ["Soaking it in…", "Brain loading…", "Let it sink in…", "Think about it…", "Picture it…", "Almost there…"];

export function render(state: State, teacher: boolean, gate: number | null): string {
  const page =
    state.phase === "name" ? nameScreen(state) : shell(state, teacher, state.phase === "done" ? doneView() : stepView(state, gate));
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
  const solo = state.phase === "done" || currentStep(state)?.kind === "card";
  return `<header>
      <div class="titles">
        <h1>The Window</h1>
        <p class="part">Part ${part} of ${PART_COUNT} · ${escape(title)}</p>
      </div>
      ${teacher ? `<button type="button" class="teacher" data-act="teacher">Clear class board</button>` : ""}
      <div class="pips" aria-hidden="true">${LEVELS.map((_, index) => `<i class="${pipClass(state, index)}"></i>`).join("")}</div>
    </header>
    <div class="stage${solo ? " solo" : ""}">
      <section class="lesson${solo ? " solo" : ""}">${main}</section>
      ${solo ? "" : panel(state)}
    </div>`;
}

function stepView(state: State, gate: number | null): string {
  const step = currentStep(state);
  if (!step) return "";
  if (step.kind === "card") return card(step, slideCount(state), gate);
  if (step.kind === "sort") return sortView(state, step);
  if (step.kind === "get") return getView(state, step.prompt, step.success);
  if (step.kind === "post") return postView(state, step.prompt);
  if (step.kind === "patch") return patchView(state, step.prompt);
  if (step.kind === "remove") return removeView(state, step.prompt);
  if (step.kind === "probe") return probeView(state, step.prompt);
  return chooseView(state, step.art, step.prompt, step.options);
}

function slideCount(state: State): string {
  const steps = LEVELS[state.level]?.steps ?? [];
  const cards = steps.map((step, index) => (step.kind === "card" ? index : -1)).filter((index) => index >= 0);
  const at = cards.indexOf(state.beat);
  return at < 0 ? "" : `${at + 1} / ${cards.length}`;
}

function card(step: Slide, count: string, gate: number | null): string {
  const tone = step.tone ? ` tone-${step.tone}` : "";
  const label = step.button ?? "Next";
  return `<div class="slide${tone}">
    <div class="slide-top">
      ${step.tag ? `<p class="tag">${escape(step.tag)}</p>` : "<span></span>"}
      ${count ? `<p class="count-slides">${escape(count)}</p>` : ""}
    </div>
    <div class="art" aria-hidden="true">${escape(step.art)}</div>
    <h2 class="term">${escape(step.term)}</h2>
    <p class="def">${escape(step.text)}</p>
    ${step.example ? `<p class="example"><code>${escape(step.example)}</code></p>` : ""}
    <div class="slide-foot">
      ${gate === null ? "" : gateView(step.term, gate)}
      <button type="button" class="go" data-act="next" ${gate === null ? "" : "disabled"}>${escape(label)}</button>
    </div>
  </div>`;
}

function gateView(seed: string, elapsed: number): string {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const word = GATE_WORDS[hash % GATE_WORDS.length] ?? GATE_WORDS[0];
  const step = GATE_MS / GATE_PANES;
  const panes = Array.from({ length: GATE_PANES }, (_, index) => `<i style="animation-delay:${(index + 1) * step - elapsed}ms"></i>`).join("");
  return `<div class="gate" role="status" aria-label="Next unlocks in a few seconds">
    <span class="gate-panes">${panes}</span>
    <span class="gate-word">${escape(word ?? "")}</span>
  </div>`;
}

function sortView(state: State, step: Extract<Step, { kind: "sort" }>): string {
  const done = sortDone(step.items, state.placed);
  const long = step.items.some((item) => item.label.length > 24);
  const unplaced = step.items.filter((item) => !state.placed.some((placed) => placed.id === item.id));
  const wide = step.bins.length >= 5;
  return `<h2>${escape(step.prompt)}</h2>
    ${banner(state)}
    ${step.recap ? `<p class="recap">You saw 200, 404, and 400.</p>` : ""}
    <div class="sort-body${wide ? " wide" : ""}">
      <div class="pile${long ? " long" : ""}">${unplaced.map((item) => slip(item, state)).join("") || `<p class="empty">Every slip is in a bin.</p>`}</div>
      <div class="bins fit" data-n="${step.bins.length}">${step.bins.map((bin) => binView(bin, step.items, state.placed)).join("")}</div>
    </div>
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
    <b>${bin.icon ? `<span class="bin-icon" aria-hidden="true">${escape(bin.icon)}</span> ` : ""}${escape(bin.label)}</b>
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
  const refreshed = state.changeGets > 0;
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
    ${state.posted ? changeControls(state, "GET class board", refreshed) : ""}`;
}

function patchView(state: State, prompt: string): string {
  const total = state.fives === null ? "…" : String(state.fives);
  const refreshed = state.changeGets > 0;
  return `<h2>${escape(prompt)}</h2>
    ${banner(state)}
    <p class="total">Class high fives <small>(latest GET)</small>: <strong>${escape(total)}</strong></p>
    ${state.patched ? "" : send("send-patch", "Add 1 high five", state.busy, "patch")}
    ${state.patched ? changeControls(state, "GET latest class data", refreshed) : ""}`;
}

function removeView(state: State, prompt: string): string {
  const changed = state.removed && (state.mine.length > 0 || state.changeGets > 0);
  const ready = state.removed && (!changed || state.changeGets > 0);
  return `<h2>${escape(prompt)}</h2>
    ${banner(state)}
    ${board(state)}
    ${ready || state.mine.length === 0 ? "" : send("send-delete", state.mine.length > 1 ? "Take my notes down" : "Take my note down", state.busy, "delete")}
    ${changed ? changeControls(state, "GET class board", state.changeGets > 0) : next("Next", ready)}`;
}

function changeControls(state: State, getLabel: string, refreshed: boolean): string {
  return `<div class="change-controls">
    ${send("refresh-after-change", getLabel, state.busy, "get")}
    ${next("Next", refreshed)}
  </div>
  <p class="hint">${refreshed ? "GET again any time to see new class responses." : "Use GET to read what is now stored on the shared board."}</p>`;
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
    ${ready ? "" : `<div class="methods stack">
      ${probeButton("empty", "Look in an empty locker", state)}
      ${probeButton("address", "Open a bad address", state)}
      ${probeButton("body", "Send a broken body", state)}
    </div>`}
    ${next("Match the codes", ready)}`;
}

function chooseView(state: State, art: string, prompt: string, options: { id: string; label: string; ok: boolean }[]): string {
  return `<div class="art small" aria-hidden="true">${escape(art)}</div>
    <h2>${escape(prompt)}</h2>
    ${banner(state)}
    <div class="methods">
      ${options.map((option) => {
        const cls = ["verb", option.id.toLowerCase(), state.badId === option.id ? "bad" : "", state.chose && option.ok ? "picked" : ""].filter(Boolean).join(" ");
        const icon = VERB_ICONS[option.id] ? `${VERB_ICONS[option.id]} ` : "";
        return `<button type="button" class="${cls}" data-act="choose" data-id="${escape(option.id)}" ${state.chose || state.busy ? "disabled" : ""}>${escape(icon + option.label)}</button>`;
      }).join("")}
    </div>
    ${next("Next", state.chose)}`;
}

function doneView(): string {
  return `<div class="slide done">
    <div class="art" aria-hidden="true">🎉 🪟</div>
    <h2 class="term">You sent real requests to a real API.</h2>
    <ul class="recap-verbs">
      <li><span aria-hidden="true">${VERB_ICONS.GET}</span><b class="get">GET</b> looks.</li>
      <li><span aria-hidden="true">${VERB_ICONS.POST}</span><b class="post">POST</b> adds.</li>
      <li><span aria-hidden="true">${VERB_ICONS.PUT}</span><b class="put">PUT</b> replaces the whole thing.</li>
      <li><span aria-hidden="true">${VERB_ICONS.PATCH}</span><b class="patch">PATCH</b> changes a little.</li>
      <li><span aria-hidden="true">${VERB_ICONS.DELETE}</span><b class="delete">DELETE</b> removes.</li>
    </ul>
    <p class="def">That is how apps share work, without sharing the whole room.</p>
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
    <div class="window-bar"><i></i><i></i><i></i><span>🪟 The window</span><em>The raw request and response</em></div>
    <div class="pane">
      ${state.busy ? `<p class="wait">Waiting for the window…</p>` : ""}
      ${state.bootError ? `<p class="banner bad">${escape(state.bootError)}</p>` : ""}
      ${body}
    </div>
  </aside>`;
}

function board(state: State): string {
  const notes =
    state.board.length === 0
      ? `<p class="empty">The notes show up here after the first GET.</p>`
      : `<ul class="board">${state.board.map((note) => noteView(note, state.mine.includes(note.key))).join("")}</ul>`;
  return `<section class="boardbox fit" aria-label="Class board">
    <div class="boardbox-bar"><span aria-hidden="true">📋</span> Class board <em>What the app shows you</em></div>
    ${notes}
  </section>`;
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

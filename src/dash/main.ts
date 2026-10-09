import "../dash.css";
import { deleteKey, getAll, incrementKey, postRecords, type Exchange } from "../api";
import { asRecord, cleanName, cleanNote, noteKey, validName } from "../rules";

type Verb = "GET" | "POST" | "PATCH" | "DELETE";
type Phase = "name" | "intro" | "train" | "mix" | "done" | "play";

interface Round {
  theme: string;
  before: string;
  after: string;
  prompt: string;
  verb: Verb;
}

interface Note {
  key: string;
  name: string;
  text: string;
  likes: number;
  welcome: boolean;
  at: number;
}

interface DashState {
  phase: Phase;
  name: string;
  intro: number;
  verb: number;
  round: number;
  mix: number;
  solved: boolean;
  stars: number;
  streak: number;
  wrong: string;
  message: string;
  board: Note[];
  mine: string[];
  exchange: Exchange | null;
  busy: boolean;
  passOpen: boolean;
  passWrong: boolean;
  passIntent: "board" | "teacher";
  teacher: boolean;
}

const STORE = "window-dash-v1";
const MINE = "window-dash-mine";
const NOTE_PREFIX = "dash-n-";
const LIKE_PREFIX = "dash-k-";
const WELCOME_KEY = "dash-welcome";
const WELCOME_TEXT = "Welcome to the class message board!";
const VERBS: Verb[] = ["GET", "POST", "PATCH", "DELETE"];
const ICONS: Record<Verb, string> = { GET: "👀", POST: "➕", PATCH: "🩹", DELETE: "🗑️" };
const WORDS: Record<Verb, string> = {
  GET: "show me what is there",
  POST: "add something new",
  PATCH: "change something already there",
  DELETE: "take something away",
};

const TRAINING: Record<Verb, Round[]> = {
  GET: [
    { theme: "Weather Window", before: "❓", after: "🌦️ 62°", prompt: "Show today's weather.", verb: "GET" },
    { theme: "Treasure Scanner", before: "🧰 ❓", after: "🧰 💎", prompt: "Look inside the treasure box.", verb: "GET" },
    { theme: "Lunch Finder", before: "🍽️ ❓", after: "🍽️ 🍕", prompt: "Show today's lunch.", verb: "GET" },
    { theme: "Game Score", before: "🎮 ❓", after: "🎮 8 points", prompt: "Show the saved score.", verb: "GET" },
    { theme: "Pet Camera", before: "🏠 ❓", after: "🏠 🐶💤", prompt: "See what the puppy is doing.", verb: "GET" },
  ],
  POST: [
    { theme: "Pet Shelter", before: "🏠", after: "🏠 🐶", prompt: "Add a new puppy.", verb: "POST" },
    { theme: "Cupcake Tray", before: "🧁 🧁", after: "🧁 🧁 🧁", prompt: "Add one new cupcake.", verb: "POST" },
    { theme: "Soccer Team", before: "⚽ 🙂 🙂", after: "⚽ 🙂 🙂 🙂", prompt: "Add a new player.", verb: "POST" },
    { theme: "Book Shelf", before: "📚 📕", after: "📚 📕 📗", prompt: "Add a new book.", verb: "POST" },
    { theme: "Night Sky", before: "🌙 ⭐", after: "🌙 ⭐ ⭐", prompt: "Add a new star.", verb: "POST" },
  ],
  PATCH: [
    { theme: "Robot Charger", before: "🤖 🔋2", after: "🤖 🔋3", prompt: "Change the robot's battery from 2 to 3.", verb: "PATCH" },
    { theme: "Pet Care", before: "🐱 hungry", after: "🐱 full", prompt: "Change the cat from hungry to full.", verb: "PATCH" },
    { theme: "Score Booster", before: "🎮 6", after: "🎮 7", prompt: "Change the score from 6 to 7.", verb: "PATCH" },
    { theme: "Garden Grower", before: "🌱 small", after: "🌻 tall", prompt: "Change the plant as it grows.", verb: "PATCH" },
    { theme: "Music Player", before: "🎵 volume 2", after: "🎵 volume 3", prompt: "Change the volume from 2 to 3.", verb: "PATCH" },
  ],
  DELETE: [
    { theme: "Room Cleanup", before: "🛏️ 🗑️", after: "🛏️ ✨", prompt: "Take away the trash.", verb: "DELETE" },
    { theme: "Laundry Match", before: "🧦 🧦 🧦", after: "🧦 🧦", prompt: "Remove the extra sock.", verb: "DELETE" },
    { theme: "Team List", before: "🙂 Mia · 🙂 Sam", after: "🙂 Mia", prompt: "Take Sam off the team.", verb: "DELETE" },
    { theme: "Photo Album", before: "🖼️ 🖼️ 🖼️", after: "🖼️ 🖼️", prompt: "Remove an old photo.", verb: "DELETE" },
    { theme: "Block Tower", before: "🟦 🟩 🟨", after: "🟦 🟩", prompt: "Take away the yellow block.", verb: "DELETE" },
  ],
};

const MIXED: Round[] = [
  { theme: "Dragon Tracker", before: "🏰 ❓", after: "🏰 🐉", prompt: "See if a dragon is at the castle.", verb: "GET" },
  { theme: "Sticker Book", before: "📒 ⭐", after: "📒 ⭐ 🌈", prompt: "Add a new rainbow sticker.", verb: "POST" },
  { theme: "Race Game", before: "🏎️ lap 2", after: "🏎️ lap 3", prompt: "Change the lap from 2 to 3.", verb: "PATCH" },
  { theme: "Snack Tray", before: "🍎 🍌 🍪", after: "🍎 🍌", prompt: "Take away the cookie.", verb: "DELETE" },
  { theme: "Library Search", before: "📚 ❓", after: "📚 🧙 book found", prompt: "Look for a wizard book.", verb: "GET" },
  { theme: "Aquarium", before: "🫧 🐟", after: "🫧 🐟 🐠", prompt: "Add a new fish.", verb: "POST" },
  { theme: "Space Fuel", before: "🚀 fuel 4", after: "🚀 fuel 5", prompt: "Change the fuel from 4 to 5.", verb: "PATCH" },
  { theme: "Toy Box", before: "🧸 🚗 🪀", after: "🧸 🚗", prompt: "Remove the yo-yo.", verb: "DELETE" },
  { theme: "Dinosaur Camera", before: "🌋 ❓", after: "🌋 🦕", prompt: "See which dinosaur is there.", verb: "GET" },
  { theme: "Pizza Party", before: "🍕 🍕", after: "🍕 🍕 🍕", prompt: "Add one new pizza.", verb: "POST" },
  { theme: "Magic Meter", before: "🪄 power 7", after: "🪄 power 8", prompt: "Change the magic power to 8.", verb: "PATCH" },
  { theme: "Backpack", before: "🎒 📕 ✏️ 🍬", after: "🎒 📕 ✏️", prompt: "Take the candy out.", verb: "DELETE" },
  { theme: "Bus Board", before: "🚌 ❓", after: "🚌 3 minutes", prompt: "Show when the bus arrives.", verb: "GET" },
  { theme: "Birthday List", before: "🎂 Ava", after: "🎂 Ava · Leo", prompt: "Add Leo to the birthday list.", verb: "POST" },
  { theme: "Level Up", before: "🧙 level 3", after: "🧙 level 4", prompt: "Change the wizard to level 4.", verb: "PATCH" },
  { theme: "Garden Cleanup", before: "🌷 🌼 🥀", after: "🌷 🌼", prompt: "Remove the wilted flower.", verb: "DELETE" },
];

const rootElement = document.querySelector<HTMLElement>("#dash");
if (!rootElement) throw new Error("Missing dash app");
const root = rootElement;
let state = load();

function fresh(): DashState {
  return {
    phase: "name",
    name: "",
    intro: 0,
    verb: 0,
    round: 0,
    mix: 0,
    solved: false,
    stars: 0,
    streak: 0,
    wrong: "",
    message: "",
    board: [],
    mine: loadMine(),
    exchange: null,
    busy: false,
    passOpen: false,
    passWrong: false,
    passIntent: "board",
    teacher: false,
  };
}

function load(): DashState {
  const base = fresh();
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) ?? "null") as Partial<DashState> | null;
    if (!saved) return base;
    const phase = saved.phase;
    if (phase !== "name" && phase !== "intro" && phase !== "train" && phase !== "mix" && phase !== "done" && phase !== "play") return base;
    return {
      ...base,
      ...saved,
      phase,
      name: typeof saved.name === "string" ? saved.name : "",
      board: [],
      mine: loadMine(),
      exchange: saved.exchange ?? null,
      busy: false,
      passOpen: false,
      passWrong: false,
      passIntent: "board",
      teacher: false,
    };
  } catch {
    return base;
  }
}

function loadMine(): string[] {
  try {
    const mine = JSON.parse(localStorage.getItem(MINE) ?? "[]") as unknown;
    return Array.isArray(mine) ? mine.filter((key): key is string => typeof key === "string") : [];
  } catch {
    return [];
  }
}

function save(): void {
  const { board: _board, busy: _busy, passOpen: _passOpen, passWrong: _passWrong, passIntent: _passIntent, teacher: _teacher, ...saved } = state;
  localStorage.setItem(STORE, JSON.stringify(saved));
  localStorage.setItem(MINE, JSON.stringify(state.mine));
}

function draw(): void {
  root.innerHTML = view() + passwordView();
  save();
}

function view(): string {
  if (state.phase === "name") return nameView();
  if (state.phase === "intro") return introView();
  if (state.phase === "train") return gameView(currentTraining(), `${state.round + 1} of 5`, `${state.verb + 1} of 4`);
  if (state.phase === "mix") return gameView(MIXED[state.mix] ?? MIXED[0]!, `${state.mix + 1} of ${MIXED.length}`, "Verb Arcade");
  if (state.phase === "done") return doneView();
  return playView();
}

function header(title: string, progress = ""): string {
  return `<header class="top">
    <div><h1>The Window Dash</h1><p>${escape(title)}</p></div>
    <div class="score">⭐ ${state.stars}${progress ? `<span>${escape(progress)}</span>` : ""}</div>
  </header>`;
}

function nameView(): string {
  return `<main class="name-screen">
    <div class="window-art" aria-hidden="true"><span>👀</span></div>
    <h1>The Window Dash</h1>
    <p>Learn four magic words that apps use.</p>
    <form id="name-form">
      <label for="name">Your first name</label>
      <input id="name" maxlength="20" autocomplete="given-name" value="${escape(state.name)}" />
      ${state.wrong ? `<p class="feedback bad">${escape(state.wrong)}</p>` : ""}
      <button class="big" type="submit">Start the games!</button>
    </form>
  </main>${skipButton()}`;
}

function introView(): string {
  const slides = [
    { art: "💻 ➡️ 🪟 ➡️ 🖥️", title: "An API is a window", text: "An app asks through the window. Another computer answers." },
    { art: "👀 ➕ 🩹 🗑️", title: "Four action words", text: "GET looks. POST adds. PATCH changes. DELETE removes." },
    { art: "🎮", title: "Learn by playing", text: "Pick the action that makes each little world work." },
  ];
  const slide = slides[state.intro] ?? slides[0]!;
  return `${header("Quick start")}
    <main class="intro-card">
      <div class="intro-art">${slide.art}</div>
      <h2>${slide.title}</h2>
      <p>${slide.text}</p>
      <button class="big" data-act="intro-next">${state.intro === slides.length - 1 ? "Play!" : "Next"}</button>
    </main>${skipButton()}`;
}

function currentTraining(): Round {
  const verb = VERBS[state.verb] ?? "GET";
  return TRAINING[verb][state.round] ?? TRAINING.GET[0]!;
}

function gameView(round: Round, progress: string, section: string): string {
  const verb = round.verb;
  return `${header(section, progress)}
    <main class="game">
      <section class="scene ${state.solved ? "solved" : ""}">
        <p class="theme">${escape(round.theme)}</p>
        <div class="world">${state.solved ? escape(round.after) : escape(round.before)}</div>
        <h2>${escape(round.prompt)}</h2>
        ${state.wrong ? `<p class="feedback bad">${escape(state.wrong)}</p>` : ""}
        ${state.solved ? `<p class="feedback good">${ICONS[verb]} ${verb} worked! It means “${WORDS[verb]}.”</p>` : ""}
      </section>
      <section class="controller">
        <p>Which action should the app send?</p>
        <div class="verb-grid">${VERBS.map((choice) => verbButton(choice, state.solved)).join("")}</div>
        ${state.solved ? `<button class="big next" data-act="game-next">Next game ➜</button>` : ""}
      </section>
    </main>${skipButton()}`;
}

function verbButton(verb: Verb, disabled: boolean): string {
  return `<button class="verb ${verb.toLowerCase()}" data-act="answer" data-verb="${verb}" ${disabled ? "disabled" : ""}>
    <span>${ICONS[verb]}</span><b>${verb}</b><small>${escape(WORDS[verb])}</small>
  </button>`;
}

function doneView(): string {
  return `${header("You did it!")}
    <main class="finish">
      <div class="trophy">🏆</div>
      <h2>Four verbs unlocked!</h2>
      <div class="recap">
        ${VERBS.map((verb) => `<div class="${verb.toLowerCase()}"><span>${ICONS[verb]}</span><b>${verb}</b><p>${escape(WORDS[verb])}</p></div>`).join("")}
      </div>
      <p>You earned <b>${state.stars} stars</b>. Now use all four verbs on a real class board.</p>
      <button class="big" data-act="open-play">Open the message board</button>
    </main>`;
}

function playView(): string {
  const board = state.board.length
    ? state.board.map((note) => noteView(note)).join("")
    : `<p class="empty">Press GET to bring the messages through the window.</p>`;
  return `${header("Message board free play")}
    <main class="play">
      <section class="play-board">
        <div class="panel-title">
          <b>📋 Class board</b>
          <button class="t-mode ${state.teacher ? "on" : ""}" data-act="t-mode">T Mode</button>
          ${state.teacher ? `<button class="t-clear" data-act="t-clear">Clear all</button>` : ""}
          <span>What the app shows</span>
        </div>
        <div class="composer">
          <textarea id="message" maxlength="80" placeholder="Write a kind class message.">${escape(state.message)}</textarea>
          <button class="action post" data-act="play-post">➕ POST</button>
          <button class="action get" data-act="play-get">👀 GET</button>
          <button class="action delete" data-act="play-delete">🗑️ DELETE my messages</button>
        </div>
        ${state.wrong ? `<p class="feedback bad">${escape(state.wrong)}</p>` : ""}
        <div class="messages" id="messages">${board}</div>
      </section>
      <aside class="log">
        <div class="panel-title"><b>🪟 Window log</b><span>What was sent</span></div>
        ${logView()}
      </aside>
    </main>`;
}

function noteView(note: Note): string {
  const mine = state.mine.includes(note.key);
  return `<article class="message ${mine ? "mine" : ""}">
    <div><b>${note.welcome ? "Welcome" : escape(note.name)}</b>${mine ? "<em>yours</em>" : ""}${state.teacher ? `<button class="t-x" data-act="t-delete" data-key="${escape(note.key)}" aria-label="Delete this message">×</button>` : ""}</div>
    <p>${escape(note.text)}</p>
    ${note.welcome ? "" : `<button class="like" data-act="play-like" data-key="${escape(note.key)}">🩹 PATCH a like · ${note.likes}</button>`}
  </article>`;
}

function logView(): string {
  if (!state.exchange) return `<p class="empty">Try a verb. The request will appear here.</p>`;
  const exchange = state.exchange;
  return `<div class="log-body">
    <strong class="method ${exchange.method.toLowerCase()}">${escape(exchange.method)}</strong>
    <p>${escape(exchange.url)}</p>
    <h3>Sent</h3>
    <pre>${escape(exchange.body ?? "No body")}</pre>
    <h3>Answer</h3>
    <strong>${exchange.status}</strong>
    <pre>${escape(exchange.response)}</pre>
  </div>`;
}

function skipButton(): string {
  return `<button class="skip" data-act="skip">Message board</button>`;
}

function passwordView(): string {
  if (!state.passOpen) return "";
  return `<div class="veil"><form class="password" id="pass-form">
    <h2>Teacher password</h2>
    <input id="pass" type="password" autocomplete="off" />
    ${state.passWrong ? `<p class="feedback bad">That password is not right.</p>` : ""}
    <div><button type="button" data-act="skip-close">Cancel</button><button class="big" type="submit">Open</button></div>
  </form></div>`;
}

function answer(verb: Verb): void {
  if (state.solved) return;
  const round = state.phase === "mix" ? MIXED[state.mix] : currentTraining();
  if (!round) return;
  if (verb !== round.verb) {
    state.streak = 0;
    state.wrong = `${ICONS[verb]} ${verb} means “${WORDS[verb]}.” Try again!`;
    draw();
    return;
  }
  state.solved = true;
  state.wrong = "";
  state.streak += 1;
  state.stars += state.streak >= 3 ? 2 : 1;
  draw();
}

function nextGame(): void {
  state.solved = false;
  state.wrong = "";
  if (state.phase === "train") {
    if (state.round < 4) state.round += 1;
    else if (state.verb < VERBS.length - 1) {
      state.verb += 1;
      state.round = 0;
    } else {
      state.phase = "mix";
      state.mix = 0;
    }
  } else if (state.mix < MIXED.length - 1) state.mix += 1;
  else state.phase = "done";
  draw();
}

function openPlay(): void {
  state.phase = "play";
  state.board = [];
  state.exchange = null;
  state.wrong = "";
  state.passOpen = false;
  state.passWrong = false;
  draw();
}

async function run(work: () => Promise<void>): Promise<void> {
  if (state.busy) return;
  state.busy = true;
  state.wrong = "";
  draw();
  try {
    await work();
  } catch {
    state.wrong = "The window did not answer. Check the connection and try again.";
  } finally {
    state.busy = false;
    draw();
  }
}

async function playGet(): Promise<void> {
  await run(async () => {
    let got = await getAll();
    let data = asRecord(got.json) ?? {};
    if (typeof data[WELCOME_KEY] !== "string") {
      await postRecords({ [WELCOME_KEY]: WELCOME_TEXT });
      got = await getAll();
      data = asRecord(got.json) ?? {};
    }
    state.board = boardFrom(data);
    state.mine = state.mine.filter((key) => state.board.some((note) => note.key === key));
    state.exchange = simpleExchange(got.exchange, `${state.board.length} message${state.board.length === 1 ? "" : "s"} came back.`);
    requestAnimationFrame(scrollMessages);
  });
}

async function playPost(): Promise<void> {
  const field = document.querySelector<HTMLTextAreaElement>("#message");
  const text = cleanNote(field?.value ?? state.message);
  state.message = field?.value ?? "";
  if (!text) {
    state.wrong = "Write a message first.";
    draw();
    return;
  }
  await run(async () => {
    const key = noteKey(NOTE_PREFIX);
    const like = likeKey(key);
    const result = await postRecords({ [key]: { name: state.name || "Friend", text, at: Date.now() }, [like]: 0 });
    state.exchange = simpleExchange(result.exchange, "The new message was stored. Press GET to show it.");
    if (result.status < 400) {
      state.mine = state.mine.concat(key);
      state.message = "";
    }
  });
}

async function playLike(key: string): Promise<void> {
  await run(async () => {
    const result = await incrementKey(likeKey(key));
    state.exchange = simpleExchange(result.exchange, "The like changed. Press GET to show the new number.");
  });
}

async function teacherDelete(key: string): Promise<void> {
  if (!state.teacher || !key) return;
  await run(async () => {
    await deleteKey(likeKey(key));
    const last = await deleteKey(key);
    const data = asRecord(last.json);
    state.board = data ? boardFrom(data) : state.board.filter((note) => note.key !== key);
    state.mine = state.mine.filter((mineKey) => mineKey !== key);
    state.exchange = simpleExchange(last.exchange, "That message was deleted.");
  });
}

async function teacherClear(): Promise<void> {
  if (!state.teacher) return;
  await run(async () => {
    const got = await getAll();
    const data = asRecord(got.json) ?? {};
    let last = got;
    for (const key of Object.keys(data)) {
      if (!key.startsWith("dash-")) continue;
      last = await deleteKey(key);
    }
    last = await postRecords({ [WELCOME_KEY]: WELCOME_TEXT });
    state.board = [{ key: WELCOME_KEY, name: "Welcome", text: WELCOME_TEXT, likes: 0, welcome: true, at: 0 }];
    state.mine = [];
    state.exchange = simpleExchange(last.exchange, "The Dash board was cleared. The welcome message is back.");
  });
}

async function playDelete(): Promise<void> {
  const keys = state.mine.slice();
  if (!keys.length) {
    state.wrong = "You do not have any messages to delete.";
    draw();
    return;
  }
  await run(async () => {
    let last = await deleteKey(keys[0]!);
    for (const key of keys) {
      if (key !== keys[0]) last = await deleteKey(key);
      await deleteKey(likeKey(key));
    }
    state.exchange = simpleExchange(last.exchange, "Your messages were removed. Press GET to update the board.");
  });
}

function boardFrom(data: Record<string, unknown>): Note[] {
  const notes: Note[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === WELCOME_KEY && typeof value === "string") {
      notes.push({ key, name: "Welcome", text: value, likes: 0, welcome: true, at: 0 });
      continue;
    }
    if (!key.startsWith(NOTE_PREFIX) || !value || typeof value !== "object" || Array.isArray(value)) continue;
    const note = value as { name?: unknown; text?: unknown; at?: unknown };
    if (typeof note.name !== "string" || typeof note.text !== "string") continue;
    const likes = data[likeKey(key)];
    notes.push({
      key,
      name: note.name,
      text: note.text,
      likes: typeof likes === "number" ? likes : 0,
      welcome: false,
      at: typeof note.at === "number" ? note.at : 0,
    });
  }
  return notes.sort((a, b) => a.at - b.at);
}

function likeKey(key: string): string {
  return `${LIKE_PREFIX}${key === WELCOME_KEY ? "welcome" : key.slice(NOTE_PREFIX.length)}`;
}

function simpleExchange(exchange: Exchange, response: string): Exchange {
  return { ...exchange, response };
}

function scrollMessages(): void {
  const messages = document.querySelector("#messages");
  if (messages instanceof HTMLElement) messages.scrollTop = messages.scrollHeight;
}

root.addEventListener("click", (event) => {
  const target = (event.target as HTMLElement | null)?.closest<HTMLElement>("[data-act]");
  if (!target || target.hasAttribute("disabled") || state.busy) return;
  const act = target.dataset.act;
  if (act === "intro-next") {
    if (state.intro < 2) state.intro += 1;
    else state.phase = "train";
    draw();
  } else if (act === "answer") {
    const verb = target.dataset.verb;
    if (verb === "GET" || verb === "POST" || verb === "PATCH" || verb === "DELETE") answer(verb);
  } else if (act === "game-next") nextGame();
  else if (act === "open-play") openPlay();
  else if (act === "skip") {
    state.passIntent = "board";
    state.passOpen = true;
    state.passWrong = false;
    draw();
    document.querySelector<HTMLInputElement>("#pass")?.focus();
  } else if (act === "t-mode") {
    if (state.teacher) {
      state.teacher = false;
      draw();
    } else {
      state.passIntent = "teacher";
      state.passOpen = true;
      state.passWrong = false;
      draw();
      document.querySelector<HTMLInputElement>("#pass")?.focus();
    }
  } else if (act === "t-clear") void teacherClear();
  else if (act === "t-delete") void teacherDelete(target.dataset.key ?? "");
  else if (act === "skip-close") {
    state.passOpen = false;
    draw();
  } else if (act === "play-get") void playGet();
  else if (act === "play-post") void playPost();
  else if (act === "play-delete") void playDelete();
  else if (act === "play-like") void playLike(target.dataset.key ?? "");
});

root.addEventListener("input", (event) => {
  const target = event.target;
  if (target instanceof HTMLTextAreaElement && target.id === "message") state.message = target.value;
});

root.addEventListener("submit", (event) => {
  if (!(event.target instanceof HTMLFormElement)) return;
  event.preventDefault();
  if (event.target.id === "name-form") {
    const field = document.querySelector<HTMLInputElement>("#name");
    const name = cleanName(field?.value ?? "");
    if (!validName(name)) {
      state.name = name;
      state.wrong = "Type your first name.";
      draw();
      return;
    }
    state.name = name;
    state.wrong = "";
    state.phase = "intro";
    draw();
  } else if (event.target.id === "pass-form") {
    const pass = document.querySelector<HTMLInputElement>("#pass")?.value ?? "";
    if (pass !== "admin") {
      state.passWrong = true;
      draw();
      document.querySelector<HTMLInputElement>("#pass")?.focus();
    } else if (state.passIntent === "teacher") {
      state.teacher = true;
      state.passOpen = false;
      state.passWrong = false;
      draw();
    } else openPlay();
  }
});

function escape(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    if (char === '"') return "&quot;";
    return "&#39;";
  });
}

draw();

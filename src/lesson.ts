import type { Bin, Choice, SortItem } from "./rules";

export type Tone = "get" | "post" | "put" | "patch" | "delete" | "ok" | "bad";

export interface Slide {
  kind: "card";
  art: string;
  term: string;
  text: string;
  tag?: string;
  example?: string;
  tone?: Tone;
  button?: string;
}

export type Step =
  | Slide
  | { kind: "sort"; prompt: string; hint: string; bins: Bin[]; items: SortItem[]; success: string; recap?: boolean }
  | { kind: "get"; prompt: string; success: string }
  | { kind: "post"; prompt: string; success: string }
  | { kind: "patch"; prompt: string; success: string }
  | { kind: "remove"; prompt: string; success: string; empty: string }
  | { kind: "probe"; prompt: string }
  | { kind: "choose"; art: string; prompt: string; options: Choice[]; success: string };

export interface Level {
  title: string;
  steps: Step[];
}

export const VERB_ICONS: Record<string, string> = {
  GET: "👀",
  POST: "📌",
  PUT: "🔁",
  PATCH: "🩹",
  DELETE: "🗑️",
};

const VERBS: Choice[] = [
  { id: "GET", label: "GET", ok: false, wrong: "" },
  { id: "POST", label: "POST", ok: false, wrong: "" },
  { id: "DELETE", label: "DELETE", ok: false, wrong: "" },
];

function verbs(ok: "GET" | "POST" | "DELETE", wrongs: Record<string, string>): Choice[] {
  return VERBS.map((verb) => ({ ...verb, ok: verb.id === ok, wrong: wrongs[verb.id] ?? "" }));
}

function slide(art: string, term: string, text: string, extra: Partial<Slide> = {}): Slide {
  return { kind: "card", art, term, text, ...extra };
}

export const LEVELS: Level[] = [
  {
    title: "What an API is",
    steps: [
      slide("💻 ··· 🖥️", "Facts live far away", "Your Chromebook often needs information that is stored on a different computer, far away."),
      slide("🪟", "API", "A window between two computers. One computer asks. The other one answers.", {
        tag: "New word",
        example: "Application Programming Interface",
      }),
      slide("📋", "The menu", "Every API has a menu. It lists what you are allowed to ask for, and exactly how to ask."),
      slide("💻 ➡️ 🪟", "Request", "The message you pass through the window. It asks for something.", { tag: "New word" }),
      slide("🪟 ➡️ 💻", "Response", "What comes back through the window. It is the answer to your request.", { tag: "New word" }),
      slide("🚪🔒", "You stay outside", "You never walk into the other computer. You only get what the window hands you."),
      slide("🌦️", "A weather app", "Asks a weather API: what is the forecast here? The forecast comes back.", { tag: "APIs are everywhere" }),
      slide("🎮", "A game", "Sends your score to the game's API. The leaderboard comes back, so you see everyone's scores.", {
        tag: "APIs are everywhere",
      }),
      slide("🗺️", "A map app", "Asks a map API how to get somewhere. The route comes back, turn by turn.", { tag: "APIs are everywhere" }),
      slide("🏫 📋", "Today: a class board", "The computer on the other side holds a shared class board. You will send it real requests."),
      slide("📋 ↔ 🪟", "Two boxes on your screen", "The class board shows the notes the way an app would. The window shows the raw request and response behind it.", {
        example: "📋 what you see   🪟 what was sent",
        button: "Let's go",
      }),
    ],
  },
  {
    title: "Address and verb",
    steps: [
      slide("📍 + 🏃", "Two parts", "Every request has two parts: an address and a verb. Let's meet each one."),
      slide("📍", "Address", "Says WHERE. It points to one exact spot, like a locker number.", {
        tag: "New word",
        example: "store.zapier.com/api/records",
      }),
      slide("🏃", "Verb", "Says WHAT TO DO at that spot: look, add, change, or remove.", {
        tag: "New word",
        example: "GET   POST   DELETE",
      }),
      slide("📍 🏃 = ✅", "Together", "Address: locker 12. Verb: look inside. Now the window knows exactly what you want.", {
        example: "GET  locker 12",
      }),
      slide("🗄️", "Zapier Storage", "Our class board lives here. It keeps small bits of data in named lockers.", {
        example: "store.zapier.com",
      }),
      slide("🏷️", "Locker name", "Each locker has a name. The name is part of the address.", { example: "win-welcome" }),
      slide("🎫", "Secret", "Like a hall pass. The window checks it before it answers. We keep it hidden on screen.", {
        tag: "New word",
        example: "secret=••••",
        button: "Sort them",
      }),
      {
        kind: "sort",
        prompt: "Sort each slip. Is it an address, or a verb?",
        hint: "Tap a slip, then tap the bin it belongs in.",
        success: "The address finds the locker. The verb says what happens there.",
        bins: [
          { id: "address", label: "Address", icon: "📍" },
          { id: "verb", label: "Verb", icon: "🏃" },
        ],
        items: [
          { id: "host", label: "store.zapier.com", bin: "address", wrong: "That one tells the window where to go. It is an address." },
          { id: "get", label: "GET", bin: "verb", wrong: "GET tells the window what to do. It is a verb." },
          { id: "path", label: "/api/records", bin: "address", wrong: "That one is part of the address. It points at the lockers." },
          { id: "post", label: "POST", bin: "verb", wrong: "POST tells the window what to do. It is a verb." },
          { id: "locker", label: "win-welcome", bin: "address", wrong: "win-welcome is the name of one locker. That is part of the address." },
          { id: "del", label: "DELETE", bin: "verb", wrong: "DELETE tells the window what to do. It is a verb." },
        ],
      },
    ],
  },
  {
    title: "GET",
    steps: [
      slide(VERB_ICONS.GET, "GET", "Means look. It reads what is in a locker.", { tag: "Verb 1 of 5", tone: "get", example: "GET /api/records" }),
      slide("📋 👀", "Like a bulletin board", "Read it once or a hundred times. Nothing on the board changes.", { tone: "get", button: "Try a GET" }),
      {
        kind: "get",
        prompt: "Send a GET to read the class board. Then send the same GET again.",
        success: "You looked twice. The notes stayed put.",
      },
    ],
  },
  {
    title: "POST",
    steps: [
      slide(VERB_ICONS.POST, "POST", "Means add something new.", { tag: "Verb 2 of 5", tone: "post", example: "POST /api/records" }),
      slide("📦", "Body", "The stuff you send along with a request. For POST, the body is the new thing you are adding.", {
        tag: "New word",
        tone: "post",
        example: '{ "text": "Hi class!" }',
      }),
      slide("📝 ➡️ 📋", "Your turn", "You will write a note. Your note is the body. POST pins it on the class board.", {
        tone: "post",
        button: "Write a note",
      }),
      {
        kind: "post",
        prompt: "Write a short note for the class. Then pick the verb that pins it on the board.",
        success: "Your note is on a computer that is not this one. A GET from any Chromebook can read it.",
      },
    ],
  },
  {
    title: "Five verbs",
    steps: [
      slide(VERB_ICONS.PUT, "PUT", "Replaces the whole thing. The old version is gone and the new one takes its place.", {
        tag: "Verb 3 of 5",
        tone: "put",
        example: "Swap in a whole new lunch menu",
      }),
      slide(VERB_ICONS.PATCH, "PATCH", "Changes one small part and leaves the rest alone.", {
        tag: "Verb 4 of 5",
        tone: "patch",
        example: "Pizza count: 12 → 13",
      }),
      slide("🔁  or  🩹", "PUT or PATCH?", "A whole new poster is PUT. Fixing one word on the poster is PATCH."),
      slide(VERB_ICONS.DELETE, "DELETE", "Removes something.", { tag: "Verb 5 of 5", tone: "delete", example: "Take your name off a list" }),
      slide("👀 📌 🔁 🩹 🗑️", "All five", "Look, add, replace, change a little, remove. Almost every request uses one of these.", {
        button: "Sort them",
      }),
      {
        kind: "sort",
        prompt: "Which verb does each job?",
        hint: "Tap a job, then tap its verb.",
        success: "Five verbs cover almost every request you will meet.",
        bins: [
          { id: "GET", label: "GET", icon: VERB_ICONS.GET },
          { id: "POST", label: "POST", icon: VERB_ICONS.POST },
          { id: "PUT", label: "PUT", icon: VERB_ICONS.PUT },
          { id: "PATCH", label: "PATCH", icon: VERB_ICONS.PATCH },
          { id: "DELETE", label: "DELETE", icon: VERB_ICONS.DELETE },
        ],
        items: [
          { id: "menu", label: "Check today's lunch menu", bin: "GET", wrong: "Checking the menu is a look. That is GET." },
          { id: "signup", label: "Add your name to the pizza sign-up", bin: "POST", wrong: "Adding your name is new. That is POST." },
          { id: "replace", label: "Replace the whole lunch menu", bin: "PUT", wrong: "Replacing the whole menu is PUT." },
          { id: "count", label: "Change the pizza count from 12 to 13", bin: "PATCH", wrong: "Changing one number is PATCH." },
          { id: "off", label: "Take your name off the sign-up", bin: "DELETE", wrong: "Taking your name off is DELETE." },
        ],
      },
    ],
  },
  {
    title: "PATCH",
    steps: [
      slide("🙌", "Class high fives", "The board keeps one number: how many high fives the class has given.", { tone: "patch" }),
      slide("😬", "The problem", "Two people read 5 at the same time. Both add 1 and save 6. One high five gets lost.", {
        example: "5 + 1 = 6   and   5 + 1 = 6",
      }),
      slide("🩹 +1", "PATCH fixes it", "PATCH says “add 1” and lets the window do the math. Every high five counts.", {
        tone: "patch",
        button: "Add a high five",
      }),
      {
        kind: "patch",
        prompt: "Add 1 to the class high-five count. Watch the body. It asks the window to add 1.",
        success: "The window added 1. You sent a change, not a new copy of the number.",
      },
    ],
  },
  {
    title: "DELETE",
    steps: [
      slide(VERB_ICONS.DELETE, "Gone for good", "Once something is deleted, it is gone. Know exactly what you are removing.", { tone: "delete" }),
      slide("🙋", "Only yours", "Today you can remove only your own note. Everyone else's notes stay up.", {
        tone: "delete",
        button: "Find my note",
      }),
      {
        kind: "remove",
        prompt: "Take your note down. The other notes stay on the board.",
        success: "Your note is gone. The rest of the board is still there.",
        empty: "There is no note of yours on the board. You can go on.",
      },
    ],
  },
  {
    title: "When the answer is a problem",
    steps: [
      slide("📨", "Always an answer", "Even when something goes wrong, the window sends a response back."),
      slide("🔢", "Status code", "The number at the front of every response. It tells you how things went.", { tag: "New word" }),
      slide("✅", "200 · OK", "It worked. Here is what you asked for.", { tone: "ok" }),
      slide("🆕", "201 · Created", "Your new thing was added. You got this back after your POST.", { tone: "ok" }),
      slide("🔍❌", "404 · Not Found", "Nothing lives at that address. Maybe there is a typo.", { tone: "bad" }),
      slide("🤷", "400 · Bad Request", "The window could not understand the request. Something in it was broken.", {
        tone: "bad",
        button: "Try three requests",
      }),
      {
        kind: "probe",
        prompt: "Send these three. Read the status number in the window.",
      },
      {
        kind: "sort",
        prompt: "Match each status code to what it means.",
        hint: "Tap a code, then tap its meaning.",
        recap: true,
        success: "An error is still a response. The window answered.",
        bins: [
          { id: "ok", label: "The window did it", icon: "✅" },
          { id: "missing", label: "That address is not a real window", icon: "🔍" },
          { id: "bad", label: "The window could not read the request", icon: "🤷" },
        ],
        items: [
          { id: "s200", label: "200", bin: "ok", wrong: "200 means the window did it." },
          { id: "s404", label: "404", bin: "missing", wrong: "404 means that address is not there." },
          { id: "s400", label: "400", bin: "bad", wrong: "400 means the window could not read the request." },
        ],
      },
    ],
  },
  {
    title: "Why apps use APIs",
    steps: [
      slide("📱 🌍", "Same verbs everywhere", "The apps on your phone use these same verbs, millions of times a day."),
      slide("🧩", "Why APIs?", "Apps do not have to build everything. They ask other computers that already know the answer.", {
        button: "Show me",
      }),
      {
        kind: "choose",
        art: "🌤️",
        prompt: "A weather app opens and shows today's forecast. Which verb is that?",
        success: "GET. The app looks up the forecast and leaves it as it was.",
        options: verbs("GET", {
          POST: "POST adds something new. Opening the forecast is a look.",
          DELETE: "DELETE takes something down. Opening the forecast is a look.",
        }),
      },
      {
        kind: "choose",
        art: "📸",
        prompt: "You post a photo for friends to see. Which verb is that?",
        success: "POST. The photo is new, so it gets added.",
        options: verbs("POST", {
          GET: "GET only looks. A new photo needs to be added.",
          DELETE: "DELETE takes something down. A new photo needs to be added.",
        }),
      },
      {
        kind: "choose",
        art: "📭",
        prompt: "You unsubscribe from a list. Which verb is that?",
        success: "DELETE. Your name comes off the list.",
        options: verbs("DELETE", {
          GET: "GET only looks. Unsubscribing takes your name off.",
          POST: "POST adds something new. Unsubscribing takes your name off.",
        }),
      },
    ],
  },
];

export const PART_COUNT = LEVELS.length;

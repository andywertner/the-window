import type { Bin, Choice, SortItem } from "./rules";

export type Step =
  | { kind: "card"; lines: string[]; button: string }
  | { kind: "sort"; prompt: string; hint: string; bins: Bin[]; items: SortItem[]; success: string; recap?: boolean }
  | { kind: "get"; prompt: string; success: string }
  | { kind: "post"; prompt: string; success: string }
  | { kind: "patch"; prompt: string; success: string }
  | { kind: "remove"; prompt: string; success: string; empty: string }
  | { kind: "probe"; prompt: string }
  | { kind: "choose"; prompt: string; options: Choice[]; success: string };

export interface Level {
  title: string;
  steps: Step[];
}

const VERBS: Choice[] = [
  { id: "GET", label: "GET", ok: false, wrong: "" },
  { id: "POST", label: "POST", ok: false, wrong: "" },
  { id: "DELETE", label: "DELETE", ok: false, wrong: "" },
];

function verbs(ok: "GET" | "POST" | "DELETE", wrongs: Record<string, string>): Choice[] {
  return VERBS.map((verb) => ({ ...verb, ok: verb.id === ok, wrong: wrongs[verb.id] ?? "" }));
}

export const LEVELS: Level[] = [
  {
    title: "What an API is",
    steps: [
      {
        kind: "card",
        lines: ["Your Chromebook sometimes needs a fact that lives on another computer."],
        button: "Next",
      },
      {
        kind: "card",
        lines: ["An API is the window it talks through. The menu says what you may ask, and the exact way to ask."],
        button: "Next",
      },
      {
        kind: "card",
        lines: ["You pass a request through. A response comes back. You stay out of the other computer's files."],
        button: "Next",
      },
      {
        kind: "card",
        lines: ["A weather app does this. So does a game scoreboard. So does a site that shows the same page to every student."],
        button: "Next",
      },
      {
        kind: "card",
        lines: ["Today that other computer is a shared class board. You will send real requests to it."],
        button: "Let's try",
      },
    ],
  },
  {
    title: "Address and verb",
    steps: [
      {
        kind: "card",
        lines: ["Every request has an address and a verb. The address picks the locker. The verb says what to do there."],
        button: "Next",
      },
      {
        kind: "card",
        lines: ["This board lives at store.zapier.com. The service is called Zapier Storage. It keeps small pieces of data in named lockers."],
        button: "Next",
      },
      {
        kind: "card",
        lines: ["A secret works like a hall pass. The window checks it, then answers. The pass stays hidden on your screen."],
        button: "Next",
      },
      {
        kind: "sort",
        prompt: "Sort each slip. Is it an address, or a verb?",
        hint: "Tap a slip, then tap the bin it belongs in.",
        success: "The address finds the locker. The verb says what happens there.",
        bins: [
          { id: "address", label: "Address" },
          { id: "verb", label: "Verb" },
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
      {
        kind: "card",
        lines: ["GET means look. It reads what is in a locker and leaves it as it was. Like reading a bulletin board."],
        button: "Try a GET",
      },
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
      {
        kind: "card",
        lines: ["POST means add something new. The body is the thing you are adding. Your note is the body."],
        button: "Write a note",
      },
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
      {
        kind: "card",
        lines: ["PUT replaces the whole locker. PATCH changes a small part. Same locker, different kind of change."],
        button: "Sort them",
      },
      {
        kind: "sort",
        prompt: "Which verb does each job?",
        hint: "Tap a job, then tap its verb.",
        success: "Five verbs cover almost every request you will meet.",
        bins: [
          { id: "GET", label: "GET" },
          { id: "POST", label: "POST" },
          { id: "PUT", label: "PUT" },
          { id: "PATCH", label: "PATCH" },
          { id: "DELETE", label: "DELETE" },
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
      {
        kind: "card",
        lines: [
          "PATCH changes a little without rewriting the whole locker.",
          "If everyone read the number and wrote a total back, two people could save the same number. PATCH asks the window to do the adding.",
        ],
        button: "Add a high five",
      },
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
      {
        kind: "card",
        lines: ["DELETE takes something down. You should know what you are removing. Today you can remove only your own note."],
        button: "Find my note",
      },
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
      {
        kind: "card",
        lines: ["The window always answers. The number at the front of the answer is the status code. 200 means OK."],
        button: "Next",
      },
      {
        kind: "card",
        lines: ["404 means that address is not there. 400 means the window could not read the request."],
        button: "Try three requests",
      },
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
          { id: "ok", label: "The window did it" },
          { id: "missing", label: "That address is not a real window" },
          { id: "bad", label: "The window could not read the request" },
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
      {
        kind: "card",
        lines: ["You used these verbs on a class board. Other apps use the same verbs."],
        button: "Show me",
      },
      {
        kind: "choose",
        prompt: "A weather app opens and shows today's forecast. Which verb is that?",
        success: "GET. The app looks up the forecast and leaves it as it was.",
        options: verbs("GET", {
          POST: "POST adds something new. Opening the forecast is a look.",
          DELETE: "DELETE takes something down. Opening the forecast is a look.",
        }),
      },
      {
        kind: "choose",
        prompt: "You post a photo for friends to see. Which verb is that?",
        success: "POST. The photo is new, so it gets added.",
        options: verbs("POST", {
          GET: "GET only looks. A new photo needs to be added.",
          DELETE: "DELETE takes something down. A new photo needs to be added.",
        }),
      },
      {
        kind: "choose",
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

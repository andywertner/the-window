import puppeteer from "puppeteer-core";

const counts = [10, 8, 3, 4, 6, 4, 3, 8, 5];
const exchange = {
  method: "POST",
  url: "https://store.zapier.com/api/records?secret=••••",
  body: '{\n  "name": "Ada",\n  "text": "Hello class"\n}',
  status: 201,
  response: '{\n  "win-welcome": "The window is open."\n}',
};
const full = {
  1: [
    { id: "host", bin: "address" },
    { id: "get", bin: "verb" },
    { id: "path", bin: "address" },
    { id: "post", bin: "verb" },
    { id: "locker", bin: "address" },
    { id: "del", bin: "verb" },
  ],
  4: [
    { id: "menu", bin: "GET" },
    { id: "signup", bin: "POST" },
    { id: "replace", bin: "PUT" },
    { id: "count", bin: "PATCH" },
    { id: "off", bin: "DELETE" },
  ],
  7: [
    { id: "s200", bin: "ok" },
    { id: "s404", bin: "missing" },
    { id: "s400", bin: "bad" },
  ],
};

function base(extra) {
  return {
    phase: "lesson",
    name: "Ada",
    level: 0,
    beat: 0,
    placed: [],
    selected: null,
    note: "Hello from the class",
    success: null,
    chose: false,
    gets: 0,
    posted: false,
    patched: false,
    removed: false,
    seen: { empty: false, address: false, body: false },
    fives: 4,
    exchange,
    ...extra,
  };
}

const screens = [{ id: "name", saved: base({ phase: "name" }), mine: [] }];
for (let level = 0; level < counts.length; level += 1) {
  for (let beat = 0; beat < counts[level]; beat += 1) {
    screens.push({ id: `L${level}b${beat}`, saved: base({ level, beat }), mine: ["win-n-aaaabbbb"] });
    if (full[level] && beat === counts[level] - 1 && level !== 8) {
      screens.push({
        id: `L${level}b${beat}-full`,
        saved: base({ level, beat, placed: full[level], success: "Done." }),
        mine: ["win-n-aaaabbbb"],
      });
    }
  }
}
screens.push({ id: "get-done", saved: base({ level: 2, beat: 2, gets: 2, success: "You looked twice. The notes stayed put." }), mine: ["win-n-aaaabbbb"] });
screens.push({ id: "post-done", saved: base({ level: 3, beat: 3, posted: true, success: "Your note is on a computer that is not this one." }), mine: ["win-n-aaaabbbb"] });
screens.push({ id: "probe-done", saved: base({ level: 7, beat: 6, seen: { empty: true, address: true, body: true }, success: "You have all three answers." }), mine: [] });
screens.push({ id: "choose-done", saved: base({ level: 8, beat: 2, chose: true, success: "GET. The app looks up the forecast and leaves it as it was." }), mine: [] });
screens.push({ id: "done", saved: base({ phase: "done", level: 8, beat: 4 }), mine: [] });
screens.push({ id: "confirm", saved: base({ level: 4, beat: 5 }), mine: [], confirm: true });
screens.push({ id: "teacher-sort", saved: base({ level: 4, beat: 5 }), mine: [], teacher: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 650 });
await page.evaluateOnNewDocument(() => {
  const body = {
    "win-welcome": "The window is open. This note was already here.",
    "win-n-aaaabbbb": { name: "Ada", text: "The lunch line is long today." },
    "win-n-ccccdddd": { name: "Ben", text: "Save me a seat at lunch." },
    "win-fives": 4,
  };
  window.fetch = async (input, init) => {
    const url = String(input);
    const method = (init && init.method) || "GET";
    if (url.includes("no-such-window")) return new Response("Not Found", { status: 404 });
    if (method === "PATCH") return new Response("5", { status: 200, headers: { "Content-Type": "application/json" } });
    return new Response(JSON.stringify(body), { status: method === "POST" ? 201 : 200, headers: { "Content-Type": "application/json" } });
  };
});

function auditSource() {
  const problems = [];
  const vh = innerHeight;
  const vw = innerWidth;
  const lesson = document.querySelector(".lesson");
  const name = document.querySelector(".name");
  for (const el of [lesson, name]) {
    if (el && el.scrollHeight > el.clientHeight + 2) problems.push(`page ${el.scrollHeight}>${el.clientHeight}`);
  }
  for (const el of document.querySelectorAll(".pile, .bins")) {
    if (el.scrollHeight > el.clientHeight + 2) problems.push(`board ${el.className} ${el.scrollHeight}>${el.clientHeight}`);
  }
  const board = document.querySelector(".board");
  if (board && board.querySelectorAll("li").length <= 3 && board.scrollHeight > board.clientHeight + 2) {
    problems.push(`notes ${board.scrollHeight}>${board.clientHeight}`);
  }
  const blockers = [...document.querySelectorAll("#start-over, #zoom")].map((el) => el.getBoundingClientRect());
  const frame = document.querySelector(".window");
  if (frame) {
    const r = frame.getBoundingClientRect();
    if (r.top < -1 || r.left < -1 || r.bottom > vh + 1 || r.right > vw + 1) problems.push("window outside");
    for (const b of blockers) {
      if (r.left < b.right - 1 && r.right > b.left + 1 && r.top < b.bottom - 1 && r.bottom > b.top + 1) problems.push("window under controls");
    }
  }
  document.querySelectorAll(".lesson button, .name button, .name input, .veil button, .lesson textarea").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return;
    if (r.top < -1 || r.left < -1 || r.bottom > vh + 1 || r.right > vw + 1) problems.push(`off ${el.innerText.replace(/\s+/g, " ").slice(0, 28)}`);
    for (const b of blockers) {
      if (r.left < b.right - 2 && r.right > b.left + 2 && r.top < b.bottom - 2 && r.bottom > b.top + 2) {
        problems.push(`covered ${el.innerText.replace(/\s+/g, " ").slice(0, 28)}`);
      }
    }
  });
  return problems;
}

const failures = [];
try {
  for (const zoom of [1, 1.3]) {
    for (const screen of screens) {
      const query = screen.teacher ? "?teacher=1" : "";
      await page.goto(`http://127.0.0.1:5174/${query}`, { waitUntil: "domcontentloaded" });
      await page.evaluate((payload) => {
        localStorage.setItem("the-window-v2", JSON.stringify(payload.saved));
        localStorage.setItem("the-window-zoom", String(payload.zoom));
        localStorage.setItem("the-window-mine", JSON.stringify(payload.mine));
      }, { saved: screen.saved, zoom, mine: screen.mine });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.waitForSelector("#app .name, #app header");
      if (await page.$(".empty.fit")) await page.waitForSelector(".board li", { timeout: 2000 }).catch(() => {});
      if (screen.confirm) {
        await page.click("#start-over");
        await page.waitForSelector(".veil");
      }
      const problems = await page.evaluate(auditSource);
      const label = `${Math.round(zoom * 100)} ${screen.id}`;
      if (problems.length) {
        failures.push(`${label}: ${problems.join("; ")}`);
        await page.screenshot({ path: `/tmp/window-fit-${label.replace(/\s+/g, "-")}.png` });
      } else if (zoom === 1.3 && ["name", "L4b1", "L4b1-full", "probe-done", "post-done", "L0b0"].includes(screen.id)) {
        await page.screenshot({ path: `/tmp/window-fit-${screen.id}.png` });
      }
    }
  }
} finally {
  await browser.close();
}

if (failures.length) {
  console.log(failures.join("\n"));
  process.exit(1);
}
console.log(`fit ok (${screens.length * 2} screens)`);

import fs from "node:fs";
import puppeteer from "puppeteer-core";

const secret = fs.readFileSync(new URL("../src/config.ts", import.meta.url), "utf8").match(/STORE_SECRET = "([^"]+)"/)[1];
const token = `Walk note ${Date.now()}`;
const out = "/tmp/window-shots";
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--no-sandbox"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1366, height: 768 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function shot(name) {
  await page.screenshot({ path: `${out}/${name}.png` });
}

async function text() {
  return page.evaluate(() => document.body.innerText);
}

async function place(item, zone) {
  const sel = `[data-item="${item}"]`;
  if (!(await page.$(sel))) return;
  const pressed = await page.$eval(sel, (el) => el.getAttribute("aria-pressed"));
  if (pressed !== "true") await click(sel);
  await click(`[data-zone="${zone}"]`);
}

async function click(sel) {
  let last = new Error(`missing ${sel}`);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const el = await page.waitForSelector(sel, { timeout: 8000 });
      await el.evaluate((node) => node.scrollIntoView({ block: "center" }));
      await el.click();
      return;
    } catch (error) {
      last = error instanceof Error ? error : last;
      await sleep(150);
    }
  }
  throw last;
}

async function waitText(needle) {
  await page.waitForFunction((value) => document.body.innerText.includes(value), { timeout: 12000 }, needle);
}

function assertNoSecret(html, where) {
  if (html.includes(secret)) throw new Error(`secret visible in ${where}`);
}

try {
  await page.goto("http://127.0.0.1:5174/", { waitUntil: "domcontentloaded" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("#name");
  await shot("01-name");
  await page.type("#name", "Ada");
  await click("#name-form button");
  await waitText("Your Chromebook");
  await shot("02-card");

  for (let i = 0; i < 8; i += 1) await click("[data-act=next]");
  await page.waitForSelector("[data-act=item]");
  await click('[data-item="host"]');
  await click('[data-zone="verb"]');
  await waitText("It is an address.");
  await shot("03-sort-wrong");
  const address = [
    ["host", "address"],
    ["get", "verb"],
    ["path", "address"],
    ["post", "verb"],
    ["locker", "address"],
    ["del", "verb"],
  ];
  for (const [item, zone] of address) await place(item, zone);
  await waitText("The address finds the locker");
  await click("[data-act=next]");
  await click("[data-act=next]");
  await shot("04-get");
  await click("[data-act=send-get]");
  await waitText("Already here");
  await click("[data-act=send-get]");
  await waitText("You looked twice");
  await shot("05-get-done");
  const panel = await page.$eval(".pane", (el) => el.innerText);
  if (!panel.includes("secret=••••")) throw new Error("masked secret missing");
  assertNoSecret(panel, "panel");
  await click("[data-act=next]");
  await click("[data-act=next]");
  await page.type("#note", token);
  await click('[data-method="DELETE"]');
  await waitText("Pinning a new note takes POST");
  await click('[data-method="GET"]');
  await waitText("Your note is still on this computer");
  await page.$eval("#note", (el) => {
    el.value = "";
    el.dispatchEvent(new Event("input", { bubbles: true }));
  });
  await click('[data-method="POST"]');
  await waitText("400 Bad Request");
  await page.type("#note", token);
  await click('[data-method="POST"]');
  await waitText("not this one");
  await shot("06-post");
  assertNoSecret(await page.$eval("#app", (el) => el.innerHTML), "app");
  await click("[data-act=next]");
  await click("[data-act=next]");
  await click('[data-item="menu"]');
  await click('[data-zone="POST"]');
  await waitText("That is GET");
  const verbs = [
    ["menu", "GET"],
    ["signup", "POST"],
    ["replace", "PUT"],
    ["count", "PATCH"],
    ["off", "DELETE"],
  ];
  for (const [item, zone] of verbs) await place(item, zone);
  await waitText("Five verbs");
  await shot("07-verbs");
  await click("[data-act=next]");
  await click("[data-act=next]");
  await shot("08-patch");
  await click("[data-act=send-patch]");
  await waitText("The window added 1");
  await shot("09-patch-done");
  await click("[data-act=next]");
  await click("[data-act=next]");
  await waitText(token);
  await shot("10-delete");
  await click("[data-act=send-delete]");
  await waitText("Your note is gone");
  if ((await text()).includes(token)) throw new Error("note still on the board");
  await click("[data-act=next]");
  await click("[data-act=next]");
  await click("[data-act=next]");
  await click('[data-probe="empty"]');
  await waitText("Empty locker · 200");
  await click('[data-probe="address"]');
  await waitText("Bad address · 404");
  await click('[data-probe="body"]');
  await waitText("Broken body · 400");
  await shot("11-probe");
  await click("[data-act=next]");
  await click('[data-item="s404"]');
  await click('[data-zone="ok"]');
  await waitText("404 means");
  for (const [item, zone] of [
    ["s200", "ok"],
    ["s404", "missing"],
    ["s400", "bad"],
  ]) await place(item, zone);
  await waitText("An error is still a response");
  await click("[data-act=next]");
  await click("[data-act=next]");
  await click('[data-id="POST"]');
  await waitText("Opening the forecast is a look");
  await click('[data-id="GET"]');
  await waitText("GET. The app looks");
  await click("[data-act=next]");
  await click('[data-id="POST"]');
  await waitText("The photo is new");
  await click("[data-act=next]");
  await click('[data-id="DELETE"]');
  await waitText("Your name comes off");
  await click("[data-act=next]");
  await waitText("You sent real requests");
  await shot("12-done");
  assertNoSecret(await page.$eval("#app", (el) => el.innerHTML), "done");
  const box = await page.$eval("h1", (el) => {
    const r = el.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
  });
  if (box.top < 0 || box.left < 0 || box.right > 1366) throw new Error(`title offscreen ${JSON.stringify(box)}`);
  console.log("walkthrough ok");
} catch (error) {
  await shot("fail");
  console.log(await text().catch(() => ""));
  throw error;
} finally {
  await browser.close();
  const all = await fetch(`https://store.zapier.com/api/records?secret=${secret}`).then((res) => res.json());
  for (const [key, value] of Object.entries(all)) {
    const blob = JSON.stringify(value);
    if (!key.startsWith("win-n-") || !blob.includes("Walk note")) continue;
    await fetch(`https://store.zapier.com/api/records?secret=${secret}&key=${encodeURIComponent(key)}`, { method: "DELETE" });
  }
  await fetch(`https://store.zapier.com/api/records?secret=${secret}&key=${encodeURIComponent("win-fives")}`, { method: "DELETE" });
  const after = await fetch(`https://store.zapier.com/api/records?secret=${secret}`).then((res) => res.json());
  if (typeof after["win-welcome"] !== "string") throw new Error("welcome note missing after lesson");
  if (JSON.stringify(after).includes(token)) throw new Error("walk note still stored");
  if ("win-fives" in after) throw new Error("practice count still stored");
}

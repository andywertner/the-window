import assert from "node:assert/strict";
import { LEVELS, PART_COUNT } from "./lesson.ts";
import { cleanName, cleanNote, fivesFrom, gradeChoice, gradePost, maskSecret, notesFrom, placeItem, showResponse, sortDone, validName } from "./rules.ts";

assert.equal(cleanName("  Ada  "), "Ada");
assert.equal(validName("Ada"), true);
assert.equal(validName("Mary Ann"), true);
assert.equal(validName("De'Shawn"), true);
assert.equal(validName(""), false);
assert.equal(validName("A1"), false);
assert.equal(cleanNote("  hello \n there  "), "hello there");
assert.equal(cleanNote(""), "");

assert.equal(gradePost("POST", "   "), "empty");
assert.equal(gradePost("GET", "hi"), "look");
assert.equal(gradePost("DELETE", "hi"), "remove");
assert.equal(gradePost("POST", "hi"), "add");

const slips = [
  { id: "get", label: "GET", bin: "verb", wrong: "verb" },
  { id: "host", label: "store.zapier.com", bin: "address", wrong: "address" },
];
const missed = placeItem(slips, [], "host", "verb");
assert.equal(missed.wrong, "address");
assert.equal(missed.placed.length, 0);
const placed = placeItem(slips, [], "host", "address");
assert.equal(placed.wrong, null);
assert.equal(sortDone(slips, placed.placed), false);
const both = placeItem(slips, placed.placed, "get", "verb");
assert.equal(sortDone(slips, both.placed), true);

const choice = gradeChoice(
  [
    { id: "GET", label: "GET", ok: true, wrong: "" },
    { id: "POST", label: "POST", ok: false, wrong: "add" },
  ],
  "POST",
);
assert.equal(choice.ok, false);
assert.equal(choice.wrong, "add");

const secret = "11111111-1111-4111-8111-111111111111";
assert.equal(maskSecret(`https://store.zapier.com/api/records?secret=${secret}`, secret).includes(secret), false);
assert.equal(showResponse(404, null, "<html>Not Found</html>"), "Not Found");
assert.equal(showResponse(200, { ok: true }, ""), '{\n  "ok": true\n}');

const notes = notesFrom(
  {
    "win-welcome": "hello",
    "win-n-abcd1234": { name: "Ada", text: "Hi" },
    "win-fives": 3,
    "other": "nope",
  },
  "win-n-",
  "win-welcome",
);
assert.equal(notes.length, 2);
assert.equal(notes[0].welcome, true);
assert.equal(notes[1].name, "Ada");
assert.equal(fivesFrom({ "win-fives": 4 }, "win-fives"), 4);
assert.equal(fivesFrom({}, "win-fives"), 0);

assert.equal(PART_COUNT, 9);
assert.equal(LEVELS.length, 9);
for (const level of LEVELS) {
  assert.ok(level.steps.length > 0);
  for (const step of level.steps) {
    if (step.kind === "sort") {
      const bins = new Set(step.bins.map((bin) => bin.id));
      assert.ok(step.items.length > 0);
      for (const item of step.items) assert.ok(bins.has(item.bin), item.id);
    }
    if (step.kind === "choose") assert.equal(step.options.filter((option) => option.ok).length, 1);
    if (step.kind === "card") assert.ok(step.lines.every((line) => !line.includes("—")));
  }
}

console.log("rules ok");

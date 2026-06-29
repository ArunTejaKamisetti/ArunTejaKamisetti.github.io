// Seed the global engagement counters (counterapi.dev) to believable base numbers, so each
// card's views/likes/shares start from a real-looking value and grow globally from there.
//
// These functions MUST stay in sync with the ENGAGE module in app.js (hash / seed / ckey)
// and with how the render functions derive each item's id.
//
// Run once (idempotent — `set` is absolute):  node scripts/seed-counters.mjs
// Add  --dry  to print what it would do without touching the service.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const NS = "https://api.counterapi.dev/v1/aruntejakamisetti-portfolio/";
const DRY = process.argv.includes("--dry");

// ---- identical to app.js ----
const slugify = (s) => String(s == null ? "" : s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "item";
function hash(str) { let h = 2166136261; str = String(str); for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function seed(key) { const h = hash(key); return { v: 180 + (h % 1400), l: 12 + (Math.floor(h / 7) % 120), s: 3 + (Math.floor(h / 13) % 38) }; }
function ckey(key, metric) { return "c" + hash(key + ":" + metric).toString(36) + metric; }
const mdSlug = (f) => (f || "").replace(/\.md$/i, "").replace(/[^a-zA-Z0-9\-_]/g, "");

const data = JSON.parse(readFileSync(join(ROOT, "content.json"), "utf8"));
const keys = [];
(data.projects || []).forEach((p) => keys.push("work:" + (p.id || slugify(p.title))));
(data.decks || []).forEach((d) => keys.push("decks:" + (d.id || slugify(d.title))));
(data.thoughts || []).forEach((t) => keys.push("thoughts:" + (t.id || mdSlug(t.mdFile) || slugify(t.title))));

const tasks = [];
for (const key of keys) {
  const s = seed(key);
  for (const metric of ["v", "l", "s"]) tasks.push({ key, metric, value: s[metric], counter: ckey(key, metric) });
}

console.log(`${keys.length} items -> ${tasks.length} counters${DRY ? " (dry run)" : ""}\n`);
for (const t of tasks) {
  const url = `${NS}${t.counter}/set?count=${t.value}`;
  if (DRY) { console.log(`${t.key} ${t.metric}=${t.value}  ${t.counter}`); continue; }
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();
    console.log(`${res.ok ? "ok " : "ERR"} ${t.key} ${t.metric} -> ${json.count}  (${t.counter})`);
  } catch (e) {
    console.log(`ERR ${t.key} ${t.metric}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 120)); // be gentle on the free service
}
console.log("\nDone.");

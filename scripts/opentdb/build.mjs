// Merges raw.json (English, from fetch.mjs) with the Arabic translations in
// translations/*.json into src/data/opentdb.generated.json.
//
//   node scripts/opentdb/build.mjs
//
// Options are shuffled once with a seed from the question ID, so the correct
// answer's position is stable across builds (stored results depend on it).
import { readdir, readFile, writeFile } from "node:fs/promises";

const here = (p) => new URL(p, import.meta.url);
const raw = JSON.parse(await readFile(here("./raw.json"), "utf8"));

const translations = {};
for (const file of (await readdir(here("./translations/"))).filter((f) => f.endsWith(".json")).sort()) {
  Object.assign(translations, JSON.parse(await readFile(here(`./translations/${file}`), "utf8")));
}

function seeded(id) {
  let a = [...id].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), a | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const out = [];
const missing = [];
for (const q of raw) {
  const ar = translations[q.id];
  if (!ar || !ar.prompt || !ar.correct || ar.incorrect?.length !== q.incorrect.length) {
    missing.push(q.id);
    continue;
  }
  const options = [
    { en: q.correct.trim(), ar: ar.correct.trim(), correct: true },
    ...q.incorrect.map((en, i) => ({ en: en.trim(), ar: ar.incorrect[i].trim(), correct: false })),
  ];
  const rng = seeded(q.id);
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  out.push({
    id: q.id,
    category: q.category,
    difficulty: q.difficulty,
    prompt: { ar: ar.prompt.trim(), en: q.question.trim() },
    options: options.map(({ ar, en }) => ({ ar, en })),
    answer: options.findIndex((o) => o.correct),
  });
}

await writeFile(new URL("../../src/data/opentdb.generated.json", import.meta.url), JSON.stringify(out, null, 1) + "\n");
console.log(`Wrote ${out.length} questions.`);
if (missing.length) {
  console.warn(`Skipped ${missing.length} without a complete translation: ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? "…" : ""}`);
  process.exitCode = 1;
}

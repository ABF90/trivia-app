// Downloads every multiple-choice question for the configured Open Trivia DB
// categories into scripts/opentdb/raw.json (English only).
//
//   node scripts/opentdb/fetch.mjs
//
// Open Trivia DB rules: max 50 per request, 1 request per 5s per IP, and a
// request for more questions than remain returns nothing (response_code 1),
// so we use a session token and shrink `amount` when the pool runs low.
// Questions are CC BY-SA 4.0 (https://opentdb.com).
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const CATEGORIES = { sports: 21, animals: 27, history: 23 };
const API = "https://opentdb.com";
const DELAY_MS = 5500;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const decode = (s) => decodeURIComponent(s);

async function getJson(url) {
  for (let attempt = 0; attempt < 6; attempt++) {
    let res;
    try {
      res = await fetch(url, { signal: AbortSignal.timeout(20000) });
    } catch (error) {
      console.warn(`  network error (${error.cause?.code ?? error.name}), retrying…`);
      await sleep(DELAY_MS * (attempt + 1));
      continue;
    }
    if (res.status === 429) {
      await sleep(DELAY_MS * 2);
      continue;
    }
    const data = await res.json();
    if (data.response_code === 5) {
      await sleep(DELAY_MS * 2); // rate limited
      continue;
    }
    return data;
  }
  throw new Error(`Gave up on ${url}`);
}

/** Stable ID from the English question text: survives re-runs, so links and history stay valid. */
const idFor = (category, question) =>
  `otdb-${category}-${createHash("sha1").update(question).digest("hex").slice(0, 10)}`;

async function fetchCategory(key, categoryId) {
  const { token } = await getJson(`${API}/api_token.php?command=request`);
  await sleep(DELAY_MS);
  const out = new Map();
  let amount = 50;
  while (amount >= 1) {
    const data = await getJson(
      `${API}/api.php?amount=${amount}&category=${categoryId}&type=multiple&encode=url3986&token=${token}`,
    );
    await sleep(DELAY_MS);
    if (data.response_code === 0) {
      for (const q of data.results) {
        const question = decode(q.question);
        const id = idFor(key, question);
        out.set(id, {
          id,
          category: key,
          difficulty: decode(q.difficulty),
          question,
          correct: decode(q.correct_answer),
          incorrect: q.incorrect_answers.map(decode),
        });
      }
      process.stdout.write(`  ${key}: ${out.size}\r`);
    } else if (data.response_code === 1 || data.response_code === 4) {
      // 1 = not enough questions, 4 = token can't fill this amount. Ask for fewer until 1 fails too.
      amount = Math.floor(amount / 2);
    } else {
      throw new Error(`${key}: response_code ${data.response_code}`);
    }
  }
  console.log(`  ${key}: ${out.size} questions`);
  return [...out.values()];
}

// Each category is saved as soon as it's done, so a failed run resumes where it stopped.
const outFile = new URL("./raw.json", import.meta.url);
const saved = await readFile(outFile, "utf8").then(JSON.parse).catch(() => []);
const done = new Set(saved.map((q) => q.category));
const all = [...saved];
for (const [key, id] of Object.entries(CATEGORIES)) {
  if (done.has(key) && !process.argv.includes("--refresh")) {
    console.log(`Skipping ${key} (already downloaded)`);
    continue;
  }
  console.log(`Fetching ${key} (category ${id})…`);
  all.push(...(await fetchCategory(key, id)));
  await writeFile(outFile, JSON.stringify(all, null, 2) + "\n");
}
console.log(`Saved ${all.length} questions.`);

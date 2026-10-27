# Translating Open Trivia DB questions to Arabic

Input: `chunks/<name>.json`, an array of `{ id, question, correct, incorrect: [3 strings] }` in English.
Output: `translations/<name>.json`, one object keyed by `id`:

```json
{
  "otdb-sports-1a2b3c4d5e": {
    "prompt": "أي دولة أنجبت لاعبين مثل كافو وروبرتو كارلوس وبيليه؟",
    "correct": "البرازيل",
    "incorrect": ["الأرجنتين", "البرتغال", "إسبانيا"]
  }
}
```

Every `id` in the chunk must appear exactly once. `incorrect` keeps the same order as the English. Write valid UTF-8 JSON and nothing else.

## Style

- Use clear, natural Modern Standard Arabic that a Gulf (Kuwaiti) player reads easily. Keep it short, like a quiz-show question, not a literal word-for-word translation.
- Questions end with `؟`. Don't add a question mark to statement-style prompts that end in a blank or colon.
- Write all numbers with Eastern Arabic digits (٠١٢٣٤٥٦٧٨٩): years, scores (`1-7` → `١-٧`), counts and ordinals in figures.
- Proper nouns use the spelling common in Arabic sports and news media (مانشستر يونايتد, ريال مدريد, ليونيل ميسي, نابليون بونابرت). Well-known acronyms can stay in Latin letters when Arabic media use them (NBA, NFL, F1, UEFA → يويفا is also fine).
- Translate every option on its own terms, and keep the four options distinct from each other after translation.

## Accuracy

- Don't change, update or "fix" facts, even when a question looks outdated. Translate what it says, and keep any time reference ("as of 2016").
- If a question depends on English spelling, letters, wordplay or an English name's meaning, keep the English term in parentheses, e.g. `ماذا يعني الاختصار (NASCAR)؟`, so it stays answerable.
- Units stay as written (miles, feet, pounds). Translate the unit word (ميل، قدم، رطل) but don't convert the number.
- If an option is itself an English word that is the point of the question, keep it in English.

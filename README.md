# صفارة · SFARA

A trivia game (Kuwaiti sports, world sports, animals, history) built with **Expo SDK 58** (React Native 0.88, Expo Router) and TypeScript. It's fully bilingual, Arabic (right-to-left) and English (left-to-right), and runs in **Expo Go** and on the web.

Players pick up to **3 categories** and a **difficulty** (easy, medium, hard, mixed). Free play never repeats a question until that pool runs out, and then offers to start it over.

```bash
npm install
npx expo start          # scan the QR code with Expo Go (SDK 58)
npx expo start --web    # browser
npm run typecheck
npx expo-doctor
```

Add packages with `npx expo install <pkg>`, not `npm install`, so their versions match SDK 58. Expo Go only includes its bundled native modules, and everything this app uses is one of them.

## Routes (`src/app/`)

| Route | Screen(s) from the design |
|---|---|
| `/` | الرئيسية |
| `/play?categories=sports,history&difficulty=hard&intent=challenge` | السؤال · ٥٠/٥٠ · جواب غلط · النتيجة · تأكيد الخروج · كرت المشاركة |
| `/daily` | تحدي اليوم → اللعب → نتيجة تحدي اليوم + راجع أجوبتك |
| `/challenge?d=…` | تحدَّ ربعك (the friend who opens the link) |
| `/diwaniya`, `/diwaniya/play` | وضع الديوانية · اللاعبين → مرّر التلفون → الفايز |
| `/brand` | الهوية |

## Structure

```
src/
  app/                 Expo Router routes (thin: read params, render a feature screen)
  components/ui/       React Native building blocks (Text, Button, AnswerOption, TimerRing,
                       BottomSheet, ScoreDigits, Screen…). They hold no game logic.
  features/
    game/              The core loop, shared by every mode
      model/           gameReducer (pure state machine), titles, 50/50
      hooks/useGame    Timer, auto-advance, finish callback
      components/      GameRunner, QuestionView, FeedbackView, ResultView, ExitConfirmSheet
    player/            Persistent profile (best score, daily streak/history)
    daily/ challenge/ diwaniya/ share/ home/ play/
  data/                Question bank + access layer (questionBank.ts)
  i18n/                UI strings (ar/en), useI18n(), number/plural formatting
  theme/               Colour/type tokens and direction helpers
  config/game.ts       All tuning numbers (round size, 15s timer, warning at 5s, …)
  lib/                 Pure helpers + platform adapters (storage, haptics)
```

## Questions

| Source | Categories | Count | Languages |
|---|---|---|---|
| `src/data/questions.ts` (hand-written, bundled) | أساطير الأزرق, كأس العالم, كأس الخليج, الدوري, الأولمبياد | 20 | ar + en |
| [Open Trivia DB](https://opentdb.com), **live** + bundled copy | Sports, Animals, History | 584 bundled (160 / 69 / 355) | en + Arabic translation |

### Live + bundled (hybrid)

Free play loads Sports, Animals and History **live** from Open Trivia DB (`src/data/live/`):

- **Arabic:** each live question is matched by its English text against the bundled translations (`opentdb.generated.json`). A match shows in Arabic with its stable ID. A question we haven't translated yet shows in English with a "بالإنجليزي" badge, and its layout switches to left-to-right.
- **API limits:** one request queue keeps calls 5 seconds or more apart. A session token stops the API from repeating questions. Requests shrink when a pool is smaller than asked (otherwise the API returns nothing), and the client handles token expiry, token exhaustion and rate-limit responses.
- **Speed:** a round waits at most `LIVE_CONFIG.roundWaitMs` (4 s) for one category. Other categories refill a buffer in the background, so the next round starts instantly. The first request skips the token, so the first round isn't delayed by an extra 5-second slot.
- **Offline / slow:** any category without live questions uses the bundled ones, and after a network failure the app skips the network for 30 s. Kuwaiti categories, the daily challenge (identical for everyone) and pass-the-phone mode always use the bundle.
- **Challenge links** carry untranslated questions in full (`x` in the link payload), since the friend's app may not have them.

Tuning lives in `LIVE_CONFIG` in `src/config/game.ts`.

### Updating the bundled translations

New questions that appear on Open Trivia DB show in English until they're translated. To add them:

```bash
node scripts/opentdb/fetch.mjs --refresh   # download → scripts/opentdb/raw.json
# translate new chunks following scripts/opentdb/TRANSLATION_GUIDE.md → scripts/opentdb/translations/
node scripts/opentdb/build.mjs              # merge → src/data/opentdb.generated.json
```

Question IDs come from a hash of the English text, and the option order is fixed at build time, so daily results, challenge links and the "seen" list stay valid across rebuilds.

**Attribution:** Sports, Animals and History questions are from Open Trivia DB, licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). The Arabic translations are adaptations under the same license.

## Languages and direction

- All interface text lives in `src/i18n/strings.ts` (`ar` is the source; TypeScript forces `en` to match). Components read it with `useI18n()`, which also formats digits (٤ vs 4) and plurals.
- The language is saved in the player profile and switched from the home screen.
- Layout direction follows the language, not the phone. Each screen root sets Yoga's `direction` style (`theme/direction.ts`), so every `flexDirection: "row"` flows right-to-left in Arabic and left-to-right in English, on iOS, Android and web. Expo Go ignores `forcesRTL`, which is why the native RTL setting isn't used. Text alignment comes from `textStyleFor(lang)` inside the shared `<Text>`. Avoid `marginLeft`/`marginRight` and `left`/`right` in new UI.

### State

- **One round** uses `useReducer(gameReducer)`, a pure, testable state machine (`answering → revealed → finished`). `useGame` handles the side effects, so every mode runs the same `<GameRunner>`.
- **The player profile** (language, last category/difficulty picks, seen question IDs, best score, daily streak) is an external store read with `useSyncExternalStore`. It's backed by `expo-sqlite/kv-store` on devices and `localStorage` on web (`lib/platform/storage*.ts`).
- **A diwaniya session** lives in a context provider in `app/diwaniya/_layout.tsx`, in memory only.
- **A challenge** travels entirely in the link (`?d=` holds the question IDs, the right/wrong results and the name), so no server is needed. Links are `sfara://challenge?d=…` in builds and `exp://…/--/challenge?d=…` in Expo Go.

### Scaling notes

- Question IDs are stable keys used by daily rounds and challenge links. Never rename or reuse one.
- All question sources sit behind `data/questionBank.ts` (bundled + `data/live/`); screens never call the API directly.
- `ios/` and `android/` are generated (`npx expo prebuild` / EAS Build). Configure native behaviour in `app.json`.

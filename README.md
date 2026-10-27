# صفارة · SFARA

A Kuwaiti sports quiz built with **Expo SDK 58** (React Native 0.88, Expo Router) and TypeScript. It's an Arabic, right-to-left app that runs in **Expo Go** and on the web.

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
| `/play?category=gulf&intent=challenge` | السؤال · ٥٠/٥٠ · جواب غلط · النتيجة · تأكيد الخروج · كرت المشاركة |
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
  theme/               Colour/type tokens and RTL layout helpers
  config/game.ts       All tuning numbers (round size, 15s timer, warning at 5s, …)
  lib/                 Pure helpers + platform adapters (storage, haptics)
```

### Right-to-left

Expo Go turns on native RTL only when the phone's language is RTL, and it ignores `forcesRTL`. So components take their direction from `theme/rtl.ts` (`rtl.row`, `rtl.textStart`, …) instead of relying on native RTL. The app reads right-to-left on every phone and on web. Use the shared `<Text>` and the `rtl` helpers for new UI; avoid `marginLeft`/`marginRight`.

### State

- **One round** uses `useReducer(gameReducer)`, a pure, testable state machine (`answering → revealed → finished`). `useGame` handles the side effects, so every mode runs the same `<GameRunner>`.
- **The player profile** is an external store read with `useSyncExternalStore`. It's backed by `expo-sqlite/kv-store` on devices and `localStorage` on web (`lib/platform/storage*.ts`).
- **A diwaniya session** lives in a context provider in `app/diwaniya/_layout.tsx`, in memory only.
- **A challenge** travels entirely in the link (`?d=` holds the question IDs, the right/wrong results and the name), so no server is needed. Links are `sfara://challenge?d=…` in builds and `exp://…/--/challenge?d=…` in Expo Go.

### Scaling notes

- Question IDs are stable keys used by daily rounds and challenge links. Never rename or reuse one.
- To move questions to an API or CMS, change only `data/questionBank.ts`.
- `ios/` and `android/` are generated (`npx expo prebuild` / EAS Build). Configure native behaviour in `app.json`.

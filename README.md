# صفارة · SFARA

A Kuwaiti sports quiz, built with Next.js (App Router) and TypeScript. It's an Arabic, right-to-left, mobile-first app.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

## Routes

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
  app/                 Thin route files: read params, render a feature screen
  components/
    icons/Icon.tsx     The design's line icons, one component
    ui/                Presentational building blocks (Button, AnswerOption, TimerRing,
                       BottomSheet, ScoreDigits, Screen…). They hold no game logic.
  features/
    game/              The core loop, shared by every mode
      model/           gameReducer (pure state machine), titles, 50/50
      hooks/useGame    Timer, auto-advance, finish callback
      components/      GameRunner, QuestionView, FeedbackView, ResultView, ExitConfirmSheet
    player/            Persistent profile (best score, daily streak/history) in localStorage
    daily/ challenge/ diwaniya/ share/ home/ play/
  data/                Question bank + access layer (questionBank.ts)
  config/game.ts       All tuning numbers (round size, 15s timer, warning at 5s, …)
  lib/                 Pure helpers (Arabic digits, seeded random, dates, storage)
```

### State

- **One round** uses `useReducer(gameReducer)`, a pure, testable state machine (`answering → revealed → finished`). The `useGame` hook handles side effects (interval, timeouts, haptics), so every mode runs the same `<GameRunner>`.
- **The player profile** is an external store over `localStorage`, read with `useSyncExternalStore`. On the server it returns the defaults, so hydration never mismatches, and it stays in sync across tabs.
- **A diwaniya session** lives in a context provider in `app/diwaniya/layout.tsx`. It survives the move from setup to play and stays in memory only, as the design asks.
- **A challenge** is kept entirely in the URL (`?d=` holds the question IDs, the right/wrong results and the name), so no server is needed.

### Scaling notes

- Question IDs are stable keys used by daily rounds and challenge links. Never rename or reuse one.
- To move questions to an API or CMS, change only `data/questionBank.ts`.
- The daily round is seeded from the date, so everyone gets the same 5 questions as long as they share the same bank. Once questions are served remotely, version the bank.
- Colours, radii and fonts are CSS variables in `app/globals.css`. Components use CSS Modules.

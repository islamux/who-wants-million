# من سيربح المليون

> Arabic "Who Wants to Be a Millionaire?" trivia game — 12 subject chapters, 15 questions each, built with React 19 + TypeScript 6 + Vite 8 + PWA.

**لعبة ثقافية إسلامية تفاعلية من 12 بابًا، كل باب يحتوي على 15 سؤالًا، مبنية بأحدث تقنيات الويب.**

[![Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![License](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE)
[![PWA](https://img.shields.io/badge/PWA-ready-5A0FC8)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

---

## Features

- **12 chapters** — Islamic culture, science, history, faith, and refutations
- **15 questions per chapter** — classic Millionaire format (4 options, 1 correct)
- **Prize ladder** — 15 tiers with safe havens at levels 5, 10, 15
- **Lifelines** — 50:50 (eliminate 2 wrong answers), audience poll, walk away
- **30-second timer** — countdown with audio tick at 5 seconds
- **Sound synthesis** — Tone.js generates all audio (no sample files)
- **PWA** — installable, works offline, auto-updating service worker
- **RTL** — full Arabic right-to-left layout

## Getting Started

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc -b && vite build (typecheck + production bundle)
pnpm preview    # serve production build locally
pnpm test       # run Vitest suite
```

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 with hooks (`useReducer`, `useCallback`, `useEffect`, `useRef`) |
| Language | TypeScript 6 (strict, bundler module resolution) |
| Bundler | Vite 8 (Rolldown) |
| Styling | Tailwind CSS 4 |
| Audio | Tone.js 14 (synths, no sample files) |
| Icons | lucide-react |
| PWA | vite-plugin-pwa 1.3 (Workbox, auto-update) |
| Test | Vitest 4 |
| Package manager | pnpm |

## Architecture

- **No router** — single page, `GamePhase` enum (`idle` → `playing` → `gameover`) drives rendering
- **State** — `useReducer` in `src/hooks/useGame.ts` with a single `GameState` object and discriminated `GameAction` union
- **Audio** — `src/hooks/useSound.ts`; Tone.js synths initialized lazily on first user interaction (browser policy)
- **Questions** — hardcoded in `src/data/questions.ts`; 12 chapters × 15 questions, all Arabic RTL
- **Chapters** — user picks a chapter on `StartScreen` → game loads that chapter's 15 questions
- **50/50** — mutates the active questions array in-place (safe because questions are cloned per game)

### Data Flow

```
useGame() hook (single source of truth)
    │
    ▼
App.tsx — distributes state as props
    │
    ├──► StartScreen  (when phase === 'idle')
    ├──► GameBoard     (when phase === 'playing')
    │       ├── QuestionCard → OptionButton
    │       ├── Timer
    │       ├── Lifelines → AudiencePoll
    │       └── MoneyTree (persistent sidebar)
    └──► GameOver      (when phase === 'gameover')
```

## Key Files

| File | Purpose |
|---|---|
| `src/App.tsx` | Root component, phase-based rendering |
| `src/hooks/useGame.ts` | All game logic in a reducer |
| `src/hooks/useSound.ts` | Tone.js audio setup |
| `src/data/questions.ts` | 12 chapter question banks + money levels |
| `src/types/game.ts` | TypeScript types (GameState, GameAction, etc.) |
| `src/components/StartScreen.tsx` | Chapter selection grid |
| `src/components/GameBoard.tsx` | Main game loop (timer, confirm, lifelines) |
| `vite.config.ts` | Vite + PWA plugin configuration |

## Project Structure

```
src/
├── main.tsx                 # Bootstrap
├── App.tsx                  # Root component
├── App.css                  # Tailwind + custom animations
├── types/game.ts            # All TypeScript types
├── data/questions.ts        # 12 chapters × 15 questions + money levels
├── utils/helpers.ts         # shuffleArray, optionLabel
├── hooks/
│   ├── useGame.ts           # Game reducer + actions
│   └── useSound.ts          # Tone.js audio
└── components/
    ├── StartScreen.tsx      # Chapter selector
    ├── GameBoard.tsx        # Main game loop
    ├── QuestionCard.tsx     # Question + options
    ├── OptionButton.tsx     # Single answer button
    ├── Timer.tsx            # SVG countdown
    ├── Lifelines.tsx        # 50:50, audience, walk away
    ├── AudiencePoll.tsx     # Bar chart poll
    ├── MoneyTree.tsx        # Prize ladder
    └── GameOver.tsx         # Result screen
```

## PWA

- Installable on mobile/desktop home screen
- Full offline play (all assets pre-cached via Workbox)
- Auto-updating service worker (`registerType: 'autoUpdate'`)
- Manifest: Arabic name, RTL, gold theme, standalone display

## License

Copyright © 2026 Islamux

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <https://www.gnu.org/licenses/>.

# AGENTS.md — Who Wants to Be a Millionaire

## Context
Arabic "Who Wants to Be a Millionaire?" (من سيربح المليون) trivia game. Converted from Vue 2 CDN to React + TypeScript + Vite + PWA.

## Tech Stack
- **React 19** with hooks (useReducer for game state)
- **TypeScript 6** (strict mode, bundler module resolution)
- **Vite 8** with Rolldown bundler
- **Tone.js 14** for audio (synths, no sample files)
- **lucide-react** for icons (tree-shakeable)
- **vite-plugin-pwa 1.3** for offline PWA support
- **pnpm** as package manager

## Commands
- `pnpm dev` — start Vite dev server
- `pnpm build` — `tsc -b && vite build` (typecheck + bundle)
- `pnpm preview` — preview production build

## Architecture
- **No router** — single page, `GamePhase` enum drives what's shown: `idle` → `playing` → `gameover`
- **State**: `useReducer` in `src/hooks/useGame.ts` with a single `GameState` object and discriminated `GameAction` union
- **Audio**: `src/hooks/useSound.ts` — Tone.js synths initialized lazily on first user interaction
- **Questions**: hardcoded in `src/data/questions.ts` (15 questions, Arabic, RTL)
- **Money levels**: 15 tiers with safe havens at levels 5, 10, 15
- **50/50 lifeline**: mutates the `questions` array options directly (intentional — resets on game restart)

## Key Files
- `src/App.tsx` — root component, phase-based rendering
- `src/components/GameBoard.tsx` — main game loop with timer, confirm, lifelines
- `src/hooks/useGame.ts` — all game logic in a reducer
- `src/hooks/useSound.ts` — Tone.js audio setup
- `src/data/questions.ts` — questions + money levels
- `vite.config.ts` — Vite config with PWA plugin
- `public/million-192.png`, `public/million-512.png` — PWA icons (generated via ImageMagick from original logo)

## PWA Notes
- Auto-updating service worker via `vite-plugin-pwa` with workbox
- Manifest: Arabic name, RTL, gold theme, standalone display
- Pre-caches all build assets for full offline play

## Gotchas
- Tone.js requires user interaction to start audio context — `useSound.initialize()` is called on game start click
- 50/50 lifeline mutates `questions` array in-place (Vue 2 pattern); works because React re-renders on state change
- Timer uses `setInterval` via `useEffect` — cleanup on question change / gameover is critical
- Audio errors are silently caught (some browsers block autoplay)
- Build output is around ~560 KB (Tone.js is the bulk)

# Who Wants to Be a Millionaire — Junior Developer Guide

> Written for someone who knows JavaScript but has never used React before.
> After reading this, you should understand every file in the project and how they
> fit together.

---

## Table of Contents

1. [What Is React?](#1-what-is-react)
2. [Project Structure](#2-project-structure)
3. [Key React Concepts in This Project](#3-key-react-concepts-in-this-project)
   - [3a. Components and JSX](#3a-components-and-jsx)
   - [3b. Props](#3b-props)
   - [3c. State and useReducer](#3c-state-and-usereducer)
   - [3d. useEffect](#3d-useeffect)
   - [3e. useCallback](#3e-usecallback)
   - [3f. useRef](#3f-useref)
    - [3g. Conditional Rendering](#3g-conditional-rendering)
    - [3h. TypeScript Basics](#3h-typescript-basics)
    - [3i. Props vs Hooks — The Big Picture](#3i-props-vs-hooks-the-big-picture)
4. [Game Flow Walkthrough](#4-game-flow-walkthrough)
5. [File-by-File Breakdown](#5-file-by-file-breakdown)
6. [Audio System (Tone.js)](#6-audio-system-tonejs)
7. [PWA — What Does That Mean?](#7-pwa--what-does-that-mean)
8. [Common Mistakes to Avoid](#8-common-mistakes-to-avoid)

---

## 1. What Is React?

React is a library (not a framework) for building user interfaces. Instead of
writing HTML by hand and then finding elements with `document.getElementById`
to update them, you write **components** — small, reusable pieces of UI that
automatically re-render when their data changes.

### How it's different from plain JavaScript

In plain JS, if a user clicks a button and you need to show a new screen:

```js
// Old way: find an element, change its content
document.getElementById('root').innerHTML = '<h1>New Screen</h1>'
// If the data changes again, you have to remember to update the HTML again
```

In React, you describe *what* should be on screen based on the current data
("state"). React figures out *how* to update the HTML efficiently:

```jsx
// React way: describe the screen based on state
function App() {
  const [phase, setPhase] = React.useState('idle')
  // When phase === 'idle', show start screen
  // When phase === 'playing', show game board
  // React handles all the HTML updates
}
```

### JSX — the HTML-in-JavaScript syntax

React components return something that looks like HTML but is actually
JavaScript:

```jsx
function Greeting() {
  return <h1>Hello!</h1>  // This is JSX, not HTML
}
```

JSX gets compiled into regular JavaScript function calls. You can embed
JavaScript expressions inside `{}`:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>
}
```

---

## 2. Project Structure

```
who-wants-million/
├── index.html              # Vite entry — loads src/main.tsx
├── package.json            # Dependencies & scripts
├── vite.config.ts          # Build configuration
├── tsconfig.json           # TypeScript settings
├── public/                 # Static files
│   ├── million.jpeg        # Logo image
│   ├── million-192.png     # PWA icon (small)
│   └── million-512.png     # PWA icon (large)
└── src/                    # All source code
    ├── main.tsx            # App bootstrap: mounts <App /> into #root
    ├── App.tsx             # Root: shows StartScreen / GameBoard / GameOver
    ├── App.css             # Tailwind + custom animations
    ├── vite-env.d.ts       # Vite type declarations (ignore)
    ├── types/
    │   └── game.ts         # All TypeScript types (GameState, GameAction, etc.)
    ├── data/
    │   └── questions.ts    # 15 questions + money levels hardcoded
    ├── utils/
    │   └── helpers.ts      # shuffleArray, optionLabel
    ├── hooks/
    │   ├── useGame.ts      # ALL game logic in a reducer (central brain)
    │   └── useSound.ts     # Audio setup with Tone.js
    └── components/
        ├── StartScreen.tsx   # "Welcome — click to play"
        ├── GameBoard.tsx     # Main playing screen (timer, lifelines, confirm)
        ├── QuestionCard.tsx  # Shows question text + 4 option buttons
        ├── OptionButton.tsx  # Single answer button (A, B, C, D)
        ├── Timer.tsx         # Countdown circle SVG
        ├── Lifelines.tsx     # 50:50, audience poll, walk away buttons
        ├── AudiencePoll.tsx  # Bar chart for audience poll results
        ├── MoneyTree.tsx     # Side panel showing all prize tiers
        └── GameOver.tsx      # Win/lose/walk-away screen
```

---

## 3. Key React Concepts in This Project

### 3a. Components and JSX

Every file in `src/components/` exports a **function component**:

```tsx
// A component is just a function that returns JSX
export function Timer({ value, active }: Props) {
  if (!active) return null

  return (
    <div className="flex flex-col items-center my-4">
      <svg> ... </svg>
      <span>{value}</span>  {/* {value} = JavaScript expression */}
    </div>
  )
}
```

Rules:
- Component names must start with a capital letter (`Timer`, not `timer`).
- Return a single root element (use `<>...</>` as a shortcut — a Fragment).
- `{value}` embeds the JavaScript variable `value` into the output.

### 3b. Props

Props are the arguments passed to a component — like function parameters:

```tsx
// Declaration — the Props interface defines what this component expects
interface Props {
  value: number
  active: boolean
}

export function Timer({ value, active }: Props) {
  // value and active are available here
}

// Usage — like HTML attributes but with JavaScript values in {}
<Timer value={30} active={true} />
```

Props come from the **parent** component. A child cannot change its own props —
it can only read them. This one-way data flow makes the app predictable.

### 3c. State and useReducer

**State** is data that, when changed, causes the component to re-render.
Think of it as the component's memory.

This project uses `useReducer` (not `useState`) because the game has complex
state transitions. `useReducer` works like a **bank teller**:

- You have a current "account balance" (current state).
- You hand the teller an "instruction slip" (an **action** like `{ type: 'SELECT_ANSWER', index: 2 }`).
- The teller follows a fixed set of rules (the **reducer function**) to compute
  the new balance.
- You never reach into the till and grab money yourself.

```tsx
// The "teller" — a pure function that takes state + action, returns new state
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...createInitialState(),     // reset everything
        activeQuestions: cloneQuestions(),  // fresh copy of questions
        phase: 'playing',
        currentQuestionIndex: 0,
      }
    case 'SELECT_ANSWER':
      return { ...state, answerSelected: action.index }
    // ... more cases
  }
}

// How you give instructions (dispatch)
const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)

dispatch({ type: 'SELECT_ANSWER', index: 2 })
// 'state' is automatically updated, and the UI re-renders
```

**Why useReducer over useState?**

When you have many related pieces of state that change together (phase,
currentQuestionIndex, answerSelected, timerValue, lifelines, etc.), a single
reducer keeps the logic in one place instead of spreading 10 `useState` calls
across the component.

### 3d. useEffect

`useEffect` lets you run code **after** the component renders. Use it for:
- Timers (`setInterval`, `setTimeout`)
- Logging
- Syncing with external systems

```tsx
useEffect(() => {
  // This runs after EVERY render (unless deps say otherwise)
  console.log('Component rendered')

  // Optional cleanup function — runs before re-run or unmount
  return () => console.log('Cleanup')
}, [])  // <-- dependency array

// Empty array [] = runs once on mount, cleanup on unmount
// [value] = runs whenever 'value' changes
// No array = runs after every render (avoid unless necessary)
```

In this project, `useEffect` is used for:

```tsx
// 1. Timer countdown — sets up an interval, cleans it up
useEffect(() => {
  if (state.phase === 'gameover') return
  if (state.revealAnswers) return  // don't tick while answers are revealed
  const id = setInterval(onTick, 1000)  // call onTick every second
  return () => clearInterval(id)         // stop the interval when question changes
}, [state.currentQuestionIndex, state.phase, state.revealAnswers, onTick])

// 2. Audio init — run once when GameBoard mounts
useEffect(() => {
  if (!hasInited.current) {
    hasInited.current = true
    soundInit()
  }
}, [soundInit])
```

### 3e. useCallback

`useCallback` prevents a function from being re-created on every render.
Without it, passing a function as a prop would cause the child to re-render
every time (because every render gets a *new* function).

```tsx
// Without useCallback: a NEW function every render
const tick = () => dispatch({ type: 'TICK' })

// With useCallback: same function reference as long as deps don't change
const tick = useCallback(() => dispatch({ type: 'TICK' }), [])
//                   [deps] ^^ — empty array = never re-create
```

In this project, every function returned by `useGame()` is wrapped in
`useCallback`. This is important because these functions are passed as props
to components and used in `useEffect` dependency arrays.

### 3f. useRef

`useRef` stores a value that **does not** trigger re-render when changed.
Use it for things like:
- "Has this already happened?" flags
- References to DOM elements
- Mutable values you don't want in state

```tsx
// In GameBoard.tsx — prevents timeout from firing twice
const timeoutHandled = useRef(false)

useEffect(() => {
  timeoutHandled.current = false  // reset when question changes
}, [state.currentQuestionIndex])

// Later: check the flag
if (state.timerValue <= 0 && !timeoutHandled.current) {
  timeoutHandled.current = true
  onTimeout()
}
```

In `useSound.ts`, `useRef` holds the Tone.js synthesizer objects so they
persist across renders without re-creating them:

```tsx
const sounds = useRef<SoundCollection>({})
// sounds.current is always the same object — mutate it, no re-render
```

### 3g. Conditional Rendering

React doesn't use `if` statements in JSX. Instead, use JavaScript operators:

```tsx
// Logical AND: only render if condition is true
{state.phase === 'idle' && <StartScreen onStart={startGame} />}

// Ternary: render one thing or another
{gameWon ? <Award /> : <Meh />}

// In components: early return for "nothing to render"
if (!poll) return null
```

This project uses phase-based rendering in `App.tsx`:

```tsx
{state.phase === 'idle' && <StartScreen />}
{state.phase === 'playing' && <GameBoard />}
{state.phase === 'gameover' && <GameOver />}
```

Only ONE of these renders at a time because `phase` can only have one value.

### 3h. TypeScript Basics

TypeScript is JavaScript with types. It catches bugs before the code runs.

**Interfaces** define the shape of objects:

```tsx
export interface Option {
  text: string
  correct: boolean
  disabled?: boolean   // ? means optional
}

export interface Question {
  text: string
  options: Option[]
}
```

**Type aliases** are similar but can define unions:

```tsx
export type GamePhase = 'idle' | 'playing' | 'gameover'
// phase can ONLY be 'idle', 'playing', or 'gameover' — no typos

export type SoundName = 'correct' | 'incorrect' | 'timerTick' | 'finalAnswer'
```

**Discriminated unions** — an action type that changes shape based on `type`:

```tsx
export type GameAction =
  | { type: 'START_GAME' }              // no extra data
  | { type: 'SELECT_ANSWER'; index: number }  // has an index field
  | { type: 'CONFIRM_ANSWER' }
  | { type: 'USE_5050'; keepIndices: number[] }
```

In the reducer, TypeScript knows the exact shape inside each `case`:

```tsx
case 'SELECT_ANSWER':
  // TypeScript knows action.index exists (TypeScript autocomplete helps!)
  return { ...state, answerSelected: action.index }
```

### 3i. Props vs Hooks — The Big Picture

Both props and hooks are ways to get data into your component. But they serve
completely different purposes.

| | Props | Hooks |
|---|---|---|
| **Who owns the data?** | The **parent** component | The **current** component |
| **Can you change it?** | No — read-only | Yes — via dispatch / setState |
| **Direction** | Flows **down** (parent → child) | Stays **local** (inside the component) |
| **Purpose** | Configuration / "settings" from outside | Internal memory & side effects |
| **Example** | `<Timer value={30} active={true} />` | `const [state, dispatch] = useReducer(...)` |

#### The data-flow rule

In this app, data flows in one direction:

```
useGame() hook (owns all state)
    │
    │  props flow DOWN
    ▼
App.tsx (passes state as props)
    │
    ▼
GameBoard, MoneyTree, etc. (receive props, render UI)
    │
    │  actions flow UP via callback props
    ▼
dispatch → reducer → new state → re-render
```

**Props go down. Actions go up.** A child component never changes its props
directly — it calls a function prop (like `onSelect`) that the parent wired
to `dispatch`.

#### When to use each

**Use props when:**
- The parent knows something the child needs to display.
- The child needs a way to notify the parent (`onSelect`, `onConfirm`, etc.).
- You're building a reusable UI piece (like `OptionButton`).

**Use hooks when:**
- The data belongs to this component and its children.
- You need to remember something across renders (state).
- You need side effects like timers, audio, or API calls.

#### Real example from this project

```tsx
// App.tsx — owns the state via useGame() hook
const { state, startGame, selectAnswer } = useGame()

// App passes state DOWN as props
return (
  <GameBoard
    state={state}         // ← prop: current game data
    onSelect={selectAnswer}  // ← prop: a callback function
  />
)

// GameBoard.tsx — receives props, uses them
function GameBoard({ state, onSelect }: Props) {
  // state and onSelect come from parent — cannot change them
  // But it can read state and call onSelect to trigger changes
  return (
    <OptionButton onSelect={onSelect} />  // passes the callback down
  )
}
```

The `useGame()` hook at the top is the single source of truth. Everything
else receives slices of that state as props. This makes the app predictable:
to understand where data comes from, look at the parent.

---

## 4. Game Flow Walkthrough

Let's trace through one complete game, step by step. Watch how data flows.

### 4.1 Starting the Game

1. User opens the app. `useGame()` creates the initial state:
   ```ts
   // createInitialState() returns:
   {
     phase: 'idle',           // → shows StartScreen
     currentQuestionIndex: -1, // no question yet
     timerValue: 30,
     // ...
   }
   ```

2. User clicks "ابدأ اللعبة" (Start).
3. `StartScreen` calls `onStart` → which calls `startGame` → which dispatches:
   ```ts
   dispatch({ type: 'START_GAME' })
   ```

4. The reducer handles it:
   ```ts
   case 'START_GAME':
     return {
       ...createInitialState(),  // reset everything
       activeQuestions: cloneQuestions(),  // deep-copy the pristine questions
       phase: 'playing',         // now shows GameBoard
       currentQuestionIndex: 0,  // first question
       timerValue: 30,           // start timer at 30
     }
   ```

5. React re-renders. `App.tsx` sees `phase === 'playing'` and shows `<GameBoard>`.
6. `GameBoard` mounts. The timer `useEffect` starts a 1-second interval:
   ```ts
   setInterval(onTick, 1000)
   // onTick dispatches { type: 'TICK' }, which decrements timerValue
   ```

### 4.2 Answering a Question

1. User clicks an option (e.g., option index 2: "باريس").
2. `OptionButton.onClick` fires → `onSelect(index)` → `selectAnswer(2)` → dispatches:
   ```ts
   dispatch({ type: 'SELECT_ANSWER', index: 2 })
   ```

3. Reducer updates `answerSelected: 2`. The option button highlights in gold.
4. The "تأكيد الإجابة النهائية" (Confirm) button becomes enabled.
5. User clicks Confirm → `handleConfirm` → plays `'finalAnswer'` sound → dispatches:
   ```ts
   dispatch({ type: 'CONFIRM_ANSWER' })
   ```

6. Reducer checks if the selected option is `correct`:
   ```ts
   case 'CONFIRM_ANSWER': {
     const q = state.activeQuestions[state.currentQuestionIndex]
     const selected = q.options[state.answerSelected]
     const correctAnswer = q.options.find(o => o.correct)!.text

     if (selected.correct) {
       // Correct! Show success message, advance to next question
       return { ...state, revealAnswers: true, score: prize,
         gameMessage: { text: `إجابة صحيحة! الجائزة الحالية: ${prize}`, type: 'success' } }
     } else {
       // Wrong! Game over
       return { ...state, revealAnswers: true, phase: 'gameover', ... }
     }
   }
   ```

7. `revealAnswers: true` triggers two `useEffect`s in GameBoard:
   - After 1.5 seconds: plays correct/incorrect sound
   - If correct + not last question: after 2.5 seconds dispatches `{ type: 'NEXT_QUESTION' }`

### 4.3 Next Question

```ts
case 'NEXT_QUESTION':
  return {
    ...state,
    currentQuestionIndex: state.currentQuestionIndex + 1,
    answerSelected: null,
    revealAnswers: false,
    gameMessage: null,
    audiencePoll: null,
    timerValue: 30,  // reset timer
  }
```

Timer interval restarts, next question appears.

### 4.4 Game Over

Happens when:
- **Wrong answer** → `phase: 'gameover'`
- **Timeout** → `phase: 'gameover'`
- **Walk away** → `phase: 'gameover'`, `walkedAway: true`
- **Win (answer all 15 correctly)** → `phase: 'gameover'`, `gameWon: true`

`App.tsx` shows `<GameOver>` with the appropriate message and icon.

### 4.5 50:50 Lifeline

1. User clicks 50:50 button.
2. `useFiftyFifty` finds one random incorrect option, keeps it alongside the correct one:
   ```ts
   const correctIndex = q.options.findIndex(o => o.correct)
   const incorrectIndices = q.options.map(...).filter(x => !x.correct).map(x => x.i)
   const kept = shuffleArray(incorrectIndices).slice(0, 1)  // keep only 1 wrong answer
   dispatch({ type: 'USE_5050', keepIndices: [correctIndex, ...kept] })
   ```
3. Reducer immutably clones `activeQuestions`, setting `disabled: true` on the
   two eliminated options:
   ```ts
   const options = q.options.map((o, i) => ({
     ...o,
     disabled: o.correct ? false : !action.keepIndices.includes(i),
   }))
   ```
4. The disabled options are greyed out and unclickable.
5. **Fixed bug**: Because `activeQuestions` is a copy, restarting the game
   gives fresh options. (Previously, the module-level `questions` array was
   mutated, so 50:50 effects persisted across restarts.)

---

## 5. File-by-File Breakdown

### src/main.tsx — Entry Point

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- Finds the `<div id="root">` in `index.html`.
- Creates a React root and mounts `<App />` inside it.
- `StrictMode` is a development-only wrapper that catches bugs (double-renders
  effects on purpose).

### src/App.tsx — Root Component

```tsx
export default function App() {
  const { state, currentQuestion, safeHavenPrize, ...actions } = useGame()
  const { initialize, play } = useSound()

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1">
        {state.phase === 'idle' && <StartScreen onStart={startGame} />}
        {state.phase === 'playing' && <GameBoard ... />}
        {state.phase === 'gameover' && <GameOver ... />}
      </div>
      <MoneyTree currentQuestionIndex={state.currentQuestionIndex} ... />
    </div>
  )
}
```

- Pulls all game state and actions from `useGame()`.
- Pulls audio init/play from `useSound()`.
- Phase-based rendering: only one screen component is visible at a time.
- `MoneyTree` is always shown on the side (or as a bottom sheet on mobile).

### src/hooks/useGame.ts — The Brain

This is the most important file. It contains:
- `createInitialState()` — returns the starting state object.
- `gameReducer()` — the pure reducer with all game logic (cases for
  START_GAME, SELECT_ANSWER, CONFIRM_ANSWER, NEXT_QUESTION, USE_5050,
  USE_AUDIENCE, WALK_AWAY, TIMEOUT, TICK, RESTART).
- `useGame()` — the hook that wires the reducer, creates memoized callbacks,
  and computes derived values (`currentQuestion`, `safeHavenPrize`).

**Key patterns:**
- Every state change goes through the reducer. No exceptions.
- `useCallback` wraps every dispatch call to keep function references stable.
- `generateAudiencePoll` is a pure function (no state access) — takes a
  question index, returns random percentages.
- `getSafeHavenPrize` — looks backward from the current tier to find the
  last safe haven amount.

### src/hooks/useSound.ts — Audio System

- `useSound()` returns `{ initialize, play }`.
- `initialize` — creates Tone.js synthesizers (Synth, MembraneSynth,
  MetalSynth) on first user interaction. Browser policy requires audio to
  start from a click.
- `play(name: SoundName)` — looks up the synth by name, plays a note for
  "8n" (eighth note) duration.
- `SoundName` is a union: `'correct' | 'incorrect' | 'timerTick' | 'finalAnswer'`.
- Notes are mapped in `NOTES` record: correct → G5, incorrect → C3, etc.

### src/components/GameBoard.tsx — Main Playing Screen

This is the most complex component. It orchestrates:
- Sound initialization (runs once on mount via `useRef` flag).
- Timer countdown via `setInterval` in `useEffect`.
- Timeout detection (when timer hits 0, plays incorrect sound, dispatches TIMEOUT).
- Sound playback on reveal (correct/incorrect).
- Auto-advance to next question after correct answer.
- Confirm button (plays "final answer" sound, dispatches CONFIRM_ANSWER).

**GameBoard receives 13 props** — this is the communication hub between the
state hooks and the UI components.

### src/components/QuestionCard.tsx

- Renders the question text in a glass-effect card.
- Renders a 2×2 grid of `OptionButton` components.
- Passes each option's data, the selection state, and the reveal state.

### src/components/OptionButton.tsx

- Single answer button with conditional styling.
- States: default (glass), selected (gold gradient), disabled (faded),
  revealed-correct (green pulse), revealed-wrong (red shake).
- Uses `optionLabel(index)` helper to show A:, B:, C:, D: prefix.

### src/components/Timer.tsx

- SVG circular countdown (circle with shrinking stroke dash).
- Colors change: gold → orange → red as time drops.
- Hidden when timer is not active (`!active → return null`).

### src/components/Lifelines.tsx

- Three buttons: 50:50, Audience Poll, Walk Away.
- Buttons are disabled (with strikethrough) after use.
- Walk Away is disabled when answers are being revealed.

### src/components/AudiencePoll.tsx

- Shows a horizontal bar chart with percentages for each option.
- Animates bars on load (`animate-bar-fill` CSS class).
- Only renders when `poll` is not null.

### src/components/MoneyTree.tsx

- Vertical list of 15 prize tiers, displayed in reverse (top prize first).
- Current question tier is highlighted in gold.
- Reached tiers are dimmed (or highlighted).
- Safe haven tiers have a shield icon.
- On mobile: opens as a floating bottom sheet triggered by a button.

### src/components/StartScreen.tsx

- Logo image + "Ready?" text + start button.
- Simple CSS animations (float, fade-in, pulse-glow).

### src/components/GameOver.tsx

- Icon + message + winnings display.
- Confetti animation when the player won.
- "Play again" button calls `onRestart`.

### src/types/game.ts

All TypeScript types in one file:
- `Option`, `Question`, `MoneyLevel` — data shapes.
- `GameState` — the full state object with 12 fields.
- `GameAction` — discriminated union of 10 possible actions.
- `Lifelines` — tracks which lifelines are used.
- `GameMessage` — text + type (success/error/info).
- `GamePhase` — `'idle' | 'playing' | 'gameover'`.

### src/data/questions.ts

- 15 hardcoded Arabic questions about geography, science, history, etc.
- 15 money levels (100 to 1,000,000 ريال) with safe havens at levels 5, 10, 15.
- Questions are `Question[]`, money levels are `MoneyLevel[]`.

### src/utils/helpers.ts

- `shuffleArray<T>(arr: T[]): T[]` — Fisher-Yates shuffle, returns a new array.
- `optionLabel(index: number): string` — converts 0→'A', 1→'B', etc.

---

## 6. Audio System (Tone.js)

Tone.js is a JavaScript library for audio synthesis. Instead of playing
pre-recorded sound files (mp3/wav), it generates sounds using oscillators
and envelopes — like a tiny synthesizer.

### Why no sound files?

Because the entire app is ~560 KB. Adding audio files would multiply that.
Tone.js synths are small and the sounds are good enough for a quiz game.

### How it works

```tsx
// Create a synth (a "virtual instrument")
const synth = new Tone.Synth({
  volume: -10,
  oscillator: { type: 'sine' },   // waveform shape
  envelope: { attack: 0.01, decay: 0.2, sustain: 0.1, release: 0.3 }
}).toDestination()  // connect to speakers

// Play a note
synth.triggerAttackRelease('G5', '8n', Tone.now())
// 'G5' = note name + octave
// '8n' = eighth note duration
// Tone.now() = play immediately
```

### The four sounds

| Sound | Synth Type | Note | Waveform | When Played |
|---|---|---|---|---|
| `correct` | Synth | G5 | sine (smooth) | Answer revealed as correct |
| `incorrect` | Synth | C3 | square (buzzy) | Answer revealed as wrong, or timeout |
| `timerTick` | MembraneSynth | C6 | drum-like | Last 5 seconds of timer |
| `finalAnswer` | MetalSynth | A3 | bell-like | Player clicks confirm button |

### Audio initialization rule

Browsers block audio until the user interacts (click/tap). That's why
`initialize()` is called when the game starts (user clicks "ابدأ اللعبة"),
not when the page loads.

---

## 7. PWA — What Does That Mean?

PWA = Progressive Web App. It means:

1. **Installable** — users can add the game to their phone home screen.
2. **Offline** — works without internet after the first visit.

### How it works in this project

`vite-plugin-pwa` generates a **service worker** (a JavaScript file that runs
in the background, separate from the main page). When the user visits the
site, the service worker downloads and caches every file (HTML, CSS, JS,
images). On subsequent visits, it serves the cached files — even offline.

### The manifest

`manifest.webmanifest` is a JSON file that tells the browser how to display
the app:

```json
{
  "name": "من سيربح المليون",
  "short_name": "المليون",
  "display": "standalone",     // opens like a native app, no browser chrome
  "orientation": "portrait",   // locks to portrait mode
  "dir": "rtl",                // right-to-left (Arabic)
  "theme_color": "#ffd700"     // gold theme
}
```

### If you change anything

After changing the code, the service worker auto-updates (thanks to
`registerType: 'autoUpdate'` in `vite.config.ts`). Users always get the
latest version.

---

## 8. Common Mistakes to Avoid

### 8.1 Mutating state directly

❌ **Wrong:**
```ts
state.answerSelected = 2  // Direct mutation — React won't re-render!
```

✅ **Right:**
```ts
dispatch({ type: 'SELECT_ANSWER', index: 2 })
// Reducer always returns a new object
```

### 8.2 Forgetting useEffect deps

❌ **Wrong:**
```ts
useEffect(() => {
  if (state.timerValue <= 0) onTimeout()
}, [])  // Empty deps — onTimeout will use stale state!
```

✅ **Right:**
```ts
useEffect(() => {
  if (state.timerValue <= 0) onTimeout()
}, [state.timerValue, onTimeout])
```

Include every variable/function the effect reads in the dependency array.
React's `react-hooks/exhaustive-deps` rule catches this.

### 8.3 Creating functions inside render without useCallback

❌ **Wrong:**
```ts
const handleClick = () => dispatch({ type: 'TICK' })
// New function every render! Breaks React.memo, causes effect re-runs.
```

✅ **Right:**
```ts
const handleClick = useCallback(() => dispatch({ type: 'TICK' }), [])
```

### 8.4 Using the wrong key prop in lists

❌ **Wrong:**
```tsx
{questions.map((q, index) => <QuestionCard key={index} ... />)}
// Reordering or inserting items causes rendering bugs
// because React matches components by key, not position.
```

✅ **Right:**
```tsx
{questions.map(q => <QuestionCard key={q.text} ... />)}
// A stable identifier (like unique text) tells React which
// item is which, even when the list changes.
```

In lists that never reorder (like the 4 options in a multiple-choice
question), index-based keys are acceptable — but a stable key is
always safer.
```

### 8.5 Mutating arrays that should be immutable

❌ **Wrong:** (what the old code did)
```ts
questions[state.currentQuestionIndex] = { ...q, options: opts }
// Mutates a module-level array! Side effects across re-renders.
```

✅ **Right:** (what the code does now)
```ts
const activeQuestions = state.activeQuestions.map((q, qi) => {
  if (qi !== state.currentQuestionIndex) return q
  return { ...q, options }
})
return { ...state, activeQuestions }
```

### 8.6 Spreading too deeply

```ts
const newObj = { ...oldObj }  // Only copies one level deep!
// oldObj.nested.prop is still a reference to the original.
```

For deep objects, clone each level:
```ts
const newObj = { ...oldObj, nested: { ...oldObj.nested } }
```

This is why `cloneQuestions()` maps both the question array and each option
inside it.

---

## Final Advice

1. **Read the types first** (`src/types/game.ts`). Everything builds on them.
2. **Trace `useGame()`** — understand the state and the actions before reading
   components. The reducer is the single source of truth.
3. **Read `GameBoard.tsx` last** — it's the most complex component, and it
   only makes sense once you understand the game state.
4. **Use `pnpm dev`** while reading the code. Change something, see what
   happens. Break things on purpose to understand the error messages.
5. **TypeScript is your friend** — if you rename a field in the reducer and
   TypeScript errors pop up in components, that's the compiler telling you
   exactly what to fix. Don't fight the types.

---

*Last updated: July 2026 — verified against actual source (docs-guard pass)*

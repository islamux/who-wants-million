# Design: "من سيربح المليون" — Kotlin Android Port

**Status:** Design approved (pending implementation)
**Date:** 2026-07-02
**Source project:** `who-wants-million` (React 19 + TypeScript + Vite + PWA), Arabic RTL trivia game.

---

## 1. Goal

Create a native Android (Kotlin) version of the existing React "Who Wants to Be a Millionaire?" game in a **separate `android/` folder** (user will move it later). Use **MVVM + Jetpack Compose + best practices**. The React app already defines the full behavior, visuals, and audio; this is a direct port.

## 2. Decisions (confirmed with user)

| Decision | Choice |
|---|---|
| UI toolkit | **Jetpack Compose** (Material3) |
| Architecture | **Approach B — lean MVVM, NO Hilt** (manual DI via ServiceLocator + ViewModelProvider.Factory) |
| State | `ViewModel` + `StateFlow<GameState>` hosting a pure reducer (mirrors React `useReducer`) |
| Audio | **Native `AudioTrack` PCM synthesis** (ports Tone.js synths, no asset files) |
| Questions | **Hardcoded Kotlin object** (15 Arabic questions, mirrors React) |
| UI design | **Direct port from React** (stitch NOT used — it emits web code, not Kotlin) |
| Package name | `com.islamux.whowantsmillion` |
| SDKs | `minSdk 26`, `targetSdk 34`, `compileSdk 34` |
| Folder | `android/` (self-contained Gradle project, inside current repo, to be moved later) |

## 3. Source-project behavior reference (React)

- 15 questions × 4 options, 15 money tiers; safe havens at levels 5 (1,000), 10 (32,000), 15 (1,000,000) ريال.
- Game phases: `idle → playing → gameover` (no router — phase drives rendered screen).
- 30-second timer per question.
- Lifelines: **50:50** (keep correct + 1 random wrong, disable rest), **Audience poll** (percentages biased toward correct: correct gets 40–80%, remainder distributed), **Walk away** (leave with current prize).
- Answer flow: select → confirm (final answer) → reveal → auto-advance after 2.5s if correct; wrong/timeout → gameover at last safe haven.
- Sound effects: Tone.js synths — `correct` (G5 sine), `incorrect` (C3 square), `timerTick` (C6 fast-decay), `finalAnswer` (A3 metallic).
- Visuals: dark gradient bg `#0f0c29→#302b63→#24243e`, glassmorphism, gold `#ffd700`, Cairo font, circular SVG timer ring, money tree sidebar, confetti on win.
- Key source files to port: `src/hooks/useGame.ts` (reducer), `src/hooks/useSound.ts`, `src/data/questions.ts`, `src/types/game.ts`, `src/components/*`.

## 4. Tech stack

- Kotlin 2.0+, Jetpack Compose (Material3), Compose BOM
- AGP 8.x, Gradle Kotlin DSL, version catalog (`gradle/libs.versions.toml`)
- AndroidX: lifecycle-viewmodel-compose, activity-compose, coroutines
- No Navigation Compose (single screen, phase-based `when`)
- No Hilt — manual DI
- Testing: JUnit, kotlinx-coroutines-test (reducer/logic + ViewModel timing)

## 5. Package / module structure

```
android/
├─ settings.gradle.kts
├─ build.gradle.kts (root)
├─ gradle/libs.versions.toml
└─ app/
   ├─ build.gradle.kts
   └─ src/
      └─ main/
         ├─ AndroidManifest.xml
         ├─ res/
         │  ├─ values/strings.xml (Arabic UI text)
         │  ├─ font/cairo*.ttf
         │  └─ mipmap*/ (app icons)
         └─ java/com/islamux/whowantsmillion/
            ├─ MillionaireApp.kt                 Application
            ├─ MainActivity.kt                   setContent { Theme { GameRoot(vm) } }
            ├─ data/
            │  ├─ model/Models.kt               Question, Option, MoneyLevel, Lifelines,
            │  │                                 GameMessage, MessageType, GamePhase
            │  ├─ Questions.kt                  hardcoded object: 15 Arabic questions
            │  └─ MoneyLevels.kt                15 tiers w/ safe havens at 5/10/15
            ├─ game/
            │  ├─ GameState.kt                  immutable data class (mirrors TS GameState)
            │  ├─ GameAction.kt                 sealed class of intents (mirrors GameAction union)
            │  ├─ GameReducer.kt                pure fun reduce(state, action): GameState
            │  ├─ GameLogic.kt                  generateAudiencePoll(), 5050 keep-set,
            │  │                                safeHavenPrize(), optionLabel()
            │  └─ GameViewModel.kt              StateFlow + intent fns + coroutine timing
            ├─ audio/
            │  └─ AudioEngine.kt                pre-synth 4 PCM tones, play(GameSound)
            ├─ di/
            │  └─ ServiceLocator.kt             builds AudioEngine + ViewModel factory
            └─ ui/
               ├─ theme/ (Color.kt, Type.kt, Theme.kt)
               ├─ GameRoot.kt                   phase switch (when state.phase)
               ├─ screen/
               │  ├─ StartScreen.kt
               │  ├─ GameScreen.kt
               │  └─ GameOverScreen.kt
               └─ components/
                  ├─ QuestionCard.kt
                  ├─ OptionButton.kt
                  ├─ TimerRing.kt
                  ├─ LifelinesBar.kt
                  ├─ AudiencePollChart.kt
                  └─ MoneyTree.kt
```

## 6. Game flow & timing (centralized in ViewModel — replaces React `useEffect`s)

- `gameReducer` is a **pure function** (exact port of `gameReducer.ts`). Actions (sealed class): `StartGame, SelectAnswer(i), ConfirmAnswer, NextQuestion, Use5050(keep), UseAudience(poll), WalkAway(prize), Timeout(correctAnswer), Tick, Restart`.
- `GameViewModel` holds `MutableStateFlow<GameState>`; each intent applies `reduce()` to current state.
- **Timer**: `viewModelScope` job loops `delay(1000)` → `Tick` while `phase==PLAYING && !revealAnswers`; at `0` → `Timeout`. Plays `timerTick` sound when value ≤ 5.
- **Reveal effects**: `confirmAnswer()` → set `revealAnswers=true`; launch coroutine: after 1.5s play correct/incorrect sound; if correct and not last question, after 2.5s total → `NextQuestion`.
- **50:50**: compute keep set = {correct index} ∪ {1 random wrong index}; dispatch `Use5050(keep)`.
- **Audience poll**: `generateAudiencePoll(index)` — correct gets `40..80`%, remainder distributed with randomness; dispatch `UseAudience(poll)`.
- **Walk away**: prize = `moneyLevels[currentIndex].amount`.
- Public VM API: `state: StateFlow<GameState>`, `startGame()`, `selectAnswer(i)`, `confirmAnswer()`, `useFiftyFifty()`, `useAudience()`, `walkAway()`, `restart()`.

## 7. Audio (ports Tone.js synths)

`AudioEngine` pre-generates four 16-bit PCM mono buffers @ 44.1kHz on first use, replays via `AudioTrack` (`AudioAttributes.USAGE_GAME`, `CONTENT_TYPE_SONIFICATION`, `MODE_STREAM`):

- `CORRECT`: G5 (783.99 Hz) sine, ~0.4s, decay envelope, vol ~0.3
- `INCORRECT`: C3 (130.81 Hz) square, ~0.5s, sharp decay
- `TIMER_TICK`: C6 (1046.5 Hz) sine, ~0.1s fast decay
- `FINAL_ANSWER`: A3 (220 Hz) metallic (square), ~0.4s

Errors caught silently (mirrors React). No user-gesture gate needed (unlike Tone.js), but AudioTrack created lazily.

## 8. UI (direct port of React design)

- **Theme**: Cairo font (`res/font/`), gold `#ffd700`, dark gradient background `#0f0c29→#302b63→#24243e`, glassmorphism surfaces (semi-transparent white + blur-ish via alpha overlays).
- **Typography/Color/Theme** composables; custom animation specs.
- **TimerRing**: `Canvas` `drawArc` (ports SVG ring), color gold→orange→red by value, pulse ≤5s.
- **MoneyTree**: `LazyColumn` reversed order, current-row highlight, safe-haven shield icons, progress bar; collapses to a FAB bottom-sheet on phones (ports `md:hidden` FAB pattern).
- **OptionButton**: A/B/C/D labels, states (default/selected/disabled-by-5050/correct/wrong-selected).
- **AudiencePollChart**: animated horizontal bars (`animateFloatAsState` on fraction).
- **Animations** mapped:
  - fadeIn / slideUp → `AnimatedVisibility` (fadeIn + slideInVertically)
  - pulse-glow / pulse-correct / float → `rememberInfiniteTransition`
  - shake (wrong answer) → `keyframes`/`Animatable` on offsetX
  - bar-fill (audience) → `animateFloatAsState`
  - confetti (win) → Canvas particle animation
- **RTL + Arabic**: UI text in `res/values/strings.xml`; root `LayoutDirection.Rtl`; questions kept Arabic in `Questions.kt`. App label = "من سيربح المليون".

## 9. Testing

- Unit tests for pure `GameReducer` and `GameLogic` (audience poll distribution, 5050 keep set, safe-haven prize, win/lose transitions).
- ViewModel timing tests via `kotlinx-coroutines-test` (tick countdown, timeout, auto-advance).

## 10. Resume checklist (next steps when continuing)

1. [ ] Invoke `writing-plans` skill → produce implementation plan from this spec.
2. [ ] Scaffold `android/` Gradle project (settings, version catalog, app module, manifest).
3. [ ] Implement data models + hardcoded Questions/MoneyLevels.
4. [ ] Implement `GameReducer` + `GameLogic` (+ unit tests).
5. [ ] Implement `GameViewModel` with StateFlow + coroutine timing.
6. [ ] Implement `AudioEngine` (PCM synthesis).
6. [ ] Implement theme + `GameRoot` + screens + components.
7. [ ] Wire `MainActivity` + `ServiceLocator` + RTL/strings; add app icon + Cairo font.
8. [ ] Build & verify (`./gradlew assembleDebug`).

## 11. Open / deferred

- App icon assets: reuse `public/million-192.png` / `million-512.png` as Android launcher icons.
- Cairo font: bundle TTFs in `res/font/` (or downloadable fonts provider) — decide during implementation.
- No multi-module split (single `:app` module — YAGNI for this scope).

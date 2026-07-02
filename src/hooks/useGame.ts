import { useReducer, useCallback } from 'react'
import type { GameState, GameAction, Question } from '../types/game'
import { questions, moneyLevels } from '../data/questions'
import { shuffleArray } from '../utils/helpers'

const TIMER_DURATION = 30

function cloneQuestions(): Question[] {
  return questions.map(q => ({ ...q, options: q.options.map(o => ({ ...o })) }))
}

function getSafeHavenPrize(index: number): string {
  for (let i = index - 1; i >= 0; i--) {
    if (moneyLevels[i]?.isSafeHaven) return moneyLevels[i].amount
  }
  return '0 ريال'
}

export function generateAudiencePoll(questionIndex: number): number[] {
  const opts = questions[questionIndex].options
  const correctIndex = opts.findIndex(o => o.correct)
  const percentages = new Array(opts.length).fill(0)
  const correctPercentage = Math.floor(Math.random() * 40) + 40
  percentages[correctIndex] = correctPercentage
  let remaining = 100 - correctPercentage

  for (let i = 0; i < opts.length; i++) {
    if (i === correctIndex) continue
    const part = Math.floor(Math.random() * remaining * 0.8)
    percentages[i] = part
    remaining -= part
  }
  percentages[correctIndex] += remaining
  return percentages
}

export function createInitialState(): GameState {
  return {
    phase: 'idle',
    activeQuestions: [],
    gameWon: false,
    walkedAway: false,
    currentQuestionIndex: -1,
    score: '0 ريال',
    answerSelected: null,
    revealAnswers: false,
    gameMessage: null,
    lifelines: { fiftyFiftyUsed: false, audienceUsed: false },
    audiencePoll: null,
    timerValue: TIMER_DURATION,
  }
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...createInitialState(),
        activeQuestions: cloneQuestions(),
        phase: 'playing',
        currentQuestionIndex: 0,
        timerValue: TIMER_DURATION,
      }

    case 'SELECT_ANSWER':
      if (state.revealAnswers) return state
      return {
        ...state,
        answerSelected: action.index,
        gameMessage: null,
        audiencePoll: null,
      }

    case 'CONFIRM_ANSWER': {
      if (state.answerSelected === null || state.revealAnswers) return state
      const q = state.activeQuestions[state.currentQuestionIndex]
      const selected = q.options[state.answerSelected]
      const correctAnswer = q.options.find(o => o.correct)!.text
      const prize = moneyLevels[state.currentQuestionIndex].amount

      if (selected.correct) {
        if (state.currentQuestionIndex === state.activeQuestions.length - 1) {
          return {
            ...state,
            revealAnswers: true,
            score: prize,
            phase: 'gameover',
            gameWon: true,
            gameMessage: { text: `إجابة صحيحة! الجائزة الحالية: ${prize}`, type: 'success' },
          }
        }
        return {
          ...state,
          revealAnswers: true,
          score: prize,
          gameMessage: { text: `إجابة صحيحة! الجائزة الحالية: ${prize}`, type: 'success' },
        }
      }
      return {
        ...state,
        revealAnswers: true,
        phase: 'gameover',
        gameMessage: { text: `إجابة خاطئة! الإجابة الصحيحة كانت: ${correctAnswer}`, type: 'error' },
      }
    }

    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answerSelected: null,
        revealAnswers: false,
        gameMessage: null,
        audiencePoll: null,
        timerValue: TIMER_DURATION,
      }

    case 'USE_5050': {
      const activeQuestions = state.activeQuestions.map((q, qi) => {
        if (qi !== state.currentQuestionIndex) return q
        const options = q.options.map((o, i) => ({
          ...o,
          disabled: o.correct ? false : !action.keepIndices.includes(i),
        }))
        return { ...q, options }
      })
      return {
        ...state,
        activeQuestions,
        lifelines: { ...state.lifelines, fiftyFiftyUsed: true },
      }
    }

    case 'USE_AUDIENCE':
      return {
        ...state,
        lifelines: { ...state.lifelines, audienceUsed: true },
        audiencePoll: action.poll,
        gameMessage: { text: 'تم استطلاع رأي الجمهور. انظر النتائج أدناه.', type: 'info' },
      }

    case 'WALK_AWAY':
      return {
        ...state,
        phase: 'gameover',
        walkedAway: true,
        gameMessage: { text: `لقد اخترت الانسحاب بالجائزة الحالية: ${action.prize}`, type: 'info' },
      }

    case 'TIMEOUT':
      return {
        ...state,
        revealAnswers: true,
        phase: 'gameover',
        gameMessage: {
          text: `انتهى الوقت! الإجابة الصحيحة كانت: ${action.correctAnswer}`,
          type: 'error',
        },
      }

    case 'TICK':
      return { ...state, timerValue: state.timerValue - 1 }

    case 'RESTART':
      return createInitialState()

    default:
      return state
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), [])
  const selectAnswer = useCallback((index: number) => dispatch({ type: 'SELECT_ANSWER', index }), [])
  const confirmAnswer = useCallback(() => dispatch({ type: 'CONFIRM_ANSWER' }), [])

  const nextQuestion = useCallback(() => dispatch({ type: 'NEXT_QUESTION' }), [])

  const useFiftyFifty = useCallback(() => {
    const q = questions[state.currentQuestionIndex]
    const correctIndex = q.options.findIndex(o => o.correct)
    const incorrectIndices = q.options
      .map((o, i) => ({ i, correct: o.correct }))
      .filter(x => !x.correct)
      .map(x => x.i)
    const kept = shuffleArray(incorrectIndices).slice(0, 1)
    dispatch({ type: 'USE_5050', keepIndices: [correctIndex, ...kept] })
  }, [state.currentQuestionIndex])

  const useAudience = useCallback(() => {
    const poll = generateAudiencePoll(state.currentQuestionIndex)
    dispatch({ type: 'USE_AUDIENCE', poll })
  }, [state.currentQuestionIndex])

  const walkAway = useCallback(() => {
    const prize = moneyLevels[state.currentQuestionIndex].amount
    dispatch({ type: 'WALK_AWAY', prize })
  }, [state.currentQuestionIndex])

  const handleTimeout = useCallback(() => {
    const correctAnswer = questions[state.currentQuestionIndex].options.find(o => o.correct)!.text
    dispatch({ type: 'TIMEOUT', correctAnswer })
  }, [state.currentQuestionIndex])

  const tick = useCallback(() => dispatch({ type: 'TICK' }), [])
  const restart = useCallback(() => dispatch({ type: 'RESTART' }), [])

  const currentQuestion = state.currentQuestionIndex >= 0
    ? state.activeQuestions[state.currentQuestionIndex]
    : null

  const safeHavenPrize = state.currentQuestionIndex >= 0
    ? getSafeHavenPrize(state.currentQuestionIndex)
    : '0 ريال'

  return {
    state,
    currentQuestion,
    safeHavenPrize,
    startGame,
    selectAnswer,
    confirmAnswer,
    nextQuestion,
    useFiftyFifty,
    useAudience,
    walkAway,
    handleTimeout,
    tick,
    restart,
  }
}

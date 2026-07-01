export interface Option {
  text: string
  correct: boolean
  disabled?: boolean
}

export interface Question {
  text: string
  options: Option[]
  level: number
  isSafeHaven?: boolean
}

export interface MoneyLevel {
  amount: string
  isSafeHaven: boolean
}

export interface Lifelines {
  fiftyFiftyUsed: boolean
  audienceUsed: boolean
}

export interface GameMessage {
  text: string
  type: 'success' | 'error' | 'info'
}

export type GamePhase = 'idle' | 'playing' | 'gameover'

export interface GameState {
  phase: GamePhase
  gameWon: boolean
  walkedAway: boolean
  currentQuestionIndex: number
  score: string
  answerSelected: number | null
  revealAnswers: boolean
  gameMessage: GameMessage | null
  lifelines: Lifelines
  audiencePoll: number[] | null
  timerValue: number
  timerActive: boolean
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_ANSWER'; index: number }
  | { type: 'CONFIRM_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'USE_5050'; correctIndex: number; keepIndices: number[] }
  | { type: 'USE_AUDIENCE'; poll: number[] }
  | { type: 'WALK_AWAY'; prize: string }
  | { type: 'TIMEOUT'; correctAnswer: string }
  | { type: 'TICK' }
  | { type: 'RESTART' }
  | { type: 'CLEAR_MESSAGE' }

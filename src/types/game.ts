export interface Option {
  text: string
  correct: boolean
  disabled?: boolean
}

export interface Question {
  text: string
  options: Option[]
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
  activeQuestions: Question[]
  chapterId: number | null
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
}

export type GameAction =
  | { type: 'START_GAME'; chapterId: number }
  | { type: 'SELECT_ANSWER'; index: number }
  | { type: 'CONFIRM_ANSWER' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'USE_5050'; keepIndices: number[] }
  | { type: 'USE_AUDIENCE'; poll: number[] }
  | { type: 'WALK_AWAY'; prize: string }
  | { type: 'TIMEOUT'; correctAnswer: string }
  | { type: 'TICK' }
  | { type: 'RESTART' }

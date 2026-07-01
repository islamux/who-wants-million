import { useEffect, useRef } from 'react'
import { CheckCircle } from 'lucide-react'
import { questions } from '../data/questions'
import type { GameState, Question } from '../types/game'
import type { SoundName } from '../hooks/useSound'
import { QuestionCard } from './QuestionCard'
import { Timer } from './Timer'
import { Lifelines } from './Lifelines'
import { AudiencePoll } from './AudiencePoll'

interface Props {
  state: GameState
  currentQuestion: Question | null
  soundPlay: (name: SoundName) => void
  soundInit: () => Promise<void>
  onSelect: (index: number) => void
  onConfirm: () => void
  onNext: () => void
  on5050: () => void
  onAudience: () => void
  onWalkAway: () => void
  onTimeout: () => void
  onTick: () => void
}

export function GameBoard({
  state,
  currentQuestion,
  soundPlay,
  soundInit,
  onSelect,
  onConfirm,
  onNext,
  on5050,
  onAudience,
  onWalkAway,
  onTimeout,
  onTick,
}: Props) {
  const timeoutHandled = useRef(false)
  const hasInited = useRef(false)

  useEffect(() => {
    if (!hasInited.current) {
      hasInited.current = true
      soundInit()
    }
  }, [soundInit])

  useEffect(() => {
    timeoutHandled.current = false
  }, [state.currentQuestionIndex])

  useEffect(() => {
    if (state.phase === 'gameover') return
    if (state.revealAnswers) return

    const id = setInterval(onTick, 1000)
    return () => clearInterval(id)
  }, [state.currentQuestionIndex, state.phase, state.revealAnswers, onTick])

  useEffect(() => {
    if (state.phase !== 'playing') return
    if (state.revealAnswers) return

    if (state.timerValue <= 0 && !timeoutHandled.current) {
      timeoutHandled.current = true
      soundPlay('incorrect')
      onTimeout()
      return
    }

    if (state.timerValue <= 5 && state.timerValue > 0) {
      soundPlay('timerTick')
    }
  }, [state.timerValue, state.revealAnswers, state.phase, soundPlay, onTimeout])

  useEffect(() => {
    if (!state.revealAnswers) return

    const correct = currentQuestion?.options[state.answerSelected ?? -1]?.correct ?? false
    const timer = setTimeout(() => {
      soundPlay(correct ? 'correct' : 'incorrect')
    }, 1500)
    return () => clearTimeout(timer)
  }, [state.revealAnswers])

  useEffect(() => {
    if (!state.revealAnswers) return

    const correct = currentQuestion?.options[state.answerSelected ?? -1]?.correct ?? false
    if (correct && state.currentQuestionIndex < questions.length - 1) {
      const timer = setTimeout(onNext, 2500)
      return () => clearTimeout(timer)
    }
  }, [state.revealAnswers])

  const handleConfirm = () => {
    soundPlay('finalAnswer')
    onConfirm()
  }

  if (!currentQuestion) return null

  return (
    <div className="animate-fade-in">
      <QuestionCard
        question={currentQuestion}
        answerSelected={state.answerSelected}
        revealAnswers={state.revealAnswers}
        onSelect={onSelect}
      />

      <Timer value={state.timerValue} active={!state.revealAnswers} />

      <div className="text-center mt-5">
        <button
          onClick={handleConfirm}
          disabled={state.answerSelected === null || state.revealAnswers}
          className="bg-gradient-to-l from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-gray-900 font-bold py-3 px-8 rounded-2xl text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-yellow-400/20 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
        >
          <CheckCircle className="inline-block ms-1" size={20} />
          تأكيد الإجابة النهائية
        </button>
      </div>

      <Lifelines
        lifelines={state.lifelines}
        revealAnswers={state.revealAnswers}
        on5050={on5050}
        onAudience={onAudience}
        onWalkAway={onWalkAway}
      />

      <AudiencePoll poll={state.audiencePoll} />

      {state.gameMessage && (
        <div
          className={`
            backdrop-blur-xl rounded-xl p-4 mt-4 text-center animate-slide-up border
            ${state.gameMessage.type === 'success'
              ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
              : state.gameMessage.type === 'error'
                ? 'bg-rose-500/20 border-rose-500/30 text-rose-300'
                : 'bg-blue-500/20 border-blue-500/30 text-blue-300'
            }
          `}
        >
          {state.gameMessage.text}
        </div>
      )}
    </div>
  )
}

import type { Question } from '../types/game'
import { OptionButton } from './OptionButton'

interface Props {
  question: Question
  answerSelected: number | null
  revealAnswers: boolean
  onSelect: (index: number) => void
}

export function QuestionCard({ question, answerSelected, revealAnswers, onSelect }: Props) {
  return (
    <div className="animate-slide-up">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 text-center shadow-xl shadow-black/20">
        <p className="text-xl md:text-2xl font-semibold leading-relaxed">
          {question.text}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {question.options.map((option, index) => (
          <OptionButton
            key={index}
            option={option}
            index={index}
            isSelected={answerSelected === index}
            revealAnswers={revealAnswers}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  )
}

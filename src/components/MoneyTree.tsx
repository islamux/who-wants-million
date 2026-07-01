import { useState } from 'react'
import { ShieldCheck, Eye, ChevronUp, ChevronDown } from 'lucide-react'
import { moneyLevels } from '../data/questions'

interface Props {
  currentQuestionIndex: number
  gameStarted: boolean
  gameOver: boolean
}

export function MoneyTree({ currentQuestionIndex, gameStarted, gameOver }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const reversed = [...moneyLevels].reverse()
  const total = moneyLevels.length
  const progress = gameStarted && currentQuestionIndex >= 0
    ? Math.round(((currentQuestionIndex + 1) / total) * 100)
    : 0

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 end-4 z-50 bg-yellow-400 text-gray-900 p-3 rounded-full shadow-lg shadow-yellow-400/30 animate-pulse-glow"
        aria-label={isOpen ? 'إغلاق شجرة المال' : 'فتح شجرة المال'}
      >
        {isOpen ? <ChevronDown size={24} /> : <ChevronUp size={24} />}
      </button>

      <div className={`
        ${isOpen ? 'fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 md:hidden' : 'hidden'}
        md:block md:w-72 md:sticky md:top-4 md:self-start
      `}>
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl shadow-black/20 w-full max-w-sm mx-auto">
          <h3 className="text-lg font-bold mb-4 text-yellow-400 text-center">شجرة المال</h3>

          <div className="bg-white/10 rounded-full h-2.5 mb-4 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-l from-yellow-400 to-amber-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-center text-xs text-gray-400 mb-4">
            {progress}% مكتمل
          </div>

          <ul className="space-y-1 max-h-80 overflow-y-auto scrollbar-thin">
            {reversed.map((level, i) => {
              const levelIndex = total - 1 - i
              const isCurrent = gameStarted && !gameOver && currentQuestionIndex === levelIndex
              const isPast = gameStarted && !gameOver && currentQuestionIndex > levelIndex
              const isReached = gameOver && levelIndex <= currentQuestionIndex

              return (
                <li
                  key={i}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-300
                    ${isCurrent
                      ? 'bg-gradient-to-l from-yellow-400 to-amber-500 text-gray-900 font-bold scale-105 shadow-lg shadow-yellow-400/30'
                      : isPast || isReached
                        ? 'text-gray-500'
                        : level.isSafeHaven
                          ? 'text-gray-300 border border-dashed border-emerald-500/40'
                          : 'text-gray-400'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <span>{level.amount}</span>
                    {level.isSafeHaven && (
                      <ShieldCheck size={14} className="text-emerald-400" />
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs opacity-60">{levelIndex + 1}</span>
                    {isCurrent && <Eye size={14} />}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </>
  )
}

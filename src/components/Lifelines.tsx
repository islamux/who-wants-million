import { StarHalf, Users, LogOut } from 'lucide-react'
import type { Lifelines as LifelinesType } from '../types/game'

interface Props {
  lifelines: LifelinesType
  revealAnswers: boolean
  on5050: () => void
  onAudience: () => void
  onWalkAway: () => void
}

const btnBase = 'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border cursor-pointer font-sans '
const btnEnabled = 'backdrop-blur-xl bg-white/10 border-white/20 hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-400/10 '
const btnDisabled = 'bg-white/5 border-white/10 opacity-40 cursor-not-allowed line-through '

export function Lifelines({ lifelines, revealAnswers, on5050, onAudience, onWalkAway }: Props) {
  return (
    <div className="flex justify-center gap-3 flex-wrap my-5">
      <button
        onClick={on5050}
        disabled={lifelines.fiftyFiftyUsed || revealAnswers}
        className={btnBase + (lifelines.fiftyFiftyUsed || revealAnswers ? btnDisabled : btnEnabled)}
      >
        <StarHalf size={18} className="text-yellow-400" />
        50:50
      </button>
      <button
        onClick={onAudience}
        disabled={lifelines.audienceUsed || revealAnswers}
        className={btnBase + (lifelines.audienceUsed || revealAnswers ? btnDisabled : btnEnabled)}
      >
        <Users size={18} className="text-yellow-400" />
        سؤال الجمهور
      </button>
      <button
        onClick={onWalkAway}
        disabled={revealAnswers}
        className={btnBase + (revealAnswers ? btnDisabled : btnEnabled)}
      >
        <LogOut size={18} className="text-yellow-400" />
        انسحاب
      </button>
    </div>
  )
}

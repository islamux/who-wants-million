import type { Option } from '../types/game'
import { optionLabel } from '../utils/helpers'

interface Props {
  option: Option
  index: number
  isSelected: boolean
  revealAnswers: boolean
  onSelect: (index: number) => void
}

export function OptionButton({ option, index, isSelected, revealAnswers, onSelect }: Props) {
  let classes = 'w-full p-4 rounded-xl text-end text-white transition-all duration-300 text-base border cursor-pointer '
  classes += 'font-sans '

  if (revealAnswers) {
    if (option.correct) {
      classes += 'bg-gradient-to-l from-emerald-500 to-green-600 border-emerald-400 animate-pulse-correct scale-105 shadow-lg shadow-emerald-500/30 '
    } else if (isSelected) {
      classes += 'bg-gradient-to-l from-red-600 to-rose-700 border-red-500 animate-shake '
    } else {
      classes += 'bg-white/5 border-white/10 opacity-40 cursor-not-allowed '
    }
  } else if (option.disabled) {
    classes += 'bg-white/5 border-white/10 opacity-30 cursor-not-allowed '
  } else if (isSelected) {
    classes += 'bg-gradient-to-l from-amber-500 to-orange-500 border-yellow-400 shadow-lg shadow-yellow-400/30 scale-[1.02] '
  } else {
    classes += 'bg-white/10 border-white/20 hover:bg-white/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow-400/10 backdrop-blur-sm '
  }

  return (
    <button
      className={classes}
      onClick={() => onSelect(index)}
      disabled={revealAnswers || !!option.disabled}
    >
      <span className="font-bold ms-2 text-yellow-400">{optionLabel(index)}:</span>
      <span>{option.text}</span>
    </button>
  )
}

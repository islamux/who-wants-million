import { RefreshCw, Award, TrendingUp, Meh } from 'lucide-react'

interface Props {
  gameWon: boolean
  walkedAway: boolean
  message: string
  winnings: string
  onRestart: () => void
}

const confettiPieces = [
  { className: 'bg-yellow-400 left-1/4 animate-confetti-1' },
  { className: 'bg-emerald-400 left-1/2 animate-confetti-2' },
  { className: 'bg-rose-400 left-3/4 animate-confetti-3' },
  { className: 'bg-blue-400 left-1/3 animate-confetti-2' },
  { className: 'bg-purple-400 left-2/3 animate-confetti-1' },
]

export function GameOver({ gameWon, walkedAway, message, winnings, onRestart }: Props) {
  const titleClass = gameWon
    ? 'text-emerald-400'
    : walkedAway
      ? 'text-yellow-400'
      : 'text-rose-400'

  const icon = gameWon
    ? <Award size={48} className="text-emerald-400 mb-4" />
    : walkedAway
      ? <TrendingUp size={48} className="text-yellow-400 mb-4" />
      : <Meh size={48} className="text-rose-400 mb-4" />

  return (
    <div className="text-center animate-fade-in relative overflow-hidden">
      {gameWon && (
        <div className="absolute inset-0 pointer-events-none">
          {confettiPieces.map((p, i) => (
            <div
              key={i}
              className={`absolute top-1/2 w-3 h-3 rounded-full ${p.className}`}
            />
          ))}
        </div>
      )}

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl shadow-black/20 max-w-md mx-auto">
        {icon}
        <h2 className={`text-2xl font-bold mb-4 ${titleClass}`}>
          {message}
        </h2>
        <p className="text-xl mb-6 text-gray-300">{winnings}</p>
        <button
          onClick={onRestart}
          className="bg-gradient-to-l from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-1 cursor-pointer"
        >
          <RefreshCw className="inline-block ms-2" size={20} />
          العب مرة أخرى
        </button>
      </div>
    </div>
  )
}

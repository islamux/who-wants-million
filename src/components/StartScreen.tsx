import { Play } from 'lucide-react'

interface Props {
  onStart: () => void
}

export function StartScreen({ onStart }: Props) {
  return (
    <div className="text-center animate-fade-in">
      <img
        src="/million.jpeg"
        alt="شعار اللعبة"
        className="mx-auto mb-8 rounded-2xl border-2 border-yellow-400/50 max-w-xs shadow-2xl shadow-yellow-400/20 animate-float"
      />
      <p className="mb-8 text-xl text-gray-300 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        هل أنت مستعد لتحدي المليون؟
      </p>
      <button
        onClick={onStart}
        className="bg-gradient-to-l from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-bold py-4 px-10 rounded-2xl text-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-1 animate-pulse-glow cursor-pointer"
        style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
      >
        <Play className="inline-block ms-2" size={22} />
        ابدأ اللعبة
      </button>
    </div>
  )
}

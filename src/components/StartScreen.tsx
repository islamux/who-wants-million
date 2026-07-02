import { BookOpen } from 'lucide-react'
import { chapterList } from '../data/questions'

interface Props {
  onStart: (chapterId: number) => void
}

const chapterNames: Record<number, string> = {
  1: 'الأول',
  2: 'الثاني',
  3: 'الثالث',
  4: 'الرابع',
  5: 'الخامس',
  6: 'السادس',
  7: 'السابع',
  8: 'الثامن',
  9: 'التاسع',
  10: 'العاشر',
  11: 'الحادي عشر',
  12: 'الثاني عشر',
}

export function StartScreen({ onStart }: Props) {
  return (
    <div className="text-center animate-fade-in">
      <img
        src="/million.jpeg"
        alt="شعار اللعبة"
        className="mx-auto mb-6 rounded-2xl border-2 border-yellow-400/50 max-w-xs shadow-2xl shadow-yellow-400/20 animate-float"
      />
      <p className="mb-6 text-xl text-gray-300 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
        هل أنت مستعد لتحدي المليون؟
      </p>

      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl shadow-black/20 max-w-2xl mx-auto">
        <h3 className="text-lg font-bold mb-5 text-yellow-400 flex items-center justify-center gap-2">
          <BookOpen size={20} />
          اختر الباب الذي تريد
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chapterList.map((ch) => (
            <button
              key={ch.id}
              onClick={() => onStart(ch.id)}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 text-center transition-all duration-300 hover:bg-yellow-400/10 hover:border-yellow-400/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-400/10 cursor-pointer group"
            >
              <div className="text-yellow-400 font-bold text-sm mb-1 group-hover:text-yellow-300">
                الباب {chapterNames[ch.id]}
              </div>
              <div className="text-gray-400 text-xs leading-relaxed group-hover:text-gray-300">
                {ch.title}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

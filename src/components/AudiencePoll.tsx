interface Props {
  poll: number[] | null
}

export function AudiencePoll({ poll }: Props) {
  if (!poll) return null
  const labels = ['A', 'B', 'C', 'D']

  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 mt-4 animate-slide-up">
      <h3 className="font-bold mb-3 text-yellow-400 text-center">نتائج تصويت الجمهور:</h3>
      <div className="space-y-2">
        {poll.map((percentage, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="font-bold text-yellow-400 w-6 text-center">{labels[i]}</span>
            <div className="flex-1 bg-white/5 rounded-full h-6 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-l from-yellow-400 to-amber-500 animate-bar-fill"
                style={{ width: `${percentage}%` }}
              >
              </div>
            </div>
            <span className="text-sm text-gray-300 w-10 text-end">{percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

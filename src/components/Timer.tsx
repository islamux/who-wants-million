interface Props {
  value: number
  active: boolean
}

export function Timer({ value, active }: Props) {
  if (!active) return null
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const progress = value / 30
  const offset = circumference * (1 - progress)
  const color = value > 10 ? '#ffd700' : value > 5 ? '#ff8c00' : '#d31027'

  return (
    <div className="flex flex-col items-center my-4 animate-fade-in">
      <svg width="140" height="140" className="transform -rotate-90">
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="6"
        />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
          style={{ filter: `drop-shadow(0 0 6px ${color})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ marginTop: '-100px' }}>
        <span className={`text-3xl font-bold ${value <= 5 ? 'text-red-500 animate-pulse' : 'text-yellow-400'}`}>
          {value}
        </span>
        <span className="text-xs text-gray-400 mt-1">ثواني</span>
      </div>
    </div>
  )
}

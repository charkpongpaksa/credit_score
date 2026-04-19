import { SCORE_RANGE } from '../../constants/common'

export default function ScoreGauge({ score }) {
  const { MIN, MAX } = SCORE_RANGE
  const pct = ((score - MIN) / (MAX - MIN)) * 100
  const angle = -135 + (pct / 100) * 270
  const color = score >= 700 ? '#006329' : score >= 550 ? '#4059aa' : '#ba1a1a'

  return (
    <div style={{ position: 'relative', width: 200, height: 120, margin: '0 auto' }}>
      <svg width="200" height="120" viewBox="0 0 200 120">
        <defs>
          <linearGradient id="gauge-bg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ba1a1a" />
            <stop offset="40%" stopColor="#4059aa" />
            <stop offset="100%" stopColor="#006329" />
          </linearGradient>
        </defs>
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="16" strokeLinecap="round" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gauge-bg)" strokeWidth="16" strokeLinecap="round"
          strokeDasharray={`${251.2 * pct / 100} 251.2`} />
        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="30" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="100" r="6" fill={color} />
        </g>
        <text x="100" y="80" textAnchor="middle" fontSize="28" fontWeight="700" fill={color} fontFamily="Prompt,sans-serif">{score}</text>
        <text x="100" y="96" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Prompt,sans-serif">Credit Score</text>
        <text x="22" y="116" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Prompt,sans-serif">{MIN}</text>
        <text x="178" y="116" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Prompt,sans-serif">{MAX}</text>
      </svg>
    </div>
  )
}

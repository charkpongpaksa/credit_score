import React from 'react'

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high'
  label: string
  size?: 'sm' | 'lg'
}

export default function RiskBadge({ level, label, size = 'sm' }: RiskBadgeProps) {
  const styles = {
    low:    "bg-risk-low-bg text-risk-low-text border-risk-low-border/30",
    medium: "bg-risk-medium-bg text-risk-medium-text border-risk-medium-border/30",
    high:   "bg-risk-high-bg text-risk-high-text border-risk-high-border/30",
  }
  
  const currentStyle = styles[level] || styles.medium
  const sizeClass = size === 'lg' ? 'py-1.5 px-3.5 text-sm' : 'py-0.5 px-2.5 text-[12px]'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border whitespace-nowrap ${currentStyle} ${sizeClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {label}
    </span>
  )
}

import React from 'react'
import Card from '@/components/ui/Card'

interface KPICardProps {
  title: string
  value: string | number
  sub?: string
  icon: string
  iconBg: string
  iconColor: string
  accent?: string
  border?: boolean
}

export default function KPICard({ 
  title, value, sub, icon, iconBg, iconColor, accent, border 
}: KPICardProps) {
  return (
    <Card 
      className="flex flex-col gap-3"
      style={{ borderColor: border ? 'rgba(255,218,214,0.8)' : undefined }}
    >
      <div className="flex justify-between items-start">
        <span className="text-[13px] text-slate-500 font-medium">{title}</span>
        <div 
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: iconBg }}
        >
          <span className="material-symbols-outlined icon-fill !text-[18px]" style={{ color: iconColor }}>{icon}</span>
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span 
          className="text-4xl font-semibold transition-all duration-500" 
          style={{ color: accent || '#171c1f' }}
        >
          {value}
        </span>
        {sub && <span className="text-[13px] text-slate-500">{sub}</span>}
      </div>
    </Card>
  )
}

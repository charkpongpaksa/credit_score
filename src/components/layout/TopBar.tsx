'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'

interface Breadcrumb {
  label: string
  path?: string
}

export default function TopBar({ breadcrumbs = [] }: { breadcrumbs?: Breadcrumb[] }) {
  const { user } = useApp()
  const router = useRouter()

  return (
    <header className="h-16 bg-app-bg/85 backdrop-blur-md border-b border-[rgba(195,198,215,0.3)] flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-1.5 text-sm text-slate-500">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="material-symbols-outlined !text-[16px]">chevron_right</span>}
            <span 
              className={`transition-colors ${
                i === breadcrumbs.length - 1 
                  ? 'text-slate-900 font-semibold' 
                  : 'text-slate-500 font-normal hover:text-brand cursor-pointer'
              }`}
              onClick={() => crumb.path && router.push(crumb.path)}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-all">
          <span className="material-symbols-outlined !text-[22px]">notifications</span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white text-[12px] font-semibold">
          {user.initials}
        </div>
      </div>
    </header>
  )
}

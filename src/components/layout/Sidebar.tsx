'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useApp } from '../../context/AppContext'

const NAV_ITEMS = [
  { path: '/dashboard', icon: 'dashboard', label: 'หน้าหลัก' },
  { path: '/predict', icon: 'analytics', label: 'เครดิตโมเดล' },
  { path: '/history', icon: 'history', label: 'ประวัติการประเมิน' },
]

export default function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useApp()

  return (
    <nav className="w-[240px] min-h-screen bg-slate-900 flex flex-col py-6 flex-shrink-0 sticky top-0">
      {/* Brand */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white font-bold text-base shadow-brand">
          AS
        </div>
        <div>
          <div className="text-white font-semibold text-[15px] leading-tight">Analytical Sanctuary</div>
          <div className="text-slate-400 text-[11px]">Credit Risk System</div>
        </div>
      </div>

      {/* Nav links */}
      <div className="flex-1 px-3 flex flex-col gap-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.path || (item.path !== '/dashboard' && pathname.startsWith(item.path))
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-left w-full transition-all duration-200 border-r-4 ${
                active 
                  ? 'bg-blue-500/10 text-white font-semibold border-blue-500' 
                  : 'text-slate-400 font-normal border-transparent hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <span className={`material-symbols-outlined !text-[20px] ${active ? 'icon-fill text-blue-400' : 'text-slate-50'}`}>
                {item.icon}
              </span>
              {item.label}
            </button>
          )
        })}
      </div>

      {/* User + logout */}
      <div className="px-3 pt-4 border-t border-white/5">
        <div className="flex items-center gap-2.5 px-4 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-light flex items-center justify-center text-white text-[12px] font-semibold">
            {user.initials}
          </div>
          <div className="overflow-hidden">
            <div className="text-slate-200 text-[13px] font-medium truncate">{user.name}</div>
            <div className="text-slate-500 text-[11px]">Loan Officer</div>
          </div>
        </div>
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-sm text-slate-400 transition-all duration-200 hover:text-red-400 hover:bg-red-400/5"
        >
          <span className="material-symbols-outlined !text-[20px]">logout</span>
          ออกจากระบบ
        </button>
      </div>
    </nav>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import {
  getDashboardSummary,
  getRiskDistribution,
  getRecentAssessments,
  getKeyInsights,
} from '@/services/dashboard'
import {
  DashboardSummary,
  RiskDistribution,
  RecentAssessments,
  KeyInsights,
  KeyInsight,
} from '@/types/dashboard'

// ─── Donut Chart ────────────────────────────────────────────────────────────
function DonutChart({ distribution, total }: { distribution: RiskDistribution['distribution']; total: number }) {
  const COLORS = { LOW: '#22c55e', MEDIUM: '#6366f1', HIGH: '#ef4444' }
  const RADIUS = 80
  const STROKE = 22
  const C = RADIUS + STROKE
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS

  let cumulative = 0
  const segments = distribution.map(item => {
    const pct = item.percent / 100
    const offset = CIRCUMFERENCE * (1 - cumulative - pct)
    const dash = CIRCUMFERENCE * pct
    cumulative += pct
    return { ...item, dash, offset }
  })

  return (
    <div className="flex items-center gap-10">
      {/* SVG ring */}
      <div className="relative flex-shrink-0" style={{ width: C * 2, height: C * 2 }}>
        <svg width={C * 2} height={C * 2} viewBox={`0 0 ${C * 2} ${C * 2}`}>
          {/* background track */}
          <circle cx={C} cy={C} r={RADIUS} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />
          {segments.map((seg, i) => (
            <circle
              key={i}
              cx={C}
              cy={C}
              r={RADIUS}
              fill="none"
              stroke={COLORS[seg.riskLevel] || '#94a3b8'}
              strokeWidth={STROKE}
              strokeDasharray={`${seg.dash} ${CIRCUMFERENCE - seg.dash}`}
              strokeDashoffset={seg.offset}
              strokeLinecap="butt"
              style={{ transform: 'rotate(-90deg)', transformOrigin: `${C}px ${C}px`, transition: 'stroke-dasharray 0.6s ease' }}
            />
          ))}
        </svg>
        {/* center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-slate-800">{total}</span>
          <span className="text-[11px] text-slate-400 font-medium">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-4">
        <p className="text-sm font-bold text-slate-700 mb-1">สัดส่วนความเสี่ยง</p>
        {distribution.map(item => (
          <div key={item.riskLevel} className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: COLORS[item.riskLevel] }} />
            <span className="text-sm text-slate-600 w-36">
              {item.riskLevel === 'LOW' ? 'ความเสี่ยงต่ำ' : item.riskLevel === 'MEDIUM' ? 'ความเสี่ยงปานกลาง' : 'ความเสี่ยงสูง'}
            </span>
            <span className="text-sm font-bold text-slate-800 ml-auto">{Math.round(item.percent)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── KPI Summary Card ────────────────────────────────────────────────────────
interface KPIProps {
  title: string
  value: number | string
  icon: string
  iconBg: string
  iconColor: string
  badge?: string
  badgeColor?: string
  alert?: boolean
}

function SummaryCard({ title, value, icon, iconBg, iconColor, badge, badgeColor, alert }: KPIProps) {
  return (
    <div className={`bg-white rounded-2xl p-5 shadow-card border ${alert ? 'border-risk-high-border/40 bg-risk-high-bg/20' : 'border-slate-100'} transition-all hover:shadow-card-hover`}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-[13px] text-slate-500 font-medium leading-tight">{title}</span>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
          <span className="material-symbols-outlined icon-fill !text-[18px]" style={{ color: iconColor }}>{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-2 flex-wrap">
        <span className={`text-3xl font-bold ${alert ? 'text-risk-high-dark' : 'text-slate-900'}`}>{value}</span>
        {badge && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full mb-0.5" style={{ background: badgeColor ? `${badgeColor}20` : '#e0e7ff', color: badgeColor || '#4f46e5' }}>
            {badge}
          </span>
        )}
      </div>
      <p className={`text-[12px] mt-1 ${alert ? 'text-risk-high-dark' : 'text-slate-400'}`}>
        {alert ? 'คะแนนต่ำ ต้องระวัง' : 'เคส'}
      </p>
    </div>
  )
}

// ─── Key Insight Card ────────────────────────────────────────────────────────
function InsightCard({ insight }: { insight: KeyInsight }) {
  const config = {
    POSITIVE: { bg: 'bg-emerald-50', border: 'border-emerald-200', icon: 'trending_up', iconColor: 'text-emerald-600', titleColor: 'text-emerald-700' },
    WARNING:  { bg: 'bg-amber-50',   border: 'border-amber-200',   icon: 'warning',     iconColor: 'text-amber-600',   titleColor: 'text-amber-700'   },
    ALERT:    { bg: 'bg-red-50',     border: 'border-red-200',     icon: 'error',       iconColor: 'text-red-600',     titleColor: 'text-red-700'     },
  }
  const c = config[insight.type] || config.WARNING

  return (
    <div className={`${c.bg} ${c.border} border rounded-xl p-4 flex gap-3 items-start`}>
      <span className={`material-symbols-outlined icon-fill !text-[20px] flex-shrink-0 mt-0.5 ${c.iconColor}`}>{c.icon}</span>
      <div>
        <p className={`text-[13px] font-bold ${c.titleColor}`}>{insight.title}</p>
        <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{insight.description}</p>
      </div>
    </div>
  )
}

// ─── Risk Badge ─────────────────────────────────────────────────────────────
function RiskPill({ level }: { level: string }) {
  if (level === 'LOW')    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-risk-low-bg text-risk-low-text border border-risk-low-border/30"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"/>ความเสี่ยงต่ำ</span>
  if (level === 'MEDIUM') return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-risk-medium-bg text-risk-medium-text border border-risk-medium-border/30"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"/>ปานกลาง</span>
  return                         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold bg-risk-high-bg text-risk-high-text border border-risk-high-border/30"><span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"/>ความเสี่ยงสูง</span>
}

// ─── Skeleton Loader ─────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [distribution, setDistribution] = useState<RiskDistribution | null>(null)
  const [recent, setRecent] = useState<RecentAssessments | null>(null)
  const [insights, setInsights] = useState<KeyInsights | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        const [s, d, r, k] = await Promise.all([
          getDashboardSummary(),
          getRiskDistribution(),
          getRecentAssessments(5),
          getKeyInsights(),
        ])
        setSummary(s)
        setDistribution(d)
        setRecent(r)
        setInsights(k)
      } catch (err: any) {
        const status = err?.response?.status
        if (status === 401) setError('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่')
        else if (status === 403) setError('ไม่มีสิทธิ์เข้าถึงข้อมูล Dashboard')
        else setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok' })
    } catch { return iso }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก' }, { label: 'Dashboard' }]} />

        <main className="flex-1 overflow-y-auto p-7 space-y-7 bg-app-bg">

          {/* ── Header ── */}
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h2 className="text-[28px] font-bold text-slate-900 leading-tight">Dashboard</h2>
              <p className="text-slate-500 mt-0.5 text-[14px]">ภาพรวมการประเมินผู้ขอสินเชื่อ</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" icon="history" onClick={() => router.push('/history')}>
                ดูประวัติการประเมิน
              </Button>
              <Button icon="add_chart" onClick={() => router.push('/predict')}>
                ประเมินเคสใหม่
              </Button>
            </div>
          </div>

          {/* ── Error Banner ── */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-risk-high-bg border border-risk-high-border/30 text-risk-high-text text-sm font-medium">
              <span className="material-symbols-outlined icon-fill !text-[20px]">error</span>
              {error}
              <button className="ml-auto underline text-[12px]" onClick={() => window.location.reload()}>ลองใหม่</button>
            </div>
          )}

          {/* ── KPI Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)
            ) : (
              <>
                <SummaryCard
                  title="เคสประเมินทั้งหมด"
                  value={summary?.totalAssessments ?? 0}
                  icon="folder_open"
                  iconBg="#dbe1ff"
                  iconColor="#004ac6"
                  badge={summary?.changeVsPreviousPeriodPercent !== undefined ? `${summary.changeVsPreviousPeriodPercent >= 0 ? '+' : ''}${summary.changeVsPreviousPeriodPercent}%` : undefined}
                  badgeColor="#4059aa"
                />
                <SummaryCard
                  title="ความเสี่ยงต่ำ"
                  value={summary?.lowRiskCount ?? 0}
                  icon="check_circle"
                  iconBg="#dcfce7"
                  iconColor="#16a34a"
                />
                <SummaryCard
                  title="ความเสี่ยงปานกลาง"
                  value={summary?.mediumRiskCount ?? 0}
                  icon="warning"
                  iconBg="#ede9fe"
                  iconColor="#7c3aed"
                />
                <SummaryCard
                  title="ความเสี่ยงสูง"
                  value={summary?.highRiskCount ?? 0}
                  icon="error"
                  iconBg="#fee2e2"
                  iconColor="#dc2626"
                  badge={summary?.highRiskPercent !== undefined ? `${summary.highRiskPercent.toFixed(1)}%` : undefined}
                  badgeColor="#dc2626"
                  alert
                />
              </>
            )}
          </div>

          {/* ── Middle: Donut + Key Insights ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Donut Chart */}
            <div className="lg:col-span-3 bg-white rounded-2xl p-7 shadow-card border border-slate-100">
              {loading || !distribution ? (
                <div className="flex gap-10 items-center">
                  <Skeleton className="w-[204px] h-[204px] rounded-full" />
                  <div className="flex flex-col gap-3 flex-1">
                    <Skeleton className="h-4 w-32" />
                    {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-4 w-full" />)}
                  </div>
                </div>
              ) : (
                <DonutChart distribution={distribution.distribution} total={distribution.total} />
              )}
            </div>

            {/* Key Insights */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card border border-slate-100 flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined icon-fill !text-[18px] text-amber-500">auto_awesome</span>
                <h3 className="text-[13px] font-bold text-slate-700 uppercase tracking-wide">Key Insights</h3>
              </div>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16" />)
              ) : insights?.insights.length ? (
                insights.insights.map((ins, i) => <InsightCard key={i} insight={ins} />)
              ) : (
                <p className="text-sm text-slate-400 italic">ไม่มีข้อมูล Insights</p>
              )}
            </div>
          </div>

          {/* ── Recent Assessments Table ── */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
            <div className="px-7 py-5 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-[15px] font-bold text-slate-900">รายการประเมินล่าสุด</h3>
              <Button variant="ghost" icon="arrow_forward" onClick={() => router.push('/history')} className="text-[13px] !py-1.5 !px-3">
                ดูทั้งหมด
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['รหัสอ้างอิง (ID)', 'ชื่อผู้ขอสินเชื่อ', 'วันที่ประเมิน', 'คะแนน (SCORE)', 'ระดับความเสี่ยง', 'สถานะ'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                    <th className="px-5 py-3 w-12" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 7 }).map((_, j) => (
                            <td key={j} className="px-5 py-4">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : recent?.items.map((item, idx) => {
                        const itemId = item.assessmentId || (item as any).id || item.assessmentNo
                        return (
                          <tr 
                            key={itemId || `recent-${idx}`} 
                            className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                            onClick={() => itemId && router.push(`/history/${itemId}`)}
                          >
                            <td className="px-5 py-4">
                              <span className="font-mono text-[13px] font-bold text-slate-500">{item.assessmentNo}</span>
                            </td>
                            <td className="px-5 py-4 text-[13px] font-medium text-slate-700 whitespace-nowrap">{item.applicantName}</td>
                            <td className="px-5 py-4 text-[13px] text-slate-500 whitespace-nowrap">{formatDate(item.createdAt)}</td>
                            <td className="px-5 py-4">
                              <span className={`text-[15px] font-bold ${item.riskLevel === 'HIGH' ? 'text-risk-high-dark' : item.riskLevel === 'MEDIUM' ? 'text-risk-medium-dark' : 'text-risk-low-dark'}`}>
                                {item.score}
                              </span>
                            </td>
                            <td className="px-5 py-4">
                              <RiskPill level={item.riskLevel} />
                            </td>
                            <td className="px-5 py-4 text-[12px] text-slate-400">
                              {item.riskLevel === 'HIGH' ? 'ตรวจสอบเพิ่มเติม' : item.riskLevel === 'MEDIUM' ? 'ควรติดตาม' : 'อนุมัติได้ทันที'}
                            </td>
                            <td className="px-5 py-4 text-right" onClick={e => e.stopPropagation()}>
                              <button 
                                onClick={() => itemId && router.push(`/history/${itemId}`)}
                                className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center hover:bg-brand/20 transition-colors mx-auto group-hover:scale-105"
                                title={itemId ? 'ดูรายละเอียด' : 'ไม่พบ ID'}
                              >
                                <span className="material-symbols-outlined !text-[17px]">visibility</span>
                              </button>
                            </td>
                          </tr>
                        )
                      })
                  }
                  {!loading && (!recent || recent.items.length === 0) && (
                    <tr>
                      <td colSpan={7} className="py-14 text-center text-slate-400 text-sm italic">
                        ยังไม่มีรายการประเมิน
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}

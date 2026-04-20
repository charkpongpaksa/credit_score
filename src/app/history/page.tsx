'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import Button from '@/components/ui/Button'
import { getAssessmentList } from '@/services/assessment'
import { AssessmentList, AssessmentListItem, RiskLevel } from '@/types/assessment'

// ── Risk Badge ────────────────────────────────────────────────────────────────
function RiskPill({ level }: { level: RiskLevel | null }) {
  if (!level) return <span className="text-slate-300 text-[12px]">—</span>
  const cfg: Record<RiskLevel, { bg: string; text: string; border: string; label: string }> = {
    LOW:    { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200', label: 'ต่ำ (Low)'          },
    MEDIUM: { bg: 'bg-violet-50',   text: 'text-violet-700',  border: 'border-violet-200',  label: 'ปานกลาง (Medium)'  },
    HIGH:   { bg: 'bg-red-50',      text: 'text-red-700',     border: 'border-red-200',     label: 'สูง (High)'         },
  }
  const c = cfg[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {c.label}
    </span>
  )
}

// ── Score display ─────────────────────────────────────────────────────────────
function ScoreText({ score, level }: { score: number | null; level: RiskLevel | null }) {
  if (score === null) return <span className="text-slate-300 text-sm">—</span>
  const color = level === 'HIGH' ? 'text-red-600' : level === 'MEDIUM' ? 'text-violet-600' : 'text-emerald-600'
  return <span className={`text-[15px] font-bold ${color}`}>{Math.round(score)}/100</span>
}

function RecText({ type }: { type: string | null }) {
  if (!type) return <span className="text-slate-300 text-[12px] italic">—</span>

  const config: Record<string, { label: string; color: string; bg: string }> = {
    APPROVE:       { label: 'อนุมัติสินเชื่อตามเกณฑ์ปกติ', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    REJECT:        { label: 'ปฏิเสธ / พิจารณาพิเศษ',       color: 'text-red-700',     bg: 'bg-red-50' },
    REVIEW:        { label: 'ขอเอกสารและตรวจสอบเพิ่ม',     color: 'text-amber-700',   bg: 'bg-amber-50' },
    REVIEW_MANUAL: { label: 'พิจารณาพิเศษ (Manual)',       color: 'text-violet-700',  bg: 'bg-violet-50' },
    INFO:          { label: 'รอข้อมูลเพิ่มเติม',             color: 'text-blue-700',    bg: 'bg-blue-50' },
  }

  const c = config[type]
  if (c) {
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium ${c.color} ${c.bg}`}>
        {c.label}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium text-slate-600 bg-slate-100">
      {type}
    </span>
  )
}

// ── Avatar initials ───────────────────────────────────────────────────────────
function AvatarInitials({ name, level }: { name: string | null | undefined; level: RiskLevel | null }) {
  const safeName = name || '??'
  const initials = safeName.trim().split(' ').map(w => w[0] || '').join('').slice(0, 2).toUpperCase() || '??'
  const bg = level === 'HIGH' ? 'bg-red-100 text-red-600' : level === 'MEDIUM' ? 'bg-violet-100 text-violet-600' : 'bg-emerald-100 text-emerald-700'
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${bg}`}>
      {initials}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
}

// ── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null
  const pages: (number | '...')[] = []
  if (totalPages <= 6) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('...')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }
  return (
    <div className="flex items-center gap-1">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all">
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>
      {pages.map((p, i) => p === '...'
        ? <span key={`dot-${i}`} className="w-8 text-center text-slate-400 text-sm">…</span>
        : <button key={p} onClick={() => onChange(p as number)}
            className={`w-8 h-8 rounded-lg text-[13px] font-semibold transition-all ${p === page ? 'bg-brand text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>
            {p}
          </button>
      )}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 disabled:opacity-30 transition-all">
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  )
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  })
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function HistoryPage() {
  const router = useRouter()
  const [data, setData] = useState<AssessmentList | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [search, setSearch]       = useState('')
  const [riskLevel, setRiskLevel] = useState('')
  const [status, setStatus]       = useState('')
  const [dateFrom, setDateFrom]   = useState('')
  const [dateTo, setDateTo]       = useState('')
  const [sortBy, setSortBy]       = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage]           = useState(1)
  const PAGE_SIZE = 10

  const fetchData = useCallback(async (
    pg: number,
    opts?: {
      search?: string
      riskLevel?: string
      status?: string
      dateFrom?: string
      dateTo?: string
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }
  ) => {
    setLoading(true)
    setError(null)
    try {
      const result = await getAssessmentList({
        page: pg,
        pageSize: PAGE_SIZE,
        search:    (opts?.search    ?? search)    || undefined,
        riskLevel: (opts?.riskLevel ?? riskLevel) || undefined,
        status:    (opts?.status    ?? status)    || undefined,
        dateFrom:  (opts?.dateFrom  ?? dateFrom)  || undefined,
        dateTo:    (opts?.dateTo    ?? dateTo)    || undefined,
        sortBy:    (opts?.sortBy    ?? sortBy)    || undefined,
        sortOrder: (opts?.sortOrder ?? sortOrder) || undefined,
      })
      setData(result)
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 401) setError('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่')
      else if (status === 403) setError('ไม่มีสิทธิ์เข้าถึงข้อมูล')
      else setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่')
    } finally {
      setLoading(false)
    }
  }, [search, riskLevel, status, dateFrom, dateTo, sortBy, sortOrder])

  // Auto-search (live filtering) with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      fetchData(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [search, riskLevel, status, dateFrom, dateTo, sortBy, sortOrder, fetchData])

  const handleSearch = () => { setPage(1); fetchData(1) }
  const handleClear  = () => {
    setSearch('')
    setRiskLevel('')
    setStatus('')
    setDateFrom('')
    setDateTo('')
    setSortBy('createdAt')
    setSortOrder('desc')
    // useEffect will auto-trigger fetchData when these states change
  }
  const handlePageChange = (p: number) => { setPage(p); fetchData(p) }

  const pagn = data?.pagination

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก', path: '/dashboard' }, { label: 'ประวัติการประเมิน' }]} />

        <main className="flex-1 overflow-y-auto p-7 bg-app-bg space-y-6">

          {/* ── Header ── */}
          <div className="flex justify-between items-end flex-wrap gap-4">
            <div>
              <h2 className="text-[28px] font-bold text-slate-900 leading-tight">ประวัติการประเมิน</h2>
              <p className="text-slate-500 mt-0.5 text-[14px]">ตรวจสอบและจัดการผลการประเมินความเสี่ยงสินเชื่อย้อนหลัง</p>
            </div>
            <Button icon="add_chart" onClick={() => router.push('/predict')}>
              ประเมินเคสใหม่
            </Button>
          </div>

          {/* ── Filter Bar ── */}
          <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">ค้นหา (ชื่อ / รหัส)</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">search</span>
                  <input type="text" placeholder="ระบุคำค้นหา..."
                    value={search} onChange={e => setSearch(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                  />
                </div>
              </div>
              <div className="min-w-[160px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">ระดับความเสี่ยง</label>
                <select value={riskLevel} onChange={e => setRiskLevel(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all appearance-none">
                  <option value="">ทั้งหมด</option>
                  <option value="LOW">ความเสี่ยงต่ำ</option>
                  <option value="MEDIUM">ความเสี่ยงปานกลาง</option>
                  <option value="HIGH">ความเสี่ยงสูง</option>
                </select>
              </div>
              <div className="min-w-[160px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">สถานะ</label>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all appearance-none">
                  <option value="">ทั้งหมด</option>
                  <option value="DRAFT">DRAFT</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="RE_EVALUATED">RE_EVALUATED</option>
                </select>
              </div>
              <div className="min-w-[160px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">วันที่เริ่มต้น</label>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                />
              </div>
              <div className="min-w-[160px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">วันที่สิ้นสุด</label>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all"
                />
              </div>
              <div className="min-w-[180px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Sort By</label>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all appearance-none">
                  <option value="createdAt">createdAt</option>
                  <option value="submittedAt">submittedAt</option>
                  <option value="score">score</option>
                </select>
              </div>
              <div className="min-w-[140px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Sort Order</label>
                <select value={sortOrder} onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all appearance-none">
                  <option value="desc">desc</option>
                  <option value="asc">asc</option>
                </select>
              </div>
              <div className="flex gap-2 pb-0.5">
                <Button variant="secondary" icon="filter_list" onClick={handleSearch}>ค้นหา</Button>
                <Button variant="ghost" icon="close" onClick={handleClear}>ล้างตัวกรอง</Button>
              </div>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
              <button className="ml-auto text-[12px] underline" onClick={() => fetchData(page)}>ลองใหม่</button>
            </div>
          )}

          {/* ── Table ── */}
          <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['ID เคส', 'ชื่อลูกค้า / บริษัท', 'วันที่ประเมิน', 'คะแนน', 'ระดับความเสี่ยง', 'คำแนะนำเบื้องต้น', 'จัดการ'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                          <td className="px-5 py-4"><div className="flex items-center gap-3"><Skeleton className="w-9 h-9 rounded-full" /><Skeleton className="h-4 w-32" /></div></td>
                          <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                          <td className="px-5 py-4"><Skeleton className="h-4 w-16" /></td>
                          <td className="px-5 py-4"><Skeleton className="h-6 w-28 rounded-full" /></td>
                          <td className="px-5 py-4"><Skeleton className="h-4 w-36" /></td>
                          <td className="px-5 py-4"><Skeleton className="h-8 w-8 rounded-full" /></td>
                        </tr>
                      ))
                    : !data?.items?.length
                    ? (
                        <tr>
                          <td colSpan={7} className="py-20 text-center">
                            <div className="flex flex-col items-center gap-3 text-slate-400">
                              <span className="material-symbols-outlined text-[48px]">find_in_page</span>
                              <p className="text-sm font-medium">ไม่พบรายการที่ตรงกับเงื่อนไข</p>
                            </div>
                          </td>
                        </tr>
                      )
                    : data.items.map((item: AssessmentListItem, idx: number) => (
                        <tr
                          key={item.id || `row-${idx}`}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                          onClick={() => item.id && router.push(`/history/${item.id}`)}
                        >
                          <td className="px-5 py-4">
                            <span className="font-mono text-[13px] font-bold text-slate-500">{item.assessmentNo}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <AvatarInitials name={item.applicantName} level={item.riskLevel} />
                              <span className="text-[13px] font-semibold text-slate-700 whitespace-nowrap">{item.applicantName}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[13px] text-slate-500 whitespace-nowrap">
                            {formatDate(item.submittedAt || item.createdAt)}
                          </td>
                          <td className="px-5 py-4">
                            <ScoreText score={item.score} level={item.riskLevel} />
                          </td>
                          <td className="px-5 py-4">
                            <RiskPill level={item.riskLevel} />
                          </td>
                          <td className="px-5 py-4">
                            <RecText type={item.recommendationType} />
                          </td>
                          <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => item.id && router.push(`/history/${item.id}`)}
                              className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center hover:bg-brand/20 transition-colors group-hover:scale-105"
                              title="ดูรายละเอียด"
                            >
                              <span className="material-symbols-outlined text-[17px]">visibility</span>
                            </button>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>

            {/* ── Footer ── */}
            {pagn && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                <p className="text-[13px] text-slate-500">
                  แสดง{' '}
                  <span className="font-semibold text-slate-700">
                    {(pagn.page - 1) * pagn.pageSize + 1}–{Math.min(pagn.page * pagn.pageSize, pagn.totalItems)}
                  </span>{' '}
                  จาก <span className="font-semibold text-slate-700">{pagn.totalItems}</span> รายการ
                </p>
                <Pagination page={pagn.page} totalPages={pagn.totalPages} onChange={handlePageChange} />
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

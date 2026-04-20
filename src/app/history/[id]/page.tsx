'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import Button from '@/components/ui/Button'
import {
  getAssessmentDetail,
  getAssessmentRiskFactors,
  getAssessmentRecommendations,
  getAssessmentResult,
} from '@/services/assessment'
import {
  AssessmentDetail,
  RiskFactors,
  Recommendations,
  RiskLevel,
  RiskFactor,
  Recommendation,
} from '@/types/assessment'

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(iso: string | null | undefined, withTime = false) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return iso
  return d.toLocaleDateString('th-TH', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Bangkok',
    ...(withTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  })
}

function money(n: number | undefined) {
  if (n === undefined || n === null) return '—'
  return '฿ ' + n.toLocaleString('th-TH')
}

function pct(n: number | undefined) {
  if (n === undefined || n === null) return '—'
  return (n * 100).toFixed(1) + '%'
}

function tenure(months: number | undefined) {
  if (months === undefined) return '—'
  return `${Math.floor(months / 12)} ปี ${months % 12} เดือน`
}

const MARITAL: Record<string, string> = {
  SINGLE: 'โสด', MARRIED: 'สมรส', DIVORCED: 'หย่าร้าง', WIDOWED: 'หม้าย', CIVIL_PARTNERSHIP: 'อยู่ร่วมกัน',
}
const EMP_TYPE: Record<string, string> = {
  FULL_TIME: 'พนักงานประจำ', PART_TIME: 'ชั่วคราว/พาร์ทไทม์', SELF_EMPLOYED: 'อาชีพอิสระ', BUSINESS_OWNER: 'เจ้าของกิจการ',
}
const LOAN_PURPOSE: Record<string, string> = {
  HOME_PURCHASE: 'ซื้อบ้าน/อสังหาริมทรัพย์', HOME_IMPROVEMENT: 'ปรับปรุงบ้าน',
  CAR: 'ซื้อรถ', EDUCATION: 'การศึกษา', BUSINESS: 'ธุรกิจ', PERSONAL: 'ใช้ส่วนตัว',
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function Sk({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100">
      <h3 className="flex items-center gap-2 text-[15px] font-bold text-slate-800 mb-5">
        <span className="material-symbols-outlined text-[20px] text-brand">{icon}</span>
        {title}
      </h3>
      {children}
    </div>
  )
}

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-slate-50 last:border-0">
      <span className="text-[13px] text-slate-500">{label}</span>
      <span className={`text-[13px] font-semibold text-right ${accent ? 'text-brand text-[16px] font-bold' : 'text-slate-800'}`}>
        {value}
      </span>
    </div>
  )
}

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ creditScore, score, riskLevel, primaryReason, recommendationType, defaultProbability }: {
  creditScore: number; score: number; riskLevel: RiskLevel; primaryReason: string; recommendationType: string; defaultProbability?: number
}) {
  const pct100 = Math.min(Math.max(score, 0), 100)
  const R = 54, SW = 10, C = R + SW
  const CIRC = 2 * Math.PI * R
  const dash = (pct100 / 100) * CIRC

  const cfg: Record<RiskLevel, { stroke: string; badge: string; badgeCls: string; icon: string; iconCls: string }> = {
    LOW:    { stroke: '#22c55e', badge: 'ความเสี่ยงต่ำ (Low Risk)',   badgeCls: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: 'check_circle',  iconCls: 'text-emerald-500' },
    MEDIUM: { stroke: '#8b5cf6', badge: 'ความเสี่ยงปานกลาง (Medium)', badgeCls: 'bg-violet-100 text-violet-700 border-violet-200',   icon: 'warning',       iconCls: 'text-violet-500'  },
    HIGH:   { stroke: '#ef4444', badge: 'ความเสี่ยงสูง (High Risk)',   badgeCls: 'bg-red-100 text-red-700 border-red-200',           icon: 'error',         iconCls: 'text-red-500'     },
  }
  const c = cfg[riskLevel]

  return (
    <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 flex flex-col items-center gap-4">
      <div className="relative" style={{ width: C * 2, height: C * 2 }}>
        <svg width={C * 2} height={C * 2} viewBox={`0 0 ${C * 2} ${C * 2}`}>
          <circle cx={C} cy={C} r={R} fill="none" stroke="#f1f5f9" strokeWidth={SW} />
          <circle cx={C} cy={C} r={R} fill="none"
            stroke={c.stroke} strokeWidth={SW}
            strokeDasharray={`${dash} ${CIRC - dash}`}
            strokeDashoffset={CIRC * 0.25}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`material-symbols-outlined text-[28px] ${c.iconCls}`} style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">CREDIT SCORE</p>
        <p className="text-5xl font-black text-slate-900 leading-none">{creditScore}</p>
      </div>

      <span className={`px-4 py-1.5 rounded-full text-[12px] font-bold border ${c.badgeCls}`}>{c.badge}</span>

      {primaryReason && (
        <div className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">ข้อสรุปเบื้องต้น</p>
          <p className="text-[13px] text-slate-600 leading-relaxed">{primaryReason}</p>
        </div>
      )}
      {defaultProbability !== undefined && defaultProbability !== null && (
        <div className="w-full bg-slate-50 rounded-xl p-3.5 border border-slate-100">
          <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">Model ML</p>
          <p className="text-[12px] text-slate-600">
            defaultProbability:
            <span className="ml-1 font-mono font-semibold text-slate-800">{defaultProbability.toFixed(6)}</span>
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Risk Factor Row ──────────────────────────────────────────────────────────
function FactorRow({ f }: { f: RiskFactor }) {
  const cfg = {
    POSITIVE: { icon: 'trending_up',  cls: 'text-emerald-600 bg-emerald-50' },
    NEGATIVE: { icon: 'trending_down', cls: 'text-red-600 bg-red-50'       },
    NEUTRAL:  { icon: 'remove',        cls: 'text-slate-500 bg-slate-100'   },
  }
  const c = cfg[f.impactDirection] || cfg.NEUTRAL
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${c.cls}`}>
        <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-[13px] font-semibold text-slate-700">{f.labelTh}</p>
        {f.detail && <p className="text-[12px] text-slate-500 mt-0.5">{f.detail}</p>}
      </div>
      {f.impactScore !== undefined && (
        <span className={`text-[11px] font-bold shrink-0 mt-1 ${f.impactDirection === 'POSITIVE' ? 'text-emerald-600' : f.impactDirection === 'NEGATIVE' ? 'text-red-600' : 'text-slate-400'}`}>
          {f.impactDirection === 'POSITIVE' ? '+' : f.impactDirection === 'NEGATIVE' ? '-' : ''}{Math.abs(f.impactScore).toFixed(0)}
        </span>
      )}
    </div>
  )
}

// ─── Recommendation Card ──────────────────────────────────────────────────────
function RecommCard({ r }: { r: Recommendation }) {
  const cfg: Record<string, { icon: string; bg: string; border: string; text: string }> = {
    APPROVE: { icon: 'check_circle', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    REJECT:  { icon: 'cancel',       bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700'     },
    REVIEW:  { icon: 'warning',      bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700'   },
    REVIEW_MANUAL: { icon: 'warning', bg: 'bg-amber-50',  border: 'border-amber-200',   text: 'text-amber-700'   },
    INFO:    { icon: 'info',         bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700'    },
  }
  const c = cfg[r.type] || cfg.INFO
  return (
    <div className={`flex gap-3 p-4 rounded-xl border ${c.bg} ${c.border} ${r.isPrimary ? 'ring-1 ring-offset-1 ring-current/20' : ''}`}>
      <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${c.text}`} style={{ fontVariationSettings: "'FILL' 1" }}>{c.icon}</span>
      <div>
        <p className={`text-[13px] font-bold ${c.text}`}>{r.titleTh}{r.isPrimary && <span className="ml-1.5 text-[10px] font-bold opacity-60">PRIMARY</span>}</p>
        <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{r.descriptionTh}</p>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AssessmentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [detail, setDetail]     = useState<AssessmentDetail | null>(null)
  const [factors, setFactors]   = useState<RiskFactors | null>(null)
  const [recoms, setRecoms]     = useState<Recommendations | null>(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    if (!id || id === 'undefined') { setError('ไม่พบรหัสเคสนี้'); setLoading(false); return }

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        // Load detail first (required), then risk-factors + recommendations in parallel (optional)
        const det = await getAssessmentDetail(id)
        let nextDetail = det

        // บางเคส detail อาจยังไม่มี result object; fallback ด้วย /result เพื่อให้การ์ดคะแนนแสดงแน่นอน
        if (!det?.result) {
          try {
            const result = await getAssessmentResult(id)
            nextDetail = {
              ...det,
              result: {
                resultId: result.resultId,
                score: result.score,
                creditScore: result.creditScore,
                scoreGrade: result.scoreGrade,
                defaultProbability: result.defaultProbability,
                riskLevel: result.riskLevel,
                recommendationType: result.recommendationType,
                primaryReason: result.primaryReason,
                createdAt: result.createdAt || '',
              },
            }
          } catch {
            nextDetail = det
          }
        }

        setDetail(nextDetail)

        const [fac, rec] = await Promise.allSettled([
          getAssessmentRiskFactors(id),
          getAssessmentRecommendations(id),
        ])
        if (fac.status === 'fulfilled') setFactors(fac.value)
        if (rec.status === 'fulfilled') setRecoms(rec.value)
      } catch (err: any) {
        const status = err?.response?.status
        if (status === 404) setError('ไม่พบข้อมูลเคสนี้ หรือถูกลบไปแล้ว')
        else if (status === 403) setError('ไม่มีสิทธิ์ดูข้อมูลเคสนี้')
        else setError('ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar breadcrumbs={[{ label: 'ประวัติการประเมิน', path: '/history' }, { label: 'กำลังโหลด...' }]} />
          <main className="flex-1 p-7 bg-app-bg">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6"><Sk className="h-48" /><Sk className="h-40" /><Sk className="h-40" /></div>
              <div className="space-y-6"><Sk className="h-72" /><Sk className="h-52" /></div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 bg-app-bg">
          <span className="material-symbols-outlined text-[64px] text-slate-200">find_in_page</span>
          <p className="text-slate-500 font-medium">{error || 'ไม่พบข้อมูลเคสนี้'}</p>
          <Button variant="secondary" icon="arrow_back" onClick={() => router.push('/history')}>กลับไปหน้าประวัติ</Button>
        </div>
      </div>
    )
  }

  const { assessment, applicantProfile: p, employmentInfo: emp, financialInfo: fin, debtInfos, result } = detail
  const fullName = p?.firstName ? `${p.firstName} ${p.lastName}` : `ลูกค้า ${assessment.assessmentNo}`

  return (
    <div className="flex min-h-screen bg-app-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'ประวัติการประเมิน', path: '/history' }, { label: fullName }]} />

        <main className="flex-1 overflow-y-auto p-7">

          {/* ── Sub-header ── */}
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
            <div>
              <p className="text-[12px] text-slate-400 font-mono tracking-wider mb-1">
                {assessment.assessmentNo}
                {result?.createdAt && ` • ${fmt(result.createdAt, true)}`}
              </p>
              <h1 className="text-[28px] font-bold text-slate-900 leading-tight">{fullName}</h1>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" icon="arrow_back" onClick={() => router.push('/history')}>กลับไปหน้าประวัติ</Button>
              <Button icon="refresh" onClick={() => router.push('/predict')}>ประเมินใหม่อีกครั้ง</Button>
            </div>
          </div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Left col (2/3) ── */}
            <div className="lg:col-span-2 flex flex-col gap-6">

              {/* Customer Info */}
              <Section icon="person" title="ข้อมูลลูกค้า">
                <div className="grid grid-cols-2 gap-x-8">
                  <InfoRow label="สถานภาพ" value={p?.maritalStatus ? MARITAL[p.maritalStatus] || p.maritalStatus : '—'} />
                  <InfoRow label="อายุ" value={p?.ageYears ? `${p.ageYears} ปี` : '—'} />
                  <InfoRow label="ประเภทการจ้างงาน" value={emp?.employmentType ? EMP_TYPE[emp.employmentType] || emp.employmentType : '—'} />
                  <InfoRow label="อายุงาน" value={emp?.jobTenureMonths ? tenure(emp.jobTenureMonths) : '—'} />
                  {emp?.employerName && <InfoRow label="สถานที่ทำงาน" value={emp.employerName} />}
                </div>
                {(p?.district || p?.provinceCode) && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[11px] text-slate-400 uppercase font-bold tracking-wider mb-1">ที่อยู่ปัจจุบัน</p>
                    <p className="text-[14px] text-slate-700">
                      {[p.district, p.provinceCode ? `จังหวัด ${p.provinceCode}` : null, p.postalCode].filter(Boolean).join(' ')}
                    </p>
                  </div>
                )}
              </Section>

              {/* Financial Info */}
              <Section icon="account_balance" title="ข้อมูลทางการเงิน">
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-semibold mb-1">รายได้ต่อเดือน</p>
                    <p className="text-[20px] font-bold text-brand">{money(emp?.monthlyIncome || 0)}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <p className="text-[11px] text-slate-500 font-semibold mb-1">ภาระหนี้รายเดือน</p>
                    <p className="text-[20px] font-bold text-slate-700">{money(fin?.monthlyDebtPayment || 0)}</p>
                  </div>
                </div>
                <InfoRow label="DSR (Debt Service Ratio)" value={pct(fin?.debtServiceRatio || 0)} />
                <InfoRow label="วงเงินที่ขอสินเชื่อ" value={money(fin?.requestedLoanAmount || 0)} accent />
                <InfoRow label="ระยะเวลาผ่อนชำระ" value={`${fin?.loanTermMonths || 0} เดือน`} />
                <InfoRow label="วัตถุประสงค์สินเชื่อ" value={fin?.loanPurposeCode ? (LOAN_PURPOSE[fin.loanPurposeCode] || fin.loanPurposeCode) : '—'} />
                {fin?.netMonthlyIncome && <InfoRow label="รายได้สุทธิต่อเดือน (หลังหักหนี้)" value={money(fin.netMonthlyIncome)} />}
                {emp?.additionalIncome && emp.additionalIncome > 0 && <InfoRow label="รายได้เสริม" value={money(emp.additionalIncome)} />}
              </Section>
              {/* Debt Infos */}
              {debtInfos && debtInfos.length > 0 && (
                <Section icon="credit_card" title="รายละเอียดหนี้สิน">
                  <div className="space-y-3">
                    {debtInfos.map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-[13px] font-semibold text-slate-700">
                            {d.debtType.replace(/_/g, ' ')} {d.creditorName ? `· ${d.creditorName}` : ''}
                          </p>
                          <p className="text-[12px] text-slate-500 mt-0.5">ผ่อนรายเดือน {money(d.monthlyPayment)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-bold text-slate-800">{money(d.outstandingAmount)}</p>
                          {d.delinquentDays > 0 && <p className="text-[11px] text-red-500 font-semibold">ค้างชำระ {d.delinquentDays} วัน</p>}
                          {d.isDefaulted && <p className="text-[11px] text-red-600 font-bold">⚠ ผิดนัดชำระ</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </div>

            {/* ── Right col (1/3) ── */}
            <div className="flex flex-col gap-6">

              {result ? (
                <ScoreRing
                  creditScore={result.creditScore}
                  score={result.score}
                  riskLevel={result.riskLevel}
                  primaryReason={result.primaryReason}
                  recommendationType={result.recommendationType}
                  defaultProbability={result.defaultProbability}
                />
              ) : (
                <div className="bg-white rounded-2xl p-6 shadow-card border border-slate-100 flex flex-col items-center gap-3 text-slate-400">
                  <span className="material-symbols-outlined text-[40px]">pending</span>
                  <p className="text-sm font-medium">รอผลการประเมิน</p>
                </div>
              )}

              {/* Risk Factors */}
              {factors && factors.factors.length > 0 && (
                <Section icon="warning" title="ปัจจัยที่ควรพิจารณาเพิ่มเติม">
                  <div className="space-y-1">
                    {factors.factors.map((f, i) => <FactorRow key={i} f={f} />)}
                  </div>
                </Section>
              )}

              {/* Recommendations */}
              {recoms && recoms.recommendations.length > 0 && (
                <Section icon="lightbulb" title="คำแนะนำการตัดสินใจ">
                  <div className="space-y-3">
                    {[...recoms.recommendations]
                      .sort((a, b) => a.priority - b.priority)
                      .map((r, i) => <RecommCard key={i} r={r} />)}
                  </div>
                </Section>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

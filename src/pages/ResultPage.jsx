import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import RiskBadge from '../components/RiskBadge'

const FACTOR_ICONS = {
  paymentHistory: 'update',
  dsr: 'account_balance_wallet',
  creditAge: 'history',
  employment: 'work',
  incomeStability: 'trending_up',
}

const FACTOR_LABELS = {
  paymentHistory: 'ประวัติการชำระหนี้',
  dsr: 'ภาระหนี้ต่อรายได้ (DSR)',
  creditAge: 'อายุประวัติสินเชื่อ',
  employment: 'ประเภทการจ้างงาน',
  incomeStability: 'ความสม่ำเสมอของรายได้',
}

function ScoreGauge({ score }) {
  const min = 300, max = 850
  const pct = ((score - min) / (max - min)) * 100
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
        <text x="22" y="116" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Prompt,sans-serif">300</text>
        <text x="178" y="116" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="Prompt,sans-serif">850</text>
      </svg>
    </div>
  )
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { currentResult, saveResult } = useApp()
  const [saved, setSaved] = useState(false)

  if (!currentResult) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#e2e8f0' }}>analytics</span>
          <p style={{ color: '#64748b' }}>ยังไม่มีผลการประเมิน กรุณากรอกข้อมูลก่อน</p>
          <button onClick={() => navigate('/new-assessment')} style={{
            padding: '10px 24px', borderRadius: 10, border: 'none',
            background: 'linear-gradient(135deg,#004ac6,#2563eb)', color: '#fff',
            fontFamily: 'Prompt,sans-serif', cursor: 'pointer',
          }}>ประเมินใหม่</button>
        </div>
      </div>
    )
  }

  const { score, riskLevel, riskLabel, recommendation, breakdown, factors, dsr, formData } = currentResult

  function handleSave() {
    saveResult(currentResult)
    setSaved(true)
    setTimeout(() => navigate('/history'), 1200)
  }

  const cardStyle = { background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 8px rgba(15,23,42,0.04)', border: '1px solid rgba(195,198,215,0.2)' }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar breadcrumbs={[{ label: 'ประเมินใหม่', path: '/new-assessment' }, { label: 'ผลการประเมิน' }]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>

            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Score Hero Card */}
              <div style={{
                ...cardStyle, position: 'relative', overflow: 'hidden',
                borderLeft: `4px solid ${riskLevel === 'low' ? '#006329' : riskLevel === 'medium' ? '#4059aa' : '#ba1a1a'}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>ผลการประเมินความเสี่ยง</h2>
                  <RiskBadge level={riskLevel} label={riskLabel} size="lg" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                  <ScoreGauge score={score} />
                  <div style={{ flex: 1 }}>
                    <div style={{ background: '#f0f4f8', borderRadius: 14, padding: 20, borderLeft: `3px solid ${riskLevel === 'high' ? '#ba1a1a' : riskLevel === 'medium' ? '#4059aa' : '#006329'}` }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b', margin: 0, marginBottom: 6 }}>คำแนะนำหลัก</p>
                      <p style={{ fontSize: 15, color: '#171c1f', margin: 0, lineHeight: 1.6 }}>{recommendation}</p>
                    </div>
                    {dsr !== undefined && (
                      <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>DSR</p>
                          <p style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 0', color: dsr > 50 ? '#ba1a1a' : dsr > 35 ? '#4059aa' : '#006329' }}>{dsr}%</p>
                        </div>
                        <div style={{ flex: 1, background: '#f8fafc', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                          <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>คะแนน</p>
                          <p style={{ fontSize: 20, fontWeight: 700, margin: '4px 0 0', color: currentResult.riskColor }}>{score}/850</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Breakdown */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>รายละเอียดคะแนนแต่ละปัจจัย</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {Object.entries(breakdown).map(([key, b]) => {
                    const pct = Math.max(0, Math.min(100, b.pct))
                    const barColor = pct >= 60 ? '#006329' : pct >= 35 ? '#4059aa' : '#ba1a1a'
                    return (
                      <div key={key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>{FACTOR_ICONS[key]}</span>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{b.label}</span>
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 600, color: barColor }}>{pct}%</span>
                        </div>
                        <div style={{ height: 8, borderRadius: 4, background: '#f1f5f9' }}>
                          <div style={{ height: '100%', borderRadius: 4, width: `${pct}%`, background: barColor, transition: 'width 0.8s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Top Risk Factors */}
              <div style={cardStyle}>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>ปัจจัยที่ส่งผลมากที่สุด (Top 3)</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
                  {factors.map((f, i) => {
                    const bg = f.impact === 'positive' ? '#f0fdf4' : f.impact === 'negative' ? '#fff1f1' : '#f8fafc'
                    const col = f.impact === 'positive' ? '#006329' : f.impact === 'negative' ? '#ba1a1a' : '#4059aa'
                    const icon = f.impact === 'positive' ? 'thumb_up' : f.impact === 'negative' ? 'thumb_down' : 'remove'
                    return (
                      <div key={f.id} style={{ background: bg, borderRadius: 14, padding: 16, border: `1px solid ${col}20` }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `${col}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                          <span className="material-symbols-outlined icon-fill" style={{ fontSize: 18, color: col }}>{icon}</span>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#171c1f', margin: 0 }}>{FACTOR_LABELS[f.id] || f.label}</p>
                        <p style={{ fontSize: 11, color: col, margin: '4px 0 0', fontWeight: 500 }}>
                          {f.impact === 'positive' ? 'ส่งเสริมคะแนน' : f.impact === 'negative' ? 'ลดคะแนน' : 'ผลกระทบน้อย'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={cardStyle}>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(195,198,215,0.3)' }}>ข้อมูลผู้ขอสินเชื่อ</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  {[
                    { icon: 'person', label: 'ชื่อ', value: formData.fullName || '-' },
                    { icon: 'cake', label: 'อายุ', value: formData.age ? `${formData.age} ปี` : '-' },
                    { icon: 'payments', label: 'รายได้/เดือน', value: formData.monthlyIncome ? `฿${Number(formData.monthlyIncome).toLocaleString()}` : '-' },
                    { icon: 'credit_card', label: 'ภาระหนี้/เดือน', value: formData.monthlyDebt ? `฿${Number(formData.monthlyDebt).toLocaleString()}` : '-', danger: true },
                    { icon: 'location_on', label: 'จังหวัด', value: formData.province || '-' },
                    { icon: 'work', label: 'ประเภทงาน', value: formData.employmentType || '-' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 20, color: '#64748b' }}>{item.icon}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{item.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, margin: '2px 0 0', color: item.danger ? '#ba1a1a' : '#171c1f' }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button onClick={handleSave} disabled={saved} style={{
                  padding: '13px', borderRadius: 12, border: 'none',
                  background: saved ? '#94a3b8' : 'linear-gradient(135deg,#004ac6,#2563eb)',
                  color: '#fff', fontWeight: 600, fontSize: 15, cursor: saved ? 'default' : 'pointer',
                  fontFamily: 'Prompt,sans-serif', transition: 'all 0.2s',
                }}>
                  {saved ? '✓ บันทึกแล้ว กำลังไปหน้าประวัติ...' : 'บันทึกผลการประเมิน'}
                </button>
                <button onClick={() => navigate('/new-assessment')} style={{
                  padding: '13px', borderRadius: 12, border: '1px solid rgba(195,198,215,0.5)',
                  background: '#fff', color: '#171c1f', fontWeight: 500, fontSize: 14,
                  cursor: 'pointer', fontFamily: 'Prompt,sans-serif',
                }}>แก้ไขข้อมูล / ประเมินใหม่</button>
                <button onClick={() => navigate('/history')} style={{
                  padding: '10px', borderRadius: 12, border: 'none',
                  background: 'none', color: '#004ac6', fontSize: 14, cursor: 'pointer',
                  fontFamily: 'Prompt,sans-serif',
                }}>ดูประวัติการประเมิน</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../../context/AppContext'
import Sidebar from '../../../components/layout/Sidebar'
import TopBar from '../../../components/layout/TopBar'
import RiskBadge from '../../../components/ui/RiskBadge'
import ScoreGauge from '../../../components/ui/ScoreGauge'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { formatCurrency } from '../../../utils/formatters'

const FACTOR_ICONS = {
  paymentHistory: 'update',
  dsr: 'account_balance_wallet',
  creditAge: 'history',
  employment: 'work',
  incomeStability: 'trending_up',
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
          <Button onClick={() => navigate('/new-assessment')}>ประเมินใหม่</Button>
        </div>
      </div>
    )
  }

  const { score, riskLevel, riskLabel, recommendation, breakdown, factors, dsr, formData } = currentResult

  const handleSave = () => {
    saveResult(currentResult)
    setSaved(true)
    setTimeout(() => navigate('/history'), 1200)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar breadcrumbs={[{ label: 'ประเมินใหม่', path: '/new-assessment' }, { label: 'ผลการประเมิน' }]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Score Hero */}
              <Card style={{ borderLeft: `8px solid ${currentResult.riskColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>สรุปผลการประเมิน</h2>
                  <RiskBadge level={riskLevel} label={riskLabel} size="lg" />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                  <ScoreGauge score={score} />
                  <div style={{ flex: 1, background: '#f8fafc', padding: 20, borderRadius: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>คำแนะนำ</p>
                    <p style={{ fontSize: 15, lineHeight: 1.6 }}>{recommendation}</p>
                  </div>
                </div>
              </Card>

              {/* Breakdown */}
              <Card>
                <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20 }}>น้ำหนักปัจจัยเชิงลึก</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {Object.entries(breakdown).map(([key, b]) => (
                    <div key={key}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#64748b' }}>{FACTOR_ICONS[key]}</span>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{b.label}</span>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{b.pct}%</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: '#f1f5f9' }}>
                        <div style={{ height: '100%', borderRadius: 4, width: `${b.pct}%`, background: b.pct > 60 ? '#006329' : '#4059aa' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <Card>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, borderBottom: '1px solid #edf2f7', paddingBottom: 16 }}>สรุปข้อมูลผู้ขอ</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { icon: 'person', label: 'ชื่อ', value: formData.fullName },
                    { icon: 'payments', label: 'รายได้', value: formatCurrency(formData.monthlyIncome) },
                    { icon: 'credit_card', label: 'หนี้สิน', value: formatCurrency(formData.monthlyDebt) },
                    { icon: 'calculate', label: 'DSR', value: `${dsr}%` },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', gap: 14 }}>
                      <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: 20 }}>{item.icon}</span>
                      <div>
                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{item.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Button onClick={handleSave} disabled={saved} fullWidth>
                  {saved ? 'บันทึกสำเร็จ...' : 'บันทึกข้อมูล'}
                </Button>
                <Button onClick={() => navigate('/new-assessment')} variant="secondary" fullWidth>แก้ไขข้อมูล</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

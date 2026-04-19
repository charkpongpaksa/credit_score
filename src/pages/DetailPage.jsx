import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import RiskBadge from '../components/RiskBadge'
import { EMPLOYMENT_OPTIONS, INCOME_STABILITY_OPTIONS, PAYMENT_HISTORY_OPTIONS } from '../engine/creditScoring'

function getLabel(options, value) {
  return options.find(o => o.value === value)?.label || value || '-'
}

export default function DetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { history } = useApp()

  const record = history.find(h => h.id === id)

  if (!record) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 64, color: '#e2e8f0' }}>find_in_page</span>
          <p style={{ color: '#64748b' }}>ไม่พบรายการที่ต้องการ</p>
          <button onClick={() => navigate('/history')} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#004ac6', color: '#fff', fontFamily: 'Prompt,sans-serif', cursor: 'pointer' }}>กลับไปประวัติ</button>
        </div>
      </div>
    )
  }

  const { formData = {} } = record
  const cardStyle = { background: '#fff', borderRadius: 20, padding: 28, boxShadow: '0 2px 8px rgba(15,23,42,0.04)', border: '1px solid rgba(195,198,215,0.2)' }
  const color = record.riskLevel === 'low' ? '#006329' : record.riskLevel === 'high' ? '#ba1a1a' : '#4059aa'
  const scoreBg = record.riskLevel === 'low' ? '#f0fdf4' : record.riskLevel === 'high' ? '#fff1f1' : '#f0f4ff'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar breadcrumbs={[
          { label: 'ประวัติการประเมิน', path: '/history' },
          { label: record.id },
        ]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                  <span>{record.id}</span>
                  <span>•</span>
                  <span>{record.date}</span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>{record.name}</h1>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => navigate('/history')} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                  borderRadius: 10, border: '1px solid rgba(195,198,215,0.5)',
                  background: '#fff', color: '#171c1f', fontSize: 14,
                  cursor: 'pointer', fontFamily: 'Prompt,sans-serif',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                  กลับไปประวัติ
                </button>
                <button onClick={() => navigate('/new-assessment')} style={{
                  display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px',
                  borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg,#004ac6,#2563eb)', color: '#fff',
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'Prompt,sans-serif',
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
                  ประเมินใหม่อีกครั้ง
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
              {/* Left */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {/* Customer Info */}
                <div style={cardStyle}>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: '#004ac6', fontSize: 22 }}>person</span>
                    ข้อมูลลูกค้า
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 32px' }}>
                    {[
                      { label: 'ชื่อ / บริษัท', value: formData.fullName || record.name },
                      { label: 'อายุ', value: formData.age ? `${formData.age} ปี` : '-' },
                      { label: 'จังหวัด', value: formData.province || '-' },
                      { label: 'ประเภทการจ้างงาน', value: getLabel(EMPLOYMENT_OPTIONS, formData.employmentType) },
                      { label: 'อาชีพ / ตำแหน่ง', value: formData.occupation || '-' },
                      { label: 'อายุงาน', value: formData.jobYears ? `${formData.jobYears} ปี` : '-' },
                    ].map(item => (
                      <div key={item.label}>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{item.label}</p>
                        <p style={{ fontSize: 14, fontWeight: 500, margin: '4px 0 0' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial Info */}
                <div style={cardStyle}>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: '#004ac6', fontSize: 22 }}>account_balance</span>
                    ข้อมูลทางการเงิน
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div style={{ background: '#f0f4f8', borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>รายได้ต่อเดือน</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#004ac6', margin: '6px 0 0' }}>
                        ฿{formData.monthlyIncome ? Number(formData.monthlyIncome).toLocaleString() : '-'}
                      </p>
                    </div>
                    <div style={{ background: '#f0f4f8', borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>ภาระหนี้ต่อเดือน</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#4059aa', margin: '6px 0 0' }}>
                        ฿{formData.monthlyDebt ? Number(formData.monthlyDebt).toLocaleString() : '-'}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                    {[
                      { label: 'DSR (Debt Service Ratio)', value: record.dsr !== undefined ? `${record.dsr}%` : '-' },
                      { label: 'วงเงินที่ขอสินเชื่อ', value: formData.loanAmount ? `฿${Number(formData.loanAmount).toLocaleString()}` : '-' },
                      { label: 'ระยะเวลาผ่อนชำระ', value: formData.loanTerm ? `${formData.loanTerm} เดือน` : '-' },
                      { label: 'อายุประวัติสินเชื่อ', value: formData.creditHistoryYears ? `${formData.creditHistoryYears} ปี` : '-' },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '10px 0', borderBottom: '1px solid rgba(195,198,215,0.2)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Behavior */}
                <div style={cardStyle}>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: '#004ac6', fontSize: 22 }}>update</span>
                    พฤติกรรมการชำระ
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 32px' }}>
                    {[
                      { label: 'ประวัติการชำระ', value: getLabel(PAYMENT_HISTORY_OPTIONS, formData.paymentHistory) },
                      { label: 'ความสม่ำเสมอรายได้', value: getLabel(INCOME_STABILITY_OPTIONS, formData.incomeStability) },
                      { label: 'ประวัติผิดนัด/NPL', value: formData.hasDefault === 'yes' ? 'มีประวัติ' : 'ไม่มีประวัติ' },
                      { label: 'จำนวนครั้งล่าช้า', value: formData.numLatePayments ? `${formData.numLatePayments} ครั้ง` : '-' },
                    ].map(item => (
                      <div key={item.label} style={{ padding: '10px 0', borderBottom: '1px solid rgba(195,198,215,0.2)', display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 13, color: '#64748b' }}>{item.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Score Card */}
                <div style={{ ...cardStyle, textAlign: 'center', borderTop: `4px solid ${color}`, background: scoreBg }}>
                  <div style={{ width: 64, height: 64, borderRadius: '50%', background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <span className="material-symbols-outlined icon-fill" style={{ fontSize: 32, color }}>
                      {record.riskLevel === 'low' ? 'check_circle' : record.riskLevel === 'high' ? 'error' : 'warning'}
                    </span>
                  </div>
                  <p style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>Credit Score</p>
                  <p style={{ fontSize: 52, fontWeight: 700, color, margin: '8px 0 4px' }}>{record.score}</p>
                  <div style={{ marginBottom: 16 }}>
                    <RiskBadge level={record.riskLevel} label={record.riskLabel} size="lg" />
                  </div>
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, textAlign: 'left' }}>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, marginBottom: 6 }}>ข้อแนะนำเบื้องต้น</p>
                    <p style={{ fontSize: 13, lineHeight: 1.6, margin: 0 }}>{record.recommendation}</p>
                  </div>
                </div>

                {/* ML Factor breakdown (if available) */}
                {record.breakdown && Object.keys(record.breakdown).length > 0 && (
                  <div style={cardStyle}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>คะแนนแต่ละปัจจัย</h3>
                    {Object.entries(record.breakdown).map(([key, b]) => {
                      const pct = Math.max(0, Math.min(100, b.pct))
                      const col = pct >= 60 ? '#006329' : pct >= 35 ? '#4059aa' : '#ba1a1a'
                      return (
                        <div key={key} style={{ marginBottom: 14 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 12, color: '#64748b' }}>{b.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 600, color: col }}>{pct}%</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 3, background: '#f1f5f9' }}>
                            <div style={{ height: '100%', borderRadius: 3, width: `${pct}%`, background: col }} />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

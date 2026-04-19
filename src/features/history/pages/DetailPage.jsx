import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../../../context/AppContext'
import Sidebar from '../../../components/layout/Sidebar'
import TopBar from '../../../components/layout/TopBar'
import RiskBadge from '../../../components/ui/RiskBadge'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { EMPLOYMENT_OPTIONS, INCOME_STABILITY_OPTIONS, PAYMENT_HISTORY_OPTIONS } from '../../../constants/common'
import { formatCurrency } from '../../../utils/formatters'

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
          <Button onClick={() => navigate('/history')}>กลับไปประวัติ</Button>
        </div>
      </div>
    )
  }

  const { formData = {} } = record
  const color = record.riskLevel === 'low' ? '#006329' : record.riskLevel === 'high' ? '#ba1a1a' : '#4059aa'

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar breadcrumbs={[{ label: 'ประวัติการประเมิน', path: '/history' }, { label: record.id }]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28 }}>
              <div>
                <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>{record.id} • {record.date}</p>
                <h1 style={{ fontSize: 28, fontWeight: 600, margin: 0 }}>{record.name}</h1>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Button onClick={() => navigate('/history')} variant="secondary" icon="arrow_back">กลับไปประวัติ</Button>
                <Button onClick={() => navigate('/new-assessment')} icon="refresh">ประเมินใหม่อีกครั้ง</Button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Card>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: '#004ac6' }}>person</span>
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
                </Card>

                <Card>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="material-symbols-outlined" style={{ color: '#004ac6' }}>account_balance</span>
                    ข้อมูลทางการเงิน
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                    <div style={{ background: '#f0f4f8', borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>รายได้ต่อเดือน</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#004ac6', margin: '6px 0 0' }}>
                        {formatCurrency(formData.monthlyIncome)}
                      </p>
                    </div>
                    <div style={{ background: '#f0f4f8', borderRadius: 14, padding: 18 }}>
                      <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>ภาระหนี้ต่อเดือน</p>
                      <p style={{ fontSize: 22, fontWeight: 700, color: '#4059aa', margin: '6px 0 0' }}>
                        {formatCurrency(formData.monthlyDebt)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <Card style={{ textAlign: 'center', borderTop: `4px solid ${color}`, background: record.riskLevel === 'low' ? '#f0fdf4' : '#fff1f1' }}>
                  <p style={{ fontSize: 12, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 }}>Credit Score</p>
                  <p style={{ fontSize: 52, fontWeight: 700, color, margin: '8px 0' }}>{record.score}</p>
                  <RiskBadge level={record.riskLevel} label={record.riskLabel} size="lg" />
                  <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 20, textAlign: 'left' }}>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginBottom: 6 }}>ข้อแนะนำเบื้องต้น</p>
                    <p style={{ fontSize: 13, lineHeight: 1.6 }}>{record.recommendation}</p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

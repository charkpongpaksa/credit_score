import { useNavigate } from 'react-router-dom'
import Sidebar from '../../../components/layout/Sidebar'
import TopBar from '../../../components/layout/TopBar'
import { useApp } from '../../../context/AppContext'
import Button from '../../../components/ui/Button'
import Card from '../../../components/ui/Card'
import { Field, Input, Select } from '../../../components/ui/FormElements'
import { useAssessmentForm } from '../hooks/useAssessmentForm'
import { EMPLOYMENT_OPTIONS, INCOME_STABILITY_OPTIONS, PAYMENT_HISTORY_OPTIONS, PROVINCE_LIST } from '../../../constants/common'
import { calculateDSR } from '../../../utils/formatters'

const STEPS = ['ข้อมูลส่วนตัว', 'อาชีพและรายได้', 'ภาระหนี้', 'พฤติกรรมการชำระ']

export default function NewAssessmentPage() {
  const navigate = useNavigate()
  const { setCurrentResult } = useApp()
  const {
    step, form, errors,
    updateField, handleNext, handlePrev, handleReset, getResult
  } = useAssessmentForm()

  const onCalculate = () => {
    const res = getResult()
    if (res) {
      setCurrentResult({ ...res, formData: form })
      navigate('/result')
    }
  }

  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก', path: '/dashboard' }, { label: 'ประเมินความเสี่ยงใหม่' }]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', paddingBottom: 120 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>ฟอร์มประเมินความเสี่ยง</h2>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>กรุณากรอกข้อมูลให้ครบถ้วนเพื่อผลการประเมินที่แม่นยำ</p>

            {/* Progress Stepper */}
            <Card style={{ marginBottom: 24 }} padding={32}>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', height: 2, background: '#e2e8f0', zIndex: 0, marginTop: -10 }} />
                <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', height: 2, background: '#004ac6', zIndex: 0, marginTop: -10, width: `${(step / 3) * 100}%`, transition: 'width 0.4s' }} />
                {STEPS.map((s, i) => (
                  <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', background: i <= step ? '#004ac6' : '#e2e8f0', color: i <= step ? '#fff' : '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, boxShadow: i === step ? '0 0 0 4px rgba(0,74,198,0.15)' : 'none'
                    }}>
                      {i < step ? <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check</span> : i + 1}
                    </div>
                    <span style={{ fontSize: 12, color: i <= step ? '#004ac6' : '#94a3b8', fontWeight: i === step ? 600 : 400 }}>{s}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Form Section */}
            <Card padding={32}>
              {step === 0 && (
                <div style={gridStyle} className="fade-in">
                  <div style={{ gridColumn: '1 / -1' }}>
                    <Field label="ชื่อ - นามสกุล / ชื่อบริษัท *" error={errors.fullName}>
                      <Input placeholder="ระบุชื่อและนามสกุล หรือชื่อบริษัท" value={form.fullName} onChange={e => updateField('fullName', e.target.value)} />
                    </Field>
                  </div>
                  <Field label="อายุ (ปี)">
                    <Input type="number" placeholder="ระบุอายุ" value={form.age} onChange={e => updateField('age', e.target.value)} />
                  </Field>
                  <Field label="จังหวัด *" error={errors.province}>
                    <Select options={PROVINCE_LIST} placeholder="เลือกจังหวัด" value={form.province} onChange={e => updateField('province', e.target.value)} />
                  </Field>
                </div>
              )}

              {step === 1 && (
                <div style={gridStyle} className="fade-in">
                  <Field label="ประเภทการจ้างงาน *" error={errors.employmentType}>
                    <Select options={EMPLOYMENT_OPTIONS} placeholder="เลือกประเภท" value={form.employmentType} onChange={e => updateField('employmentType', e.target.value)} />
                  </Field>
                  <Field label="ความสม่ำเสมอของรายได้ *" error={errors.incomeStability}>
                    <Select options={INCOME_STABILITY_OPTIONS} placeholder="เลือกระดับ" value={form.incomeStability} onChange={e => updateField('incomeStability', e.target.value)} />
                  </Field>
                  <Field label="รายได้ต่อเดือน (บาท) *" error={errors.monthlyIncome}>
                    <Input type="number" prefix="฿" placeholder="0" value={form.monthlyIncome} onChange={e => updateField('monthlyIncome', e.target.value)} />
                  </Field>
                  <Field label="วงเงินสินเชื่อที่ขอ (บาท)">
                    <Input type="number" prefix="฿" placeholder="0" value={form.loanAmount} onChange={e => updateField('loanAmount', e.target.value)} />
                  </Field>
                </div>
              )}

              {step === 2 && (
                <div style={gridStyle} className="fade-in">
                  <Field label="ภาระหนี้รวมต่อเดือน (บาท) *" error={errors.monthlyDebt} hint="รวมผ่อนบ้าน รถ บัตรเครดิต ฯลฯ">
                    <Input type="number" prefix="฿" placeholder="0" value={form.monthlyDebt} onChange={e => updateField('monthlyDebt', e.target.value)} />
                  </Field>
                  <Field label="อายุประวัติสินเชื่อ (ปี) *" error={errors.creditHistoryYears} hint="ระยะเวลานับจากสัญญาสินเชื่อแรก">
                    <Input type="number" placeholder="เช่น 5" value={form.creditHistoryYears} onChange={e => updateField('creditHistoryYears', e.target.value)} />
                  </Field>
                  
                  {form.monthlyIncome && form.monthlyDebt && (
                    <div style={{ gridColumn: '1 / -1', background: '#f0f4f8', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="material-symbols-outlined" style={{ color: '#004ac6' }}>calculate</span>
                      <div>
                        <span style={{ fontSize: 13, color: '#64748b' }}>DSR (Debt Service Ratio) ปัจจุบัน: </span>
                        <span style={{ fontSize: 16, fontWeight: 700, color: calculateDSR(form.monthlyIncome, form.monthlyDebt) > 40 ? '#ba1a1a' : '#006329' }}>
                          {calculateDSR(form.monthlyIncome, form.monthlyDebt)}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 3 && (
                <div style={gridStyle} className="fade-in">
                  <Field label="ประวัติการชำระหนี้ *" error={errors.paymentHistory}>
                    <Select options={PAYMENT_HISTORY_OPTIONS} placeholder="เลือกพฤติกรรม" value={form.paymentHistory} onChange={e => updateField('paymentHistory', e.target.value)} />
                  </Field>
                  <Field label="มีประวัติผิดนัดชำระ / NPL">
                    <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                      {['yes', 'no'].map(v => (
                        <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                          <input type="radio" name="hasDefault" value={v} checked={form.hasDefault === v} onChange={e => updateField('hasDefault', e.target.value)} />
                          {v === 'yes' ? 'มีประวัติ' : 'ไม่มีประวัติ'}
                        </label>
                      ))}
                    </div>
                  </Field>
                </div>
              )}
            </Card>
          </div>
        </main>

        {/* Action Bar */}
        <div style={{
          position: 'fixed', bottom: 0, right: 0, width: 'calc(100% - 240px)',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(195,198,215,0.3)', padding: '16px 32px', zIndex: 50,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Button onClick={handleReset} variant="danger" icon="delete_sweep">ล้างข้อมูล</Button>
          <div style={{ display: 'flex', gap: 12 }}>
            {step > 0 && <Button onClick={handlePrev} variant="secondary">ย้อนกลับ</Button>}
            {step < 3 ? (
              <Button onClick={handleNext} icon="arrow_forward">ถัดไป</Button>
            ) : (
              <Button onClick={onCalculate} icon="calculate">คำนวณความเสี่ยง</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

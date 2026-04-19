import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import { useApp } from '../context/AppContext'
import { calculateCreditScore, PAYMENT_HISTORY_OPTIONS, EMPLOYMENT_OPTIONS, INCOME_STABILITY_OPTIONS, PROVINCE_LIST } from '../engine/creditScoring'

const STEPS = ['ข้อมูลส่วนตัว', 'อาชีพและรายได้', 'ภาระหนี้', 'พฤติกรรมการชำระ']
const STEP_ICONS = ['person', 'work', 'account_balance_wallet', 'update']

const INIT = {
  fullName: '', age: '', province: '', region: '',
  employmentType: '', occupation: '', companyName: '', jobYears: '',
  incomeStability: '', monthlyIncome: '', otherIncome: '',
  monthlyDebt: '', numCreditors: '', creditHistoryYears: '',
  loanAmount: '', loanTerm: '',
  paymentHistory: '', numLatePayments: '', hasDefault: 'no',
}

function Field({ label, children, hint }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#434655', marginBottom: 6 }}>{label}</label>
      {children}
      {hint && <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>{hint}</p>}
    </div>
  )
}

function SelectField({ label, name, value, onChange, options, placeholder, hint }) {
  return (
    <Field label={label} hint={hint}>
      <div style={{ position: 'relative' }}>
        <select value={value} onChange={e => onChange(name, e.target.value)} style={{ paddingRight: 36 }}>
          <option value="">{placeholder || 'เลือก...'}</option>
          {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
        </select>
        <span className="material-symbols-outlined" style={{
          position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
          fontSize: 18, color: '#64748b', pointerEvents: 'none',
        }}>expand_more</span>
      </div>
    </Field>
  )
}

function InputField({ label, name, value, onChange, type = 'text', placeholder, prefix, hint }) {
  return (
    <Field label={label} hint={hint}>
      <div style={{ position: 'relative' }}>
        {prefix && <span style={{
          position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
          fontSize: 14, color: '#64748b',
        }}>{prefix}</span>}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(name, e.target.value)}
          style={{ paddingLeft: prefix ? 32 : 16 }}
        />
      </div>
    </Field>
  )
}

export default function NewAssessmentPage() {
  const navigate = useNavigate()
  const { setCurrentResult } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})

  function set(name, value) { setForm(p => ({ ...p, [name]: value })); setErrors(p => ({ ...p, [name]: '' })) }

  function validate() {
    const e = {}
    if (step === 0) {
      if (!form.fullName) e.fullName = 'กรุณาระบุชื่อ'
      if (!form.province) e.province = 'กรุณาเลือกจังหวัด'
    }
    if (step === 1) {
      if (!form.employmentType) e.employmentType = 'กรุณาเลือกประเภทการจ้างงาน'
      if (!form.monthlyIncome) e.monthlyIncome = 'กรุณาระบุรายได้'
      if (!form.incomeStability) e.incomeStability = 'กรุณาเลือกความสม่ำเสมอของรายได้'
    }
    if (step === 2) {
      if (!form.creditHistoryYears) e.creditHistoryYears = 'กรุณาระบุอายุสินเชื่อ'
    }
    if (step === 3) {
      if (!form.paymentHistory) e.paymentHistory = 'กรุณาเลือกประวัติการชำระ'
      if (!form.loanAmount) e.loanAmount = 'กรุณาระบุวงเงินที่ขอ'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() { if (validate()) setStep(s => Math.min(3, s + 1)) }
  function prev() { setStep(s => Math.max(0, s - 1)) }

  function calculate() {
    if (!validate()) return
    const result = calculateCreditScore(form)
    setCurrentResult({ ...result, formData: form })
    navigate('/result')
  }

  const sectionStyle = { background: '#fff', borderRadius: 20, padding: 32, boxShadow: '0 2px 8px rgba(15,23,42,0.04)', border: '1px solid rgba(195,198,215,0.2)' }
  const gridStyle = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }
  const errStyle = { fontSize: 11, color: '#ba1a1a', marginTop: 4 }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก', path: '/dashboard' }, { label: 'ประเมินความเสี่ยงใหม่' }]} />
        <main style={{ flex: 1, overflowY: 'auto', padding: '32px', paddingBottom: 120 }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 4 }}>ฟอร์มประเมินความเสี่ยง</h2>
            <p style={{ color: '#64748b', marginBottom: 28, fontSize: 14 }}>กรุณากรอกข้อมูลให้ครบถ้วนเพื่อผลการประเมินที่แม่นยำ</p>

            {/* Progress */}
            <div style={sectionStyle}>
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div style={{
                  position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)',
                  height: 2, background: '#e2e8f0', zIndex: 0, marginTop: -10,
                }} />
                <div style={{
                  position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                  height: 2, background: '#004ac6', zIndex: 0, marginTop: -10,
                  width: `${(step / 3) * 100}%`, transition: 'width 0.4s',
                }} />
                {STEPS.map((s, i) => (
                  <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: i <= step ? '#004ac6' : '#e2e8f0',
                      color: i <= step ? '#fff' : '#94a3b8',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 600, fontSize: 14, transition: 'all 0.3s',
                      boxShadow: i === step ? '0 0 0 4px rgba(0,74,198,0.15)' : 'none',
                    }}>
                      {i < step ? <span className="material-symbols-outlined icon-fill" style={{ fontSize: 18 }}>check</span> : i + 1}
                    </div>
                    <span style={{ fontSize: 12, color: i <= step ? '#004ac6' : '#94a3b8', fontWeight: i === step ? 600 : 400, textAlign: 'center' }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              {/* Step 0 */}
              {step === 0 && (
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dbe1ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: '#004ac6', fontSize: 22 }}>person</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>1. ข้อมูลส่วนตัว</h3>
                  </div>
                  <div style={gridStyle}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <InputField label="ชื่อ - นามสกุล / ชื่อบริษัท *" name="fullName" value={form.fullName} onChange={set} placeholder="ระบุชื่อและนามสกุล หรือชื่อบริษัท" />
                      {errors.fullName && <p style={errStyle}>{errors.fullName}</p>}
                    </div>
                    <InputField label="อายุ (ปี)" name="age" value={form.age} onChange={set} type="number" placeholder="ระบุอายุ" />
                    <div>
                      <SelectField label="จังหวัด *" name="province" value={form.province} onChange={set} options={PROVINCE_LIST} placeholder="เลือกจังหวัด" />
                      {errors.province && <p style={errStyle}>{errors.province}</p>}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1 */}
              {step === 1 && (
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dbe1ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: '#004ac6', fontSize: 22 }}>work</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>2. อาชีพและรายได้</h3>
                  </div>
                  <div style={gridStyle}>
                    <div>
                      <SelectField label="ประเภทการจ้างงาน *" name="employmentType" value={form.employmentType} onChange={set} options={EMPLOYMENT_OPTIONS} placeholder="เลือกประเภท" />
                      {errors.employmentType && <p style={errStyle}>{errors.employmentType}</p>}
                    </div>
                    <InputField label="อาชีพ / ตำแหน่งงาน" name="occupation" value={form.occupation} onChange={set} placeholder="เช่น วิศวกร, ผู้จัดการ" />
                    <InputField label="ชื่อบริษัท / หน่วยงาน" name="companyName" value={form.companyName} onChange={set} placeholder="ระบุชื่อบริษัท" />
                    <InputField label="อายุงาน (ปี)" name="jobYears" value={form.jobYears} onChange={set} type="number" placeholder="เช่น 3.5" />
                    <div>
                      <SelectField label="ความสม่ำเสมอของรายได้ *" name="incomeStability" value={form.incomeStability} onChange={set} options={INCOME_STABILITY_OPTIONS} placeholder="เลือกระดับ" />
                      {errors.incomeStability && <p style={errStyle}>{errors.incomeStability}</p>}
                    </div>
                    <div>
                      <InputField label="รายได้ต่อเดือน (บาท) *" name="monthlyIncome" value={form.monthlyIncome} onChange={set} type="number" prefix="฿" placeholder="0" />
                      {errors.monthlyIncome && <p style={errStyle}>{errors.monthlyIncome}</p>}
                    </div>
                    <InputField label="รายได้อื่น ๆ ต่อเดือน (ถ้ามี)" name="otherIncome" value={form.otherIncome} onChange={set} type="number" prefix="฿" placeholder="0" hint="รายได้จากค่าเช่า, เงินปันผล ฯลฯ" />
                    <InputField label="วงเงินสินเชื่อที่ขอ (บาท)" name="loanAmount" value={form.loanAmount} onChange={set} type="number" prefix="฿" placeholder="0" />
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dbe1ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: '#004ac6', fontSize: 22 }}>account_balance_wallet</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>3. ภาระหนี้</h3>
                  </div>
                  <div style={gridStyle}>
                    <div>
                      <InputField label="ภาระหนี้รวมต่อเดือน (บาท) *" name="monthlyDebt" value={form.monthlyDebt} onChange={set} type="number" prefix="฿" placeholder="0" hint="รวมผ่อนบ้าน รถ บัตรเครดิต ฯลฯ" />
                      {errors.monthlyDebt && <p style={errStyle}>{errors.monthlyDebt}</p>}
                    </div>
                    <InputField label="จำนวนเจ้าหนี้" name="numCreditors" value={form.numCreditors} onChange={set} type="number" placeholder="เช่น 3" />
                    <div>
                      <InputField label="อายุประวัติสินเชื่อ (ปี) *" name="creditHistoryYears" value={form.creditHistoryYears} onChange={set} type="number" placeholder="เช่น 5" hint="ระยะเวลานับจากสัญญาสินเชื่อแรก" />
                      {errors.creditHistoryYears && <p style={errStyle}>{errors.creditHistoryYears}</p>}
                    </div>
                    <InputField label="ระยะเวลาผ่อนชำระที่ขอ (เดือน)" name="loanTerm" value={form.loanTerm} onChange={set} type="number" placeholder="เช่น 60" />
                    {/* DSR Preview */}
                    {form.monthlyIncome && form.monthlyDebt && (
                      <div style={{ gridColumn: '1 / -1', background: '#f0f4f8', borderRadius: 12, padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span className="material-symbols-outlined icon-fill" style={{ color: '#004ac6', fontSize: 24 }}>calculate</span>
                        <div>
                          <span style={{ fontSize: 13, color: '#64748b' }}>DSR (Debt Service Ratio) ปัจจุบัน: </span>
                          <span style={{
                            fontSize: 16, fontWeight: 700,
                            color: (parseFloat(form.monthlyDebt) / parseFloat(form.monthlyIncome)) > 0.5 ? '#ba1a1a' : '#006329',
                          }}>
                            {Math.round((parseFloat(form.monthlyDebt) / parseFloat(form.monthlyIncome)) * 100)}%
                          </span>
                          <span style={{ fontSize: 12, color: '#94a3b8', marginLeft: 8 }}>(แนะนำไม่เกิน 40%)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div style={sectionStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#dbe1ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: '#004ac6', fontSize: 22 }}>update</span>
                    </div>
                    <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>4. พฤติกรรมการชำระ</h3>
                  </div>
                  <div style={gridStyle}>
                    <div>
                      <SelectField label="ประวัติการชำระหนี้ *" name="paymentHistory" value={form.paymentHistory} onChange={set} options={PAYMENT_HISTORY_OPTIONS} placeholder="เลือกพฤติกรรม" />
                      {errors.paymentHistory && <p style={errStyle}>{errors.paymentHistory}</p>}
                    </div>
                    <InputField label="จำนวนครั้งที่ชำระล่าช้า (ปีที่ผ่านมา)" name="numLatePayments" value={form.numLatePayments} onChange={set} type="number" placeholder="เช่น 2" />
                    <div>
                      <Field label="มีประวัติผิดนัดชำระ / NPL">
                        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                          {['yes', 'no'].map(v => (
                            <label key={v} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                              <input type="radio" name="hasDefault" value={v} checked={form.hasDefault === v} onChange={e => set('hasDefault', e.target.value)}
                                style={{ width: 'auto', cursor: 'pointer' }} />
                              {v === 'yes' ? 'มีประวัติ' : 'ไม่มีประวัติ'}
                            </label>
                          ))}
                        </div>
                      </Field>
                    </div>
                    {form.loanAmount && form.monthlyIncome && (
                      <div style={{ gridColumn: '1 / -1', background: '#f0f4f8', borderRadius: 12, padding: 16 }}>
                        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>สรุปข้อมูลที่กรอก:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 10 }}>
                          {[
                            { label: 'วงเงินที่ขอ', value: `฿${Number(form.loanAmount).toLocaleString()}` },
                            { label: 'รายได้/เดือน', value: `฿${Number(form.monthlyIncome).toLocaleString()}` },
                            { label: 'ภาระหนี้/เดือน', value: `฿${Number(form.monthlyDebt || 0).toLocaleString()}` },
                          ].map(item => (
                            <div key={item.label} style={{ background: '#fff', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                              <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{item.label}</p>
                              <p style={{ fontSize: 15, fontWeight: 600, margin: '4px 0 0' }}>{item.value}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Sticky Action Bar */}
        <div style={{
          position: 'fixed', bottom: 0, right: 0,
          width: 'calc(100% - 240px)',
          background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(195,198,215,0.3)',
          padding: '16px 32px', zIndex: 50,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <button onClick={() => setForm(INIT)} style={{
            background: 'none', border: 'none', color: '#ba1a1a', fontSize: 14,
            cursor: 'pointer', fontFamily: 'Prompt, sans-serif', fontWeight: 500,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 4 }}>delete_sweep</span>
            ล้างข้อมูล
          </button>
          <div style={{ display: 'flex', gap: 12 }}>
            {step > 0 && (
              <button onClick={prev} style={{
                padding: '10px 24px', borderRadius: 10, border: '1px solid rgba(195,198,215,0.5)',
                background: '#fff', color: '#171c1f', fontSize: 14, cursor: 'pointer',
                fontFamily: 'Prompt, sans-serif',
              }}>
                ย้อนกลับ
              </button>
            )}
            {step < 3 ? (
              <button onClick={next} style={{
                padding: '10px 28px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#004ac6,#2563eb)',
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Prompt, sans-serif',
              }}>
                ถัดไป <span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle' }}>arrow_forward</span>
              </button>
            ) : (
              <button onClick={calculate} style={{
                padding: '10px 32px', borderRadius: 10, border: 'none',
                background: 'linear-gradient(135deg,#004ac6,#2563eb)',
                color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Prompt, sans-serif',
                boxShadow: '0 4px 16px rgba(0,74,198,0.25)',
              }}>
                <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6 }}>calculate</span>
                คำนวณความเสี่ยง
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

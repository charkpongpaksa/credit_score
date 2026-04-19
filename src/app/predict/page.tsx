'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/FormElements'
import { predictService } from '@/services/prediction'
import { PredictResponse } from '@/types/prediction'
import ScoreGauge from '@/components/ui/ScoreGauge'
import RiskBadge from '@/components/ui/RiskBadge'
import { DEFAULT_PAYLOAD, OPTIONS } from '@/constants/assessmentFields'

export default function PredictPage() {
  const [form, setForm] = useState(DEFAULT_PAYLOAD)
  const [threshold, setThreshold] = useState(0.5)
  const [result, setResult] = useState<PredictResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handlePredict = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await predictService({ payload: form, threshold })
      setResult(res)
      // Scroll to result on small screens
      if (window.innerWidth < 1024) {
        document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (err: any) {
      setError(err.message || 'การคำนวณล้มเหลว กรุณาตรวจสอบข้อมูลอีกครั้ง')
    } finally {
      setLoading(false)
    }
  }

  const loadDemo = () => {
    setForm(DEFAULT_PAYLOAD)
    setResult(null)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'หน้าหลัก', path: '/dashboard' }, { label: 'เครดิตโมเดล' }]} />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1200px] mx-auto space-y-8">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 leading-tight">AI Credit Prediction</h2>
                <p className="text-slate-500 mt-1.5 text-[15px]">ประเมินความเสี่ยงด้วยชุดข้อมูล 44 ตัวแปรมาตรฐาน</p>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" icon="restart_alt" onClick={() => setForm(DEFAULT_PAYLOAD)}>รีเซ็ต</Button>
                <Button variant="ghost" icon="auto_fix_high" onClick={loadDemo}>โหลดข้อมูลตัวอย่าง</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form Section */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8">
                  <div className="space-y-10">
                    {/* Section 1: Personal & Basics */}
                    <section>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-3">
                        <span className="material-symbols-outlined text-brand">person</span>
                        ข้อมูลส่วนบุคคลและพื้นฐาน
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="รหัสลูกค้า (SK_ID_CURR)">
                          <Input type="number" value={form.SK_ID_CURR} onChange={e => handleChange('SK_ID_CURR', parseInt(e.target.value))} />
                        </Field>
                        <Field label="ประเภทสินเชื่อ">
                          <Select options={OPTIONS.CONTRACT_TYPE} value={form.NAME_CONTRACT_TYPE} onChange={e => handleChange('NAME_CONTRACT_TYPE', e.target.value)} />
                        </Field>
                        <Field label="เพศ">
                          <Select options={OPTIONS.GENDER} value={form.CODE_GENDER} onChange={e => handleChange('CODE_GENDER', e.target.value)} />
                        </Field>
                        <Field label="ระดับการศึกษา">
                          <Select options={OPTIONS.EDUCATION_TYPE} value={form.NAME_EDUCATION_TYPE} onChange={e => handleChange('NAME_EDUCATION_TYPE', e.target.value)} />
                        </Field>
                        <Field label="สถานภาพครอบครัว">
                          <Select options={OPTIONS.FAMILY_STATUS} value={form.NAME_FAMILY_STATUS} onChange={e => handleChange('NAME_FAMILY_STATUS', e.target.value)} />
                        </Field>
                        <Field label="จำนวนสมาชิกครอบครัว">
                          <Input type="number" value={form.CNT_FAM_MEMBERS} onChange={e => handleChange('CNT_FAM_MEMBERS', parseInt(e.target.value))} />
                        </Field>
                        <Field label="จำนวนบุตร">
                          <Input type="number" value={form.CNT_CHILDREN} onChange={e => handleChange('CNT_CHILDREN', parseInt(e.target.value))} />
                        </Field>
                        <Field label="ประเภทที่อยู่อาศัย">
                          <Select options={OPTIONS.HOUSING_TYPE} value={form.NAME_HOUSING_TYPE} onChange={e => handleChange('NAME_HOUSING_TYPE', e.target.value)} />
                        </Field>
                      </div>
                    </section>

                    {/* Section 2: Financials */}
                    <section>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-3">
                        <span className="material-symbols-outlined text-brand">payments</span>
                        ข้อมูลทางการเงินและสินเชื่อ
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="รายได้รวมต่อปี (AMT_INCOME_TOTAL)">
                          <Input type="number" prefix="฿" value={form.AMT_INCOME_TOTAL} onChange={e => handleChange('AMT_INCOME_TOTAL', parseFloat(e.target.value))} />
                        </Field>
                        <Field label="วงเงินสินเชื่อที่ขอ (AMT_CREDIT)">
                          <Input type="number" prefix="฿" value={form.AMT_CREDIT} onChange={e => handleChange('AMT_CREDIT', parseFloat(e.target.value))} />
                        </Field>
                        <Field label="ค่างวดรายเดือน (AMT_ANNUITY)">
                          <Input type="number" prefix="฿" value={form.AMT_ANNUITY} onChange={e => handleChange('AMT_ANNUITY', parseFloat(e.target.value))} />
                        </Field>
                        <Field label="ราคาสินค้า (AMT_GOODS_PRICE)">
                          <Input type="number" prefix="฿" value={form.AMT_GOODS_PRICE} onChange={e => handleChange('AMT_GOODS_PRICE', parseFloat(e.target.value))} />
                        </Field>
                        <Field label="มีรถยนต์">
                          <Select options={OPTIONS.YES_NO} value={form.FLAG_OWN_CAR} onChange={e => handleChange('FLAG_OWN_CAR', e.target.value)} />
                        </Field>
                        <Field label="อายุรถ (ถ้ามี)">
                          <Input type="number" value={form.OWN_CAR_AGE} onChange={e => handleChange('OWN_CAR_AGE', parseInt(e.target.value))} />
                        </Field>
                        <Field label="มีอสังหาริมทรัพย์">
                          <Select options={OPTIONS.YES_NO} value={form.FLAG_OWN_REALTY} onChange={e => handleChange('FLAG_OWN_REALTY', e.target.value)} />
                        </Field>
                      </div>
                    </section>

                    {/* Section 3: Employment */}
                    <section>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-3">
                        <span className="material-symbols-outlined text-brand">work</span>
                        ข้อมูลอาชีพและองค์กร
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="ประเภทรายได้">
                          <Select options={OPTIONS.INCOME_TYPE} value={form.NAME_INCOME_TYPE} onChange={e => handleChange('NAME_INCOME_TYPE', e.target.value)} />
                        </Field>
                        <Field label="อาชีพ">
                          <Select options={OPTIONS.OCCUPATION_TYPE} value={form.OCCUPATION_TYPE} onChange={e => handleChange('OCCUPATION_TYPE', e.target.value)} />
                        </Field>
                        <Field label="ประเภทองค์กร">
                          <Select options={OPTIONS.ORGANIZATION_TYPE} value={form.ORGANIZATION_TYPE} onChange={e => handleChange('ORGANIZATION_TYPE', e.target.value)} />
                        </Field>
                        <Field label="อายุงาน (จำนวนวันติดลบ)">
                          <Input type="number" value={form.DAYS_EMPLOYED} onChange={e => handleChange('DAYS_EMPLOYED', parseInt(e.target.value))} />
                        </Field>
                      </div>
                    </section>

                    {/* Section 4: Contact & Demographics */}
                    <section>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-3">
                        <span className="material-symbols-outlined text-brand">contact_phone</span>
                        ข้อมูลประชากรและการติดต่อ
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Field label="สัดส่วนประชากรภูมิภาค (0-1)">
                          <Input type="number" step="0.0001" value={form.REGION_POPULATION_RELATIVE} onChange={e => handleChange('REGION_POPULATION_RELATIVE', parseFloat(e.target.value))} />
                        </Field>
                        <Field label="อายุ (จำนวนวันติดลบ)">
                          <Input type="number" value={form.DAYS_BIRTH} onChange={e => handleChange('DAYS_BIRTH', parseInt(e.target.value))} />
                        </Field>
                        <Field label="วันเปลี่ยนทะเบียนบ้าน (ติดลบ)">
                          <Input type="number" value={form.DAYS_REGISTRATION} onChange={e => handleChange('DAYS_REGISTRATION', parseInt(e.target.value))} />
                        </Field>
                        <Field label="วันเปลี่ยนเอกสาร (ติดลบ)">
                          <Input type="number" value={form.DAYS_ID_PUBLISH} onChange={e => handleChange('DAYS_ID_PUBLISH', parseInt(e.target.value))} />
                        </Field>
                        <Field label="วันเปลี่ยนเบอร์ล่าสุด (ติดลบ)">
                          <Input type="number" value={form.DAYS_LAST_PHONE_CHANGE} onChange={e => handleChange('DAYS_LAST_PHONE_CHANGE', parseInt(e.target.value))} />
                        </Field>
                        <Field label="ชั่วโมงที่ยื่นกู้ (0-23)">
                          <Input type="number" min="0" max="23" value={form.HOUR_APPR_PROCESS_START} onChange={e => handleChange('HOUR_APPR_PROCESS_START', parseInt(e.target.value))} />
                        </Field>
                        <Field label="วันในสัปดาห์ที่ยื่น">
                          <Select options={OPTIONS.WEEKDAY} value={form.WEEKDAY_APPR_PROCESS_START} onChange={e => handleChange('WEEKDAY_APPR_PROCESS_START', e.target.value)} />
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-slate-50 rounded-xl">
                        <Field label="มีมือถือ">
                          <Select options={OPTIONS.BOOLEAN_INT} value={form.FLAG_MOBIL} onChange={e => handleChange('FLAG_MOBIL', parseInt(e.target.value))} />
                        </Field>
                        <Field label="เบอร์ที่ทำงาน">
                          <Select options={OPTIONS.BOOLEAN_INT} value={form.FLAG_EMP_PHONE} onChange={e => handleChange('FLAG_EMP_PHONE', parseInt(e.target.value))} />
                        </Field>
                        <Field label="โทรศัพท์บ้าน">
                          <Select options={OPTIONS.BOOLEAN_INT} value={form.FLAG_WORK_PHONE} onChange={e => handleChange('FLAG_WORK_PHONE', parseInt(e.target.value))} />
                        </Field>
                        <Field label="อีเมล">
                          <Select options={OPTIONS.BOOLEAN_INT} value={form.FLAG_EMAIL} onChange={e => handleChange('FLAG_EMAIL', parseInt(e.target.value))} />
                        </Field>
                      </div>
                    </section>

                    {/* Section 5: Rating & Social Circle */}
                    <section>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-3">
                        <span className="material-symbols-outlined text-brand">groups</span>
                        คะแนนภูมิภาคและปัจจัยทางสังคม
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="เรตติ้งภูมิภาค">
                          <Select options={OPTIONS.RATING} value={form.REGION_RATING_CLIENT} onChange={e => handleChange('REGION_RATING_CLIENT', parseInt(e.target.value))} />
                        </Field>
                        <Field label="เรตติ้งภูมิภาค (รวมเมือง)">
                          <Select options={OPTIONS.RATING} value={form.REGION_RATING_CLIENT_W_CITY} onChange={e => handleChange('REGION_RATING_CLIENT_W_CITY', parseInt(e.target.value))} />
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        <Field label="เพื่อนบ้าน 30 วัน" hint="จำนวนคนรอบตัว">
                          <Input type="number" value={form.OBS_30_CNT_SOCIAL_CIRCLE} onChange={e => handleChange('OBS_30_CNT_SOCIAL_CIRCLE', parseInt(e.target.value))} />
                        </Field>
                        <Field label="หนี้เสีย 30 วัน" hint="คนรอบตัวที่ค้างชำระ">
                          <Input type="number" value={form.DEF_30_CNT_SOCIAL_CIRCLE} onChange={e => handleChange('DEF_30_CNT_SOCIAL_CIRCLE', parseInt(e.target.value))} />
                        </Field>
                        <Field label="เพื่อนบ้าน 60 วัน">
                          <Input type="number" value={form.OBS_60_CNT_SOCIAL_CIRCLE} onChange={e => handleChange('OBS_60_CNT_SOCIAL_CIRCLE', parseInt(e.target.value))} />
                        </Field>
                        <Field label="หนี้เสีย 60 วัน">
                          <Input type="number" value={form.DEF_60_CNT_SOCIAL_CIRCLE} onChange={e => handleChange('DEF_60_CNT_SOCIAL_CIRCLE', parseInt(e.target.value))} />
                        </Field>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                        <Field label="คำขอเครดิตบูโร (เดือน)">
                          <Input type="number" value={form.AMT_REQ_CREDIT_BUREAU_MON} onChange={e => handleChange('AMT_REQ_CREDIT_BUREAU_MON', parseInt(e.target.value))} />
                        </Field>
                        <Field label="คำขอเครดิตบูโร (ปีนี้)">
                          <Input type="number" value={form.AMT_REQ_CREDIT_BUREAU_YEAR} onChange={e => handleChange('AMT_REQ_CREDIT_BUREAU_YEAR', parseInt(e.target.value))} />
                        </Field>
                      </div>
                    </section>

                    {/* Section 6: External Ratings & Analysis */}
                    <section>
                      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b pb-3">
                        <span className="material-symbols-outlined text-brand">analytics</span>
                        ตัวแปรทางสถิติและคะแนนภายนอก
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <Field label="External Source 1 (0-1)" hint="ข้อมูลจากแหล่งภายอก 1">
                          <Input type="number" step="0.01" value={form.EXT_SOURCE_1} onChange={e => handleChange('EXT_SOURCE_1', parseFloat(e.target.value))} />
                        </Field>
                        <Field label="External Source 2 (0-1)" hint="ข้อมูลจากแหล่งภายอก 2">
                          <Input type="number" step="0.01" value={form.EXT_SOURCE_2} onChange={e => handleChange('EXT_SOURCE_2', parseFloat(e.target.value))} />
                        </Field>
                        <Field label="External Source 3 (0-1)" hint="ข้อมูลจากแหล่งภายอก 3">
                          <Input type="number" step="0.01" value={form.EXT_SOURCE_3} onChange={e => handleChange('EXT_SOURCE_3', parseFloat(e.target.value))} />
                        </Field>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                        <Field label={`Decision Threshold: ${threshold}`}>
                          <input 
                            type="range" min="0" max="1" step="0.05" className="w-full accent-brand"
                            value={threshold} onChange={e => setThreshold(parseFloat(e.target.value))}
                          />
                        </Field>
                        <div className="flex items-end">
                          <Button 
                            onClick={handlePredict} disabled={loading} fullWidth icon="rocket_launch" className="h-11"
                          >
                            {loading ? 'กำลังประมวลผล...' : 'วิเคราะห์เครดิตสกอร์'}
                          </Button>
                        </div>
                      </div>
                    </section>
                  </div>
                </Card>
              </div>

              {/* Result Section */}
              <div id="result-section" className="space-y-6">
                {result ? (
                  <Card className="p-8 border-t-8 border-brand flex flex-col items-center gap-6 animate-in slide-in-from-bottom-5 duration-700 sticky top-8">
                    <div className="text-center">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Model: {result.model_version}</p>
                      <h3 className="text-2xl font-black text-slate-900">ผลการวิเคราะห์</h3>
                    </div>

                    <ScoreGauge score={Math.round(result.predictions[0].default_probability * 1000)} />

                    <div className="w-full flex flex-col gap-4">
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-slate-500">ความน่าจะเป็นในการผิดนัด</span>
                          <span className="text-xl font-bold text-brand">{(result.predictions[0].default_probability * 100).toFixed(4)}%</span>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-500">ระดับความเสี่ยง (Band)</span>
                        <RiskBadge 
                          level={result.predictions[0].risk_band_en as 'low' | 'medium' | 'high'} 
                          label={result.predictions[0].risk_band} 
                          size="lg" 
                        />
                      </div>
                      <div className="bg-brand/5 p-6 rounded-2xl border border-brand/10 text-center">
                         <span className="material-symbols-outlined !text-[32px] text-brand mb-2">fact_check</span>
                         <p className="text-sm font-bold text-brand uppercase tracking-tight mb-1">{result.predictions[0].decision === 'Good' ? 'ผ่านเกณฑ์ (Below Threshold)' : 'ไม่ผ่านเกณฑ์ (Above Threshold)'}</p>
                         <p className="text-[12px] text-slate-500 italic">"{result.predictions[0].decision_en}"</p>
                      </div>
                    </div>

                    <Button variant="secondary" fullWidth icon="download" onClick={() => window.print()}>พิมพ์รายงาน</Button>
                  </Card>
                ) : (
                  <div className="h-[400px] flex flex-col items-center justify-center p-12 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 sticky top-8">
                    <span className="material-symbols-outlined !text-[80px] text-slate-200 mb-4">query_stats</span>
                    <h3 className="text-slate-400 font-bold">รอการวิเคราะห์</h3>
                    <p className="text-slate-400 text-xs mt-2 italic px-8">กรอกข้อมูลในฟอร์มด้านซ้ายมือให้ครบถ้วนเพื่อดูผลลัพธ์</p>
                  </div>
                )}
                
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 animate-in fade-in duration-300">
                    <span className="material-symbols-outlined text-red-500">error</span>
                    <p className="text-red-600 text-sm">{error}</p>
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


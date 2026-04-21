'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'
import TopBar from '@/components/layout/TopBar'
import Button from '@/components/ui/Button'
import { Field, Input, Select } from '@/components/ui/FormElements'
import {
  AssessmentCreatePayload,
  AssessmentEvaluationData,
  AssessmentFormOptions,
  Recommendation,
  RiskFactor,
  ScoreBreakdownItem,
} from '@/types/assessment'
import {
  calculateAssessmentPreview,
  createAssessment,
  getAssessmentDetail,
  getAssessmentFormOptions,
  submitAssessment,
} from '@/services/assessment'

// ─── Types ───────────────────────────────────────────────────────────────────
type ViewState = 'FORM' | 'RESULT'

type ComprehensiveForm = {
  title: string
  firstName: string
  lastName: string
  idCard: string
  phone: string
  email: string
  addressLine: string
  province: string
  district: string
  subDistrict: string
  postalCode: string
  employerName: string
  extraIncome: number
  existingLoanBalance: number
  monthlyDebtPayment: number
  debtInfos: Array<{
    debtType: string
    creditorName: string
    outstandingAmount: number
    monthlyPayment: number
    delinquentDays?: number
    isDefaulted?: boolean
  }>
  occupationCode: string
  employmentType: string
  loanPurposeCode: string
  provinceCode: string
  loanTermMonths: number

  // ML Required Fields
  "รหัสลูกค้า": number
  "ประเภทสินเชื่อ": string
  "เพศ": string
  "มีรถยนต์": string
  "มีอสังหาริมทรัพย์": string
  "จำนวนบุตร": number
  "รายได้รวม": number
  "วงเงินสินเชื่อ": number
  "ค่างวดรายงวด": number
  "ราคาสินค้า": number
  "ประเภทอาชีพรายได้": string
  "ระดับการศึกษา": string
  "สถานภาพครอบครัว": string
  "ประเภทที่อยู่อาศัย": string
  "อายุวันเกิด": number
  "อายุงานวัน": number
  "จำนวนสมาชิกครอบครัว": number
  "คะแนนภายนอก1": number
  "คะแนนภายนอก2": number
  "คะแนนภายนอก3": number

  NAME_FAMILY_STATUS: string
  NAME_HOUSING_TYPE: string
  NAME_INCOME_TYPE: string
  ORGANIZATION_TYPE: string
  AMT_GOODS_PRICE: number
  WEEKDAY_APPR_PROCESS_START: string
  HOUR_APPR_PROCESS_START: number
  CNT_CHILDREN: number
  CNT_FAM_MEMBERS: number
  REGION_RATING_CLIENT: number
  REGION_RATING_CLIENT_W_CITY: number
  OBS_30_CNT_SOCIAL_CIRCLE: number
  DEF_30_CNT_SOCIAL_CIRCLE: number
  OBS_60_CNT_SOCIAL_CIRCLE: number
  DEF_60_CNT_SOCIAL_CIRCLE: number
  AMT_REQ_CREDIT_BUREAU_MON: number
  AMT_REQ_CREDIT_BUREAU_YEAR: number
  DAYS_LAST_PHONE_CHANGE: number

  applicantExtrasJson: string
  employmentExtrasJson: string
  financialExtrasJson: string
  modelFeaturesJson: string
}

// ─── Default Values ───────────────────────────────────────────────────────────
const DEFAULT_FORM: ComprehensiveForm = {
  title: 'นาย', firstName: 'สมชาย', lastName: 'มั่นคง',
  idCard: '1103456789012', phone: '0891234567', email: 'somchai@example.com',
  addressLine: '123/45 ซ.สุขุมวิท 1', province: 'กรุงเทพมหานคร',
  district: 'วัฒนา', subDistrict: 'คลองเตยเหนือ', postalCode: '10110',
  employerName: 'บริษัท พัฒนาซอฟต์แวร์ จำกัด', extraIncome: 5000,
  existingLoanBalance: 210000, monthlyDebtPayment: 12000,
  debtInfos: [
    { debtType: 'PERSONAL_LOAN', creditorName: 'ธนาคาร A', outstandingAmount: 150000, monthlyPayment: 7500, delinquentDays: 0, isDefaulted: false },
    { debtType: 'CREDIT_CARD', creditorName: 'ธนาคาร B', outstandingAmount: 60000, monthlyPayment: 4500, delinquentDays: 0, isDefaulted: false },
  ],
  occupationCode: 'OFFICER', employmentType: 'FULL_TIME',
  loanPurposeCode: 'HOME_PURCHASE', provinceCode: '10', loanTermMonths: 0,
  "รหัสลูกค้า": 910001, "ประเภทสินเชื่อ": 'Cash loans', "เพศ": 'M',
  "มีรถยนต์": 'N', "มีอสังหาริมทรัพย์": 'Y', "จำนวนบุตร": 1,
  "รายได้รวม": 300000, "วงเงินสินเชื่อ": 450000, "ค่างวดรายงวด": 23000,
  "ราคาสินค้า": 430000, "ประเภทอาชีพรายได้": 'Working',
  "ระดับการศึกษา": 'Higher education', "สถานภาพครอบครัว": 'Married',
  "ประเภทที่อยู่อาศัย": 'House / apartment', "อายุวันเกิด": -14000,
  "อายุงานวัน": -2800, "จำนวนสมาชิกครอบครัว": 3,
  "คะแนนภายนอก1": 0.72, "คะแนนภายนอก2": 0.61, "คะแนนภายนอก3": 0.47,
  NAME_FAMILY_STATUS: 'Married', NAME_HOUSING_TYPE: 'House / apartment',
  NAME_INCOME_TYPE: 'Working', ORGANIZATION_TYPE: 'Business Entity Type 3',
  AMT_GOODS_PRICE: 430000, WEEKDAY_APPR_PROCESS_START: 'MONDAY', HOUR_APPR_PROCESS_START: 9,
  CNT_CHILDREN: 1, CNT_FAM_MEMBERS: 3, REGION_RATING_CLIENT: 2, REGION_RATING_CLIENT_W_CITY: 2,
  OBS_30_CNT_SOCIAL_CIRCLE: 0, DEF_30_CNT_SOCIAL_CIRCLE: 0,
  OBS_60_CNT_SOCIAL_CIRCLE: 0, DEF_60_CNT_SOCIAL_CIRCLE: 0,
  AMT_REQ_CREDIT_BUREAU_MON: 0, AMT_REQ_CREDIT_BUREAU_YEAR: 0, DAYS_LAST_PHONE_CHANGE: -365,
  applicantExtrasJson: '{}', employmentExtrasJson: '{}',
  financialExtrasJson: '{}', modelFeaturesJson: '{}',
}

const EMPTY_FORM: ComprehensiveForm = {
  title: '', firstName: '', lastName: '', idCard: '', phone: '', email: '',
  addressLine: '', province: '', district: '', subDistrict: '', postalCode: '',
  employerName: '', extraIncome: 0, existingLoanBalance: 0, monthlyDebtPayment: 0,
  debtInfos: [], occupationCode: 'OFFICER', employmentType: 'FULL_TIME',
  loanPurposeCode: 'HOME_PURCHASE', provinceCode: '10', loanTermMonths: 0,
  "รหัสลูกค้า": Math.floor(Math.random() * 900000) + 100000,
  "ประเภทสินเชื่อ": 'Cash loans', "เพศ": '', "มีรถยนต์": 'N', "มีอสังหาริมทรัพย์": 'Y',
  "จำนวนบุตร": 0, "รายได้รวม": 0, "วงเงินสินเชื่อ": 0, "ค่างวดรายงวด": 0, "ราคาสินค้า": 0,
  "ประเภทอาชีพรายได้": '', "ระดับการศึกษา": '', "สถานภาพครอบครัว": '',
  "ประเภทที่อยู่อาศัย": 'House / apartment', "อายุวันเกิด": 0, "อายุงานวัน": 0,
  "จำนวนสมาชิกครอบครัว": 1, "คะแนนภายนอก1": 0, "คะแนนภายนอก2": 0, "คะแนนภายนอก3": 0,
  NAME_FAMILY_STATUS: '', NAME_HOUSING_TYPE: '', NAME_INCOME_TYPE: '', ORGANIZATION_TYPE: '',
  AMT_GOODS_PRICE: 0, WEEKDAY_APPR_PROCESS_START: 'MONDAY', HOUR_APPR_PROCESS_START: 9,
  CNT_CHILDREN: 0, CNT_FAM_MEMBERS: 1, REGION_RATING_CLIENT: 2, REGION_RATING_CLIENT_W_CITY: 2,
  OBS_30_CNT_SOCIAL_CIRCLE: 0, DEF_30_CNT_SOCIAL_CIRCLE: 0,
  OBS_60_CNT_SOCIAL_CIRCLE: 0, DEF_60_CNT_SOCIAL_CIRCLE: 0,
  AMT_REQ_CREDIT_BUREAU_MON: 0, AMT_REQ_CREDIT_BUREAU_YEAR: 0, DAYS_LAST_PHONE_CHANGE: 0,
  applicantExtrasJson: '{}', employmentExtrasJson: '{}',
  financialExtrasJson: '{}', modelFeaturesJson: '{}',
}

// ─── Options ──────────────────────────────────────────────────────────────────
const OPTIONS = {
  TITLE: ['นาย', 'นาง', 'นางสาว'],
  CONTRACT_TYPE: ['Cash loans', 'Revolving loans'],
  GENDER: ['F', 'M'],
  YES_NO: ['Y', 'N'],
  INCOME_TYPE: ['Working', 'Commercial associate', 'Pensioner', 'State servant', 'Businessman', 'Student', 'Unemployed'],
  EDUCATION_TYPE: ['Higher education', 'Secondary / secondary special', 'Incomplete higher', 'Lower secondary', 'Academic degree'],
  FAMILY_STATUS: ['Married', 'Single / not married', 'Civil marriage', 'Separated', 'Widow'],
  HOUSING_TYPE: ['House / apartment', 'Rented apartment', 'With parents', 'Municipal apartment', 'Office apartment', 'Co-op apartment'],
}

function toOpts(arr: string[], mapLabels?: Record<string, string>) {
  return arr.map(a => ({ value: a, label: mapLabels ? (mapLabels[a] ?? a) : a }))
}

const TRANS = {
  GENDER: { 'F': 'หญิง', 'M': 'ชาย' } as Record<string, string>,
  CONTRACT: { 'Cash loans': 'สินเชื่อเงินสด', 'Revolving loans': 'สินเชื่อหมุนเวียน' } as Record<string, string>,
  YES_NO: { 'Y': 'มี', 'N': 'ไม่มี' } as Record<string, string>,
  EDU: {
    'Higher education': 'ปริญญาตรีขึ้นไป',
    'Secondary / secondary special': 'มัธยมศึกษา / ปวช. / ปวส.',
    'Incomplete higher': 'อนุปริญญา',
    'Lower secondary': 'มัธยมต้น',
    'Academic degree': 'ระดับวิชาการชั้นสูง',
  } as Record<string, string>,
  FAM: {
    'Married': 'สมรส',
    'Single / not married': 'โสด / ยังไม่แต่งงาน',
    'Civil marriage': 'จดทะเบียนสมรส',
    'Separated': 'แยกกันอยู่',
    'Widow': 'หม้าย',
  } as Record<string, string>,
  HOUSE: {
    'House / apartment': 'บ้านเดี่ยว / อพาร์ตเมนต์ส่วนตัว',
    'Rented apartment': 'เช่าอพาร์ตเมนต์',
    'With parents': 'อาศัยอยู่กับบิดามารดา',
    'Municipal apartment': 'แฟลตเคหะ',
    'Office apartment': 'บ้านพักสวัสดิการ',
    'Co-op apartment': 'สหกรณ์อพาร์ตเมนต์',
  } as Record<string, string>,
  WORK: {
    'Working': 'พนักงานเอกชน / ลูกจ้าง',
    'Commercial associate': 'พนักงานการพาณิชย์',
    'Pensioner': 'ข้าราชการบำนาญ',
    'State servant': 'ข้าราชการ / รัฐวิสาหกิจ',
    'Businessman': 'เจ้าของธุรกิจ',
    'Student': 'นักศึกษา',
    'Unemployed': 'ว่างงาน',
  } as Record<string, string>,
}

// ─── API Test Presets ─────────────────────────────────────────────────────────
const API_TEST_LOW_FORM: Partial<ComprehensiveForm> = {
  title: 'นาย', firstName: 'Test', lastName: 'LowRisk',
  idCard: '', phone: '', email: '', addressLine: '',
  province: 'กรุงเทพมหานคร', district: 'บางกะปิ', subDistrict: '', postalCode: '10240',
  employerName: 'Stable Co.,Ltd.', extraIncome: 10000,
  existingLoanBalance: 0, monthlyDebtPayment: 15000,
  debtInfos: [{ debtType: 'CREDIT_CARD', creditorName: 'Bank A', outstandingAmount: 20000, monthlyPayment: 2000, delinquentDays: 0, isDefaulted: false }],
  occupationCode: 'OFFICER', employmentType: 'FULL_TIME',
  loanPurposeCode: 'HOME_PURCHASE', provinceCode: '10',
  "เพศ": 'M', "มีรถยนต์": 'N', "มีอสังหาริมทรัพย์": 'Y',
  "รายได้รวม": 90000, "วงเงินสินเชื่อ": 600000, "ค่างวดรายงวด": 15000,
  "ราคาสินค้า": 600000, "ประเภทสินเชื่อ": 'Cash loans',
  "ประเภทอาชีพรายได้": 'Working', "ระดับการศึกษา": 'Higher education',
  "สถานภาพครอบครัว": 'Married', "ประเภทที่อยู่อาศัย": 'House / apartment',
  "อายุวันเกิด": -12600, "อายุงานวัน": -2555,
  "จำนวนบุตร": 1, "จำนวนสมาชิกครอบครัว": 3,
  "คะแนนภายนอก2": 0.79, "คะแนนภายนอก3": 0.65,
  applicantExtrasJson: JSON.stringify({
    CODE_GENDER: 'M',
    FLAG_OWN_CAR: 'N',
    FLAG_OWN_REALTY: 'Y',
    NAME_FAMILY_STATUS: 'Married',
    NAME_HOUSING_TYPE: 'House / apartment',
  }, null, 2),
  employmentExtrasJson: JSON.stringify({
    NAME_INCOME_TYPE: 'Working',
    ORGANIZATION_TYPE: 'Business Entity Type 3',
  }, null, 2),
  financialExtrasJson: JSON.stringify({
    NAME_CONTRACT_TYPE: 'Cash loans',
    AMT_CREDIT: 600000,
    AMT_ANNUITY: 15000,
    AMT_GOODS_PRICE: 600000,
    WEEKDAY_APPR_PROCESS_START: 'WEDNESDAY',
    HOUR_APPR_PROCESS_START: 10,
  }, null, 2),
  modelFeaturesJson: JSON.stringify({
    EXT_SOURCE_1: 0.72,
    EXT_SOURCE_2: 0.79,
    EXT_SOURCE_3: 0.65,
    DAYS_BIRTH: -12600,
    DAYS_EMPLOYED: -2555,
    CNT_CHILDREN: 1,
    CNT_FAM_MEMBERS: 3,
    REGION_RATING_CLIENT: 2,
    REGION_RATING_CLIENT_W_CITY: 2,
    OBS_30_CNT_SOCIAL_CIRCLE: 0,
    DEF_30_CNT_SOCIAL_CIRCLE: 0,
    OBS_60_CNT_SOCIAL_CIRCLE: 0,
    DEF_60_CNT_SOCIAL_CIRCLE: 0,
    AMT_REQ_CREDIT_BUREAU_MON: 0,
    AMT_REQ_CREDIT_BUREAU_YEAR: 0,
    DAYS_LAST_PHONE_CHANGE: -1200,
  }, null, 2),
}

const API_TEST_MEDIUM_FORM: Partial<ComprehensiveForm> = {
  title: 'นาย', firstName: 'Test', lastName: 'MediumRisk',
  idCard: '', phone: '', email: '', addressLine: '',
  province: 'กรุงเทพมหานคร', district: 'ห้วยขวาง', subDistrict: '', postalCode: '10310',
  employerName: 'Company B', extraIncome: 0,
  existingLoanBalance: 120000, monthlyDebtPayment: 10000,
  debtInfos: [{ debtType: 'PERSONAL_LOAN', creditorName: 'Bank B', outstandingAmount: 120000, monthlyPayment: 6000, delinquentDays: 0, isDefaulted: false }],
  occupationCode: 'OFFICER', employmentType: 'CONTRACT',
  loanPurposeCode: 'HOME_PURCHASE', provinceCode: '10', loanTermMonths: 48,
  "เพศ": 'M', "มีรถยนต์": 'N', "มีอสังหาริมทรัพย์": 'Y',
  "รายได้รวม": 18000, "วงเงินสินเชื่อ": 350000, "ค่างวดรายงวด": 10000,
  "ราคาสินค้า": 350000, "ประเภทสินเชื่อ": 'Cash loans',
  "ประเภทอาชีพรายได้": 'Working', "ระดับการศึกษา": 'Higher education',
  "สถานภาพครอบครัว": 'Single / not married', "ประเภทที่อยู่อาศัย": 'Rented apartment',
  "อายุวันเกิด": -12000, "อายุงานวัน": -300,
  "จำนวนบุตร": 0, "จำนวนสมาชิกครอบครัว": 2,
  "คะแนนภายนอก1": 0.25, "คะแนนภายนอก2": 0.25, "คะแนนภายนอก3": 0.25,
  applicantExtrasJson: JSON.stringify({
    nationality: 'TH',
    CODE_GENDER: 'M',
    FLAG_OWN_CAR: 'N',
    FLAG_OWN_REALTY: 'Y',
    NAME_FAMILY_STATUS: 'Single / not married',
    NAME_HOUSING_TYPE: 'Rented apartment',
  }, null, 2),
  employmentExtrasJson: JSON.stringify({
    NAME_INCOME_TYPE: 'Working',
  }, null, 2),
  financialExtrasJson: JSON.stringify({
    NAME_CONTRACT_TYPE: 'Cash loans',
    AMT_CREDIT: 350000,
    AMT_ANNUITY: 10000,
    AMT_GOODS_PRICE: 350000,
  }, null, 2),
  modelFeaturesJson: JSON.stringify({
    NAME_CONTRACT_TYPE: 'Cash loans',
    CODE_GENDER: 'M',
    FLAG_OWN_CAR: 'N',
    FLAG_OWN_REALTY: 'Y',
    NAME_INCOME_TYPE: 'Working',
    NAME_FAMILY_STATUS: 'Single / not married',
    NAME_HOUSING_TYPE: 'Rented apartment',
    AMT_INCOME_TOTAL: 18000,
    AMT_CREDIT: 350000,
    AMT_ANNUITY: 10000,
    AMT_GOODS_PRICE: 350000,
    EXT_SOURCE_1: 0.25,
    EXT_SOURCE_2: 0.25,
    EXT_SOURCE_3: 0.25,
    DAYS_BIRTH: -12000,
    DAYS_EMPLOYED: -300,
    OBS_30_CNT_SOCIAL_CIRCLE: 2,
    DEF_30_CNT_SOCIAL_CIRCLE: 0,
    AMT_REQ_CREDIT_BUREAU_MON: 1,
    AMT_REQ_CREDIT_BUREAU_YEAR: 2,
  }, null, 2),
}

// ─── API Test HIGH Risk (ตรงกับ JSON note: "case-high") ──────────────────────
const API_TEST_HIGH_FORM: Partial<ComprehensiveForm> = {
  title: 'นาย', firstName: 'Test', lastName: 'HighRisk',
  idCard: '', phone: '', email: '', addressLine: '',
  province: 'กรุงเทพมหานคร', district: 'บางกะปิ', subDistrict: '', postalCode: '10240',
  employerName: 'Temporary', extraIncome: 0,
  existingLoanBalance: 300000, monthlyDebtPayment: 9000,
  debtInfos: [{ debtType: 'PERSONAL_LOAN', creditorName: 'Bank X', outstandingAmount: 300000, monthlyPayment: 9000, delinquentDays: 90, isDefaulted: true }],
  occupationCode: 'OFFICER', employmentType: 'CONTRACT',
  loanPurposeCode: 'HOME_PURCHASE', provinceCode: '10', loanTermMonths: 60,
  "เพศ": 'M', "มีรถยนต์": 'N', "มีอสังหาริมทรัพย์": 'N',
  "ประเภทที่อยู่อาศัย": 'Rented apartment',
  "รายได้รวม": 12000, "วงเงินสินเชื่อ": 800000, "ค่างวดรายงวด": 9000,
  "ราคาสินค้า": 800000, "ประเภทสินเชื่อ": 'Cash loans',
  "ประเภทอาชีพรายได้": 'Unemployed', "สถานภาพครอบครัว": 'Single / not married',
  "อายุวันเกิด": -6900, "อายุงานวัน": -182,
  "จำนวนบุตร": 2, "จำนวนสมาชิกครอบครัว": 4,
  "คะแนนภายนอก1": 0.01, "คะแนนภายนอก2": 0.01, "คะแนนภายนอก3": 0.01,
  NAME_FAMILY_STATUS: 'Single / not married', NAME_HOUSING_TYPE: 'Rented apartment',
  NAME_INCOME_TYPE: 'Unemployed', ORGANIZATION_TYPE: 'XNA',
  AMT_GOODS_PRICE: 800000, WEEKDAY_APPR_PROCESS_START: 'MONDAY', HOUR_APPR_PROCESS_START: 9,
  CNT_CHILDREN: 2, CNT_FAM_MEMBERS: 4,
  REGION_RATING_CLIENT: 3, REGION_RATING_CLIENT_W_CITY: 3,
  OBS_30_CNT_SOCIAL_CIRCLE: 5, DEF_30_CNT_SOCIAL_CIRCLE: 2,
  OBS_60_CNT_SOCIAL_CIRCLE: 5, DEF_60_CNT_SOCIAL_CIRCLE: 2,
  AMT_REQ_CREDIT_BUREAU_MON: 3, AMT_REQ_CREDIT_BUREAU_YEAR: 10, DAYS_LAST_PHONE_CHANGE: -50,
  applicantExtrasJson: JSON.stringify({ CODE_GENDER: 'M', FLAG_OWN_CAR: 'N', FLAG_OWN_REALTY: 'N', NAME_FAMILY_STATUS: 'Single / not married', NAME_HOUSING_TYPE: 'Rented apartment' }, null, 2),
  employmentExtrasJson: JSON.stringify({ NAME_INCOME_TYPE: 'Unemployed', ORGANIZATION_TYPE: 'XNA' }, null, 2),
  financialExtrasJson: JSON.stringify({ NAME_CONTRACT_TYPE: 'Cash loans', AMT_CREDIT: 800000, AMT_ANNUITY: 9000, AMT_GOODS_PRICE: 800000, WEEKDAY_APPR_PROCESS_START: 'MONDAY', HOUR_APPR_PROCESS_START: 9 }, null, 2),
  modelFeaturesJson: JSON.stringify({
    EXT_SOURCE_1: 0.01, EXT_SOURCE_2: 0.01, EXT_SOURCE_3: 0.01,
    DAYS_BIRTH: -6900, DAYS_EMPLOYED: -182,
    CNT_CHILDREN: 2, CNT_FAM_MEMBERS: 4,
    REGION_RATING_CLIENT: 3, REGION_RATING_CLIENT_W_CITY: 3,
    OBS_30_CNT_SOCIAL_CIRCLE: 5, DEF_30_CNT_SOCIAL_CIRCLE: 2,
    OBS_60_CNT_SOCIAL_CIRCLE: 5, DEF_60_CNT_SOCIAL_CIRCLE: 2,
    AMT_REQ_CREDIT_BUREAU_MON: 3, AMT_REQ_CREDIT_BUREAU_YEAR: 10, DAYS_LAST_PHONE_CHANGE: -50,
  }, null, 2),
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function money(n: number) { return n.toLocaleString('th-TH') }

function RiskPill({ level }: { level: string }) {
  if (!level) return null
  const lvl = level.toLowerCase()
  const cfg: Record<string, { bg: string; text: string; border: string; label: string }> = {
    low:    { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'ความเสี่ยงต่ำ' },
    medium: { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',   label: 'ความเสี่ยงปานกลาง' },
    high:   { bg: 'bg-red-50',     text: 'text-red-700',     border: 'border-red-200',     label: 'ความเสี่ยงสูง' },
  }
  const c = cfg[lvl] || cfg.medium
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-bold border ${c.bg} ${c.text} ${c.border}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {c.label} ({level})
    </span>
  )
}

function toDateFromNegativeDays(days: number): string {
  const today = new Date()
  const d = new Date(today.getTime() + days * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 10)
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n))
}

function formatCodeLabel(code?: string): string {
  if (!code) return ''
  return code.split('_').map(x => x.charAt(0) + x.slice(1).toLowerCase()).join(' ')
}

function normalizeMaritalStatus(value: string): string {
  const raw = (value || '').trim().toUpperCase()
  if (raw.includes('MARRIED') || raw.includes('สมรส')) return 'MARRIED'
  if (raw.includes('DIVORCED') || raw.includes('หย่า')) return 'DIVORCED'
  if (raw.includes('WIDOW') || raw.includes('หม้าย')) return 'WIDOWED'
  return 'SINGLE'
}

function parseJsonObject(raw: string, fieldName: string): Record<string, unknown> {
  const text = (raw || '').trim()
  if (!text || text === '{}') return {}
  try {
    const parsed = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error()
    return parsed as Record<string, unknown>
  } catch {
    throw new Error(`INVALID_JSON_${fieldName}`)
  }
}

// ─── Parse API Response ───────────────────────────────────────────────────────
// รองรับ response structure: { summary, modelPrediction, scoreBreakdown, riskFactors, recommendations, inputSnapshot }
function parseCalculatePreview(raw: Record<string, unknown>) {
  const root = raw || {}
  const modelPrediction = (root.modelPrediction ?? {}) as Record<string, unknown>
  // รองรับ data.summary (structure จริงของ API)
  const riskAssessment = (root.summary ?? root.riskAssessment ?? root.assessmentResult ?? root.result ?? {}) as Record<string, unknown>

  const scoreBreakdownRaw = (root.scoreBreakdown ?? riskAssessment.scoreBreakdown ?? []) as unknown
  const riskFactorsRaw = (root.riskFactors ?? root.factors ?? riskAssessment.riskFactors ?? []) as unknown
  const recommendationsRaw = (root.recommendations ?? riskAssessment.recommendations ?? []) as unknown

  const toScoreBreakdown = (value: unknown): ScoreBreakdownItem[] =>
    Array.isArray(value)
      ? value.map((item: any) => ({
          code: item?.code ? String(item.code) : undefined,
          // รองรับทั้ง labelTh (standard) และ label (จาก API จริง)
          labelTh: item?.labelTh ?? item?.label_th ?? item?.label ?? item?.title ?? undefined,
          labelEn: item?.labelEn ?? item?.label_en ?? undefined,
          value: Number(item?.value ?? item?.impact ?? item?.points ?? item?.impactScore ?? item?.impact_score ?? item?.scoreDelta ?? item?.score_delta ?? 0),
          // รองรับ impact (จาก API จริง) และ scoreDelta
          scoreDelta: Number(item?.scoreDelta ?? item?.score_delta ?? item?.impact ?? item?.points ?? item?.impactScore ?? item?.impact_score ?? item?.value ?? 0),
          // รองรับ reason (จาก API จริง) และ detail
          detail: item?.detail ?? item?.reason ?? item?.description ?? undefined,
        }))
      : []

  const toRiskFactors = (value: unknown): RiskFactor[] =>
    Array.isArray(value)
      ? value.map((item: any, idx) => ({
          code: String(item?.code ?? `FACTOR_${idx + 1}`),
          labelTh: String(item?.labelTh ?? item?.label_th ?? item?.title ?? item?.name ?? 'ปัจจัยความเสี่ยง'),
          impactDirection: String(item?.impactDirection ?? item?.impact_direction ?? 'NEUTRAL').toUpperCase() as RiskFactor['impactDirection'],
          impactScore: Number(item?.impactScore ?? item?.impact_score ?? 0),
          detail: String(item?.detail ?? item?.reason ?? item?.description ?? ''),
        }))
      : []

  const toRecommendations = (value: unknown): Recommendation[] =>
    Array.isArray(value)
      ? value.map((item: any, idx) => ({
          type: String(item?.type ?? item?.recommendationType ?? 'INFO').toUpperCase() as Recommendation['type'],
          titleTh: String(item?.titleTh ?? item?.title_th ?? item?.title ?? 'คำแนะนำ'),
          descriptionTh: String(item?.descriptionTh ?? item?.description_th ?? item?.description ?? ''),
          priority: Number(item?.priority ?? idx + 1),
          isPrimary: Boolean(item?.isPrimary ?? item?.is_primary ?? idx === 0),
        }))
      : []

  const defaultProbability = Number(
    riskAssessment.defaultProbability ?? riskAssessment.default_probability ??
    root.defaultProbability ?? root.default_probability ??
    modelPrediction.defaultProbability ?? modelPrediction.default_probability ?? 0
  )

  const scoreRaw = Number(riskAssessment.score ?? root.score ?? riskAssessment.creditScore ?? root.creditScore ?? modelPrediction.score ?? 0)
  const scoreBreakdown = toScoreBreakdown(scoreBreakdownRaw)
  const scoreFromBreakdown = scoreBreakdown.length > 0
    ? 100 + scoreBreakdown.reduce((sum, item) => sum + Number(item.scoreDelta || 0), 0)
    : 0
  const score = scoreRaw > 0 ? scoreRaw : scoreFromBreakdown

  const creditScore = Number(
    riskAssessment.creditScore ?? riskAssessment.credit_score ??
    root.creditScore ?? root.credit_score ?? modelPrediction.creditScore ?? score
  )

  const riskLevelCandidate = riskAssessment.riskLevel ?? riskAssessment.risk_level ??
    root.riskLevel ?? root.risk_level ??
    modelPrediction.riskBandEn ?? modelPrediction.riskBand
  const riskLevel = riskLevelCandidate ? String(riskLevelCandidate).toUpperCase() : ''

  const recommendationType = String(
    riskAssessment.recommendationType ?? riskAssessment.recommendation_type ??
    root.recommendationType ?? root.recommendation_type ?? ''
  ).toUpperCase()

  const primaryReason = String(
    riskAssessment.primaryReason ?? riskAssessment.primary_reason ??
    root.primaryReason ?? root.primary_reason ?? modelPrediction.decision ?? ''
  )

  const resultRef = String(
    root.resultId ?? root.result_id ?? riskAssessment.resultId ?? riskAssessment.result_id ??
    modelPrediction.requestId ?? '-'
  )

  return {
    assessmentId: String(root.assessmentId ?? root.assessment_id ?? ''),
    defaultProbability: Number.isFinite(defaultProbability) ? defaultProbability : 0,
    score: Number.isFinite(score) ? score : 0,
    creditScore: Number.isFinite(creditScore) ? creditScore : 0,
    scoreGrade: String(riskAssessment.scoreGrade ?? root.scoreGrade ?? ''),
    scoreScale: Number(riskAssessment.scoreScale ?? root.scoreScale ?? 0) || 0,
    riskLevel,
    riskLevelLabel: String(riskAssessment.riskLevelLabel ?? root.riskLevelLabel ?? ''),
    dti: (riskAssessment.dti != null ? Number(riskAssessment.dti) : undefined) as number | undefined,
    recommendationType,
    recommendationLabel: String(riskAssessment.recommendationLabel ?? root.recommendationLabel ?? ''),
    primaryReason,
    resultRef,
    scoreBreakdown,
    riskFactors: toRiskFactors(riskFactorsRaw),
    recommendations: toRecommendations(recommendationsRaw),
    inputSnapshot: (root.inputSnapshot ?? root.input_snapshot ?? {}) as Record<string, unknown>,
    savedAt: String(root.savedAt ?? root.saved_at ?? ''),
  }
}

// ─── Build Payload ────────────────────────────────────────────────────────────
function buildAssessmentPayload(form: ComprehensiveForm): AssessmentCreatePayload {
  const applicantExtra = parseJsonObject(form.applicantExtrasJson, 'applicantExtrasJson')
  const employmentExtra = parseJsonObject(form.employmentExtrasJson, 'employmentExtrasJson')
  const financialExtra = parseJsonObject(form.financialExtrasJson, 'financialExtrasJson')
  const modelFeaturesExtra = parseJsonObject(form.modelFeaturesJson, 'modelFeaturesJson')

  const computedLoanTermMonths = form["ค่างวดรายงวด"] > 0
    ? clamp(Math.round(form["วงเงินสินเชื่อ"] / form["ค่างวดรายงวด"]), 6, 120)
    : 60
  const loanTermMonths = form.loanTermMonths > 0 ? form.loanTermMonths : computedLoanTermMonths

  return {
    applicantProfile: {
      ...applicantExtra,
      firstName: form.firstName || 'Test',
      lastName: form.lastName || 'User',
      dateOfBirth: toDateFromNegativeDays(form["อายุวันเกิด"] || -12000),
      maritalStatus: normalizeMaritalStatus(form["สถานภาพครอบครัว"] || ''),
      provinceCode: form.provinceCode || '10',
      district: form.district || undefined,
      postalCode: form.postalCode || undefined,
      gender: form["เพศ"] || undefined,
      CODE_GENDER: form["เพศ"] || undefined,
      FLAG_OWN_CAR: form["มีรถยนต์"] || 'N',
      FLAG_OWN_REALTY: form["มีอสังหาริมทรัพย์"] || 'N',
      NAME_FAMILY_STATUS: form.NAME_FAMILY_STATUS || form["สถานภาพครอบครัว"] || undefined,
      NAME_HOUSING_TYPE: form.NAME_HOUSING_TYPE || form["ประเภทที่อยู่อาศัย"] || undefined,
    },
    employmentInfo: {
      ...employmentExtra,
      occupationCode: form.occupationCode || 'OFFICER',
      employmentType: form.employmentType || 'FULL_TIME',
      employerName: form.employerName || undefined,
      jobTenureMonths: Math.max(0, Math.round(Math.abs(form["อายุงานวัน"]) / 30.416)),
      monthlyIncome: Math.max(1, Number(form["รายได้รวม"]) || 0),
      additionalIncome: Math.max(0, Number(form.extraIncome) || 0),
      NAME_INCOME_TYPE: form.NAME_INCOME_TYPE || undefined,
      ORGANIZATION_TYPE: form.ORGANIZATION_TYPE || undefined,
    },
    financialInfo: {
      ...financialExtra,
      requestedLoanAmount: Math.max(1, Number(form["วงเงินสินเชื่อ"]) || 0),
      loanTermMonths,
      loanPurposeCode: form.loanPurposeCode || 'HOME_PURCHASE',
      monthlyDebtPayment: Math.max(0, Number(form.monthlyDebtPayment) || 0),
      existingLoanBalance: Math.max(0, Number(form.existingLoanBalance) || 0),
      NAME_CONTRACT_TYPE: form["ประเภทสินเชื่อ"] || undefined,
      AMT_CREDIT: form["วงเงินสินเชื่อ"] || undefined,
      AMT_ANNUITY: form["ค่างวดรายงวด"] || undefined,
      AMT_GOODS_PRICE: form.AMT_GOODS_PRICE || form["ราคาสินค้า"] || undefined,
      WEEKDAY_APPR_PROCESS_START: form.WEEKDAY_APPR_PROCESS_START || undefined,
      HOUR_APPR_PROCESS_START: form.HOUR_APPR_PROCESS_START ?? undefined,
    },
    debtInfos: (form.debtInfos || []).map(debt => ({
      debtType: debt.debtType || 'PERSONAL_LOAN',
      creditorName: debt.creditorName || undefined,
      outstandingAmount: Math.max(0, Number(debt.outstandingAmount) || 0),
      monthlyPayment: Math.max(0, Number(debt.monthlyPayment) || 0),
      delinquentDays: Math.max(0, Number(debt.delinquentDays) || 0),
      isDefaulted: Boolean(debt.isDefaulted),
    })),
    contactInfo: {
      phoneNumber: form.phone || undefined,
      email: form.email || undefined,
      address: form.addressLine || undefined,
    },
    modelFeatures: {
      EXT_SOURCE_1: form["คะแนนภายนอก1"] ?? 0,
      EXT_SOURCE_2: form["คะแนนภายนอก2"] ?? 0,
      EXT_SOURCE_3: form["คะแนนภายนอก3"] ?? 0,
      NAME_CONTRACT_TYPE: form["ประเภทสินเชื่อ"],
      AMT_CREDIT: form["วงเงินสินเชื่อ"],
      AMT_INCOME_TOTAL: form["รายได้รวม"],
      AMT_ANNUITY: form["ค่างวดรายงวด"],
      AMT_GOODS_PRICE: form.AMT_GOODS_PRICE || form["ราคาสินค้า"],
      NAME_INCOME_TYPE: form.NAME_INCOME_TYPE,
      NAME_FAMILY_STATUS: form.NAME_FAMILY_STATUS || form["สถานภาพครอบครัว"],
      NAME_HOUSING_TYPE: form.NAME_HOUSING_TYPE || form["ประเภทที่อยู่อาศัย"],
      CODE_GENDER: form["เพศ"],
      DAYS_BIRTH: form["อายุวันเกิด"],
      DAYS_EMPLOYED: form["อายุงานวัน"],
      CNT_CHILDREN: form.CNT_CHILDREN,
      CNT_FAM_MEMBERS: form.CNT_FAM_MEMBERS,
      REGION_RATING_CLIENT: form.REGION_RATING_CLIENT,
      REGION_RATING_CLIENT_W_CITY: form.REGION_RATING_CLIENT_W_CITY,
      OBS_30_CNT_SOCIAL_CIRCLE: form.OBS_30_CNT_SOCIAL_CIRCLE,
      DEF_30_CNT_SOCIAL_CIRCLE: form.DEF_30_CNT_SOCIAL_CIRCLE,
      OBS_60_CNT_SOCIAL_CIRCLE: form.OBS_60_CNT_SOCIAL_CIRCLE,
      DEF_60_CNT_SOCIAL_CIRCLE: form.DEF_60_CNT_SOCIAL_CIRCLE,
      AMT_REQ_CREDIT_BUREAU_MON: form.AMT_REQ_CREDIT_BUREAU_MON,
      AMT_REQ_CREDIT_BUREAU_YEAR: form.AMT_REQ_CREDIT_BUREAU_YEAR,
      DAYS_LAST_PHONE_CHANGE: form.DAYS_LAST_PHONE_CHANGE,
      ...modelFeaturesExtra,
    },
    note: 'assessment-calculate-from-frontend',
  }
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function PredictPage() {
  const router = useRouter()
  const [viewState, setViewState] = useState<ViewState>('FORM')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<ComprehensiveForm>(DEFAULT_FORM)
  const [result, setResult] = useState<AssessmentEvaluationData | null>(null)
  const [lastCalculatedPayload, setLastCalculatedPayload] = useState<AssessmentCreatePayload | null>(null)
  const [saving, setSaving] = useState(false)
  const [options, setOptions] = useState<AssessmentFormOptions | null>(null)
  const [optionsLoading, setOptionsLoading] = useState(true)

  useEffect(() => {
    const loadOptions = async () => {
      setOptionsLoading(true)
      try {
        const data = await getAssessmentFormOptions()
        setOptions(data)
      } catch {
        setOptions(null)
      } finally {
        setOptionsLoading(false)
      }
    }
    loadOptions()
  }, [])

  const optionLists = useMemo(() => {
    const toList = (source: unknown): Array<{ value: string; label: string }> => {
      if (!Array.isArray(source)) return []
      return source.map((x: any) => {
        if (typeof x === 'string') return { value: x, label: x }
        const value = String(x?.code ?? x?.id ?? x?.value ?? '')
        const label = String(x?.nameTh ?? x?.name ?? x?.label ?? value)
        return value ? { value, label } : null
      }).filter(Boolean) as Array<{ value: string; label: string }>
    }
    const pick = (...keys: string[]) => {
      const source = options as Record<string, unknown> | null
      if (!source) return []
      for (const key of keys) {
        const list = toList(source[key])
        if (list.length) return list
      }
      return []
    }
    return {
      provinces: pick('provinces', 'provinceOptions'),
      occupations: pick('occupations', 'occupationOptions'),
      loanPurposes: pick('loanPurposes', 'loanPurposeOptions'),
      employmentTypes: pick('employmentTypes', 'employmentTypeOptions'),
      debtTypes: pick('debtTypes', 'debtTypeOptions'),
    }
  }, [options])

  const localErrorMap: Record<string, string> = {
    CALCULATE_REQUIRED_BEFORE_SAVE: 'กรุณากดประมวลผลความเสี่ยงก่อนบันทึกผล',
    FORM_CHANGED_AFTER_CALCULATE: 'ข้อมูลถูกแก้ไขหลังคำนวณ กรุณากดประมวลผลใหม่ก่อนบันทึก',
    FORM_OPTIONS_LOADING: 'กำลังโหลดตัวเลือกจากระบบ กรุณารอสักครู่',
    FORM_OPTIONS_UNAVAILABLE: 'โหลดตัวเลือกฟอร์มไม่สำเร็จ กรุณารีเฟรชหน้า',
    INVALID_OCCUPATION_CODE: 'occupationCode ไม่ถูกต้อง',
    INVALID_LOAN_PURPOSE_CODE: 'loanPurposeCode ไม่ถูกต้อง',
    INVALID_PROVINCE_CODE: 'provinceCode ไม่ถูกต้อง',
    INVALID_EMPLOYMENT_TYPE: 'employmentType ไม่ถูกต้อง',
    INVALID_DEBT_TYPE: 'debtType ไม่ถูกต้อง',
    INVALID_JSON_applicantExtrasJson: 'Applicant Extras JSON ไม่ถูกต้อง',
    INVALID_JSON_employmentExtrasJson: 'Employment Extras JSON ไม่ถูกต้อง',
    INVALID_JSON_financialExtrasJson: 'Financial Extras JSON ไม่ถูกต้อง',
    INVALID_JSON_modelFeaturesJson: 'Model Features JSON ไม่ถูกต้อง',
  }
  const mapLocalError = (code?: string) => code ? localErrorMap[code] : undefined

  useEffect(() => {
    if (optionsLoading) return
    setForm(prev => {
      const next = { ...prev }
      if (optionLists.provinces.length && !optionLists.provinces.some(x => x.value === prev.provinceCode)) {
        next.provinceCode = optionLists.provinces[0].value
        next.province = optionLists.provinces[0].label
      }
      if (optionLists.occupations.length && !optionLists.occupations.some(x => x.value === prev.occupationCode))
        next.occupationCode = optionLists.occupations[0].value
      if (optionLists.loanPurposes.length && !optionLists.loanPurposes.some(x => x.value === prev.loanPurposeCode))
        next.loanPurposeCode = optionLists.loanPurposes[0].value
      if (optionLists.employmentTypes.length && !optionLists.employmentTypes.some(x => x.value === prev.employmentType))
        next.employmentType = optionLists.employmentTypes[0].value
      return next
    })
  }, [optionLists, optionsLoading])

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const applyPayloadPreset = (
    preset: Partial<ComprehensiveForm>,
    preferred: { occupationCode?: string[]; loanPurposeCode?: string[]; employmentType?: string[]; provinceCode?: string[] }
  ) => {
    setForm(prev => ({
      ...prev,
      ...preset,
      occupationCode: (preferred.occupationCode || []).map(v => optionLists.occupations.find(x => x.value === v)?.value).find(Boolean) || optionLists.occupations[0]?.value || prev.occupationCode,
      loanPurposeCode: (preferred.loanPurposeCode || []).map(v => optionLists.loanPurposes.find(x => x.value === v)?.value).find(Boolean) || optionLists.loanPurposes[0]?.value || prev.loanPurposeCode,
      employmentType: (preferred.employmentType || []).map(v => optionLists.employmentTypes.find(x => x.value === v)?.value).find(Boolean) || optionLists.employmentTypes[0]?.value || prev.employmentType,
      provinceCode: (preferred.provinceCode || []).map(v => optionLists.provinces.find(x => x.value === v)?.value).find(Boolean) || optionLists.provinces[0]?.value || prev.provinceCode,
    }))
  }

  const applyApiTestLow = () => applyPayloadPreset(API_TEST_LOW_FORM, { occupationCode: ['OFFICER'], loanPurposeCode: ['HOME_PURCHASE', 'HOME'], employmentType: ['FULL_TIME'], provinceCode: ['10'] })
  const applyApiTestMedium = () => applyPayloadPreset(API_TEST_MEDIUM_FORM, { occupationCode: ['OFFICER', 'OCC05'], loanPurposeCode: ['HOME_PURCHASE', 'HOME'], employmentType: ['CONTRACT'], provinceCode: ['10', '20'] })
  const applyApiTestHigh = () => applyPayloadPreset(API_TEST_HIGH_FORM, { occupationCode: ['OFFICER'], loanPurposeCode: ['HOME_PURCHASE', 'HOME'], employmentType: ['CONTRACT'], provinceCode: ['10'] })

  const handleCalculate = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = buildAssessmentPayload(form)
      const preview = await calculateAssessmentPreview(payload)
      setResult(preview)
      setLastCalculatedPayload(payload)
      setViewState('RESULT')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.detail || mapLocalError(err?.message) || err.message || 'เกิดข้อผิดพลาดในการประเมิน')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAssessment = async () => {
    setSaving(true)
    setError(null)
    try {
      if (optionsLoading) throw new Error('FORM_OPTIONS_LOADING')
      if (!options) throw new Error('FORM_OPTIONS_UNAVAILABLE')
      if (optionLists.occupations.length && !optionLists.occupations.some(x => x.value === form.occupationCode)) throw new Error('INVALID_OCCUPATION_CODE')
      if (optionLists.loanPurposes.length && !optionLists.loanPurposes.some(x => x.value === form.loanPurposeCode)) throw new Error('INVALID_LOAN_PURPOSE_CODE')
      if (optionLists.provinces.length && !optionLists.provinces.some(x => x.value === form.provinceCode)) throw new Error('INVALID_PROVINCE_CODE')
      if (optionLists.employmentTypes.length && !optionLists.employmentTypes.some(x => x.value === form.employmentType)) throw new Error('INVALID_EMPLOYMENT_TYPE')
      if (optionLists.debtTypes.length && form.debtInfos.some(d => !optionLists.debtTypes.some(x => x.value === d.debtType))) throw new Error('INVALID_DEBT_TYPE')

      const payloadFromForm = buildAssessmentPayload(form)
      if (!lastCalculatedPayload) throw new Error('CALCULATE_REQUIRED_BEFORE_SAVE')
      if (JSON.stringify(payloadFromForm) !== JSON.stringify(lastCalculatedPayload)) throw new Error('FORM_CHANGED_AFTER_CALCULATE')

      const payload = lastCalculatedPayload
      const created = await createAssessment(payload)
      const createdAny = created as any
      const assessmentId = createdAny?.assessmentId ?? createdAny?.assessment_id ?? createdAny?.id ?? null
      if (!assessmentId) throw new Error('CREATE_SUCCESS_BUT_MISSING_ASSESSMENT_ID')

      try {
        const submitted = await submitAssessment(String(assessmentId), payload)
        setResult(submitted)
      } catch (submitErr: any) {
        try {
          const detail = await getAssessmentDetail(String(assessmentId))
          if (!detail?.result) throw submitErr
        } catch {
          throw submitErr
        }
      }
      router.push(`/history/${assessmentId}`)
    } catch (err: any) {
      const responseData = err?.response?.data
      const backendMessage = responseData?.message || responseData?.detail || responseData?.errorCode || responseData?.error || (typeof responseData === 'string' ? responseData : '')
      setError(backendMessage || mapLocalError(err?.message) || err.message || 'บันทึกผลไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  // ─── Form View ─────────────────────────────────────────────────────────────
  const renderForm = () => (
    <div className="max-w-[900px] mx-auto space-y-6">

      {/* Step Indicator */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex justify-between items-center relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -z-10 -translate-y-1/2 px-12"></div>
        {['ข้อมูลบุคคล', 'ที่อยู่ติดต่อ', 'อาชีพและรายได้', 'สินเชื่อ', 'ภาระหนี้'].map((step, i) => (
          <div key={step} className="flex flex-col items-center gap-2 bg-white px-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold ${i === 0 ? 'bg-brand text-white shadow-md' : 'bg-slate-100 text-slate-400'}`}>{i + 1}</div>
            <span className={`text-[11px] font-bold ${i === 0 ? 'text-brand' : 'text-slate-400'}`}>{step}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="text-red-600 text-sm font-medium">{error}</p>
        </div>
      )}
      {optionsLoading && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500">
          กำลังโหลดตัวเลือกฟอร์มจาก backend...
        </div>
      )}

      {/* Part 1: Personal Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
          <h3 className="flex items-center gap-3 text-[18px] font-bold text-slate-800">
            <span className="material-symbols-outlined text-brand">account_circle</span>
            1. ข้อมูลส่วนบุคคล (Personal Information)
          </h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-3">
            <Field label="คำนำหน้า"><Select options={toOpts(OPTIONS.TITLE)} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></Field>
          </div>
          <div className="md:col-span-4">
            <Field label="ชื่อจริง"><Input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} /></Field>
          </div>
          <div className="md:col-span-5">
            <Field label="นามสกุล"><Input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} /></Field>
          </div>
          <div className="md:col-span-4">
            <Field label="เลขประจำตัวประชาชน"><Input value={form.idCard} maxLength={13} onChange={e => setForm({ ...form, idCard: e.target.value })} /></Field>
          </div>
          <div className="md:col-span-4">
            <Field label="อายุ (ปี) *">
              <Input type="number" value={Math.round(form["อายุวันเกิด"] / -365.25) || ''} onChange={e => setForm({ ...form, "อายุวันเกิด": Math.round((parseInt(e.target.value) || 0) * -365.25) })} />
            </Field>
          </div>
          <div className="md:col-span-4">
            <Field label="เพศ *"><Select options={toOpts(OPTIONS.GENDER, TRANS.GENDER)} value={form["เพศ"]} onChange={e => setForm({ ...form, "เพศ": e.target.value })} /></Field>
          </div>
          <div className="md:col-span-4">
            <Field label="ระดับการศึกษา *"><Select options={toOpts(OPTIONS.EDUCATION_TYPE, TRANS.EDU)} value={form["ระดับการศึกษา"]} onChange={e => setForm({ ...form, "ระดับการศึกษา": e.target.value })} /></Field>
          </div>
          <div className="md:col-span-4">
            <Field label="สถานภาพครอบครัว *"><Select options={toOpts(OPTIONS.FAMILY_STATUS, TRANS.FAM)} value={form["สถานภาพครอบครัว"]} onChange={e => setForm({ ...form, "สถานภาพครอบครัว": e.target.value })} /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="บุตร (คน) *"><Input type="number" value={form["จำนวนบุตร"]} onChange={e => setForm({ ...form, "จำนวนบุตร": parseInt(e.target.value) || 0 })} /></Field>
          </div>
          <div className="md:col-span-2">
            <Field label="สมาชิกบ้าน *"><Input type="number" value={form["จำนวนสมาชิกครอบครัว"]} onChange={e => setForm({ ...form, "จำนวนสมาชิกครอบครัว": parseInt(e.target.value) || 0 })} /></Field>
          </div>
        </div>
      </div>

      {/* Part 2: Contact & Address */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
          <h3 className="flex items-center gap-3 text-[18px] font-bold text-slate-800">
            <span className="material-symbols-outlined text-brand">home_pin</span>
            2. ข้อมูลที่อยู่ติดต่อ (Contact &amp; Address)
          </h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="เบอร์โทรศัพท์มือถือ"><Input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="อีเมล"><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></Field>
          <div className="md:col-span-2">
            <Field label="ลักษณะที่อยู่อาศัยปัจจุบัน *">
              <Select options={toOpts(OPTIONS.HOUSING_TYPE, TRANS.HOUSE)} value={form["ประเภทที่อยู่อาศัย"]} onChange={e => setForm({ ...form, "ประเภทที่อยู่อาศัย": e.target.value })} />
            </Field>
          </div>
          <div className="md:col-span-2">
            <Field label="ที่อยู่ (บ้านเลขที่, ซอย, ถนน)"><Input value={form.addressLine} onChange={e => setForm({ ...form, addressLine: e.target.value })} /></Field>
          </div>
          <Field label="รหัสจังหวัด (provinceCode) *">
            <Select
              options={optionLists.provinces.length ? optionLists.provinces : [{ value: '10', label: '10' }]}
              value={form.provinceCode}
              onChange={e => {
                const selected = optionLists.provinces.find(x => x.value === e.target.value)
                setForm({ ...form, provinceCode: e.target.value, province: selected?.label || form.province })
              }}
            />
          </Field>
          <Field label="จังหวัด"><Input value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} /></Field>
          <Field label="เขต/อำเภอ"><Input value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} /></Field>
          <Field label="แขวง/ตำบล"><Input value={form.subDistrict} onChange={e => setForm({ ...form, subDistrict: e.target.value })} /></Field>
          <Field label="รหัสไปรษณีย์"><Input value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} /></Field>
        </div>
      </div>

      {/* Part 3: Employment */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
          <h3 className="flex items-center gap-3 text-[18px] font-bold text-slate-800">
            <span className="material-symbols-outlined text-brand">work</span>
            3. อาชีพและแหล่งที่มาของรายได้ (Employment Details)
          </h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-5">
          <div className="md:col-span-6">
            <Field label="รหัสอาชีพ (occupationCode) *">
              <Select options={optionLists.occupations.length ? optionLists.occupations : [{ value: 'OFFICER', label: 'OFFICER' }]} value={form.occupationCode} onChange={e => setForm({ ...form, occupationCode: e.target.value })} />
            </Field>
          </div>
          <div className="md:col-span-6">
            <Field label="ประเภทอาชีพ *"><Select options={toOpts(OPTIONS.INCOME_TYPE, TRANS.WORK)} value={form["ประเภทอาชีพรายได้"]} onChange={e => setForm({ ...form, "ประเภทอาชีพรายได้": e.target.value })} /></Field>
          </div>
          <div className="md:col-span-6">
            <Field label="ประเภทงาน (employmentType) *">
              <Select
                options={optionLists.employmentTypes.length ? optionLists.employmentTypes : [{ value: 'FULL_TIME', label: 'FULL_TIME' }, { value: 'CONTRACT', label: 'CONTRACT' }, { value: 'SELF_EMPLOYED', label: 'SELF_EMPLOYED' }, { value: 'FREELANCE', label: 'FREELANCE' }, { value: 'UNEMPLOYED', label: 'UNEMPLOYED' }]}
                value={form.employmentType}
                onChange={e => setForm({ ...form, employmentType: e.target.value })}
              />
            </Field>
          </div>
          <div className="md:col-span-6">
            <Field label="ชื่อสถานที่ทำงาน / บริษัท"><Input value={form.employerName} onChange={e => setForm({ ...form, employerName: e.target.value })} /></Field>
          </div>
          <div className="md:col-span-4">
            <Field label="อายุงาน (เดือน) *">
              <Input type="number" value={Math.round(form["อายุงานวัน"] / -30.416) || ''} onChange={e => setForm({ ...form, "อายุงานวัน": Math.round((parseInt(e.target.value) || 0) * -30.416) })} />
            </Field>
          </div>
          <div className="md:col-span-4">
            <Field label="รายได้รวมประจำ (บาท/เดือน) *"><Input type="number" prefix="฿" value={form["รายได้รวม"]} onChange={e => setForm({ ...form, "รายได้รวม": parseFloat(e.target.value) || 0 })} /></Field>
          </div>
          <div className="md:col-span-4">
            <Field label="รายได้อื่นๆ (ถ้ามี)"><Input type="number" prefix="฿" value={form.extraIncome} onChange={e => setForm({ ...form, extraIncome: parseFloat(e.target.value) || 0 })} /></Field>
          </div>
        </div>
      </div>

      {/* Part 4: Loan Request & Assets */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
          <h3 className="flex items-center gap-3 text-[18px] font-bold text-slate-800">
            <span className="material-symbols-outlined text-brand">real_estate_agent</span>
            4. ข้อมูลการขอสินเชื่อและทรัพย์สิน (Loan &amp; Assets)
          </h3>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="ประเภทสินเชื่อที่ต้องการ *">
            <Select options={toOpts(OPTIONS.CONTRACT_TYPE, TRANS.CONTRACT)} value={form["ประเภทสินเชื่อ"]} onChange={e => setForm({ ...form, "ประเภทสินเชื่อ": e.target.value })} />
          </Field>
          <Field label="วัตถุประสงค์สินเชื่อ (loanPurposeCode) *">
            <Select options={optionLists.loanPurposes.length ? optionLists.loanPurposes : [{ value: 'HOME_PURCHASE', label: 'HOME_PURCHASE' }]} value={form.loanPurposeCode} onChange={e => setForm({ ...form, loanPurposeCode: e.target.value })} />
          </Field>
          <Field label="วงเงินสินเชื่อที่ขอ *"><Input type="number" prefix="฿" value={form["วงเงินสินเชื่อ"]} onChange={e => setForm({ ...form, "วงเงินสินเชื่อ": parseFloat(e.target.value) || 0 })} /></Field>
          <Field label="ค่างวดที่คาดว่าจะผ่อนต่อเดือน *"><Input type="number" prefix="฿" value={form["ค่างวดรายงวด"]} onChange={e => setForm({ ...form, "ค่างวดรายงวด": parseFloat(e.target.value) || 0 })} /></Field>
          <Field label="ระยะเวลาผ่อน (เดือน) — 0 = คำนวณอัตโนมัติ">
            <Input type="number" value={form.loanTermMonths} onChange={e => setForm({ ...form, loanTermMonths: parseInt(e.target.value) || 0 })} />
          </Field>
          <Field label="ราคาสินค้า/ทรัพย์สิน (ถ้ามี)"><Input type="number" prefix="฿" value={form["ราคาสินค้า"]} onChange={e => setForm({ ...form, "ราคาสินค้า": parseFloat(e.target.value) || 0 })} /></Field>
          <Field label="มีรถยนต์เป็นของตนเอง *"><Select options={toOpts(OPTIONS.YES_NO, TRANS.YES_NO)} value={form["มีรถยนต์"]} onChange={e => setForm({ ...form, "มีรถยนต์": e.target.value })} /></Field>
          <Field label="มีอสังหาริมทรัพย์เป็นของตนเอง *"><Select options={toOpts(OPTIONS.YES_NO, TRANS.YES_NO)} value={form["มีอสังหาริมทรัพย์"]} onChange={e => setForm({ ...form, "มีอสังหาริมทรัพย์": e.target.value })} /></Field>
        </div>
      </div>

      {/* Part 5: Debts */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5 flex justify-between items-center">
          <h3 className="flex items-center gap-3 text-[18px] font-bold text-slate-800">
            <span className="material-symbols-outlined text-brand">credit_score</span>
            5. ภาระหนี้สินปัจจุบัน (Existing Debts)
          </h3>
          <Button variant="ghost" icon="add" onClick={() => setForm({ ...form, debtInfos: [...form.debtInfos, { debtType: 'PERSONAL_LOAN', creditorName: '', outstandingAmount: 0, monthlyPayment: 0, delinquentDays: 0, isDefaulted: false }] })}>เพิ่มรายการหนี้</Button>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
            <Field label="ยอดหนี้คงเหลือรวม (บาท)"><Input type="number" prefix="฿" value={form.existingLoanBalance} onChange={e => setForm({ ...form, existingLoanBalance: parseFloat(e.target.value) || 0 })} /></Field>
            <Field label="ภาระหนี้เดิมที่ต้องผ่อน/เดือน (บาท)"><Input type="number" prefix="฿" value={form.monthlyDebtPayment} onChange={e => setForm({ ...form, monthlyDebtPayment: parseFloat(e.target.value) || 0 })} /></Field>
          </div>
          <div className="space-y-4">
            {form.debtInfos.map((debt, idx) => (
              <div key={idx} className="p-5 bg-slate-50 border border-slate-200 rounded-xl relative group">
                <button onClick={() => { const d = [...form.debtInfos]; d.splice(idx, 1); setForm({ ...form, debtInfos: d }) }} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                  <Field label="ประเภทหนี้">
                    <Select
                      options={optionLists.debtTypes.length ? optionLists.debtTypes : [{ value: 'PERSONAL_LOAN', label: 'สินเชื่อส่วนบุคคล' }, { value: 'CREDIT_CARD', label: 'บัตรเครดิต' }, { value: 'AUTO_LOAN', label: 'สินเชื่อรถยนต์' }, { value: 'MORTGAGE', label: 'สินเชื่อบ้าน' }]}
                      value={debt.debtType}
                      onChange={e => { const d = [...form.debtInfos]; d[idx].debtType = e.target.value; setForm({ ...form, debtInfos: d }) }}
                    />
                  </Field>
                  <Field label="ชื่อสถาบัน"><Input value={debt.creditorName} onChange={e => { const d = [...form.debtInfos]; d[idx].creditorName = e.target.value; setForm({ ...form, debtInfos: d }) }} /></Field>
                  <Field label="ยอดคงเหลือ (฿)"><Input type="number" value={debt.outstandingAmount} onChange={e => { const d = [...form.debtInfos]; d[idx].outstandingAmount = parseFloat(e.target.value) || 0; setForm({ ...form, debtInfos: d }) }} /></Field>
                  <Field label="ค่างวด/เดือน (฿)"><Input type="number" value={debt.monthlyPayment} onChange={e => { const d = [...form.debtInfos]; d[idx].monthlyPayment = parseFloat(e.target.value) || 0; setForm({ ...form, debtInfos: d }) }} /></Field>
                  <Field label="ค้างชำระ (วัน)"><Input type="number" value={debt.delinquentDays || 0} onChange={e => { const d = [...form.debtInfos]; d[idx].delinquentDays = parseInt(e.target.value) || 0; setForm({ ...form, debtInfos: d }) }} /></Field>
                  <Field label="เคยผิดนัด">
                    <Select options={[{ value: 'false', label: 'ไม่เคย' }, { value: 'true', label: 'เคย' }]} value={String(Boolean(debt.isDefaulted))} onChange={e => { const d = [...form.debtInfos]; d[idx].isDefaulted = e.target.value === 'true'; setForm({ ...form, debtInfos: d }) }} />
                  </Field>
                </div>
              </div>
            ))}
            {form.debtInfos.length === 0 && (
              <p className="text-sm text-slate-400 italic text-center py-4 bg-slate-50 rounded-xl border border-slate-100">ไม่มีรายการหนี้สิน</p>
            )}
          </div>
        </div>
      </div>

      {/* Part 6: Advanced JSON Extras */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
          <h3 className="flex items-center gap-3 text-[18px] font-bold text-slate-800">
            <span className="material-symbols-outlined text-brand">tune</span>
            6. Advanced Model Fields (กรอกให้เป๊ะตาม API)
          </h3>
          <p className="text-[12px] text-slate-500 mt-1">JSON object เพิ่มเติมเข้า applicantProfile / employmentInfo / financialInfo / modelFeatures โดยตรง</p>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Applicant Extras JSON">
            <textarea value={form.applicantExtrasJson} onChange={e => setForm({ ...form, applicantExtrasJson: e.target.value })} rows={8} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" placeholder='{"CODE_GENDER":"M","FLAG_OWN_CAR":"N"}' />
          </Field>
          <Field label="Employment Extras JSON">
            <textarea value={form.employmentExtrasJson} onChange={e => setForm({ ...form, employmentExtrasJson: e.target.value })} rows={8} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" placeholder='{"NAME_INCOME_TYPE":"Working","ORGANIZATION_TYPE":"Business Entity Type 3"}' />
          </Field>
          <Field label="Financial Extras JSON">
            <textarea value={form.financialExtrasJson} onChange={e => setForm({ ...form, financialExtrasJson: e.target.value })} rows={8} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" placeholder='{"WEEKDAY_APPR_PROCESS_START":"MONDAY","HOUR_APPR_PROCESS_START":9}' />
          </Field>
          <Field label="Model Features JSON (สำคัญ)">
            <textarea value={form.modelFeaturesJson} onChange={e => setForm({ ...form, modelFeaturesJson: e.target.value })} rows={8} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" placeholder='{"EXT_SOURCE_2":0.01,"EXT_SOURCE_3":0.01}' />
          </Field>
        </div>
      </div>

      {/* Part 7: External Scores */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-5">
          <h3 className="flex items-center gap-3 text-[18px] font-bold text-slate-800">
            <span className="material-symbols-outlined text-brand">analytics</span>
            7. คะแนนจากภายนอก (External Scores / Credit Bureau)
          </h3>
          <p className="text-[12px] text-slate-500 mt-1">คะแนนเหล่านี้มีผลกระทบสูงมากต่อโมเดล AI (0.00 – 1.00)</p>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Field label="EXT_SOURCE_1">
            <Input type="number" step="0.000001" value={form["คะแนนภายนอก1"]} onChange={e => setForm({ ...form, "คะแนนภายนอก1": parseFloat(e.target.value) || 0 })} />
          </Field>
          <Field label="EXT_SOURCE_2">
            <Input type="number" step="0.000001" value={form["คะแนนภายนอก2"]} onChange={e => setForm({ ...form, "คะแนนภายนอก2": parseFloat(e.target.value) || 0 })} />
          </Field>
          <Field label="EXT_SOURCE_3">
            <Input type="number" step="0.000001" value={form["คะแนนภายนอก3"]} onChange={e => setForm({ ...form, "คะแนนภายนอก3": parseFloat(e.target.value) || 0 })} />
          </Field>
        </div>
      </div>

      {/* Developer Options */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-500 mb-2 font-bold uppercase tracking-wider">Developer Options</p>
        <div className="flex gap-2 flex-wrap">
          <Button variant="secondary" onClick={applyApiTestLow} className="!py-2 !px-4 text-sm whitespace-nowrap !bg-emerald-50 !text-emerald-700 !border-emerald-200">Preset API LowRisk (case-low)</Button>
          <Button variant="secondary" onClick={applyApiTestMedium} className="!py-2 !px-4 text-sm whitespace-nowrap !bg-amber-50 !text-amber-700 !border-amber-200">Preset API MediumRisk (case-medium)</Button>
          <Button variant="secondary" onClick={applyApiTestHigh} className="!py-2 !px-4 text-sm whitespace-nowrap !bg-red-50 !text-red-700 !border-red-200">Preset API HighRisk (case-high)</Button>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="bg-white rounded-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] border border-slate-100 p-5 flex justify-between items-center sticky bottom-6 z-10">
        <Button variant="ghost" className="text-red-600" onClick={() => setForm(EMPTY_FORM)}>ล้างฟอร์มทั้งหมด</Button>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setForm(DEFAULT_FORM)} icon="auto_fix_high">เติมข้อมูลอัตโนมัติ (Mock)</Button>
          <Button onClick={handleCalculate} disabled={loading} icon="insights" className="px-8 shadow-md">
            {loading ? 'กำลังวิเคราะห์...' : 'ประมวลผลความเสี่ยง'}
          </Button>
        </div>
      </div>
    </div>
  )

  // ─── Result View ────────────────────────────────────────────────────────────
  const renderResult = () => {
    if (!result) return null

    const parsed = parseCalculatePreview(result as Record<string, unknown>)
    const displayDefaultProb = parsed.defaultProbability
    const rawScore = parsed.score > 0 ? parsed.score : parsed.creditScore
    const displayScore = Number.isFinite(Number(rawScore)) ? Math.round(Number(rawScore)) : null
    const scoreScale = parsed.scoreScale || (displayScore !== null && displayScore > 100 ? 850 : 100)
    const defaultProbPercent = displayDefaultProb <= 1 ? displayDefaultProb * 100 : displayDefaultProb
    const defaultProbRaw = displayDefaultProb <= 1 ? displayDefaultProb : displayDefaultProb / 100
    const riskLevelRaw = parsed.riskLevel
    const riskLevelLabel = parsed.riskLevelLabel || ''
    const dti = parsed.dti
    const recommendationType = parsed.recommendationType
    const recommendationLabel = parsed.recommendationLabel || ''
    const isApproved = recommendationType === 'APPROVE' || recommendationType === 'REVIEW' || recommendationType === 'REVIEW_MANUAL'
    const hasDecision = recommendationType && recommendationType.length > 0
    const primaryReason = parsed.primaryReason
    const aiResultRef = parsed.resultRef
    const scoreBreakdown = parsed.scoreBreakdown || []
    const riskFactors = parsed.riskFactors || []
    const recommendations = parsed.recommendations || []
    const savedAt = parsed.savedAt
    const inputSnapshot = parsed.inputSnapshot || {}
    const modelPayload = (inputSnapshot.modelPayload || {}) as Record<string, unknown>

    return (
      <div className="max-w-[1000px] mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">ผลการประเมินความน่าจะเป็นในการอนุมัติสินเชื่อ</h2>
          <Button variant="ghost" icon="edit" onClick={() => setViewState('FORM')}>กลับไปแก้ไขข้อมูล</Button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
            <span className="material-symbols-outlined text-red-500">error</span>
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Summary Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <div className="text-[12px] text-slate-500 mb-0.5">คะแนน (Score)</div>
              <div className="text-2xl font-bold text-brand">
                {displayScore ?? '-'} / {scoreScale || 100}
                {parsed.scoreGrade && <span className="ml-2 text-base text-slate-400 font-semibold">เกรด {parsed.scoreGrade}</span>}
              </div>
            </div>
            <div>
              <div className="text-[12px] text-slate-500 mb-0.5">Credit Score</div>
              <div className="text-2xl font-bold text-slate-800">{parsed.creditScore > 0 ? parsed.creditScore : '-'}</div>
            </div>
            <div>
              <div className="text-[12px] text-slate-500 mb-0.5">ระดับความเสี่ยง</div>
              <div className="text-xl font-bold">
                <RiskPill level={riskLevelRaw} />
                {riskLevelLabel && <span className="ml-2 text-sm text-slate-500 font-medium">{riskLevelLabel}</span>}
              </div>
            </div>
            <div>
              <div className="text-[12px] text-slate-500 mb-0.5">DTI (หนี้/รายได้)</div>
              <div className="text-xl font-bold text-slate-800">{typeof dti === 'number' && dti > 0 ? (dti * 100).toFixed(1) + '%' : '-'}</div>
            </div>
            <div>
              <div className="text-[12px] text-slate-500 mb-0.5">Default Probability</div>
              <div className="text-xl font-bold text-slate-800">{defaultProbPercent.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-[12px] text-slate-500 mb-0.5">คำแนะนำ</div>
              <div className={`text-xl font-bold ${recommendationType === 'REJECT' ? 'text-red-600' : recommendationType === 'APPROVE' ? 'text-emerald-600' : 'text-amber-600'}`}>
                {recommendationType || '-'}
                {recommendationLabel && <span className="ml-2 text-sm text-slate-500 font-medium">({recommendationLabel})</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Col */}
          <div className="lg:col-span-2 space-y-6">

            {/* Decision Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                  <span className="material-symbols-outlined text-[24px]">{isApproved ? 'check_circle' : 'cancel'}</span>
                </div>
                <div>
                  <h4 className="text-[16px] font-bold text-slate-800 mb-1">มติเบื้องต้น (Preliminary Decision)</h4>
                  <p className={`text-[15px] font-bold ${isApproved ? 'text-emerald-600' : 'text-red-600'}`}>
                    {!hasDecision ? '⏳ รอผลตัดสินจาก API' : isApproved ? '✅ อนุมัติเบื้องต้น (Approve)' : '❌ ปฏิเสธเบื้องต้น (Reject)'}
                  </p>
                  <p className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                    ผู้สมัครมีความน่าจะเป็นในการผิดนัดชำระหนี้ (Default Probability) อยู่ที่{' '}
                    <strong className="text-slate-800">{defaultProbPercent.toFixed(2)}%</strong>{' '}
                    จัดอยู่ในเกณฑ์ <strong className="text-slate-800">{riskLevelRaw}</strong>
                    {riskLevelLabel && <span> ({riskLevelLabel})</span>}
                  </p>
                  {primaryReason && <p className="text-[12px] text-slate-500 mt-1">{primaryReason}</p>}
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            {scoreBreakdown.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h4 className="text-[15px] font-bold text-slate-800 mb-4">Score Breakdown</h4>
                <div className="space-y-2.5">
                  {scoreBreakdown.map((item, index) => (
                    <div key={`${item.code || 'break'}-${index}`} className="flex justify-between gap-3 py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-[13px] font-semibold text-slate-700">{item.labelTh || formatCodeLabel(item.code) || `รายการ ${index + 1}`}</p>
                        {item.detail && <p className="text-[12px] text-slate-500">{item.detail}</p>}
                      </div>
                      <p className={`text-[13px] font-bold shrink-0 ${(item.scoreDelta || 0) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {(item.scoreDelta || 0) >= 0 ? '+' : ''}{Number(item.scoreDelta || 0).toFixed(0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Risk Factors */}
            {riskFactors.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h4 className="text-[15px] font-bold text-slate-800 mb-4">ปัจจัยความเสี่ยง</h4>
                <div className="space-y-2.5">
                  {riskFactors.map((f, index) => (
                    <div key={`${f.code}-${index}`} className="flex justify-between gap-3 py-2 border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-[13px] font-semibold text-slate-700">{f.labelTh}</p>
                        {f.detail && <p className="text-[12px] text-slate-500">{f.detail}</p>}
                      </div>
                      <p className={`text-[13px] font-bold shrink-0 ${f.impactDirection === 'POSITIVE' ? 'text-emerald-600' : f.impactDirection === 'NEGATIVE' ? 'text-red-600' : 'text-slate-500'}`}>
                        {f.impactDirection === 'POSITIVE' ? '+' : f.impactDirection === 'NEGATIVE' ? '-' : ''}{Math.abs(f.impactScore || 0)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Input Snapshot */}
            {(Object.keys(inputSnapshot).length > 0 || Object.keys(modelPayload).length > 0) && (
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <p className="font-bold text-[13px] text-slate-700 mb-2">Input Snapshot</p>
                <div className="text-xs text-slate-600">
                  {Object.entries(inputSnapshot).map(([k, v]) =>
                    k !== 'modelPayload' ? (
                      <div key={k}><span className="font-bold">{k}:</span> {String(v)}</div>
                    ) : null
                  )}
                  {Object.keys(modelPayload).length > 0 && (
                    <div className="mt-2">
                      <div className="font-bold mb-1">modelPayload:</div>
                      <pre className="bg-white border border-slate-200 rounded p-2 text-xs overflow-x-auto">{JSON.stringify(modelPayload, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Col */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <h3 className="font-bold text-[15px] text-slate-800 mb-5 pb-3 border-b border-slate-100">สรุปข้อมูลผู้ขอสินเชื่อ</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">ชื่อ-นามสกุล</p>
                    <p className="text-[13px] font-semibold text-slate-800">{form.title}{form.firstName} {form.lastName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">บัตรปชช: {form.idCard || '-'}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <span className="material-symbols-outlined text-[16px]">work</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">อาชีพ / รายได้</p>
                    <p className="text-[13px] font-semibold text-slate-800">{TRANS.WORK[form["ประเภทอาชีพรายได้"]] || form["ประเภทอาชีพรายได้"]}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{money(form["รายได้รวม"])} บาท/เดือน</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                    <span className="material-symbols-outlined text-[16px]">credit_card</span>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">คำขอสินเชื่อ</p>
                    <p className="text-[13px] font-semibold text-slate-800">{TRANS.CONTRACT[form["ประเภทสินเชื่อ"]] || form["ประเภทสินเชื่อ"]}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">ขอ {money(form["วงเงินสินเชื่อ"])} (ผ่อน {money(form["ค่างวดรายงวด"])})</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Result Ref</p>
              <p className="text-[11px] font-mono text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded inline-block">{aiResultRef}</p>
              {savedAt && <p className="text-[11px] text-slate-500 mt-2">บันทึกแล้ว: {savedAt}</p>}
            </div>

            <div className="bg-white rounded-xl p-4 border border-slate-100">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Model ML</p>
              <p className="text-[12px] text-slate-600">
                defaultProbability: <span className="font-mono font-semibold text-slate-800">{defaultProbRaw.toFixed(6)}</span>
              </p>
            </div>

            {recommendations.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h4 className="text-[15px] font-bold text-slate-800 mb-4">คำแนะนำการพิจารณา</h4>
                <div className="space-y-2.5">
                  {[...recommendations].sort((a, b) => a.priority - b.priority).map((r, index) => (
                    <div key={`${r.type}-${index}`} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60">
                      <p className="text-[13px] font-semibold text-slate-700">{r.titleTh}</p>
                      <p className="text-[12px] text-slate-500 mt-1">{r.descriptionTh}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-4">
              <Button fullWidth onClick={handleSaveAssessment} disabled={saving} className="py-3 font-bold text-[15px] shadow-md">
                {saving ? 'กำลังบันทึกผล...' : 'บันทึกผล'}
              </Button>
              <Button variant="secondary" fullWidth onClick={() => setViewState('FORM')} className="py-3 font-bold text-[15px] bg-slate-100 text-slate-600 border-none hover:bg-slate-200">แก้ไขข้อมูล</Button>
              <Button variant="ghost" fullWidth onClick={() => router.push('/history')} className="py-3 font-bold text-[14px] text-brand hover:bg-brand/5 mt-2">ดูประวัติการประเมิน</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-app-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar breadcrumbs={[{ label: 'ประเมินความเสี่ยงใหม่ (แบบฟอร์มเต็ม)', path: '/predict' }]} />
        <main className="flex-1 overflow-y-auto p-7 pb-20">
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-slate-900 leading-tight">ใบคำขอสินเชื่อ (Application Form)</h1>
            <p className="text-slate-500 mt-1.5 text-[15px]">กรอกข้อมูลเพื่อประเมินโอกาสในการอนุมัติสินเชื่อผ่านโมเดล AI</p>
          </div>
          {viewState === 'FORM' ? renderForm() : renderResult()}
        </main>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { calculateCreditScore } from '../../../services/scoringService'

const INIT_FORM = {
  fullName: '', age: '', province: '', region: '',
  employmentType: '', occupation: '', companyName: '', jobYears: '',
  incomeStability: '', monthlyIncome: '', otherIncome: '',
  monthlyDebt: '', numCreditors: '', creditHistoryYears: '',
  loanAmount: '', loanTerm: '',
  paymentHistory: '', numLatePayments: '', hasDefault: 'no',
}

export function useAssessmentForm() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INIT_FORM)
  const [errors, setErrors] = useState({})

  const updateField = (name, value) => {
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validateStep = (currentStep) => {
    const e = {}
    if (currentStep === 0) {
      if (!form.fullName) e.fullName = 'กรุณาระบุชื่อ'
      if (!form.province) e.province = 'กรุณาเลือกจังหวัด'
    }
    if (currentStep === 1) {
      if (!form.employmentType) e.employmentType = 'กรุณาเลือกประเภทการจ้างงาน'
      if (!form.monthlyIncome) e.monthlyIncome = 'กรุณาระบุรายได้'
      if (!form.incomeStability) e.incomeStability = 'กรุณาเลือกความสม่ำเสมอของรายได้'
    }
    if (currentStep === 2) {
      if (!form.creditHistoryYears) e.creditHistoryYears = 'กรุณาระบุอายุสินเชื่อ'
    }
    if (currentStep === 3) {
      if (!form.paymentHistory) e.paymentHistory = 'กรุณาเลือกประวัติการชำระ'
      if (!form.loanAmount) e.loanAmount = 'กรุณาระบุวงเงินที่ขอ'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) setStep(s => Math.min(3, s + 1))
  }

  const handlePrev = () => setStep(s => Math.max(0, s - 1))

  const handleReset = () => {
    setForm(INIT_FORM)
    setStep(0)
    setErrors({})
  }

  const getResult = () => {
    if (!validateStep(step)) return null
    return calculateCreditScore(form)
  }

  return {
    step,
    form,
    errors,
    updateField,
    handleNext,
    handlePrev,
    handleReset,
    getResult,
    setStep
  }
}

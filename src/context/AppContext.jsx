import { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

// Mock history data
const MOCK_HISTORY = [
  {
    id: 'CR-2024-0128', name: 'บริษัท แมคโครเทค ซิสเต็มส์ จำกัด', date: '24 ต.ค. 2567',
    score: 810, riskLevel: 'low', riskLabel: 'ความเสี่ยงต่ำ',
    recommendation: 'อนุมัติสินเชื่อได้ทันที เข้าเงื่อนไขมาตรฐาน',
    formData: { fullName: 'บริษัท แมคโครเทค ซิสเต็มส์ จำกัด', age: '', province: 'กรุงเทพมหานคร', monthlyIncome: '200000', monthlyDebt: '30000', employmentType: 'permanentPrivate', paymentHistory: 'alwaysOnTime', incomeStability: 'veryStable', creditHistoryYears: '8', loanAmount: '5000000', loanTerm: '60' },
    dsr: 15, breakdown: {}
  },
  {
    id: 'CR-2024-0127', name: 'สมปอง พาณิชย์กิจ', date: '23 ต.ค. 2567',
    score: 412, riskLevel: 'high', riskLabel: 'ความเสี่ยงสูง',
    recommendation: 'ควรปฏิเสธหรือพักการพิจารณา ต้องตรวจสอบหนี้สินเชิงลึก',
    formData: { fullName: 'สมปอง พาณิชย์กิจ', age: '45', province: 'เชียงใหม่', monthlyIncome: '28000', monthlyDebt: '18000', employmentType: 'freelance', paymentHistory: 'lateOver60', incomeStability: 'unstable', creditHistoryYears: '2', loanAmount: '500000', loanTerm: '36' },
    dsr: 64, breakdown: {}
  },
  {
    id: 'CR-2024-0126', name: 'บจก. วิชั่นเน็ตเวิร์ค', date: '22 ต.ค. 2567',
    score: 635, riskLevel: 'medium', riskLabel: 'ความเสี่ยงปานกลาง',
    recommendation: 'ควรขอเอกสารประกอบเพิ่มเติม พิจารณาปรับลดวงเงิน',
    formData: { fullName: 'บจก. วิชั่นเน็ตเวิร์ค', age: '', province: 'นนทบุรี', monthlyIncome: '85000', monthlyDebt: '28000', employmentType: 'selfEmployed', paymentHistory: 'lateUnder30', incomeStability: 'moderate', creditHistoryYears: '4', loanAmount: '2000000', loanTerm: '60' },
    dsr: 33, breakdown: {}
  },
  {
    id: 'CR-2024-0125', name: 'สมชาย ใจดี', date: '20 ต.ค. 2567',
    score: 755, riskLevel: 'low', riskLabel: 'ความเสี่ยงต่ำ',
    recommendation: 'อนุมัติสินเชื่อได้ทันที เข้าเงื่อนไขมาตรฐาน',
    formData: { fullName: 'สมชาย ใจดี', age: '35', province: 'กรุงเทพมหานคร', monthlyIncome: '45000', monthlyDebt: '12500', employmentType: 'permanentPrivate', paymentHistory: 'alwaysOnTime', incomeStability: 'stable', creditHistoryYears: '5', loanAmount: '850000', loanTerm: '60' },
    dsr: 28, breakdown: {}
  },
]

export function AppProvider({ children }) {
  const [history, setHistory] = useState(MOCK_HISTORY)
  const [currentResult, setCurrentResult] = useState(null)
  const [user] = useState({ name: 'เจ้าหน้าที่สินเชื่อ', initials: 'LO' })

  function saveResult(result) {
    const newEntry = {
      id: `CR-2024-${String(history.length + 129).padStart(4, '0')}`,
      name: result.formData.fullName || 'ไม่ระบุชื่อ',
      date: new Date().toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' }),
      score: result.score,
      riskLevel: result.riskLevel,
      riskLabel: result.riskLabel,
      recommendation: result.recommendation,
      formData: result.formData,
      dsr: result.dsr,
      breakdown: result.breakdown,
      factors: result.factors,
    }
    setHistory(prev => [newEntry, ...prev])
    return newEntry.id
  }

  return (
    <AppContext.Provider value={{ history, currentResult, setCurrentResult, saveResult, user }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}

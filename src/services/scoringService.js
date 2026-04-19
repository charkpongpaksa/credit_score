/**
 * Feature weights and configurations for scoring logic
 */
export const WEIGHTS = {
  paymentHistory: {
    alwaysOnTime:     0.35,
    lateUnder30:      0.20,
    late30to60:       0.05,
    lateOver60:      -0.15,
    defaultHistory:  -0.35,
  },
  dsrScore: {
    under20:   0.30,
    under30:   0.20,
    under40:   0.05,
    under50:  -0.10,
    over50:   -0.30,
  },
  creditAge: {
    over5years:    0.15,
    over3years:    0.10,
    over1year:     0.05,
    under1year:   -0.05,
    noHistory:    -0.10,
  },
  employment: {
    government:       0.10,
    permanentPrivate: 0.08,
    contractPrivate:  0.02,
    selfEmployed:    -0.02,
    freelance:       -0.05,
    unemployed:      -0.10,
  },
  incomeStability: {
    veryStable:     0.10,
    stable:         0.07,
    moderate:       0.02,
    unstable:      -0.05,
    veryUnstable:  -0.10,
  },
}

function getDSRCategory(monthlyIncome, monthlyDebt) {
  if (!monthlyIncome || Math.abs(monthlyIncome) < 0.01) return 'over50'
  const dsr = (monthlyDebt / monthlyIncome) * 100
  if (dsr < 20) return 'under20'
  if (dsr < 30) return 'under30'
  if (dsr < 40) return 'under40'
  if (dsr < 50) return 'under50'
  return 'over50'
}

function getCreditAgeCategory(years) {
  const y = parseFloat(years) || 0
  if (y === 0) return 'noHistory'
  if (y < 1)   return 'under1year'
  if (y < 3)   return 'over1year'
  if (y < 5)   return 'over3years'
  return 'over5years'
}

/**
 * Main Scoring Engine
 */
export function calculateCreditScore(formData) {
  let totalWeight = 0
  const breakdown = {}

  // 1. Payment History
  const paymentKey = formData.paymentHistory || 'lateUnder30'
  const paymentScore = WEIGHTS.paymentHistory[paymentKey] ?? 0
  totalWeight += paymentScore
  breakdown.paymentHistory = {
    label: 'ประวัติการชำระหนี้',
    key: paymentKey,
    weight: paymentScore,
    maxWeight: 0.35,
    pct: Math.round(((paymentScore + 0.35) / 0.70) * 100),
  }

  // 2. DSR
  const dsrKey = getDSRCategory(
    parseFloat(formData.monthlyIncome),
    parseFloat(formData.monthlyDebt)
  )
  const dsrScore = WEIGHTS.dsrScore[dsrKey] ?? 0
  totalWeight += dsrScore
  const dsr = formData.monthlyIncome
    ? Math.round((parseFloat(formData.monthlyDebt || 0) / parseFloat(formData.monthlyIncome)) * 100)
    : 0
  breakdown.dsr = {
    label: 'ภาระหนี้ต่อรายได้ (DSR)',
    key: dsrKey,
    weight: dsrScore,
    maxWeight: 0.30,
    value: dsr,
    pct: Math.round(((dsrScore + 0.30) / 0.60) * 100),
  }

  // 3. Credit Age
  const creditAgeKey = getCreditAgeCategory(formData.creditHistoryYears)
  const creditAgeScore = WEIGHTS.creditAge[creditAgeKey] ?? 0
  totalWeight += creditAgeScore
  breakdown.creditAge = {
    label: 'อายุประวัติสินเชื่อ',
    key: creditAgeKey,
    weight: creditAgeScore,
    maxWeight: 0.15,
    pct: Math.round(((creditAgeScore + 0.10) / 0.25) * 100),
  }

  // 4. Employment
  const employmentKey = formData.employmentType || 'contractPrivate'
  const employmentScore = WEIGHTS.employment[employmentKey] ?? 0
  totalWeight += employmentScore
  breakdown.employment = {
    label: 'ประเภทการจ้างงาน',
    key: employmentKey,
    weight: employmentScore,
    maxWeight: 0.10,
    pct: Math.round(((employmentScore + 0.10) / 0.20) * 100),
  }

  // 5. Income Stability
  const incomeKey = formData.incomeStability || 'moderate'
  const incomeScore = WEIGHTS.incomeStability[incomeKey] ?? 0
  totalWeight += incomeScore
  breakdown.incomeStability = {
    label: 'ความสม่ำเสมอของรายได้',
    key: incomeKey,
    weight: incomeScore,
    maxWeight: 0.10,
    pct: Math.round(((incomeScore + 0.10) / 0.20) * 100),
  }

  // Map to FICO-like 300–850
  const normalized = (totalWeight - (-1.0)) / (1.0 - (-1.0))
  const score = Math.round(300 + normalized * 550)
  const clampedScore = Math.min(850, Math.max(300, score))

  let riskLevel, riskLabel, riskColor, recommendation
  if (clampedScore >= 700) {
    riskLevel = 'low'
    riskLabel = 'ความเสี่ยงต่ำ'
    riskColor = '#006329'
    recommendation = 'อนุมัติสินเชื่อได้ทันที เข้าเงื่อนไขมาตรฐาน อาจพิจารณาเสนอวงเงินพิเศษ'
  } else if (clampedScore >= 550) {
    riskLevel = 'medium'
    riskLabel = 'ความเสี่ยงปานกลาง'
    riskColor = '#4059aa'
    recommendation = 'ควรขอเอกสารประกอบเพิ่มเติม พิจารณาปรับลดวงเงิน หรือขอหลักทรัพย์ค้ำประกัน'
  } else {
    riskLevel = 'high'
    riskLabel = 'ความเสี่ยงสูง'
    riskColor = '#ba1a1a'
    recommendation = 'ควรปฏิเสธหรือพักการพิจารณา ต้องตรวจสอบหนี้สินเชิงลึก และขอผู้ค้ำประกันเพิ่มเติม'
  }

  const factors = Object.entries(breakdown)
    .map(([k, v]) => ({ ...v, id: k }))
    .sort((a, b) => a.weight - b.weight)
    .slice(0, 3)
    .map((f) => ({
      id: f.id,
      label: f.label,
      impact: f.weight < 0 ? 'negative' : f.weight < 0.05 ? 'neutral' : 'positive',
      weight: f.weight,
    }))

  return {
    score: clampedScore,
    riskLevel,
    riskLabel,
    riskColor,
    recommendation,
    breakdown,
    factors,
    dsr,
    rawWeight: totalWeight,
  }
}

/**
 * Format number to Thai Baht currency string
 */
export const formatCurrency = (value) => {
  if (value === undefined || value === null || isNaN(value)) return '-'
  return `฿${Number(value).toLocaleString()}`
}

/**
 * Format date to Thai locale
 */
export const formatDateLong = (dateString) => {
  if (!dateString) return '-'
  try {
    const d = new Date(dateString)
    return d.toLocaleDateString('th-TH', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    })
  } catch (e) {
    return dateString
  }
}

/**
 * Get current Thai date string
 */
export const getCurrentThaiDate = () => {
  return new Date().toLocaleDateString('th-TH', { 
    day: '2-digit', 
    month: 'short', 
    year: 'numeric' 
  })
}

/**
 * Calculate DSR Percentage
 */
export const calculateDSR = (monthlyIncome, monthlyDebt) => {
  const income = parseFloat(monthlyIncome) || 0
  const debt = parseFloat(monthlyDebt) || 0
  if (income === 0) return 0
  return Math.round((debt / income) * 100)
}

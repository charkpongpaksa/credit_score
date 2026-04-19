// Assessment API Types — aligned with actual backend response shapes

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type AssessmentStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'RE_EVALUATED' | 'CANCELLED'
export type RecommendationType = 'APPROVE' | 'REJECT' | 'REVIEW' | 'INFO'

// ── 1) List / Pagination ──────────────────────────────────────────────────────
export interface AssessmentListItem {
  id: string                          // UUID — use as assessmentId
  assessmentNo: string
  applicantName: string
  status: AssessmentStatus
  submittedAt: string | null
  score: number | null
  riskLevel: RiskLevel | null
  recommendationType: RecommendationType | null
}

export interface AssessmentPagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

export interface AssessmentList {
  items: AssessmentListItem[]
  pagination: AssessmentPagination
}

// ── 2) Detail (full nested) ───────────────────────────────────────────────────
export interface AssessmentMeta {
  id: string
  assessmentNo: string
  status: AssessmentStatus
}

export interface ApplicantProfile {
  firstName: string
  lastName: string
  dateOfBirth: string
  ageYears: number
  maritalStatus: string
  provinceCode: string
  district: string
  postalCode?: string
}

export interface EmploymentInfo {
  occupationCode: string
  employmentType: string
  employerName?: string
  jobTenureMonths: number
  monthlyIncome: number
  additionalIncome: number
}

export interface FinancialInfo {
  requestedLoanAmount: number
  loanTermMonths: number
  loanPurposeCode: string
  monthlyDebtPayment: number
  existingLoanBalance: number
  debtServiceRatio: number
  netMonthlyIncome: number
}

export interface DebtInfo {
  debtType: string
  creditorName?: string
  outstandingAmount: number
  monthlyPayment: number
  delinquentDays: number
  isDefaulted: boolean
}

export interface AssessmentResultData {
  resultId: string
  score: number
  creditScore: number
  scoreGrade: string
  defaultProbability: number
  riskLevel: RiskLevel
  recommendationType: RecommendationType
  primaryReason: string
  createdAt: string
}

export interface StatusLog {
  fromStatus: string
  toStatus: string
  reason: string
  createdAt: string
}

export interface AssessmentDetail {
  assessment: AssessmentMeta
  applicantProfile: ApplicantProfile
  employmentInfo: EmploymentInfo
  financialInfo: FinancialInfo
  debtInfos: DebtInfo[]
  result?: AssessmentResultData
  statusLogs?: StatusLog[]
}

// ── 3) Result (standalone) ────────────────────────────────────────────────────
export interface AssessmentResult {
  assessmentId: string
  resultId: string
  score: number
  scoreScale: number
  creditScore: number
  scoreGrade: string
  riskLevel: RiskLevel
  defaultProbability: number
  recommendationType: RecommendationType
  primaryReason: string
  createdAt: string
}

// ── 4) Risk Factors ───────────────────────────────────────────────────────────
export interface RiskFactor {
  code: string
  labelTh: string
  impactDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL'
  impactScore: number
  detail: string
}

export interface RiskFactors {
  assessmentId: string
  riskResultId: string
  factors: RiskFactor[]
}

// ── 5) Recommendations ────────────────────────────────────────────────────────
export interface Recommendation {
  type: RecommendationType
  titleTh: string
  descriptionTh: string
  priority: number
  isPrimary: boolean
}

export interface Recommendations {
  assessmentId: string
  recommendations: Recommendation[]
}

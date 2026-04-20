// Assessment API Types — aligned with actual backend response shapes

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH'
export type AssessmentStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'RE_EVALUATED' | 'CANCELLED'
export type RecommendationType = 'APPROVE' | 'REJECT' | 'REVIEW' | 'REVIEW_MANUAL' | 'INFO'

export interface AssessmentCreatePayload {
  applicantProfile: {
    firstName: string
    lastName: string
    nationalIdHash?: string
    dateOfBirth: string
    maritalStatus?: string
    provinceCode: string
    district?: string
    postalCode?: string
    gender?: string
    [key: string]: unknown
  }
  employmentInfo: {
    occupationCode: string
    employmentType: string
    employerName?: string
    jobTenureMonths: number
    monthlyIncome: number
    additionalIncome: number
    [key: string]: unknown
  }
  financialInfo: {
    requestedLoanAmount: number
    loanTermMonths: number
    loanPurposeCode: string
    monthlyDebtPayment: number
    existingLoanBalance: number
    [key: string]: unknown
  }
  debtInfos: Array<{
    debtType: string
    creditorName?: string
    outstandingAmount: number
    monthlyPayment: number
    delinquentDays: number
    isDefaulted: boolean
    [key: string]: unknown
  }>
  contactInfo?: {
    phoneNumber?: string
    email?: string
    address?: string
    [key: string]: unknown
  }
  documentInfos?: Array<{
    documentType: string
    documentNumber?: string
    issueDate?: string
    expiryDate?: string
    [key: string]: unknown
  }>
  modelFeatures?: Record<string, unknown>
  note?: string
  [key: string]: unknown
}

export interface AssessmentCreateResponse {
  assessmentId: string
  assessmentNo?: string
  status?: AssessmentStatus
}

export interface AssessmentFormOptions {
  [key: string]: unknown
}

// ── 0) Unified Evaluation Payload (calculate / submit / re-evaluate) ───────
export interface ScoreBreakdownItem {
  code?: string;
  label?: string; // ภาษาไทยหรืออังกฤษ
  labelTh?: string;
  labelEn?: string;
  score?: number;
  value?: number;
  scoreDelta?: number;
  reason?: string;
  impact?: number;
  detail?: string;
  [key: string]: unknown;
}

export interface AssessmentEvaluationData {
  assessmentId?: string;
  resultId?: string;
  score?: number;
  scoreScale?: number;
  creditScore?: number;
  scoreGrade?: string;
  defaultProbability?: number;
  riskLevel?: RiskLevel | string;
  riskLevelLabel?: string;
  dti?: number;
  recommendationType?: RecommendationType | string;
  recommendationLabel?: string;
  primaryReason?: string;
  scoreBreakdown?: ScoreBreakdownItem[];
  riskFactors?: RiskFactor[];
  recommendations?: Recommendation[];
  inputSnapshot?: InputSnapshot;
  savedAt?: string;
  [key: string]: unknown;
}

export interface InputSnapshot {
  monthlyIncome?: number;
  monthlyDebtPayment?: number;
  occupation?: string;
  province?: string;
  modelPayload?: Record<string, unknown>;
  [key: string]: unknown;
}

// ── 1) List / Pagination ──────────────────────────────────────────────────────
export interface AssessmentListItem {
  id: string                          // UUID — use as assessmentId
  assessmentNo: string
  applicantName: string
  status: AssessmentStatus
  createdAt?: string | null
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
  createdAt?: string
}

// ── 4) Risk Factors ───────────────────────────────────────────────────────────
export interface RiskFactor {
  code: string;
  labelTh?: string;
  labelEn?: string;
  impactDirection: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  impactScore: number;
  detail?: string;
}

export interface RiskFactors {
  assessmentId: string
  riskResultId: string
  factors: RiskFactor[]
}

// ── 5) Recommendations ────────────────────────────────────────────────────────
export interface Recommendation {
  type: RecommendationType;
  titleTh: string;
  descriptionTh: string;
  priority: number;
  isPrimary: boolean;
  // เพิ่มภาษาอังกฤษหากต้องการ
  titleEn?: string;
  descriptionEn?: string;
}

export interface Recommendations {
  assessmentId: string
  recommendations: Recommendation[]
}

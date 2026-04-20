import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import {
  AssessmentList,
  AssessmentResult,
  RiskFactors,
  Recommendations,
  AssessmentDetail,
  AssessmentCreatePayload,
  AssessmentCreateResponse,
  AssessmentFormOptions,
  AssessmentEvaluationData,
} from '../../types/assessment'

// GET /api/v1/assessments
export async function getAssessmentList(params?: {
  page?: number
  pageSize?: number
  search?: string
  riskLevel?: string
  status?: string
  dateFrom?: string
  dateTo?: string
  sortBy?: string
  sortOrder?: string
}): Promise<AssessmentList> {
  const query = new URLSearchParams()
  if (params?.page)       query.set('page',       String(params.page))
  if (params?.pageSize)   query.set('pageSize',   String(params.pageSize))
  if (params?.search)     query.set('search',     params.search)
  if (params?.riskLevel)  query.set('riskLevel',  params.riskLevel)
  if (params?.status)     query.set('status',     params.status)
  if (params?.dateFrom)   query.set('dateFrom',   params.dateFrom)
  if (params?.dateTo)     query.set('dateTo',     params.dateTo)
  if (params?.sortBy)     query.set('sortBy',     params.sortBy)
  if (params?.sortOrder)  query.set('sortOrder',  params.sortOrder)

  const qs = query.toString()
  const response = await axiosInstance.get(
    `/api/v1/assessments${qs ? `?${qs}` : ''}`
  )
  return extractApiData<AssessmentList>(response.data)
}

// GET /api/v1/assessments/form-options
export async function getAssessmentFormOptions(): Promise<AssessmentFormOptions> {
  const response = await axiosInstance.get('/api/v1/assessments/form-options')
  return extractApiData<AssessmentFormOptions>(response.data)
}

// GET /api/v1/assessments/{id}/detail
export async function getAssessmentDetail(id: string): Promise<AssessmentDetail> {
  const response = await axiosInstance.get(
    `/api/v1/assessments/${id}/detail`
  )
  return extractApiData<AssessmentDetail>(response.data)
}

// GET /api/v1/assessments/{id}/result
export async function getAssessmentResult(id: string): Promise<AssessmentResult> {
  const response = await axiosInstance.get(
    `/api/v1/assessments/${id}/result`
  )
  return extractApiData<AssessmentResult>(response.data)
}

// GET /api/v1/assessments/{id}/risk-factors
export async function getAssessmentRiskFactors(id: string): Promise<RiskFactors> {
  const response = await axiosInstance.get(
    `/api/v1/assessments/${id}/risk-factors`
  )
  return extractApiData<RiskFactors>(response.data)
}

// GET /api/v1/assessments/{id}/recommendations
export async function getAssessmentRecommendations(id: string): Promise<Recommendations> {
  const response = await axiosInstance.get(
    `/api/v1/assessments/${id}/recommendations`
  )
  return extractApiData<Recommendations>(response.data)
}

// POST /api/v1/assessments
export async function createAssessment(payload: AssessmentCreatePayload): Promise<AssessmentCreateResponse> {
  const response = await axiosInstance.post('/api/v1/assessments', payload)
  return extractApiData<AssessmentCreateResponse>(response.data)
}

// PUT /api/v1/assessments/{id}
export async function updateAssessment(id: string, payload: AssessmentCreatePayload): Promise<void> {
  await axiosInstance.put(`/api/v1/assessments/${id}`, payload)
}

// POST /api/v1/assessments/calculate
export async function calculateAssessmentPreview(payload: AssessmentCreatePayload): Promise<AssessmentEvaluationData> {
  const response = await axiosInstance.post('/api/v1/assessments/calculate', payload)
  return extractApiData<AssessmentEvaluationData>(response.data)
}

// POST /api/v1/assessments/{id}/submit
export async function submitAssessment(
  id: string,
  payload?: AssessmentCreatePayload
): Promise<AssessmentEvaluationData> {
  const response = await axiosInstance.post(`/api/v1/assessments/${id}/submit`, payload ?? {})
  return extractApiData<AssessmentEvaluationData>(response.data)
}

import axiosInstance from '../axios'
import {
  AssessmentList,
  AssessmentResult,
  RiskFactors,
  Recommendations,
  AssessmentDetail,
} from '../../types/assessment'

type ApiWrap<T> = { success: boolean; message: string; data: T }

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
  const response = await axiosInstance.get<ApiWrap<AssessmentList>>(
    `/api/v1/assessments${qs ? `?${qs}` : ''}`
  )
  return response.data.data
}

// GET /api/v1/assessments/{id}/detail
export async function getAssessmentDetail(id: string): Promise<AssessmentDetail> {
  const response = await axiosInstance.get<ApiWrap<AssessmentDetail>>(
    `/api/v1/assessments/${id}/detail`
  )
  return response.data.data
}

// GET /api/v1/assessments/{id}/result
export async function getAssessmentResult(id: string): Promise<AssessmentResult> {
  const response = await axiosInstance.get<ApiWrap<AssessmentResult>>(
    `/api/v1/assessments/${id}/result`
  )
  return response.data.data
}

// GET /api/v1/assessments/{id}/risk-factors
export async function getAssessmentRiskFactors(id: string): Promise<RiskFactors> {
  const response = await axiosInstance.get<ApiWrap<RiskFactors>>(
    `/api/v1/assessments/${id}/risk-factors`
  )
  return response.data.data
}

// GET /api/v1/assessments/{id}/recommendations
export async function getAssessmentRecommendations(id: string): Promise<Recommendations> {
  const response = await axiosInstance.get<ApiWrap<Recommendations>>(
    `/api/v1/assessments/${id}/recommendations`
  )
  return response.data.data
}

import axiosInstance from '../axios'
import { RecentAssessments } from '../../types/dashboard'

export async function getRecentAssessments(limit = 5): Promise<RecentAssessments> {
  const response = await axiosInstance.get<{ success: boolean; message: string; data: RecentAssessments }>(
    `/api/v1/dashboard/recent-assessments?limit=${limit}`
  )
  return response.data.data
}

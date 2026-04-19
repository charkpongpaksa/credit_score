import axiosInstance from '../axios'
import { DashboardSummary } from '../../types/dashboard'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await axiosInstance.get<{ success: boolean; message: string; data: DashboardSummary }>(
    '/api/v1/dashboard/summary'
  )
  return response.data.data
}

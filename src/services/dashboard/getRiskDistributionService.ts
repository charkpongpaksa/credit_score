import axiosInstance from '../axios'
import { RiskDistribution } from '../../types/dashboard'

export async function getRiskDistribution(): Promise<RiskDistribution> {
  const response = await axiosInstance.get<{ success: boolean; message: string; data: RiskDistribution }>(
    '/api/v1/dashboard/risk-distribution'
  )
  return response.data.data
}

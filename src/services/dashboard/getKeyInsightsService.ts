import axiosInstance from '../axios'
import { KeyInsights } from '../../types/dashboard'

export async function getKeyInsights(): Promise<KeyInsights> {
  const response = await axiosInstance.get<{ success: boolean; message: string; data: KeyInsights }>(
    '/api/v1/dashboard/key-insights'
  )
  return response.data.data
}

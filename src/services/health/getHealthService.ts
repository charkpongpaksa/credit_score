import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import { HealthResponse } from '../../types/health'

export const getHealthService = async (): Promise<HealthResponse> => {
  const response = await axiosInstance.get('/api/v1/health')
  return extractApiData<HealthResponse>(response.data)
}

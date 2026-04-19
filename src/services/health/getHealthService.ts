import axiosInstance from '../axios'
import { HealthResponse } from '../../types/health'

export const getHealthService = async (): Promise<HealthResponse> => {
  const response = await axiosInstance.get('/health')
  return response.data
}

import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import { DbHealthResponse } from '../../types/health'

export const getDbHealthService = async (): Promise<DbHealthResponse> => {
  const response = await axiosInstance.get('/api/v1/db-health')
  return extractApiData<DbHealthResponse>(response.data)
}

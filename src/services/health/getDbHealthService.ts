import axiosInstance from '../axios'
import { DbHealthResponse } from '../../types/health'

export const getDbHealthService = async (): Promise<DbHealthResponse> => {
  const response = await axiosInstance.get('/db-health')
  return response.data
}

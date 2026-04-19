import axiosInstance from '../axios'
import { ModelInfoResponse } from '../../types/health'

export const getModelInfoService = async (): Promise<ModelInfoResponse> => {
  const response = await axiosInstance.get('/model-info')
  return response.data
}

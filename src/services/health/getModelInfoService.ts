import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import { ModelInfoResponse } from '../../types/health'

export const getModelInfoService = async (): Promise<ModelInfoResponse> => {
  const response = await axiosInstance.get('/api/v1/model-info')
  return extractApiData<ModelInfoResponse>(response.data)
}

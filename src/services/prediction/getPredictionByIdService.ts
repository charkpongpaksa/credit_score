import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import { PredictionDetailResponse } from '../../types/prediction'

export const getPredictionByIdService = async (
  id: number | string
): Promise<PredictionDetailResponse> => {
  const response = await axiosInstance.get(`/api/v1/predictions/${id}`)
  return extractApiData<PredictionDetailResponse>(response.data)
}

import axiosInstance from '../axios'
import { PredictRequest, PredictResponse } from '../../types/prediction'

/**
 * Executes a prediction request against the ML model backend.
 * Supports batch payloads and custom thresholding.
 */
export const predictService = async (
  payload: PredictRequest
): Promise<PredictResponse> => {
  const response = await axiosInstance.post('/predict', payload)
  return response.data
}

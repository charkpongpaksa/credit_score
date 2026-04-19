import axiosInstance from '../axios'
import { PredictionsResponse } from '../../types/prediction'

/**
 * Retrieves the history of previous predictions from the backend.
 * Supports pagination via the limit parameter.
 */
export const getPredictionsService = async (
  limit = 20
): Promise<PredictionsResponse> => {
  const response = await axiosInstance.get('/predictions', {
    params: { limit },
  })
  return response.data
}

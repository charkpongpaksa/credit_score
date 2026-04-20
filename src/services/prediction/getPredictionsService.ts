import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import { PredictionsResponse } from '../../types/prediction'

/**
 * Retrieves the history of previous predictions from the backend.
 * Supports pagination via the limit parameter.
 */
export const getPredictionsService = async (
  limit = 20
): Promise<PredictionsResponse> => {
  try {
    const response = await axiosInstance.get('/api/v1/predictions', {
      params: { limit },
    })
    return extractApiData<PredictionsResponse>(response.data)
  } catch (error: any) {
    if (error?.response?.status === 404) {
      const legacyResponse = await axiosInstance.get('/predictions', {
        params: { limit },
      })
      return extractApiData<PredictionsResponse>(legacyResponse.data)
    }
    throw error
  }
}

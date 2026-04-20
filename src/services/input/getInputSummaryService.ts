import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import { InputSummary } from '../../types/input'

export const getInputSummaryService = async (): Promise<InputSummary> => {
  const response = await axiosInstance.get('/api/v1/input-summary')
  return extractApiData<InputSummary>(response.data)
}

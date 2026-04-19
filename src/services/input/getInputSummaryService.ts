import axiosInstance from '../axios'
import { InputSummary } from '../../types/input'

export const getInputSummaryService = async (): Promise<InputSummary> => {
  const response = await axiosInstance.get('/input-summary')
  return response.data
}

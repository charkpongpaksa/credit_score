import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import { InputTemplate } from '../../types/input'

export const getInputTemplateService = async (): Promise<InputTemplate> => {
  const response = await axiosInstance.get('/api/v1/input-template')
  return extractApiData<InputTemplate>(response.data)
}

import axiosInstance from '../axios'
import { InputTemplate } from '../../types/input'

export const getInputTemplateService = async (): Promise<InputTemplate> => {
  const response = await axiosInstance.get('/input-template')
  return response.data
}

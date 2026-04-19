import axiosInstance from '../axios'
import { InputCatalog } from '../../types/input'

export const getInputCatalogService = async (): Promise<InputCatalog> => {
  const response = await axiosInstance.get('/input-catalog')
  return response.data
}

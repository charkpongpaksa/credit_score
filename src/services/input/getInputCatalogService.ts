import axiosInstance from '../axios'
import { extractApiData } from '../axios'
import { InputCatalog } from '../../types/input'

export const getInputCatalogService = async (): Promise<InputCatalog> => {
  const response = await axiosInstance.get('/api/v1/input-catalog')
  return extractApiData<InputCatalog>(response.data)
}

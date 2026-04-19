import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, removeAllTokens } from '../../lib/auth/tokenStorage'

/**
 * Interceptor logic for future-ready authentication.
 * Backend currently does not have auth, so this is optional logic.
 */
export const setupAuthInterceptors = (axiosInstance: AxiosInstance): void => {
  
  // Request Interceptor: Attach Bearer Token if exists
  axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Response Interceptor: Handle 401 Unauthorized
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Clear tokens and redirect on auth failure
        removeAllTokens()
        if (typeof window !== 'undefined') {
          window.location.href = '/login'
        }
      }
      return Promise.reject(error)
    }
  )
}

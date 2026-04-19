import { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { getAccessToken, setAccessToken, getRefreshToken, removeAllTokens } from '../../lib/auth/tokenStorage'

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = []

function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token!)
  })
  failedQueue = []
}

export const setupAuthInterceptors = (axiosInstance: AxiosInstance): void => {

  // Request: Attach Bearer Token
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

  // Response: Handle 401 with auto-refresh
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
      const originalRequest = error.config

      // Skip refresh for auth endpoints themselves
      const isAuthEndpoint = originalRequest?.url?.includes('/auth/')

      if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        if (isRefreshing) {
          // Queue subsequent 401s while refreshing
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return axiosInstance(originalRequest)
          })
        }

        originalRequest._retry = true
        isRefreshing = true

        const refreshToken = getRefreshToken()
        if (!refreshToken) {
          removeAllTokens()
          if (typeof window !== 'undefined') window.location.href = '/'
          return Promise.reject(error)
        }

        try {
          const res = await axiosInstance.post('/api/v1/auth/refresh', { refreshToken })
          const newToken = res.data?.data?.accessToken
          if (newToken) {
            setAccessToken(newToken)
            processQueue(null, newToken)
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return axiosInstance(originalRequest)
          }
          throw new Error('No new token')
        } catch (refreshError) {
          processQueue(refreshError)
          removeAllTokens()
          if (typeof window !== 'undefined') window.location.href = '/'
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      // 403 - Forbidden, redirect to login
      if (error.response?.status === 403 && !isAuthEndpoint) {
        removeAllTokens()
        if (typeof window !== 'undefined') window.location.href = '/'
      }

      return Promise.reject(error)
    }
  )
}

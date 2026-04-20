import axios from 'axios'
import { setupAuthInterceptors } from './authInterceptor'

// Use same-origin routes on client (proxied by Next.js rewrites)
// and absolute URL on server-side rendering.
const baseURL = typeof window === 'undefined' 
  ? (process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000')
  : ''

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
  timeout: 15000, 
})

// Setup interceptors
setupAuthInterceptors(axiosInstance)

export default axiosInstance

import axios from 'axios'
import { setupAuthInterceptors } from './authInterceptor'

// Use /api for client-side (proxied by Next.js) and absolute URL for server-side
const baseURL = typeof window === 'undefined' 
  ? (process.env.API_BASE_URL || 'http://127.0.0.1:8000') 
  : '/api'

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
})

// Setup interceptors
setupAuthInterceptors(axiosInstance)

export default axiosInstance

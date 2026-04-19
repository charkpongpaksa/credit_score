import axiosInstance from '../axios'
import { AuthResponse, LoginValues, AuthUser } from '../../types/auth'
import {
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  removeAllTokens,
} from '../../lib/auth/tokenStorage'

const USER_KEY = 'auth_user'

/** ล็อกอินด้วย POST /api/v1/auth/login */
export const loginService = async (values: LoginValues): Promise<AuthResponse> => {
  const response = await axiosInstance.post<AuthResponse>('/api/v1/auth/login', {
    usernameOrEmail: values.usernameOrEmail,
    password: values.password,
    rememberMe: values.rememberMe ?? false,
  })
  const data = response.data
  if (data.success) {
    setAccessToken(data.data.accessToken)
    setRefreshToken(data.data.refreshToken)
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(data.data.user))
    }
  }
  return data
}

/** Refresh access token ด้วย POST /api/v1/auth/refresh */
export const refreshTokenService = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return null
  try {
    const response = await axiosInstance.post<AuthResponse>('/api/v1/auth/refresh', { refreshToken })
    if (response.data.success) {
      setAccessToken(response.data.data.accessToken)
      setRefreshToken(response.data.data.refreshToken)
      return response.data.data.accessToken
    }
    return null
  } catch {
    return null
  }
}

/** ออกจากระบบ POST /api/v1/auth/logout */
export const logoutService = async (): Promise<void> => {
  const refreshToken = getRefreshToken()
  try {
    if (refreshToken) {
      await axiosInstance.post('/api/v1/auth/logout', { refreshToken })
    }
  } finally {
    removeAllTokens()
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY)
    }
  }
}

/** ดึงข้อมูล user จาก GET /api/v1/auth/me */
export const getMeService = async (): Promise<AuthUser | null> => {
  try {
    const response = await axiosInstance.get<{ success: boolean; data: AuthUser }>('/api/v1/auth/me')
    return response.data.data
  } catch {
    return null
  }
}

/** อ่าน user ที่เก็บใน localStorage */
export const getStoredUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as AuthUser
  } catch {
    return null
  }
}

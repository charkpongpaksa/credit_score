// Auth API Types - aligned with POST /api/v1/auth/login

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: 'ADMIN' | 'ANALYST' | string
  forceChangePassword: boolean
}

export interface AuthData {
  accessToken: string
  refreshToken: string
  expiresIn: number
  user: AuthUser
}

export interface AuthResponse {
  success: boolean
  message: string
  data: AuthData
}

export interface LoginValues {
  usernameOrEmail: string
  password: string
  rememberMe?: boolean
}

// Legacy compatibility (used in old code)
export interface User {
  id: string
  email: string
  name: string
  role: string
}

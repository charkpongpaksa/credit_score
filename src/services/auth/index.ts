import axiosInstance from '../axios'
import { AuthResponse, LoginValues } from '../../types/auth'

/**
 * Placeholder login service.
 * NOTE: Current backend (http://127.0.0.1:8000) does NOT have auth endpoints.
 * This is implemented as a future-ready pattern.
 */
export const loginService = async (
  values: LoginValues
): Promise<AuthResponse> => {
  console.warn('Backend currently has no auth. Using placeholder login.')
  // const response = await axiosInstance.post('/auth/login', values);
  // return response.data;
  
  // Mocking response for UI development until backend adds auth
  return {
    access_token: 'mock_token',
    token_type: 'Bearer',
    user: { id: '1', email: values.email, name: 'Demo Officer', role: 'Loan Officer' }
  }
}

export const registerService = async (
  values: any
): Promise<any> => {
  console.warn('Backend currently has no auth. Using placeholder register.')
  return { status: 'success', message: 'Placeholder registration success' }
}

export const logoutService = async (): Promise<void> => {
  console.log('Logging out (local cleanup only)')
}

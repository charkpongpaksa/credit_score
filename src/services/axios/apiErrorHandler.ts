import { AxiosError } from 'axios'
import { ApiError } from '../../types/api'

/**
 * Parses and handles errors from FastAPI backend.
 * Specifically handles 422 Validation Errors, 500 Internal, and Network errors.
 */
export const handleApiError = (error: AxiosError): ApiError => {
  if (!error.response) {
    return {
      message: 'เครือข่ายขัดข้อง กรุณาตรวจสอบการเชื่อมต่อของคุณ',
      statusCode: 0
    }
  }

  const status = error.response.status
  const data = error.response.data as any

  let message = 'เกิดข้อผิดพลาดไม่ทราบสาเหตุ'

  switch (status) {
    case 401:
      message = 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่'
      break
    case 403:
      message = 'คุณไม่มีสิทธิ์เข้าถึงทรัพยากรนี้'
      break
    case 404:
      message = 'ไม่พบข้อมูลที่ต้องการ'
      break
    case 422:
      message = 'ข้อมูลที่ส่งไปไม่ถูกต้อง (Validation Error)'
      break
    case 500:
      message = 'เกิดข้อผิดพลาดที่เซิร์ฟเวอร์ (Internal Server Error)'
      break
    default:
      message = data?.message || message
  }

  return {
    message,
    statusCode: status,
    details: data?.detail || data
  }
}

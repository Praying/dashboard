import axios, { AxiosInstance } from 'axios'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/store/auth'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token and redirect to login
          const authStore = useAuthStore()
          authStore.clearToken()
          window.location.href = '/login'
          ElMessage.error('Session expired. Please login again.')
          break
        case 403:
          ElMessage.error('Access denied.')
          break
        case 404:
          ElMessage.error('Resource not found.')
          break
        case 500:
          ElMessage.error('Internal server error.')
          break
        default:
          ElMessage.error(error.response.data?.detail || 'An error occurred.')
      }
    } else if (error.request) {
      ElMessage.error('Network error. Please check your connection.')
    } else {
      ElMessage.error('An unexpected error occurred.')
    }
    return Promise.reject(error)
  }
)

export default api
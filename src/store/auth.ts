import { defineStore } from 'pinia'
import { ref } from 'vue'

import { login as loginApi, logout as logoutApi } from '@/api/auth'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const isAuthenticated = ref(!!token.value)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const router = useRouter()

  // Auto-authenticate for development (bypass login)
  if (!token.value) {
    const devToken = 'dev-token-bypass-login'
    localStorage.setItem('token', devToken)
    token.value = devToken
    isAuthenticated.value = true
  }

  async function login(username: string, password: string) {
    loading.value = true
    error.value = null

    try {
      const response = await loginApi(username, password)
      const newToken = response.data.access_token

      if (!newToken) {
        throw new Error('Token not found in response')
      }

      localStorage.setItem('token', newToken)
      token.value = newToken
      isAuthenticated.value = true

      // Redirect to dashboard after successful login
      router.push('/dashboard')
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Login failed'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      // Call logout API if available
      if (token.value) {
        await logoutApi()
      }
    } catch (error) {
      console.warn('Logout API call failed, proceeding with local logout')
    } finally {
      // Always clear local state
      clearToken()
      router.push('/login')
    }
  }

  function clearToken() {
    localStorage.removeItem('token')
    token.value = null
    isAuthenticated.value = false
    error.value = null
  }

  function checkAuth() {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      token.value = storedToken
      isAuthenticated.value = true
      return true
    }
    return false
  }

  return {
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearToken,
    checkAuth
  }
})
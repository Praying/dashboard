import { defineStore } from 'pinia'
import { ref } from 'vue'

import { login as loginApi } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = ref(!!token.value)

  async function login(username: string, password: string) {
    const response = await loginApi(username, password)
    const newToken = response.data.access_token
    
    if (!newToken) {
      throw new Error('Token not found in response')
    }

    localStorage.setItem('token', newToken)
    token.value = newToken
    isAuthenticated.value = true
  }

  function logout() {
    localStorage.removeItem('token')
    token.value = null
    isAuthenticated.value = false
    // In a real app, we would also redirect to the login page
    // router.push('/login')
  }

  return { token, isAuthenticated, login, logout }
})
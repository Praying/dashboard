<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>pbgui Login</span>
        </div>
      </template>
      <el-form @submit.prevent="handleLogin">
        <el-form-item label="Username">
          <el-input v-model="username" placeholder="Username (can be any)"></el-input>
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="password" type="password" placeholder="Enter password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%;">Login</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useAuthStore } from '@/store/auth'
import { useRouter } from 'vue-router'

const username = ref('user')
const password = ref('')
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(username.value, password.value)
    router.push('/') // Redirect to dashboard on successful login
  } catch (error: any) {
    console.error('Login failed:', error)
    ElNotification({
      title: 'Login Failed',
      message: error.response?.data?.detail || 'An unknown error occurred.',
      type: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}
.login-card {
  width: 400px;
}
.card-header {
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
</style>
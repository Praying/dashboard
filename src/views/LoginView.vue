<template>
  <el-form @submit.prevent="handleLogin" class="login-form">
    <el-form-item :label="$t('auth.username')">
      <el-input
        v-model="username"
        :placeholder="$t('auth.usernamePlaceholder')"
        size="large"
      />
    </el-form-item>
    <el-form-item :label="$t('auth.password')">
      <el-input
        v-model="password"
        type="password"
        :placeholder="$t('auth.passwordPlaceholder')"
        show-password
        size="large"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        native-type="submit"
        :loading="loading || authStore.loading"
        size="large"
        style="width: 100%;"
      >
        {{ loading || authStore.loading ? $t('auth.signingIn') : $t('auth.signIn') }}
      </el-button>
    </el-form-item>

    <el-alert
      v-if="authStore.error"
      :title="authStore.error"
      type="error"
      show-icon
      :closable="false"
      class="error-alert"
    />
  </el-form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/store/auth'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const username = ref('user')
const password = ref('')
const loading = ref(false)
const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const handleLogin = async () => {
  try {
    loading.value = true
    await authStore.login(username.value, password.value)

    // Redirect to the intended page or dashboard
    const redirectPath = route.query.redirect as string || '/dashboard'
    router.push(redirectPath)
  } catch (error) {
    // Error is already handled by the auth store and displayed via the alert
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-form {
  width: 100%;

  .el-form-item {
    margin-bottom: 24px;
  }

  .error-alert {
    margin-top: 16px;
  }
}
</style>
<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <div class="logo">PB GUI</div>
          <h2 class="auth-title">{{ title }}</h2>
          <p class="auth-subtitle">{{ subtitle }}</p>
        </div>
        <div class="auth-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Welcome to PB GUI',
  subtitle: 'Please sign in to continue'
})
</script>

<style scoped lang="scss">
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.auth-box {
  background: white;
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.auth-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  font-size: 28px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 10px;
}

.auth-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.auth-subtitle {
  color: #909399;
  margin: 0;
  font-size: 14px;
}

.auth-content {
  min-height: 200px;
}
</style>
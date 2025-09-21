<template>
  <div class="loading-container">
    <el-icon class="loading-icon" :class="{ 'is-large': large }">
      <Loading />
    </el-icon>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  large?: boolean
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-icon {
  font-size: 24px;
  color: #409eff;
  animation: spin 1s linear infinite;

  &.is-large {
    font-size: 48px;
  }
}

.loading-text {
  margin-top: 16px;
  color: #909399;
  font-size: 14px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
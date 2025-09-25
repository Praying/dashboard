<template>
  <div class="page-header">
    <div class="page-header-left">
      <h1 class="page-title">{{ title }}</h1>
      <p v-if="description" class="page-description">{{ description }}</p>
    </div>
    <div v-if="$slots.actions" class="page-header-right">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<style scoped lang="scss">
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  padding: 24px;
  background: var(--card-background-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 16px var(--shadow-hover-color);
    background: var(--card-background-hover);
  }
}

.page-header-left {
  flex: 1;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--text-color);
}

.page-description {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: 14px;
}

.page-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
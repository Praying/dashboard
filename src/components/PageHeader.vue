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
// 原研哉设计理念：去除不必要的装饰，突出内容本质
.page-header {
  display: flex;
  align-items: flex-start; // 改为顶部对齐，更自然
  justify-content: space-between;
  margin-bottom: $spacing-xl;
  padding: $spacing-xl 0; // 移除左右内边距，只保留上下
  background: transparent; // 移除背景色，更加简洁
  border-radius: 0; // 移除圆角
  box-shadow: none; // 移除阴影
  border-bottom: 1px solid var(--border-color-light); // 添加底部分割线
  position: relative;
}

.page-header-left {
  flex: 1;
  min-width: 0; // 防止文字溢出
}

.page-title {
  margin: 0 0 $spacing-sm 0;
  font-size: $font-size-xxxl; // 使用新的字体系统
  font-weight: $font-weight-semibold;
  color: var(--text-color);
  line-height: $line-height-tight;
  letter-spacing: -0.5px; // 紧凑的字间距，更现代
}

.page-description {
  margin: 0;
  color: var(--text-color-secondary);
  font-size: $font-size-md;
  line-height: $line-height-base;
  font-weight: $font-weight-normal;
  max-width: 600px; // 限制描述文字的宽度，提高可读性
}

.page-header-right {
  display: flex;
  align-items: flex-start; // 与左侧对齐
  gap: $spacing-md;
  margin-top: $spacing-xs; // 微调位置，与标题对齐
  
  // 优化按钮样式
  :deep(.el-button) {
    border-radius: $border-radius-md;
    font-weight: $font-weight-medium;
    font-size: $font-size-sm;
    padding: $spacing-sm $spacing-lg;
    transition: all $transition-base;
    border: 1px solid var(--border-color);
    
    &.el-button--primary {
      background-color: var(--primary-color);
      border-color: var(--primary-color);
      color: white;
      
      &:hover {
        background-color: var(--primary-color);
        border-color: var(--primary-color);
        transform: translateY(-1px);
        box-shadow: $shadow-sm;
      }
    }
    
    &:not(.el-button--primary) {
      background-color: var(--card-background-color);
      color: var(--text-color-secondary);
      
      &:hover {
        background-color: var(--hover-background);
        border-color: var(--primary-color);
        color: var(--primary-color);
        transform: translateY(-1px);
      }
    }
    
    .el-icon {
      margin-right: $spacing-xs;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: $spacing-lg;
    padding: $spacing-lg 0;
  }
  
  .page-title {
    font-size: $font-size-xxl;
  }
  
  .page-description {
    font-size: $font-size-base;
  }
  
  .page-header-right {
    align-items: stretch;
    margin-top: 0;
    
    :deep(.el-button) {
      flex: 1;
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: $spacing-md 0;
  }
  
  .page-title {
    font-size: $font-size-xl;
  }
  
  .page-header-right {
    flex-direction: column;
    gap: $spacing-sm;
  }
}
</style>
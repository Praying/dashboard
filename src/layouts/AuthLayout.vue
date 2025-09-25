<template>
  <div class="auth-layout">
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <div class="logo">PB GUI</div>
          <h2 class="auth-title">{{ title || t('common.welcome') }}</h2>
          <p class="auth-subtitle">{{ subtitle || t('auth.sign_in') }}</p>
        </div>
        <div class="auth-content">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  title?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  title: 'Welcome',
  subtitle: 'Sign In'
})
</script>

<style scoped lang="scss">
// 原研哉设计理念：纯粹、简约、专注于本质
.auth-layout {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color); // 移除渐变，使用纯色背景
  position: relative;
  
  // 添加微妙的纹理效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 25% 25%, var(--primary-color-lighter) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, var(--accent-color) 0%, transparent 50%);
    opacity: 0.3;
    z-index: 0;
  }
}

.auth-container {
  width: 100%;
  max-width: 420px; // 稍微增加宽度
  padding: $spacing-lg;
  position: relative;
  z-index: 1;
}

.auth-box {
  background: var(--card-background-color);
  border-radius: $border-radius-xl; // 使用新的圆角系统
  padding: $spacing-xxxl $spacing-xl; // 增加内边距，提供更好的呼吸感
  box-shadow: $shadow-lg; // 使用新的阴影系统
  border: 1px solid var(--border-color-light);
  backdrop-filter: blur(10px); // 添加毛玻璃效果
  transition: all $transition-slow;
  
  &:hover {
    box-shadow: $shadow-xl;
    transform: translateY(-2px);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: $spacing-xxxl; // 增加间距
}

.logo {
  font-size: $font-size-xxxl;
  font-weight: $font-weight-medium; // 减少字重
  color: var(--primary-color);
  margin-bottom: $spacing-lg;
  letter-spacing: 1px; // 增加字间距
  font-family: $font-family-base;
}

.auth-title {
  font-size: $font-size-xl;
  font-weight: $font-weight-semibold;
  color: var(--text-color);
  margin: 0 0 $spacing-sm 0;
  line-height: $line-height-tight;
}

.auth-subtitle {
  color: var(--text-color-secondary);
  margin: 0;
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  line-height: $line-height-base;
}

.auth-content {
  min-height: 240px; // 稍微增加高度
  
  // 优化表单样式
  :deep(.login-form) {
    .el-form-item {
      margin-bottom: $spacing-xl;
      
      .el-form-item__label {
        color: var(--text-color);
        font-weight: $font-weight-medium;
        font-size: $font-size-sm;
        margin-bottom: $spacing-sm;
      }
      
      .el-input {
        .el-input__wrapper {
          border-radius: $border-radius-md;
          border: 1px solid var(--border-color);
          background-color: var(--surface-color);
          transition: all $transition-base;
          padding: $spacing-sm $spacing-md;
          
          &:hover {
            border-color: var(--primary-color);
          }
          
          &.is-focus {
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px var(--focus-outline);
          }
        }
        
        .el-input__inner {
          color: var(--text-color);
          font-size: $font-size-base;
          
          &::placeholder {
            color: var(--text-color-tertiary);
          }
        }
      }
      
      .el-button {
        border-radius: $border-radius-md;
        font-weight: $font-weight-medium;
        font-size: $font-size-base;
        padding: $spacing-md $spacing-xl;
        transition: all $transition-base;
        
        &.el-button--primary {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          
          &:hover {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
            transform: translateY(-1px);
            box-shadow: $shadow-md;
          }
          
          &:active {
            transform: translateY(0);
          }
        }
      }
    }
    
    .error-alert {
      margin-top: $spacing-lg;
      border-radius: $border-radius-md;
      border: 1px solid var(--danger-color);
      background-color: var(--danger-color-light);
      
      :deep(.el-alert__content) {
        .el-alert__title {
          color: var(--danger-color);
          font-size: $font-size-sm;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .auth-container {
    max-width: 360px;
    padding: $spacing-md;
  }
  
  .auth-box {
    padding: $spacing-xl $spacing-lg;
  }
  
  .auth-header {
    margin-bottom: $spacing-xl;
  }
  
  .logo {
    font-size: $font-size-xxl;
  }
  
  .auth-title {
    font-size: $font-size-lg;
  }
  
  .auth-content {
    min-height: 200px;
  }
}

@media (max-width: 480px) {
  .auth-container {
    max-width: 320px;
    padding: $spacing-sm;
  }
  
  .auth-box {
    padding: $spacing-lg $spacing-md;
  }
}
</style>
<template>
  <div class="app-layout">
    <el-container class="layout-container">
      <!-- Sidebar -->
      <el-aside class="app-sidebar" width="240px">
        <div class="sidebar-header">
          <div class="logo">PB Admin</div>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="vertical"
          class="main-menu"
          @select="handleMenuSelect"
        >
          <el-menu-item index="/dashboard">
            <el-icon><Monitor /></el-icon>
            <span>{{ $t('menu.dashboard') }}</span>
          </el-menu-item>
          <el-menu-item index="/backtest">
            <el-icon><DataLine /></el-icon>
            <span>{{ $t('menu.backtest') }}</span>
          </el-menu-item>
          <el-menu-item index="/optimize">
            <el-icon><TrendCharts /></el-icon>
            <span>{{ $t('menu.optimize') }}</span>
          </el-menu-item>
          <el-menu-item index="/run">
            <el-icon><VideoPlay /></el-icon>
            <span>{{ $t('menu.run') }}</span>
          </el-menu-item>
          <el-menu-item index="/api-keys">
            <el-icon><Key /></el-icon>
            <span>{{ $t('menu.apiKeys') }}</span>
          </el-menu-item>
          <el-menu-item index="/system">
            <el-icon><Setting /></el-icon>
            <span>{{ $t('menu.system') }}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- Main Container -->
      <el-container class="main-container">
        <!-- Header -->
        <el-header class="app-header">
          <div class="header-right">
            <!-- Notifications -->
            <el-badge :value="3" class="notification-badge item">
              <el-button circle>
                <el-icon size="18"><Bell /></el-icon>
              </el-button>
            </el-badge>

            <!-- Theme Switcher -->
            <el-button @click="handleThemeToggle" circle class="item">
              <el-icon size="18"><Sunny v-if="theme.theme === 'light'" /><Moon v-else /></el-icon>
            </el-button>

            <!-- Language Switcher -->
            <el-dropdown trigger="click" @command="handleLanguageChange" class="item">
              <el-button circle>
                <el-icon size="18"><GlobeIcon /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="zh" :class="{ active: currentLanguage === 'zh' }">中文</el-dropdown-item>
                  <el-dropdown-item command="en" :class="{ active: currentLanguage === 'en' }">English</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>

            <!-- User Avatar -->
            <el-dropdown trigger="click" class="item">
              <div class="user-avatar">
                <el-avatar :size="36" :src="userAvatar">U</el-avatar>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>{{ $t('common.profile') }}</el-dropdown-item>
                  <el-dropdown-item>{{ $t('common.settings') }}</el-dropdown-item>
                  <el-dropdown-item divided @click="handleLogout">{{ $t('common.logout') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- Main Content -->
        <el-main class="app-main">

          <div class="page-content">
            <router-view />
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Monitor, DataLine, TrendCharts, VideoPlay, Key, Setting, Bell, Sunny, Moon } from '@element-plus/icons-vue'
import GlobeIcon from '@/components/icons/GlobeIcon.vue'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/store/theme'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { locale, t } = useI18n()
const { theme, toggleTheme } = useTheme()

// Handle theme toggle with logging
const handleThemeToggle = () => {
  console.log('Theme toggle button clicked');
  console.log('Current theme before toggle:', theme.theme);
  
  // Log CSS variables before toggle
  const htmlElement = document.documentElement;
  const computedStyle = window.getComputedStyle(htmlElement);
  console.log('CSS variables before toggle:');
  console.log('--background-color:', computedStyle.getPropertyValue('--background-color'));
  console.log('--text-color:', computedStyle.getPropertyValue('--text-color'));
  
  toggleTheme();
  
  console.log('Current theme after toggle:', theme.theme);
  
  // Log CSS variables after toggle
  const computedStyleAfter = window.getComputedStyle(htmlElement);
  console.log('CSS variables after toggle:');
  console.log('--background-color:', computedStyleAfter.getPropertyValue('--background-color'));
  console.log('--text-color:', computedStyleAfter.getPropertyValue('--text-color'));
}

// Active menu based on current route
const activeMenu = computed(() => {
  return route.path
})

// 当前语言
const currentLanguage = ref(locale.value)

// 用户头像
const userAvatar = ref('')

// 处理菜单选择
const handleMenuSelect = (index: string) => {
  router.push(index)
}

// 更新Element Plus的语言
const updateElementPlusLocale = (lang: string) => {
  // 动态更新Element Plus的语言
  const elementPlusLocale = lang === 'zh' ? zhCn : en
  // 更新Element Plus组件的语言
  ;(window as any).ELEMENT_PLUS_LOCALE = elementPlusLocale
  ElMessage.success(t('common.languageChanged'))
}

// 处理语言切换
const handleLanguageChange = (lang: string) => {
  locale.value = lang
  currentLanguage.value = lang
  // 保存到localStorage
  localStorage.setItem('language', lang)
  // 更新Element Plus的语言
  updateElementPlusLocale(lang)
}

// 处理退出登录
const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}

// 监听语言变化
watch(locale, (newLocale) => {
  updateElementPlusLocale(newLocale)
})

// 组件挂载时从localStorage读取语言设置
onMounted(() => {
  const savedLanguage = localStorage.getItem('language')
  if (savedLanguage && (savedLanguage === 'zh' || savedLanguage === 'en')) {
    locale.value = savedLanguage
    currentLanguage.value = savedLanguage
    updateElementPlusLocale(savedLanguage)
  } else {
    updateElementPlusLocale('zh')
  }
})
</script>

<style lang="scss">
/* Global overrides for MainLayout - 原研哉的精致美学 */
.app-layout {
  min-height: 100vh;
  background-color: var(--background-color);
  transition: background-color $transition-slow;
}

.app-sidebar {
  background: var(--card-background-color) !important;
  transition: background-color $transition-slow;

  .main-menu {
    background-color: transparent !important;
    border-right: none !important;
    padding: 0 $spacing-sm; // 增加左右内边距
  }

  .el-menu-item {
    color: var(--text-color-secondary) !important;
    margin-bottom: $spacing-xs; // 增加菜单项之间的间距
    border-radius: $border-radius-md !important;
    padding: $spacing-md $spacing-lg !important; // 增加内边距
    transition: all $transition-base !important;
    font-weight: $font-weight-normal !important;
    
    .el-icon {
      color: var(--text-color-secondary) !important;
      margin-right: $spacing-md !important; // 增加图标与文字的间距
      transition: color $transition-base !important;
    }

    span {
      font-size: $font-size-sm !important;
      letter-spacing: 0.3px !important; // 增加字间距
    }

    &:hover {
      background-color: var(--hover-background) !important;
      color: var(--primary-color) !important;
      transform: translateX(2px); // 微妙的移动效果
      
      .el-icon {
        color: var(--primary-color) !important;
      }
    }
  }

  .el-menu-item.is-active {
    color: var(--primary-color) !important;
    background-color: var(--primary-color-lighter) !important;
    font-weight: $font-weight-medium !important;
    box-shadow: $shadow-sm !important;
    
    .el-icon {
      color: var(--primary-color) !important;
    }
    
    // 添加左侧指示条
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background-color: var(--primary-color);
      border-radius: 0 $border-radius-sm $border-radius-sm 0;
    }
  }
}

.app-header {
  background: var(--surface-color) !important;
  transition: background-color $transition-slow;
  backdrop-filter: blur(8px); // 添加毛玻璃效果

  .header-right {
    .el-button {
      background-color: transparent !important;
      border: none !important;
      color: var(--text-color-secondary) !important;
      transition: all $transition-base !important;
      position: relative;
      overflow: hidden;

      .el-icon {
        color: var(--text-color-secondary) !important;
        transition: all $transition-base !important;
      }

      &:hover {
        color: var(--primary-color) !important;
        background-color: var(--hover-background) !important;
        
        .el-icon {
          color: var(--primary-color) !important;
          transform: scale(1.1); // 微妙的缩放效果
        }
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// 下拉菜单优化
.el-dropdown-menu {
  border: 1px solid var(--border-color) !important;
  border-radius: $border-radius-md !important;
  box-shadow: $shadow-lg !important;
  padding: $spacing-xs 0 !important;
  background-color: var(--card-background-color) !important;
  
  .el-dropdown-menu__item {
    padding: $spacing-sm $spacing-lg !important;
    font-size: $font-size-sm !important;
    color: var(--text-color) !important;
    transition: all $transition-base !important;
    
    &:hover {
      background-color: var(--hover-background) !important;
      color: var(--primary-color) !important;
    }
    
    &.active {
      color: var(--primary-color) !important;
      font-weight: $font-weight-medium !important;
      background-color: var(--primary-color-lighter) !important;
    }
  }
}

// 通知徽章优化
.notification-badge {
  .el-badge__content {
    background-color: var(--danger-color) !important;
    border: 2px solid var(--card-background-color) !important;
    font-size: $font-size-xs !important;
    font-weight: $font-weight-medium !important;
  }
}
</style>

<style scoped lang="scss">
// 原研哉设计理念：简约、留白、本质
.layout-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  background-color: var(--background-color);
}

.app-sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  width: 260px; // 稍微增加宽度，提供更好的呼吸感
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
}

.sidebar-header {
  padding: $spacing-xl $spacing-lg; // 使用新的间距系统
  border-bottom: 1px solid var(--border-color-light);
  flex-shrink: 0;
  background-color: var(--surface-color);
}

.logo {
  font-size: $font-size-xl;
  font-weight: $font-weight-medium; // 减少字重，更加优雅
  color: var(--primary-color);
  text-align: center;
  letter-spacing: 0.5px; // 增加字间距
}

.main-menu {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md 0; // 增加上下间距
}

.main-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  background-color: var(--background-color);
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 $spacing-xl; // 使用新的间距系统
  height: 72px; // 增加高度，提供更好的呼吸感
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color-light);
  background-color: var(--surface-color);
}

.header-right {
  display: flex;
  align-items: center;
  gap: $spacing-md; // 使用新的间距系统

  .item {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all $transition-base;
    border-radius: $border-radius-md;
    
    &:hover {
      background-color: var(--hover-background);
    }
  }

  .el-button {
    width: 40px; // 稍微增加尺寸
    height: 40px;
    border-radius: $border-radius-md;
    border: none;
    background-color: transparent;
    transition: all $transition-base;
    
    &:hover {
      background-color: var(--hover-background);
      transform: translateY(-1px);
    }
  }
}

.user-avatar {
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: $spacing-xs;
  border-radius: $border-radius-md;
  transition: all $transition-base;
  
  &:hover {
    background-color: var(--hover-background);
  }
}

.app-main {
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
  padding: $spacing-xl; // 增加内边距，提供更好的留白
  background-color: var(--background-color);
}

.page-content {
  max-width: 1400px; // 限制最大宽度，避免在大屏幕上过度拉伸
  margin: 0 auto; // 居中对齐
  padding: 0; // 移除额外的内边距
}

// 响应式设计
@media (max-width: 1024px) {
  .app-sidebar {
    width: 240px;
  }
  
  .app-main {
    padding: $spacing-lg;
  }
}

@media (max-width: 768px) {
  .app-sidebar {
    width: 200px;
  }
  
  .app-header {
    padding: 0 $spacing-lg;
    height: 64px;
  }
  
  .app-main {
    padding: $spacing-md;
  }
  
  .header-right {
    gap: $spacing-sm;
    
    .el-button {
      width: 36px;
      height: 36px;
    }
  }
}
</style>
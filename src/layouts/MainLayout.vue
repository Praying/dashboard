<template>
  <div class="app-layout">
    <el-container class="layout-container">
      <!-- Sidebar -->
      <el-aside class="app-sidebar" width="240px">
        <div class="sidebar-header">
          <div class="logo">PassivBot</div>
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
            <el-badge :value="3" class="notification-badge">
              <el-button circle>
                <el-icon><Bell /></el-icon>
              </el-button>
            </el-badge>
            <!-- 语言切换组件 -->
            <el-dropdown trigger="click" @command="handleLanguageChange">
              <div class="language-switcher">
                <el-button circle>
                  <el-icon><Location /></el-icon>
                </el-button>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="zh" :class="{ active: currentLanguage === 'zh' }">中文</el-dropdown-item>
                  <el-dropdown-item command="en" :class="{ active: currentLanguage === 'en' }">English</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-dropdown trigger="click">
              <div class="user-avatar">
                <el-avatar :size="32" :src="userAvatar">U</el-avatar>
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
import { Monitor, DataLine, TrendCharts, VideoPlay, Key, Setting, Bell, Location } from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/auth'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { locale, t } = useI18n()

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

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.layout-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
}

.app-sidebar {
  background: white;
  border-right: 1px solid #f0f2f5;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  width: 240px;
  flex-shrink: 0;
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid #f0f2f5;
  flex-shrink: 0;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  text-align: center;
}

.main-menu {
  border-right: none;
  flex: 1;
  overflow-y: auto;
}

.main-container {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  background: white;
  border-bottom: 1px solid #f0f2f5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 60px;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-badge {
  cursor: pointer;
}

.language-switcher {
  cursor: pointer;
  
  .el-button {
    border: none;
    background: transparent;
    
    &:hover {
      background: rgba(64, 158, 255, 0.1);
    }
  }
}

.user-avatar {
  cursor: pointer;
}

// 语言切换下拉菜单项激活状态样式
:deep(.el-dropdown-menu) {
  .el-dropdown-item.active {
    color: #409eff;
    font-weight: bold;
  }
}

.app-main {
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  overflow-y: auto;
}


.page-content {
  padding: 24px;
}
</style>
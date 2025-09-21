<template>
  <div class="app-layout">
    <el-container class="layout-container">
      <!-- Header -->
      <el-header class="app-header">
        <div class="header-left">
          <div class="logo">PB GUI</div>
          <el-menu
            :default-active="activeMenu"
            mode="horizontal"
            class="main-menu"
            @select="handleMenuSelect"
          >
            <el-menu-item index="/dashboard">
              <el-icon><Monitor /></el-icon>
              <span>Dashboard</span>
            </el-menu-item>
            <el-menu-item index="/backtest">
              <el-icon><DataLine /></el-icon>
              <span>V7 Backtest</span>
            </el-menu-item>
            <el-menu-item index="/optimize">
              <el-icon><TrendCharts /></el-icon>
              <span>V7 Optimize</span>
            </el-menu-item>
            <el-menu-item index="/run">
              <el-icon><VideoPlay /></el-icon>
              <span>V7 Run</span>
            </el-menu-item>
            <el-menu-item index="/api-keys">
              <el-icon><Key /></el-icon>
              <span>API Keys</span>
            </el-menu-item>
            <el-menu-item index="/system">
              <el-icon><Setting /></el-icon>
              <span>System</span>
            </el-menu-item>
          </el-menu>
        </div>
        <div class="header-right">
          <el-badge :value="3" class="notification-badge">
            <el-button circle>
              <el-icon><Bell /></el-icon>
            </el-button>
          </el-badge>
          <el-dropdown trigger="click">
            <div class="user-avatar">
              <el-avatar :size="32" :src="userAvatar">U</el-avatar>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Profile</el-dropdown-item>
                <el-dropdown-item>Settings</el-dropdown-item>
                <el-dropdown-item divided @click="handleLogout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- Main Content -->
      <el-main class="app-main">
        <el-breadcrumb separator="/" class="breadcrumb">
          <el-breadcrumb-item :to="{ path: '/' }">Home</el-breadcrumb-item>
          <el-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" :to="{ path: item.path }">
            {{ item.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <div class="page-content">
          <slot />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Monitor, DataLine, TrendCharts, VideoPlay, Key, Setting, Bell } from '@element-plus/icons-vue'
import { useAuthStore } from '@/store/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// Active menu based on current route
const activeMenu = computed(() => {
  return route.path
})

// Breadcrumbs based on current route
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p)
  return pathArray.map((segment, index) => {
    const path = '/' + pathArray.slice(0, index + 1).join('/')
    return {
      path,
      title: segment.charAt(0).toUpperCase() + segment.slice(1)
    }
  })
})

const userAvatar = ref('')

const handleMenuSelect = (index: string) => {
  router.push(index)
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped lang="scss">
.app-layout {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.layout-container {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  background: white;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-right: 20px;
}

.main-menu {
  border-bottom: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notification-badge {
  cursor: pointer;
}

.user-avatar {
  cursor: pointer;
}

.app-main {
  padding: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
  padding: 10px 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-content {
  min-height: calc(100vh - 120px);
}
</style>
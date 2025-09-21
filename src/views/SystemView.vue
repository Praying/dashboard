<template>
  <div class="system-view">
    <PageHeader
      title="System Settings"
      description="Configure system preferences and monitor performance"
    />

    <el-row :gutter="20">
      <el-col :span="16">
        <!-- General Settings -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>General Settings</span>
              <el-button type="primary" @click="saveSettings" :loading="saving">
                Save Changes
              </el-button>
            </div>
          </template>

          <el-form :model="settings" label-width="200px">
            <el-form-item label="Default Exchange">
              <el-select v-model="settings.defaultExchange" style="width: 300px">
                <el-option label="Binance" value="binance" />
                <el-option label="Coinbase" value="coinbase" />
                <el-option label="Kraken" value="kraken" />
                <el-option label="Bitfinex" value="bitfinex" />
              </el-select>
            </el-form-item>

            <el-form-item label="Default Timeframe">
              <el-select v-model="settings.defaultTimeframe" style="width: 300px">
                <el-option label="1m" value="1m" />
                <el-option label="5m" value="5m" />
                <el-option label="15m" value="15m" />
                <el-option label="1h" value="1h" />
                <el-option label="4h" value="4h" />
                <el-option label="1d" value="1d" />
              </el-select>
            </el-form-item>

            <el-form-item label="Auto-refresh Interval">
              <el-input-number
                v-model="settings.refreshInterval"
                :min="5"
                :max="600"
                :step="5"
                style="width: 300px"
              />
              <span style="margin-left: 8px; color: #909399;">seconds</span>
            </el-form-item>

            <el-form-item label="Dark Mode">
              <el-switch v-model="settings.darkMode" @change="toggleDarkMode" />
            </el-form-item>

            <el-form-item label="Email Notifications">
              <el-switch v-model="settings.emailNotifications" />
            </el-form-item>

            <el-form-item label="Data Directory">
              <el-input v-model="settings.dataDirectory" style="width: 300px">
                <template #append>
                  <el-button icon="Folder" @click="browseDirectory" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="Log Level">
              <el-select v-model="settings.logLevel" style="width: 300px">
                <el-option label="DEBUG" value="debug" />
                <el-option label="INFO" value="info" />
                <el-option label="WARNING" value="warning" />
                <el-option label="ERROR" value="error" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- Advanced Settings -->
        <el-card class="settings-card" style="margin-top: 20px;">
          <template #header>
            <span>Advanced Settings</span>
          </template>

          <el-form :model="settings" label-width="200px">
            <el-form-item label="Max Concurrent Backtests">
              <el-input-number
                v-model="settings.maxConcurrentBacktests"
                :min="1"
                :max="10"
                style="width: 300px"
              />
            </el-form-item>

            <el-form-item label="Backtest Timeout (minutes)">
              <el-input-number
                v-model="settings.backtestTimeout"
                :min="30"
                :max="1440"
                :step="30"
                style="width: 300px"
              />
            </el-form-item>

            <el-form-item label="Database Connection">
              <el-input v-model="settings.databaseUrl" placeholder="Database connection string" style="width: 300px" />
            </el-form-item>

            <el-form-item label="Cache Size (MB)">
              <el-input-number
                v-model="settings.cacheSize"
                :min="64"
                :max="4096"
                :step="64"
                style="width: 300px"
              />
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>

      <el-col :span="8">
        <!-- System Status -->
        <el-card class="status-card">
          <template #header>
            <span>System Status</span>
            <el-button size="small" @click="refreshStatus">
              <el-icon><Refresh /></el-icon>
            </el-button>
          </template>

          <div class="status-item">
            <span class="status-label">CPU Usage</span>
            <el-progress :percentage="systemStatus.cpu" :color="getStatusColor(systemStatus.cpu)" />
          </div>

          <div class="status-item">
            <span class="status-label">Memory Usage</span>
            <el-progress :percentage="systemStatus.memory" :color="getStatusColor(systemStatus.memory)" />
          </div>

          <div class="status-item">
            <span class="status-label">Disk Usage</span>
            <el-progress :percentage="systemStatus.disk" :color="getStatusColor(systemStatus.disk)" />
          </div>

          <div class="status-item">
            <span class="status-label">Database</span>
            <el-tag :type="systemStatus.database.status === 'connected' ? 'success' : 'danger'">
              {{ systemStatus.database.status }}
            </el-tag>
          </div>

          <div class="status-item">
            <span class="status-label">API Server</span>
            <el-tag :type="systemStatus.api.status === 'online' ? 'success' : 'danger'">
              {{ systemStatus.api.status }}
            </el-tag>
          </div>

          <div class="status-item">
            <span class="status-label">Last Update</span>
            <span class="status-time">{{ formatDate(systemStatus.lastUpdate) }}</span>
          </div>
        </el-card>

        <!-- Quick Actions -->
        <el-card class="actions-card" style="margin-top: 20px;">
          <template #header>
            <span>Quick Actions</span>
          </template>

          <div class="action-buttons">
            <el-button @click="exportData" style="width: 100%; margin-bottom: 8px;">
              <el-icon><Download /></el-icon>
              Export Data
            </el-button>

            <el-button @click="importData" style="width: 100%; margin-bottom: 8px;">
              <el-icon><Upload /></el-icon>
              Import Data
            </el-button>

            <el-button @click="clearCache" style="width: 100%; margin-bottom: 8px;">
              <el-icon><Delete /></el-icon>
              Clear Cache
            </el-button>

            <el-button @click="viewLogs" style="width: 100%; margin-bottom: 8px;">
              <el-icon><Document /></el-icon>
              View Logs
            </el-button>

            <el-button type="danger" @click="restartSystem" style="width: 100%;">
              <el-icon><Refresh /></el-icon>
              Restart System
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import { formatDate } from '@/utils/date'
import {
  Refresh,
  Download,
  Upload,
  Delete,
  Document
} from '@element-plus/icons-vue'

const settings = reactive({
  defaultExchange: 'binance',
  defaultTimeframe: '1h',
  refreshInterval: 30,
  darkMode: false,
  emailNotifications: true,
  dataDirectory: '/data/pbgui',
  logLevel: 'info',
  maxConcurrentBacktests: 3,
  backtestTimeout: 120,
  databaseUrl: 'sqlite:///data/pbgui/pbgui.db',
  cacheSize: 512
})

const systemStatus = reactive({
  cpu: 25,
  memory: 60,
  disk: 45,
  database: {
    status: 'connected'
  },
  api: {
    status: 'online'
  },
  lastUpdate: new Date().toISOString()
})

const saving = ref(false)

const getStatusColor = (percentage: number): string => {
  if (percentage < 50) return '#67c23a'
  if (percentage < 80) return '#e6a23c'
  return '#f56c6c'
}

const saveSettings = async () => {
  saving.value = true
  try {
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('Settings saved successfully')
  } catch (error) {
    ElMessage.error('Failed to save settings')
  } finally {
    saving.value = false
  }
}

const toggleDarkMode = (enabled: boolean) => {
  ElMessage.info(`Dark mode ${enabled ? 'enabled' : 'disabled'}`)
  // Implement dark mode toggle logic
}

const browseDirectory = () => {
  ElMessage.info('Directory browser would open here')
  // Implement directory browser dialog
}

const refreshStatus = () => {
  // Simulate refreshing system status
  systemStatus.cpu = Math.floor(Math.random() * 100)
  systemStatus.memory = Math.floor(Math.random() * 100)
  systemStatus.disk = Math.floor(Math.random() * 100)
  systemStatus.lastUpdate = new Date().toISOString()
  ElMessage.success('System status refreshed')
}

const exportData = async () => {
  try {
    await ElMessageBox.confirm(
      'This will export all your settings and data. Continue?',
      'Export Data',
      {
        confirmButtonText: 'Export',
        cancelButtonText: 'Cancel',
        type: 'info',
      }
    )
    ElMessage.success('Data export completed successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to export data')
    }
  }
}

const importData = async () => {
  try {
    await ElMessageBox.confirm(
      'This will overwrite your current settings and data with imported data. Continue?',
      'Import Data',
      {
        confirmButtonText: 'Import',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    ElMessage.success('Data imported successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to import data')
    }
  }
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm(
      'Clearing cache will delete temporary data. This may improve performance but some cached results will be lost. Continue?',
      'Clear Cache',
      {
        confirmButtonText: 'Clear',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )
    ElMessage.success('Cache cleared successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to clear cache')
    }
  }
}

const viewLogs = () => {
  ElMessage.info('Logs viewer would open here')
  // Implement logs viewer dialog
}

const restartSystem = async () => {
  try {
    await ElMessageBox.confirm(
      'Restarting the system will interrupt all running processes. This action cannot be undone. Continue?',
      'Restart System',
      {
        confirmButtonText: 'Restart',
        cancelButtonText: 'Cancel',
        type: 'warning',
        inputPattern: new RegExp('^RESTART$'),
        inputPlaceholder: 'Type RESTART to confirm',
        inputValidator: (value: string) => {
          if (value !== 'RESTART') {
            return 'Please type RESTART to confirm'
          }
          return true
        },
        showInput: true
      }
    )
    ElMessage.success('System restart initiated')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to restart system')
    }
  }
}

onMounted(() => {
  refreshStatus()
})
</script>

<style scoped lang="scss">
.system-view {
  .settings-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .status-card {
    .status-item {
      margin-bottom: 16px;

      .status-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #303133;
      }

      .status-time {
        color: #909399;
        font-size: 12px;
      }
    }
  }

  .actions-card {
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
  }
}
</style>
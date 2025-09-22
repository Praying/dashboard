<template>
  <div class="system-view">
    <PageHeader
      :title="t('system.title')"
      :description="t('system.description')"
    />

    <el-row :gutter="20">
      <el-col :span="16">
        <!-- General Settings -->
        <el-card class="settings-card">
          <template #header>
            <div class="card-header">
              <span>{{ t('system.generalSettings') }}</span>
              <el-button type="primary" @click="saveSettings" :loading="saving">
                {{ t('system.saveChanges') }}
              </el-button>
            </div>
          </template>

          <el-form :model="settings" :label-width="formLabelWidth">
            <el-form-item :label="t('system.settings.defaultExchange')">
              <el-select v-model="settings.defaultExchange" style="width: 300px">
                <el-option :label="t('system.exchanges.binance')" value="binance" />
                <el-option :label="t('system.exchanges.coinbase')" value="coinbase" />
                <el-option :label="t('system.exchanges.kraken')" value="kraken" />
                <el-option :label="t('system.exchanges.bitfinex')" value="bitfinex" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('system.settings.defaultTimeframe')">
              <el-select v-model="settings.defaultTimeframe" style="width: 300px">
                <el-option label="1m" value="1m" />
                <el-option label="5m" value="5m" />
                <el-option label="15m" value="15m" />
                <el-option label="1h" value="1h" />
                <el-option label="4h" value="4h" />
                <el-option label="1d" value="1d" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('system.settings.refreshInterval')">
              <el-input-number
                v-model="settings.refreshInterval"
                :min="5"
                :max="600"
                :step="5"
                style="width: 300px"
              />
              <span style="margin-left: 8px; color: var(--text-color-secondary);">{{ t('common.seconds') }}</span>
            </el-form-item>

            <el-form-item :label="t('system.settings.darkMode')">
              <el-switch v-model="settings.darkMode" @change="toggleDarkMode" />
            </el-form-item>

            <el-form-item :label="t('system.settings.emailNotifications')">
              <el-switch v-model="settings.emailNotifications" />
            </el-form-item>

            <el-form-item :label="t('system.settings.dataDirectory')">
              <el-input v-model="settings.dataDirectory" style="width: 300px">
                <template #append>
                  <el-button icon="Folder" @click="browseDirectory" />
                </template>
              </el-input>
            </el-form-item>

            <el-form-item :label="t('system.settings.logLevel')">
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
        <el-card class="settings-card advanced-config" style="margin-top: 20px;">
          <template #header>
            <span>{{ t('system.advancedSettings') }}</span>
          </template>

          <el-form :model="settings" :label-width="formLabelWidth">
            <el-form-item :label="t('system.settings.maxConcurrentBacktests')">
              <el-input-number
                v-model="settings.maxConcurrentBacktests"
                :min="1"
                :max="10"
                style="width: 300px"
              />
            </el-form-item>

            <el-form-item :label="t('system.settings.backtestTimeout')">
              <el-input-number
                v-model="settings.backtestTimeout"
                :min="30"
                :max="1440"
                :step="30"
                style="width: 300px"
              />
            </el-form-item>

            <el-form-item :label="t('system.settings.databaseConnection')">
              <el-input v-model="settings.databaseUrl" :placeholder="t('system.settings.databasePlaceholder')" style="width: 300px" />
            </el-form-item>

            <el-form-item :label="t('system.settings.cacheSize')">
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
            <div class="card-header">
              <span>{{ t('system.status.title') }}</span>
              <el-button type="primary" circle @click="refreshStatus">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </template>

          <div class="status-item">
            <span class="status-label">{{ t('system.status.cpuUsage') }}</span>
            <el-progress :percentage="systemStatus.cpu" :color="getStatusColor(systemStatus.cpu)" />
          </div>

          <div class="status-item">
            <span class="status-label">{{ t('system.status.memoryUsage') }}</span>
            <el-progress :percentage="systemStatus.memory" :color="getStatusColor(systemStatus.memory)" />
          </div>

          <div class="status-item">
            <span class="status-label">{{ t('system.status.diskUsage') }}</span>
            <el-progress :percentage="systemStatus.disk" :color="getStatusColor(systemStatus.disk)" />
          </div>

          <div class="status-item">
            <span class="status-label">{{ t('system.status.database') }}</span>
            <el-tag :type="systemStatus.database.status === 'connected' ? 'success' : 'danger'">
              {{ getStatusText(systemStatus.database.status) }}
            </el-tag>
          </div>

          <div class="status-item">
            <span class="status-label">{{ t('system.status.apiServer') }}</span>
            <el-tag :type="systemStatus.api.status === 'online' ? 'success' : 'danger'">
              {{ getStatusText(systemStatus.api.status) }}
            </el-tag>
          </div>

          <div class="status-item">
            <span class="status-label">{{ t('system.status.lastUpdate') }}</span>
            <span class="status-time">{{ formatDate(systemStatus.lastUpdate) }}</span>
          </div>
        </el-card>

        <!-- Quick Actions -->
        <el-card class="actions-card" style="margin-top: 20px;">
          <template #header>
            <span>{{ t('system.actions.title') }}</span>
          </template>

          <div class="action-buttons">
            <el-button @click="exportData">
              <span class="button-content">
                <el-icon><Download /></el-icon>
                {{ t('system.actions.exportData') }}
              </span>
            </el-button>

            <el-button @click="importData">
              <span class="button-content">
                <el-icon><Upload /></el-icon>
                {{ t('system.actions.importData') }}
              </span>
            </el-button>

            <el-button @click="clearCache">
              <span class="button-content">
                <el-icon><Delete /></el-icon>
                {{ t('system.actions.clearCache') }}
              </span>
            </el-button>

            <el-button @click="viewLogs">
              <span class="button-content">
                <el-icon><Document /></el-icon>
                {{ t('system.actions.viewLogs') }}
              </span>
            </el-button>

            <el-button type="danger" @click="restartSystem">
              <span class="button-content">
                <el-icon><Refresh /></el-icon>
                {{ t('system.actions.restartSystem') }}
              </span>
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/store/theme'
import PageHeader from '@/components/PageHeader.vue'
import { formatDate } from '@/utils/date'
import {
  Refresh,
  Download,
  Upload,
  Delete,
  Document
} from '@element-plus/icons-vue'

const { t } = useI18n()
const { theme } = useTheme()

// 动态计算表单标签宽度，根据当前语言调整
const formLabelWidth = computed(() => {
  return t('common.locale') === 'zh' ? '200px' : '220px'
})

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
  const isDark = theme.theme === 'dark'
  if (percentage < 50) return isDark ? '#3fb950' : '#67c23a'
  if (percentage < 80) return isDark ? '#d29922' : '#e6a23c'
  return isDark ? '#f85149' : '#f56c6c'
}

const saveSettings = async () => {
  saving.value = true
  try {
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success(t('system.messages.saveSuccess'))
  } catch (error) {
    ElMessage.error(t('system.messages.saveFailed'))
  } finally {
    saving.value = false
  }
}

const toggleDarkMode = (enabled: boolean) => {
  ElMessage.info(`${t('system.darkMode')} ${enabled ? t('system.enabled') : t('system.disabled')}`)
  // Implement dark mode toggle logic
}

const browseDirectory = () => {
  ElMessage.info(t('system.messages.directoryBrowser'))
  // Implement directory browser dialog
}

const refreshStatus = () => {
  // Simulate refreshing system status
  systemStatus.cpu = Math.floor(Math.random() * 100)
  systemStatus.memory = Math.floor(Math.random() * 100)
  systemStatus.disk = Math.floor(Math.random() * 100)
  systemStatus.lastUpdate = new Date().toISOString()
  ElMessage.success(t('system.messages.statusRefreshed'))
}

const exportData = async () => {
  try {
    await ElMessageBox.confirm(
      t('system.messages.exportConfirm'),
      t('system.actions.exportData'),
      {
        confirmButtonText: t('system.actions.export'),
        cancelButtonText: t('common.cancel'),
        type: 'info',
      }
    )
    ElMessage.success(t('system.messages.exportSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('system.messages.exportFailed'))
    }
  }
}

const importData = async () => {
  try {
    await ElMessageBox.confirm(
      t('system.messages.importConfirm'),
      t('system.actions.importData'),
      {
        confirmButtonText: t('system.actions.import'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    ElMessage.success(t('system.messages.importSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('system.messages.importFailed'))
    }
  }
}

const clearCache = async () => {
  try {
    await ElMessageBox.confirm(
      t('system.messages.clearCacheConfirm'),
      t('system.actions.clearCache'),
      {
        confirmButtonText: t('system.actions.clear'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )
    ElMessage.success(t('system.messages.clearCacheSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('system.messages.clearCacheFailed'))
    }
  }
}

const viewLogs = () => {
  ElMessage.info(t('system.messages.logsViewer'))
  // Implement logs viewer dialog
}

const restartSystem = async () => {
  try {
    await ElMessageBox.confirm(
      t('system.messages.restartConfirm'),
      t('system.actions.restartSystem'),
      {
        confirmButtonText: t('system.actions.restart'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
        inputPattern: new RegExp('^RESTART$'),
        inputPlaceholder: t('system.messages.restartPlaceholder'),
        inputValidator: (value: string) => {
          if (value !== 'RESTART') {
            return t('system.messages.restartValidationError')
          }
          return true
        },
        showInput: true
      }
    )
    ElMessage.success(t('system.messages.restartSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('system.messages.restartFailed'))
    }
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'connected': return t('system.status.connected')
    case 'online': return t('system.status.online')
    case 'offline': return t('system.status.offline')
    case 'disconnected': return t('system.status.disconnected')
    default: return status
  }
}

onMounted(() => {
  refreshStatus()
})
</script>

<style scoped lang="scss">
.system-view {
  .el-card {
    border-radius: 8px;
    border: 1px solid var(--border-color);
    box-shadow: 0 4px 12px var(--shadow-color);
    margin-bottom: 24px;

    &:hover {
      box-shadow: 0 6px 16px var(--shadow-hover-color);
    }

    .el-card__header {
      font-weight: 600;
      color: var(--text-color);
      border-bottom: 1px solid var(--border-color);
    }
  }

  .settings-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .el-form {
      .el-form-item {
        margin-bottom: 24px;
      }
    }
  }

  .advanced-config {
    background-color: var(--card-background-color);

    .el-card__header {
      background-color: var(--primary-color-light);
      font-weight: 600;
    }
  }

  .status-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .status-item {
      margin-bottom: 20px;

      .status-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: var(--text-color);
      }

      .status-time {
        color: var(--text-color-secondary);
        font-size: 12px;
      }
    }
  }

  .actions-card {
    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .el-button {
        width: 100%;
        margin: 0;
        border-radius: 6px;
        padding: 10px 16px;
        justify-content: flex-start;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px var(--shadow-hover-color);
        }
      }

      .button-content {
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
    }
  }
}
</style>
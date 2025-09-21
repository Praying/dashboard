<template>
  <div class="queue-view">
    <PageHeader
      :title="t('queue.title')"
      :description="t('queue.description')"
    >
      <template #actions>
        <el-button @click="refreshQueue" :loading="backtestStore.loading.queue">
          <el-icon><Refresh /></el-icon>
          {{ t('common.refresh') }}
        </el-button>
      </template>
    </PageHeader>

    <!-- Queue Status Summary -->
    <el-row :gutter="20" class="status-row">
      <el-col :span="8">
        <el-card class="status-card running">
          <div class="status-content">
            <div class="status-icon">
              <el-icon><VideoPlay /></el-icon>
            </div>
            <div class="status-info">
              <div class="status-value">{{ queueStatus.running }}</div>
              <div class="status-label">{{ t('queue.status.running') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="status-card pending">
          <div class="status-content">
            <div class="status-icon">
              <el-icon><Loading /></el-icon>
            </div>
            <div class="status-info">
              <div class="status-value">{{ queueStatus.pending }}</div>
              <div class="status-label">{{ t('queue.status.pending') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="status-card completed">
          <div class="status-content">
            <div class="status-icon">
              <el-icon><CircleCheckFilled /></el-icon>
            </div>
            <div class="status-info">
              <div class="status-value">{{ queueStatus.completed }}</div>
              <div class="status-label">{{ t('queue.status.completed') }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Queue Controls -->
    <el-card class="controls-card">
      <div class="controls-content">
        <div class="control-info">
          <h3>{{ t('queue.control.title') }}</h3>
          <p>{{ t('queue.control.description') }}</p>
        </div>
        <div class="control-actions">
          <el-button type="success" @click="startQueue" :disabled="queueStatus.running > 0">
            <el-icon><VideoPlay /></el-icon>
            {{ t('queue.control.start') }}
          </el-button>
          <el-button type="danger" @click="stopQueue" :disabled="queueStatus.running === 0">
            <el-icon><VideoPause /></el-icon>
            {{ t('queue.control.stop') }}
          </el-button>
          <el-button @click="clearQueue">
            <el-icon><Delete /></el-icon>
            {{ t('queue.control.clear') }}
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Queue Tasks Table -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('queue.tasks.title') }}</span>
          <el-badge :value="queueTasks.length" type="info" />
        </div>
      </template>

      <el-table :data="queueTasks" v-loading="backtestStore.loading.queue" stripe>
        <el-table-column prop="id" :label="t('queue.table.id')" width="80" />
        <el-table-column prop="backtest_name" :label="t('queue.table.backtest')" min-width="150" />
        <el-table-column prop="status" :label="t('queue.table.status')" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="t('queue.table.progress')" width="150">
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress"
              :status="row.status === 'failed' ? 'exception' : row.status === 'completed' ? 'success' : ''"
            />
          </template>
        </el-table-column>
        <el-table-column prop="start_time" :label="t('queue.table.startTime')" width="180">
          <template #default="{ row }">
            {{ formatDate(row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column :label="t('common.actions')" width="120">
          <template #default="{ row }">
            <el-button-group>
              <el-button
                size="small"
                @click="viewLog(row.id)"
                :disabled="!row.start_time"
              >
                <el-icon><Document /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="cancelTask(row.id)"
                :disabled="row.status === 'completed'"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="queueTasks.length === 0 && !backtestStore.loading.queue" class="empty-state">
        <el-empty :description="t('queue.empty')">
          <el-button type="primary" @click="$router.push('/backtest')">
            {{ t('queue.addBacktest') }}
          </el-button>
        </el-empty>
      </div>
    </el-card>

    <!-- Log Dialog -->
    <el-dialog
      v-model="logDialogVisible"
      :title="t('queue.log.title')"
      width="80%"
      :before-close="closeLogDialog"
    >
      <div class="log-content">
        <pre>{{ currentLog }}</pre>
      </div>
      <template #footer>
        <el-button @click="closeLogDialog">{{ t('common.close') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useBacktestStore } from '@/store/backtest'
import PageHeader from '@/components/PageHeader.vue'
import { formatDate } from '@/utils/date'
import {
  Refresh,
  VideoPlay,
  VideoPause,
  Delete,
  Document,
  Loading,
  CircleCheckFilled
} from '@element-plus/icons-vue'

const { t } = useI18n()

const backtestStore = useBacktestStore()

const queueTasks = computed(() => backtestStore.queueTasks)
const queueStatus = computed(() => backtestStore.queueStatus)

const logDialogVisible = ref(false)
const currentLog = ref('')
let refreshInterval: number

const getStatusType = (status: string) => {
  switch (status) {
    case 'running': return 'warning'
    case 'completed': return 'success'
    case 'failed': return 'danger'
    default: return 'info'
  }
}

const getStatusText = (status: string) => {
  switch (status) {
    case 'running': return t('queue.status.running')
    case 'completed': return t('queue.status.completed')
    case 'failed': return t('queue.status.failed')
    default: return status
  }
}

const refreshQueue = async () => {
  try {
    await backtestStore.fetchQueueTasks()
    await backtestStore.fetchQueueStatus()
  } catch (error) {
    ElMessage.error(t('queue.messages.refreshFailed'))
  }
}

const startQueue = async () => {
  try {
    await backtestStore.startQueue()
    ElMessage.success(t('queue.messages.startSuccess'))
    refreshQueue()
  } catch (error) {
    ElMessage.error(t('queue.messages.startFailed'))
  }
}

const stopQueue = async () => {
  try {
    await ElMessageBox.confirm(
      t('queue.messages.stopConfirm'),
      t('queue.messages.stopTitle'),
      {
        confirmButtonText: t('queue.control.stop'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )

    await backtestStore.stopQueue()
    ElMessage.success(t('queue.messages.stopSuccess'))
    refreshQueue()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('queue.messages.stopFailed'))
    }
  }
}

const clearQueue = async () => {
  try {
    await ElMessageBox.confirm(
      t('queue.messages.clearConfirm'),
      t('queue.messages.clearTitle'),
      {
        confirmButtonText: t('queue.control.clear'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )

    await backtestStore.clearQueue()
    ElMessage.success(t('queue.messages.clearSuccess'))
    refreshQueue()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('queue.messages.clearFailed'))
    }
  }
}

const viewLog = async (taskId: string) => {
  try {
    // const response = await backtestApi.getTaskLog(taskId)
    // currentLog.value = response.data
    currentLog.value = `${t('queue.log.mockLog')} ${taskId}\n${t('queue.log.starting')}\n${t('queue.log.loadingData')}\n${t('queue.log.runningStrategy')}\n${t('queue.log.completed')}`
    logDialogVisible.value = true
  } catch (error) {
    ElMessage.error(t('queue.messages.logLoadFailed'))
  }
}

const closeLogDialog = () => {
  logDialogVisible.value = false
  currentLog.value = ''
}

const cancelTask = async (_taskId: string) => {
  try {
    await ElMessageBox.confirm(
      t('queue.messages.cancelConfirm'),
      t('queue.messages.cancelTitle'),
      {
        confirmButtonText: t('queue.messages.cancelTask'),
        cancelButtonText: t('common.no'),
        type: 'warning',
      }
    )

    // Implement task cancellation API call here
    ElMessage.success(t('queue.messages.cancelSuccess'))
    refreshQueue()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('queue.messages.cancelFailed'))
    }
  }
}

onMounted(async () => {
  await refreshQueue()

  // Auto-refresh every 5 seconds when there are running tasks
  refreshInterval = setInterval(() => {
    if (queueStatus.value && queueStatus.value.running > 0) {
      refreshQueue()
    }
  }, 5000)
})

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval)
  }
})
</script>

<style scoped lang="scss">
.queue-view {
  .status-row {
    margin-bottom: 24px;
  }

  .status-card {
    border-radius: 12px;
    border: 1px solid #f0f2f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
    }

    &.running {
      border-left: 4px solid #faad14;
      
      .status-icon .el-icon {
        color: #faad14;
      }
    }

    &.pending {
      border-left: 4px solid #909399;

      .status-icon .el-icon {
        color: #909399;
      }
    }

    &.completed {
      border-left: 4px solid #67c23a;

      .status-icon .el-icon {
        color: #67c23a;
      }
    }
  }

  .status-content {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px;
  }

  .status-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: #fafbfc;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .el-icon {
      font-size: 24px;
    }
  }

  .status-info {
    flex: 1;
  }

  .status-value {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    line-height: 1.2;
  }

  .status-label {
    font-size: 14px;
    color: #606266;
    margin-top: 4px;
  }

  .controls-card {
    margin-bottom: 24px;
    border-radius: 12px;
    border: 1px solid #f0f2f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .controls-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    gap: 16px;
  }

  .control-info h3 {
    margin: 0 0 4px 0;
    color: #303133;
    font-size: 18px;
    font-weight: 600;
  }

  .control-info p {
    margin: 0;
    color: #606266;
    font-size: 14px;
    line-height: 1.5;
  }

  .control-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
    color: #303133;
  }

  .empty-state {
    padding: 40px 0;
    text-align: center;
  }

  .log-content {
    max-height: 400px;
    overflow-y: auto;
    background: #fafbfc;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #f0f2f5;

    pre {
      margin: 0;
      font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
      font-size: 13px;
      color: #303133;
      white-space: pre-wrap;
      word-wrap: break-word;
      line-height: 1.5;
    }
  }
}

// Responsive styles
@media (max-width: 768px) {
  .queue-view {
    .status-row {
      .el-col {
        margin-bottom: 16px;
      }
    }

    .controls-content {
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      
      .control-actions {
        width: 100%;
        justify-content: center;
        margin-top: 16px;
      }
    }

    .control-actions {
      .el-button {
        flex: 1;
      }
    }
  }
}
</style>
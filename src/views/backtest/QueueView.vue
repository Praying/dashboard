<template>
  <div class="queue-view">
    <PageHeader
      title="Backtest Queue"
      description="Monitor and manage backtest execution queue"
    >
      <template #actions>
        <el-button @click="refreshQueue" :loading="backtestStore.loading.queue">
          <el-icon><Refresh /></el-icon>
          Refresh
        </el-button>
      </template>
    </PageHeader>

    <!-- Queue Status Summary -->
    <el-row :gutter="20" class="status-row">
      <el-col :span="8">
        <el-card class="status-card running">
          <div class="status-content">
            <div class="status-icon">🏃</div>
            <div class="status-info">
              <div class="status-value">{{ queueStatus.running }}</div>
              <div class="status-label">Running</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="status-card pending">
          <div class="status-content">
            <div class="status-icon">⏳</div>
            <div class="status-info">
              <div class="status-value">{{ queueStatus.pending }}</div>
              <div class="status-label">Pending</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="status-card completed">
          <div class="status-content">
            <div class="status-icon">✅</div>
            <div class="status-info">
              <div class="status-value">{{ queueStatus.completed }}</div>
              <div class="status-label">Completed</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Queue Controls -->
    <el-card class="controls-card">
      <div class="controls-content">
        <div class="control-info">
          <h3>Queue Control</h3>
          <p>Manage the backtest execution queue processor</p>
        </div>
        <div class="control-actions">
          <el-button type="success" @click="startQueue" :disabled="queueStatus.running > 0">
            <el-icon><VideoPlay /></el-icon>
            Start Queue
          </el-button>
          <el-button type="danger" @click="stopQueue" :disabled="queueStatus.running === 0">
            <el-icon><VideoPause /></el-icon>
            Stop Queue
          </el-button>
          <el-button @click="clearQueue">
            <el-icon><Delete /></el-icon>
            Clear Completed
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- Queue Tasks Table -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Queue Tasks</span>
          <el-badge :value="queueTasks.length" type="info" />
        </div>
      </template>

      <el-table :data="queueTasks" v-loading="backtestStore.loading.queue" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="backtest_name" label="Backtest" min-width="150" />
        <el-table-column prop="status" label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Progress" width="150">
          <template #default="{ row }">
            <el-progress
              :percentage="row.progress"
              :status="row.status === 'failed' ? 'exception' : row.status === 'completed' ? 'success' : ''"
            />
          </template>
        </el-table-column>
        <el-table-column prop="start_time" label="Start Time" width="180">
          <template #default="{ row }">
            {{ formatDate(row.start_time) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120">
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
        <el-empty description="No tasks in queue">
          <el-button type="primary" @click="$router.push('/backtest')">
            Add Backtest to Queue
          </el-button>
        </el-empty>
      </div>
    </el-card>

    <!-- Log Dialog -->
    <el-dialog
      v-model="logDialogVisible"
      title="Task Log"
      width="80%"
      :before-close="closeLogDialog"
    >
      <div class="log-content">
        <pre>{{ currentLog }}</pre>
      </div>
      <template #footer>
        <el-button @click="closeLogDialog">Close</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBacktestStore } from '@/store/backtest'
import PageHeader from '@/components/PageHeader.vue'
import { formatDate } from '@/utils/date'
import {
  Refresh,
  VideoPlay,
  VideoPause,
  Delete,
  Document
} from '@element-plus/icons-vue'

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

const refreshQueue = async () => {
  try {
    await backtestStore.fetchQueueTasks()
    await backtestStore.fetchQueueStatus()
  } catch (error) {
    ElMessage.error('Failed to refresh queue')
  }
}

const startQueue = async () => {
  try {
    await backtestStore.startQueue()
    ElMessage.success('Queue started successfully')
    refreshQueue()
  } catch (error) {
    ElMessage.error('Failed to start queue')
  }
}

const stopQueue = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to stop the queue? This will cancel all running tasks.',
      'Confirm Stop',
      {
        confirmButtonText: 'Stop Queue',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    await backtestStore.stopQueue()
    ElMessage.success('Queue stopped successfully')
    refreshQueue()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to stop queue')
    }
  }
}

const clearQueue = async () => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to clear completed tasks?',
      'Confirm Clear',
      {
        confirmButtonText: 'Clear',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    await backtestStore.clearQueue()
    ElMessage.success('Queue cleared successfully')
    refreshQueue()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to clear queue')
    }
  }
}

const viewLog = async (taskId: string) => {
  try {
    // const response = await backtestApi.getTaskLog(taskId)
    // currentLog.value = response.data
    currentLog.value = `Mock log for task ${taskId}\nStarting backtest execution...\nLoading market data...\nRunning strategy...\nBacktest completed successfully.`
    logDialogVisible.value = true
  } catch (error) {
    ElMessage.error('Failed to load task log')
  }
}

const closeLogDialog = () => {
  logDialogVisible.value = false
  currentLog.value = ''
}

const cancelTask = async (_taskId: string) => {
  try {
    await ElMessageBox.confirm(
      'Are you sure you want to cancel this task?',
      'Confirm Cancel',
      {
        confirmButtonText: 'Cancel Task',
        cancelButtonText: 'No',
        type: 'warning',
      }
    )

    // Implement task cancellation API call here
    ElMessage.success('Task cancelled successfully')
    refreshQueue()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to cancel task')
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
    border-radius: 8px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    &.running {
      border-left: 4px solid #faad14;
    }

    &.pending {
      border-left: 4px solid #909399;
    }

    &.completed {
      border-left: 4px solid #67c23a;
    }
  }

  .status-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .status-icon {
    font-size: 24px;
  }

  .status-info {
    flex: 1;
  }

  .status-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    line-height: 1;
  }

  .status-label {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }

  .controls-card {
    margin-bottom: 24px;
  }

  .controls-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .control-info h3 {
    margin: 0 0 4px 0;
    color: #303133;
  }

  .control-info p {
    margin: 0;
    color: #909399;
    font-size: 14px;
  }

  .control-actions {
    display: flex;
    gap: 8px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }

  .empty-state {
    padding: 40px 0;
    text-align: center;
  }

  .log-content {
    max-height: 400px;
    overflow-y: auto;
    background: #f5f5f5;
    padding: 16px;
    border-radius: 4px;

    pre {
      margin: 0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}
</style>
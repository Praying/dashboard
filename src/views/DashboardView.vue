<template>
  <div class="dashboard-view">
    <PageHeader
      title="Dashboard"
      description="Welcome to PB GUI - Overview of your trading activities"
    >
      <template #actions>
        <el-button type="primary" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          Refresh
        </el-button>
      </template>
    </PageHeader>

    <!-- Statistics Cards -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon size="24"><DataLine /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalBacktests }}</div>
              <div class="stat-label">Total Backtests</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon success">
              <el-icon size="24"><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.completedBacktests }}</div>
              <div class="stat-label">Completed</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon warning">
              <el-icon size="24"><Loading /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.runningBacktests }}</div>
              <div class="stat-label">Running</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon error">
              <el-icon size="24"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.failedBacktests }}</div>
              <div class="stat-label">Failed</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts Row -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>Backtest Status Distribution</span>
            </div>
          </template>
          <div ref="pieChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>Recent Activity</span>
            </div>
          </template>
          <div ref="lineChartRef" class="chart-container"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Recent Backtests Table -->
    <el-row :gutter="20" class="table-row">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Recent Backtests</span>
              <el-button type="text" @click="$router.push('/backtest')">
                View All
              </el-button>
            </div>
          </template>
          <el-table :data="recentBacktests" v-loading="loading" stripe>
            <el-table-column prop="name" label="Name" />
            <el-table-column prop="exchanges" label="Exchanges">
              <template #default="{ row }">
                <el-tag v-for="exchange in row.exchanges" :key="exchange" size="small" class="exchange-tag">
                  {{ exchange }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="last_modified" label="Last Modified">
              <template #default="{ row }">
                {{ formatDate(row.last_modified) }}
              </template>
            </el-table-column>
            <el-table-column label="Actions" width="150">
              <template #default="{ row }">
                <el-button-group>
                  <el-button size="small" @click="viewBacktest(row.name)">
                    <el-icon><View /></el-icon>
                  </el-button>
                  <el-button size="small" type="primary" @click="runBacktest(row.name)">
                    <el-icon><VideoPlay /></el-icon>
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useBacktestStore } from '@/store/backtest'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import PageHeader from '@/components/PageHeader.vue'
import {
  DataLine,
  Check,
  Loading,
  Warning,
  Refresh,
  View,
  VideoPlay
} from '@element-plus/icons-vue'

const router = useRouter()
const backtestStore = useBacktestStore()

// Chart references
const pieChartRef = ref<HTMLElement>()
const lineChartRef = ref<HTMLElement>()
let pieChart: echarts.ECharts
let lineChart: echarts.ECharts

// Stats
const stats = ref({
  totalBacktests: 0,
  completedBacktests: 0,
  runningBacktests: 0,
  failedBacktests: 0
})

// Recent backtests
const recentBacktests = ref<any[]>([])
const loading = ref(false)

// Initialize charts
const initCharts = async () => {
  await nextTick()

  if (pieChartRef.value) {
    pieChart = echarts.init(pieChartRef.value)
    updatePieChart()
  }

  if (lineChartRef.value) {
    lineChart = echarts.init(lineChartRef.value)
    updateLineChart()
  }
}

const updatePieChart = () => {
  if (!pieChart) return

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Backtests',
        type: 'pie',
        radius: '50%',
        data: [
          { value: stats.value.completedBacktests, name: 'Completed' },
          { value: stats.value.runningBacktests, name: 'Running' },
          { value: stats.value.failedBacktests, name: 'Failed' }
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  pieChart.setOption(option)
}

const updateLineChart = () => {
  if (!lineChart) return

  // Mock data for recent activity
  const dates = []
  const counts = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString())
    counts.push(Math.floor(Math.random() * 10))
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: counts,
        type: 'line',
        smooth: true
      }
    ]
  }

  lineChart.setOption(option)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const viewBacktest = (name: string) => {
  router.push(`/backtest/${name}/results`)
}

const runBacktest = async (name: string) => {
  try {
    await backtestStore.addToQueue(name)
    ElMessage.success('Backtest added to queue')
    refreshData()
  } catch (error) {
    ElMessage.error('Failed to add backtest to queue')
  }
}

const refreshData = async () => {
  loading.value = true
  try {
    await backtestStore.fetchBacktests()
    await backtestStore.fetchQueueStatus()

    // Update stats
    const backtests = backtestStore.backtests
    recentBacktests.value = backtests.slice(0, 5) // Show recent 5

    stats.value = {
      totalBacktests: backtests.length,
      completedBacktests: 12, // Mock data for now
      runningBacktests: backtestStore.queueStatus.running,
      failedBacktests: 3 // Mock data for now
    }

    // Update charts
    updatePieChart()
    updateLineChart()
  } catch (error) {
    ElMessage.error('Failed to refresh data')
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await refreshData()
  await initCharts()

  // Handle window resize
  window.addEventListener('resize', () => {
    pieChart?.resize()
    lineChart?.resize()
  })
})
</script>

<style scoped lang="scss">
.dashboard-view {
  .stats-row {
    margin-bottom: 24px;
  }

  .stat-card {
    border-radius: 8px;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: #e6f7ff;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #409eff;

    &.success {
      background: #f6ffed;
      color: #52c41a;
    }

    &.warning {
      background: #fffbe6;
      color: #faad14;
    }

    &.error {
      background: #fff1f0;
      color: #f5222d;
    }
  }

  .stat-info {
    flex: 1;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    line-height: 1;
  }

  .stat-label {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }

  .charts-row {
    margin-bottom: 24px;
  }

  .chart-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 600;
    }
  }

  .chart-container {
    height: 300px;
  }

  .table-row {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .exchange-tag {
    margin-right: 4px;
  }
}

// Responsive styles
@media (max-width: 768px) {
  .dashboard-view {
    .stat-col {
      margin-bottom: 16px;
    }

    .chart-container {
      height: 250px;
    }
  }
}
</style>
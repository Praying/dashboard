<template>
  <div class="backtest-results-view">
    <PageHeader
      :title="`Results for ${backtestName}`"
      description="View and analyze backtest performance metrics"
    >
      <template #actions>
        <el-button @click="$router.push('/backtest')">
          <el-icon><ArrowLeft /></el-icon>
          Back to Backtests
        </el-button>
        <el-button type="primary" @click="runBacktest">
          <el-icon><VideoPlay /></el-icon>
          Run Again
        </el-button>
      </template>
    </PageHeader>

    <LoadingSpinner v-if="loading" text="Loading results..." />

    <div v-else-if="results.length === 0" class="empty-state">
      <el-empty description="No results found for this backtest">
        <el-button type="primary" @click="runBacktest">
          Run Backtest
        </el-button>
      </el-empty>
    </div>

    <div v-else>
      <!-- Summary Cards -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon">
                <el-icon size="24"><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">12.5%</div>
                <div class="stat-label">ADG</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon success">
                <el-icon size="24"><DataLine /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">1.85</div>
                <div class="stat-label">Sharpe Ratio</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon warning">
                <el-icon size="24"><Minus /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">-15.2%</div>
                <div class="stat-label">Max Drawdown</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon error">
                <el-icon size="24"><Money /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">$12,500</div>
                <div class="stat-label">Final Balance</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- Charts and Details -->
      <el-row :gutter="20" class="content-row">
        <el-col :span="16">
          <el-card class="chart-card">
            <template #header>
              <div class="card-header">
                <span>Portfolio Performance</span>
              </div>
            </template>
            <div ref="chartRef" class="chart-container"></div>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>Results List</span>
            </template>
            <el-table :data="results" size="small">
              <el-table-column prop="id" label="ID" width="80" />
              <el-table-column prop="status" label="Status" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">
                    {{ row.status }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="Actions" width="80">
                <template #default="{ row }">
                  <el-button size="small" @click="viewResultDetail(row.id)">
                    <el-icon><View /></el-icon>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useBacktestStore } from '@/store/backtest'
import * as echarts from 'echarts'
import PageHeader from '@/components/PageHeader.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import {
  ArrowLeft,
  VideoPlay,
  TrendCharts,
  DataLine,
  Minus,
  Money,
  View
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const backtestStore = useBacktestStore()

const backtestName = computed(() => route.params.name as string)
const results = computed(() => backtestStore.backtestResults)
const loading = computed(() => backtestStore.loading.results)

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts

const getStatusType = (status: string) => {
  switch (status) {
    case 'completed': return 'success'
    case 'running': return 'warning'
    case 'failed': return 'danger'
    default: return 'info'
  }
}

const initChart = async () => {
  await nextTick()

  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    updateChart()
  }
}

const updateChart = () => {
  if (!chart) return

  // Mock data for portfolio performance
  const dates = []
  const values = []
  const baseline = []

  let currentValue = 10000
  let baselineValue = 10000

  for (let i = 0; i < 365; i++) {
    const date = new Date()
    date.setDate(date.getDate() - 365 + i)
    dates.push(date.toISOString().split('T')[0])

    // Simulate portfolio growth with some volatility
    const change = (Math.random() - 0.45) * 0.02
    currentValue *= (1 + change)
    values.push(currentValue)

    // Simulate baseline (market index)
    const baselineChange = (Math.random() - 0.5) * 0.005
    baselineValue *= (1 + baselineChange)
    baseline.push(baselineValue)
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['Portfolio', 'Baseline']
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value',
      name: 'Portfolio Value ($)'
    },
    series: [
      {
        name: 'Portfolio',
        type: 'line',
        data: values,
        smooth: true,
        lineStyle: {
          color: '#409eff'
        }
      },
      {
        name: 'Baseline',
        type: 'line',
        data: baseline,
        smooth: true,
        lineStyle: {
          color: '#909399'
        }
      }
    ]
  }

  chart.setOption(option)
}

const runBacktest = async () => {
  try {
    await backtestStore.addToQueue(backtestName.value)
    ElMessage.success('Backtest added to queue')
    router.push('/queue')
  } catch (error) {
    ElMessage.error('Failed to add backtest to queue')
  }
}

const viewResultDetail = (resultId: string) => {
  // Navigate to detailed result view (to be implemented)
  ElMessage.info(`Viewing details for result ${resultId}`)
}

onMounted(async () => {
  await backtestStore.fetchBacktestResults(backtestName.value)
  await initChart()

  window.addEventListener('resize', () => {
    chart?.resize()
  })
})
</script>

<style scoped lang="scss">
.backtest-results-view {
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

  .content-row {
    margin-bottom: 24px;
  }

  .chart-card {
    .card-header {
      font-weight: 600;
    }
  }

  .chart-container {
    height: 400px;
  }

  .empty-state {
    padding: 60px 0;
    text-align: center;
  }
}
</style>
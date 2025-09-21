<template>
  <div class="backtest-list-view">
    <PageHeader
      :title="$t('backtest.title')"
      :description="$t('backtest.description')"
    >
      <template #actions>
        <el-button type="primary" @click="$router.push('/backtest/create')">
          <el-icon><Plus /></el-icon>
          {{ $t('backtest.newBacktest') }}
        </el-button>
      </template>
    </PageHeader>

    <!-- Filter and Search -->
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            :placeholder="$t('backtest.searchBacktests')"
            :prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="statusFilter" :placeholder="$t('common.status')" clearable>
            <el-option :label="$t('backtest.status.all')" value="" />
            <el-option :label="$t('backtest.status.running')" value="running" />
            <el-option :label="$t('backtest.status.completed')" value="completed" />
            <el-option :label="$t('backtest.status.failed')" value="failed" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilters">{{ $t('common.reset') }}</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- Backtests Table -->
    <el-card>
      <el-table
        :data="filteredBacktests"
        v-loading="backtestStore.loading.backtests"
        stripe
        @sort-change="handleSortChange"
      >
        <el-table-column
          prop="name"
          :label="$t('backtest.name')"
          sortable="custom"
          min-width="150"
        />
        <el-table-column
          prop="exchanges"
          :label="$t('backtest.exchanges')"
          min-width="120"
        >
          <template #default="{ row }">
            <el-tag v-for="exchange in row.exchanges" :key="exchange" size="small" class="exchange-tag">
              {{ exchange }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="start_date"
          :label="$t('backtest.startDate')"
          sortable="custom"
          width="120"
        />
        <el-table-column
          prop="end_date"
          :label="$t('backtest.endDate')"
          sortable="custom"
          width="120"
        />
        <el-table-column
          prop="last_modified"
          :label="$t('dashboard.lastModified')"
          sortable="custom"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.last_modified) }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('common.actions')"
          width="200"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button-group>
              <el-button
                size="small"
                @click="editBacktest(row.name)"
                :title="$t('common.edit')"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="viewResults(row.name)"
                :title="$t('backtest.viewResults')"
              >
                <el-icon><DataLine /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="success"
                @click="runBacktest(row.name)"
                :title="$t('backtest.runBacktest')"
              >
                <el-icon><VideoPlay /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteBacktest(row.name)"
                :title="$t('common.delete')"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- Empty State -->
      <div v-if="filteredBacktests.length === 0 && !backtestStore.loading.backtests" class="empty-state">
        <el-empty :description="$t('backtest.noBacktestsFound')">
          <el-button type="primary" @click="$router.push('/backtest/create')">
            {{ $t('backtest.createFirstBacktest') }}
          </el-button>
        </el-empty>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useBacktestStore } from '@/store/backtest'
import PageHeader from '@/components/PageHeader.vue'
import { formatDate } from '@/utils/date'
import {
  Plus,
  Search,
  Edit,
  DataLine,
  VideoPlay,
  Delete
} from '@element-plus/icons-vue'

const { t } = useI18n()

const router = useRouter()
const backtestStore = useBacktestStore()

// Search and filter state
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('last_modified')
const sortOrder = ref('descending')

// Computed filtered backtests
const filteredBacktests = computed(() => {
  let backtests = [...backtestStore.backtests]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    backtests = backtests.filter(backtest =>
      backtest.name.toLowerCase().includes(query) ||
      backtest.exchanges.some(exchange => exchange.toLowerCase().includes(query))
    )
  }

  // Apply status filter (mock for now)
  if (statusFilter.value) {
    // This would need actual status data from the backtest
    // For now, we'll just return all backtests
  }

  // Apply sorting
  backtests.sort((a, b) => {
    const aValue = a[sortBy.value as keyof typeof a]
    const bValue = b[sortBy.value as keyof typeof b]

    if (sortOrder.value === 'ascending') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return backtests
})

const handleSortChange = ({ prop, order }: { prop: string; order: string }) => {
  sortBy.value = prop
  sortOrder.value = order
}

const resetFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  sortBy.value = 'last_modified'
  sortOrder.value = 'descending'
}

const editBacktest = (name: string) => {
  router.push(`/backtest/${name}`)
}

const viewResults = (name: string) => {
  router.push(`/backtest/${name}/results`)
}

const runBacktest = async (name: string) => {
  try {
    await backtestStore.addToQueue(name)
    ElMessage.success(t('backtest.messages.addedToQueue'))
  } catch (error) {
    ElMessage.error(t('backtest.messages.addToQueueError'))
  }
}

const deleteBacktest = async (name: string) => {
  try {
    await ElMessageBox.confirm(
      t('backtest.messages.confirmDelete', { name }),
      t('backtest.messages.confirmDeleteTitle'),
      {
        confirmButtonText: t('common.delete'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )

    await backtestStore.deleteBacktest(name)
    ElMessage.success(t('backtest.messages.deleteSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('backtest.messages.deleteError'))
    }
  }
}

// Load backtests on component mount
backtestStore.fetchBacktests()
</script>

<style scoped lang="scss">
.backtest-list-view {
  .filter-card {
    margin-bottom: 20px;
  }

  .exchange-tag {
    margin-right: 4px;
  }

  .el-table :deep(td), .el-table :deep(th) {
    padding: 16px 0;
    border-bottom: 1px solid #f0f2f5;
  }

  .el-button-group {
    gap: 8px;
  }

  .empty-state {
    padding: 40px 0;
    text-align: center;
  }
}
</style>
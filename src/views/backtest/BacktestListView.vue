<template>
  <div class="backtest-list-view">
    <PageHeader
      title="Backtests"
      description="Manage your backtest configurations"
    >
      <template #actions>
        <el-button type="primary" @click="$router.push('/backtest/create')">
          <el-icon><Plus /></el-icon>
          New Backtest
        </el-button>
      </template>
    </PageHeader>

    <!-- Filter and Search -->
    <el-card class="filter-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            v-model="searchQuery"
            placeholder="Search backtests..."
            :prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :span="4">
          <el-select v-model="statusFilter" placeholder="Status" clearable>
            <el-option label="All" value="" />
            <el-option label="Running" value="running" />
            <el-option label="Completed" value="completed" />
            <el-option label="Failed" value="failed" />
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button @click="resetFilters">Reset</el-button>
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
          label="Name"
          sortable="custom"
          min-width="150"
        />
        <el-table-column
          prop="exchanges"
          label="Exchanges"
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
          label="Start Date"
          sortable="custom"
          width="120"
        />
        <el-table-column
          prop="end_date"
          label="End Date"
          sortable="custom"
          width="120"
        />
        <el-table-column
          prop="last_modified"
          label="Last Modified"
          sortable="custom"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.last_modified) }}
          </template>
        </el-table-column>
        <el-table-column
          label="Actions"
          width="200"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button-group>
              <el-button
                size="small"
                @click="editBacktest(row.name)"
                title="Edit"
              >
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="viewResults(row.name)"
                title="View Results"
              >
                <el-icon><DataLine /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="success"
                @click="runBacktest(row.name)"
                title="Run Backtest"
              >
                <el-icon><VideoPlay /></el-icon>
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteBacktest(row.name)"
                title="Delete"
              >
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <!-- Empty State -->
      <div v-if="filteredBacktests.length === 0 && !backtestStore.loading.backtests" class="empty-state">
        <el-empty description="No backtests found">
          <el-button type="primary" @click="$router.push('/backtest/create')">
            Create your first backtest
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
    ElMessage.success('Backtest added to queue')
  } catch (error) {
    ElMessage.error('Failed to add backtest to queue')
  }
}

const deleteBacktest = async (name: string) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the backtest "${name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    await backtestStore.deleteBacktest(name)
    ElMessage.success('Backtest deleted successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete backtest')
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

  .empty-state {
    padding: 40px 0;
    text-align: center;
  }
}
</style>
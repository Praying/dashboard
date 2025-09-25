<template>
  <div class="enhanced-demo">
    <!-- Page Header with Enhanced Card -->
    <EnhancedCard
      :title="$t('enhancedDemo.title')"
      :description="$t('enhancedDemo.description')"
      variant="primary"
      size="lg"
      hoverable
    >
      <template #headerActions>
        <EnhancedButton variant="outline" size="sm" @click="refreshDemo">
          <template #prefix>🔄</template>
          {{ $t('common.refresh') }}
        </EnhancedButton>
      </template>

      <div class="demo-controls">
        <EnhancedButton
          variant="primary"
          @click="showLoading = !showLoading"
        >
          {{ showLoading ? 'Hide Global Loading' : 'Show Global Loading' }}
        </EnhancedButton>

        <EnhancedButton
          variant="success"
          @click="addNewItem"
        >
          <template #prefix>+</template>
          Add New Item
        </EnhancedButton>

        <EnhancedButton
          variant="outline"
          @click="clearData"
        >
          <template #prefix>🗑️</template>
          Clear Data
        </EnhancedButton>
      </div>

      <div class="theme-toggle">
        <EnhancedButton
          :variant="isDark ? 'ghost' : 'primary'"
          size="sm"
          @click="toggleTheme"
          round
        >
          {{ isDark ? '🌙' : '☀️' }}
        </EnhancedButton>
      </div>
    </EnhancedCard>

    <!-- Enhanced Cards Grid -->
    <div class="cards-grid">
      <EnhancedCard
        v-for="card in statCards"
        :key="card.key"
        :title="card.title"
        :size="card.size"
        :variant="card.variant"
        :hoverable="card.hoverable"
        :selected="card.selected"
        @click="card.onClick"
      >
        <div class="stat-content">
          <div class="stat-value" :style="{ color: getVariantColor(card.variant) }">
            {{ card.value }}
          </div>
          <div class="stat-trend" :class="`stat-trend--${card.trend}`">
            {{ card.trend === 'up' ? '↗️' : '↘️' }} {{ card.trendValue }}%
          </div>
        </div>

        <template #footer>
          <EnhancedButton
            variant="ghost"
            size="sm"
            full-width
            @click.stop="viewDetails(card.key)"
          >
            View Details
          </EnhancedButton>
        </template>
      </EnhancedCard>
    </div>

    <!-- Enhanced Table -->
    <EnhancedCard title="Recent Activity" size="md">
      <EnhancedTable
        :data="tableData"
        :columns="tableColumns"
        :loading="tableLoading"
        size="md"
        striped
        hoverable
        :pagination="true"
        :page-size="5"
        @row-click="handleRowClick"
        @sort="handleSort"
      >
        <template #cell-status="{ row }">
          <div class="status-cell">
            <span
              class="status-indicator"
              :class="`status-indicator--${row.status}`"
            ></span>
            {{ row.status }}
          </div>
        </template>

        <template #cell-actions="{ row }">
          <div class="action-buttons">
            <EnhancedButton variant="ghost" size="xs" @click.stop="editItem(row)">
              ✏️
            </EnhancedButton>
            <EnhancedButton variant="ghost" size="xs" @click.stop="deleteItem(row)">
              🗑️
            </EnhancedButton>
          </div>
        </template>

        <template #empty>
          <EmptyState
            variant="search"
            title="No activity found"
            description="There are no recent activities to display."
            :actions="[
              {
                label: 'Refresh Data',
                variant: 'primary',
                onClick: refreshTable
              }
            ]"
          >
            <p>Try refreshing the data or check back later for new activities.</p>
          </EmptyState>
        </template>
      </EnhancedTable>
    </EnhancedCard>

    <!-- Button Examples -->
    <EnhancedCard title="Button Examples" size="md">
      <div class="button-showcase">
        <div class="button-section">
          <h4>Primary Variants</h4>
          <div class="button-row">
            <EnhancedButton variant="primary">Default</EnhancedButton>
            <EnhancedButton variant="secondary">Secondary</EnhancedButton>
            <EnhancedButton variant="success">Success</EnhancedButton>
            <EnhancedButton variant="warning">Warning</EnhancedButton>
            <EnhancedButton variant="danger">Danger</EnhancedButton>
          </div>
        </div>

        <div class="button-section">
          <h4>Style Variants</h4>
          <div class="button-row">
            <EnhancedButton variant="outline">Outline</EnhancedButton>
            <EnhancedButton variant="ghost">Ghost</EnhancedButton>
            <EnhancedButton variant="link">Link</EnhancedButton>
          </div>
        </div>

        <div class="button-section">
          <h4>Sizes</h4>
          <div class="button-row">
            <EnhancedButton size="xs">Extra Small</EnhancedButton>
            <EnhancedButton size="sm">Small</EnhancedButton>
            <EnhancedButton size="md">Medium</EnhancedButton>
            <EnhancedButton size="lg">Large</EnhancedButton>
          </div>
        </div>

        <div class="button-section">
          <h4>With Icons</h4>
          <div class="button-row">
            <EnhancedButton>
              <template #prefix>👍</template>
              With Prefix
            </EnhancedButton>
            <EnhancedButton>
              With Suffix
              <template #suffix>❤️</template>
            </EnhancedButton>
            <EnhancedButton size="lg" round>
              <span style="font-size: 1.2em;">⚡</span>
            </EnhancedButton>
          </div>
        </div>

        <div class="button-section">
          <h4>States</h4>
          <div class="button-row">
            <EnhancedButton :loading="true">Loading</EnhancedButton>
            <EnhancedButton disabled>Disabled</EnhancedButton>
            <EnhancedButton block>Block Button</EnhancedButton>
          </div>
        </div>
      </div>
    </EnhancedCard>

    <!-- Global Loading Component -->
    <GlobalLoading
      v-model="showLoading"
      :text="loadingText"
      :progress="loadingProgress"
      :cancellable="true"
      @cancel="handleCancelLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import EnhancedCard from '@/components/EnhancedCard.vue'
import EnhancedButton from '@/components/EnhancedButton.vue'
import EnhancedTable, { type TableColumn } from '@/components/EnhancedTable.vue'
import EmptyState from '@/components/EmptyState.vue'
import GlobalLoading from '@/components/GlobalLoading.vue'
import { useTheme } from '@/store/theme'
import { ElMessage } from 'element-plus'

const { theme, toggleTheme } = useTheme()

// Theme state
const isDark = computed(() => theme.theme === 'dark')

// Loading state
const showLoading = ref(false)
const loadingText = ref('Processing...')
const loadingProgress = ref<number | undefined>(undefined)

// Table data
const tableLoading = ref(false)
const tableData = ref([
  {
    id: 1,
    name: 'System Update',
    type: 'Update',
    status: 'completed',
    date: '2024-01-15',
    user: 'Admin'
  },
  {
    id: 2,
    name: 'Data Backup',
    type: 'Backup',
    status: 'running',
    date: '2024-01-15',
    user: 'System'
  },
  {
    id: 3,
    name: 'Security Scan',
    type: 'Security',
    status: 'pending',
    date: '2024-01-14',
    user: 'Admin'
  }
])

const tableColumns: TableColumn[] = [
  { key: 'name', title: 'Name', sortable: true },
  { key: 'type', title: 'Type', sortable: true },
  { key: 'status', title: 'Status', sortable: true },
  { key: 'date', title: 'Date', sortable: true },
  { key: 'user', title: 'User', sortable: true },
  { key: 'actions', title: 'Actions', align: 'center' }
]

// Stat cards
const statCards = ref([
  {
    key: 'users',
    title: 'Total Users',
    value: '1,234',
    trend: 'up',
    trendValue: '12',
    size: 'md' as const,
    variant: 'primary' as const,
    hoverable: true,
    selected: false,
    onClick: () => ElMessage.info('Viewing user details')
  },
  {
    key: 'revenue',
    title: 'Revenue',
    value: '$45,678',
    trend: 'up',
    trendValue: '8',
    size: 'md' as const,
    variant: 'success' as const,
    hoverable: true,
    selected: false,
    onClick: () => ElMessage.info('Viewing revenue details')
  },
  {
    key: 'conversion',
    title: 'Conversion Rate',
    value: '3.45%',
    trend: 'down',
    trendValue: '2',
    size: 'md' as const,
    variant: 'warning' as const,
    hoverable: true,
    selected: false,
    onClick: () => ElMessage.info('Viewing conversion details')
  },
  {
    key: 'errors',
    title: 'Error Rate',
    value: '0.12%',
    trend: 'up',
    trendValue: '5',
    size: 'md' as const,
    variant: 'danger' as const,
    hoverable: true,
    selected: false,
    onClick: () => ElMessage.info('Viewing error details')
  }
])

// Methods
const refreshDemo = () => {
  ElMessage.success('Demo refreshed successfully!')
}

const addNewItem = () => {
  const newItem = {
    id: tableData.value.length + 1,
    name: `New Task ${tableData.value.length + 1}`,
    type: 'Task',
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    user: 'User'
  }
  tableData.value.unshift(newItem)
  ElMessage.success('New item added!')
}

const clearData = () => {
  tableData.value = []
  ElMessage.warning('Data cleared!')
}

const refreshTable = () => {
  tableLoading.value = true
  setTimeout(() => {
    // Simulate data refresh
    tableData.value = [
      {
        id: 1,
        name: 'System Update',
        type: 'Update',
        status: 'completed',
        date: '2024-01-15',
        user: 'Admin'
      },
      {
        id: 2,
        name: 'Data Backup',
        type: 'Backup',
        status: 'running',
        date: '2024-01-15',
        user: 'System'
      }
    ]
    tableLoading.value = false
    ElMessage.success('Table data refreshed!')
  }, 1500)
}

const handleRowClick = (row: any) => {
  ElMessage.info(`Clicked on: ${row.name}`)
}

const handleSort = (key: string, order: 'asc' | 'desc') => {
  ElMessage.info(`Sorting by ${key} (${order})`)
}

const editItem = (item: any) => {
  ElMessage.info(`Editing: ${item.name}`)
}

const deleteItem = (item: any) => {
  const index = tableData.value.findIndex(row => row.id === item.id)
  if (index > -1) {
    tableData.value.splice(index, 1)
    ElMessage.success(`Deleted: ${item.name}`)
  }
}

const viewDetails = (key: string) => {
  ElMessage.info(`Viewing details for: ${key}`)
}

const getVariantColor = (variant: string) => {
  const colorMap: Record<string, string> = {
    primary: 'var(--primary-500)',
    secondary: 'var(--secondary-500)',
    success: 'var(--success-500)',
    warning: 'var(--warning-500)',
    danger: 'var(--danger-500)',
    info: 'var(--info-500)'
  }
  return colorMap[variant] || 'var(--primary-500)'
}

const handleCancelLoading = () => {
  ElMessage.info('Loading cancelled by user')
}

// Simulate loading with progress
const simulateLoading = () => {
  loadingText.value = 'Initializing...'
  loadingProgress.value = 0

  const interval = setInterval(() => {
    if (loadingProgress.value !== undefined && loadingProgress.value < 100) {
      loadingProgress.value += 10

      if (loadingProgress.value < 30) {
        loadingText.value = 'Loading resources...'
      } else if (loadingProgress.value < 70) {
        loadingText.value = 'Processing data...'
      } else if (loadingProgress.value < 90) {
        loadingText.value = 'Finalizing...'
      } else {
        loadingText.value = 'Almost done...'
      }
    } else {
      clearInterval(interval)
      setTimeout(() => {
        showLoading.value = false
        loadingProgress.value = undefined
        ElMessage.success('Operation completed successfully!')
      }, 500)
    }
  }, 300)
}

// Watch for showLoading changes
const loadingWatch = watch(showLoading, (newValue) => {
  if (newValue) {
    simulateLoading()
  }
})

// Initialize with some sample data if empty
onMounted(() => {
  if (tableData.value.length === 0) {
    refreshTable()
  }
})

// Cleanup watcher on unmount
onUnmounted(() => {
  loadingWatch()
})
</script>

<style lang="scss" scoped>
.enhanced-demo {
  padding: var(--space-6) var(--space-4);
  max-width: 1400px;
  margin: 0 auto;

  .demo-controls {
    display: flex;
    gap: var(--space-3);
    flex-wrap: wrap;
  }

  .theme-toggle {
    margin-left: auto;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-4);
    margin: var(--space-6) 0;
  }

  .stat-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-2);
  }

  .stat-value {
    font-size: var(--text-2xl);
    font-weight: bold;
  }

  .stat-trend {
    font-size: var(--text-sm);
    font-weight: 600;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);

    &--up {
      color: var(--success-600);
      background: var(--success-50);
    }

    &--down {
      color: var(--danger-600);
      background: var(--danger-50);
    }
  }

  .status-cell {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  .status-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--text-color-secondary);

    &--completed {
      background: var(--success-500);
    }

    &--running {
      background: var(--primary-500);
      animation: pulse 2s infinite;
    }

    &--pending {
      background: var(--warning-500);
    }
  }

  .action-buttons {
    display: flex;
    gap: var(--space-1);
  }

  .button-showcase {
    .button-section {
      margin-bottom: var(--space-6);

      h4 {
        margin: 0 0 var(--space-3);
        color: var(--text-color);
        font-size: var(--text-base);
        font-weight: 600;
      }
    }

    .button-row {
      display: flex;
      gap: var(--space-3);
      flex-wrap: wrap;
      align-items: center;
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

// Responsive adjustments
// Define responsive mixin locally since Vue scoped styles can't access global mixins
@mixin respond-to-local($breakpoint) {
  @if $breakpoint == md {
    @media (min-width: 768px) { @content; }
  }
  @if $breakpoint == sm {
    @media (min-width: 640px) { @content; }
  }
}

@include respond-to-local(md) {
  .enhanced-demo {
    padding: var(--space-8) var(--space-6);
  }
}

@include respond-to-local(sm) {
  .enhanced-demo {
    padding: var(--space-4);

    .demo-controls {
      flex-direction: column;
    }

    .theme-toggle {
      margin-left: 0;
      align-self: flex-start;
    }

    .cards-grid {
      grid-template-columns: 1fr;
    }

    .button-showcase {
      .button-row {
        flex-direction: column;
        align-items: stretch;
      }
    }
  }
}
</style>
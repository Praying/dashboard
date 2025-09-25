<template>
  <div class="enhanced-table-wrapper">
    <!-- Table Header with Actions -->
    <div v-if="title || $slots.headerActions" class="enhanced-table__header">
      <div class="enhanced-table__header-content">
        <h3 v-if="title" class="enhanced-table__title">{{ title }}</h3>
        <p v-if="description" class="enhanced-table__description">{{ description }}</p>
      </div>

      <div v-if="$slots.headerActions" class="enhanced-table__header-actions">
        <slot name="headerActions"></slot>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="enhanced-table__loading">
      <div class="enhanced-table__loading-spinner"></div>
      <p class="enhanced-table__loading-text">{{ loadingText }}</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!data || data.length === 0" class="enhanced-table__empty">
      <slot name="empty">
        <div class="enhanced-table__empty-content">
          <div class="enhanced-table__empty-icon">📊</div>
          <h4 class="enhanced-table__empty-title">{{ emptyTitle }}</h4>
          <p class="enhanced-table__empty-description">{{ emptyDescription }}</p>
          <EnhancedButton
            v-if="emptyActionText"
            variant="primary"
            size="sm"
            @click="$emit('empty-action')"
          >
            {{ emptyActionText }}
          </EnhancedButton>
        </div>
      </slot>
    </div>

    <!-- Main Table -->
    <div v-else class="enhanced-table__container">
      <table
        ref="tableRef"
        class="enhanced-table"
        :class="[
          `enhanced-table--size-${size}`,
          {
            'enhanced-table--striped': striped,
            'enhanced-table--hoverable': hoverable,
            'enhanced-table--bordered': bordered,
            'enhanced-table--compact': compact
          }
        ]"
      >
        <!-- Table Head -->
        <thead class="enhanced-table__thead">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="enhanced-table__th"
              :class="[
                `enhanced-table__th--align-${column.align || 'left'}`,
                { 'enhanced-table__th--sortable': column.sortable }
              ]"
              @click="column.sortable ? handleSort(column.key) : null"
            >
              <div class="enhanced-table__th-content">
                <span class="enhanced-table__th-text">{{ column.title }}</span>

                <!-- Sort Indicator -->
                <span v-if="column.sortable" class="enhanced-table__sort-indicator">
                  <span
                    class="enhanced-table__sort-icon"
                    :class="{
                      'enhanced-table__sort-icon--active': sortKey === column.key,
                      'enhanced-table__sort-icon--asc': sortKey === column.key && sortOrder === 'asc',
                      'enhanced-table__sort-icon--desc': sortKey === column.key && sortOrder === 'desc'
                    }"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 2L9 6H3L6 2Z"/>
                      <path d="M6 10L3 6H9L6 10Z"/>
                    </svg>
                  </span>
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <!-- Table Body -->
        <tbody class="enhanced-table__tbody">
          <tr
            v-for="(row, rowIndex) in paginatedData"
            :key="rowKey ? row[rowKey] : rowIndex"
            class="enhanced-table__tr"
            :class="{
              'enhanced-table__tr--selected': isRowSelected(row),
              'enhanced-table__tr--clickable': rowClickable
            }"
            @click="handleRowClick(row)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="enhanced-table__td"
              :class="`enhanced-table__td--align-${column.align || 'left'}`"
              :data-label="column.title"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :column="column"
                :value="row[column.key]"
                :row-index="rowIndex"
              >
                {{ formatCellValue(row[column.key], column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Table Footer with Pagination -->
      <div v-if="pagination && totalPages > 1" class="enhanced-table__footer">
        <div class="enhanced-table__pagination-info">
          Showing {{ startRecord }}-{{ endRecord }} of {{ totalRecords }} records
        </div>

        <div class="enhanced-table__pagination">
          <EnhancedButton
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage = 1"
          >
            «
          </EnhancedButton>

          <EnhancedButton
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            ‹
          </EnhancedButton>

          <span class="enhanced-table__page-info">
            Page {{ currentPage }} of {{ totalPages }}
          </span>

          <EnhancedButton
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            ›
          </EnhancedButton>

          <EnhancedButton
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage = totalPages"
          >
            »
          </EnhancedButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import EnhancedButton from './EnhancedButton.vue'

export interface TableColumn {
  key: string
  title: string
  align?: 'left' | 'center' | 'right'
  sortable?: boolean
  format?: (value: any) => string
  width?: string
}

export interface EnhancedTableProps {
  data: any[]
  columns: TableColumn[]
  title?: string
  description?: string
  loading?: boolean
  loadingText?: string
  emptyTitle?: string
  emptyDescription?: string
  emptyActionText?: string
  size?: 'sm' | 'md' | 'lg'
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
  rowClickable?: boolean
  rowKey?: string
  pagination?: boolean
  pageSize?: number
  defaultSort?: {
    key: string
    order: 'asc' | 'desc'
  }
}

const props = withDefaults(defineProps<EnhancedTableProps>(), {
  loading: false,
  loadingText: 'Loading data...',
  emptyTitle: 'No data available',
  emptyDescription: 'There are no records to display.',
  emptyActionText: '',
  size: 'md',
  striped: true,
  hoverable: true,
  bordered: false,
  compact: false,
  rowClickable: false,
  pagination: true,
  pageSize: 10
})

const emit = defineEmits<{
  'row-click': [row: any]
  'sort': [key: string, order: 'asc' | 'desc']
  'empty-action': []
}>()

// Sort state
const sortKey = ref(props.defaultSort?.key || '')
const sortOrder = ref<'asc' | 'desc'>(props.defaultSort?.order || 'asc')

// Pagination state
const currentPage = ref(1)

// Computeds
const sortedData = computed(() => {
  if (!sortKey.value) return props.data

  return [...props.data].sort((a, b) => {
    const aValue = a[sortKey.value]
    const bValue = b[sortKey.value]

    if (aValue === bValue) return 0

    let comparison = 0
    if (aValue < bValue) comparison = -1
    else if (aValue > bValue) comparison = 1

    return sortOrder.value === 'asc' ? comparison : -comparison
  })
})

const totalRecords = computed(() => props.data.length)
const totalPages = computed(() => Math.ceil(totalRecords.value / props.pageSize))

const startRecord = computed(() => (currentPage.value - 1) * props.pageSize + 1)
const endRecord = computed(() => Math.min(currentPage.value * props.pageSize, totalRecords.value))

const paginatedData = computed(() => {
  if (!props.pagination) return sortedData.value

  const start = (currentPage.value - 1) * props.pageSize
  const end = start + props.pageSize
  return sortedData.value.slice(start, end)
})

// Methods
const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }

  emit('sort', sortKey.value, sortOrder.value)
}

const handleRowClick = (row: any) => {
  if (props.rowClickable) {
    emit('row-click', row)
  }
}

const formatCellValue = (value: any, column: TableColumn) => {
  if (column.format) {
    return column.format(value)
  }

  if (value === null || value === undefined) {
    return '-'
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  if (typeof value === 'number') {
    return value.toLocaleString()
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return String(value)
}

const isRowSelected = (row: any) => {
  // This can be enhanced with proper selection logic
  return false
}

// Watchers
watch(() => props.data, () => {
  currentPage.value = 1
})

watch(() => props.defaultSort, (newSort) => {
  if (newSort) {
    sortKey.value = newSort.key
    sortOrder.value = newSort.order
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
// Define enhanced-card mixin locally since Vue scoped styles can't access global mixins
@mixin enhanced-card-local {
  background: var(--card-background-color);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: var(--shadow-base);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    box-shadow: var(--shadow-lg);
    transform: translateY(-2px);
    border-color: rgba(0, 0, 0, 0.08);
  }

  .card-header {
    padding: var(--space-6) var(--space-6) var(--space-4);
    border-bottom: 1px solid var(--border-color);

    .card-title {
      font-size: var(--text-lg);
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
      line-height: var(--leading-tight);
    }

    .card-description {
      font-size: var(--text-sm);
      color: var(--text-color-secondary);
      margin: var(--space-1) 0 0;
      line-height: var(--leading-normal);
    }
  }

  .card-content {
    padding: var(--space-6);
  }

  .card-footer {
    padding: var(--space-4) var(--space-6);
    border-top: 1px solid var(--border-color);
    background: var(--background-color);
    background-color: rgba(var(--border-color-rgb, 0.05));
  }
}

.enhanced-table-wrapper {
  @include enhanced-card-local;
  overflow: hidden;

  // Header
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: var(--space-4) var(--space-6) var(--space-2);
    border-bottom: 1px solid var(--border-color);
  }

  &__header-content {
    flex: 1;
  }

  &__header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

  &__title {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 var(--space-1);
  }

  &__description {
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
    margin: 0;
  }

  // Loading state
  &__loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--space-16) var(--space-8);
    background: var(--background-color);
  }

  &__loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--primary-100);
    border-top-color: var(--primary-500);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: var(--space-4);
  }

  &__loading-text {
    color: var(--text-color-secondary);
    font-size: var(--text-base);
    margin: 0;
  }

  // Empty state
  &__empty {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-16) var(--space-8);
    background: var(--background-color);
  }

  &__empty-content {
    text-align: center;
    max-width: 400px;
  }

  &__empty-icon {
    font-size: var(--text-4xl);
    margin-bottom: var(--space-4);
    opacity: 0.5;
  }

  &__empty-title {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--text-color);
    margin: 0 0 var(--space-2);
  }

  &__empty-description {
    color: var(--text-color-secondary);
    margin: 0 0 var(--space-4);
  }

  // Container
  &__container {
    overflow-x: auto;
    background: var(--background-color);
  }

  // Footer and pagination
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-6);
    border-top: 1px solid var(--border-color);
    background: var(--background-color);
  }

  &__pagination-info {
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
  }

  &__pagination {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  &__page-info {
    font-size: var(--text-sm);
    color: var(--text-color-secondary);
    margin: 0 var(--space-2);
  }
}

// Define enhanced-table mixin locally since Vue scoped styles can't access global mixins
@mixin enhanced-table-local {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  th, td {
    text-align: left;
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-color);
  }

  th {
    background: var(--background-color);
    font-weight: 600;
    color: var(--text-color);
    font-size: var(--text-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid var(--border-color);

    &:first-child {
      border-top-left-radius: var(--radius-md);
    }

    &:last-child {
      border-top-right-radius: var(--radius-md);
    }
  }

  tr {
    transition: background-color 0.2s ease;

    &:hover {
      background: var(--primary-50);
    }

    &:last-child td {
      border-bottom: none;

      &:first-child {
        border-bottom-left-radius: var(--radius-md);
      }

      &:last-child {
        border-bottom-right-radius: var(--radius-md);
      }
    }
  }

  td {
    color: var(--text-color);
    font-size: var(--text-sm);
  }

  // Responsive table for mobile
  @media (max-width: 640px) {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    thead { display: none; }

    tbody, tr, td { display: block; }

    tr {
      margin: var(--space-4) 0;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: var(--space-4);
    }

    td {
      text-align: right;
      padding-left: 50%;
      position: relative;
      border-bottom: 1px dashed var(--border-color-rgb);
      padding: var(--space-2) var(--space-4);

      &:last-child {
        border-bottom: none;
      }

      &::before {
        content: attr(data-label);
        position: absolute;
        left: var(--space-4);
        width: calc(45% - var(--space-6));
        padding-right: var(--space-2);
        text-align: left;
        font-weight: 600;
        color: var(--text-color-secondary);
      }
    }
  }
}

.enhanced-table {
  @include enhanced-table-local;
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;

  // Size variants
  &--size-sm {
    th, td {
      padding: var(--space-2) var(--space-3);
      font-size: var(--text-xs);
    }

    .enhanced-table__th-text {
      font-size: var(--text-xs);
    }
  }

  &--size-md {
    th, td {
      padding: var(--space-3) var(--space-4);
      font-size: var(--text-sm);
    }

    .enhanced-table__th-text {
      font-size: var(--text-sm);
    }
  }

  &--size-lg {
    th, td {
      padding: var(--space-4) var(--space-6);
      font-size: var(--text-base);
    }

    .enhanced-table__th-text {
      font-size: var(--text-base);
    }
  }

  // Style variants
  &--striped {
    .enhanced-table__tr:nth-child(even) {
      background: var(--primary-50);
    }
  }

  &--hoverable {
    .enhanced-table__tr:hover {
      background: var(--primary-100);
      cursor: pointer;
    }
  }

  &--bordered {
    th, td {
      border: 1px solid var(--border-color);
    }
  }

  &--compact {
    th, td {
      padding: var(--space-1) var(--space-2);
    }
  }

  // Table elements
  &__thead {
    background: var(--background-color);
  }

  &__th {
    font-weight: 600;
    color: var(--text-color);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid var(--border-color);
    white-space: nowrap;
    user-select: none;

    &--sortable {
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: var(--primary-50);
      }
    }

    &--align-left {
      text-align: left;
    }

    &--align-center {
      text-align: center;
    }

    &--align-right {
      text-align: right;
    }
  }

  &__th-content {
    display: flex;
    align-items: center;
    gap: var(--space-1);
  }

  &__sort-indicator {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
  }

  &__sort-icon {
    color: var(--text-color-secondary);
    transition: color 0.2s ease;

    &--active {
      color: var(--primary-500);
    }

    &--asc svg path:first-child {
      opacity: 1;
      fill: currentColor;
    }

    &--asc svg path:last-child {
      opacity: 0.3;
    }

    &--desc svg path:first-child {
      opacity: 0.3;
    }

    &--desc svg path:last-child {
      opacity: 1;
      fill: currentColor;
    }
  }

  &__tbody {
    // tbody styles
  }

  &__tr {
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s ease, transform 0.2s ease;

    &--selected {
      background: var(--primary-100) !important;
      box-shadow: inset 3px 0 0 var(--primary-500);
    }

    &--clickable {
      cursor: pointer;
    }

    &:last-child td {
      border-bottom: none;
    }
  }

  &__td {
    color: var(--text-color);
    border-bottom: 1px solid var(--border-color);

    &--align-left {
      text-align: left;
    }

    &--align-center {
      text-align: center;
    }

    &--align-right {
      text-align: right;
    }
  }
}

// Dark theme adjustments
html.dark {
  .enhanced-table {
    &--striped {
      .enhanced-table__tr:nth-child(even) {
        background: rgba(255, 255, 255, 0.02);
      }
    }

    &--hoverable {
      .enhanced-table__tr:hover {
        background: rgba(255, 255, 255, 0.05);
      }
    }

    &__th {
      background: var(--card-background-color);
    }

    &__tr--selected {
      background: rgba(88, 166, 255, 0.1) !important;
    }
  }
}

// Responsive breakpoint mixin for scoped styles
@mixin respond-to-local($breakpoint) {
  $breakpoints: (
    xs: 0,
    sm: 640px,
    md: 768px,
    lg: 1024px,
    xl: 1280px,
    2xl: 1536px
  );

  @if map-has-key($breakpoints, $breakpoint) {
    @media (min-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  }
}

// Responsive adjustments
@include respond-to-local(sm) {
  .enhanced-table-wrapper {
    &__container {
      overflow-x: auto;
    }

    .enhanced-table {
      min-width: 600px;
    }
  }
}

@include respond-to-local(xs) {
  .enhanced-table-wrapper {
    margin: 0 var(--space-4);

    &__header {
      padding: var(--space-3) var(--space-4) var(--space-2);
      flex-direction: column;
      gap: var(--space-2);
    }

    &__footer {
      flex-direction: column;
      gap: var(--space-3);
      padding: var(--space-4);
    }

    &__pagination {
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  .enhanced-table {
    &__thead {
      display: none;
    }

    &__tr {
      display: block;
      margin: var(--space-3) 0;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      background: var(--card-background-color);
    }

    &__td {
      display: block;
      text-align: right;
      padding: var(--space-2) 0;
      border: none;

      &::before {
        content: attr(data-label);
        float: left;
        font-weight: 600;
        color: var(--text-color-secondary);
        margin-right: var(--space-2);
      }
    }
  }
}

// Animations
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
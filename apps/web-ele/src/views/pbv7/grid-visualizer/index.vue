<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue';
import {
  ElAlert,
  ElButton,
  ElCard,
  ElCol,
  ElRow,
  ElTable,
  ElTableColumn,
} from 'element-plus';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { $t } from '@vben/locales';
import { usePreferences } from '@vben/preferences';
import { Codemirror } from 'vue-codemirror';
import VChart from 'vue-echarts';
import * as echarts from 'echarts';

// IMPORTANT: Please install necessary dependencies before running
// pnpm add vue-codemirror codemirror @codemirror/lang-json echarts vue-echarts @codemirror/theme-one-dark

const { isDark } = usePreferences();

const botConfig = ref(
  JSON.stringify(
    {
      bot: {
        long: {
          wallet_exposure_limit: 1.5,
          n_positions: 1,
          entry_initial_qty_pct: 0.03,
          entry_initial_ema_dist: 0.03,
          entry_grid_spacing_pct: 0.04,
          entry_grid_spacing_weight: 1.2,
          entry_grid_double_down_factor: 1.2,
          entry_trailing_threshold_pct: 0.05,
          entry_trailing_retacement_pct: 0.03,
          entry_trailing_grid_ratio: 0.8,
          close_grid_min_markup: 0.01,
          close_grid_markup_range: 0.02,
          close_grid_qty_pct: 0.3,
          close_trailing_threshold_pct: 0.05,
          close_trailing_retacement_pct: 0.03,
          close_trailing_grid_ratio: 0.0,
        },
        short: {
          wallet_exposure_limit: 1.5,
          n_positions: 1,
          entry_initial_qty_pct: 0.03,
          entry_initial_ema_dist: 0.03,
          entry_grid_spacing_pct: 0.04,
          entry_grid_spacing_weight: 1.2,
          entry_grid_double_down_factor: 1.2,
          entry_trailing_threshold_pct: 0.05,
          entry_trailing_retacement_pct: 0.03,
          entry_trailing_grid_ratio: 0.8,
          close_grid_min_markup: 0.01,
          close_grid_markup_range: 0.02,
          close_grid_qty_pct: 0.3,
          close_trailing_threshold_pct: 0.05,
          close_trailing_retacement_pct: 0.03,
          close_trailing_grid_ratio: 0.0,
        },
      },
    },
    null,
    2,
  ),
);

const view = shallowRef();
const handleReady = (payload: { view: any }) => {
  view.value = payload.view;
};

const cmExtensions = computed(() => {
  const result: any[] = [json()];
  if (isDark.value) {
    result.push(oneDark);
  }
  return result;
});

const chartOptionBase = computed(() => ({
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: Array.from({ length: 10 }, (_, i) => `t${i}`), // Placeholder data
    axisLine: {
      lineStyle: {
        color: '#ccc',
      },
    },
    axisLabel: {
      color: '#333',
    },
  },
  yAxis: {
    type: 'value',
    axisLine: {
      lineStyle: {
        color: '#ccc',
      },
    },
    splitLine: {
      lineStyle: {
        color: '#eee',
      },
    },
    axisLabel: {
      color: '#333',
    },
  },
  legend: {
    data: [
      $t('grid-visualizer.legend.emaBand'),
      $t('grid-visualizer.legend.entryGrid'),
      $t('grid-visualizer.legend.entryTrailing'),
      $t('grid-visualizer.legend.closeGrid'),
    ],
    top: '5%',
    right: '5%',
  },
  series: [
    {
      name: $t('grid-visualizer.legend.emaBand'),
      type: 'line',
      data: [100, 100.2, 100.1, 100.3, 100.5, 100.4, 100.6, 100.7, 100.8, 100.9], // Placeholder
      smooth: true,
      lineStyle: {
        color: 'purple',
      },
      itemStyle: {
        color: 'purple',
      },
    },
    {
      name: $t('grid-visualizer.legend.entryGrid'),
      type: 'line',
      data: [], // No line, just for legend and markArea
      markArea: {
        itemStyle: {
          color: 'rgba(255, 192, 203, 0.3)', // Pink area
        },
        data: [
          [
            { yAxis: 90 },
            { yAxis: 100 },
          ],
        ],
      },
    },
    {
      name: 'Entry Grid Lines',
      type: 'line',
      markLine: {
        symbol: 'none',
        lineStyle: {
          type: 'dashed',
          color: 'pink',
        },
        data: [{ yAxis: 95 }, { yAxis: 98 }], // Placeholder lines
      },
    },
    {
      name: $t('grid-visualizer.legend.entryTrailing'),
      type: 'line',
      data: [], // No line, just for legend and markArea
      markArea: {
        itemStyle: {
          color: 'rgba(255, 255, 0, 0.3)', // Yellow area
        },
        data: [
          [
            { yAxis: 80 },
            { yAxis: 90 },
          ],
        ],
      },
    },
    {
      name: $t('grid-visualizer.legend.closeGrid'),
      type: 'line',
      data: [], // No line, just for legend and markArea
      markArea: {
        itemStyle: {
          color: 'rgba(144, 238, 144, 0.3)', // Green area
        },
        data: [
          [
            { yAxis: 105 },
            { yAxis: 110 },
          ],
        ],
      },
    },
    {
      name: 'Close Grid Lines',
      type: 'line',
      markLine: {
        symbol: 'none',
        lineStyle: {
          type: 'dotted',
          color: 'green',
        },
        data: [{ yAxis: 106 }, { yAxis: 108 }], // Placeholder lines
      },
    },
  ],
}));

const longChartOption = computed(() => chartOptionBase.value);
const shortChartOption = computed(() => ({
  ...chartOptionBase.value,
  yAxis: { ...chartOptionBase.value.yAxis, min: 90, max: 125 },
}));

const longStats = computed(() => [
  { metric: $t('grid-visualizer.stats.entryMode'), value: 'GridFirst' },
  { metric: $t('grid-visualizer.stats.entryOrders'), value: 4 },
  {
    metric: $t('grid-visualizer.stats.entryAvgPrice'),
    value: '88.8393539483972',
  },
  { metric: $t('grid-visualizer.stats.entryGridSize'), value: '10%' },
  { metric: $t('grid-visualizer.stats.closeMode'), value: 'GridOnly' },
  { metric: $t('grid-visualizer.stats.closeOrders'), value: 4 },
  {
    metric: $t('grid-visualizer.stats.closeAvgPrice'),
    value: '103.721',
  },
  { metric: $t('grid-visualizer.stats.closeGridSize'), value: '10%' },
]);

const shortStats = computed(() => [
  { metric: $t('grid-visualizer.stats.entryMode'), value: 'GridFirst' },
  { metric: $t('grid-visualizer.stats.entryOrders'), value: 3 },
  {
    metric: $t('grid-visualizer.stats.entryAvgPrice'),
    value: '109.5204623948609',
  },
  { metric: $t('grid-visualizer.stats.entryGridSize'), value: '8%' },
  { metric: $t('grid-visualizer.stats.closeMode'), value: 'GridOnly' },
  { metric: $t('grid-visualizer.stats.closeOrders'), value: 4 },
  {
    metric: $t('grid-visualizer.stats.closeAvgPrice'),
    value: '96.21600000000001',
  },
  { metric: $t('grid-visualizer.stats.closeGridSize'), value: '1%' },
]);

const longEntryOrders = ref([
  { qty: 0.464, price: 97.0, maxTwe: 3, type: 'EntryInitialNormalLong' },
  { qty: 0.557, price: 92.65, maxTwe: 6, type: 'EntryGridNormalLong' },
  { qty: 1.25, price: 89.87, maxTwe: 13, type: 'EntryGridNormalLong' },
  { qty: 2.87, price: 86.34, maxTwe: 30, type: 'EntryGridInflatedLong' },
]);

const longCloseOrders = ref([
  { qty: 4.5, price: 103.0, maxTwe: 0, type: 'CloseGridLong' },
  { qty: 4.5, price: 103.6, maxTwe: 69, type: 'CloseGridLong' },
  { qty: 4.5, price: 104.2, maxTwe: 6, type: 'CloseGridLong' },
  { qty: 1.5, price: 104.81, maxTwe: 0, type: 'CloseGridLong' },
]);

const shortEntryOrders = ref([
  { qty: 0.437, price: 103.0, maxTwe: 3, type: 'EntryInitialNormalShort' },
  { qty: 0.524, price: 107.86, maxTwe: 6, type: 'EntryGridNormalShort' },
  { qty: 1.806, price: 111.58, maxTwe: 20, type: 'EntryGridInflatedShort' },
]);

const shortCloseOrders = ref([
  { qty: 4.5, price: 97.0, maxTwe: 70, type: 'CloseGridShort' },
  { qty: 4.5, price: 96.39, maxTwe: 41, type: 'CloseGridShort' },
  { qty: 4.5, price: 95.8, maxTwe: 13, type: 'CloseGridShort' },
  { qty: 1.5, price: 95.19, maxTwe: 3, type: 'CloseGridShort' },
]);

const applyConfig = () => {
  console.log('Applying config:', botConfig.value);
  // Add logic to submit the config
};
</script>

<template>
  <div class="p-4 h-full">
    <ElRow :gutter="20" class="h-full">
      <!-- Left Column: Config Editor -->
      <ElCol :span="7" class="h-full flex flex-col">
        <ElCard
          class="flex-1 flex flex-col"
          :body-style="{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }"
        >
          <template #header>
            <div>{{ $t('grid-visualizer.botConfig') }}</div>
          </template>
          <div class="flex-1" style="overflow: auto;">
            <Codemirror
              v-model="botConfig"
              :placeholder="$t('grid-visualizer.botConfig')"
              :style="{ height: '100%' }"
              :autofocus="true"
              :indent-with-tab="true"
              :tab-size="2"
              :extensions="cmExtensions"
              @ready="handleReady"
            />
          </div>
          <div class="mt-4 text-center">
            <ElButton type="primary" @click="applyConfig">{{
              $t('grid-visualizer.apply')
            }}</ElButton>
          </div>
        </ElCard>
      </ElCol>

      <!-- Right Column: Visualization and Data -->
      <ElCol :span="17" class="h-full overflow-y-auto">
        <ElRow :gutter="20">
          <!-- LONG Chart -->
          <ElCol :span="12">
            <ElCard>
              <template #header>
                <div>{{ $t('grid-visualizer.longChartTitle') }}</div>
              </template>
              <VChart :option="longChartOption" style="height: 300px" />
            </ElCard>
          </ElCol>

          <!-- SHORT Chart -->
          <ElCol :span="12">
            <ElCard>
              <template #header>
                <div>{{ $t('grid-visualizer.shortChartTitle') }}</div>
              </template>
              <VChart :option="shortChartOption" style="height: 300px" />
            </ElCard>
          </ElCol>
        </ElRow>

        <!-- Alert -->
        <ElAlert
          :title="$t('grid-visualizer.alertTitle')"
          type="warning"
          class="my-4"
          show-icon
          :closable="false"
        >
          {{ $t('grid-visualizer.alertContent') }}
        </ElAlert>

        <!-- Statistics and Order Tables -->
        <ElRow :gutter="20" class="my-4">
          <ElCol :span="12">
            <div class="space-y-4">
              <ElCard :title="$t('grid-visualizer.longStatistics')">
                <ElTable :data="longStats" :show-header="false">
                  <ElTableColumn prop="metric" />
                  <ElTableColumn prop="value" />
                </ElTable>
              </ElCard>
              <ElCard :title="$t('grid-visualizer.longEntryOrders')">
                <ElTable :data="longEntryOrders">
                  <ElTableColumn
                    prop="qty"
                    :label="$t('grid-visualizer.table.qty')"
                  />
                  <ElTableColumn
                    prop="price"
                    :label="$t('grid-visualizer.table.price')"
                  />
                  <ElTableColumn
                    prop="maxTwe"
                    :label="$t('grid-visualizer.table.maxTwe')"
                  />
                  <ElTableColumn
                    prop="type"
                    :label="$t('grid-visualizer.table.orderType')"
                  />
                </ElTable>
              </ElCard>
              <ElCard :title="$t('grid-visualizer.longCloseOrders')">
                <ElTable :data="longCloseOrders">
                  <ElTableColumn
                    prop="qty"
                    :label="$t('grid-visualizer.table.qty')"
                  />
                  <ElTableColumn
                    prop="price"
                    :label="$t('grid-visualizer.table.price')"
                  />
                  <ElTableColumn
                    prop="maxTwe"
                    :label="$t('grid-visualizer.table.maxTwe')"
                  />
                  <ElTableColumn
                    prop="type"
                    :label="$t('grid-visualizer.table.orderType')"
                  />
                </ElTable>
              </ElCard>
            </div>
          </ElCol>
          <ElCol :span="12">
            <div class="space-y-4">
              <ElCard :title="$t('grid-visualizer.shortStatistics')">
                <ElTable :data="shortStats" :show-header="false">
                  <ElTableColumn prop="metric" />
                  <ElTableColumn prop="value" />
                </ElTable>
              </ElCard>
              <ElCard :title="$t('grid-visualizer.shortEntryOrders')">
                <ElTable :data="shortEntryOrders">
                  <ElTableColumn
                    prop="qty"
                    :label="$t('grid-visualizer.table.qty')"
                  />
                  <ElTableColumn
                    prop="price"
                    :label="$t('grid-visualizer.table.price')"
                  />
                  <ElTableColumn
                    prop="maxTwe"
                    :label="$t('grid-visualizer.table.maxTwe')"
                  />
                  <ElTableColumn
                    prop="type"
                    :label="$t('grid-visualizer.table.orderType')"
                  />
                </ElTable>
              </ElCard>
              <ElCard :title="$t('grid-visualizer.shortCloseOrders')">
                <ElTable :data="shortCloseOrders">
                  <ElTableColumn
                    prop="qty"
                    :label="$t('grid-visualizer.table.qty')"
                  />
                  <ElTableColumn
                    prop="price"
                    :label="$t('grid-visualizer.table.price')"
                  />
                  <ElTableColumn
                    prop="maxTwe"
                    :label="$t('grid-visualizer.table.maxTwe')"
                  />
                  <ElTableColumn
                    prop="type"
                    :label="$t('grid-visualizer.table.orderType')"
                  />
                </ElTable>
              </ElCard>
            </div>
          </ElCol>
        </ElRow>
      </ElCol>
    </ElRow>
  </div>
</template>

<style scoped>
/* Scoped styles for the component */
.el-card__header {
  font-weight: bold;
}
.el-table .cell {
  padding: 8px 12px;
}
</style>

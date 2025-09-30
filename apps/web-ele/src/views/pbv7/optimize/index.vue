<script lang="ts" setup>
import type { OptimizeForm } from './typing';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { reactive, watch } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';

import { locale } from 'dayjs';
import { ElButton, ElCard, ElForm, ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

import BoundsGroup from './components/BoundsGroup.vue';
import CommonGroup from './components/CommonGroup.vue';

const { t } = useI18n();

const formModel = reactive<OptimizeForm>({
  exchanges: ['binance', 'bybit'],
  name: 'sss',
  start_date: '2020-01-01',
  end_date: '2025-09-28',
  starting_balance: 1000,
  iters: 100_000,
  n_cpus: 5,
  combine_ohlcvs: true,
  compress_results_file: true,
  starting_config: false,
  use_btc_collateral: false,
  only_cpt: true,
  apply_filters: true,
  population_size: 500,
  crossover_probability: 0.7,
  mutation_probability: 0.2,
  scoring: ['loss_profit_ratio', 'mdg_w', 'sharpe_ratio'],
  market_cap: 0,
  'vol/mcap': 10,
  tags: [],
  long_n_positions: [1, 20],
  short_n_positions: [1, 20],
  long_total_wallet_exposure_limit: [0, 5],
  short_total_wallet_exposure_limit: [0, 5],
  long_unstuck_close_pct: [0, 1],
  short_unstuck_close_pct: [0, 1],
  long_unstuck_ema_dist: [-1, 1],
  short_unstuck_ema_dist: [-1, 1],
  long_unstuck_loss_allowance_pct: [0, 1],
  short_unstuck_loss_allowance_pct: [0, 1],
  long_unstuck_threshold: [-1, 1],
  short_unstuck_threshold: [-1, 1],
  long_filter_noisiness_rolling_window: [10, 360],
  short_filter_noisiness_rolling_window: [10, 360],
  long_filter_volume_drop_pct: [0.5, 1],
  short_filter_volume_drop_pct: [0.5, 1],
  long_filter_volume_rolling_window: [10, 360],
  short_filter_volume_rolling_window: [10, 360],
  long_entry_grid_double_down_factor: [0, 10],
  short_entry_grid_double_down_factor: [0, 10],
  long_entry_grid_spacing_pct: [0, 1],
  short_entry_grid_spacing_pct: [0, 1],
  long_entry_grid_spacing_weight: [0, 100],
  short_entry_grid_spacing_weight: [0, 100],
  long_entry_initial_ema_dist: [-1, 1],
  short_entry_initial_ema_dist: [-1, 1],
  long_entry_initial_qty_pct: [0, 1],
  short_entry_initial_qty_pct: [0, 1],
  long_entry_trailing_double_down_factor: [0, 10],
  short_entry_trailing_double_down_factor: [0, 10],
  long_entry_trailing_grid_ratio: [0, 1],
  short_entry_trailing_grid_ratio: [0, 1],
  long_entry_trailing_retracement_pct: [0, 1],
  short_entry_trailing_retracement_pct: [0, 1],
  long_entry_trailing_threshold_pct: [0, 1],
  short_entry_trailing_threshold_pct: [0, 1],
  long_close_trailing_grid_ratio: [0, 1],
  short_close_trailing_grid_ratio: [0, 1],
  long_close_trailing_qty_pct: [0, 1],
  short_close_trailing_qty_pct: [0, 1],
  long_close_trailing_retracement_pct: [0, 1],
  short_close_trailing_retracement_pct: [0, 1],
  long_close_trailing_threshold_pct: [0, 1],
  short_close_trailing_threshold_pct: [0, 1],
  long_ema_span_0: [0, 10_000],
  short_ema_span_0: [0, 10_000],
  long_ema_span_1: [0, 10_000],
  short_ema_span_1: [0, 10_000],
  long_twe: 0.85,
  long_positions: 9.67,
  short_twe: 0,
  short_positions: 0,
  long: JSON.stringify(
    {
      close_grid_markup_end: 0.001_161,
      close_grid_markup_start: 0.009_675,
      close_grid_qty_pct: 0.8195,
      close_trailing_grid_ratio: 0.042_114,
      close_trailing_qty_pct: 1,
      close_trailing_retracement_pct: 0.066_097,
      close_trailing_threshold_pct: 0.067_26,
      ema_span_0: 469.02,
      ema_span_1: 1118.9,
      enforce_exposure_limit: true,
      entry_grid_double_down_factor: 2.3738,
      entry_grid_spacing_pct: 0.052_372,
      entry_grid_spacing_weight: 0.177_15,
      entry_initial_ema_dist: -0.006_057_4,
      entry_initial_qty_pct: 0.019_955,
      entry_trailing_double_down_factor: 1.441,
      entry_trailing_grid_ratio: -0.280_53,
      entry_trailing_retracement_pct: 0.002_476_2,
      entry_trailing_threshold_pct: 0.014_956,
      filter_noisiness_rolling_window: 303.6,
      filter_volume_drop_pct: 0.7021,
      filter_volume_rolling_window: 303.6,
      n_positions: 9.6662,
      total_wallet_exposure_limit: 0.8536,
      unstuck_close_pct: 0.049_593,
    },
    null,
    2,
  ),
  short: JSON.stringify(
    {
      close_grid_markup_end: 0.001,
      close_grid_markup_start: 0.001,
      close_grid_qty_pct: 0.05,
      close_trailing_grid_ratio: 0.936_58,
      close_trailing_qty_pct: 1,
      close_trailing_retracement_pct: 0.098_179,
      close_trailing_threshold_pct: -0.059_383,
      ema_span_0: 794.32,
      ema_span_1: 1176.7,
      enforce_exposure_limit: true,
      entry_grid_double_down_factor: 2.1256,
      entry_grid_spacing_pct: 0.072_906,
      entry_grid_spacing_weight: 0.988_67,
      entry_initial_ema_dist: -0.060_333,
      entry_initial_qty_pct: 0.066_426,
      entry_trailing_double_down_factor: 0.725_08,
      entry_trailing_grid_ratio: -0.026_647,
      entry_trailing_retracement_pct: 0.016_626,
      entry_trailing_threshold_pct: 0.052_728,
      filter_noisiness_rolling_window: 320.18,
      filter_volume_drop_pct: 0.579_73,
      filter_volume_rolling_window: 320.18,
      n_positions: 0,
      total_wallet_exposure_limit: 0,
      unstuck_close_pct: 0.052_992,
    },
    null,
    2,
  ),
  p_gt_select: 'adg',
  p_gt_limit: 0,
  p_gt_btc_select: 'adg',
  p_gt_btc_limit: 0,
  p_lt_select: 'adg',
  p_lt_limit: 0,
  p_lt_btc_select: 'adg',
  p_lt_btc_limit: 0,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => {
    // TODO: Add submit logic
    drawerApi.close();
  },
});

function handleNewOptimize() {
  drawerApi.setState({
    title: t('page.passivbot.v7.optimizePage.newOptimize'),
  });
  drawerApi.open();
}

interface Backtest {
  id: number;
  status: 'complete' | 'failed' | 'running';
  name: string;
  filename: string;
  time: string;
  exchange: string;
}

const tableData = reactive<Backtest[]>([
  {
    id: 0,
    status: 'complete',
    name: 'rank8',
    filename: '6c1b180e-3af2-458a-9f03-19bfd4a7b7cd',
    time: '2025-09-07 12:54:30',
    exchange: 'binance',
  },
  {
    id: 1,
    status: 'running',
    name: 'rank8-last-9-month',
    filename: '3a93300f-c796-4187-9d31-568f0e18273e',
    time: '2025-09-07 13:18:46',
    exchange: 'binance',
  },
  {
    id: 2,
    status: 'failed',
    name: 'test-fail',
    filename: '3a93300f-c796-4187-9d31-568f0e18273e',
    time: '2025-09-07 14:00:00',
    exchange: 'binance',
  },
]);

const gridOptions = reactive<VxeGridProps<Backtest>>({
  columns: [],
  data: tableData,
  sortConfig: {
  },
});

watch(
  locale,
  () => {
    gridOptions.columns = [
      {
        field: 'id',
        title: 'ID',
        sortable: true,
        width: 80,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'name',
        title: t('common.table.name'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'exchange',
        title: t('common.table.exchange'),
        sortable: true,
        slots: { default: 'col-exchange' },
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'filename',
        title: t('common.table.filename'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'time',
        title: t('common.table.time'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'status',
        title: t('common.table.status'),
        sortable: true,
        slots: { default: 'col-status' },
        align: 'left',
        headerAlign: 'left',
      },
      {
        title: t('common.table.actions'),
        width: 300,
        fixed: 'right',
        slots: { default: 'col-action' },
        align: 'center',
        headerAlign: 'center',
      },
    ];
  },
  { immediate: true },
);

const [Grid] = useVbenVxeGrid({
  gridOptions,
});
</script>

<template>
  <Page>
    <ElCard class="mt-5">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-medium">
              {{ t('page.passivbot.v7.optimizePage.listTitle') }}
            </div>
            <div class="text-sm text-gray-500">
              {{ t('page.passivbot.v7.optimizePage.listDescription') }}
            </div>
          </div>
          <ElButton type="primary" @click="handleNewOptimize">
            {{ t('page.passivbot.v7.optimizePage.newOptimize') }}
          </ElButton>
        </div>
      </template>
      <template #default>
        <Grid>
          <template #col-status="{ row }">
            <ElTag
              :type="
                row.status === 'complete'
                  ? 'success'
                  : row.status === 'running'
                    ? 'primary'
                    : 'danger'
              "
            >
              {{ t(`common.status.${row.status}`) }}
            </ElTag>
          </template>
          <template #col-exchange="{ row }">
            <div class="flex items-center gap-2">
              <span
                v-if="row.exchange === 'binance'"
                class="icon-[logos:binance] text-2xl"
              ></span>
              <span>{{ row.exchange }}</span>
            </div>
          </template>
          <template #col-action>
            <div class="flex items-center justify-center gap-2 text-base">
              <ElButton link type="primary">
                {{ t('common.actions.start') }}
              </ElButton>
              <ElButton link type="success">
                {{ t('common.actions.viewResults') }}
              </ElButton>
              <ElButton link type="info">
                {{ t('common.actions.viewLog') }}
              </ElButton>
              <ElButton link type="danger">
                {{ t('common.actions.delete') }}
              </ElButton>
            </div>
          </template>
        </Grid>
      </template>
    </ElCard>
    <Drawer class="w-1/2">
      <ElForm :model="formModel" label-position="top">
        <CommonGroup v-model:model="formModel" />
        <BoundsGroup v-model:model="formModel" />
      </ElForm>
    </Drawer>
  </Page>
</template>

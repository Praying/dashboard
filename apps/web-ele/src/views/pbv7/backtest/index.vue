<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, reactive, shallowRef, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRow,
  ElSelect,
  ElTag,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

const { t, locale } = useI18n();
const { isDark } = usePreferences();

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

interface CoinOverride {
  symbol: string;
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
  sortConfig: {},
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

const formModel = reactive({
  exchanges: 'binance',
  backtest_name: 'rank8-last-3-month',
  date_range: ['2025-06-06', '2025-09-05'],
  starting_balance: 1000,
  minimum_coin_age_days: 30,
  gap_tolerance_ohlcvs_minutes: 120,
  combine_ohlcvs: true,
  use_btc_collateral: false,
  compress_cache: true,
  only_cpt: false,
  notices_ignore: false,
  apply_filters: false,
  market_cap: 0,
  vol_mcap: 10,
  tags: [],
  approved_coins_long: [
    'BNBUSDT',
    'ETHUSDT',
    'BTCUSDT',
    'XRPUSDT',
    'SOLUSDT',
    'DOGEUSDT',
  ],
  approved_coins_short: [],
  ignored_symbols_long: [],
  ignored_symbols_short: [],
  long_twe: 0,
  long_positions: 0,
  short_twe: 0,
  short_positions: 0,
  coin_overrides: [] as CoinOverride[],
  long: JSON.stringify(
    {
      close_trailing_grid_ratio: 0.076_678,
      close_trailing_qty_pct: 0.102_51,
      close_trailing_retracement_pct: 0.032_433,
      close_trailing_threshold_pct: 0.088_423,
      ema_span_0: 612.26,
      ema_span_1: 358.16,
      enforce_exposure_limit: true,
      entry_grid_double_down_factor: 2.756,
      entry_grid_spacing_pct: 0.093_359,
      entry_grid_spacing_weight: 9.2719,
      entry_initial_ema_dist: -0.031_437,
      entry_initial_qty_pct: 0.079_762,
      entry_trailing_double_down_factor: 1.7243,
      entry_trailing_grid_ratio: 0.399_16,
      entry_trailing_retracement_pct: 0.000_245_03,
      entry_trailing_threshold_pct: 0.028_338,
      filter_noisiness_rolling_window: 231.7,
      filter_volume_drop_pct: 0.786_51,
      filter_volume_rolling_window: 70.281,
      n_positions: 11,
      total_wallet_exposure_limit: 4.7828,
      unstuck_close_pct: 0.012_174,
    },
    null,
    2,
  ),
  short: JSON.stringify(
    {
      close_trailing_grid_ratio: -0.9527,
      close_trailing_qty_pct: 0.906_72,
      close_trailing_retracement_pct: 0.075_21,
      close_trailing_threshold_pct: 0.044_509,
      ema_span_0: 755.31,
      ema_span_1: 940.08,
      enforce_exposure_limit: true,
      entry_grid_double_down_factor: 0.152_16,
      entry_grid_spacing_pct: 0.034_679,
      entry_grid_spacing_weight: 7.7826,
      entry_initial_ema_dist: -0.074_536,
      entry_initial_qty_pct: 0.010_273,
      entry_trailing_double_down_factor: 1.4518,
      entry_trailing_grid_ratio: 0.383_84,
      entry_trailing_retracement_pct: 0.086_548,
      entry_trailing_threshold_pct: 0.052_839,
      filter_noisiness_rolling_window: 251.42,
      filter_volume_drop_pct: 0.781_76,
      filter_volume_rolling_window: 17.988,
      n_positions: 1,
      total_wallet_exposure_limit: 2.9599,
      unstuck_close_pct: 0.059_267,
    },
    null,
    2,
  ),
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => {
    handleSubmit();
    drawerApi.close();
  },
});

function handleNewBacktest() {
  drawerApi.setState({
    title: t('page.passivbot.v7.backtestPage.newBacktest'),
  });
  drawerApi.open();
}

const allSymbols = computed(() => {
  const symbols = new Set([
    ...formModel.approved_coins_long,
    ...formModel.approved_coins_short,
  ]);
  return [...symbols];
});

function addOverride() {
  formModel.coin_overrides.push({
    symbol: '',
  });
}

function removeOverride(index: number) {
  formModel.coin_overrides.splice(index, 1);
}

function handleSubmit() {
  console.warn('Form Submitted:', formModel);
}

function generateBacktestName() {
  const randomStr = Math.random().toString(36).slice(2, 8);
  const timestamp = dayjs().format('YYYYMMDDHHmmss');
  formModel.backtest_name = `btv7-${randomStr}-${timestamp}`;
}
</script>

<template>
  <Page>
    <ElCard class="mt-5">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-medium">
              {{ t('page.passivbot.v7.backtestPage.listTitle') }}
            </div>
            <div class="text-sm text-gray-500">
              {{ t('page.passivbot.v7.backtestPage.listDescription') }}
            </div>
          </div>
          <ElButton type="primary" @click="handleNewBacktest">
            {{ t('page.passivbot.v7.backtestPage.newBacktest') }}
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
      <ElForm :model="formModel" label-position="right" label-width="200px">
        <ElCard class="mb-4">
          <template #header>
            <div class="font-bold">
              {{ t('page.passivbot.v7.backtestPage.form.basicSettings') }}
            </div>
          </template>
          <ElFormItem
            :label="t('page.passivbot.v7.backtestPage.form.backtestName')"
          >
            <div class="flex w-full items-center gap-2">
              <ElInput v-model="formModel.backtest_name" class="flex-grow" />
              <ElButton @click="generateBacktestName">
                {{ t('common.actions.generate') }}
              </ElButton>
            </div>
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v7.backtestPage.form.exchanges')"
          >
            <ElSelect v-model="formModel.exchanges" class="w-full">
              <ElOption label="binance" value="binance" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v7.backtestPage.form.dateRange')"
          >
            <ElDatePicker
              v-model="formModel.date_range"
              class="w-full"
              type="daterange"
              :end-placeholder="
                t('page.passivbot.v7.backtestPage.form.endDate')
              "
              :start-placeholder="
                t('page.passivbot.v7.backtestPage.form.startDate')
              "
            />
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v7.backtestPage.form.startingBalance')"
          >
            <ElInputNumber
              v-model="formModel.starting_balance"
              class="w-full"
              :precision="2"
            />
          </ElFormItem>
        </ElCard>

        <ElCard class="mb-4">
          <template #header>
            <div class="font-bold">
              {{ t('page.passivbot.v7.backtestPage.form.filterConditions') }}
            </div>
          </template>
          <ElRow :gutter="20">
            <ElCol :span="12">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.marketCap')"
              >
                <ElInputNumber v-model="formModel.market_cap" class="w-full" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.minCoinAge')"
              >
                <ElInputNumber
                  v-model="formModel.minimum_coin_age_days"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.volMcap')"
              >
                <ElInputNumber
                  v-model="formModel.vol_mcap"
                  class="w-full"
                  :precision="2"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.gapTolerance')"
              >
                <ElInputNumber
                  v-model="formModel.gap_tolerance_ohlcvs_minutes"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol :span="24">
              <div class="grid grid-cols-3 gap-x-4 py-2">
                <ElCheckbox v-model="formModel.combine_ohlcvs">
                  combine_ohlcvs
                </ElCheckbox>
                <ElCheckbox v-model="formModel.use_btc_collateral">
                  use_btc_collateral
                </ElCheckbox>
                <ElCheckbox v-model="formModel.compress_cache">
                  compress_cache
                </ElCheckbox>
                <ElCheckbox v-model="formModel.only_cpt">only_cpt</ElCheckbox>
                <ElCheckbox v-model="formModel.notices_ignore">
                  notices_ignore
                </ElCheckbox>
                <ElCheckbox v-model="formModel.apply_filters">
                  apply_filters
                </ElCheckbox>
              </div>
            </ElCol>
          </ElRow>
        </ElCard>

        <ElCard class="mb-4">
          <template #header>
            <div class="font-bold">
              {{ t('page.passivbot.v7.backtestPage.form.coinSelection') }}
            </div>
          </template>
          <ElRow :gutter="20">
            <ElCol :span="12">
              <ElFormItem
                :label="
                  t('page.passivbot.v7.backtestPage.form.approvedCoinsLong')
                "
              >
                <ElSelect
                  v-model="formModel.approved_coins_long"
                  class="w-full"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  :placeholder="t('common.choose')"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem
                :label="
                  t('page.passivbot.v7.backtestPage.form.approvedCoinsShort')
                "
              >
                <ElSelect
                  v-model="formModel.approved_coins_short"
                  class="w-full"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  :placeholder="t('common.choose')"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem
                :label="
                  t('page.passivbot.v7.backtestPage.form.ignoredSymbolsLong')
                "
              >
                <ElSelect
                  v-model="formModel.ignored_symbols_long"
                  class="w-full"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  :placeholder="t('common.choose')"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem
                :label="
                  t('page.passivbot.v7.backtestPage.form.ignoredSymbolsShort')
                "
              >
                <ElSelect
                  v-model="formModel.ignored_symbols_short"
                  class="w-full"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  :placeholder="t('common.choose')"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElCard>

        <ElCard class="mb-4">
          <template #header>
            <div class="font-bold">
              {{ t('page.passivbot.v7.backtestPage.form.paramConfig') }}
            </div>
          </template>
          <ElRow :gutter="20">
            <ElCol :span="6">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.longTwe')"
              >
                <ElInputNumber
                  v-model="formModel.long_twe"
                  class="w-full"
                  :precision="2"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="6">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.longPositions')"
              >
                <ElInputNumber
                  v-model="formModel.long_positions"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="6">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.shortTwe')"
              >
                <ElInputNumber
                  v-model="formModel.short_twe"
                  class="w-full"
                  :precision="2"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="6">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.shortPositions')"
              >
                <ElInputNumber
                  v-model="formModel.short_positions"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElCollapse class="my-4 border-none">
            <ElCollapseItem
              :title="t('page.passivbot.v7.backtestPage.form.coinOverrides')"
              name="1"
            >
              <div
                v-for="(override, index) in formModel.coin_overrides"
                :key="index"
                class="mb-4 rounded border p-4"
              >
                <ElRow :gutter="20" class="mb-4">
                  <ElCol :span="10">
                    <ElFormItem
                      :label="t('page.passivbot.v7.backtestPage.form.symbol')"
                    >
                      <ElSelect
                        v-model="override.symbol"
                        class="w-full"
                        default-first-option
                        filterable
                        allow-create
                        :placeholder="t('common.chooseOrCreate')"
                      >
                        <ElOption
                          v-for="item in allSymbols"
                          :key="item"
                          :label="item"
                          :value="item"
                        />
                      </ElSelect>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :span="4">
                    <ElButton
                      class="mt-8"
                      type="danger"
                      @click="removeOverride(index)"
                    >
                      {{ t('common.remove') }}
                    </ElButton>
                  </ElCol>
                </ElRow>
              </div>
              <ElButton @click="addOverride">
                {{ t('page.passivbot.v7.backtestPage.form.addCoinOverride') }}
              </ElButton>
            </ElCollapseItem>
          </ElCollapse>

          <ElRow :gutter="20">
            <ElCol :span="12">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.long')"
              >
                <Codemirror
                  v-model="formModel.long"
                  :extensions="cmExtensions"
                  :style="{ height: '320px', width: '100%' }"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tab-size="2"
                  @ready="handleReady"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem
                :label="t('page.passivbot.v7.backtestPage.form.short')"
              >
                <Codemirror
                  v-model="formModel.short"
                  :extensions="cmExtensions"
                  :style="{ height: '320px', width: '100%' }"
                  :autofocus="true"
                  :indent-with-tab="true"
                  :tab-size="2"
                  @ready="handleReady"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElCard>
      </ElForm>
    </Drawer>
  </Page>
</template>

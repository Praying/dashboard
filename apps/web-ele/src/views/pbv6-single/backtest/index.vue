<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ApiKey } from '#/api/system/exchange';
import type { V6SingleBacktest } from '#/api/v6-single-backtest';

import {
  computed,
  nextTick,
  onMounted,
  reactive,
  ref,
  shallowRef,
  watch,
} from 'vue';
import { Codemirror } from 'vue-codemirror';
import VChart from 'vue-echarts';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { CopyDocument, Refresh } from '@element-plus/icons-vue';
import { LineChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElDatePicker,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  ElOption,
  ElScrollbar,
  ElSelect,
  ElSwitch,
  ElTag,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getApiKeysApi } from '#/api/system/exchange';
import { getTradingPairsApi } from '#/api/trading-pairs';
import {
  createV6SingleBacktestApi,
  deleteV6SingleBacktestApi,
  getV6SingleBacktestConfigApi,
  getV6SingleBacktestResultApi,
  getV6SingleBacktestsApi,
  getV6SingleBacktestStatsApi,
  startV6SingleBacktestApi,
} from '#/api/v6-single-backtest';

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);

const { t, locale } = useI18n();
const { isDark } = usePreferences();

const logDialogVisible = ref(false);
const logContent = ref('');
const logDialogTitle = ref('');

const resultDialogVisible = ref(false);
const currentBacktestResult = ref<null | V6SingleBacktest>(null);
const backtestResultText = ref('');
const backtestConfig = ref<null | object>(null);

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

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: async () => {
    if (
      !formModel.date_range ||
      !formModel.date_range[0] ||
      !formModel.date_range[1]
    ) {
      // TODO: Handle error case, maybe show a message to the user
      return;
    }

    const config = (() => {
      try {
        return JSON.parse(formModel.config);
      } catch {
        return undefined;
      }
    })();

    await createV6SingleBacktestApi({
      name: formModel.backtest_name,
      account_name: formModel.accountName,
      exchange: formModel.exchange,
      symbol: formModel.symbol,
      market_type: formModel.market_type,
      model: formModel.passivbot_mode,
      start_date: formModel.date_range[0],
      end_date: formModel.date_range[1],
      initial_capital: formModel.initial_capital,
      config,
    });
    gridApi.query();
    drawerApi.close();
  },
});

function handleNewBacktest() {
  drawerApi.setState({
    title: t('page.passivbot.v7.backtestPage.newBacktest'),
  });
  drawerApi.open();
}

function generateBacktestName() {
  const randomStr = Math.random().toString(36).slice(2, 8);
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timestamp = `${year}${month}${day}${hours}${minutes}${seconds}`;
  formModel.backtest_name = `btv6-${randomStr}-${timestamp}`;
}

const formModel = reactive({
  backtest_name: '',
  accountName: '',
  exchange: '',
  symbol: '',
  market_type: 'futures',
  ohlcv: true,
  initial_capital: 1000,
  date_range: ['2021-09-30', '2025-09-29'],
  long_enabled: true,
  short_enabled: false,
  preview_grid: false,
  long_wallet_exposure_limit: 1,
  short_wallet_exposure_limit: 1,
  passivbot_mode: 'recursive_grid',
  config_type: 'None',
  config: '',
  config_converted: '',
});

interface AccountInfo {
  accountName: string;
  exchange: string;
}
const accounts = ref<AccountInfo[]>([]);
onMounted(async () => {
  const apiKeys = await getApiKeysApi();
  accounts.value = apiKeys.map((key: ApiKey) => ({
    accountName: key.accountName,
    exchange: key.exchange,
  }));
});

const symbols = ref<string[]>([]);

async function handleAccountChange(selectedAccountName: string) {
  const account = accounts.value.find(
    (acc) => acc.accountName === selectedAccountName,
  );
  if (account) {
    formModel.exchange = account.exchange;
    formModel.symbol = ''; // Reset symbol when account changes
    symbols.value = await getTradingPairsApi(account.exchange);
  }
}

watch(
  () => formModel.config,
  (newConfig) => {
    try {
      const config = JSON.parse(newConfig);
      if (config.long && config.long.enabled !== undefined) {
        formModel.long_enabled = config.long.enabled;
      }
      if (config.short && config.short.enabled !== undefined) {
        formModel.short_enabled = config.short.enabled;
      }
      if (config.long && config.long.wallet_exposure_limit !== undefined) {
        formModel.long_wallet_exposure_limit =
          config.long.wallet_exposure_limit;
      }
      if (config.short && config.short.wallet_exposure_limit !== undefined) {
        formModel.short_wallet_exposure_limit =
          config.short.wallet_exposure_limit;
      }
    } catch {
      // ignore
    }
  },
);

watch(
  [
    () => formModel.long_enabled,
    () => formModel.short_enabled,
    () => formModel.long_wallet_exposure_limit,
    () => formModel.short_wallet_exposure_limit,
  ],
  () => {
    try {
      const config = JSON.parse(formModel.config || '{}');
      if (!config.long) {
        config.long = {};
      }
      if (!config.short) {
        config.short = {};
      }
      config.long.enabled = formModel.long_enabled;
      config.short.enabled = formModel.short_enabled;
      config.long.wallet_exposure_limit = formModel.long_wallet_exposure_limit;
      config.short.wallet_exposure_limit =
        formModel.short_wallet_exposure_limit;
      formModel.config = JSON.stringify(config, null, 2);
    } catch {
      const config: any = {
        long: {},
        short: {},
      };
      config.long.enabled = formModel.long_enabled;
      config.short.enabled = formModel.short_enabled;
      config.long.wallet_exposure_limit = formModel.long_wallet_exposure_limit;
      config.short.wallet_exposure_limit =
        formModel.short_wallet_exposure_limit;
      formModel.config = JSON.stringify(config, null, 2);
    }
  },
);

// The local `tableData` ref is no longer needed as data is managed by the grid's proxy.

// Data fetching is now handled by proxyConfig, so fetchBacktests and its onMounted call are no longer needed.

async function handleDelete(row: V6SingleBacktest) {
  try {
    await ElMessageBox.confirm(
      t('common.prompts.deleteConfirm'),
      t('common.prompts.deleteTitle'),
      {
        confirmButtonText: t('common.actions.confirm'),
        cancelButtonText: t('common.actions.cancel'),
        type: 'warning',
      },
    );
    await deleteV6SingleBacktestApi(row.id);
    gridApi.query();
  } catch {
    // catch error
  }
}

async function handleStart(row: V6SingleBacktest) {
  await startV6SingleBacktestApi(row.id);
  gridApi.query();
}

async function handleViewLog(row: V6SingleBacktest) {
  logContent.value = '';
  logDialogTitle.value = `${t('common.actions.viewLog')} - ${row.name}`;
  logDialogVisible.value = true;

  try {
    const response = await fetch(`/api/v6-single/backtest/${row.id}/log`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response reader');
    }

    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      logContent.value += decoder.decode(value, { stream: true });
    }
  } catch (error) {
    console.error('Failed to fetch log:', error);
    logContent.value += `\n\n--- ${t('common.errors.failedToFetchLog')} ---`;
  }
}

const longChartOptions = ref({});
const shortChartOptions = ref({});
const chartLoading = ref(false);
const rawStatsData = ref<any[]>([]);

function generateChartOptions(statsData: any[], side: 'long' | 'short') {
  const timestamps = statsData.map((item) =>
    new Date(item.timestamp).toLocaleString(),
  );
  const balance = statsData.map((item) => item[`balance_${side}`]);
  const equity = statsData.map((item) => item[`equity_${side}`]);
  const walletExposure = statsData.map(
    (item) => item[`wallet_exposure_${side}`],
  );

  return {
    title: {
      text: side.toUpperCase(),
      left: 'center',
    },
    axisPointer: {
      link: [{ xAxisIndex: 'all' }],
      label: {
        backgroundColor: '#777',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    legend: {
      data: [`${side}_balance`, `${side}_equity`, `wallet_exposure_${side}`],
      top: 'bottom',
      left: 'center',
    },
    grid: [
      {
        left: '15%',
        right: '8%',
        height: '50%',
      },
      {
        left: '15%',
        right: '8%',
        top: '65%',
        height: '20%',
      },
    ],
    xAxis: [
      {
        type: 'category',
        data: timestamps,
        axisLine: { onZero: false },
        splitLine: { show: false },
        axisLabel: { show: false },
      },
      {
        gridIndex: 1,
        type: 'category',
        data: timestamps,
        axisLine: { onZero: false },
      },
    ],
    yAxis: [
      {
        type: 'value',
        scale: true,
        splitArea: {
          show: true,
        },
        axisLabel: {
          formatter: (value: number) => `$${value}`,
        },
      },
      {
        gridIndex: 1,
        type: 'value',
        scale: true,
        axisLabel: {
          formatter: (value: number) => `${(value * 100).toFixed(2)}%`,
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: [0, 1],
        start: 0,
        end: 100,
      },
      {
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: '90%',
        start: 0,
        end: 100,
      },
    ],
    series: [
      {
        name: `${side}_balance`,
        type: 'line',
        data: balance,
        lineStyle: { width: 2 },
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        name: `${side}_equity`,
        type: 'line',
        data: equity,
        lineStyle: { width: 1 },
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        name: `wallet_exposure_${side}`,
        type: 'line',
        data: walletExposure,
        lineStyle: { width: 1 },
        xAxisIndex: 1,
        yAxisIndex: 1,
      },
    ],
  };
}

async function renderBacktestChart(backtestId: number) {
  chartLoading.value = true;
  try {
    const statsData = await getV6SingleBacktestStatsApi(backtestId);
    rawStatsData.value = statsData;
    longChartOptions.value = generateChartOptions(statsData, 'long');
    shortChartOptions.value = generateChartOptions(statsData, 'short');
  } catch (error) {
    console.error('Failed to render chart:', error);
    longChartOptions.value = {};
    shortChartOptions.value = {};
    rawStatsData.value = [];
  } finally {
    chartLoading.value = false;
  }
}

async function handleViewResults(row: V6SingleBacktest) {
  currentBacktestResult.value = row;
  resultDialogVisible.value = true;
  rawStatsData.value = []; // Clear previous data
  backtestResultText.value = ''; // Clear previous data
  backtestConfig.value = null; // Clear previous data
  await nextTick();
  if (currentBacktestResult.value) {
    await renderBacktestChart(currentBacktestResult.value.id);
    backtestResultText.value = await getV6SingleBacktestResultApi(
      currentBacktestResult.value.id,
    );
    backtestConfig.value = await getV6SingleBacktestConfigApi(
      currentBacktestResult.value.id,
    );
  }
}

function copyConfig() {
  const configStr = JSON.stringify(backtestConfig.value, null, 2);
  navigator.clipboard.writeText(configStr);
  ElMessage.success(t('common.actions.copySuccess'));
}

const gridOptions = reactive<VxeGridProps<V6SingleBacktest>>({
  columns: [],
  pagerConfig: {
    pageSize: 20,
    pageSizes: [5, 10, 20, 50, 100],
  },
  proxyConfig: {
    ajax: {
      query: async () => {
        const backtests = await getV6SingleBacktestsApi();
        return {
          items: backtests,
          total: backtests.length,
        };
      },
    },
    response: {
      result: 'items', // Should match the global config
      total: 'total',
    },
  },
  sortConfig: {},
});

watch(
  locale,
  () => {
    gridOptions.columns = [
      {
        field: 'id',
        title: t('page.passivbot.v6single.backtestPage.table.id'),
        sortable: true,
        width: 50,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'name',
        title: t('page.passivbot.v6single.backtestPage.table.name'),
        sortable: true,
        width: 100,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'account_name',
        title: t('page.passivbot.v6single.backtestPage.table.accountName'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'exchange',
        title: t('page.passivbot.v6single.backtestPage.table.exchange'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'symbol',
        title: t('page.passivbot.v6single.backtestPage.table.symbol'),
        sortable: true,
        width: 80,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'model',
        title: t('page.passivbot.v6single.backtestPage.table.passivbotMode'),
        width: 100,
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'initial_capital',
        title: t('page.passivbot.v6single.backtestPage.table.initialCapital'),
        sortable: true,
        width: 90,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'start_date',
        title: t('page.passivbot.v6single.backtestPage.table.start'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'end_date',
        title: t('page.passivbot.v6single.backtestPage.table.end'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'status',
        title: t('page.passivbot.v6single.backtestPage.table.status'),
        slots: { default: 'col-status' },
        sortable: true,
        width: 80,
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

const [Grid, gridApi] = useVbenVxeGrid({
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
            <ElTag :type="row.status === 'error' ? 'danger' : 'success'">
              {{ row.status }}
            </ElTag>
          </template>
          <template #col-action="{ row }">
            <div class="flex items-center justify-center gap-2 text-base">
              <ElButton link type="primary" @click="handleStart(row)">
                {{ t('common.actions.start') }}
              </ElButton>
              <ElButton
                link
                type="success"
                :disabled="row.status !== 'finished'"
                @click="handleViewResults(row)"
              >
                {{ t('common.actions.viewResults') }}
              </ElButton>
              <ElButton link type="info" @click="handleViewLog(row)">
                {{ t('common.actions.viewLog') }}
              </ElButton>
              <ElButton link type="danger" @click="handleDelete(row)">
                {{ t('common.actions.delete') }}
              </ElButton>
            </div>
          </template>
        </Grid>
      </template>
    </ElCard>
    <Drawer class="w-1/2">
      <ElForm :model="formModel" label-width="200px" label-position="right">
        <ElCard class="mb-5">
          <template #header>
            <div class="font-bold">
              {{ t('page.passivbot.v6single.backtestPage.form.basicSettings') }}
            </div>
          </template>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.backtestName')"
          >
            <div class="flex w-full items-center gap-2">
              <ElInput
                v-model="formModel.backtest_name"
                class="flex-grow"
                :placeholder="
                  t(
                    'page.passivbot.v6single.backtestPage.form.backtestNamePlaceholder',
                  )
                "
              />
              <ElButton @click="generateBacktestName">
                {{ t('common.actions.generate') }}
              </ElButton>
            </div>
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.accountName')"
          >
            <ElSelect
              v-model="formModel.accountName"
              class="w-full"
              :placeholder="
                t(
                  'page.passivbot.v6single.backtestPage.form.accountNamePlaceholder',
                )
              "
              @change="handleAccountChange"
            >
              <ElOption
                v-for="item in accounts"
                :key="item.accountName"
                :label="item.accountName"
                :value="item.accountName"
              />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.symbol')"
          >
            <div class="flex w-full items-center">
              <ElSelect
                v-model="formModel.symbol"
                class="flex-grow"
                :placeholder="
                  t(
                    'page.passivbot.v6single.backtestPage.form.symbolPlaceholder',
                  )
                "
              >
                <ElOption
                  v-for="item in symbols"
                  :key="item"
                  :label="item"
                  :value="item"
                />
              </ElSelect>
              <ElButton :icon="Refresh" class="ml-2" />
            </div>
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.dateRange')"
          >
            <ElDatePicker
              v-model="formModel.date_range"
              class="w-full"
              :end-placeholder="
                t(
                  'page.passivbot.v6single.backtestPage.form.endDatePlaceholder',
                )
              "
              :start-placeholder="
                t(
                  'page.passivbot.v6single.backtestPage.form.startDatePlaceholder',
                )
              "
              type="daterange"
            />
          </ElFormItem>
          <ElFormItem
            :label="
              t('page.passivbot.v6single.backtestPage.form.startingBalance')
            "
          >
            <ElInputNumber v-model="formModel.initial_capital" class="w-full" />
          </ElFormItem>
        </ElCard>

        <ElCard class="mb-5">
          <template #header>
            <div class="font-bold">
              {{
                t('page.passivbot.v6single.backtestPage.form.strategyParams')
              }}
            </div>
          </template>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.marketType')"
          >
            <div class="flex w-full items-center">
              <ElSelect
                v-model="formModel.market_type"
                class="flex-grow"
                :placeholder="
                  t(
                    'page.passivbot.v6single.backtestPage.form.marketTypePlaceholder',
                  )
                "
              >
                <ElOption label="futures" value="futures" />
                <ElOption label="spot" value="spot" />
              </ElSelect>
              <ElCheckbox
                v-model="formModel.ohlcv"
                label="OHLCV"
                class="ml-4"
              />
            </div>
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.configType')"
          >
            <ElSelect
              v-model="formModel.config_type"
              class="w-full"
              :placeholder="
                t(
                  'page.passivbot.v6single.backtestPage.form.configTypePlaceholder',
                )
              "
            />
          </ElFormItem>
          <ElFormItem
            :label="
              t('page.passivbot.v6single.backtestPage.form.passivbotMode')
            "
          >
            <ElSelect
              v-model="formModel.passivbot_mode"
              class="w-full"
              :placeholder="
                t(
                  'page.passivbot.v6single.backtestPage.form.passivbotModePlaceholder',
                )
              "
            >
              <ElOption label="recursive_grid" value="recursive_grid" />
              <ElOption label="neat_grid" value="neat_grid" />
              <ElOption label="clock" value="clock" />
            </ElSelect>
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.longEnabled')"
          >
            <ElSwitch v-model="formModel.long_enabled" />
          </ElFormItem>
          <ElFormItem
            :label="
              t(
                'page.passivbot.v6single.backtestPage.form.longWalletExposureLimit',
              )
            "
          >
            <ElInputNumber
              v-model="formModel.long_wallet_exposure_limit"
              :disabled="!formModel.long_enabled"
              class="w-full"
            />
          </ElFormItem>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.shortEnabled')"
          >
            <ElSwitch v-model="formModel.short_enabled" />
          </ElFormItem>
          <ElFormItem
            :label="
              t(
                'page.passivbot.v6single.backtestPage.form.shortWalletExposureLimit',
              )
            "
          >
            <ElInputNumber
              v-model="formModel.short_wallet_exposure_limit"
              :disabled="!formModel.short_enabled"
              class="w-full"
            />
          </ElFormItem>
        </ElCard>

        <ElCard>
          <template #header>
            <div class="flex items-center justify-between">
              <span class="font-bold">{{
                t(
                  'page.passivbot.v6single.backtestPage.form.strategyConfigCode',
                )
              }}</span>
              <div class="flex items-center">
                <span class="mr-2 text-sm">{{
                  t(
                    'page.passivbot.v6single.backtestPage.form.previewGridParams',
                  )
                }}</span>
                <ElSwitch v-model="formModel.preview_grid" />
              </div>
            </div>
          </template>
          <ElFormItem
            :label="t('page.passivbot.v6single.backtestPage.form.pasteConfig')"
            label-position="top"
          >
            <Codemirror
              v-model="formModel.config"
              :extensions="cmExtensions"
              :style="{ height: '200px', width: '100%' }"
              @ready="handleReady"
            />
          </ElFormItem>
          <div class="my-4 flex justify-center">
            <ElButton type="primary">
              {{ t('page.passivbot.v6single.backtestPage.form.convertToV7') }}
            </ElButton>
          </div>
          <ElFormItem
            :label="
              t('page.passivbot.v6single.backtestPage.form.v7CompatibleConfig')
            "
            label-position="top"
          >
            <Codemirror
              v-model="formModel.config_converted"
              :disabled="true"
              :extensions="cmExtensions"
              :style="{ height: '200px', width: '100%' }"
              @ready="handleReady"
            />
          </ElFormItem>
        </ElCard>
      </ElForm>
    </Drawer>
    <ElDialog
      v-model="logDialogVisible"
      :title="logDialogTitle"
      width="70%"
      top="5vh"
    >
      <ElScrollbar height="70vh">
        <pre class="p-4">{{ logContent }}</pre>
      </ElScrollbar>
    </ElDialog>
    <ElDialog
      v-if="currentBacktestResult"
      v-model="resultDialogVisible"
      :title="`${t('common.actions.viewResults')} - ${currentBacktestResult.name}`"
      width="80%"
      top="5vh"
    >
      <ElScrollbar height="80vh">
        <div class="p-4">
          <ElCard class="mb-4">
            <template #header>
              <div class="font-bold">
                {{
                  t('page.passivbot.v6single.backtestPage.results.chartInfo')
                }}
              </div>
            </template>
            <div class="flex w-full">
              <VChart
                v-loading="chartLoading"
                :option="longChartOptions"
                class="h-[600px] flex-1"
                autoresize
              />
              <VChart
                v-loading="chartLoading"
                :option="shortChartOptions"
                class="h-[600px] flex-1"
                autoresize
              />
            </div>
          </ElCard>

          <ElCard class="mb-4">
            <template #header>
              <div class="font-bold">
                {{
                  t('page.passivbot.v6single.backtestPage.results.resultText')
                }}
              </div>
            </template>
            <pre>{{ backtestResultText }}</pre>
          </ElCard>

          <ElCard>
            <template #header>
              <div class="flex items-center justify-between">
                <div class="font-bold">
                  {{
                    t('page.passivbot.v6single.backtestPage.results.configInfo')
                  }}
                </div>
                <ElButton
                  :icon="CopyDocument"
                  circle
                  class="ml-2"
                  @click="copyConfig"
                />
              </div>
            </template>
            <pre>{{ JSON.stringify(backtestConfig, null, 2) }}</pre>
          </ElCard>
        </div>
      </ElScrollbar>
    </ElDialog>
  </Page>
</template>

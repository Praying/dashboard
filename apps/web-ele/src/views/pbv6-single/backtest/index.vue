<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { computed, reactive, shallowRef, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCol,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElRow,
  ElSelect,
  ElSwitch,
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

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => {
    // TODO: Add submit logic
    drawerApi.close();
  },
});

function handleNewBacktest() {
  drawerApi.setState({
    title: t('page.passivbot.v7.backtestPage.newBacktest'),
  });
  drawerApi.open();
}

const formModel = reactive({
  user: 'bitget-bot-doge',
  symbol: '',
  market_type: 'futures',
  ohlcv: true,
  starting_balance: 1000,
  start_date: '2021-09-30',
  end_date: '2025-09-29',
  long_enabled: true,
  short_enabled: false,
  preview_grid: false,
  long_wallet_exposure_limit: 1.0,
  short_wallet_exposure_limit: 1.0,
  config_type: 'None',
  config: '',
  config_converted: '',
});

interface Backtest {
  id: number;
  status: 'error' | 'complete' | 'running';
  user: string;
  symbol: string;
  market: string;
  exchange: string;
  start: string;
  end: string;
  balance: number;
}

const tableData = reactive<Backtest[]>([
  {
    id: 0,
    status: 'error',
    user: 'bitget-bot-doge',
    symbol: 'BNBUSDT',
    market: 'futures',
    exchange: 'bitget',
    start: '2021-08-18',
    end: '2025-08-17',
    balance: 250,
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
      { field: 'id', title: 'id', sortable: true, width: 80, align: 'left', headerAlign: 'left'},
      { field: 'user', title: 'User', sortable: true, align: 'left', headerAlign: 'left' },
      { field: 'exchange', title: 'Exchange', sortable: true, align: 'left', headerAlign: 'left' },
      { field: 'symbol', title: 'Symbol', sortable: true, align: 'left', headerAlign: 'left' },      
      { field: 'start', title: 'Start', sortable: true, align: 'left', headerAlign: 'left' },
      { field: 'end', title: 'End', sortable: true, align: 'left', headerAlign: 'left' },
      { field: 'balance', title: 'Balance', sortable: true, align: 'left', headerAlign: 'left' },
      {
        field: 'status',
        title: 'Status',
        slots: { default: 'col-status' },
        sortable: true,
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
        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="User">
              <ElSelect v-model="formModel.user" class="w-full" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="Symbol">
              <ElSelect
                v-model="formModel.symbol"
                class="w-full"
                placeholder="Select Symbol"
              />
            </ElFormItem>
            <ElButton class="w-full mt-2">
              Update Symbols from Exchange
            </ElButton>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="Market Type">
              <ElCheckbox v-model="formModel.market_type" label="futures">
                futures
              </ElCheckbox>
            </ElFormItem>
            <ElFormItem  class="mt-2">
              <ElCheckbox v-model="formModel.ohlcv" label="OHLCV" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="Starting Balance">
              <ElInputNumber
                v-model="formModel.starting_balance"
                class="w-full"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="Start Date">
              <ElDatePicker v-model="formModel.start_date" class="w-full" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="End Date">
              <ElDatePicker v-model="formModel.end_date" class="w-full" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20" class="py-2.5">
          <ElCol :span="8">
            <div class="flex items-center">
              <ElSwitch v-model="formModel.long_enabled" />
              <span class="ml-2 text-sm">Long enabled</span>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex items-center">
              <ElSwitch v-model="formModel.short_enabled" />
              <span class="ml-2 text-sm">Short enabled</span>
            </div>
          </ElCol>
          <ElCol :span="8">
            <div class="flex items-center">
              <ElSwitch v-model="formModel.preview_grid" />
              <span class="ml-2 text-sm">Preview Grid</span>
            </div>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="8">
            <ElFormItem label="Long Wallet Exposure Limit">
              <ElInputNumber
                v-model="formModel.long_wallet_exposure_limit"
                class="w-full"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="Short Wallet Exposure Limit">
              <ElInputNumber
                v-model="formModel.short_wallet_exposure_limit"
                class="w-full"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="Config Type">
              <ElSelect v-model="formModel.config_type" class="w-full" />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem label="config">
              <Codemirror
                v-model="formModel.config"
                :extensions="cmExtensions"
                :style="{ height: '400px', width: '100%' }"
                @ready="handleReady"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="config converted to v7">
              <Codemirror
                v-model="formModel.config_converted"
                :extensions="cmExtensions"
                :style="{ height: '400px', width: '100%' }"
                @ready="handleReady"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </Drawer>
  </Page>
</template>

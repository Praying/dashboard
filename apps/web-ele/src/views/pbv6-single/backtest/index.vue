<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ApiKey } from '#/api/system/exchange';

import { computed, onMounted, reactive, ref, shallowRef, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { Refresh } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElSelect,
  ElSwitch,
  ElTag,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getApiKeysApi } from '#/api/system/exchange';
import { getTradingPairsApi } from '#/api/trading-pairs';

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

interface Backtest {
  id: number;
  status: 'complete' | 'error' | 'running';
  accountName: string;
  symbol: string;
  market: string;
  model: string;
  exchange: string;
  start: string;
  end: string;
  initial_capital: number;
}

const tableData = reactive<Backtest[]>([
  {
    id: 0,
    status: 'error',
    accountName: 'bitget-bot-doge',
    symbol: 'BNBUSDT',
    market: 'futures',
    model: 'clock',
    exchange: 'bitget',
    start: '2021-08-18',
    end: '2025-08-17',
    initial_capital: 250,
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
        title: t('page.passivbot.v6single.backtestPage.table.id'),
        sortable: true,
        width: 80,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'accountName',
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
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'start',
        title: t('page.passivbot.v6single.backtestPage.table.start'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'end',
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
  </Page>
</template>

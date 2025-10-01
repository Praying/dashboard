<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { reactive, watch } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';

import { QuestionFilled, Refresh } from '@element-plus/icons-vue';
import { locale } from 'dayjs';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCol,
  ElDatePicker,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElOption,
  ElRow,
  ElSelect,
  ElSwitch,
  ElTooltip,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

const { t } = useI18n();

const formModel = reactive({
  user: 'binance_01',
  symbol: '',
  market_type: 'futures',
  ohlcv: true,
  long_enabled: true,
  short_enabled: true,
  starting_balance: 1000,
  date_range: ['2021-10-02', '2025-10-01'],
  passivbot_mode: 'recursive_grid',
  algorithm: 'harmony_search',
  iters: 4000,
  reruns: 1,
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => {
    // TODO: Add submit logic
    drawerApi.close();
  },
});

function handleNewOptimize() {
  drawerApi.setState({
    title: t('page.passivbot.v6single.optimizePage.newOptimize'),
  });
  drawerApi.open();
}

interface OptimizeInstance {
  pos: number;
  up: boolean;
  down: boolean;
  edit: boolean;
  user: string;
  symbol: string;
  config: string;
  sd: string;
  ed: string;
  sb: number;
  market_type: string;
  ohlcv: boolean;
  mode: string;
  algo: string;
  iters: number;
  long: boolean;
  short: boolean;
  log: boolean;
  run: boolean;
  reruns: number;
  finish: number;
  remove: boolean;
}

const tableData = reactive<OptimizeInstance[]>([
  {
    pos: 0,
    up: false,
    down: false,
    edit: false,
    user: 'binance_01',
    symbol: 'BNBUSDT',
    config: 'default.hjson',
    sd: '2021-08-25',
    ed: '2025-08-24',
    sb: 250,
    market_type: 'futures',
    ohlcv: true,
    mode: 'recursive_grid',
    algo: 'harmony_search',
    iters: 8000,
    long: true,
    short: false,
    log: false,
    run: false,
    reruns: 1,
    finish: 1,
    remove: false,
  },
]);

const gridOptions = reactive<VxeGridProps<OptimizeInstance>>({
  columns: [],
  data: tableData,
  sortConfig: {},
});

watch(
  locale,
  () => {
    gridOptions.columns = [
      { field: 'pos', title: 'pos', sortable: true, width: 80 },
      { field: 'up', title: 'up', sortable: true, width: 60 },
      { field: 'down', title: 'down', sortable: true, width: 80 },
      { field: 'edit', title: 'edit', sortable: true, width: 60 },
      { field: 'user', title: 'user', sortable: true, minWidth: 120 },
      { field: 'symbol', title: 'symbol', sortable: true, minWidth: 120 },
      { field: 'config', title: 'config', sortable: true, minWidth: 150 },
      { field: 'sd', title: 'Start Date', sortable: true, minWidth: 120 },
      { field: 'ed', title: 'End Date', sortable: true, minWidth: 120 },
      { field: 'sb', title: 'Start Balance', sortable: true, minWidth: 120 },
      {
        field: 'market_type',
        title: 'Exchange',
        sortable: true,
        minWidth: 120,
      },
      { field: 'ohlcv', title: 'ohlcv', sortable: true, width: 80 },
      { field: 'mode', title: 'mode', sortable: true, minWidth: 150 },
      { field: 'algo', title: 'algo', sortable: true, minWidth: 150 },
      { field: 'iters', title: 'iters', sortable: true, minWidth: 80 },
      { field: 'long', title: 'long', sortable: true, width: 80 },
      { field: 'short', title: 'short', sortable: true, width: 80 },
      { field: 'log', title: 'log', sortable: true, width: 60 },
      { field: 'run', title: 'run', sortable: true, width: 60 },
      { field: 'reruns', title: 'reruns', sortable: true, minWidth: 80 },
      { field: 'finish', title: 'finish', sortable: true, minWidth: 80 },
      { field: 'remove', title: 'remove', sortable: true, width: 80 },
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
              {{ t('page.passivbot.v6single.optimizePage.listTitle') }}
            </div>
            <div class="text-sm text-gray-500">
              {{ t('page.passivbot.v6single.optimizePage.listDescription') }}
            </div>
          </div>
          <ElButton type="primary" @click="handleNewOptimize">
            {{ t('page.passivbot.v6single.optimizePage.newOptimize') }}
          </ElButton>
        </div>
      </template>
      <template #default>
        <Grid>
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
      <ElForm :model="formModel" label-position="right" label-width="140px">
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem
              :label="t('page.passivbot.v6single.optimizePage.form.user')"
            >
              <ElSelect v-model="formModel.user" class="w-full">
                <ElOption label="binance_01" value="binance_01" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem
              :label="t('page.passivbot.v6single.optimizePage.form.symbol')"
            >
              <div class="flex w-full items-center gap-2">
                <ElSelect
                  v-model="formModel.symbol"
                  class="flex-grow"
                  :placeholder="
                    t(
                      'page.passivbot.v6single.optimizePage.form.selectSymbolPlaceholder',
                    )
                  "
                />
                <ElButton :icon="Refresh" circle />
              </div>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem
              :label="t('page.passivbot.v6single.optimizePage.form.marketType')"
            >
              <ElSelect v-model="formModel.market_type" class="w-full">
                <ElOption label="futures" value="futures" />
                <ElOption label="spot" value="spot" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem
              :label="
                t('page.passivbot.v6single.optimizePage.form.startingBalance')
              "
            >
              <ElInputNumber
                v-model="formModel.starting_balance"
                class="w-full"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem
              :label="t('page.passivbot.v6single.optimizePage.form.dateRange')"
            >
              <ElDatePicker
                v-model="formModel.date_range"
                class="w-full"
                end-placeholder="End date"
                start-placeholder="Start date"
                type="daterange"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem
              :label="t('page.passivbot.v6single.optimizePage.form.ohlcv')"
            >
              <ElCheckbox v-model="formModel.ohlcv" />
              <ElTooltip
                :content="
                  t('page.passivbot.v6single.optimizePage.form.ohlcvTooltip')
                "
                placement="top"
              >
                <ElButton :icon="QuestionFilled" circle text class="ml-1" />
              </ElTooltip>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElFormItem
          :label="t('page.passivbot.v6single.optimizePage.form.tradeDirection')"
        >
          <div class="flex items-center gap-2">
            <ElSwitch v-model="formModel.long_enabled" />
            <span>{{
              t('page.passivbot.v6single.optimizePage.form.longEnabled')
            }}</span>
            <ElSwitch v-model="formModel.short_enabled" class="ml-4" />
            <span>{{
              t('page.passivbot.v6single.optimizePage.form.shortEnabled')
            }}</span>
          </div>
        </ElFormItem>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem
              :label="
                t('page.passivbot.v6single.optimizePage.form.passivbotMode')
              "
            >
              <ElSelect v-model="formModel.passivbot_mode" class="w-full">
                <ElOption label="recursive_grid" value="recursive_grid" />
                <ElOption label="neat_grid" value="neat_grid" />
                <ElOption label="clock" value="clock" />
              </ElSelect>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem
              :label="t('page.passivbot.v6single.optimizePage.form.algorithm')"
            >
              <ElSelect v-model="formModel.algorithm" class="w-full">
                <ElOption label="harmony_search" value="harmony_search" />
                <ElOption
                  label="particle_swarm_optimization"
                  value="particle_swarm_optimization"
                />
              </ElSelect>
            </ElFormItem>
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem>
              <template #label>
                <span>{{
                  t('page.passivbot.v6single.optimizePage.form.iters')
                }}</span>
                <ElTooltip
                  :content="
                    t('page.passivbot.v6single.optimizePage.form.itersTooltip')
                  "
                  placement="top"
                >
                  <ElButton :icon="QuestionFilled" circle text />
                </ElTooltip>
              </template>
              <ElInputNumber v-model="formModel.iters" class="w-full" />
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem>
              <template #label>
                <span>{{
                  t('page.passivbot.v6single.optimizePage.form.reruns')
                }}</span>
                <ElTooltip
                  :content="
                    t('page.passivbot.v6single.optimizePage.form.rerunsTooltip')
                  "
                  placement="top"
                >
                  <ElButton :icon="QuestionFilled" circle text />
                </ElTooltip>
              </template>
              <ElInputNumber v-model="formModel.reruns" class="w-full" />
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </Drawer>
  </Page>
</template>

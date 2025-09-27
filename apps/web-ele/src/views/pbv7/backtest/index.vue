<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElDatePicker,
  ElDrawer,
  ElForm,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus';

interface CoinOverride {
  symbol: string;
}

const formModel = reactive({
  exchanges: 'binance',
  backtest_name: 'rank8-last-3-month',
  start_date: dayjs('2025-06-06').toDate(),
  end_date: dayjs('2025-09-05').toDate(),
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

const drawer = ref(false);

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
</script>

<template>
  <Page
    content-class="flex flex-col gap-4"
    description="基于Passivbot v7版本的回测页面"
    title="PBv7 回测"
  >
    <template #extra>
      <ElButton class="mb-2" type="primary" @click="drawer = true">
        新建回测
      </ElButton>
    </template>
    <ElCard>
      <template #default>
        <Grid />
      </template>
    </ElCard>
    <ElDrawer v-model="drawer" title="新建回测" size="50%">
      <ElForm :model="formModel" label-position="top">
        <ElCard class="mb-4">
          <template #header>
            <div class="font-bold">基础设置</div>
          </template>
          <ElRow :gutter="20">
            <ElCol :span="8">
              <ElFormItem label="Exchanges">
                <ElSelect v-model="formModel.exchanges" class="w-full">
                  <ElOption label="binance" value="binance" />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="Backtest Name">
                <ElInput v-model="formModel.backtest_name" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="starting_balance">
                <ElInputNumber
                  v-model="formModel.starting_balance"
                  class="w-full"
                  :precision="2"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="start_date">
                <ElDatePicker
                  v-model="formModel.start_date"
                  class="w-full"
                  type="date"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="end_date">
                <ElDatePicker
                  v-model="formModel.end_date"
                  class="w-full"
                  type="date"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="market_cap">
                <ElInputNumber v-model="formModel.market_cap" class="w-full" />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElCard>

        <ElCard class="mb-4">
          <template #header>
            <div class="font-bold">策略过滤条件</div>
          </template>
          <ElRow :gutter="20">
            <ElCol :span="8">
              <ElFormItem label="minimum_coin_age_days">
                <ElInputNumber
                  v-model="formModel.minimum_coin_age_days"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="vol/mcap">
                <ElInputNumber
                  v-model="formModel.vol_mcap"
                  class="w-full"
                  :precision="2"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="8">
              <ElFormItem label="gap_tolerance_ohlcvs_minutes">
                <ElInputNumber
                  v-model="formModel.gap_tolerance_ohlcvs_minutes"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElRow>
            <ElCol :span="24">
              <div class="grid grid-cols-6 gap-x-4 py-2">
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
            <div class="font-bold">币种选择</div>
          </template>
          <ElRow :gutter="20">
            <ElCol :span="12">
              <ElFormItem label="approved_coins_long">
                <ElSelect
                  v-model="formModel.approved_coins_long"
                  class="w-full"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Choose an option"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="approved_coins_short">
                <ElSelect
                  v-model="formModel.approved_coins_short"
                  class="w-full"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Choose an option"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="ignored_symbols_long">
                <ElSelect
                  v-model="formModel.ignored_symbols_long"
                  class="w-full"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Choose an option"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="ignored_symbols_short">
                <ElSelect
                  v-model="formModel.ignored_symbols_short"
                  class="w-full"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Choose an option"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElCard>

        <ElCard class="mb-4">
          <template #header>
            <div class="font-bold">参数配置</div>
          </template>
          <ElRow :gutter="20">
            <ElCol :span="6">
              <ElFormItem label="long twe">
                <ElInputNumber
                  v-model="formModel.long_twe"
                  class="w-full"
                  :precision="2"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="6">
              <ElFormItem label="long positions">
                <ElInputNumber
                  v-model="formModel.long_positions"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="6">
              <ElFormItem label="short twe">
                <ElInputNumber
                  v-model="formModel.short_twe"
                  class="w-full"
                  :precision="2"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="6">
              <ElFormItem label="short positions">
                <ElInputNumber
                  v-model="formModel.short_positions"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
          <ElCollapse class="my-4 border-none">
            <ElCollapseItem title="Coin Overrides" name="1">
              <div
                v-for="(override, index) in formModel.coin_overrides"
                :key="index"
                class="mb-4 rounded border p-4"
              >
                <ElRow :gutter="20" class="mb-4">
                  <ElCol :span="10">
                    <ElFormItem label="Symbol">
                      <ElSelect
                        v-model="override.symbol"
                        class="w-full"
                        default-first-option
                        filterable
                        allow-create
                        placeholder="Choose or create a symbol"
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
                      Remove
                    </ElButton>
                  </ElCol>
                </ElRow>
              </div>
              <ElButton @click="addOverride">Add Coin Override</ElButton>
            </ElCollapseItem>
          </ElCollapse>

          <ElRow :gutter="20">
            <ElCol :span="12">
              <ElFormItem label="long">
                <ElInput v-model="formModel.long" type="textarea" :rows="16" />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem label="short">
                <ElInput v-model="formModel.short" type="textarea" :rows="16" />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElCard>
      </ElForm>
      <template #footer>
        <div class="flex justify-end">
          <ElButton @click="drawer = false">取消</ElButton>
          <ElButton type="primary" @click="handleSubmit">提交</ElButton>
        </div>
      </template>
    </ElDrawer>
  </Page>
</template>

<script lang="ts" setup>
import type { OptimizeForm } from '../typing';

import { computed, ref, shallowRef, watch } from 'vue';
import { Codemirror } from 'vue-codemirror';

import { useI18n } from '@vben/locales';
import { usePreferences } from '@vben/preferences';

import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  ElButton,
  ElCheckbox,
  ElCol,
  ElCollapse,
  ElCollapseItem,
  ElDatePicker,
  ElFormItem,
  ElInput,
  ElInputNumber,
  ElOption,
  ElRow,
  ElSelect,
} from 'element-plus';

const props = defineProps<{
  model: OptimizeForm;
}>();

const emit = defineEmits(['update:model']);

const localModel = ref();

watch(
  () => props.model,
  (newModel) => {
    const newModelString = JSON.stringify(newModel);
    if (newModelString !== JSON.stringify(localModel.value)) {
      localModel.value = JSON.parse(newModelString);
    }
  },
  { deep: true, immediate: true },
);

watch(
  localModel,
  (newLocalModel) => {
    const propsModelString = JSON.stringify(props.model);
    if (propsModelString !== JSON.stringify(newLocalModel)) {
      emit('update:model', newLocalModel);
    }
  },
  { deep: true },
);

const { t } = useI18n();
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
</script>

<template>
  <div class="common-group">
    <ElRow :gutter="20">
      <ElCol :span="12">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.exchanges')">
          <ElSelect
            v-model="localModel.exchanges"
            class="w-full"
            multiple
            :placeholder="t('common.choose')"
          >
            <ElOption label="binance" value="binance" />
            <ElOption label="bybit" value="bybit" />
          </ElSelect>
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem
          :label="t('page.passivbot.v7.optimizePage.form.optimizeName')"
        >
          <ElInput v-model="localModel.name" placeholder="sss" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.startDate')">
          <ElDatePicker
            v-model="localModel.start_date"
            class="w-full"
            type="date"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.endDate')">
          <ElDatePicker
            v-model="localModel.end_date"
            class="w-full"
            type="date"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem
          :label="t('page.passivbot.v7.optimizePage.form.startingBalance')"
        >
          <ElInputNumber v-model="localModel.starting_balance" class="w-full" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.iters')">
          <ElInputNumber v-model="localModel.iters" class="w-full" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.nCpus')">
          <ElInputNumber v-model="localModel.n_cpus" class="w-full" />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20" class="my-4">
      <ElCol :span="8">
        <ElCheckbox v-model="localModel.combine_ohlcvs">
          {{ t('page.passivbot.v7.optimizePage.form.combineOhlcvs') }}
        </ElCheckbox>
      </ElCol>
      <ElCol :span="8">
        <ElCheckbox v-model="localModel.compress_results_file">
          {{ t('page.passivbot.v7.optimizePage.form.compressResultsFile') }}
        </ElCheckbox>
      </ElCol>
      <ElCol :span="8">
        <ElCheckbox v-model="localModel.starting_config">
          {{ t('page.passivbot.v7.optimizePage.form.startingConfig') }}
        </ElCheckbox>
      </ElCol>
      <ElCol :span="8">
        <ElCheckbox v-model="localModel.use_btc_collateral">
          {{ t('page.passivbot.v7.optimizePage.form.useBtcCollateral') }}
        </ElCheckbox>
      </ElCol>
      <ElCol :span="8">
        <ElCheckbox v-model="localModel.only_cpt">
          {{ t('page.passivbot.v7.optimizePage.form.onlyCpt') }}
        </ElCheckbox>
      </ElCol>
      <ElCol :span="8">
        <ElCheckbox v-model="localModel.apply_filters">
          {{ t('page.passivbot.v7.optimizePage.form.applyFilters') }}
        </ElCheckbox>
      </ElCol>
    </ElRow>
    <ElRow :gutter="20">
      <ElCol :span="8">
        <ElFormItem
          :label="t('page.passivbot.v7.optimizePage.form.populationSize')"
        >
          <ElInputNumber v-model="localModel.population_size" class="w-full" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem
          :label="t('page.passivbot.v7.optimizePage.form.crossoverProbability')"
        >
          <ElInputNumber
            v-model="localModel.crossover_probability"
            class="w-full"
            :precision="2"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem
          :label="t('page.passivbot.v7.optimizePage.form.mutationProbability')"
        >
          <ElInputNumber
            v-model="localModel.mutation_probability"
            class="w-full"
            :precision="2"
          />
        </ElFormItem>
      </ElCol>
      <ElCol :span="24">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.scoring')">
          <ElSelect
            v-model="localModel.scoring"
            class="w-full"
            multiple
            :placeholder="t('common.choose')"
          >
            <ElOption label="loss_profit_ratio" value="loss_profit_ratio" />
            <ElOption label="mdg_w" value="mdg_w" />
            <ElOption label="sharpe_ratio" value="sharpe_ratio" />
          </ElSelect>
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.marketCap')">
          <ElInputNumber v-model="localModel.market_cap" class="w-full" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.volMcap')">
          <ElInputNumber v-model="localModel['vol/mcap']" class="w-full" />
        </ElFormItem>
      </ElCol>
      <ElCol :span="8">
        <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.tags')">
          <ElSelect
            v-model="localModel.tags"
            class="w-full"
            multiple
            :placeholder="t('common.choose')"
          />
        </ElFormItem>
      </ElCol>
    </ElRow>
    <ElCollapse class="my-4 border-none">
      <ElCollapseItem
        :title="t('page.passivbot.v7.optimizePage.form.editConfig')"
        name="1"
      >
        <ElRow :gutter="20">
          <ElCol :span="6">
            <ElFormItem
              :label="t('page.passivbot.v7.optimizePage.form.longTwe')"
            >
              <ElInputNumber
                v-model="localModel.long_twe"
                class="w-full"
                :precision="2"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem
              :label="t('page.passivbot.v7.optimizePage.form.longPositions')"
            >
              <ElInputNumber
                v-model="localModel.long_positions"
                class="w-full"
                :precision="2"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem
              :label="t('page.passivbot.v7.optimizePage.form.shortTwe')"
            >
              <ElInputNumber
                v-model="localModel.short_twe"
                class="w-full"
                :precision="2"
              />
            </ElFormItem>
          </ElCol>
          <ElCol :span="6">
            <ElFormItem
              :label="t('page.passivbot.v7.optimizePage.form.shortPositions')"
            >
              <ElInputNumber
                v-model="localModel.short_positions"
                class="w-full"
                :precision="2"
              />
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="20">
          <ElCol :span="12">
            <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.long')">
              <Codemirror
                v-model="localModel.long"
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
            <ElFormItem :label="t('page.passivbot.v7.optimizePage.form.short')">
              <Codemirror
                v-model="localModel.short"
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
      </ElCollapseItem>
    </ElCollapse>
    <ElCollapse class="my-4 border-none">
      <ElCollapseItem
        :title="t('page.passivbot.v7.optimizePage.form.editLimits')"
        name="2"
      >
        <ElRow :gutter="20">
          <ElCol :span="12">
            <div class="grid grid-cols-[1fr_1fr_auto] items-end gap-x-4">
              <ElFormItem
                :label="
                  t('page.passivbot.v7.optimizePage.form.penalizeIfGreaterThan')
                "
              >
                <ElSelect v-model="localModel.p_gt_select" class="w-full">
                  <ElOption label="adg" value="adg" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                :label="t('page.passivbot.v7.optimizePage.form.limit')"
              >
                <ElInputNumber
                  v-model="localModel.p_gt_limit"
                  class="w-full"
                  :precision="5"
                  :step="0.00001"
                />
              </ElFormItem>
              <ElFormItem label=" ">
                <ElButton>{{ t('common.addLimit') }}</ElButton>
              </ElFormItem>
            </div>
            <div class="grid grid-cols-[1fr_1fr_auto] items-end gap-x-4">
              <ElFormItem
                :label="
                  t(
                    'page.passivbot.v7.optimizePage.form.penalizeIfGreaterThanBtc',
                  )
                "
              >
                <ElSelect v-model="localModel.p_gt_btc_select" class="w-full">
                  <ElOption label="adg" value="adg" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                :label="t('page.passivbot.v7.optimizePage.form.limit')"
              >
                <ElInputNumber
                  v-model="localModel.p_gt_btc_limit"
                  class="w-full"
                  :precision="5"
                  :step="0.00001"
                />
              </ElFormItem>
              <ElFormItem label=" ">
                <ElButton>{{ t('common.addLimit') }}</ElButton>
              </ElFormItem>
            </div>
          </ElCol>
          <ElCol :span="12">
            <div class="grid grid-cols-[1fr_1fr_auto] items-end gap-x-4">
              <ElFormItem
                :label="
                  t('page.passivbot.v7.optimizePage.form.penalizeIfLowerThan')
                "
              >
                <ElSelect v-model="localModel.p_lt_select" class="w-full">
                  <ElOption label="adg" value="adg" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                :label="t('page.passivbot.v7.optimizePage.form.limit')"
              >
                <ElInputNumber
                  v-model="localModel.p_lt_limit"
                  class="w-full"
                  :precision="5"
                  :step="0.00001"
                />
              </ElFormItem>
              <ElFormItem label=" ">
                <ElButton>{{ t('common.addLimit') }}</ElButton>
              </ElFormItem>
            </div>
            <div class="grid grid-cols-[1fr_1fr_auto] items-end gap-x-4">
              <ElFormItem
                :label="
                  t(
                    'page.passivbot.v7.optimizePage.form.penalizeIfLowerThanBtc',
                  )
                "
              >
                <ElSelect v-model="localModel.p_lt_btc_select" class="w-full">
                  <ElOption label="adg" value="adg" />
                </ElSelect>
              </ElFormItem>
              <ElFormItem
                :label="t('page.passivbot.v7.optimizePage.form.limit')"
              >
                <ElInputNumber
                  v-model="localModel.p_lt_btc_limit"
                  class="w-full"
                  :precision="5"
                  :step="0.00001"
                />
              </ElFormItem>
              <ElFormItem label=" ">
                <ElButton>{{ t('common.addLimit') }}</ElButton>
              </ElFormItem>
            </div>
          </ElCol>
        </ElRow>
      </ElCollapseItem>
    </ElCollapse>
  </div>
</template>

<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { reactive, ref, watch } from 'vue';

import { useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';

import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElCheckbox,
  ElCol,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElInputNumber,
  ElLink,
  ElOption,
  ElRow,
  ElSelect,
  ElTag,
  ElTooltip,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

const { t, locale } = useI18n();

const [Drawer, drawerApi] = useVbenDrawer({});

function openSettingsDrawer() {
  drawerApi.open();
  drawerApi.setState({ title: t('coin-data.drawer.title') });
}

const config = reactive({
  apiKey: '****************',
  fetchLimit: 5000,
  fetchInterval: 24,
  metadataInterval: 1,
});

const filters = reactive({
  exchange: 'binance',
  market_cap: 0,
  vol_mcap: 10,
  tags: [],
});

interface Option {
  value: string;
  label: string;
}

interface CoinData {
  id: number;
  symbol: string;
  name: string;
  tags: string[];
  price: number;
  volume_24h: number;
  market_cap: number;
  vol_mcap: number;
  copy_trading: boolean;
  notice: string;
  link: string;
}

const exchangeOptions = ref<Option[]>([{ value: 'binance', label: 'Binance' }]);
const tagOptions = ref<Option[]>([]);

const tableData = ref<CoinData[]>([
  {
    id: 0,
    symbol: 'BTCUSDT',
    name: 'Bitcoin',
    tags: [
      'mineable',
      'pow',
      'sha-256',
      'store-of-value',
      'state-channel',
      'coinbase-ventures-portfolio',
    ],
    price: 111_811.001_854_66,
    volume_24h: 40_229_722_476,
    market_cap: 2_228_105_353_633,
    vol_mcap: 0.0181,
    copy_trading: true,
    notice: '',
    link: 'CoinMarketCap',
  },
  {
    id: 1,
    symbol: 'ETHUSDT',
    name: 'Ethereum',
    tags: [
      'pos',
      'smart-contracts',
      'ethereum-ecosystem',
      'coinbase-ventures-portfolio',
      'three-arrows-capital-portfolio',
    ],
    price: 4106.133_995_23,
    volume_24h: 28_156_613_707,
    market_cap: 495_623_720_330,
    vol_mcap: 0.0568,
    copy_trading: true,
    notice: '',
    link: 'CoinMarketCap',
  },
  {
    id: 3,
    symbol: 'XRPUSDT',
    name: 'XRP',
    tags: [
      'medium-of-exchange',
      'enterprise-solutions',
      'xrp-ecosystem',
      'arrington-xrp-capital-portfolio',
    ],
    price: 2.856_184_58,
    volume_24h: 3_701_154_445,
    market_cap: 170_875_539_338,
    vol_mcap: 0.0217,
    copy_trading: true,
    notice: '',
    link: 'CoinMarketCap',
  },
  {
    id: 4,
    symbol: 'BNBUSDT',
    name: 'BNB',
    tags: [
      'marketplace',
      'centralized-exchange',
      'payments',
      'smart-contracts',
      'alameda-research-portfolio',
    ],
    price: 1009.065_418_39,
    volume_24h: 2_726_279_448,
    market_cap: 140_447_388_946,
    vol_mcap: 0.0194,
    copy_trading: true,
    notice: '',
    link: 'CoinMarketCap',
  },
  {
    id: 5,
    symbol: 'SOLUSDT',
    name: 'Solana',
    tags: [
      'pos',
      'platform',
      'solana-ecosystem',
      'cms-holdings-portfolio',
      'kenetic-capital-portfolio',
    ],
    price: 208.186_573_1,
    volume_24h: 5_051_070_653,
    market_cap: 113_150_938_980,
    vol_mcap: 0.0446,
    copy_trading: true,
    notice: '',
    link: 'CoinMarketCap',
  },
  {
    id: 6,
    symbol: 'USDCUSDT',
    name: 'USDC',
    tags: [
      'medium-of-exchange',
      'stablecoin',
      'asset-backed-stablecoin',
      'coinbase-ventures-portfolio',
    ],
    price: 0.999_960_86,
    volume_24h: 10_185_532_560,
    market_cap: 73_628_203_450,
    vol_mcap: 0.1383,
    copy_trading: true,
    notice: '',
    link: 'CoinMarketCap',
  },
]);
const gridOptions = reactive<VxeGridProps<CoinData>>({
  columns: [],
  data: tableData.value,
  sortConfig: {},
});

watch(
  locale,
  () => {
    gridOptions.columns = [
      {
        field: 'id',
        title: t('coin-data.table.id'),
        width: 80,
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'symbol',
        title: t('coin-data.table.symbol'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'name',
        title: t('coin-data.table.name'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'tags',
        title: t('coin-data.table.tags'),
        width: 350,
        slots: { default: 'col-tags' },
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'price',
        title: t('coin-data.table.price'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'volume_24h',
        title: t('coin-data.table.volume24h'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'market_cap',
        title: t('coin-data.table.marketCap'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'vol_mcap',
        title: t('coin-data.table.volMcap'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'copy_trading',
        title: t('coin-data.table.copyTrading'),
        slots: { default: 'col-copy_trading' },
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'notice',
        title: t('coin-data.table.notice'),
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'link',
        title: t('coin-data.table.link'),
        slots: { default: 'col-link' },
        align: 'left',
        headerAlign: 'left',
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
  <div>
    <div class="p-4">
      <ElCard shadow="never" class="mb-4">
        <div class="mb-4 flex items-center justify-between">
          <h1 class="text-2xl font-bold">
            {{ t('coin-data.title') }}
          </h1>
          <ElButton
            :icon="ElementPlusIconsVue.Setting"
            circle
            size="large"
            @click="openSettingsDrawer"
          />
        </div>
        <ElForm :model="filters" label-position="top">
          <ElRow :gutter="20">
            <ElCol :span="4">
              <ElFormItem :label="t('coin-data.exchange')">
                <ElSelect
                  v-model="filters.exchange"
                  :placeholder="t('coin-data.selectPlaceholder')"
                  class="w-full"
                >
                  <ElOption
                    v-for="item in exchangeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
            <ElCol :span="4">
              <ElFormItem>
                <template #label>
                  <div class="flex items-center">
                    <span>{{ t('coin-data.marketCapLabel') }}</span>
                    <ElTooltip
                      :content="t('coin-data.marketCapTooltip')"
                      placement="top"
                    >
                      <ElIcon class="ml-1 cursor-pointer">
                        <component :is="ElementPlusIconsVue.QuestionFilled" />
                      </ElIcon>
                    </ElTooltip>
                  </div>
                </template>
                <ElInputNumber
                  v-model="filters.market_cap"
                  :min="0"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="4">
              <ElFormItem>
                <template #label>
                  <div class="flex items-center">
                    <span>{{ t('coin-data.volMcapLabel') }}</span>
                    <ElTooltip
                      :content="t('coin-data.volMcapTooltip')"
                      placement="top"
                    >
                      <ElIcon class="ml-1 cursor-pointer">
                        <component :is="ElementPlusIconsVue.QuestionFilled" />
                      </ElIcon>
                    </ElTooltip>
                  </div>
                </template>
                <ElInputNumber
                  v-model="filters.vol_mcap"
                  :precision="2"
                  :step="0.01"
                  class="w-full"
                />
              </ElFormItem>
            </ElCol>
            <ElCol :span="12">
              <ElFormItem :label="t('coin-data.tags')">
                <ElSelect
                  v-model="filters.tags"
                  multiple
                  :placeholder="t('coin-data.tagsPlaceholder')"
                  class="w-full"
                >
                  <ElOption
                    v-for="item in tagOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
      </ElCard>

      <ElCard shadow="never">
        <Grid>
          <template #col-tags="{ row }">
            <ElTag
              v-for="tag in row.tags"
              :key="tag"
              class="mb-1 mr-1"
              type="info"
              size="small"
            >
              {{ tag }}
            </ElTag>
          </template>
          <template #col-copy_trading="{ row }">
            <ElCheckbox :model-value="row.copy_trading" disabled />
          </template>
          <template #col-link="{ row }">
            <ElLink
              type="primary"
              href="https://coinmarketcap.com/"
              target="_blank"
            >
              {{ row.link }}
            </ElLink>
          </template>
        </Grid>
      </ElCard>
    </div>
    <Drawer class="w-1/2">
      <ElForm :model="config" label-position="top">
        <ElFormItem>
          <template #label>
            <div class="flex items-center">
              <span>{{ $t('coin-data.drawer.apiKey') }}</span>
              <ElTooltip
                :content="$t('coin-data.drawer.apiKeyTooltip')"
                placement="top"
              >
                <ElIcon class="ml-1 cursor-pointer">
                  <component :is="ElementPlusIconsVue.QuestionFilled" />
                </ElIcon>
              </ElTooltip>
            </div>
          </template>
          <ElInput v-model="config.apiKey" type="password" show-password />
        </ElFormItem>

        <ElFormItem>
          <template #label>
            <div class="flex items-center">
              <span>{{ $t('coin-data.drawer.fetchLimit') }}</span>
              <ElTooltip
                :content="$t('coin-data.drawer.fetchLimitTooltip')"
                placement="top"
              >
                <ElIcon class="ml-1 cursor-pointer">
                  <component :is="ElementPlusIconsVue.QuestionFilled" />
                </ElIcon>
              </ElTooltip>
            </div>
          </template>
          <ElInputNumber v-model="config.fetchLimit" class="w-full" />
        </ElFormItem>

        <ElFormItem>
          <template #label>
            <div class="flex items-center">
              <span>{{ $t('coin-data.drawer.fetchInterval') }}</span>
              <ElTooltip
                :content="$t('coin-data.drawer.fetchIntervalTooltip')"
                placement="top"
              >
                <ElIcon class="ml-1 cursor-pointer">
                  <component :is="ElementPlusIconsVue.QuestionFilled" />
                </ElIcon>
              </ElTooltip>
            </div>
          </template>
          <ElInputNumber v-model="config.fetchInterval" class="w-full" />
        </ElFormItem>

        <ElFormItem>
          <template #label>
            <div class="flex items-center">
              <span>{{ $t('coin-data.drawer.metadataInterval') }}</span>
              <ElTooltip
                :content="$t('coin-data.drawer.metadataIntervalTooltip')"
                placement="top"
              >
                <ElIcon class="ml-1 cursor-pointer">
                  <component :is="ElementPlusIconsVue.QuestionFilled" />
                </ElIcon>
              </ElTooltip>
            </div>
          </template>
          <ElInputNumber v-model="config.metadataInterval" class="w-full" />
        </ElFormItem>
      </ElForm>
    </Drawer>
  </div>
</template>

<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { onMounted, reactive, ref, watch } from 'vue';

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
  ElMessage,
  ElOption,
  ElRow,
  ElSelect,
  ElTag,
  ElTooltip,
} from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { requestClient } from '#/api/request';

interface CoinMarketCap {
  coin_market_cap_api_key: string;
  fetch_limit: number;
  fetch_interval: number;
  metadata_interval: number;
}

function getCoinMarketCapConfig() {
  return requestClient.get<CoinMarketCap>('/information/coin-data/key');
}

function saveCoinMarketCapConfig(data: CoinMarketCap) {
  return requestClient.post('/information/coin-data/key', data);
}

function verifyCoinMarketCapApiKey(apiKey: string) {
  return requestClient.post('/information/coin-data/key/verify', {
    coin_market_cap_api_key: apiKey,
  });
}

const { t, locale } = useI18n();

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: handleSave,
});

function openSettingsDrawer() {
  drawerApi.open();
  drawerApi.setState({
    title: t('page.information.coindataPage.drawer.title'),
  });
}

const config = reactive<Partial<CoinMarketCap>>({
  coin_market_cap_api_key: '',
  fetch_limit: 5000,
  fetch_interval: 24,
  metadata_interval: 1,
});

const isVerifying = ref(false);

async function handleVerifyApiKey() {
  const apiKey = config.coin_market_cap_api_key;
  if (!apiKey) {
    ElMessage.error(t('page.information.coindataPage.drawer.apiKeyRequired'));
    return;
  }

  isVerifying.value = true;

  try {
    const coinMarketData = await verifyCoinMarketCapApiKey(apiKey);

    if (coinMarketData.status?.error_code === 0) {
      ElMessage.success(
        t('page.information.coindataPage.drawer.apiKeyVerified'),
      );
    } else {
      const message = coinMarketData.status?.error_message || 'Unknown error';
      ElMessage.error(
        t('page.information.coindataPage.drawer.apiKeyInvalid', { message }),
      );
    }
  } catch (error: any) {
    console.error('API key verification failed:', error);
    ElMessage.error(
      t('page.information.coindataPage.drawer.apiKeyVerificationFailed'),
    );
  } finally {
    isVerifying.value = false;
  }
}

async function handleSave() {
  try {
    await saveCoinMarketCapConfig(config as CoinMarketCap);
    ElMessage.success(t('page.information.coindataPage.drawer.settingsSaved'));
    drawerApi.close();
  } catch {
    ElMessage.error(t('page.information.coindataPage.drawer.saveFailed'));
  }
}

onMounted(async () => {
  const remoteConfig = await getCoinMarketCapConfig();
  if (remoteConfig) {
    Object.assign(config, remoteConfig);
  }
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
        title: t('page.information.coindataPage.table.id'),
        width: 80,
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'symbol',
        title: t('page.information.coindataPage.table.symbol'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'name',
        title: t('page.information.coindataPage.table.name'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'tags',
        title: t('page.information.coindataPage.table.tags'),
        width: 350,
        slots: { default: 'col-tags' },
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'price',
        title: t('page.information.coindataPage.table.price'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'volume_24h',
        title: t('page.information.coindataPage.table.volume24h'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'market_cap',
        title: t('page.information.coindataPage.table.marketCap'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'vol_mcap',
        title: t('page.information.coindataPage.table.volMcap'),
        sortable: true,
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'copy_trading',
        title: t('page.information.coindataPage.table.copyTrading'),
        slots: { default: 'col-copy_trading' },
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'notice',
        title: t('page.information.coindataPage.table.notice'),
        align: 'left',
        headerAlign: 'left',
      },
      {
        field: 'link',
        title: t('page.information.coindataPage.table.link'),
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
            {{ t('page.information.coindataPage.title') }}
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
              <ElFormItem :label="t('page.information.coindataPage.exchange')">
                <ElSelect
                  v-model="filters.exchange"
                  :placeholder="
                    t('page.information.coindataPage.selectPlaceholder')
                  "
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
                    <span>{{
                      t('page.information.coindataPage.marketCapLabel')
                    }}</span>
                    <ElTooltip
                      :content="
                        t('page.information.coindataPage.marketCapTooltip')
                      "
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
                    <span>{{
                      t('page.information.coindataPage.volMcapLabel')
                    }}</span>
                    <ElTooltip
                      :content="
                        t('page.information.coindataPage.volMcapTooltip')
                      "
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
              <ElFormItem :label="t('page.information.coindataPage.tags')">
                <ElSelect
                  v-model="filters.tags"
                  multiple
                  :placeholder="
                    t('page.information.coindataPage.tagsPlaceholder')
                  "
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
    <Drawer class="w-1/2" :show-footer="true">
      <ElForm :model="config" label-position="right" label-width="200px">
        <ElFormItem>
          <template #label>
            <div class="flex items-center justify-end">
              <span>{{
                $t('page.information.coindataPage.drawer.apiKey')
              }}</span>
              <ElTooltip
                :content="
                  $t('page.information.coindataPage.drawer.apiKeyTooltip')
                "
                placement="top"
              >
                <ElIcon class="ml-1 cursor-pointer">
                  <component :is="ElementPlusIconsVue.QuestionFilled" />
                </ElIcon>
              </ElTooltip>
            </div>
          </template>
          <div class="flex w-full items-center">
            <ElInput
              v-model="config.coin_market_cap_api_key"
              show-password
              type="password"
            />
            <ElButton
              :loading="isVerifying"
              class="ml-2"
              @click="handleVerifyApiKey"
            >
              {{ $t('page.information.coindataPage.drawer.verify') }}
            </ElButton>
          </div>
        </ElFormItem>

        <ElFormItem>
          <template #label>
            <div class="flex items-center justify-end">
              <span>{{
                $t('page.information.coindataPage.drawer.fetchLimit')
              }}</span>
              <ElTooltip
                :content="
                  $t('page.information.coindataPage.drawer.fetchLimitTooltip')
                "
                placement="top"
              >
                <ElIcon class="ml-1 cursor-pointer">
                  <component :is="ElementPlusIconsVue.QuestionFilled" />
                </ElIcon>
              </ElTooltip>
            </div>
          </template>
          <ElInputNumber v-model="config.fetch_limit" class="w-full" />
        </ElFormItem>

        <ElFormItem>
          <template #label>
            <div class="flex items-center justify-end">
              <span>{{
                $t('page.information.coindataPage.drawer.fetchInterval')
              }}</span>
              <ElTooltip
                :content="
                  $t(
                    'page.information.coindataPage.drawer.fetchIntervalTooltip',
                  )
                "
                placement="top"
              >
                <ElIcon class="ml-1 cursor-pointer">
                  <component :is="ElementPlusIconsVue.QuestionFilled" />
                </ElIcon>
              </ElTooltip>
            </div>
          </template>
          <ElInputNumber v-model="config.fetch_interval" class="w-full" />
        </ElFormItem>

        <ElFormItem>
          <template #label>
            <div class="flex items-center justify-end">
              <span>{{
                $t('page.information.coindataPage.drawer.metadataInterval')
              }}</span>
              <ElTooltip
                :content="
                  $t(
                    'page.information.coindataPage.drawer.metadataIntervalTooltip',
                  )
                "
                placement="top"
              >
                <ElIcon class="ml-1 cursor-pointer">
                  <component :is="ElementPlusIconsVue.QuestionFilled" />
                </ElIcon>
              </ElTooltip>
            </div>
          </template>
          <ElInputNumber v-model="config.metadata_interval" class="w-full" />
        </ElFormItem>
      </ElForm>
    </Drawer>
  </div>
</template>

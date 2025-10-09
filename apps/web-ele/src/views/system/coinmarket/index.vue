<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import type { CoinMarketCap } from '#/api/system/coinmarket';

import { onMounted } from 'vue';

import { Page } from '@vben/common-ui';
import { useI18n } from '@vben/locales';

import { ElCard } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import {
  getCoinMarketCapConfig,
  saveCoinMarketCapConfig,
} from '#/api/system/coinmarket';

defineOptions({
  name: 'SystemCoinMarket',
});

const { t } = useI18n();

const schemas: VbenFormSchema[] = [
  {
    component: 'VbenInputPassword',
    fieldName: 'coin_market_cap_api_key',
    label: t('page.system.coinmarketPage.api_key'),
    help: t('page.system.coinmarketPage.api_key_help'),
  },
  {
    component: 'InputNumber',
    fieldName: 'fetch_limit',
    label: t('page.system.coinmarketPage.fetch_limit'),
    help: t('page.system.coinmarketPage.fetch_limit_help'),
  },
  {
    component: 'InputNumber',
    fieldName: 'fetch_interval',
    label: t('page.system.coinmarketPage.fetch_interval'),
    help: t('page.system.coinmarketPage.fetch_interval_help'),
  },
  {
    component: 'InputNumber',
    fieldName: 'metadata_interval',
    label: t('page.system.coinmarketPage.metadata_interval'),
    help: t('page.system.coinmarketPage.metadata_interval_help'),
  },
];

const [Form, formApi] = useVbenForm({
  schema: schemas,
  showDefaultActions: true,
  submitButtonOptions: {
    buttonText: t('page.system.coinmarketPage.save_changes'),
  },
  handleSubmit: async (values) => {
    await saveCoinMarketCapConfig(values as CoinMarketCap);
  },
  // Set layout to vertical
  layout: 'vertical',
});

onMounted(async () => {
  const config = await getCoinMarketCapConfig();
  formApi.setValues(config);
});
</script>

<template>
  <Page>
    <ElCard class="mt-5">
      <template #header>
        <div class="text-lg font-medium">
          {{ t('page.system.coinmarketPage.title') }}
        </div>
      </template>
      <div class="mx-auto max-w-2xl p-4">
        <Form />
      </div>
    </ElCard>
  </Page>
</template>

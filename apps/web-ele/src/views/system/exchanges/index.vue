<script setup lang="ts">
import type {
  ExtendedFormApi as VbenFormApi,
  VbenFormSchema,
} from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, onMounted, reactive, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';

import { ElButton, ElCard } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  createApiKeyApi,
  deleteApiKeyApi,
  getApiKeysApi,
  updateApiKeyApi,
} from '#/api/system/exchange';

defineOptions({
  name: 'SystemExchanges',
});

interface ApiKey {
  id: number;
  exchange: string;
  exchangeCategory: string;
  accountName: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  status: 'active' | 'inactive' | null;
  createdAt: string;
  lastUpdatedAt: string;
}

const modalTitle = ref('');
const { t } = useI18n();
const editingId = ref<null | number>(null);

function generateRandomString(length: number): string {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// 交易所数据
const exchangeCategories = {
  crypto: {
    label: t('page.system.exchange.cryptoCurrency'),
    exchanges: [
      {
        label: t('page.system.exchange.binanceFutures'),
        value: 'binance_futures',
      },
      { label: t('page.system.exchange.binanceSpot'), value: 'binance_spot' },
      { label: t('page.system.exchange.bybitFutures'), value: 'bybit_futures' },
      { label: t('page.system.exchange.bybitSpot'), value: 'bybit_spot' },
      {
        label: t('page.system.exchange.bitgetFutures'),
        value: 'bitget_futures',
      },
      { label: t('page.system.exchange.bitgetSpot'), value: 'bitget_spot' },
      { label: t('page.system.exchange.okxFutures'), value: 'okx_futures' },
      { label: t('page.system.exchange.okxSpot'), value: 'okx_spot' },
      {
        label: t('page.system.exchange.gateioFutures'),
        value: 'gateio_futures',
      },
      { label: t('page.system.exchange.gateioSpot'), value: 'gateio_spot' },
      {
        label: t('page.system.exchange.kucoinFutures'),
        value: 'kucoin_futures',
      },
      { label: t('page.system.exchange.kucoinSpot'), value: 'kucoin_spot' },
      { label: t('page.system.exchange.hyperliquid'), value: 'hyperliquid' },
    ],
  },
  // futu: {
  //   label: t('page.system.exchange.futuSecurities'),
  //   exchanges: [
  //     { label: t('page.system.exchange.futuSecurities'), value: 'futu' },
  //   ],
  // },
  // ibkr: {
  //   label: t('page.system.exchange.interactiveBrokers'),
  //   exchanges: [
  //     { label: t('page.system.exchange.interactiveBrokers'), value: 'ibkr' },
  //   ],
  // },
  // generic: {
  //   label: t('page.system.exchange.genericProtocol'),
  //   exchanges: [
  //     { label: t('page.system.exchange.genericProtocol'), value: 'generic' },
  //   ],
  // },
};
type ExchangeCategories = typeof exchangeCategories;

let formApi: VbenFormApi;

const exchangeLabelMap = new Map(
  Object.values(exchangeCategories)
    .flatMap((category) => category.exchanges)
    .map((exchange) => [exchange.value, exchange.label]),
);

const getExchangeLabel = (value: string) =>
  exchangeLabelMap.get(value) || value;

const exchangeCategoryLabelMap = new Map(
  Object.entries(exchangeCategories).map(([value, { label }]) => [
    value,
    label,
  ]),
);

const getExchangeCategoryLabel = (value: string) =>
  exchangeCategoryLabelMap.get(value) || value;

// 表单schemas
const formSchemas: VbenFormSchema[] = [
  {
    component: 'Input',
    fieldName: 'id',
    hide: true,
  },
  {
    component: 'Select',
    fieldName: 'exchangeCategory',
    label: t('page.system.exchange.selectProtocol'),
    defaultValue: 'crypto',
    labelWidth: 100,
    componentProps: {
      placeholder: t('page.system.exchange.cryptoCurrency'),
      options: Object.entries(exchangeCategories).map(([value, { label }]) => ({
        label,
        value,
      })),
      onChange: (value: string) => {
        const category = value as keyof ExchangeCategories;
        const newOptions = category
          ? exchangeCategories[category].exchanges
          : [];

        const defaultExchange =
          category === 'crypto' ? 'binance_futures' : newOptions[0]?.value;
        const selectedOption = newOptions.find(
          (o) => o.value === defaultExchange,
        );

        formApi.setValues({
          exchange: defaultExchange,
          accountName: `${selectedOption?.label}-${generateRandomString(6)}`,
        });
        formApi.updateSchema([
          {
            fieldName: 'exchange',
            componentProps: {
              options: newOptions,
              disabled: !category,
            },
          },
        ]);
      },
    },
    rules: 'required',
    labelClass: 'required-label',
  },
  {
    component: 'Select',
    fieldName: 'exchange',
    label: t('page.system.exchange.selectExchange'),
    labelWidth: 100,
    componentProps: {
      placeholder: t('page.system.exchange.binanceFutures'),
      options: exchangeCategories.crypto.exchanges, // Initial options
      defaultValue: 'binance_futures',
      onChange: async (value: string) => {
        const formModel = await formApi.getValues();
        const category =
          (formModel.exchangeCategory as keyof ExchangeCategories) || 'crypto';
        const options = category ? exchangeCategories[category].exchanges : [];
        const selectedOption = options.find((o) => o.value === value);
        if (selectedOption) {
          formApi.setValues({
            accountName: `${selectedOption.label}-${generateRandomString(6)}`,
          });
        }

        const showPassphrase = [
          'bitget_futures',
          'bitget_spot',
          'kucoin_futures',
          'kucoin_spot',
          'okx_futures',
          'okx_spot',
        ].includes(value);

        formApi.updateSchema([
          {
            fieldName: 'passphrase',
            hide: !showPassphrase,
          },
        ]);
      },
    },
    rules: 'required',
    labelClass: 'required-label',
  },
  {
    component: 'Input',
    fieldName: 'apiKey',
    label: t('page.system.exchange.accessKey'),
    labelWidth: 100,
    componentProps: {
      placeholder: t('page.system.exchange.accessKey'),
      type: 'password',
      showPassword: true,
      slots: {
        'label-suffix': () =>
          h('span', {
            class: 'icon-[ant-design--question-circle-outlined] ml-1',
          }),
      },
    },
    rules: 'required',
    labelClass: 'required-label',
  },
  {
    component: 'Input',
    fieldName: 'apiSecret',
    label: t('page.system.exchange.secretKey'),
    labelWidth: 100,
    componentProps: {
      placeholder: t('page.system.exchange.secretKey'),
      type: 'password',
      showPassword: true,
      slots: {
        'label-suffix': () =>
          h('span', {
            class: 'icon-[ant-design--question-circle-outlined] ml-1',
          }),
      },
    },
    rules: 'required',
    labelClass: 'required-label',
  },
  {
    component: 'Input',
    fieldName: 'passphrase',
    label: t('page.system.exchange.passphrase'),
    labelWidth: 100,
    hide: true,
    componentProps: {
      placeholder: t('page.system.exchange.passphrase'),
      type: 'password',
      showPassword: true,
    },
    rules: 'required',
    labelClass: 'required-label',
  },
  {
    component: 'Input',
    fieldName: 'accountName',
    label: t('page.system.exchange.accountName'),
    labelWidth: 100,
    componentProps: {
      placeholder: t('page.system.exchange.enterAccountName'),
    },
    rules: 'required',
    labelClass: 'required-label',
  },
];

const [Form, formApiInstance] = useVbenForm({
  schema: formSchemas,
  showDefaultActions: false,
  // layout: 'horizontal',
  commonConfig: {
    colon: true,
    // labelWidth: 120,
  },
});
formApi = formApiInstance;

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: async () => {
    try {
      const { valid } = await formApi.validate();
      if (!valid) {
        return;
      }
      const values = await formApi.getValues();
      await (editingId.value
        ? updateApiKeyApi(editingId.value, values)
        : createApiKeyApi(
            values as Omit<
              ApiKey,
              'createdAt' | 'id' | 'lastUpdatedAt' | 'status'
            >,
          ));
      await loadData();
      drawerApi.close();
    } catch (error) {
      console.error(error);
    }
  },
});

const gridData = reactive<ApiKey[]>([]);

function handleAdd() {
  editingId.value = null;
  formApi.resetForm();
  formApi.setValues({
    exchangeCategory: 'crypto',
    exchange: 'binance_futures',
    accountName: `${t('page.system.exchange.binanceFutures')}-${generateRandomString(6)}`,
  });
  formApi.updateSchema([
    {
      fieldName: 'passphrase',
      hide: true,
    },
  ]);
  modalTitle.value = t('page.system.exchange.addExchange');
  drawerApi.setState({ title: modalTitle.value });
  drawerApi.open();
}

function handleEdit(row: ApiKey) {
  editingId.value = row.id;
  formApi.setValues(row);
  const showPassphrase = [
    'bitget_futures',
    'bitget_spot',
    'kucoin_futures',
    'kucoin_spot',
    'okx_futures',
    'okx_spot',
  ].includes(row.exchange);
  formApi.updateSchema([
    {
      fieldName: 'passphrase',
      hide: !showPassphrase,
    },
  ]);
  modalTitle.value = t('page.system.exchange.editApiKey');
  drawerApi.setState({ title: modalTitle.value });
  drawerApi.open();
}

async function handleDelete(row: ApiKey) {
  try {
    await deleteApiKeyApi(row.id);
    await loadData();
  } catch (error) {
    console.error(error);
  }
}

function handleTrade(row: ApiKey) {
  console.warn('trade', row);
}
const gridOptions: VxeGridProps<ApiKey> = {
  columns: [
    {
      field: 'accountName',
      title: t('page.system.exchange.accountName'),
      align: 'left',
      headerAlign: 'left',
      sortable: true,
    },
    {
      field: 'exchangeCategory',
      title: t('page.system.exchange.category'),
      align: 'left',
      headerAlign: 'left',
      sortable: true,
      slots: {
        default: 'col-exchange-category',
      },
    },
    {
      field: 'exchange',
      slots: {
        default: 'col-exchange',
      },
      title: t('page.system.exchange.exchange'),
      align: 'left',
      headerAlign: 'left',
      sortable: true,
    },
    {
      field: 'createdAt',
      title: t('page.system.exchange.createdAt'),
      align: 'left',
      headerAlign: 'left',
      sortable: true,
    },
    {
      field: 'lastUpdatedAt',
      title: t('page.system.exchange.lastUpdatedAt'),
      align: 'left',
      headerAlign: 'left',
      sortable: true,
    },
    {
      width: 200,
      fixed: 'right',
      title: t('page.system.exchange.operation'),
      slots: {
        default: 'col-action',
      },
      align: 'center',
      headerAlign: 'center',
    },
  ],
  data: gridData,
};

const [Grid] = useVbenVxeGrid({
  gridOptions,
});
async function loadData() {
  try {
    const data = await getApiKeysApi();
    gridData.length = 0;
    gridData.push(...data);
  } catch (error) {
    console.error(error);
  }
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <Page>
    <ElCard class="mt-5" :title="t('page.system.exchange.exchangeList')">
      <template #header>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-medium">
              {{ t('page.system.exchanges') }}
            </div>
            <div class="text-sm text-gray-500">
              {{ t('page.system.exchange.manageApiCredentials') }}
            </div>
          </div>
          <ElButton type="primary" @click="handleAdd">
            + {{ t('page.system.exchange.addApiKey') }}
          </ElButton>
        </div>
      </template>
      <template #default>
        <Grid>
          <template #col-exchange="{ row }">
            <div class="flex items-center gap-2">
              <span>{{ getExchangeLabel(row.exchange) }}</span>
            </div>
          </template>
          <template #col-exchange-category="{ row }">
            <span>{{ getExchangeCategoryLabel(row.exchangeCategory) }}</span>
          </template>
          <template #col-action="{ row }">
            <div class="flex items-center justify-center gap-2 text-base">
              <ElButton link type="danger" @click="handleDelete(row)">
                {{ t('page.system.exchange.delete') }}
              </ElButton>
              <ElButton link type="primary" @click="handleEdit(row)">
                {{ t('page.system.exchange.edit') }}
              </ElButton>
              <ElButton link type="success" @click="handleTrade(row)">
                {{ t('page.system.exchange.trade') }}
              </ElButton>
            </div>
          </template>
        </Grid>
      </template>
    </ElCard>

    <Drawer class="w-1/2">
      <Form />
    </Drawer>
  </Page>
</template>

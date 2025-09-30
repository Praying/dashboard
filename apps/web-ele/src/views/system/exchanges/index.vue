<script setup lang="ts">
import type {
  ExtendedFormApi as VbenFormApi,
  VbenFormSchema,
} from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, reactive, ref } from 'vue';

import { Page, useVbenDrawer } from '@vben/common-ui';
import { useI18n } from '@vben/locales';

import { ElButton, ElCard } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

defineOptions({
  name: 'SystemExchanges',
});

interface ApiKey {
  id: number;
  exchange: string;
  accountType: 'futures' | 'spot';
  accountName: string;
  apiKey: string;
  status: 'active' | 'inactive';
  lastUsed: string;
  protocolType?: string;
  protocolVersion?: string;
  exchangeName?: string;
}

const modalTitle = ref('');
const { t } = useI18n();

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
      { label: t('page.system.exchange.okxFutures'), value: 'okx_futures' },
      { label: t('page.system.exchange.okxSpot'), value: 'okx_spot' },
      { label: t('page.system.exchange.bybitFutures'), value: 'bybit_futures' },
      { label: t('page.system.exchange.bybitSpot'), value: 'bybit_spot' },
      { label: t('page.system.exchange.bitfinex'), value: 'bitfinex' },
      { label: t('page.system.exchange.htxFutures'), value: 'htx_futures' },
    ],
  },
  futu: {
    label: t('page.system.exchange.futuSecurities'),
    exchanges: [
      { label: t('page.system.exchange.futuSecurities'), value: 'futu' },
    ],
  },
  ibkr: {
    label: t('page.system.exchange.interactiveBrokers'),
    exchanges: [
      { label: t('page.system.exchange.interactiveBrokers'), value: 'ibkr' },
    ],
  },
  generic: {
    label: t('page.system.exchange.genericProtocol'),
    exchanges: [
      { label: t('page.system.exchange.genericProtocol'), value: 'generic' },
    ],
  },
};
type ExchangeCategories = typeof exchangeCategories;

// 表单schemas
const formSchemas: VbenFormSchema[] = [
  {
    component: 'Select',
    fieldName: 'exchangeCategory',
    label: t('page.system.exchange.selectProtocol'),
    componentProps: {
      placeholder: t('page.system.exchange.cryptoCurrency'),
      options: Object.entries(exchangeCategories).map(([value, { label }]) => ({
        label,
        value,
      })),
      onChange: (
        value: string,
        { formApi }: { formApi: VbenFormApi; formModel: Recordable<any> },
      ) => {
        const category = value as keyof ExchangeCategories;
        const newOptions = category
          ? exchangeCategories[category].exchanges
          : [];
        formApi.setValues({ exchange: undefined, accountName: undefined });
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
    componentProps: {
      placeholder: t('page.system.exchange.binanceFutures'),
      options: exchangeCategories.crypto.exchanges, // Initial options
      defaultValue: 'binance_futures',
      onChange: (
        value: string,
        {
          formApi,
          formModel,
        }: { formApi: VbenFormApi; formModel: Recordable<any> },
      ) => {
        const category =
          (formModel.exchangeCategory as keyof ExchangeCategories) || 'crypto';
        const options = category ? exchangeCategories[category].exchanges : [];
        const selectedOption = options.find((o) => o.value === value);
        if (selectedOption) {
          formApi.setValues({ accountName: selectedOption.label });
        }
      },
    },
    rules: 'required',
    labelClass: 'required-label',
  },
  {
    component: 'Input',
    fieldName: 'apiKey',
    label: t('page.system.exchange.accessKey'),
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
    fieldName: 'accountName',
    label: t('page.system.exchange.label'),
    componentProps: {
      placeholder: t('page.system.exchange.binanceFutures'),
    },
    rules: 'required',
    labelClass: 'required-label',
  },
];

const [Form, formApi] = useVbenForm({
  schema: formSchemas,
  showDefaultActions: false,
  layout: 'horizontal',
  commonConfig: {
    colon: true,
    labelWidth: 120,
  },
});

const [Drawer, drawerApi] = useVbenDrawer({
  onConfirm: () => {
    // TODO: Add submit logic
    drawerApi.close();
  },
});

const gridData = reactive<ApiKey[]>([
  {
    id: 1,
    exchange: 'Huobi',
    accountType: 'spot',
    accountName: 'Huobi',
    apiKey: 'huobi_******************',
    status: 'active',
    lastUsed: '2021-02-05 15:53:36',
    exchangeName: 'HTX',
  },
  {
    id: 2,
    exchange: 'Binance',
    accountType: 'spot',
    accountName: 'Binance',
    apiKey: 'binance_******************',
    status: 'active',
    lastUsed: '2022-06-22 19:56:36',
    exchangeName: '币安现货',
  },
]);

function handleAdd() {
  formApi.resetForm();
  modalTitle.value = t('page.system.exchange.addExchange');
  drawerApi.setState({ title: modalTitle.value });
  drawerApi.open();
}

function handleEdit(row: ApiKey) {
  formApi.setValues(row);
  modalTitle.value = t('page.system.exchange.editApiKey');
  drawerApi.setState({ title: modalTitle.value });
  drawerApi.open();
}

function handleDelete(row: ApiKey) {
  console.warn('delete', row);
}

function handleTrade(row: ApiKey) {
  console.warn('trade', row);
}
const gridOptions: VxeGridProps<ApiKey> = {
  columns: [
    {
      field: 'exchange',
      slots: {
        default: 'col-exchange',
      },
      title: t('page.system.exchange.name'),
      align: 'left',
      headerAlign: 'left',
      sortable: true,
    },
    {
      field: 'accountName',
      title: t('page.system.exchange.apiName'),
      align: 'left',
      headerAlign: 'left',
      sortable: true,
    },
    {
      field: 'exchangeName',
      title: t('page.system.exchange.exchangeName'),
      align: 'left',
      headerAlign: 'left',
      sortable: true,
    },
    {
      field: 'lastUsed',
      title: t('page.system.exchange.date'),
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
              <span
                v-if="row.exchange === 'Huobi'"
                class="icon-[logos:huobi] text-2xl"
              ></span>
              <span
                v-if="row.exchange === 'Binance'"
                class="icon-[logos:binance] text-2xl"
              ></span>
              <span>{{ row.exchange }}</span>
            </div>
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

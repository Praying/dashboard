<script setup lang="ts">
import type {
  ExtendedFormApi as VbenFormApi,
  VbenFormSchema,
} from '@vben/common-ui';
import type { Recordable } from '@vben/types';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { h, reactive, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
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
    label: '加密货币',
    exchanges: [
      { label: '币安期货', value: 'binance_futures' },
      { label: '币安现货', value: 'binance_spot' },
      { label: 'OKX期货', value: 'okx_futures' },
      { label: 'OKX现货', value: 'okx_spot' },
      { label: 'Bybit期货', value: 'bybit_futures' },
      { label: 'Bybit现货', value: 'bybit_spot' },
      { label: 'Bitfinex', value: 'bitfinex' },
      { label: 'HTX期货', value: 'htx_futures' },
    ],
  },
  futu: {
    label: '富途证券',
    exchanges: [{ label: '富途证券', value: 'futu' }],
  },
  ibkr: {
    label: '盈透证券',
    exchanges: [{ label: '盈透证券', value: 'ibkr' }],
  },
  generic: {
    label: '通用协议',
    exchanges: [{ label: '通用协议', value: 'generic' }],
  },
};
type ExchangeCategories = typeof exchangeCategories;

// 表单schemas
const formSchemas: VbenFormSchema[] = [
  {
    component: 'Select',
    fieldName: 'exchangeCategory',
    label: '选择协议',
    componentProps: {
      placeholder: '加密货币',
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
  },
  {
    component: 'Select',
    fieldName: 'exchange',
    label: '选择交易所',
    componentProps: {
      placeholder: '币安期货',
      options: exchangeCategories.crypto.exchanges, // Initial options
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
  },
  {
    component: 'Input',
    fieldName: 'apiKey',
    label: 'Access Key',
    componentProps: {
      placeholder: 'Access Key',
      slots: {
        'label-suffix': () =>
          h('span', {
            class: 'icon-[ant-design--question-circle-outlined] ml-1',
          }),
      },
    },
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'apiSecret',
    label: 'Secret Key',
    componentProps: {
      placeholder: 'Secret Key',
      slots: {
        'label-suffix': () =>
          h('span', {
            class: 'icon-[ant-design--question-circle-outlined] ml-1',
          }),
      },
    },
    rules: 'required',
  },
  {
    component: 'Input',
    fieldName: 'accountName',
    label: '标签',
    componentProps: {
      placeholder: '币安期货',
    },
    rules: 'required',
  },
];

const [Form, formApi] = useVbenForm({
  schema: formSchemas,
  showDefaultActions: false,
  layout: 'horizontal',
});

const [Modal, modalApi] = useVbenModal({
  onCancel: () => {
    modalApi.close();
  },
  onConfirm: async () => {
    try {
      await formApi.validate();
      const values = await formApi.getValues();
      console.warn('form values:', values);
      modalApi.close();
    } catch (error) {
      console.error(error);
    }
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
  modalTitle.value = '添加交易所';
  modalApi.open();
}

function handleEdit(row: ApiKey) {
  formApi.setValues(row);
  modalTitle.value = t('page.system.exchange.editApiKey');
  modalApi.open();
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
      title: '名称',
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'accountName',
      title: 'API Name',
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'exchangeName',
      title: '交易所名称',
      align: 'left',
      headerAlign: 'left',
    },
    {
      field: 'lastUsed',
      title: '日期',
      align: 'left',
      headerAlign: 'left',
    },
    {
      width: 200,
      fixed: 'right',
      title: '操作项',
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
  <Page title="交易所" description="管理您的交易所 API 凭据">
    <template #extra>
      <ElButton type="primary" @click="handleAdd"> + 添加 API 密钥 </ElButton>
    </template>
    <ElCard class="mt-3" title="交易所列表">
      <template #default>
        <Grid>
          <template #col-exchange="{ row }">
            <div class="flex items-center gap-2">
              <span
                v-if="row.exchange === 'Huobi'"
                class="icon-[logos--huobi] text-2xl"
              ></span>
              <span
                v-if="row.exchange === 'Binance'"
                class="icon-[logos--binance] text-2xl"
              ></span>
              <span>{{ row.exchange }}</span>
            </div>
          </template>
          <template #col-action="{ row }">
            <div class="flex items-center justify-center gap-2 text-base">
              <ElButton link type="danger" @click="handleDelete(row)">
                删除
              </ElButton>
              <ElButton link type="primary" @click="handleEdit(row)">
                编辑
              </ElButton>
              <ElButton link type="success" @click="handleTrade(row)">
                交易
              </ElButton>
            </div>
          </template>
        </Grid>
      </template>
    </ElCard>

    <Modal v-model:title="modalTitle">
      <div class="flex flex-col gap-5">
        <Form />
      </div>
    </Modal>
  </Page>
</template>

<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { useVbenForm } from '#/adapter/form';

const schemas: VbenFormSchema[] = [
  {
    component: 'Select',
    fieldName: 'exchanges',
    label: 'Exchanges',
    wrapperClass: 'col-span-8',
    componentProps: {
      multiple: true,
      filterable: true,
      allowCreate: true,
      placeholder: 'Choose exchanges',
    },
  },
  {
    component: 'Input',
    fieldName: 'backtest_name',
    label: 'Backtest Name',
    wrapperClass: 'col-span-8',
  },
  {
    component: 'DatePicker',
    fieldName: 'start_date',
    label: 'start_date',
    wrapperClass: 'col-span-4',
  },
  {
    component: 'DatePicker',
    fieldName: 'end_date',
    label: 'end_date',
    wrapperClass: 'col-span-4',
  },
  {
    component: 'InputNumber',
    fieldName: 'starting_balance',
    label: 'starting_balance',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'InputNumber',
    fieldName: 'minimum_coin_age_days',
    label: 'minimum_coin_age_days',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'InputNumber',
    fieldName: 'gap_tolerance_ohlcvs_minutes',
    label: 'gap_tolerance_ohlcvs_minutes',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'Checkbox',
    fieldName: 'combine_ohlcvs',
    wrapperClass: 'col-span-3',
    renderComponentContent: () => ({
      default: () => 'combine_ohlcvs',
    }),
  },
  {
    component: 'Checkbox',
    fieldName: 'use_btc_collateral',
    wrapperClass: 'col-span-3',
    renderComponentContent: () => ({
      default: () => 'use_btc_collateral',
    }),
  },
  {
    component: 'Checkbox',
    fieldName: 'compress_cache',
    wrapperClass: 'col-span-3',
    renderComponentContent: () => ({
      default: () => 'compress_cache',
    }),
  },
  {
    component: 'InputNumber',
    fieldName: 'market_cap',
    label: 'market_cap',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'InputNumber',
    fieldName: 'vol_mcap',
    label: 'vol/mcap',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'Select',
    fieldName: 'tags',
    label: 'tags',
    wrapperClass: 'col-span-6',
    componentProps: {
      multiple: true,
      filterable: true,
      allowCreate: true,
      placeholder: 'Choose tags',
    },
  },
  {
    component: 'Checkbox',
    fieldName: 'only_cpt',
    wrapperClass: 'col-span-2',
    renderComponentContent: () => ({
      default: () => 'only_cpt',
    }),
  },
  {
    component: 'Checkbox',
    fieldName: 'notices_ignore',
    wrapperClass: 'col-span-2',
    renderComponentContent: () => ({
      default: () => 'notices_ignore',
    }),
  },
  {
    component: 'Checkbox',
    fieldName: 'apply_filters',
    wrapperClass: 'col-span-2',
    renderComponentContent: () => ({
      default: () => 'apply_filters',
    }),
  },
  {
    component: 'Select',
    fieldName: 'approved_coins_long',
    label: 'approved_coins_long',
    wrapperClass: 'col-span-12',
    componentProps: {
      multiple: true,
      filterable: true,
      allowCreate: true,
    },
  },
  {
    component: 'Select',
    fieldName: 'approved_coins_short',
    label: 'approved_coins_short',
    wrapperClass: 'col-span-12',
    componentProps: {
      multiple: true,
      filterable: true,
      allowCreate: true,
    },
  },
  {
    component: 'Select',
    fieldName: 'ignored_symbols_long',
    label: 'ignored_symbols_long',
    wrapperClass: 'col-span-12',
    componentProps: {
      multiple: true,
      filterable: true,
      allowCreate: true,
    },
  },
  {
    component: 'Select',
    fieldName: 'ignored_symbols_short',
    label: 'ignored_symbols_short',
    wrapperClass: 'col-span-12',
    componentProps: {
      multiple: true,
      filterable: true,
      allowCreate: true,
    },
  },
  {
    component: 'Divider',
    fieldName: 'divider_coin_overrides',
    label: 'Coin Overrides',
    wrapperClass: 'col-span-24',
  },
  {
    component: 'InputNumber',
    fieldName: 'long_twe',
    label: 'long twe',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'InputNumber',
    fieldName: 'long_positions',
    label: 'long positions',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'InputNumber',
    fieldName: 'short_twe',
    label: 'short twe',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'InputNumber',
    fieldName: 'short_positions',
    label: 'short positions',
    wrapperClass: 'col-span-6',
  },
  {
    component: 'CodeEditor',
    fieldName: 'long_config',
    label: 'long',
    wrapperClass: 'col-span-12',
    componentProps: {
      height: 300,
      language: 'json',
    },
  },
  {
    component: 'CodeEditor',
    fieldName: 'short_config',
    label: 'short',
    wrapperClass: 'col-span-12',
    componentProps: {
      height: 300,
      language: 'json',
    },
  },
];

const [Form] = useVbenForm({
  schema: schemas,
  wrapperClass: 'grid grid-cols-24 gap-4',
});
</script>

<template>
  <div class="p-4">
    <Form />
  </div>
</template>

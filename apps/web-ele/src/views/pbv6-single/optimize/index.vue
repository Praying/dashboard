<script lang="ts" setup>
import { ElEmpty } from 'element-plus';

import { $t } from '#/locales';
</script>

<template>
  <div class="flex-col-center h-full">
    <ElEmpty :description="$t('common.noData')" />
  </div>
</template>

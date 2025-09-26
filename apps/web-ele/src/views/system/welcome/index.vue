<script lang="ts" setup>
import { computed } from 'vue';

import { Page } from '@vben/common-ui';
import { ArrowUp, BookOpenText, CircleHelp, Square } from '@vben/icons';

import { ElCard, ElCol, ElDivider, ElRow, ElStatistic } from 'element-plus';

import { $t } from '#/locales';

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return $t('page.system.welcomePage.night');
  if (hour < 9) return $t('page.system.welcomePage.morning');
  if (hour < 12) return $t('page.system.welcomePage.forenoon');
  if (hour < 14) return $t('page.system.welcomePage.noon');
  if (hour < 17) return $t('page.system.welcomePage.afternoon');
  if (hour < 19) return $t('page.system.welcomePage.evening');
  return $t('page.system.welcomePage.night');
});

const quickActions = [
  {
    title: $t('page.system.welcomePage.gettingStarted'),
    icon: ArrowUp,
    color: 'text-blue-500',
  },
  {
    title: $t('page.system.welcomePage.systemInfo'),
    icon: Square,
    color: 'text-green-500',
  },
  {
    title: $t('page.system.welcomePage.helpDocs'),
    icon: BookOpenText,
    color: 'text-purple-500',
  },
  {
    title: $t('page.system.welcomePage.help'),
    icon: CircleHelp,
    color: 'text-red-500',
  },
];
</script>

<template>
  <Page :title="$t('page.system.welcomePage.title')">
    <div class="welcome-container p-6">
      <!-- Header -->
      <div class="mb-12 text-center">
        <h1 class="text-5xl font-extrabold text-gray-800">{{ greeting }}!</h1>
        <p class="mt-4 text-xl text-gray-500">
          {{ $t('page.system.welcomePage.message') }}
        </p>
      </div>

      <!-- Stats -->
      <ElRow :gutter="40" class="mb-12 text-center">
        <ElCol :span="8">
          <ElStatistic
            :title="$t('page.system.welcomePage.systemInfo')"
            :value="12"
          />
        </ElCol>
        <ElCol :span="8">
          <ElStatistic
            :title="$t('page.system.welcomePage.createNew')"
            :value="3"
          />
        </ElCol>
        <ElCol :span="8">
          <ElStatistic
            :title="$t('page.system.welcomePage.viewReports')"
            :value="8"
          />
        </ElCol>
      </ElRow>

      <ElDivider />

      <!-- Quick Actions -->
      <div class="mt-12">
        <h2 class="mb-6 text-center text-3xl font-bold text-gray-700">
          {{ $t('page.system.welcomePage.quickActions') }}
        </h2>
        <ElRow :gutter="20">
          <ElCol
            v-for="action in quickActions"
            :key="action.title"
            :xs="12"
            :sm="6"
            class="mb-4"
          >
            <ElCard
              shadow="hover"
              class="quick-action-card cursor-pointer p-6 text-center"
            >
              <component
                :is="action.icon"
                class="mb-4 size-12"
                :class="[action.color]"
              />
              <span class="text-lg font-semibold text-gray-600">{{
                action.title
              }}</span>
            </ElCard>
          </ElCol>
        </ElRow>
      </div>
    </div>
  </Page>
</template>

<style scoped>
.welcome-container {
  max-width: 1000px;
  padding: 40px;
  margin: auto;
  background-color: #f8f9fa;
  border-radius: 12px;
}

.quick-action-card {
  border-radius: 12px;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.quick-action-card:hover {
  box-shadow: 0 8px 25px rgb(0 0 0 / 10%);
  transform: translateY(-8px);
}
</style>

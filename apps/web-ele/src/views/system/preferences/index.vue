<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue';

import { Check } from '@element-plus/icons-vue';
import {
  ElButton,
  ElCard,
  ElForm,
  ElFormItem,
  ElIcon,
  ElInput,
  ElMessage,
  ElMessageBox,
} from 'element-plus';

import { $t } from '#/locales';

// Form data model
const formData = reactive({
  v6Path: '',
  v6Interpreter: '',
  v7Path: '',
  v7Interpreter: '',
});

// To store the initial state of the form data
const pristineData = ref('');

// Loading state for the save button
const isLoading = ref(false);

// Computed property to check if the form has unsaved changes
const isDirty = computed(() => {
  return JSON.stringify(formData) !== pristineData.value;
});

// Function to set the initial state
const setPristine = () => {
  pristineData.value = JSON.stringify(formData);
};

// Load initial data and set the pristine state when the component is mounted
onMounted(() => {
  // In a real app, you would fetch this data from an API
  formData.v6Path = '/tmp/pb6';
  formData.v6Interpreter = '/tmp/pb6/.venv/bin/python3';
  formData.v7Path = '/tmp/pb7';
  formData.v7Interpreter = '/tmp/pb7/.venv/bin/python3';

  setPristine();
});

// Handle the reset action
const handleReset = () => {
  ElMessageBox.confirm(
    $t('page.system.preferencesPage.resetConfirmMessage'),
    $t('page.system.preferencesPage.resetConfirmTitle'),
    {
      confirmButtonText: $t('common.ok'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning',
    },
  )
    .then(() => {
      // Restore form data from the pristine state
      const originalData = JSON.parse(pristineData.value);
      formData.v6Path = originalData.v6Path;
      formData.v6Interpreter = originalData.v6Interpreter;
      formData.v7Path = originalData.v7Path;
      formData.v7Interpreter = originalData.v7Interpreter;
      ElMessage({
        type: 'info',
        message: $t('page.system.preferencesPage.resetSuccessMessage'),
      });
    })
    .catch(() => {
      // User cancelled the action
    });
};

// Handle the save action
const handleSave = async () => {
  isLoading.value = true;
  try {
    // Simulate an API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // On success, update the pristine state
    setPristine();
    ElMessage({
      type: 'success',
      message: $t('page.system.preferencesPage.saveSuccessMessage'),
    });
  } catch {
    // On failure, show an error message
    ElMessage({
      type: 'error',
      message: $t('page.system.preferencesPage.saveErrorMessage'),
    });
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="space-y-4 p-4">
    <ElCard shadow="never">
      <template #header>
        <div class="card-header">
          <span class="text-lg font-bold">{{
            $t('page.system.preferencesPage.v6Settings')
          }}</span>
        </div>
      </template>
      <ElForm label-position="top" label-width="auto">
        <ElFormItem>
          <template #label>
            <span>{{ $t('page.system.preferencesPage.appPath') }}</span>
            <ElIcon color="green" class="ml-1"><Check /></ElIcon>
          </template>
          <ElInput v-model="formData.v6Path" :disabled="isLoading" />
        </ElFormItem>
        <ElFormItem>
          <template #label>
            <span>{{
              $t('page.system.preferencesPage.pythonInterpreterPath')
            }}</span>
            <ElIcon color="green" class="ml-1"><Check /></ElIcon>
          </template>
          <ElInput v-model="formData.v6Interpreter" :disabled="isLoading" />
        </ElFormItem>
      </ElForm>
    </ElCard>

    <ElCard shadow="never">
      <template #header>
        <div class="card-header">
          <span class="text-lg font-bold">{{
            $t('page.system.preferencesPage.v7Settings')
          }}</span>
        </div>
      </template>
      <ElForm label-position="top" label-width="auto">
        <ElFormItem>
          <template #label>
            <span>{{ $t('page.system.preferencesPage.appPath') }}</span>
            <ElIcon color="green" class="ml-1"><Check /></ElIcon>
          </template>
          <ElInput v-model="formData.v7Path" :disabled="isLoading" />
        </ElFormItem>
        <ElFormItem>
          <template #label>
            <span>{{
              $t('page.system.preferencesPage.pythonInterpreterPath')
            }}</span>
            <ElIcon color="green" class="ml-1"><Check /></ElIcon>
          </template>
          <ElInput v-model="formData.v7Interpreter" :disabled="isLoading" />
        </ElFormItem>
      </ElForm>
    </ElCard>

    <div class="flex justify-end">
      <ElButton :disabled="!isDirty || isLoading" @click="handleReset">
        {{ $t('page.system.preferencesPage.reset') }}
      </ElButton>
      <ElButton
        type="primary"
        :disabled="!isDirty"
        :loading="isLoading"
        @click="handleSave"
      >
        {{ $t('page.system.preferencesPage.saveChanges') }}
      </ElButton>
    </div>
  </div>
</template>

<style scoped></style>

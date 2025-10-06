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

import { getPreferencesApi, updatePreferencesApi } from '#/api/preferences';
import { $t } from '#/locales';

// Form data model
const formData = reactive({
  pbv6_path: '',
  pbv6_interpreter_path: '',
  pbv7_path: '',
  pbv7_interpreter_path: '',
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
onMounted(async () => {
  const data = await getPreferencesApi();
  formData.pbv6_path = data.pbv6_path;
  formData.pbv6_interpreter_path = data.pbv6_interpreter_path;
  formData.pbv7_path = data.pbv7_path;
  formData.pbv7_interpreter_path = data.pbv7_interpreter_path;

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
      formData.pbv6_path = originalData.pbv6_path;
      formData.pbv6_interpreter_path = originalData.pbv6_interpreter_path;
      formData.pbv7_path = originalData.pbv7_path;
      formData.pbv7_interpreter_path = originalData.pbv7_interpreter_path;
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
    await updatePreferencesApi(formData);

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
          <ElInput v-model="formData.pbv6_path" :disabled="isLoading" />
        </ElFormItem>
        <ElFormItem>
          <template #label>
            <span>{{
              $t('page.system.preferencesPage.pythonInterpreterPath')
            }}</span>
            <ElIcon color="green" class="ml-1"><Check /></ElIcon>
          </template>
          <ElInput
            v-model="formData.pbv6_interpreter_path"
            :disabled="isLoading"
          />
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
          <ElInput v-model="formData.pbv7_path" :disabled="isLoading" />
        </ElFormItem>
        <ElFormItem>
          <template #label>
            <span>{{
              $t('page.system.preferencesPage.pythonInterpreterPath')
            }}</span>
            <ElIcon color="green" class="ml-1"><Check /></ElIcon>
          </template>
          <ElInput
            v-model="formData.pbv7_interpreter_path"
            :disabled="isLoading"
          />
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

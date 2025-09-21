<template>
  <div class="backtest-create-view">
    <PageHeader
      :title="isEditing ? $t('backtest.editBacktest') : $t('backtest.createBacktest')"
      :description="isEditing ? $t('backtest.editDescription') : $t('backtest.createDescription')"
    />

    <el-card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-position="top"
        class="create-backtest-form"
      >
        <div class="form-section">
          <h3>{{ $t('backtest.basicInfo') }}</h3>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item :label="$t('backtest.form.name')" prop="name">
                <el-input
                  v-model="form.name"
                  :placeholder="$t('backtest.form.namePlaceholder')"
                  :disabled="isEditing"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('backtest.form.exchanges')" prop="exchanges">
                <el-select
                  v-model="form.exchanges"
                  multiple
                  :placeholder="$t('backtest.form.exchangesPlaceholder')"
                  style="width: 100%"
                >
                  <el-option :label="$t('backtest.exchanges.binance')" value="binance" />
                  <el-option :label="$t('backtest.exchanges.coinbase')" value="coinbase" />
                  <el-option :label="$t('backtest.exchanges.kraken')" value="kraken" />
                  <el-option :label="$t('backtest.exchanges.bitfinex')" value="bitfinex" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item :label="$t('backtest.form.startDate')" prop="start_date">
                <el-date-picker
                  v-model="form.start_date"
                  type="date"
                  :placeholder="$t('backtest.form.startDatePlaceholder')"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('backtest.form.endDate')" prop="end_date">
                <el-date-picker
                  v-model="form.end_date"
                  type="date"
                  :placeholder="$t('backtest.form.endDatePlaceholder')"
                  style="width: 100%"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item :label="$t('backtest.form.description')">
            <el-input
              v-model="form.description"
              type="textarea"
              :rows="3"
              :placeholder="$t('backtest.form.descriptionPlaceholder')"
            />
          </el-form-item>
        </div>

        <div class="form-section advanced-config">
          <h3>{{ $t('backtest.advancedConfiguration') }}</h3>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item :label="$t('backtest.form.initialBalance')">
                <el-input-number
                  v-model="form.initial_balance"
                  :min="0"
                  :precision="2"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('backtest.form.leverage')">
                <el-input-number
                  v-model="form.leverage"
                  :min="1"
                  :max="125"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item :label="$t('backtest.form.timeframe')">
                <el-select v-model="form.timeframe" style="width: 100%">
                  <el-option label="1m" value="1m" />
                  <el-option label="5m" value="5m" />
                  <el-option label="15m" value="15m" />
                  <el-option label="1h" value="1h" />
                  <el-option label="4h" value="4h" />
                  <el-option label="1d" value="1d" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('backtest.form.strategy')">
                <el-select v-model="form.strategy" style="width: 100%">
                  <el-option :label="$t('backtest.strategies.grid')" value="grid" />
                  <el-option :label="$t('backtest.strategies.meanReversion')" value="mean_reversion" />
                  <el-option :label="$t('backtest.strategies.momentum')" value="momentum" />
                  <el-option :label="$t('backtest.strategies.arbitrage')" value="arbitrage" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        
        <el-form-item class="form-actions">
          <el-button @click="handleCancel">{{ $t('common.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEditing ? $t('backtest.updateBacktest') : $t('backtest.createBacktest') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useBacktestStore } from '@/store/backtest'
import PageHeader from '@/components/PageHeader.vue'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()
const backtestStore = useBacktestStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

// Check if we're editing an existing backtest
const isEditing = computed(() => Boolean(route.params.name))

// Form data
const form = reactive({
  name: '',
  exchanges: [],
  start_date: '',
  end_date: '',
  description: '',
  initial_balance: 10000,
  leverage: 1,
  timeframe: '1h',
  strategy: 'grid'
})

// Form validation rules
const rules: FormRules = {
  name: [
    { required: true, message: t('backtest.validation.nameRequired'), trigger: 'blur' },
    { min: 3, max: 50, message: t('backtest.validation.nameLength'), trigger: 'blur' }
  ],
  exchanges: [
    { required: true, message: t('backtest.validation.exchangesRequired'), trigger: 'change' }
  ],
  start_date: [
    { required: true, message: t('backtest.validation.startDateRequired'), trigger: 'change' }
  ],
  end_date: [
    { required: true, message: t('backtest.validation.endDateRequired'), trigger: 'change' }
  ]
}

const validateDateRange = () => {
  if (form.start_date && form.end_date) {
    const start = new Date(form.start_date)
    const end = new Date(form.end_date)
    return start <= end
  }
  return true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    if (!validateDateRange()) {
      ElMessage.error(t('backtest.validation.dateRange'))
      return
    }

    loading.value = true

    if (isEditing.value) {
      await backtestStore.updateBacktest(route.params.name as string, form)
      ElMessage.success(t('backtest.messages.updateSuccess'))
    } else {
      await backtestStore.createBacktest(form)
      ElMessage.success(t('backtest.messages.createSuccess'))
    }

    router.push('/backtest')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.detail || t('backtest.messages.saveError'))
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.push('/backtest')
}

// Load existing backtest data if editing
onMounted(async () => {
  if (isEditing.value) {
    try {
      await backtestStore.fetchBacktest(route.params.name as string)
      const backtest = backtestStore.currentBacktest
      if (backtest) {
        Object.assign(form, backtest)
      }
    } catch (error: any) {
      ElMessage.error(t('backtest.messages.loadError'))
      router.push('/backtest')
    }
  }
})
</script>

<style scoped lang="scss">
.backtest-create-view {
  .el-card {
    border-radius: 8px;
    border: 1px solid #f0f2f5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }

  .create-backtest-form {
    .form-section {
      margin-bottom: 32px;
      padding: 24px;
      border: 1px solid #f0f2f5;
      border-radius: 8px;

      h3 {
        font-size: 18px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 24px;
      }
    }

    .advanced-config {
      background-color: #fafbfc;
    }

    .el-form-item {
      margin-bottom: 20px;
    }

    :deep(.el-form-item__label) {
      font-weight: 500;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 32px;
    }
  }
}
</style>
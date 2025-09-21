<template>
  <div class="backtest-create-view">
    <PageHeader
      :title="isEditing ? 'Edit Backtest' : 'Create New Backtest'"
      :description="isEditing ? 'Modify backtest configuration' : 'Configure a new backtest'"
    />

    <el-card>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="left"
      >
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Name" prop="name">
              <el-input
                v-model="form.name"
                placeholder="Enter backtest name"
                :disabled="isEditing"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Exchanges" prop="exchanges">
              <el-select
                v-model="form.exchanges"
                multiple
                placeholder="Select exchanges"
                style="width: 100%"
              >
                <el-option label="Binance" value="binance" />
                <el-option label="Coinbase" value="coinbase" />
                <el-option label="Kraken" value="kraken" />
                <el-option label="Bitfinex" value="bitfinex" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Start Date" prop="start_date">
              <el-date-picker
                v-model="form.start_date"
                type="date"
                placeholder="Select start date"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="End Date" prop="end_date">
              <el-date-picker
                v-model="form.end_date"
                type="date"
                placeholder="Select end date"
                style="width: 100%"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="Description">
              <el-input
                v-model="form.description"
                type="textarea"
                :rows="3"
                placeholder="Enter backtest description (optional)"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider>Advanced Configuration</el-divider>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Initial Balance">
              <el-input-number
                v-model="form.initial_balance"
                :min="0"
                :precision="2"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Leverage">
              <el-input-number
                v-model="form.leverage"
                :min="1"
                :max="125"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="Timeframe">
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
            <el-form-item label="Strategy">
              <el-select v-model="form.strategy" style="width: 100%">
                <el-option label="Grid Strategy" value="grid" />
                <el-option label="Mean Reversion" value="mean_reversion" />
                <el-option label="Momentum" value="momentum" />
                <el-option label="Arbitrage" value="arbitrage" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            {{ isEditing ? 'Update Backtest' : 'Create Backtest' }}
          </el-button>
          <el-button @click="handleCancel">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useBacktestStore } from '@/store/backtest'
import PageHeader from '@/components/PageHeader.vue'

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
    { required: true, message: 'Please enter backtest name', trigger: 'blur' },
    { min: 3, max: 50, message: 'Name must be between 3 and 50 characters', trigger: 'blur' }
  ],
  exchanges: [
    { required: true, message: 'Please select at least one exchange', trigger: 'change' }
  ],
  start_date: [
    { required: true, message: 'Please select start date', trigger: 'change' }
  ],
  end_date: [
    { required: true, message: 'Please select end date', trigger: 'change' }
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
      ElMessage.error('End date must be after start date')
      return
    }

    loading.value = true

    if (isEditing.value) {
      await backtestStore.updateBacktest(route.params.name as string, form)
      ElMessage.success('Backtest updated successfully')
    } else {
      await backtestStore.createBacktest(form)
      ElMessage.success('Backtest created successfully')
    }

    router.push('/backtest')
  } catch (error: any) {
    ElMessage.error(error.response?.data?.detail || 'Failed to save backtest')
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
      ElMessage.error('Failed to load backtest data')
      router.push('/backtest')
    }
  }
})
</script>

<style scoped lang="scss">
.backtest-create-view {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
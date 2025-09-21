<template>
  <div class="api-keys-view">
    <PageHeader
      title="API Keys"
      description="Manage your exchange API credentials"
    >
      <template #actions>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          Add API Key
        </el-button>
      </template>
    </PageHeader>

    <el-card>
      <el-table :data="apiKeys" stripe>
        <el-table-column prop="exchange" label="Exchange" width="150" />
        <el-table-column prop="name" label="Account Name" width="200" />
        <el-table-column prop="api_key" label="API Key" width="200">
          <template #default="{ row }">
            <code>{{ maskApiKey(row.api_key) }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="120">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_used" label="Last Used" width="180">
          <template #default="{ row }">
            {{ formatDate(row.last_used) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150">
          <template #default="{ row }">
            <el-button-group>
              <el-button size="small" @click="editApiKey(row)">
                <el-icon><Edit /></el-icon>
              </el-button>
              <el-button
                size="small"
                :type="row.status === 'active' ? 'warning' : 'success'"
                @click="toggleApiKeyStatus(row)"
              >
                <el-icon><VideoPlay v-if="row.status !== 'active'" /><CircleCloseFilled v-else /></el-icon>
              </el-button>
              <el-button size="small" type="danger" @click="deleteApiKey(row)">
                <el-icon><Delete /></el-icon>
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="apiKeys.length === 0" class="empty-state">
        <el-empty description="No API keys configured">
          <el-button type="primary" @click="showAddDialog">
            Add your first API key
          </el-button>
        </el-empty>
      </div>
    </el-card>

    <!-- Add/Edit API Key Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? 'Edit API Key' : 'Add API Key'"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="Exchange" prop="exchange">
          <el-select v-model="form.exchange" style="width: 100%">
            <el-option label="Binance" value="binance" />
            <el-option label="Coinbase" value="coinbase" />
            <el-option label="Kraken" value="kraken" />
            <el-option label="Bitfinex" value="bitfinex" />
          </el-select>
        </el-form-item>
        <el-form-item label="Account Name" prop="name">
          <el-input v-model="form.name" placeholder="Enter account name" />
        </el-form-item>
        <el-form-item label="API Key" prop="api_key">
          <el-input v-model="form.api_key" placeholder="Enter your API key" show-password />
        </el-form-item>
        <el-form-item label="API Secret" prop="api_secret">
          <el-input v-model="form.api_secret" placeholder="Enter your API secret" show-password />
        </el-form-item>
        <el-form-item label="Passphrase" prop="passphrase" v-if="form.exchange === 'coinbase' || form.exchange === 'bitfinex'">
          <el-input v-model="form.passphrase" placeholder="Enter API passphrase" show-password />
        </el-form-item>
        <el-form-item label="Test Mode">
          <el-switch v-model="form.test_mode" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEditing ? 'Update' : 'Add' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import PageHeader from '@/components/PageHeader.vue'
import { formatDate } from '@/utils/date'
import {
  Plus,
  Edit,
  Delete,
  VideoPlay,
  CircleCloseFilled
} from '@element-plus/icons-vue'

interface ApiKey {
  id?: string
  exchange: string
  name: string
  api_key: string
  api_secret?: string
  passphrase?: string
  test_mode: boolean
  status: 'active' | 'inactive'
  last_used?: string
}

const apiKeys = ref<ApiKey[]>([
  {
    id: '1',
    exchange: 'binance',
    name: 'Main Trading Account',
    api_key: 'binance_api_key_123456',
    test_mode: false,
    status: 'active',
    last_used: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    exchange: 'coinbase',
    name: 'Test Account',
    api_key: 'coinbase_api_key_789012',
    test_mode: true,
    status: 'inactive',
    last_used: '2024-01-10T15:45:00Z'
  }
])

const dialogVisible = ref(false)
const formRef = ref<FormInstance>()
const loading = ref(false)
const isEditing = ref(false)
const editingId = ref<string>()

const form = reactive<ApiKey>({
  exchange: '',
  name: '',
  api_key: '',
  api_secret: '',
  passphrase: '',
  test_mode: false,
  status: 'active'
})

const rules: FormRules = {
  exchange: [
    { required: true, message: 'Please select exchange', trigger: 'change' }
  ],
  name: [
    { required: true, message: 'Please enter account name', trigger: 'blur' },
    { min: 2, max: 50, message: 'Name must be between 2 and 50 characters', trigger: 'blur' }
  ],
  api_key: [
    { required: true, message: 'Please enter API key', trigger: 'blur' }
  ],
  api_secret: [
    { required: true, message: 'Please enter API secret', trigger: 'blur' }
  ],
  passphrase: [
    { required: true, message: 'Please enter passphrase', trigger: 'blur' }
  ]
}

const maskApiKey = (apiKey: string): string => {
  if (!apiKey) return ''
  const visibleChars = Math.min(8, apiKey.length)
  const maskedPart = '*'.repeat(Math.max(12, apiKey.length - visibleChars))
  return apiKey.substring(0, visibleChars) + maskedPart
}

const showAddDialog = () => {
  isEditing.value = false
  editingId.value = undefined
  Object.assign(form, {
    exchange: '',
    name: '',
    api_key: '',
    api_secret: '',
    passphrase: '',
    test_mode: false,
    status: 'active'
  })
  dialogVisible.value = true
}

const editApiKey = (apiKey: ApiKey) => {
  isEditing.value = true
  editingId.value = apiKey.id
  Object.assign(form, apiKey, {
    api_secret: '', // Don't show existing secret
    passphrase: '' // Don't show existing passphrase
  })
  dialogVisible.value = true
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    if (isEditing.value && editingId.value) {
      // Update existing API key
      const index = apiKeys.value.findIndex(key => key.id === editingId.value)
      if (index !== -1) {
        apiKeys.value[index] = {
          ...apiKeys.value[index],
          ...form,
          api_secret: form.api_secret || apiKeys.value[index].api_secret,
          passphrase: form.passphrase || apiKeys.value[index].passphrase
        }
      }
      ElMessage.success('API key updated successfully')
    } else {
      // Add new API key
      const newApiKey: ApiKey = {
        ...form,
        id: Date.now().toString(),
        status: 'active'
      }
      apiKeys.value.push(newApiKey)
      ElMessage.success('API key added successfully')
    }

    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('Failed to save API key')
  } finally {
    loading.value = false
  }
}

const toggleApiKeyStatus = async (apiKey: ApiKey) => {
  try {
    const action = apiKey.status === 'active' ? 'deactivate' : 'activate'
    await ElMessageBox.confirm(
      `Are you sure you want to ${action} this API key?`,
      `Confirm ${action.charAt(0).toUpperCase() + action.slice(1)}`,
      {
        confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    const index = apiKeys.value.findIndex(key => key.id === apiKey.id)
    if (index !== -1) {
      apiKeys.value[index].status = apiKey.status === 'active' ? 'inactive' : 'active'
    }

    ElMessage.success(`API key ${action}d successfully`)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to update API key status')
    }
  }
}

const deleteApiKey = async (apiKey: ApiKey) => {
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete the API key for "${apiKey.name}"?`,
      'Confirm Delete',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    )

    const index = apiKeys.value.findIndex(key => key.id === apiKey.id)
    if (index !== -1) {
      apiKeys.value.splice(index, 1)
    }

    ElMessage.success('API key deleted successfully')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Failed to delete API key')
    }
  }
}
</script>

<style scoped lang="scss">
.api-keys-view {
  .empty-state {
    padding: 40px 0;
    text-align: center;
  }

  code {
    background: #f5f5f5;
    padding: 2px 6px;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 12px;
  }
}
</style>
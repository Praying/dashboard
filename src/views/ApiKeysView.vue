<template>
  <div class="api-keys-view">
    <PageHeader
      :title="$t('apiKeys.title')"
      :description="$t('apiKeys.description')"
    >
      <template #actions>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          {{ $t('apiKeys.addApiKey') }}
        </el-button>
      </template>
    </PageHeader>

    <el-card>
      <el-table :data="apiKeys">
        <el-table-column prop="exchange" :label="$t('apiKeys.exchange')" />
        <el-table-column prop="account_type" :label="$t('apiKeys.accountType')">
          <template #default="{ row }">
            {{ $t(`apiKeys.${row.account_type}`) }}
          </template>
        </el-table-column>
        <el-table-column prop="name" :label="$t('apiKeys.accountName')" />
        <el-table-column prop="api_key" :label="$t('apiKeys.apiKey')">
          <template #default="{ row }">
            <code>{{ maskApiKey(row.api_key) }}</code>
          </template>
        </el-table-column>
        <el-table-column prop="status" :label="$t('apiKeys.status')">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? $t('common.active') : $t('common.inactive') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="last_used" :label="$t('apiKeys.lastUsed')">
          <template #default="{ row }">
            {{ formatDate(row.last_used) }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('apiKeys.actions')">
          <template #default="{ row }">
            <div class="action-buttons">
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
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="apiKeys.length === 0" class="empty-state">
        <el-empty :description="$t('apiKeys.noApiKeysConfigured')">
          <el-button type="primary" @click="showAddDialog">
            {{ $t('apiKeys.addYourFirstApiKey') }}
          </el-button>
        </el-empty>
      </div>
    </el-card>

    <!-- Add/Edit API Key Dialog -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? $t('apiKeys.editApiKey') : $t('apiKeys.addApiKey')"
      width="50%"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item :label="$t('apiKeys.exchange')" prop="exchange">
          <el-select v-model="form.exchange" :placeholder="$t('apiKeys.exchangePlaceholder')" style="width: 100%">
            <el-option label="Binance" value="binance" />
            <el-option label="Coinbase" value="coinbase" />
            <el-option label="Kraken" value="kraken" />
            <el-option label="Bitfinex" value="bitfinex" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('apiKeys.accountType')" prop="account_type">
          <el-select v-model="form.account_type" :placeholder="$t('apiKeys.accountType')" style="width: 100%">
            <el-option :label="$t('apiKeys.spot')" value="spot" />
            <el-option :label="$t('apiKeys.futures')" value="futures" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('apiKeys.accountName')" prop="name">
          <el-input v-model="form.name" :placeholder="$t('apiKeys.enterAccountName')" />
        </el-form-item>
        <el-form-item :label="$t('apiKeys.apiKey')" prop="api_key">
          <el-input v-model="form.api_key" :placeholder="$t('apiKeys.enterYourApiKey')" show-password />
        </el-form-item>
        <el-form-item :label="$t('apiKeys.apiSecret')" prop="api_secret">
          <el-input v-model="form.api_secret" :placeholder="$t('apiKeys.enterYourApiSecret')" show-password />
        </el-form-item>
        <el-form-item :label="$t('apiKeys.passphrase')" prop="passphrase" v-if="form.exchange === 'coinbase' || form.exchange === 'bitfinex'">
          <el-input v-model="form.passphrase" :placeholder="$t('apiKeys.enterApiPassphrase')" show-password />
        </el-form-item>
        <el-form-item :label="$t('apiKeys.testMode')">
          <el-switch v-model="form.test_mode" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEditing ? $t('apiKeys.update') : $t('apiKeys.add') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import PageHeader from '@/components/PageHeader.vue'
import { formatDate } from '@/utils/date'
import {
  Plus,
  Edit,
  Delete,
  VideoPlay,
  CircleCloseFilled
} from '@element-plus/icons-vue'

const { t } = useI18n()

interface ApiKey {
  id?: string
  exchange: string
  account_type: 'spot' | 'futures'
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
    account_type: 'futures',
    name: 'Main Trading Account',
    api_key: 'binance_api_key_123456',
    test_mode: false,
    status: 'active',
    last_used: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    exchange: 'coinbase',
    account_type: 'spot',
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
  account_type: 'spot',
  name: '',
  api_key: '',
  api_secret: '',
  passphrase: '',
  test_mode: false,
  status: 'active'
})

const rules: FormRules = {
  exchange: [
    { required: true, message: t('apiKeys.validation.exchangeRequired'), trigger: 'change' }
  ],
  name: [
    { required: true, message: t('apiKeys.validation.nameRequired'), trigger: 'blur' },
    { min: 2, max: 50, message: t('apiKeys.validation.nameLength'), trigger: 'blur' }
  ],
  api_key: [
    { required: true, message: t('apiKeys.validation.keyRequired'), trigger: 'blur' }
  ],
  api_secret: [
    { required: true, message: t('apiKeys.validation.secretRequired'), trigger: 'blur' }
  ],
  passphrase: [
    { required: true, message: t('apiKeys.validation.passphraseRequired'), trigger: 'blur' }
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
    account_type: 'spot',
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
      ElMessage.success(t('apiKeys.messages.updateSuccess'))
    } else {
      // Add new API key
      const newApiKey: ApiKey = {
        ...form,
        id: Date.now().toString(),
        status: 'active'
      }
      apiKeys.value.push(newApiKey)
      ElMessage.success(t('apiKeys.messages.addSuccess'))
    }

    dialogVisible.value = false
  } catch (error) {
    ElMessage.error(t('apiKeys.messages.saveError'))
  } finally {
    loading.value = false
  }
}

const toggleApiKeyStatus = async (apiKey: ApiKey) => {
  try {
    const action = apiKey.status === 'active' ? 'deactivate' : 'activate'
    await ElMessageBox.confirm(
      t('apiKeys.messages.confirmToggle', { action }),
      t('apiKeys.messages.confirmToggleTitle', { action }),
      {
        confirmButtonText: t('apiKeys.messages.confirmToggleButton', { action }),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )

    const index = apiKeys.value.findIndex(key => key.id === apiKey.id)
    if (index !== -1) {
      apiKeys.value[index].status = apiKey.status === 'active' ? 'inactive' : 'active'
    }

    ElMessage.success(t('apiKeys.messages.toggleSuccess', { action }))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('apiKeys.messages.toggleError'))
    }
  }
}

const deleteApiKey = async (apiKey: ApiKey) => {
  try {
    await ElMessageBox.confirm(
      t('apiKeys.messages.confirmDelete', { name: apiKey.name }),
      t('apiKeys.messages.confirmDeleteTitle'),
      {
        confirmButtonText: t('common.delete'),
        cancelButtonText: t('common.cancel'),
        type: 'warning',
      }
    )

    const index = apiKeys.value.findIndex(key => key.id === apiKey.id)
    if (index !== -1) {
      apiKeys.value.splice(index, 1)
    }

    ElMessage.success(t('apiKeys.messages.deleteSuccess'))
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(t('apiKeys.messages.deleteError'))
    }
  }
}
</script>

<style scoped lang="scss">
.api-keys-view {
  // 布局已调整为与 DashboardView 一致的流式布局。
  // 页面级别的间距现在由 MainLayout.vue 中的 el-main 的 padding 控制。

  .el-card {
    --el-card-padding: 24px;
    border-radius: 8px;
    border: none;
    margin-top: 24px;
    background-color: var(--background-color-secondary);
  }

  .el-table {
    --el-table-row-hover-bg-color: var(--primary-color-light);
    
    .el-button-group {
      gap: 8px;
    }
    
    .el-button {
      border-radius: 4px;
    }
  }

  .el-table :deep(td), .el-table :deep(th) {
    padding: 16px 0;
    border-bottom: 1px solid var(--border-color);
  }

  .empty-state {
    padding: 40px 0;
    text-align: center;
  }

  code {
    background: var(--background-color-tertiary);
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
    font-size: 13px;
    color: var(--text-color);
  }

  .el-tag {
    border-radius: 4px;
  }

  .action-buttons {
    display: flex;
    gap: 8px;
  }
}
</style>
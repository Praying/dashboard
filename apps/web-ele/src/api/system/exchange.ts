import { requestClient } from '#/api/request';

export interface ApiKey {
  id: number;
  exchange: string;
  exchangeCategory: string;
  accountName: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  status: 'active' | 'inactive' | null;
  createdAt: string;
  lastUpdatedAt: string;
}

/**
 * @description 获取交易所API密钥列表
 */
export async function getApiKeysApi() {
  return requestClient.get<ApiKey[]>('/system/exchanges');
}

/**
 * @description 创建交易所API密钥
 */
export async function createApiKeyApi(
  data: Omit<ApiKey, 'createdAt' | 'id' | 'lastUpdatedAt' | 'status'>,
) {
  return requestClient.post<ApiKey>('/system/exchanges', data);
}

/**
 * @description 更新交易所API密钥
 */
export async function updateApiKeyApi(
  id: number,
  data: Partial<Omit<ApiKey, 'id'>>,
) {
  return requestClient.put<ApiKey>(`/system/exchanges/${id}`, data);
}

/**
 * @description 删除交易所API密钥
 */
export async function deleteApiKeyApi(id: number) {
  return requestClient.delete(`/system/exchanges/${id}`);
}

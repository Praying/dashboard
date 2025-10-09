import { requestClient } from '../request';

export interface CoinMarketCap {
  coin_market_cap_api_key: string;
  fetch_limit: number;
  fetch_interval: number;
  metadata_interval: number;
}

export function getCoinMarketCapConfig() {
  return requestClient.get<CoinMarketCap>('/system/coinmarket');
}

export function saveCoinMarketCapConfig(data: CoinMarketCap) {
  return requestClient.post('/system/coinmarket', data);
}

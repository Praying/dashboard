import { requestClient } from '#/api/request';

export interface V6SingleBacktest {
  id: number;
  name: string;
  account_name: string;
  exchange: string;
  symbol: string;
  market_type: string;
  model: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  status: string;
  config?: any;
}

export interface V6SingleBacktestCreate {
  name: string;
  account_name: string;
  exchange: string;
  symbol: string;
  market_type: string;
  model: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  config?: any;
}

export function getV6SingleBacktestsApi() {
  return requestClient.get<V6SingleBacktest[]>('/v6-single/backtest/');
}

export function createV6SingleBacktestApi(data: V6SingleBacktestCreate) {
  return requestClient.post<V6SingleBacktest>('/v6-single/backtest/', data);
}

export function deleteV6SingleBacktestApi(backtestId: number) {
  return requestClient.delete(`/v6-single/backtest/${backtestId}`);
}

export function startV6SingleBacktestApi(backtestId: number) {
  return requestClient.post<V6SingleBacktest>(
    `/v6-single/backtest/${backtestId}/start`,
  );
}

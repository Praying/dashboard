import { defineEventHandler } from 'h3';

import { V6SingleBacktest } from '#/api/v6-single-backtest';
import { success } from '~/utils/response';

const MOCK_BACKTESTS: V6SingleBacktest[] = [
  {
    id: 1,
    name: 'btv6-1',
    account_name: 'account-1',
    exchange: 'binance',
    symbol: 'BTC/USDT',
    market_type: 'futures',
    mode: 'recursive_grid',
    start_date: '2021-09-30',
    end_date: '2025-09-29',
    initial_capital: 1000,
    status: 'completed',
  },
  {
    id: 2,
    name: 'btv6-2',
    account_name: 'account-2',
    exchange: 'binance',
    symbol: 'ETH/USDT',
    market_type: 'futures',
    mode: 'neat_grid',
    start_date: '2022-01-01',
    end_date: '2024-01-01',
    initial_capital: 5000,
    status: 'running',
  },
];

export default defineEventHandler(() => {
  return success({
    data: MOCK_BACKTESTS,
  });
});
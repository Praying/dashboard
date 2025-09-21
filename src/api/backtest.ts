import api from './index';

export interface BacktestConfig {
  name: string;
  exchanges: string[];
  start_date: string;
  end_date: string;
  // Add other configuration fields as needed
}

export interface BacktestConfigCreate extends BacktestConfig {}
export interface BacktestConfigUpdate extends Partial<BacktestConfig> {}

export interface BacktestConfigResponse extends BacktestConfig {
  last_modified: string;
}

export interface BacktestResult {
  id: string;
  backtest_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  start_time?: string;
  end_time?: string;
  error_message?: string;
  // Add result fields like ADG, Sharpe Ratio, etc.
}

export interface QueueTask {
  id: string;
  backtest_name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  start_time?: string;
  end_time?: string;
  error_message?: string;
}

export const backtestApi = {
  // Backtest configurations
  getBacktests: () => api.get<BacktestConfigResponse[]>('/backtests'),
  createBacktest: (config: BacktestConfigCreate) => api.post<BacktestConfigResponse>('/backtests', config),
  getBacktest: (name: string) => api.get<BacktestConfigResponse>(`/backtests/${name}`),
  updateBacktest: (name: string, config: BacktestConfigUpdate) => api.put<BacktestConfigResponse>(`/backtests/${name}`, config),
  deleteBacktest: (name: string) => api.delete(`/backtests/${name}`),

  // Backtest results
  getBacktestResults: (name: string) => api.get<BacktestResult[]>(`/backtests/${name}/results`),
  getBacktestResult: (name: string, resultId: string) => api.get<BacktestResult>(`/backtests/${name}/results/${resultId}`),
  deleteBacktestResults: (name: string) => api.delete(`/backtests/${name}/results`),

  // Queue management
  getQueueTasks: () => api.get<QueueTask[]>('/queue/backtests'),
  addToQueue: (name: string) => api.post('/queue/backtests', { backtest_name: name }),
  getQueueStatus: () => api.get<{ running: number; pending: number; completed: number }>('/queue/backtests/status'),
  clearQueue: () => api.delete('/queue/backtests'),
  getTaskLog: (taskId: string) => api.get<string>(`/queue/backtests/${taskId}/log`),

  // Queue control
  startQueue: () => api.post('/queue/backtests/run'),
  stopQueue: () => api.post('/queue/backtests/stop'),
};
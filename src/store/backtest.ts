import { defineStore } from 'pinia'
import { ref } from 'vue'
import { backtestApi } from '@/api/backtest'
import type {
  BacktestConfig,
  BacktestConfigResponse,
  BacktestResult,
  QueueTask
} from '@/api/backtest'

export const useBacktestStore = defineStore('backtest', () => {
  // State
  const backtests = ref<BacktestConfigResponse[]>([])
  const currentBacktest = ref<BacktestConfigResponse | null>(null)
  const backtestResults = ref<BacktestResult[]>([])
  const queueTasks = ref<QueueTask[]>([])
  const queueStatus = ref<{
    running: number
    pending: number
    completed: number
  }>({ running: 0, pending: 0, completed: 0 })

  const loading = ref({
    backtests: false,
    currentBacktest: false,
    results: false,
    queue: false,
    queueStatus: false
  })

  const error = ref<string | null>(null)

  // Actions
  async function fetchBacktests() {
    loading.value.backtests = true
    error.value = null

    try {
      const response = await backtestApi.getBacktests()
      backtests.value = response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch backtests'
      throw err
    } finally {
      loading.value.backtests = false
    }
  }

  async function createBacktest(config: BacktestConfig) {
    loading.value.backtests = true
    error.value = null

    try {
      const response = await backtestApi.createBacktest(config)
      backtests.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to create backtest'
      throw err
    } finally {
      loading.value.backtests = false
    }
  }

  async function fetchBacktest(name: string) {
    loading.value.currentBacktest = true
    error.value = null

    try {
      const response = await backtestApi.getBacktest(name)
      currentBacktest.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch backtest'
      throw err
    } finally {
      loading.value.currentBacktest = false
    }
  }

  async function updateBacktest(name: string, config: Partial<BacktestConfig>) {
    loading.value.currentBacktest = true
    error.value = null

    try {
      const response = await backtestApi.updateBacktest(name, config)
      currentBacktest.value = response.data

      // Update the backtest in the list
      const index = backtests.value.findIndex(b => b.name === name)
      if (index !== -1) {
        backtests.value[index] = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to update backtest'
      throw err
    } finally {
      loading.value.currentBacktest = false
    }
  }

  async function deleteBacktest(name: string) {
    loading.value.backtests = true
    error.value = null

    try {
      await backtestApi.deleteBacktest(name)

      // Remove from lists
      backtests.value = backtests.value.filter(b => b.name !== name)
      if (currentBacktest.value?.name === name) {
        currentBacktest.value = null
      }
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to delete backtest'
      throw err
    } finally {
      loading.value.backtests = false
    }
  }

  async function fetchBacktestResults(name: string) {
    loading.value.results = true
    error.value = null

    try {
      const response = await backtestApi.getBacktestResults(name)
      backtestResults.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch backtest results'
      throw err
    } finally {
      loading.value.results = false
    }
  }

  async function fetchQueueTasks() {
    loading.value.queue = true
    error.value = null

    try {
      const response = await backtestApi.getQueueTasks()
      queueTasks.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch queue tasks'
      throw err
    } finally {
      loading.value.queue = false
    }
  }

  async function fetchQueueStatus() {
    loading.value.queueStatus = true
    error.value = null

    try {
      const response = await backtestApi.getQueueStatus()
      queueStatus.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to fetch queue status'
      throw err
    } finally {
      loading.value.queueStatus = false
    }
  }

  async function addToQueue(name: string) {
    error.value = null

    try {
      await backtestApi.addToQueue(name)
      // Refresh queue tasks after adding
      await fetchQueueTasks()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to add to queue'
      throw err
    }
  }

  async function clearQueue() {
    error.value = null

    try {
      await backtestApi.clearQueue()
      queueTasks.value = []
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to clear queue'
      throw err
    }
  }

  async function startQueue() {
    error.value = null

    try {
      await backtestApi.startQueue()
      // Refresh status after starting
      await fetchQueueStatus()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to start queue'
      throw err
    }
  }

  async function stopQueue() {
    error.value = null

    try {
      await backtestApi.stopQueue()
      // Refresh status after stopping
      await fetchQueueStatus()
    } catch (err: any) {
      error.value = err.response?.data?.detail || 'Failed to stop queue'
      throw err
    }
  }

  function clearError() {
    error.value = null
  }

  return {
    // State
    backtests,
    currentBacktest,
    backtestResults,
    queueTasks,
    queueStatus,
    loading,
    error,

    // Actions
    fetchBacktests,
    createBacktest,
    fetchBacktest,
    updateBacktest,
    deleteBacktest,
    fetchBacktestResults,
    fetchQueueTasks,
    fetchQueueStatus,
    addToQueue,
    clearQueue,
    startQueue,
    stopQueue,
    clearError
  }
})
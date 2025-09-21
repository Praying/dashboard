import { createI18n } from 'vue-i18n'
import en from './en.json'
import zh from './zh.json'

// 类型声明 - 完整的翻译键类型定义
type MessageSchema = {
  common: {
    welcome: string
    logout: string
    login: string
    cancel: string
    confirm: string
    save: string
    edit: string
    delete: string
    back: string
    next: string
    loading: string
    error: string
    success: string
    warning: string
    info: string
    add: string
    update: string
    create: string
    view: string
    run: string
    refresh: string
    search: string
    filter: string
    reset: string
    actions: string
    status: string
    name: string
    description: string
    submit: string
    close: string
    yes: string
    no: string
    active: string
    inactive: string
    signing_in: string
    sign_in: string
    profile: string
    settings: string
  }
  menu: {
    dashboard: string
    backtest: string
    optimize: string
    run: string
    apiKeys: string
    system: string
  }
  dashboard: {
    title: string
    description: string
    totalBacktests: string
    completed: string
    running: string
    failed: string
    backtestStatusDistribution: string
    recentActivity: string
    recentBacktests: string
    viewAll: string
    exchanges: string
    lastModified: string
    backtestAddedToQueue: string
    failedToAddBacktestToQueue: string
    failedToRefreshData: string
  }
  auth: {
    username: string
    password: string
    usernamePlaceholder: string
    passwordPlaceholder: string
    loginFailed: string
  }
  apiKeys: {
    title: string
    description: string
    addApiKey: string
    exchange: string
    accountName: string
    apiKey: string
    apiSecret: string
    passphrase: string
    testMode: string
    lastUsed: string
    editApiKey: string
    update: string
    add: string
    noApiKeysConfigured: string
    addYourFirstApiKey: string
    enterAccountName: string
    enterYourApiKey: string
    enterYourApiSecret: string
    enterApiPassphrase: string
    pleaseSelectExchange: string
    pleaseEnterAccountName: string
    nameMustBeBetween2And50Characters: string
    pleaseEnterApiKey: string
    pleaseEnterApiSecret: string
    pleaseEnterPassphrase: string
    apiKeyUpdatedSuccessfully: string
    apiKeyAddedSuccessfully: string
    failedToSaveApiKey: string
    areYouSureYouWantToDeactivateThisApiKey: string
    confirmDeactivate: string
    areYouSureYouWantToActivateThisApiKey: string
    confirmActivate: string
    apiKeyDeactivatedSuccessfully: string
    apiKeyActivatedSuccessfully: string
    failedToUpdateApiKeyStatus: string
    areYouSureYouWantToDeleteTheApiKeyFor: string
    confirmDelete: string
    apiKeyDeletedSuccessfully: string
    failedToDeleteApiKey: string
  }
  backtest: {
    title: string
    description: string
    newBacktest: string
    createNewBacktest: string
    editBacktest: string
    modifyBacktestConfiguration: string
    configureANewBacktest: string
    name: string
    exchanges: string
    startDate: string
    endDate: string
    enterBacktestName: string
    selectExchanges: string
    selectStartDate: string
    selectEndDate: string
    enterBacktestDescriptionOptional: string
    advancedConfiguration: string
    initialBalance: string
    leverage: string
    timeframe: string
    strategy: string
    gridStrategy: string
    meanReversion: string
    momentum: string
    arbitrage: string
    updateBacktest: string
    createBacktest: string
    pleaseEnterBacktestName: string
    nameMustBeBetween3And50Characters: string
    pleaseSelectAtLeastOneExchange: string
    pleaseSelectStartDate: string
    pleaseSelectEndDate: string
    endDateMustBeAfterStartDate: string
    backtestUpdatedSuccessfully: string
    backtestCreatedSuccessfully: string
    failedToSaveBacktest: string
    failedToLoadBacktestData: string
    searchBacktests: string
    all: string
    running: string
    completed: string
    failed: string
    edit: string
    viewResults: string
    runBacktest: string
    delete: string
    noBacktestsFound: string
    createYourFirstBacktest: string
    areYouSureYouWantToDeleteTheBacktest: string
    backtestDeletedSuccessfully: string
    failedToDeleteBacktest: string
    backtestAddedToQueue: string
    failedToAddBacktestToQueue: string
  }
  element: {
    pagination: {
      goto: string
      pagesize: string
      total: string
      pageClassifier: string
    }
    select: {
      loading: string
      noMatch: string
      noData: string
      placeholder: string
    }
    table: {
      emptyText: string
      confirmFilter: string
      resetFilter: string
      clearFilter: string
      sumText: string
    }
    datepicker: {
      now: string
      today: string
      cancel: string
      clear: string
      confirm: string
      selectDate: string
      selectTime: string
      startDate: string
      endDate: string
      prevYear: string
      nextYear: string
      prevMonth: string
      nextMonth: string
      year: string
      month1: string
      month2: string
      month3: string
      month4: string
      month5: string
      month6: string
      month7: string
      month8: string
      month9: string
      month10: string
      month11: string
      month12: string
      weeks: {
        sun: string
        mon: string
        tue: string
        wed: string
        thu: string
        fri: string
        sat: string
      }
      months: {
        jan: string
        feb: string
        mar: string
        apr: string
        may: string
        jun: string
        jul: string
        aug: string
        sep: string
        oct: string
        nov: string
        dec: string
      }
    }
    upload: {
      delete: string
      preview: string
      continue: string
    }
    messagebox: {
      title: string
      confirm: string
      cancel: string
      error: string
    }
    notification: {
      title: string
      close: string
    }
  }
}

// 导出类型以供其他文件使用
export type { MessageSchema }

// 创建i18n实例
const i18n = createI18n<[MessageSchema], 'en' | 'zh'>({
  legacy: false, // 使用Composition API模式
  locale: 'zh', // 默认语言为中文
  fallbackLocale: 'en', // 回退语言为英文
  messages: {
    en,
    zh
  },
  globalInjection: true // 全局注入$t函数
})

// 导出i18n实例
export default i18n
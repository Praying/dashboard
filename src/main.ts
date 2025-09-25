import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'

// Import global styles
import './styles/index.scss'

import router from './router'
import { createPinia } from 'pinia'
import i18n from './locales'
import { useTheme } from './store/theme'

// Load theme
const { loadTheme } = useTheme()
loadTheme()

// 配置Element Plus国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

// Register all Element Plus icons globally
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 初始化插件 - 注意顺序
app.use(createPinia()) // 状态管理
app.use(router) // 路由
app.use(i18n) // 国际化

// 配置Element Plus使用对应语言
app.use(ElementPlus, {
  locale: zhCn // 默认使用中文，后续将通过监听i18n的locale变化来动态更新
})

app.mount('#app')
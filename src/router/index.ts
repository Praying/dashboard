import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/store/auth'

// Layout components
import MainLayout from '@/layouts/MainLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'

// Lazy load views for better performance
const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const BacktestListView = () => import('@/views/backtest/BacktestListView.vue')
const BacktestCreateView = () => import('@/views/backtest/BacktestCreateView.vue')
const BacktestResultsView = () => import('@/views/backtest/BacktestResultsView.vue')
const QueueView = () => import('@/views/backtest/QueueView.vue')
const OptimizeView = () => import('@/views/OptimizeView.vue')
const RunView = () => import('@/views/RunView.vue')
const ApiKeysView = () => import('@/views/ApiKeysView.vue')
const SystemView = () => import('@/views/SystemView.vue')
const EnhancedDemoView = () => import('@/views/EnhancedDemo.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: AuthLayout,
      meta: { requiresAuth: false, layout: 'auth' },
      children: [
        {
          path: '',
          name: 'login-page',
          component: LoginView
        }
      ]
    },
    {
      path: '/',
      component: MainLayout,
      meta: { requiresAuth: true, layout: 'main' },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: DashboardView
        },
        {
          path: '/dashboard',
          redirect: '/'
        },
        {
          path: '/backtest',
          name: 'backtest',
          children: [
            {
              path: '',
              name: 'backtest-list',
              component: BacktestListView
            },
            {
              path: 'create',
              name: 'backtest-create',
              component: BacktestCreateView
            },
            {
              path: ':name',
              name: 'backtest-edit',
              component: BacktestCreateView,
              props: route => ({ name: route.params.name })
            },
            {
              path: ':name/results',
              name: 'backtest-results',
              component: BacktestResultsView,
              props: route => ({ name: route.params.name })
            }
          ]
        },
        {
          path: '/queue',
          name: 'queue',
          component: QueueView
        },
        {
          path: '/optimize',
          name: 'optimize',
          component: OptimizeView
        },
        {
          path: '/run',
          name: 'run',
          component: RunView
        },
        {
          path: '/api-keys',
          name: 'api-keys',
          component: ApiKeysView
        },
        {
          path: '/system',
          name: 'system',
          component: SystemView
        },
        {
          path: '/enhanced-demo',
          name: 'enhanced-demo',
          component: EnhancedDemoView
        }
      ]
    }
  ]
})

router.beforeEach(async (to: RouteLocationNormalized, _from: RouteLocationNormalized, next: NavigationGuardNext) => {
  const authStore = useAuthStore();

  // Check authentication status from localStorage on page load
  if (!authStore.isAuthenticated && authStore.checkAuth()) {
    // Token was found in localStorage, update auth state
  }

  const isAuthenticated = authStore.isAuthenticated;

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Save the attempted route for redirect after login
    next({ name: 'login', query: { redirect: to.fullPath } });
  } else if (to.meta.layout === 'auth' && isAuthenticated) {
    // If user is authenticated and tries to access auth pages, redirect to dashboard
    next({ name: 'dashboard' });
  } else {
    // Otherwise, allow navigation
    next();
  }
});

export default router
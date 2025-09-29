import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      title: $t('page.passivbot.v7.title'),
      icon: 'lucide:gem',
      order: 1,
    },
    name: 'PBv7',
    path: '/pbv7',
    children: [
      {
        name: 'PBv7Run',
        path: 'run',
        component: () => import('#/views/pbv7/run/index.vue'),
        meta: {
          title: $t('page.passivbot.v7.run'),
          icon: 'lucide:play',
        },
      },
      {
        name: 'PBv7Backtest',
        path: 'backtest',
        component: () => import('#/views/pbv7/backtest/index.vue'),
        meta: {
          title: $t('page.passivbot.v7.backtest'),
          icon: 'lucide:bot',
        },
      },
      {
        name: 'PBv7Optimize',
        path: 'optimize',
        component: () => import('#/views/pbv7/optimize/index.vue'),
        meta: {
          title: $t('page.passivbot.v7.optimize'),
          icon: 'lucide:sliders',
        },
      },
      {
        name: 'PBv7GridVisualizer',
        path: 'grid-visualizer',
        component: () => import('#/views/pbv7/grid-visualizer/index.vue'),
        meta: {
          title: $t('page.passivbot.v7.gridVisualizer'),
          icon: 'lucide:layout-grid',
        },
      },
      {
        name: 'PBv7BalanceCalculator',
        path: 'balance-calculator',
        component: () => import('#/views/pbv7/balance-calculator/index.vue'),
        meta: {
          title: $t('page.passivbot.v7.balanceCalculator'),
          icon: 'lucide:calculator',
        },
      },
    ],
  },
  {
    meta: {
      title: $t('page.passivbot.v6multi.title'),
      icon: 'lucide:box',
      order: 2,
    },
    name: 'PBv6Multi',
    path: '/pbv6-multi',
    children: [
      {
        name: 'PBv6MultiRun',
        path: 'run',
        component: () => import('#/views/pbv6-multi/run/index.vue'),
        meta: {
          title: $t('page.passivbot.v6multi.run'),
          icon: 'lucide:play',
        },
      },
      {
        name: 'PBv6MultiBacktest',
        path: 'backtest',
        component: () => import('#/views/pbv6-multi/backtest/index.vue'),
        meta: {
          title: $t('page.passivbot.v6multi.backtest'),
          icon: 'lucide:bot',
        },
      },
      {
        name: 'PBv6MultiOptimize',
        path: 'optimize',
        component: () => import('#/views/pbv6-multi/optimize/index.vue'),
        meta: {
          title: $t('page.passivbot.v6multi.optimize'),
          icon: 'lucide:sliders',
        },
      },
    ],
  },
  {
    meta: {
      title: $t('page.passivbot.v6single.title'),
      icon: 'lucide:package',
      order: 3,
    },
    name: 'PBv6Single',
    path: '/pbv6-single',
    children: [
      {
        name: 'PBv6SingleRun',
        path: 'run',
        component: () => import('#/views/pbv6-single/run/index.vue'),
        meta: {
          title: $t('page.passivbot.v6single.run'),
          icon: 'lucide:play',
        },
      },
      {
        name: 'PBv6SingleBacktest',
        path: 'backtest',
        component: () => import('#/views/pbv6-single/backtest/index.vue'),
        meta: {
          title: $t('page.passivbot.v6single.backtest'),
          icon: 'lucide:bot',
        },
      },
      {
        name: 'PBv6SingleOptimize',
        path: 'optimize',
        component: () => import('#/views/pbv6-single/optimize/index.vue'),
        meta: {
          title: $t('page.passivbot.v6single.optimize'),
          icon: 'lucide:sliders',
        },
      },
      {
        name: 'PBv6SingleSpotView',
        path: 'spot-view',
        component: () => import('#/views/pbv6-single/spot-view/index.vue'),
        meta: {
          title: $t('page.passivbot.v6single.spotView'),
          icon: 'lucide:wallet',
        },
      },
    ],
  },
];

export default routes;

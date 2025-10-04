import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:home',
      order: -2,
      title: $t('page.system.title'),
    },
    name: 'System',
    path: '/system',
    children: [
      {
        name: 'Welcome',
        path: 'welcome',
        component: () => import('#/views/system/welcome/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:home',
          title: $t('page.system.welcome'),
        },
      },
      {
        name: 'Exchanges',
        path: 'exchanges',
        component: () => import('#/views/system/exchanges/index.vue'),
        meta: {
          icon: 'lucide:landmark',
          title: $t('page.system.exchanges'),
        },
      },
      {
        name: 'PBGUIServices',
        path: 'pbgui-services',
        component: () => import('#/views/system/pbgui-services/index.vue'),
        meta: {
          icon: 'lucide:wrench',
          title: $t('page.system.pbgui-services'),
        },
      },
      {
        name: 'VPSManager',
        path: 'vps-manager',
        component: () => import('#/views/system/vps-manager/index.vue'),
        meta: {
          icon: 'lucide:server',
          title: $t('page.system.vps-manager'),
        },
      },
      {
        name: 'Preferences',
        path: 'preferences',
        component: () => import('#/views/system/preferences/index.vue'),
        meta: {
          icon: 'lucide:settings',
          title: $t('page.system.preferences'),
        },
      },
    ],
  },
  {
    meta: {
      icon: 'lucide:info',
      order: -1,
      title: $t('page.information.title'),
    },
    name: 'Information',
    path: '/information',
    children: [
      {
        name: 'Dashboards',
        path: 'dashboards',
        component: () => import('#/views/information/dashboards/index.vue'),
        meta: {
          icon: 'lucide:layout-dashboard',
          title: $t('page.information.dashboards'),
        },
      },
      {
        name: 'CoinData',
        path: 'coin-data',
        component: () => import('#/views/information/coin-data/index.vue'),
        meta: {
          icon: 'lucide:database',
          title: $t('page.information.coin-data'),
        },
      },
    ],
  },
];

export default routes;

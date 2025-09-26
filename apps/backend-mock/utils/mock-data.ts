export interface UserInfo {
  id: number;
  password: string;
  realName: string;
  roles: string[];
  username: string;
  homePath?: string;
}

export const MOCK_USERS: UserInfo[] = [
  {
    id: 0,
    password: '123456',
    realName: 'Vben',
    roles: ['super'],
    username: 'vben',
  },
  {
    id: 1,
    password: '123456',
    realName: 'Admin',
    roles: ['admin'],
    username: 'admin',
    homePath: '/workspace',
  },
  {
    id: 2,
    password: '123456',
    realName: 'Jack',
    roles: ['user'],
    username: 'jack',
    homePath: '/analytics',
  },
];

export const MOCK_CODES = [
  // super
  {
    codes: ['AC_100100', 'AC_100110', 'AC_100120', 'AC_100010'],
    username: 'vben',
  },
  {
    // admin
    codes: ['AC_100010', 'AC_100020', 'AC_100030'],
    username: 'admin',
  },
  {
    // user
    codes: ['AC_1000001', 'AC_1000002'],
    username: 'jack',
  },
];

const dashboardMenus = [
  {
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/dashboard',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
    ],
  },
];

const createDemosMenus = (role: 'admin' | 'super' | 'user') => {
  const roleWithMenus = {
    admin: {
      component: '/demos/access/admin-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.adminVisible',
      },
      name: 'AccessAdminVisibleDemo',
      path: '/demos/access/admin-visible',
    },
    super: {
      component: '/demos/access/super-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.superVisible',
      },
      name: 'AccessSuperVisibleDemo',
      path: '/demos/access/super-visible',
    },
    user: {
      component: '/demos/access/user-visible',
      meta: {
        icon: 'mdi:button-cursor',
        title: 'demos.access.userVisible',
      },
      name: 'AccessUserVisibleDemo',
      path: '/demos/access/user-visible',
    },
  };

  return [
    {
      meta: {
        icon: 'ic:baseline-view-in-ar',
        keepAlive: true,
        order: 1000,
        title: 'demos.title',
      },
      name: 'Demos',
      path: '/demos',
      redirect: '/demos/access',
      children: [
        {
          name: 'AccessDemos',
          path: '/demosaccess',
          meta: {
            icon: 'mdi:cloud-key-outline',
            title: 'demos.access.backendPermissions',
          },
          redirect: '/demos/access/page-control',
          children: [
            {
              name: 'AccessPageControlDemo',
              path: '/demos/access/page-control',
              component: '/demos/access/index',
              meta: {
                icon: 'mdi:page-previous-outline',
                title: 'demos.access.pageAccess',
              },
            },
            {
              name: 'AccessButtonControlDemo',
              path: '/demos/access/button-control',
              component: '/demos/access/button-control',
              meta: {
                icon: 'mdi:button-cursor',
                title: 'demos.access.buttonControl',
              },
            },
            {
              name: 'AccessMenuVisible403Demo',
              path: '/demos/access/menu-visible-403',
              component: '/demos/access/menu-visible-403',
              meta: {
                authority: ['no-body'],
                icon: 'mdi:button-cursor',
                menuVisibleWithForbidden: true,
                title: 'demos.access.menuVisible403',
              },
            },
            roleWithMenus[role],
          ],
        },
      ],
    },
  ];
};

export const MOCK_MENUS = [
  {
    menus: [
      ...dashboardMenus,
      {
        meta: {
          order: 0,
          title: 'System',
        },
        name: 'System',
        path: '/system',
        children: [
          {
            name: 'Welcome',
            path: '/system/welcome',
            component: '/dashboard/welcome/index',
            meta: {
              title: 'Welcome',
              icon: 'ant-design:home-outlined',
            },
          },
          {
            name: 'API-Keys',
            path: '/system/api-keys',
            component: '/system/api-keys/index',
            meta: {
              title: 'API-Keys',
              icon: 'ant-design:key-outlined',
            },
          },
          {
            name: 'PBGUI-Services',
            path: '/system/pbgui-services',
            component: '/system/pbgui-services/index',
            meta: {
              title: 'PBGUI Services',
              icon: 'ant-design:tool-outlined',
            },
          },
          {
            name: 'VPS-Manager',
            path: '/system/vps-manager',
            component: '/system/vps-manager/index',
            meta: {
              title: 'VPS Manager',
              icon: 'ant-design:cloud-server-outlined',
            },
          },
        ],
      },
      {
        meta: {
          order: 1,
          title: 'Information',
        },
        name: 'Information',
        path: '/information',
        children: [
          {
            name: 'Dashboards',
            path: '/information/dashboards',
            component: '/information/dashboards/index',
            meta: {
              title: 'Dashboards',
              icon: 'ant-design:appstore-outlined',
            },
          },
          {
            name: 'Coin-Data',
            path: '/information/coin-data',
            component: '/information/coin-data/index',
            meta: {
              title: 'Coin Data',
              icon: 'ant-design:database-outlined',
            },
          },
        ],
      },
      {
        meta: {
          order: 2,
          title: 'PBv7',
        },
        name: 'PBv7',
        path: '/pbv7',
        children: [
          {
            name: 'Run',
            path: '/pbv7/run',
            component: '/pbv7/run/index',
            meta: {
              title: 'Run',
              icon: 'ant-design:play-circle-outlined',
            },
          },
          {
            name: 'Backtest',
            path: '/pbv7/backtest',
            component: '/pbv7/backtest/index',
            meta: {
              title: 'Backtest',
              icon: 'ant-design:history-outlined',
            },
          },
          {
            name: 'Optimize',
            path: '/pbv7/optimize',
            component: '/pbv7/optimize/index',
            meta: {
              title: 'Optimize',
              icon: 'ant-design:sliders-outlined',
            },
          },
          {
            name: 'Grid-Visualizer',
            path: '/pbv7/grid-visualizer',
            component: '/pbv7/grid-visualizer/index',
            meta: {
              title: 'Grid Visualizer',
              icon: 'ant-design:eye-outlined',
            },
          },
          {
            name: 'Balance-Calculator',
            path: '/pbv7/balance-calculator',
            component: '/pbv7/balance-calculator/index',
            meta: {
              title: 'Balance Calculator',
              icon: 'ant-design:dollar-outlined',
            },
          },
        ],
      },
      {
        meta: {
          order: 3,
          title: 'PBv6 Multi',
        },
        name: 'PBv6-Multi',
        path: '/pbv6-multi',
        children: [
          {
            name: 'Run',
            path: '/pbv6-multi/run',
            component: '/pbv6-multi/run/index',
            meta: {
              title: 'Run',
              icon: 'ant-design:play-circle-outlined',
            },
          },
          {
            name: 'Backtest',
            path: '/pbv6-multi/backtest',
            component: '/pbv6-multi/backtest/index',
            meta: {
              title: 'Backtest',
              icon: 'ant-design:history-outlined',
            },
          },
          {
            name: 'Optimize',
            path: '/pbv6-multi/optimize',
            component: '/pbv6-multi/optimize/index',
            meta: {
              title: 'Optimize',
              icon: 'ant-design:sliders-outlined',
            },
          },
        ],
      },
      {
        meta: {
          order: 4,
          title: 'PBv6 Single',
        },
        name: 'PBv6-Single',
        path: '/pbv6-single',
        children: [
          {
            name: 'Run',
            path: '/pbv6-single/run',
            component: '/pbv6-single/run/index',
            meta: {
              title: 'Run',
              icon: 'ant-design:play-circle-outlined',
            },
          },
          {
            name: 'Backtest',
            path: '/pbv6-single/backtest',
            component: '/pbv6-single/backtest/index',
            meta: {
              title: 'Backtest',
              icon: 'ant-design:history-outlined',
            },
          },
          {
            name: 'Optimize',
            path: '/pbv6-single/optimize',
            component: '/pbv6-single/optimize/index',
            meta: {
              title: 'Optimize',
              icon: 'ant-design:sliders-outlined',
            },
          },
          {
            name: 'Spot-View',
            path: '/pbv6-single/spot-view',
            component: '/pbv6-single/spot-view/index',
            meta: {
              title: 'Spot View',
              icon: 'ant-design:fund-view-outlined',
            },
          },
        ],
      },
      ...createDemosMenus('super'),
    ],
    username: 'vben',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('admin')],
    username: 'admin',
  },
  {
    menus: [...dashboardMenus, ...createDemosMenus('user')],
    username: 'jack',
  },
];

export const MOCK_MENU_LIST = [
  {
    id: 1,
    name: 'Workspace',
    status: 1,
    type: 'menu',
    icon: 'mdi:dashboard',
    path: '/workspace',
    component: '/dashboard/workspace/index',
    meta: {
      icon: 'carbon:workspace',
      title: 'page.dashboard.workspace',
      affixTab: true,
      order: 0,
    },
  },
  {
    id: 2,
    meta: {
      icon: 'carbon:settings',
      order: 9997,
      title: 'system.title',
      badge: 'new',
      badgeType: 'normal',
      badgeVariants: 'primary',
    },
    status: 1,
    type: 'catalog',
    name: 'System',
    path: '/system',
    children: [
      {
        id: 201,
        pid: 2,
        path: '/system/menu',
        name: 'SystemMenu',
        authCode: 'System:Menu:List',
        status: 1,
        type: 'menu',
        meta: {
          icon: 'carbon:menu',
          title: 'system.menu.title',
        },
        component: '/system/menu/list',
        children: [
          {
            id: 20_101,
            pid: 201,
            name: 'SystemMenuCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_102,
            pid: 201,
            name: 'SystemMenuEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_103,
            pid: 201,
            name: 'SystemMenuDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Menu:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
      {
        id: 202,
        pid: 2,
        path: '/system/dept',
        name: 'SystemDept',
        status: 1,
        type: 'menu',
        authCode: 'System:Dept:List',
        meta: {
          icon: 'carbon:container-services',
          title: 'system.dept.title',
        },
        component: '/system/dept/list',
        children: [
          {
            id: 20_401,
            pid: 201,
            name: 'SystemDeptCreate',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Create',
            meta: { title: 'common.create' },
          },
          {
            id: 20_402,
            pid: 201,
            name: 'SystemDeptEdit',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Edit',
            meta: { title: 'common.edit' },
          },
          {
            id: 20_403,
            pid: 201,
            name: 'SystemDeptDelete',
            status: 1,
            type: 'button',
            authCode: 'System:Dept:Delete',
            meta: { title: 'common.delete' },
          },
        ],
      },
    ],
  },
  {
    id: 9,
    meta: {
      badgeType: 'dot',
      order: 9998,
      title: 'demos.vben.title',
      icon: 'carbon:data-center',
    },
    name: 'Project',
    path: '/vben-admin',
    type: 'catalog',
    status: 1,
    children: [
      {
        id: 901,
        pid: 9,
        name: 'VbenDocument',
        path: '/vben-admin/document',
        component: 'IFrameView',
        type: 'embedded',
        status: 1,
        meta: {
          icon: 'carbon:book',
          iframeSrc: 'https://doc.vben.pro',
          title: 'demos.vben.document',
        },
      },
      {
        id: 902,
        pid: 9,
        name: 'VbenGithub',
        path: '/vben-admin/github',
        component: 'IFrameView',
        type: 'link',
        status: 1,
        meta: {
          icon: 'carbon:logo-github',
          link: 'https://github.com/vbenjs/vue-vben-admin',
          title: 'Github',
        },
      },
      {
        id: 903,
        pid: 9,
        name: 'VbenAntdv',
        path: '/vben-admin/antdv',
        component: 'IFrameView',
        type: 'link',
        status: 0,
        meta: {
          icon: 'carbon:hexagon-vertical-solid',
          badgeType: 'dot',
          link: 'https://ant.vben.pro',
          title: 'demos.vben.antdv',
        },
      },
    ],
  },
  {
    id: 10,
    component: '_core/about/index',
    type: 'menu',
    status: 1,
    meta: {
      icon: 'lucide:copyright',
      order: 9999,
      title: 'demos.vben.about',
    },
    name: 'About',
    path: '/about',
  },
];

export function getMenuIds(menus: any[]) {
  const ids: number[] = [];
  menus.forEach((item) => {
    ids.push(item.id);
    if (item.children && item.children.length > 0) {
      ids.push(...getMenuIds(item.children));
    }
  });
  return ids;
}

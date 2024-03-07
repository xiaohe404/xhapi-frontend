export default [
  {path: '/', name: '主页', icon: 'smile', component: './Index'},
  {
    path: '/interface_info/:id',
    name: '查看接口',
    icon: 'smile',
    component: './InterfaceInfo',
    hideInMenu: true,
  },
  {
    path: '/admin',
    icon: 'crown',
    access: 'canAdmin',
    name: '管理员页面',
    routes: [
      {
        name: '用户管理',
        icon: 'table',
        path: '/admin/user',
        component: './Admin/User',
      },
      {
        name: '接口管理',
        icon: 'table',
        path: '/admin/interface_info',
        component: './Admin/InterfaceInfo',
      },
      {
        name: '接口分析',
        icon: 'analysis',
        path: '/admin/interface_analysis',
        component: './Admin/InterfaceAnalysis',
      },
    ],
  },
  {
    name: '登录',
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './User/Login'},
      {name: '注册', path: '/user/register', component: './User/Register'}
    ],
  },
  {path: '*', layout: false, component: './404'},
];

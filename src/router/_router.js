const _import = require('./_import');
import Layout from '@/page/index/'

export default [{
  path: '/',
  name: '主页',
  redirect: '/wel'
}, {
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '控制台',
    component: _import('wel')
  }]
}, {
  path: '*',
  redirect: '/404',
  hidden: true
}, {
  path: '/login',
  name: '登录页',
  component: _import('login/index')
}, {
  path: '/lock',
  name: '锁屏页',
  component: _import('lock/index')
}, 
// {
//   path: '/crud',
//   component: Layout,
//   redirect: '/crud/index',
//   children: [{
//     path: 'index',
//     name: 'crud实例',
//     component: _import('crud/index', 'views')
//   }]
// }, 
{
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '修改信息',
    component: _import('admin/user/info', 'views')
  },{
    path: '/serve/myserve',
    name: '我的服务',
    component: _import('admin/serve/myserve/index', 'views'),
    children:[
      {
        path: '/serve/myserve/sms',
        name: '短信通知',
        component: _import('admin/serve/myserve/sms', 'views')
      },
      {
        path: '/serve/myserve/pay',
        name: '支付',
        component: _import('admin/serve/myserve/pay', 'views')
      }
    ]
  },{
    path: '/serve/buy',
    name: '购买记录',
    component: _import('admin/serve/buy/index', 'views')
  },{
    path: '/serve/record',
    name: '开票记录',
    component: _import('admin/serve/record/index', 'views'),
  },{
    path: '/serve/setting',
    name: '开票设置',
    component: _import('admin/serve/setting/index', 'views'),
  },
  ]
},
{
  path: '/404',
  component: _import('error-page/404', 'components'),
  name: '404'
}, {
  path: '/403',
  component: _import('error-page/403', 'components'),
  name: '403'
}, {
  path: '/500',
  component: _import('error-page/500', 'components'),
  name: '500'
}, {
  path: '/myiframe',
  component: Layout,
  redirect: '/myiframe',
  meta: {
    keepAlive: true
  },
  children: [{
    path: ':routerPath',
    name: 'iframe',
    component: _import('iframe/main', 'components'),
    props: true
  }]
}]

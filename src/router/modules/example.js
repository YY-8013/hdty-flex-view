/**
 * 静态路由配置示例
 */

/*// 引入主布局组件
import Layout from '@/relies/layout/Layout';
// 加载组件文件
const _import = require('@/router/_import_' + process.env.NODE_ENV);

export default {
  path: '/example',  // 路径
  name: 'Example', // 名称
  meta: { // 元数据
    title: '示例' // 标题
  },
  component: Layout,  // 组件
  redirect: '', // 重定向
  children: [ // 子路由
    {
      path: '/example/1', // 路径
      name: 'Example1', // 名称
      meta: { // 元数据
        title: '示例1',  // 标题
        keepAlive: true,  // 缓存
        loosened: false,  // 放行
        viewType: '20', // 路由视图（数据字典1024）
        linkType: '10', // 跳转方式（数据字典1025）
        params: {}  // 参数
      },
      component: _import('views/example/Example1'), // 组件
      redirect: '', // 重定向
    }
  ]
}*/

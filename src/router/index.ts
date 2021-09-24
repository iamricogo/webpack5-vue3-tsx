import { createRouter, createWebHashHistory } from 'vue-router'
import Layout from '@/layout'
// 路由懒加载
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: { name: 'home' } },
    {
      path: '/home',
      component: Layout,
      redirect: '/home/index',
      meta: {
        title: 'home'
      },
      children: [
        {
          name: 'home',
          path: 'index',
          component: () => import('@/views/home'),
          meta: {
            title: 'home'
          }
        },
        {
          name: 'others',
          path: 'others',
          component: () => import('@/views/others/index.vue'),
          meta: {
            title: 'others'
          }
        }
      ]
    }
  ]
})

export default router

import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/home/HomeIndex.vue')
  },

  {
    path: '/shop/:id',
    name: 'ShopDetail',
    component: () =>
      import(/* webpackChunkName: "shop" */ '../views/shop/ShopDetail.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

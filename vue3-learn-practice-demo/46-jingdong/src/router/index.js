import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'homeIndex',
    component: () =>
      import(/* webpackChunkName: "home" */ '../views/home/HomeIndex.vue')
  },
  {
    path: '/shop/:id',
    name: 'ShopDetail',
    component: () =>
      import(/* webpackChunkName: "shop" */ '../views/shop/ShopDetail.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "shop" */ '../views/login/Login.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router

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
    path: '/orderConfirmation/:id',
    name: 'OrderConfirmation',
    component: () =>
      import(
        /* webpackChunkName: "shopConfirmation" */ '../views/orderConfirmation/Index.vue'
      )
  },
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "user" */ '../views/login/Login.vue'),
    beforeEnter: (to, from, next) => {
      const { isLogin } = localStorage
      isLogin ? next({ path: '/' }) : next()
    }
  },
  {
    path: '/register',
    name: 'register',
    component: () =>
      import(/* webpackChunkName: "user" */ '../views/login/Register.vue'),
    beforeEnter: (to, from, next) => {
      const { isLogin } = localStorage
      isLogin ? next({ path: '/' }) : next()
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})
router.beforeEach((to, from, next) => {
  const { isLogin } = localStorage
  isLogin || to.name === 'login' || to.name === 'register'
    ? next()
    : next({ name: 'login' })
})

export default router

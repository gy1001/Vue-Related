// vueRouter实现原理解析（从零实现一个简易版的vueRouter）:https://blog.csdn.net/weixin_42707287/article/details/121019812
let _Vue = null
export default class VueRouter {
  static install(Vue) {
    // 判断插件是否注册过，如果未注册，走注册流程
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 用一个变量存储一下Vue, 方便后面在其他函数中使用
    _Vue = Vue
    // Vue.prototype.$router = this.$options.router
    // 为什么不能直接在Vue的原型对象上挂载$router呢，因为在当前函数中，this指向的是并不是vue实例，故this.$options是不存在的
    // 故我们通过混入的形式，在 vue 实例的 beforeCreate生命周期中去给vue原型添加$router
    Vue.mixin({
      beforeCreate() {
        if (Vue.prototype.$router) {
          return
        }
        Vue.prototype.$router = this.$options.router
      },
    })
  }

  constructor(options) {
    this.mode = options.mode || 'hash'
    // 实现routerMap（用于存储路由与组件的映射关系）
    this.routerMap = {}

    this.createRouteMap(options.routes || [])

    // 定义一个响应式对象，当后续current的值发生变化时，vue可以监测到
    this.data = _Vue.observable({
      current: this.mode === 'history' ? '/' : '#/', // 存放当前url地址
    })

    // 注册全局组件
    this.initComponent()
  }

  createRouteMap(routes, parentPath) {
    if (routes && routes.length && routes.length > 0) {
      routes.forEach((item) => {
        let currentPath = ''
        if (parentPath && item.path.indexOf('/') === -1) {
          currentPath = `${parentPath}/${item.path}`
        } else {
          currentPath = item.path
        }
        this.routerMap[currentPath] = item.component
        if (item.children && item.children.length > 0) {
          this.createRouteMap(item.children, currentPath)
        }
      })
    }
  }

  initComponent() {
    // 初始化router-link组件
    this.initLink()

    // 初始化router-view组件
    this.initView()
  }

  initLink() {}

  initView() {}
}

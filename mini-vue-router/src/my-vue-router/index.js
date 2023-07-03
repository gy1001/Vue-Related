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

  initLink() {
    _Vue.component('router-link', {
      props: {
        to: String,
      },
      render(h) {
        return h(
          'a',
          {
            attrs: { href: this.to },
            on: {
              click: this.locationHref,
            },
          },
          [this.$slots.default],
        )
      },
      methods: {
        locationHref(e) {
          // 阻止a标签默认事件，这里需要阻止a标签的href跳转，因为a标签的href跳转是会让浏览器直接向服务器去发送请求的
          e.preventDefault()
          if (this.$router.mode === 'history') {
            console.log('TODO history')
          } else {
            window.location.hash = `#${this.to}`
            this.$router.data.current = `#${this.to}`
          }
        },
      },
    })
  }

  initView() {
    const that = this
    _Vue.component('router-view', {
      render(h) {
        // 从路由表中获取当前path对应的component组件
        let component = null
        if (this.$router.mode === 'history') {
          console.log('TODO history')
        } else {
          // hash 模式下，截图#后面的地址作为path路径，然后再去路由表中匹配对应的组件
          const path = that.data.current.slice(1, that.data.current.length)
          component = that.routerMap[path]
        }
        // 渲染对应的组件
        return h(component)
      },
    })
  }
}

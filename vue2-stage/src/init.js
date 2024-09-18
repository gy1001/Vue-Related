import { initState } from './state'
import { compilerToFunction } from './compiler/index'
// 就是给 Vue 添加 Init 方法
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // 用户初始化操作
    // vm vm.$options 就是获取用户的配置

    // 我们使用的 vue 的时候 $nextTIck $data $attr 。。。
    const vm = this
    vm.$options = options // 将用户的选项挂载到实例上

    // 初始化状态
    initState(vm)

    if (options.el) {
      vm.$mount(options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    const options = vm.$options
    // 先查找有没有 render 函数
    if (!options.render) {
      // 没有写模板 但是写了 el
      if (!options.template && el) {
        options.template = el.outerHTML
      }
    }

    if (options.template) {
      // 这里需要对模板进行编译
      const render = compilerToFunction(options.template)
      options.render = render // 最终可以获取 render 方法
      // script 标签使用的 vue.global.js 这个编译过程是在浏览器中运行的

      // runtime 是不包含模板编译的，整个编译过程是打包的过程中和通过 loader 来转译 .vue 文件，用runtime 的时候不能使用 template 属性
    }

    // 最终就可以获取 render 函数
  }
}

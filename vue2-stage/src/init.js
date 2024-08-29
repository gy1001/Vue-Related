import { observe } from './observe'

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
  }
}

function initState(vm) {
  const opts = vm.$options // 获取所有的选项

  if (opts.data) {
    initData()
  }
}

function initData(vm) {
  let data = vm.$options.data

  data = typeof data === 'function' ? data.call(this) : data

  // 对数据进行劫持
  // vue2 中采用了一个 api defineProperty
  observe(data)
}

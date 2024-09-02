import { observe } from './observe/index'

export function initState(vm) {
  const opts = vm.$options // 获取所有的选项
  if (opts.data) {
    initData(vm)
  }
}

function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(this) : data

  // 对数据进行劫持
  // vue2 中采用了一个 api defineProperty
  vm._data = data
  observe(data)

  // 将 vm._data 用 vm 来代理了

  for (let key in data) {
    proxy(vm, '_data', key)
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]
    },
    set(newValue) {
      vm[target][key] = newValue
      if (typeof newValue === 'object') {
        // 如果是对象
      }
    },
  })
}

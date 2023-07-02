import { getCurrentInstance, inject, effectScope } from 'vue'
import { SymbolPinia } from './rootStore'

export function defineStore(idOrOptions: any, setup?: any) {
  let id: string
  let options: any
  if (typeof idOrOptions === 'string') {
    id = idOrOptions
    options = setup
  } else {
    options = idOrOptions
    id = idOrOptions.id
  }

  function createOptionsStore(id: string, options: any, pinia: any) {
    // createOptionsStore拿到用户传的state、getters、actions
    const { state, actions, getters } = options
    let scope
    function setup() {}

    // 我们要让外面的effectScope能够停止所有的store，也要让每个store能停止自己
    pinia._e.run(() => {
      scope = effectScope()
      return scope.run(() => setup())
    })
  }

  function useStore() {
    const currentInstance = getCurrentInstance()

    // 注册了一个 store
    // 为了保证useStore在组件内部使用，那么我们需要通过判断currentInstance来保证useStore在组件内部使用ore
    const pinia: any = currentInstance && inject(SymbolPinia)
    // 看一下pinia上有没有这个store，如果没有，说明是第一次使用这个store，
    // 那么我们就去创建一个调用createOptionsStore去创建一个store
    if (!pinia._s.has(id)) {
      createOptionsStore(id, options, pinia)
    }
  }

  // 返回useStore函数，内部注册一个Store
  return useStore
}

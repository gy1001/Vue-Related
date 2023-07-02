import { getCurrentInstance, inject, effectScope, reactive } from 'vue'
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
    const store = reactive({})
    function setup() {
      pinia.state[id] = state ? state() : {}
      const localState = pinia.state[id]
      return localState
    }

    // _e 能停止所有的 scope
    // 每一个 store 还能停止自己的
    // 我们要让外面的effectScope能够停止所有的store，也要让每个store能停止自己
    const setupStore = pinia._e.run(() => {
      scope = effectScope()
      return scope.run(() => setup())
    })

    // setupStore
    Object.assign(store, setupStore)

    pinia._s.set(id, store)
    console.log(store)
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
    const store = pinia._s.get(id)
    return store
  }

  // 返回useStore函数，内部注册一个Store
  return useStore
}

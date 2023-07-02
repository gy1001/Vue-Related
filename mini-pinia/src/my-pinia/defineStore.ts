import {
  getCurrentInstance,
  inject,
  effectScope,
  reactive,
  computed,
} from 'vue'
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
      const gettersValue = Object.keys(getters || {}).reduce(
        (computedGetters: any, name) => {
          computedGetters[name] = computed(() => {
            // 计算属性具有缓存的性质
            // 我们需要获取当前的 store 是谁
            return getters[name].call(store, store)
          })
          return computedGetters
        },
        {},
      )
      console.log(gettersValue)
      return Object.assign(localState, actions, gettersValue) // 这个地方的装填还要扩展
    }

    // _e 能停止所有的 scope
    // 每一个 store 还能停止自己的
    // 我们要让外面的effectScope能够停止所有的store，也要让每个store能停止自己
    const setupStore = pinia._e.run(() => {
      scope = effectScope()
      return scope.run(() => setup())
    })

    function wrapAction(name: string, action: Function) {
      return function () {
        // 触发 action 的时候，可以触发一些额外的逻辑
        // actions里面有this问题，所以我们要处理actions的方法里的this
        let result = action.apply(store, arguments)
        // 返回值也可以做处理
        return result
      }
    }

    for (let key in setupStore) {
      const prop = setupStore[key] // 拿到对应的值
      if (typeof prop === 'function') {
        setupStore[key] = wrapAction(key, prop) // 对 action 可以进行扩展 Aop 思想
      }
    }

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

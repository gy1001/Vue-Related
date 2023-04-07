import { mutableHandlers } from "./baseHandlers"
import { isObject } from "@vue/shared"
/**
 * 响应性 Map 缓存对象
 * key: target
 * val: proxy
 */
export const reactiveMap = new WeakMap<object, any>()
/**
 * 创建响应性对象
 * @param target  被代理对象
 * @param baseHandlers handlder
 * @param proxyMap 代理对象
 * @returns 
 */
function createReactiveOject(target: object, baseHandlers: ProxyHandler<any>, proxyMap: WeakMap<object, any>) {
  // 如果该实例已经被代理，则直接读取即可
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }
  // 未被代理则生成 proxy 实例
  const proxy = new Proxy(target, baseHandlers)
  proxy[ReactiveFlags.IS_REACTIVE] = true // 增加这一行代码标识
  // 缓存该对象
  proxyMap.set(target, proxy)
  return proxy
}

/**
 * 为复杂数据类型，创建响应性对象
 * @param target 被代理对象
 * @returns 代理对象
 */
export function reactive(target: object) {
  return createReactiveOject(target, mutableHandlers, reactiveMap)
}

export const toReactive = <T extends unknown>(value: T): T => {
  return isObject(value) ? reactive(value as object) : value
}

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive"
}
export function isReactive(value): boolean {
  return !!(value && value[ReactiveFlags.IS_REACTIVE] === true)
}
import { track, trigger } from "./effect"

const get = createGetter()
const set = createSetter()


/**
 * 响应性的 handler
 */
export const mutableHandlers: ProxyHandler<object> = {
  set,
  get
}


function createGetter() {
  return function get(target: object, key: string | symbol, receiver: object) {
    const res = Reflect.get(target, key, receiver)
    // 这里进行依赖收集
    track(target, key)
    return res
  }
}

function createSetter() {
  return function set(target: object, key: string | symbol, newValue: unknown, receiver: object) {
    const result = Reflect.set(target, key, newValue, receiver)

    trigger(target, key, newValue)
    return result
  }
}
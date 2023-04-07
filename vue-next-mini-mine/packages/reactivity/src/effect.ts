import { isArray } from '@vue/shared'
import { ComputedRelImpl } from './computed'
import { createDep, Dep } from './dep'
import { extend } from '@vue/shared'
type keyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, keyToDepMap>()

/**
 * 收集依赖
 * @param target 
 * @param key 
 */
export function track(target: object, key: unknown) {
  console.log("track:收集依赖")
  if (!activeEffect) {
    return
  }
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, depsMap = new Map())
  }
  let deps = depsMap.get(key)
  if (!deps) {
    depsMap.set(key, deps = createDep())
  }
  trackEffects(deps)
}
/**
 * 利用 dep 依次追踪指定 key 的所有 effect
 * @param dep 
 */
export function trackEffects(deps: Dep) {
  if (activeEffect) {
    deps.add(activeEffect)
  }
}

export function trigger(target: object, key: unknown, newValue: unknown) {
  console.log("trigger:触发依赖")
  const desMap = targetMap.get(target)
  if (!desMap) { return }
  const deps: Dep | undefined = desMap.get(key)
  if (!deps) return
  triggerEffects(deps)
}
/**
 *  依次触发 dep 中 保存的依赖
 * @param deps 
 */
export function triggerEffects(deps: Dep) {
  // 依赖项目集合是否是数组，不是就变为一个数据，
  const effects = isArray(deps) ? deps : [...deps]
  // 使用两个 for  循环，来顺序执行相关依赖即可
  effects.forEach(effect => {
    if (effect.computed) {
      triggerEffect(effect)
    }
  })
  effects.forEach(effect => {
    if (!effect.computed) {
      triggerEffect(effect)
    }
  })
}

export function triggerEffect(effect: ReactiveEffect) {
  if (effect.scheduler) {
    effect.scheduler()
  } else {
    effect.fn()
  }
}
export let activeEffect: ReactiveEffect | undefined
export interface ReactiveEffectOptions {
  lazy?: boolean
  scheduler?: EffectScheduler
}
/**
 * effect 函数
 * @param fn 执行方法
 * @returns 以 ReactiveEffect 实例为 this 的执行函数
 */
export function effect<T = any>(fn: () => T, options?: ReactiveEffectOptions) {
  // 生成 ReactiveEffect 函数
  const _effect = new ReactiveEffect(fn)
  if (options) {
    extend(_effect, options) // 增加合并代码
  }
  if (!options || !options.lazy) {
    _effect.run()
  }
}

export type EffectScheduler = (...args: any[]) => any
export class ReactiveEffect<T = any> {
  computed?: ComputedRelImpl<T>
  constructor(public fn: () => T, public scheduler: EffectScheduler | null = null) {
    this.fn = fn
  }
  run() {
    activeEffect = this
    return this.fn()
  }

  stop() {
    console.log("TODO ReactiveEffect.stop")
  }
}
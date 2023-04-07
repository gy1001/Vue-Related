import { hasChanged } from '@vue/shared'
import { createDep, Dep } from "./dep"
import { activeEffect, trackEffects, triggerEffects } from './effect'
import { toReactive } from './reactive'
export interface Ref<T = any> {
  value: T
}

export function ref(value?: unknown) {
  return createRef(value, false)
}

function createRef(rawValue: unknown, shallow: boolean) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

export function trackRefValue(ref) {
  if (activeEffect) {
    trackEffects(ref.dep || (ref.dep = createDep()))
  }
}

export function isRef(rawValue: any): rawValue is Ref {
  return !!(rawValue && rawValue.__v_isRef === true)
}

class RefImpl<T> {
  private _value: T
  public dep?: Dep = undefined
  public readonly __v_isRef = true
  private _rawValue: T
  constructor(value: T, public readonly __v_isShallow: boolean) {
    this._rawValue = value
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    console.log("触发get value ")
    trackRefValue(this)
    return this._value
  }
  set value(newValue) {
    if (hasChanged(newValue, this._rawValue)) {
      console.log("触发set value")
      this._rawValue = newValue
      this._value = toReactive(newValue)
      triggerRefValue(this)
    }
  }
}

export function triggerRefValue(ref) {
  if (ref.dep) {
    triggerEffects(ref.dep)
  }
}
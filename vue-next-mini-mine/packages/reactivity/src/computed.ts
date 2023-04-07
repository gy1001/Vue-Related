import { isFunction } from '@vue/shared'

import { Dep } from './dep'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

export function computed(getterOrOptions) {
  let getter
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions
  }

  const cRef = new ComputedRelImpl(getter)
  return cRef
}

export class ComputedRelImpl<T> {
  public dep?: Dep = undefined
  private _value!: T
  private readonly effect: ReactiveEffect<T>
  public readonly __v_isRef = true
  public _dirty = true
  constructor(getter) {
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
        triggerRefValue(this)
      }
    })
    this.effect.computed = this
  }
  get value() {
    trackRefValue(this)
    if (this._dirty) {
      this._dirty = false
      this._value = this.effect.run()
    }
    return this._value
  }
}
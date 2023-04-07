import { VNode } from 'packages/runtime-core/src/vnode'

export const isArray = Array.isArray
export function isObject(value: unknown): boolean {
  return value !== null && typeof value === 'object'
}
export const hasChanged = (newValue: unknown, oldValue: unknown) => {
  return !Object.is(newValue, oldValue)
}

export function isFunction(value: unknown): boolean {
  return typeof value === 'function'
}

export const extend = Object.assign

export const EMPTY_OBJ: { readonly [key: string]: any } = {}

export const isString = (val: unknown): val is string => typeof val === 'string'

export { normalizeClass } from './normalProp'

const ONRE = /^on[^a-z]/
export const isOn = (key: string): boolean => ONRE.test(key)

export const isSameVNodeType = (n1: VNode, n2: VNode) => {
  return n1.key === n2.key && n1.type === n2.type
}
export { toDisplayString } from './toDisplayString'

import { arrayMethods } from './array'
import defineReactive from './defineReactive'
import observe from './observe'
import { def } from './utils'
import Dep from './Dep'

const hasProto = '__proto__' in {}
const arrayKeys = Object.getOwnPropertyNames(arrayMethods)
// arrayKeys:  ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']

export default class Observer {
  constructor(value) {
    // 每一个 Observer 的实例上，都有一个dep实例
    this.dep = new Dep()
    // 给实例(this,一定要注意，构造函数中的this不是类本身，而是表示实例)添加了 __ob__属性，值是这次new的实例
    def(value, '__ob__', this, false)
    // 如果类型是数组，要讲这个数组的原型指向新创建的 arrayMethods
    if (Array.isArray(value)) {
      handleWithArray(value)
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  // 遍历
  walk(value) {
    for (const key in value) {
      defineReactive(value, key, value[key])
    }
  }

  // 侦测数组中的每一项
  observeArray(items) {
    for (let index = 0, l = items.length; index < l; index++) {
      observe(items[index])
    }
  }
}

function handleWithArray(value) {
  // 实际上直接替换即可，但是源码中做了一个兼容处理。某些浏览器可能不支持 __proto__
  // value.__proto__ = arrayMethods
  // 以下代码为兼容处理
  const augment = hasProto ? protoAugment : copyAugment
  augment(value, arrayMethods, arrayKeys)
}

function protoAugment(target, src) {
  target.__proto__ = src
}

function copyAugment(target, src, keys) {
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index]
    def(target, key, src[key])
  }
}

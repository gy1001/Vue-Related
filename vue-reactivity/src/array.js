import { def } from './utils'

const arrayProperty = Array.prototype
export const arrayMethods = Object.create(arrayProperty)

const needChangeMethods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse',
]

needChangeMethods.forEach((methodName) => {
  // 备份原来的方法
  const original = arrayProperty[methodName]
  // 定义新的方法
  def(
    arrayMethods,
    methodName,
    function (...args) {
      const result = original.apply(this, args)
      const ob = this.__ob__
      console.warn('数组拦截器被拦截了', methodName)
      // 有三种方法：push/unshift/splice 能够插入新项，要把插入的新项也变为响应式
      let insertedItems
      switch (methodName) {
        case 'push':
        case 'unshift':
          insertedItems = args
          break
        case 'splice':
          insertedItems = args.slice(2)
          break
      }
      if (insertedItems) ob.observeArray(insertedItems)
      return result
    },
    false
  )
})

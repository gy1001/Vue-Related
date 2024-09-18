// 我们需要重写数组中的部分

// import {observe} from "./index";

const oldArrayPrototype = Array.prototype // 获取数组的原型
// newArrayPrototype.__proto__ = oldArrayPrototype
export const newArrayPrototype = Object.create(oldArrayPrototype)
// 找出所有的的变异方法
const methods = ['push', 'splice', 'pop', 'shift', 'unshift', 'sort', 'splice']
// 注意：concat slice 都不会改变原有数组

methods.forEach((method) => {
  // 这里重写了数组的方法，内部调用原来的方法，可以说是函数的劫持，切片编程
  newArrayPrototype[method] = function (...args) {
    const result = oldArrayPrototype[method].apply(this, args)
    // 我们需要对新增的数据再次进行劫持
    let insertedValue
    let ob = this.__ob__
    switch (method) {
      case 'push': // arr.push(1,2,3)
      case 'unshift': // arr.unshift(1,2,3)
        insertedValue = args
        break
      case 'splice': // arr.splice()
        insertedValue = args.slice(2) // 从索引得2的开始复制一份
        break
    }

    console.log('insertedValue: ', insertedValue)
    if (insertedValue) {
      // observe(insertedValue) // 疑问：为什么这里不使用 observe 直接处理数据，猜测是因为性能问题
      ob.observerArray(insertedValue)
    }
    return result
  }
})

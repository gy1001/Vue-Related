class Observer {
  constructor(data) {
    // Object.defineProperty 只能劫持已经存在的属性，后增的或者删除的不知道
    // vue2 里面会为此单独写一些 api $set $delete
    if (Array.isArray(data)) {
      // 这里我们可以重写数组中的7个变异方法，是可以修改数组本身的
    } else {
      this.walk(data)
    }
  }

  walk(data) {
    // 循环对象，对属性依次进行劫持

    // “重新定义”属性
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }
}

// 这里有闭包
export function defineReactive(target, key, value) {
  // 属性劫持
  // 如果是对象，再次进行深度遍历响应
  observe(value)
  Object.defineProperty(target, key, {
    get() {
      // 取值的时候，会执行 get
      return value
    },
    set(newValue) {
      // 修改的时候，会执行 set
      if (newValue === value) {
        return
      }
      value = newValue
      observe(value)
    },
  })
}

export function observe(data) {
  if (typeof data !== 'object' || !data) {
    return // 只对对象进行劫持
  }
  // 如果一个对象已经被劫持过了，那就不需要再劫持了
  // 要判断一个对象是否被劫持过，可以添加一个实例，用实例来判断是否被劫持成功

  return new Observer(data)
}

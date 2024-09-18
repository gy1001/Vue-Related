import { newArrayPrototype } from './array'
class Observer {
  constructor(data) {
    // Object.defineProperty 只能劫持已经存在的属性，后增的或者删除的不知道
    // vue2 里面会为此单独写一些 api $set $delete
    // 注意，因为这里加了 __ob__属性，所以下面 walk 遍历的时候就会遍历这个属性 __ob__ 然后再执行 observer(this), 会重新增加 __ob__属性，再次遍历 __ob__ 死循环了
    // 所以这个属性 __ob__ 必须是不可遍历的
    // data.__ob__ = this; // 给数据增加一个标识，如果数据上有 __ob__ 则说明这个属性被观测过了，不能直接添加，会造成死循环
    Object.defineProperty(data, '__ob__', {
      value: this,
      configurable: false, // 将 __ob__变为不可遍历的，从而循环遍历时就不可枚举了，解决了死循环的问题
    })
    if (Array.isArray(data)) {
      // 这里我们可以重写数组中的7个变异方法，是可以修改数组本身的
      data.__proto__ = newArrayPrototype
      this.observerArray(data) // 如果数组中有对象，也需要被劫持
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

  observerArray(data) {
    // 把里面的对象变为响应式
    data.forEach((item) => {
      observe(item)
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
      console.log('key: ', key)
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
  if (data.__ob__ instanceof Observer) {
    // 如果对象身上有这个实例，说明这个对象已经被代理过了
    return data.__ob__
  }
  return new Observer(data)
}
